(function () {
  const data = window.WORKS_GALLERY_DATA || { categories: [], works: [] };
  const params = new URLSearchParams(window.location.search);
  const categoryGroups = {
    "booklet-deck": ["booklet-deck", "kusa"],
  };

  const qs = (selector, root = document) => root.querySelector(selector);
  const qsa = (selector, root = document) => [...root.querySelectorAll(selector)];

  const getCategoryIds = (categoryId) => categoryGroups[categoryId] || [categoryId];
  const normalizeCategory = (categoryId) => {
    if (!categoryId || categoryId === "all") return "all";
    return Object.entries(categoryGroups).find(([, ids]) => ids.includes(categoryId))?.[0] || categoryId;
  };
  const getActiveCategory = () => normalizeCategory(params.get("category"));
  const getOrder = (work) => (Number.isFinite(work.order) ? work.order : 0);
  const getThumbSrc = (work) => `assets/portfolio-thumbs/${encodeURIComponent(work.id).replace(/%/g, "_")}.jpg?v=3`;
  const sortForGallery = (works) =>
    works
      .map((work, index) => ({ work, index }))
      .sort((a, b) => getOrder(a.work) - getOrder(b.work) || a.index - b.index)
      .map((item) => item.work);

  function renderGallery() {
    const grid = qs("[data-gallery-grid]");
    const filter = qs("[data-gallery-filter]");
    if (!grid || !filter) return;

    const active = getActiveCategory();
    const categories = [
      { id: "all", index: "", en: "All", zh: "全部" },
      ...data.categories.filter((category) => category.id !== "kusa"),
    ];
    filter.innerHTML = categories
      .map(
        (category) =>
          `<button class="${active === category.id ? "is-active" : ""}" type="button" data-category="${category.id}">
            <span class="gallery-filter-meta">
              ${category.index ? `<span>${category.index}</span>` : ""}
              <span>${category.en || category.zh}</span>
            </span>
            <span class="gallery-filter-name">${category.zh}</span>
          </button>`
      )
      .join("");

    const render = (categoryId, animate = false) => {
      const categoryIds = getCategoryIds(categoryId);
      const updateGrid = () => {
        const works = sortForGallery(
          data.works.filter((work) => categoryId === "all" || categoryIds.includes(work.category))
        );
        grid.innerHTML = works
          .map((work) => {
            const imageIndex = Math.max(0, work.images.indexOf(work.cover));
            const categoryParam = categoryId !== "all" ? `&category=${encodeURIComponent(categoryId)}` : "";
            return `
            <a class="masonry-item" href="detail.html?id=${encodeURIComponent(work.id)}&image=${imageIndex}${categoryParam}" aria-label="查看作品">
              <img src="${getThumbSrc(work)}" alt="" loading="lazy" decoding="async">
            </a>`;
          })
          .join("");
        if (animate) requestAnimationFrame(() => grid.classList.remove("is-switching"));
      };

      if (!animate) {
        updateGrid();
        return;
      }

      grid.classList.add("is-switching");
      window.setTimeout(updateGrid, 90);
    };

    render(active);
    qsa("[data-category]", filter).forEach((button) => {
      button.addEventListener("click", () => {
        const categoryId = button.dataset.category;
        qsa("[data-category]", filter).forEach((item) => item.classList.remove("is-active"));
        button.classList.add("is-active");
        render(categoryId, true);
        const nextUrl = categoryId === "all" ? "works.html" : `works.html?category=${encodeURIComponent(categoryId)}`;
        history.replaceState(null, "", nextUrl);
      });
    });
  }

  function renderDetail() {
    const page = qs("[data-detail-page]");
    if (!page) return;

    const id = params.get("id");
    const work = data.works.find((item) => item.id === id);
    const stage = qs(".detail-stage");
    const prev = qs("[data-detail-prev]");
    const next = qs("[data-detail-next]");
    const back = qs(".detail-back");
    const thumbs = qs("[data-detail-thumbs]");
    if (!stage || !prev || !next || !back || !thumbs) return;

    const fromCategory = params.get("category");
    back.href = fromCategory ? `works.html?category=${encodeURIComponent(fromCategory)}` : "works.html";
    if (!work) {
      stage.innerHTML = `<p class="detail-empty">作品不存在或已下架。</p>`;
      prev.disabled = true;
      next.disabled = true;
      thumbs.hidden = true;
      page.classList.add("is-single");
      return;
    }

    const isVideo = work.mediaType === "video" || work.type === "video";

    if (isVideo) {
      stage.innerHTML = work.videoSrc
        ? `<video class="detail-video" src="${work.videoSrc}" poster="${getThumbSrc(work)}" controls playsinline preload="metadata">当前浏览器无法播放此视频。</video>`
        : `<p class="detail-empty">视频文件暂未找到。</p>`;
      prev.disabled = true;
      next.disabled = true;
      thumbs.hidden = true;
      page.classList.add("is-single", "is-video");
      const video = qs(".detail-video", stage);
      if (video) {
        video.addEventListener("error", () => {
          stage.innerHTML = `<p class="detail-empty">视频文件加载失败，请检查视频路径。</p>`;
        });
      }
      return;
    }

    const requestedImage = Number(params.get("image"));
    let current = Number.isInteger(requestedImage) && requestedImage >= 0 && requestedImage < work.images.length ? requestedImage : 0;
    const isSeries = work.images.length > 1;

    const update = () => {
      let image = qs("[data-detail-image]", stage);
      if (!image) {
        stage.innerHTML = `<img alt="" data-detail-image />`;
        image = qs("[data-detail-image]", stage);
      }
      image.decoding = "async";
      image.src = work.images[current];
      prev.disabled = !isSeries || current === 0;
      next.disabled = !isSeries || current === work.images.length - 1;
      page.classList.toggle("is-single", !isSeries);
      page.classList.remove("is-video");
      thumbs.hidden = !isSeries;
      qsa("[data-thumb-index]", thumbs).forEach((button) => {
        const selected = Number(button.dataset.thumbIndex) === current;
        button.classList.toggle("is-active", selected);
        button.setAttribute("aria-current", selected ? "true" : "false");
        if (selected) button.scrollIntoView({ block: "nearest", inline: "nearest" });
      });
    };

    thumbs.innerHTML = isSeries
      ? work.images
          .map(
            (src, index) => `
            <button class="detail-thumb" type="button" data-thumb-index="${index}" aria-label="查看第 ${index + 1} 张">
              <span>${index + 1}</span>
              <img src="${src}" alt="" loading="lazy" decoding="async">
            </button>`
          )
          .join("")
      : "";

    qsa("[data-thumb-index]", thumbs).forEach((button) => {
      button.addEventListener("click", () => {
        current = Number(button.dataset.thumbIndex);
        update();
      });
    });

    prev.addEventListener("click", () => {
      if (current > 0) {
        current -= 1;
        update();
      }
    });

    next.addEventListener("click", () => {
      if (current < work.images.length - 1) {
        current += 1;
        update();
      }
    });

    window.addEventListener("keydown", (event) => {
      if (!isSeries) return;
      if (event.key === "ArrowLeft" && current > 0) {
        current -= 1;
        update();
      }
      if (event.key === "ArrowRight" && current < work.images.length - 1) {
        current += 1;
        update();
      }
    });

    update();
  }

  renderGallery();
  renderDetail();
})();
