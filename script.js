const translations = {
  zh: {
    navWorks: "作品",
    navAbout: "关于",
    navContact: "联系",
    homeIntro:
      "以排版、图像组织和传播物料为核心的平面设计作品集，覆盖主画面、移动端海报、折页、册子、PPT、短片与 VI。",
    viewWorks: "查看作品",
    contactMe: "联系我",
    statProjects: "项目分组",
    statAssets: "视觉素材",
    statCategories: "作品类型",
    selectedTitle: "Selected Work",
    archiveTitle: "作品分类",
    serviceTitle: "Design, layout, and content. All-in-one.",
    serviceBody: "从主画面到社交海报、折页、企业楼书和视频封面，围绕商业传播目标建立清晰的视觉层级。",
    serviceOne: "主画面",
    serviceOneBody: "活动、地产、品牌传播中的核心画面与延展系统。",
    serviceTwo: "社交内容",
    serviceTwoBody: "手机刷屏海报、小红书封面与系列化信息编排。",
    serviceThree: "册子与动态",
    serviceThreeBody: "折页、PPT、企业楼书、短片封面与视觉叙事。",
    ctaTitle: "Let's make your portfolio stand out.",
    worksHeadline: "按媒介与传播场景组织的设计作品。",
    aboutHeadline: "许倩，平面设计师。",
    aboutBody:
      "作品覆盖地产与商业传播中的主画面、社交媒体海报、折页、企业楼书、PPT 版式、短片视觉和 VI/LOGO。关注信息层级、图像叙事和跨媒介延展，让复杂内容在不同尺寸和场景中保持清晰识别。",
    capabilityOne: "版式与信息层级",
    capabilityOneBody: "通过网格、字号、留白与图文关系建立阅读节奏。",
    capabilityTwo: "多媒介视觉延展",
    capabilityTwoBody: "从主画面延展到手机海报、折页、PPT、视频封面和社交内容。",
    capabilityThree: "商业传播执行",
    capabilityThreeBody: "面向活动、楼书、招商、获奖传播和品牌品宣等实际需求。",
    contactHeadline: "欢迎查看作品集并进一步沟通。",
    backWorks: "返回作品",
    all: "全部",
    files: "个文件",
    viewProject: "查看项目",
    openPdf: "打开完整 PDF",
    projectIntro: "此项目收录了同组视觉素材，展示从画面建立到多媒介延展的设计呈现。",
  },
  en: {
    navWorks: "Works",
    navAbout: "About",
    navContact: "Contact",
    homeIntro:
      "A graphic design portfolio centered on typography, image structure, and communication materials across key visuals, mobile posters, brochures, decks, films, and VI.",
    viewWorks: "View Works",
    contactMe: "Contact",
    statProjects: "Project Groups",
    statAssets: "Visual Assets",
    statCategories: "Categories",
    selectedTitle: "Selected Work",
    archiveTitle: "Work Categories",
    serviceTitle: "Design, layout, and content. All-in-one.",
    serviceBody: "From key visuals to social posters, brochures, corporate decks, and video covers, the work builds clear visual hierarchy around commercial communication goals.",
    serviceOne: "Key Visual",
    serviceOneBody: "Core campaign visuals and extension systems for events, real estate, and brand communication.",
    serviceTwo: "Social Content",
    serviceTwoBody: "Mobile posters, Rednote covers, and serialized information layout.",
    serviceThree: "Editorial & Motion",
    serviceThreeBody: "Brochures, PPT decks, corporate booklets, video covers, and visual storytelling.",
    ctaTitle: "Let's make your portfolio stand out.",
    worksHeadline: "Design work organized by media and communication context.",
    aboutHeadline: "Xu Qian, Graphic Designer.",
    aboutBody:
      "The portfolio covers key visuals, social posters, brochures, corporate decks, PPT layouts, short films, and VI/LOGO work for real estate and commercial communication. The work focuses on hierarchy, visual storytelling, and cross-media extension.",
    capabilityOne: "Layout & Hierarchy",
    capabilityOneBody: "Building reading rhythm through grids, type scale, spacing, and image-text relationships.",
    capabilityTwo: "Cross-media Extension",
    capabilityTwoBody: "Extending core visuals into mobile posters, brochures, decks, video covers, and social content.",
    capabilityThree: "Commercial Execution",
    capabilityThreeBody: "Supporting campaigns, books, investment decks, award communication, and brand promotion.",
    contactHeadline: "Open to portfolio review and further conversations.",
    backWorks: "Back to Works",
    all: "All",
    files: "files",
    viewProject: "View Project",
    openPdf: "Open Full PDF",
    projectIntro: "This project gathers related visual assets and shows the design from core composition to media extension.",
  },
};

const data = window.PORTFOLIO_DATA || { categories: [] };
const EDIT_STORAGE_KEY = "portfolio-home-edits-v1";
const STYLE_STORAGE_KEY = "portfolio-home-styles-v1";
const IMAGE_STORAGE_KEY = "portfolio-home-images-v1";
const getLang = () => localStorage.getItem("portfolio-lang") || "zh";
const byLang = (zh, en) => (getLang() === "en" ? en : zh);
const qs = (selector, parent = document) => parent.querySelector(selector);
const qsa = (selector, parent = document) => [...parent.querySelectorAll(selector)];

function setLanguage(lang) {
  document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
  qsa("[data-i18n]").forEach((node) => {
    const key = node.dataset.i18n;
    if (translations[lang][key]) node.textContent = translations[lang][key];
  });
  qsa("[data-lang-toggle]").forEach((button) => {
    button.textContent = lang === "zh" ? "EN" : "中";
  });
  localStorage.setItem("portfolio-lang", lang);
  renderDynamicText();
}

function mediaMarkup(project, className = "") {
  const isVideo = project.video && project.cover === project.video;
  if (project.video && isVideo) {
    return `<video src="${project.video}" muted loop playsinline preload="metadata" ${project.cover ? `poster="${project.cover}"` : ""}></video>`;
  }
  return `<img src="${project.cover}" alt="${project.titleZh}" loading="lazy" class="${className}">`;
}

function getProjectUrl(project) {
  return `project.html?project=${encodeURIComponent(project.slug)}`;
}

function allProjects() {
  return data.categories.flatMap((category) => category.projects);
}

function renderDynamicText() {
  qsa("[data-title-zh]").forEach((node) => {
    node.textContent = byLang(node.dataset.titleZh, node.dataset.titleEn);
  });
  qsa("[data-category-zh]").forEach((node) => {
    node.textContent = byLang(node.dataset.categoryZh, node.dataset.categoryEn);
  });
  qsa("[data-files-count]").forEach((node) => {
    node.textContent = `${node.dataset.filesCount} ${translations[getLang()].files}`;
  });
}

function loadHomeEdits() {
  try {
    return JSON.parse(localStorage.getItem(EDIT_STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

function loadJsonStorage(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || "{}");
  } catch {
    return {};
  }
}

function applyHomeEdits() {
  const edits = loadHomeEdits();
  qsa("[data-edit]").forEach((node) => {
    const value = edits[node.dataset.edit];
    if (typeof value === "string") node.textContent = value;
  });
}

function getStyleTargetId(node) {
  return node?.dataset?.edit || "";
}

function applyHomeStyles() {
  const styles = loadJsonStorage(STYLE_STORAGE_KEY);
  qsa("[data-edit]").forEach((node) => {
    const item = styles[getStyleTargetId(node)];
    if (!item) return;
    if (item.fontSize) node.style.fontSize = item.fontSize;
    if (item.fontWeight) node.style.fontWeight = item.fontWeight;
    if (item.color) node.style.color = item.color;
  });
}

function applyHomeImages() {
  const images = loadJsonStorage(IMAGE_STORAGE_KEY);
  qsa("[data-image-edit]").forEach((node) => {
    const path = images[node.dataset.imageEdit];
    if (!path) return;
    node.classList.add("has-custom-image");
    let image = qs("img", node);
    if (!image) {
      image = document.createElement("img");
      node.prepend(image);
    }
    image.src = path;
    image.alt = qs("[data-edit]", node)?.textContent || "Portfolio image";
  });
}

function getStoredStyles() {
  return loadJsonStorage(STYLE_STORAGE_KEY);
}

function saveStoredStyles(styles) {
  localStorage.setItem(STYLE_STORAGE_KEY, JSON.stringify(styles));
}

function getSelectedEditable() {
  return qs("[data-edit].is-selected-edit");
}

function getSelectedImageSlot() {
  return qs("[data-image-edit].is-selected-edit");
}

function markSelected(node) {
  qsa(".is-selected-edit").forEach((item) => item.classList.remove("is-selected-edit"));
  if (node) node.classList.add("is-selected-edit");
}

function adjustFontSize(delta) {
  const node = getSelectedEditable();
  if (!node) {
    updateEditStatus("先点选一段文字");
    return;
  }
  const current = parseFloat(getComputedStyle(node).fontSize);
  const next = Math.max(10, Math.min(180, current + delta));
  node.style.fontSize = `${next}px`;
  const styles = getStoredStyles();
  const id = getStyleTargetId(node);
  styles[id] = { ...(styles[id] || {}), fontSize: `${next}px` };
  saveStoredStyles(styles);
  updateEditStatus(`字号 ${Math.round(next)}px`);
}

function toggleFontWeight() {
  const node = getSelectedEditable();
  if (!node) {
    updateEditStatus("先点选一段文字");
    return;
  }
  const current = Number(getComputedStyle(node).fontWeight);
  const next = current >= 600 ? "400" : "700";
  node.style.fontWeight = next;
  const styles = getStoredStyles();
  const id = getStyleTargetId(node);
  styles[id] = { ...(styles[id] || {}), fontWeight: next };
  saveStoredStyles(styles);
  updateEditStatus(next === "700" ? "已加粗" : "已变细");
}

function toggleTextColor() {
  const node = getSelectedEditable();
  if (!node) {
    updateEditStatus("先点选一段文字");
    return;
  }
  const palette = ["", "#171717", "#77746e", "#f5f5f2", "#8fff45"];
  const styles = getStoredStyles();
  const id = getStyleTargetId(node);
  const current = styles[id]?.color || "";
  const next = palette[(palette.indexOf(current) + 1) % palette.length];
  node.style.color = next;
  styles[id] = { ...(styles[id] || {}), color: next };
  saveStoredStyles(styles);
  updateEditStatus(next ? `颜色 ${next}` : "已恢复默认色");
}

function changeSelectedImage() {
  const slot = getSelectedImageSlot();
  if (!slot) {
    updateEditStatus("先点选一个灰色图片位");
    return;
  }
  const current = loadJsonStorage(IMAGE_STORAGE_KEY)[slot.dataset.imageEdit] || "";
  const next = window.prompt("输入图片路径，例如 assets/portfolio/.../图片.jpg", current);
  if (next === null) return;
  const images = loadJsonStorage(IMAGE_STORAGE_KEY);
  if (next.trim()) {
    images[slot.dataset.imageEdit] = next.trim();
  } else {
    delete images[slot.dataset.imageEdit];
  }
  localStorage.setItem(IMAGE_STORAGE_KEY, JSON.stringify(images));
  applyHomeImages();
  updateEditStatus(next.trim() ? "图片路径已保存" : "图片已恢复灰色色块");
}

function updateEditStatus(text) {
  const status = qs("[data-edit-status]");
  if (status) status.textContent = text;
}

function setEditMode(enabled) {
  document.body.classList.toggle("is-editing", enabled);
  qsa("[data-edit]").forEach((node) => {
    node.contentEditable = enabled ? "true" : "false";
    node.spellcheck = false;
  });
  updateEditStatus(enabled ? "正在编辑，点文字或图片位" : "未开启编辑");
}

function saveHomeEdits() {
  const edits = {};
  qsa("[data-edit]").forEach((node) => {
    edits[node.dataset.edit] = node.textContent.trim();
  });
  localStorage.setItem(EDIT_STORAGE_KEY, JSON.stringify(edits));
  const status = qs("[data-edit-status]");
  if (status) status.textContent = "已保存到当前浏览器";
}

function resetHomeEdits() {
  localStorage.removeItem(EDIT_STORAGE_KEY);
  localStorage.removeItem(STYLE_STORAGE_KEY);
  localStorage.removeItem(IMAGE_STORAGE_KEY);
  location.reload();
}

function setupEditMode() {
  applyHomeEdits();
  applyHomeStyles();
  applyHomeImages();
  const toggle = qs("[data-edit-toggle]");
  const save = qs("[data-edit-save]");
  const reset = qs("[data-edit-reset]");
  const smaller = qs("[data-font-smaller]");
  const larger = qs("[data-font-larger]");
  const weight = qs("[data-weight-toggle]");
  const color = qs("[data-color-toggle]");
  const image = qs("[data-image-change]");
  if (!toggle || !save || !reset) return;
  qsa("[data-edit]").forEach((node) => {
    node.addEventListener("click", () => markSelected(node));
    node.addEventListener("focus", () => markSelected(node));
  });
  qsa("[data-image-edit]").forEach((node) => {
    node.addEventListener("click", () => markSelected(node));
  });
  document.addEventListener(
    "click",
    (event) => {
      if (!document.body.classList.contains("is-editing")) return;
      if (event.target.closest("[data-edit]") && event.target.closest("a")) {
        event.preventDefault();
      }
    },
    true
  );
  toggle.addEventListener("click", () => {
    setEditMode(!document.body.classList.contains("is-editing"));
  });
  save.addEventListener("click", saveHomeEdits);
  reset.addEventListener("click", resetHomeEdits);
  smaller?.addEventListener("click", () => adjustFontSize(-2));
  larger?.addEventListener("click", () => adjustFontSize(2));
  weight?.addEventListener("click", toggleFontWeight);
  color?.addEventListener("click", toggleTextColor);
  image?.addEventListener("click", changeSelectedImage);
}

function renderHome() {
  const featured = data.categories.find((category) => category.id === "featured");
  if (!featured) return;
  const hero = featured.projects.find((project) => project.titleZh === "价值点系列稿") || featured.projects[0];
  const heroStage = qs("[data-hero-stage]");
  if (heroStage && hero) {
    heroStage.innerHTML = `
      ${mediaMarkup(hero)}
      <div class="hero-caption">
        <span data-title-zh="${hero.titleZh}" data-title-en="${hero.titleEn}">${byLang(hero.titleZh, hero.titleEn)}</span>
        <span>${hero.categoryEn}</span>
      </div>
    `;
  }

  const assetsTotal = data.categories.reduce((sum, category) => sum + category.count, 0);
  const projectTotal = allProjects().length;
  if (qs("[data-stat-assets]")) qs("[data-stat-assets]").textContent = assetsTotal;
  if (qs("[data-stat-projects]")) qs("[data-stat-projects]").textContent = projectTotal;

  const grid = qs("[data-featured-grid]");
  if (grid) {
    grid.innerHTML = featured.projects
      .slice(0, 2)
      .map(
        (project) => `
        <a class="work-tile" href="${getProjectUrl(project)}">
          ${mediaMarkup(project)}
          <span class="tile-label">
            <span>
              <strong data-title-zh="${project.titleZh}" data-title-en="${project.titleEn}">${byLang(project.titleZh, project.titleEn)}</strong>
              <span data-category-zh="${project.categoryZh}" data-category-en="${project.categoryEn}">${byLang(project.categoryZh, project.categoryEn)}</span>
            </span>
            <span>${project.files.length}</span>
          </span>
        </a>`
      )
      .join("");
  }

  const categoryIndex = qs("[data-category-index]");
  if (categoryIndex) {
    categoryIndex.innerHTML = data.categories
      .filter((category) => category.id !== "featured")
      .map(
        (category, index) => `
        <a class="category-row" href="works.html?category=${category.id}">
          <span>${String(index + 1).padStart(2, "0")}</span>
          <strong data-category-zh="${category.zh}" data-category-en="${category.en}">${byLang(category.zh, category.en)}</strong>
          <span>${category.projects.length} / ${category.count}</span>
        </a>`
      )
      .join("");
  }
}

function renderWorks() {
  const dock = qs("[data-filter-dock]");
  const grid = qs("[data-archive-grid]");
  if (!dock || !grid) return;
  const params = new URLSearchParams(location.search);
  const active = params.get("category") || "all";
  dock.innerHTML = [
    `<button class="filter-chip ${active === "all" ? "active" : ""}" type="button" data-category-filter="all">${translations[getLang()].all}</button>`,
    ...data.categories
      .filter((category) => category.id !== "featured")
      .map(
        (category) =>
          `<button class="filter-chip ${active === category.id ? "active" : ""}" type="button" data-category-filter="${category.id}" data-category-zh="${category.zh}" data-category-en="${category.en}">${byLang(category.zh, category.en)}</button>`
      ),
  ].join("");

  const renderCards = (categoryId) => {
    const projects = allProjects().filter(
      (project) => project.categoryId !== "featured" && (categoryId === "all" || project.categoryId === categoryId)
    );
    grid.innerHTML = projects
      .map(
        (project) => `
        <a class="archive-card" href="${getProjectUrl(project)}" data-project-card data-category="${project.categoryId}">
          <figure>${mediaMarkup(project)}</figure>
          <div class="archive-info">
            <h2 data-title-zh="${project.titleZh}" data-title-en="${project.titleEn}">${byLang(project.titleZh, project.titleEn)}</h2>
            <p>
              <span data-category-zh="${project.categoryZh}" data-category-en="${project.categoryEn}">${byLang(project.categoryZh, project.categoryEn)}</span>
              · <span data-files-count="${project.files.length}">${project.files.length} ${translations[getLang()].files}</span>
            </p>
          </div>
        </a>`
      )
      .join("");
  };

  renderCards(active);
  qsa("[data-category-filter]", dock).forEach((button) => {
    button.addEventListener("click", () => {
      qsa("[data-category-filter]", dock).forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      const categoryId = button.dataset.categoryFilter;
      renderCards(categoryId);
      const nextUrl = categoryId === "all" ? "works.html" : `works.html?category=${encodeURIComponent(categoryId)}`;
      history.replaceState(null, "", nextUrl);
    });
  });
}

function renderProject() {
  const shell = qs("[data-project-shell]");
  if (!shell) return;
  const slug = new URLSearchParams(location.search).get("project");
  const project = allProjects().find((item) => item.slug === slug) || allProjects()[0];
  if (!project) return;
  document.title = `${project.titleZh} | 许倩 Portfolio`;
  const imageFiles = project.files.filter((file) => file.media === "image");
  const pdfFiles = project.files.filter((file) => file.media === "pdf");
  shell.innerHTML = `
    <section class="project-hero">
      <div class="project-meta">
        <p class="eyebrow" data-category-zh="${project.categoryZh}" data-category-en="${project.categoryEn}">${byLang(project.categoryZh, project.categoryEn)}</p>
        <h1 class="project-title" data-title-zh="${project.titleZh}" data-title-en="${project.titleEn}">${byLang(project.titleZh, project.titleEn)}</h1>
        <p data-i18n="projectIntro">${translations[getLang()].projectIntro}</p>
      </div>
      <div class="project-cover">${project.video ? `<video src="${project.video}" controls playsinline poster="${project.cover}"></video>` : mediaMarkup(project)}</div>
    </section>
    <section class="media-grid">
      ${imageFiles
        .map((file, index) => {
          const wide = /折页|主画面|册子PPT|VI/.test(file.name) || index % 5 === 0;
          return `
          <figure class="media-card ${wide ? "wide" : ""}" data-lightbox="${file.path}">
            <img src="${file.path}" alt="${file.label}" loading="lazy">
          </figure>`;
        })
        .join("")}
      ${pdfFiles
        .map(
          (file) => `
        <a class="pdf-link" href="${file.path}" target="_blank" rel="noreferrer">
          <span>${file.name}</span>
          <strong data-i18n="openPdf">${translations[getLang()].openPdf}</strong>
        </a>`
        )
        .join("")}
    </section>
  `;
  setupLightbox();
}

function setupLightbox() {
  if (!qs(".lightbox")) {
    document.body.insertAdjacentHTML("beforeend", `<div class="lightbox"><button type="button" aria-label="Close">×</button><img alt=""></div>`);
  }
  const lightbox = qs(".lightbox");
  const image = qs(".lightbox img");
  qsa("[data-lightbox]").forEach((item) => {
    item.addEventListener("click", () => {
      image.src = item.dataset.lightbox;
      lightbox.classList.add("active");
    });
  });
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox || event.target.tagName === "BUTTON") {
      lightbox.classList.remove("active");
      image.src = "";
    }
  });
}

function boot() {
  qsa("[data-lang-toggle]").forEach((button) => {
    button.addEventListener("click", () => setLanguage(getLang() === "en" ? "zh" : "en"));
  });
  setLanguage(getLang());
  renderHome();
  renderWorks();
  renderProject();
  renderDynamicText();
  setupEditMode();
}

boot();
