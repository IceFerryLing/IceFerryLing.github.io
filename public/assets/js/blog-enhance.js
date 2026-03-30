const THEME_KEY = 'theme-mode';
const NAV_REFRESH_PATH_KEY = '__nav_refresh_path__';
const NAV_REFRESH_AT_KEY = '__nav_refresh_at__';
const NAV_REFRESH_TTL_MS = 30 * 1000;

function normalizePathname(pathname = '/') {
  const raw = String(pathname || '/').trim();
  if (!raw || raw === '/') return '/';
  return raw.endsWith('/') ? raw.slice(0, -1) : raw;
}

// 按需加载外部脚本（避免重复注入同一个资源）
function loadScriptOnce(src, id) {
  return new Promise((resolve, reject) => {
    if (id && document.getElementById(id)) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    if (id) script.id = id;
    script.onload = () => resolve();
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

// 按需加载外部样式（用于 Fancybox 等可选能力）
function loadStyleOnce(href, id) {
  if (id && document.getElementById(id)) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = href;
  if (id) link.id = id;
  document.head.appendChild(link);
}

// 主题切换：同步 html[data-theme] + 本地存储 + 按钮状态
function initThemeToggle() {
  const btn = document.getElementById('themeToggle');
  if (!btn) return;

  const getMode = () => document.documentElement.getAttribute('data-theme') || 'dark';

  const updateIcon = () => {
    const mode = getMode();
    btn.classList.toggle('is-night', mode === 'dark');
    btn.setAttribute('title', mode === 'dark' ? '切换为浅色模式' : '切换为深色模式');
    btn.setAttribute('aria-pressed', String(mode === 'dark'));
  };

  btn.addEventListener('click', () => {
    const next = getMode() === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem(THEME_KEY, next);
    updateIcon();
  });

  updateIcon();
}

// 阅读进度条：根据正文滚动比例更新顶部进度
function initReadingProgress() {
  const bar = document.getElementById('readingProgress');
  const article = document.querySelector('.post-layout .prose');
  if (!bar) return;
  if (!article) {
    bar.style.opacity = '0';
    return;
  }

  const update = () => {
    const rect = article.getBoundingClientRect();
    const articleTop = window.scrollY + rect.top;
    const articleHeight = article.offsetHeight;
    const win = window.innerHeight;
    const raw = (window.scrollY - articleTop + win * 0.25) / Math.max(1, articleHeight - win * 0.5);
    const progress = Math.max(0, Math.min(1, raw));
    bar.style.transform = `scaleX(${progress})`;
    bar.style.opacity = '1';
  };

  update();
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
}

// 代码块复制按钮：为每个 pre 注入复制交互
function initCodeCopyButtons() {
  const blocks = document.querySelectorAll('.prose pre');
  blocks.forEach((pre) => {
    if (pre.querySelector('.copy-btn')) return;
    const btn = document.createElement('button');
    btn.className = 'copy-btn';
    btn.type = 'button';
    btn.textContent = '复制';

    btn.addEventListener('click', async () => {
      const code = pre.querySelector('code')?.innerText || pre.innerText;
      try {
        await navigator.clipboard.writeText(code);
        btn.textContent = '已复制';
        setTimeout(() => (btn.textContent = '复制'), 1200);
      } catch {
        btn.textContent = '失败';
        setTimeout(() => (btn.textContent = '复制'), 1200);
      }
    });

    pre.style.position = 'relative';
    pre.appendChild(btn);
  });
}

// 目录高亮与章节进度：滚动时同步 TOC active 状态
function initTocActive() {
  const toc = document.getElementById('tocFloating');
  if (!toc) return;
  const sectionBar = document.getElementById('tocSectionBar');
  const sectionPercent = document.getElementById('tocSectionPercent');
  const sectionLabel = document.getElementById('tocSectionLabel');
  const article = document.querySelector('.post-layout .prose');

  const links = Array.from(toc.querySelectorAll('a'));
  const sections = links
    .map((link) => {
      const id = decodeURIComponent(link.getAttribute('href').slice(1));
      return document.getElementById(id);
    })
    .filter(Boolean);

  if (!sections.length) {
    toc.style.display = 'none';
    return;
  }

  let lastScrollY = window.scrollY;
  let activeIndex = -1;

  function updateSectionProgress(index) {
    if (!sectionBar || !sectionPercent || !sectionLabel || !sections[index]) return;

    const current = sections[index];
    const next = sections[index + 1] || null;
    const currentTop = window.scrollY + current.getBoundingClientRect().top - 120;
    const nextTop = next
      ? window.scrollY + next.getBoundingClientRect().top - 120
      : article
        ? window.scrollY + article.getBoundingClientRect().top + article.offsetHeight - 40
        : document.body.scrollHeight;

    const span = Math.max(1, nextTop - currentTop);
    const raw = (window.scrollY - currentTop) / span;
    const progress = Math.max(0, Math.min(1, raw));
    const percentText = `${Math.round(progress * 100)}%`;

    sectionBar.style.transform = `scaleX(${progress})`;
    sectionPercent.textContent = percentText;
    sectionLabel.textContent = links[index]?.textContent?.trim() || '本章节进度';
  }

  links.forEach((link, idx) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      sections[idx]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.replaceState(null, '', link.getAttribute('href'));
    });
  });

  const activate = () => {
    let active = 0;
    sections.forEach((el, idx) => {
      if (el.getBoundingClientRect().top < 140) active = idx;
    });

    if (active !== activeIndex) {
      links.forEach((l) => l.classList.remove('active'));
      const current = links[active];
      current?.classList.add('active');
      current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      activeIndex = active;
    }

    updateSectionProgress(active);

    const delta = window.scrollY - lastScrollY;
    if (Math.abs(delta) > 2) {
      toc.classList.add('toc-following');
      toc.classList.toggle('toc-scroll-down', delta > 0);
      toc.classList.toggle('toc-scroll-up', delta < 0);
    }
    lastScrollY = window.scrollY;
  };

  activate();
  window.addEventListener('scroll', activate, { passive: true });
}

// 归档筛选栏吸顶效果
function initArchiveFilterSticky() {
  const filterBar = document.getElementById('archiveFilterBar');
  if (!filterBar) return;

  const update = () => {
    const stuck = filterBar.getBoundingClientRect().top <= 93 && window.scrollY > 0;
    filterBar.classList.toggle('is-stuck', stuck);
  };

  update();
  window.addEventListener('scroll', update, { passive: true });
}

// 评论系统：延迟注入 giscus 脚本，避免首屏阻塞
function initGiscus() {
  const target = document.querySelector('.giscus');
  if (!target) return;
  if (document.querySelector('script[data-giscus]')) return;

  const resolveGiscusTheme = () => {
    const mode = document.documentElement.getAttribute('data-theme') || 'dark';
    return mode === 'light' ? 'light' : 'transparent_dark';
  };

  const pushThemeToGiscus = () => {
    const frame = document.querySelector('iframe.giscus-frame');
    if (!frame?.contentWindow) return false;
    frame.contentWindow.postMessage(
      {
        giscus: {
          setConfig: {
            theme: resolveGiscusTheme()
          }
        }
      },
      'https://giscus.app'
    );
    return true;
  };

  const syncThemeWhenReady = (retries = 10) => {
    const pending = document.querySelector('.giscus');
    if (pending) {
      pending.setAttribute('data-theme', resolveGiscusTheme());
    }
    if (pushThemeToGiscus() || retries <= 0) return;
    setTimeout(() => syncThemeWhenReady(retries - 1), 280);
  };

  target.setAttribute('data-theme', resolveGiscusTheme());

  const script = document.createElement('script');
  script.src = 'https://giscus.app/client.js';
  script.async = true;
  script.crossOrigin = 'anonymous';
  script.setAttribute('data-giscus', 'true');

  Array.from(target.attributes).forEach((attr) => {
    if (attr.name.startsWith('data-')) {
      script.setAttribute(attr.name, attr.value);
    }
  });

  target.replaceWith(script);

  const observer = new MutationObserver((mutations) => {
    const changedTheme = mutations.some(
      (mutation) => mutation.type === 'attributes' && mutation.attributeName === 'data-theme'
    );
    if (changedTheme) syncThemeWhenReady();
  });

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme']
  });

  syncThemeWhenReady();
}

// 文章图片灯箱：自动包裹图片并按需加载 Fancybox
async function initFancybox() {
  const images = Array.from(document.querySelectorAll('.prose img'));
  if (!images.length) return;

  images.forEach((img) => {
    if (img.closest('a[data-fancybox]')) return;
    const wrapper = document.createElement('a');
    wrapper.href = img.currentSrc || img.src;
    wrapper.setAttribute('data-fancybox', 'post-gallery');
    wrapper.setAttribute('data-caption', img.alt || '图片预览');
    img.parentNode.insertBefore(wrapper, img);
    wrapper.appendChild(img);
  });

  loadStyleOnce('https://cdn.jsdelivr.net/npm/@fancyapps/ui@5.0/dist/fancybox/fancybox.css', 'fancybox-style');
  await loadScriptOnce('https://cdn.jsdelivr.net/npm/@fancyapps/ui@5.0/dist/fancybox/fancybox.umd.js', 'fancybox-script');

  if (window.Fancybox) {
    window.Fancybox.bind('[data-fancybox="post-gallery"]', {
      dragToClose: true,
      Thumbs: false,
      Toolbar: {
        display: {
          left: ['infobar'],
          middle: ['zoomIn', 'zoomOut', 'toggle1to1'],
          right: ['close']
        }
      }
    });
  }
}

// 站内跳转过渡：点击内部链接时执行离场动画
function initPageTransitions() {
  const main = document.getElementById('pageMain');

  // 从 bfcache（浏览器前进/后退缓存）恢复时，确保不会停留在离场状态
  window.addEventListener('pageshow', () => {
    if (!main) return;
    main.classList.remove('page-leave');
    main.classList.add('page-enter');
  });

  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href]');
    if (!link) return;
    if (link.target === '_blank' || link.hasAttribute('download')) return;

    const url = new URL(link.href, window.location.href);
    if (url.origin !== window.location.origin) return;
    const currentPath = normalizePathname(window.location.pathname);
    const targetPath = normalizePathname(url.pathname);
    const samePath = currentPath === targetPath;
    const sameSearch = (url.search || '') === (window.location.search || '');

    // 同页跳转（含点左上角品牌回到首页）不执行离场动画拦截，避免“假空白”
    if (samePath && sameSearch) return;

    if (url.hash && samePath) return;

    // 记录“目标页面”用于落地后自动刷新一次
    try {
      sessionStorage.setItem(NAV_REFRESH_PATH_KEY, normalizePathname(url.pathname));
      sessionStorage.setItem(NAV_REFRESH_AT_KEY, String(Date.now()));
    } catch {
      // 忽略存储异常（如隐私模式禁用存储）
    }

    event.preventDefault();
    if (!main) {
      window.location.href = url.href;
      return;
    }

    main.classList.remove('page-enter');
    main.classList.add('page-leave');
    setTimeout(() => {
      window.location.href = url.href;
    }, 220);
  });
}

// 站内跳转后：目标页自动刷新一次（并立即清除标记，避免循环）
function initRefreshAfterNavigation() {
  let targetPath = '';
  let markedAt = 0;

  try {
    targetPath = sessionStorage.getItem(NAV_REFRESH_PATH_KEY) || '';
    markedAt = Number(sessionStorage.getItem(NAV_REFRESH_AT_KEY) || 0);
  } catch {
    return;
  }

  if (!targetPath || !markedAt) return;

  const now = Date.now();
  const currentPath = normalizePathname(window.location.pathname);
  const isExpired = now - markedAt > NAV_REFRESH_TTL_MS;
  const isMatched = currentPath === normalizePathname(targetPath);

  let fromSameOrigin = false;
  try {
    if (document.referrer) {
      const ref = new URL(document.referrer);
      fromSameOrigin = ref.origin === window.location.origin;
    }
  } catch {
    fromSameOrigin = false;
  }

  if (isExpired || (!isMatched && !fromSameOrigin)) {
    if (isExpired) {
      try {
        sessionStorage.removeItem(NAV_REFRESH_PATH_KEY);
        sessionStorage.removeItem(NAV_REFRESH_AT_KEY);
      } catch {
        // 忽略存储异常
      }
    }
    return;
  }

  try {
    sessionStorage.removeItem(NAV_REFRESH_PATH_KEY);
    sessionStorage.removeItem(NAV_REFRESH_AT_KEY);
  } catch {
    // 忽略存储异常
  }

  // 使用 requestAnimationFrame 确保在当前帧结束后刷新
  requestAnimationFrame(() => {
    window.location.reload();
  });
}

// 页面增强功能入口
initThemeToggle();
initReadingProgress();
initCodeCopyButtons();
initTocActive();
initArchiveFilterSticky();
initGiscus();
initFancybox();
initPageTransitions();
initRefreshAfterNavigation();
