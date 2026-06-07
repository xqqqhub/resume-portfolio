(function () {
  const source = window.PORTFOLIO_DATA || { categories: [] };
  const visibleCategoryIds = new Set([
    "key-visual",
    "mobile-poster",
    "rednote",
    "brochure",
    "booklet-deck",
    "video",
    "kusa",
  ]);
  const cacheVersion = "v=2";
  const hiddenWorkIds = new Set([
    "mobile-poster-主画面延展",
    "rednote-ai画面",
    "mobile-poster-layout-04",
    "mobile-poster-layout-05",
    "rednote-project-03",
  ]);
  const workOrders = {
    "key-visual-双十一活动": 999,
  };

  const withVersion = (path) => {
    if (!path || path.includes("?")) return path;
    return `${path}?${cacheVersion}`;
  };

  const getFileNumber = (file) => {
    const base = (file.name || file.path || "").split("/").pop() || "";
    const matches = base.match(/\d+/g);
    if (!matches) return Number.MAX_SAFE_INTEGER;
    return Number(matches[matches.length - 1]);
  };

  const sortFilesByNumber = (files) =>
    [...files].sort((a, b) => {
      const diff = getFileNumber(a) - getFileNumber(b);
      return diff || (a.name || "").localeCompare(b.name || "", "zh-Hans-CN", { numeric: true });
    });

  const uniquePaths = (paths) => [...new Set(paths.filter(Boolean))];

  const ensureCoverInImages = (cover, images) => uniquePaths([cover, ...images]);

  const getVideoSrc = (project) => {
    if (!project.video) return "";
    return project.video;
  };

  const categoryLabels = {
    "key-visual": {
      index: "01",
      en: "Key Visual",
      zh: "项目主画面/活动视觉",
    },
    "mobile-poster": {
      index: "02",
      en: "Mobile Poster",
      zh: "刷屏海报",
    },
    rednote: {
      index: "03",
      en: "Media Platforms",
      zh: "小红书/公众号/线上投流",
    },
    brochure: {
      index: "04",
      en: "Brochure",
      zh: "折页",
    },
    "booklet-deck": {
      index: "05",
      en: "VI & Booklet & PPT",
      zh: "标识识别系统/企业楼书/PPT",
    },
    video: {
      index: "06",
      en: "Short Film",
      zh: "短片",
    },
    kusa: {
      index: "VI",
      en: "VI",
      zh: "KUSA",
    },
  };

  const createImageWork = ({ id, category, type, cover, images, title = "" }) => ({
    id,
    title,
    type,
    mediaType: "image",
    category,
    cover: withVersion(cover),
    images: images.map(withVersion),
    videoSrc: "",
  });

  const latestSocialPosterWorks = [
    createImageWork({
      id: "mobile-poster-social-single-01",
      title: "刷屏海报 Single 01",
      category: "mobile-poster",
      type: "single",
      cover: "public/works-web/social-poster/single-01.jpg",
      images: ["public/works-web/social-poster/single-01.jpg"],
    }),
    createImageWork({
      id: "mobile-poster-social-single-02",
      title: "刷屏海报 Single 02",
      category: "mobile-poster",
      type: "single",
      cover: "public/works-web/social-poster/single-02.jpg",
      images: ["public/works-web/social-poster/single-02.jpg"],
    }),
    createImageWork({
      id: "mobile-poster-social-project-01",
      title: "刷屏海报 01",
      category: "mobile-poster",
      type: "series",
      cover: "public/works-web/social-poster/project-01/01.jpg",
      images: [
        "public/works-web/social-poster/project-01/01.jpg",
        "public/works-web/social-poster/project-01/02.jpg",
        "public/works-web/social-poster/project-01/03.jpg",
      ],
    }),
    createImageWork({
      id: "mobile-poster-social-project-02",
      title: "刷屏海报 02",
      category: "mobile-poster",
      type: "series",
      cover: "public/works-web/social-poster/project-02/01.jpg",
      images: [
        "public/works-web/social-poster/project-02/01.jpg",
        "public/works-web/social-poster/project-02/02.jpg",
        "public/works-web/social-poster/project-02/03.jpg",
      ],
    }),
    createImageWork({
      id: "mobile-poster-social-project-03",
      title: "刷屏海报 03",
      category: "mobile-poster",
      type: "series",
      cover: "public/works-web/social-poster/project-03/01.jpg",
      images: [
        "public/works-web/social-poster/project-03/01.jpg",
        "public/works-web/social-poster/project-03/02.jpg",
        "public/works-web/social-poster/project-03/03.jpg",
        "public/works-web/social-poster/project-03/04.jpg",
      ],
    }),
  ];

  const latestRednoteWorks = [
    createImageWork({
      id: "rednote-project-01",
      title: "小红书 01",
      category: "rednote",
      type: "series",
      cover: "public/works-web/rednote/project-01/01.JPG",
      images: ["public/works-web/rednote/project-01/01.JPG"],
    }),
    createImageWork({
      id: "rednote-project-02",
      title: "小红书 02",
      category: "rednote",
      type: "series",
      cover: "public/works-web/rednote/project-02/01.jpg",
      images: ["public/works-web/rednote/project-02/01.jpg", "public/works-web/rednote/project-02/02.jpg"],
    }),
    createImageWork({
      id: "rednote-project-03",
      title: "小红书 03",
      category: "rednote",
      type: "series",
      cover: "public/works-web/rednote/project-03/01.JPG",
      images: ["public/works-web/rednote/project-03/01.JPG", "public/works-web/rednote/project-03/02.JPG"],
    }),
  ];

  const categories = [
    ...source.categories
    .filter((category) => visibleCategoryIds.has(category.id))
    .map((category) => ({
      id: category.id,
      index: categoryLabels[category.id]?.index || "",
      en: categoryLabels[category.id]?.en || category.en || "",
      zh: categoryLabels[category.id]?.zh || category.zh,
    })),
  ].sort((a, b) => {
    const order = ["key-visual", "mobile-poster", "rednote", "brochure", "booklet-deck", "video", "kusa"];
    return order.indexOf(a.id) - order.indexOf(b.id);
  });

  const works = source.categories
    .filter((category) => visibleCategoryIds.has(category.id))
    .flatMap((category) =>
      category.projects.flatMap((project) => {
        const imageFiles = sortFilesByNumber((project.files || []).filter((file) => file.media === "image"));
        const images = imageFiles.map((file) => file.path);
        const fallback = project.cover || imageFiles[0]?.path || "";
        let galleryImages = ensureCoverInImages(fallback, images);
        let cover = fallback;
        const videoSrc = getVideoSrc(project);

        if (project.slug === "mobile-poster-节气") {
          galleryImages = galleryImages.filter((path) => !/节气_0[56]\.jpg$/i.test(path));
        }

        if (project.slug === "kusa-kusa") {
          galleryImages = [
            "assets/portfolio/vi/01.jpg",
            "assets/portfolio/vi/02.jpg",
            "assets/portfolio/vi/03.jpg",
            "assets/portfolio/vi/04.jpg",
            "assets/portfolio/vi/05.jpg",
            "assets/portfolio/vi/06.jpg",
          ];
          cover = galleryImages[0];
        }

        if (project.slug === "mobile-poster-节日") {
          return galleryImages.map((image, index) => ({
            id: `mobile-poster-holiday-${String(index + 1).padStart(2, "0")}`,
            type: "single",
            mediaType: "image",
            category: category.id,
            cover: withVersion(image),
            images: [withVersion(image)],
            videoSrc: "",
          }));
        }

        if (project.slug === "mobile-poster-排版") {
          return galleryImages.map((image, index) => ({
            id: `mobile-poster-layout-${String(index + 1).padStart(2, "0")}`,
            type: "single",
            mediaType: "image",
            category: category.id,
            cover: withVersion(image),
            images: [withVersion(image)],
            videoSrc: "",
          }));
        }

        return {
          id: project.slug,
          type: videoSrc ? "video" : galleryImages.length > 1 ? "series" : "single",
          mediaType: videoSrc ? "video" : "image",
          category: category.id,
          cover: withVersion(cover),
          images: galleryImages.map(withVersion),
          videoSrc: withVersion(videoSrc),
          order: workOrders[project.slug],
        };
      })
    )
    .filter((work) => work.cover && work.images.length);

  works.unshift(...latestRednoteWorks);
  works.unshift(...latestSocialPosterWorks);

  const solarTerm = works.find((work) => work.id === "mobile-poster-节气");
  if (solarTerm) {
    const splitImages = [
      "assets/portfolio/02_手机刷屏海报_MobilePoster/02_手机刷屏海报_节气_05.jpg",
      "assets/portfolio/02_手机刷屏海报_MobilePoster/02_手机刷屏海报_节气_06.jpg",
    ];
    works.push({
      id: "mobile-poster-节气-05-06",
      type: "series",
      mediaType: "image",
      category: "mobile-poster",
      cover: withVersion(splitImages[0]),
      images: splitImages.map(withVersion),
      videoSrc: "",
    });
  }

  window.WORKS_GALLERY_DATA = {
    categories,
    works: works.filter((work) => !hiddenWorkIds.has(work.id)),
  };
})();
