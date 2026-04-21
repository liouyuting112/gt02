// ========================================================================
// GameTower Final — Integrated Script
// ========================================================================

// ===== THEME（含舊 key 遷移） =====
const THEME_KEY = 'gt-theme';
const OLD_THEME_KEY = 'gt-theme-final';
const html = document.documentElement;
const themeBtn = document.getElementById('themeBtn');
// 舊 key 遷移到新 key（跑一次）
const oldTheme = localStorage.getItem(OLD_THEME_KEY);
if (oldTheme && !localStorage.getItem(THEME_KEY)) {
  localStorage.setItem(THEME_KEY, oldTheme);
  localStorage.removeItem(OLD_THEME_KEY);
}
const savedTheme = localStorage.getItem(THEME_KEY) || 'dark';
html.setAttribute('data-theme', savedTheme);
themeBtn?.setAttribute('aria-pressed', String(savedTheme === 'dark'));
themeBtn?.addEventListener('click', () => {
  const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem(THEME_KEY, next);
  themeBtn.setAttribute('aria-pressed', String(next === 'dark'));
});

// ===== MARQUEE CLOSE（本次瀏覽期間持久化） =====
const MARQUEE_KEY = 'gt-marquee-closed';
const marqueeBar = document.getElementById('marqueeBar');
const navbar = document.getElementById('navbar');
if (sessionStorage.getItem(MARQUEE_KEY) === '1' && marqueeBar) {
  marqueeBar.classList.add('hidden');
  navbar?.classList.add('no-marquee');
  document.body.classList.add('no-marquee');
}
document.getElementById('marqueeClose')?.addEventListener('click', () => {
  marqueeBar.classList.add('hidden');
  navbar.classList.add('no-marquee');
  document.body.classList.add('no-marquee');
  sessionStorage.setItem(MARQUEE_KEY, '1');
});

// ===== NAVBAR SCROLL EFFECT =====
let lastScroll = 0;
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  navbar.classList.toggle('scrolled', scrollY > 80);
  lastScroll = scrollY;
});

// ===== SEARCH PANEL =====
const searchBtn = document.getElementById('searchBtn');
const searchPanel = document.getElementById('searchPanel');
const searchHint = document.getElementById('searchHint');
const searchInput = document.getElementById('searchInput');
searchBtn?.addEventListener('click', () => {
  searchPanel.classList.toggle('open');
  if (searchPanel.classList.contains('open')) {
    searchInput?.focus();
  } else if (searchHint) {
    searchHint.hidden = true;
  }
});
// 按下搜尋 or Enter → 顯示「開發中」提示
searchPanel?.addEventListener('submit', () => {
  if (searchHint) {
    searchHint.hidden = false;
    clearTimeout(searchPanel._hintTimer);
    searchPanel._hintTimer = setTimeout(() => { searchHint.hidden = true; }, 3000);
  }
});

// ===== HAMBURGER (MOBILE) =====
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger?.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});
// Close mobile menu on link click
mobileMenu?.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

// ===== HERO THUMB SWITCHER =====
const thumbs = document.querySelectorAll('.thumb');
const heroBgImg = document.getElementById('heroBgImg');
const heroTitle = document.getElementById('heroTitle');
const heroDesc = document.getElementById('heroDesc');
const heroMeta = document.getElementById('heroMeta');
const heroBadgeText = document.getElementById('heroBadgeText');

let currentThumb = 0;
let thumbAutoTimer;

function activateThumb(i, manual = false) {
  thumbs.forEach(t => t.classList.remove('active'));
  const thumb = thumbs[i];
  thumb.classList.add('active');
  currentThumb = i;

  // Fade effect
  heroTitle.style.opacity = 0;
  heroDesc.style.opacity = 0;
  heroBgImg.style.opacity = 0.3;

  setTimeout(() => {
    heroBgImg.src = thumb.dataset.bg;
    heroTitle.textContent = thumb.dataset.title;
    heroDesc.textContent = thumb.dataset.desc;
    if (heroBadgeText && thumb.dataset.tag) heroBadgeText.textContent = thumb.dataset.tag;
    heroMeta.innerHTML = `
      <div class="meta-item"><span class="meta-label">評分</span><span class="meta-val">⭐ ${thumb.dataset.rating}</span></div>
      <div class="meta-item"><span class="meta-label">線上</span><span class="meta-val">🔥 ${thumb.dataset.online}</span></div>
      <div class="meta-item"><span class="meta-label">平台</span><span class="meta-val">${thumb.dataset.platform}</span></div>
    `;
    heroTitle.style.opacity = 1;
    heroDesc.style.opacity = 1;
    heroBgImg.style.opacity = 1;
  }, 250);

  if (manual) {
    clearInterval(thumbAutoTimer);
    startThumbAuto();
  }
}

thumbs.forEach((t, i) => {
  t.addEventListener('click', () => activateThumb(i, true));
});

function startThumbAuto() {
  thumbAutoTimer = setInterval(() => {
    activateThumb((currentThumb + 1) % thumbs.length);
  }, 6000);
}
startThumbAuto();

// ===== STATS COUNTER ANIMATION (data-count 一次性遞增) =====
const statNums = document.querySelectorAll('.stat-num[data-count]');
let statsAnimated = false;
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !statsAnimated) {
      statsAnimated = true;
      statNums.forEach(el => {
        const target = parseInt(el.dataset.count, 10);
        const duration = 2000;
        const start = performance.now();
        function animateCount(now) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.floor(eased * target).toLocaleString();
          if (progress < 1) requestAnimationFrame(animateCount);
          else el.textContent = target.toLocaleString();
        }
        requestAnimationFrame(animateCount);
      });
    }
  });
}, { threshold: 0.3 });
document.querySelector('.stats-bar') && statsObserver.observe(document.querySelector('.stats-bar'));

// ===== LIVE ONLINE COUNTER (模擬即時) =====
const liveEl = document.getElementById('liveOnline');
if (liveEl) {
  let base = 24500 + Math.floor(Math.random() * 2000);
  const renderLive = () => {
    base += Math.floor(Math.random() * 60) - 25;
    if (base < 22000) base = 22000;
    if (base > 32000) base = 32000;
    liveEl.textContent = base.toLocaleString();
  };
  renderLive();
  setInterval(renderLive, 3500);
}

// ===== NEXT MATCH COUNTDOWN (今晚 20:00 例行賽，過了就明天) =====
const nextMatchEl = document.getElementById('nextMatch');
if (nextMatchEl) {
  const renderNext = () => {
    const now = new Date();
    const target = new Date(now);
    target.setHours(20, 0, 0, 0);
    if (now >= target) target.setDate(target.getDate() + 1);
    const diff = target - now;
    const h = String(Math.floor(diff / 3600000)).padStart(2, '0');
    const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
    const s = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
    nextMatchEl.textContent = `${h}:${m}:${s}`;
  };
  renderNext();
  setInterval(renderNext, 1000);
}

// ===== SHOWCASE FILTER + RAIL NAV =====
const chips = document.querySelectorAll('.chip');
const showCards = document.querySelectorAll('.show-card');
const rail = document.getElementById('showcaseRail');
const railPrev = document.getElementById('railPrev');
const railNext = document.getElementById('railNext');

// Filter chips 顯示每個類別的遊戲數
chips.forEach(chip => {
  const f = chip.dataset.filter;
  const count = f === 'all'
    ? showCards.length
    : Array.from(showCards).filter(c => c.dataset.cat === f).length;
  const countEl = chip.querySelector('.chip-count');
  if (countEl) countEl.textContent = count;
});

chips.forEach(chip => {
  chip.addEventListener('click', () => {
    chips.forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    const filter = chip.dataset.filter;
    showCards.forEach(card => {
      card.classList.toggle('hide', !(filter === 'all' || card.dataset.cat === filter));
    });
    rail?.scrollTo({ left: 0, behavior: 'smooth' });
    setTimeout(updateRailNav, 300);
  });
});

function scrollRailBy(dir) {
  if (!rail) return;
  const card = rail.querySelector('.show-card:not(.hide)');
  const step = (card ? card.offsetWidth : 300) + 20;
  rail.scrollBy({ left: dir * step, behavior: 'smooth' });
}
function updateRailNav() {
  if (!rail || !railPrev || !railNext) return;
  railPrev.toggleAttribute('disabled', rail.scrollLeft <= 4);
  railNext.toggleAttribute('disabled',
    rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 4);
}
railPrev?.addEventListener('click', () => scrollRailBy(-1));
railNext?.addEventListener('click', () => scrollRailBy(1));
rail?.addEventListener('scroll', updateRailNav, { passive: true });
window.addEventListener('resize', updateRailNav);
updateRailNav();

// ===== MEDIA LIGHTBOX（截圖 + QR 放大共用） =====
const mediaModal = document.getElementById('mediaModal');
const mediaImg = document.getElementById('mediaImg');
const mediaTitle = document.getElementById('mediaTitle');
const mediaThumbsWrap = document.getElementById('mediaThumbs');
const mediaHint = document.getElementById('mediaHint');
const mediaStage = document.getElementById('mediaStage');
const mediaPrev = document.getElementById('mediaPrev');
const mediaNext = document.getElementById('mediaNext');
let mediaList = [];
let mediaIdx = 0;

function renderMedia(i) {
  mediaIdx = (i + mediaList.length) % mediaList.length;
  mediaImg.style.opacity = 0;
  setTimeout(() => {
    mediaImg.src = mediaList[mediaIdx];
    mediaImg.style.opacity = 1;
  }, 120);
  mediaThumbsWrap.querySelectorAll('button').forEach((b, k) => {
    b.classList.toggle('active', k === mediaIdx);
  });
}
function openMedia({ title, images, mode, hint }) {
  mediaList = images;
  mediaTitle.textContent = title;
  mediaStage.classList.toggle('qr-mode', mode === 'qr');
  mediaHint.textContent = hint || '';
  mediaThumbsWrap.innerHTML = '';
  const showNav = images.length > 1;
  mediaPrev.hidden = !showNav;
  mediaNext.hidden = !showNav;
  mediaThumbsWrap.style.display = showNav ? 'flex' : 'none';
  if (showNav) {
    images.forEach((src, k) => {
      const b = document.createElement('button');
      b.type = 'button';
      const t = document.createElement('img');
      t.src = src;
      t.alt = '';
      b.appendChild(t);
      b.addEventListener('click', () => renderMedia(k));
      mediaThumbsWrap.appendChild(b);
    });
  }
  renderMedia(0);
  mediaModal.classList.add('open');
  mediaModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}
function closeMedia() {
  mediaModal.classList.remove('open');
  mediaModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}
mediaModal?.querySelectorAll('[data-close]').forEach(el => el.addEventListener('click', closeMedia));
mediaPrev?.addEventListener('click', () => renderMedia(mediaIdx - 1));
mediaNext?.addEventListener('click', () => renderMedia(mediaIdx + 1));

// Hero 查看截圖
document.getElementById('heroScreensBtn')?.addEventListener('click', () => {
  const activeThumb = document.querySelector('.thumb.active');
  if (!activeThumb) return;
  const screens = (activeThumb.dataset.screens || '').split('|').filter(Boolean);
  if (!screens.length) return;
  openMedia({
    title: activeThumb.dataset.title + '　遊戲畫面',
    images: screens,
    mode: 'screens',
    hint: `共 ${screens.length} 張，點選縮圖或使用 ← / → 切換`,
  });
});

// Showcase 卡片 QR 放大
document.querySelectorAll('.show-qr').forEach(btn => {
  btn.addEventListener('click', () => {
    openMedia({
      title: btn.dataset.qrName + ' · 行動下載',
      images: [btn.dataset.qr],
      mode: 'qr',
      hint: '請使用手機相機掃描 QR Code 下載 App',
    });
  });
});

// ===== NAV ACTIVE ON SCROLL =====
const sections = document.querySelectorAll('section[id], div[id="leaderboard"], div[id="feed"]');
const navLinks = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 200) current = s.id;
  });
  navLinks.forEach(a => {
    const isActive = a.getAttribute('href') === '#' + current;
    a.classList.toggle('active', isActive);
    if (isActive) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
});

// ===== COUNTDOWN （由 data-target 決定目標時間，避免刷新重算） =====
const countdownEl = document.getElementById('eventCountdown');
if (countdownEl) {
  const target = new Date(countdownEl.dataset.target || Date.now() + 86400000).getTime();
  const bs = countdownEl.querySelectorAll('b');
  const render = () => {
    const diff = target - Date.now();
    if (diff <= 0) {
      if (bs.length >= 3) bs.forEach(b => (b.textContent = '00'));
      return;
    }
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    if (bs.length >= 3) {
      bs[0].textContent = String(days).padStart(2, '0');
      bs[1].textContent = String(hours).padStart(2, '0');
      bs[2].textContent = String(mins).padStart(2, '0');
    }
  };
  render();
  setInterval(render, 60000);
}

// ===== BACK TO TOP =====
const backTop = document.getElementById('backTop');
window.addEventListener('scroll', () => {
  backTop?.classList.toggle('show', window.scrollY > 500);
});
backTop?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===== REVEAL ANIMATION =====
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.show-card, .event-big, .event-row, .feed-item, .rank-list li, .stat').forEach(el => {
  el.classList.add('reveal');
  revealObserver.observe(el);
});

// ===== Keyboard Shortcut: Ctrl+K for search =====
document.addEventListener('keydown', (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault();
    searchPanel?.classList.add('open');
    searchPanel?.querySelector('input')?.focus();
  }
  if (e.key === 'Escape') {
    searchPanel?.classList.remove('open');
    mobileMenu?.classList.remove('open');
    if (mediaModal?.classList.contains('open')) closeMedia();
  }
  if (mediaModal?.classList.contains('open')) {
    if (e.key === 'ArrowLeft') renderMedia(mediaIdx - 1);
    if (e.key === 'ArrowRight') renderMedia(mediaIdx + 1);
  }
});
