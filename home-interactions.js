(function () {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const internalLinks = "a[href]:not([target]):not([download])";

  document.documentElement.classList.add("page-enter");

  const markReady = () => {
    document.documentElement.classList.add("is-ready");
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", markReady, { once: true });
  } else {
    markReady();
  }

  if (!reduceMotion) {
    document.addEventListener("click", (event) => {
      const link = event.target.closest(internalLinks);
      if (!link || event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const targetUrl = new URL(link.href, window.location.href);
      if (targetUrl.origin !== window.location.origin) return;
      if (targetUrl.pathname === window.location.pathname && targetUrl.hash) return;

      event.preventDefault();
      document.documentElement.classList.add("is-leaving");
      window.setTimeout(() => {
        window.location.href = targetUrl.href;
      }, 260);
    });
  }

  const home = document.querySelector(".pdf-exact-home");
  if (!home) return;

  const contactOpenButtons = document.querySelectorAll("[data-contact-open]");
  const contactModal = document.querySelector("[data-contact-modal]");
  const contactCloseButtons = document.querySelectorAll("[data-contact-close]");
  let lastContactTrigger = null;

  if (contactOpenButtons.length && contactModal) {
    const closeContact = () => {
      if (!contactModal.classList.contains("is-open")) return;
      contactModal.classList.remove("is-open");
      window.setTimeout(() => {
        contactModal.hidden = true;
        lastContactTrigger?.focus({ preventScroll: true });
      }, reduceMotion ? 0 : 260);
    };

    const openContact = () => {
      lastContactTrigger = document.activeElement;
      contactModal.hidden = false;
      requestAnimationFrame(() => {
        contactModal.classList.add("is-open");
        contactModal.querySelector(".contact-modal-close")?.focus({ preventScroll: true });
      });
    };

    contactOpenButtons.forEach((button) => button.addEventListener("click", openContact));
    contactCloseButtons.forEach((button) => button.addEventListener("click", closeContact));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeContact();
    });
  }

  const homeVideoButtons = document.querySelectorAll("[data-home-video-open]");
  const homeVideoModal = document.querySelector("[data-home-video-modal]");
  const homeVideoPlayer = document.querySelector("[data-home-video-player]");
  const homeVideoCloseButtons = document.querySelectorAll("[data-home-video-close]");

  if (homeVideoButtons.length && homeVideoModal && homeVideoPlayer) {
    const closeHomeVideo = () => {
      if (!homeVideoModal.classList.contains("is-open")) return;
      homeVideoModal.classList.remove("is-open");
      homeVideoPlayer.pause();
      try {
        homeVideoPlayer.currentTime = 0;
      } catch (error) {
        // Some browsers disallow seeking until metadata is loaded.
      }
      homeVideoPlayer.removeAttribute("src");
      homeVideoPlayer.removeAttribute("poster");
      homeVideoPlayer.src = "";
      homeVideoPlayer.load();
      window.setTimeout(() => {
        homeVideoModal.hidden = true;
      }, reduceMotion ? 0 : 240);
    };

    const openHomeVideo = (button) => {
      const videoSrc = button.dataset.videoSrc;
      if (!videoSrc) return;
      homeVideoPlayer.src = videoSrc;
      homeVideoPlayer.poster = button.dataset.videoPoster || "";
      homeVideoPlayer.muted = true;
      homeVideoModal.hidden = false;
      requestAnimationFrame(() => {
        homeVideoModal.classList.add("is-open");
        homeVideoPlayer.load();
        homeVideoPlayer.play().catch(() => {});
      });
    };

    homeVideoButtons.forEach((button) => {
      button.addEventListener("click", () => openHomeVideo(button));
    });
    homeVideoCloseButtons.forEach((button) => button.addEventListener("click", closeHomeVideo));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeHomeVideo();
    });
  }

  const revealItems = [
    ".about-left",
    ".about-jobs article",
    ".about-portfolio-link",
    ".selected-film-card",
    ".categories-head",
    ".category-card",
    ".contact-html-page > div",
  ];

  document.querySelectorAll(revealItems.join(",")).forEach((item) => {
    item.classList.add("reveal-item");
  });

  if (reduceMotion || !("IntersectionObserver" in window)) {
    document.querySelectorAll(".reveal-item").forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.16,
      rootMargin: "0px 0px -8% 0px",
    }
  );

  document.querySelectorAll(".reveal-item").forEach((item) => observer.observe(item));

  const nav = document.querySelector(".site-nav");
  if (!nav) return;

  const navLinks = [...nav.querySelectorAll('a[href^="#"]')];
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if (!sections.length) return;

  const navObserver = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;

      navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${visible.target.id}`);
      });
    },
    { threshold: [0.35, 0.6] }
  );

  sections.forEach((section) => navObserver.observe(section));
})();
