/**
 * 有真丸 YUSHINMARU
 */

document.addEventListener('DOMContentLoaded', () => {
  initScrollbarVar();
  initMenu();
  initStage();
  initParallax();
  initReveal();
  initBoatVideoModal();
  initCatchFilterAndLightbox();
  initLicenseModal();
  initReservationForm();
  initSmoothScroll();
});

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* -------------------------------------------------------------------------- */
/* Scroll helper: one rAF loop for every scroll-linked effect                 */
/* -------------------------------------------------------------------------- */
const scrollHandlers = [];
let ticking = false;
function onScroll(fn) {
  scrollHandlers.push(fn);
  fn();
}
function runScrollHandlers() {
  scrollHandlers.forEach(fn => fn());
  ticking = false;
}
window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(runScrollHandlers);
    ticking = true;
  }
}, { passive: true });
window.addEventListener('resize', runScrollHandlers);

/* -------------------------------------------------------------------------- */
/* Scrollbar width → CSS var (grid is computed from viewport width)           */
/* -------------------------------------------------------------------------- */
function initScrollbarVar() {
  const set = () => {
    const sbw = window.innerWidth - document.documentElement.clientWidth;
    document.documentElement.style.setProperty('--sbw', `${sbw}px`);
  };
  set();
  window.addEventListener('resize', set);
}

/* -------------------------------------------------------------------------- */
/* Modal helpers                                                              */
/* -------------------------------------------------------------------------- */
function openModal(modal) {
  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('is-locked');
}

function closeModal(modal) {
  modal.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('is-locked');
}

function bindModalClose(modal, closeBtn, onClose) {
  const close = () => {
    closeModal(modal);
    onClose?.();
  };
  closeBtn?.addEventListener('click', close);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) close();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) close();
  });
}

/* -------------------------------------------------------------------------- */
/* Menu overlay                                                               */
/* -------------------------------------------------------------------------- */
function initMenu() {
  const btn = document.querySelector('.menu-btn');
  const menu = document.getElementById('menu');
  if (!btn || !menu) return;

  function setOpen(open) {
    menu.classList.toggle('is-open', open);
    menu.setAttribute('aria-hidden', String(!open));
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-label', open ? 'メニューを閉じる' : 'メニューを開く');
    document.body.classList.toggle('is-locked', open);
    document.body.classList.toggle('menu-open', open);
  }

  btn.addEventListener('click', () => setOpen(!menu.classList.contains('is-open')));
  menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setOpen(false)));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('is-open')) setOpen(false);
  });
}

/* -------------------------------------------------------------------------- */
/* Fixed video stage: darken over the about text, show fixed logo             */
/* -------------------------------------------------------------------------- */
function initStage() {
  const video = document.getElementById('hero-video');
  const shade = document.querySelector('.stage-shade');
  const cover = document.querySelector('.cover');
  const coverLogo = document.querySelector('.cover-logo');
  const logo = document.querySelector('.fixed-logo');
  const cats = document.querySelectorAll('.cat');

  if (video) {
    video.muted = true;
    video.play().catch(() => {});
  }

  onScroll(() => {
    const y = window.scrollY;
    const vh = window.innerHeight;
    const r = Math.min(1, y / vh);

    if (shade) shade.style.opacity = String(0.12 + r * 0.6);
    if (coverLogo && !reduceMotion) {
      coverLogo.style.opacity = String(Math.max(0, 1 - r * 1.6));
      coverLogo.style.transform = `translateY(${y * -0.15}px)`;
    }
    if (logo && cover) logo.classList.toggle('is-shown', y > cover.offsetHeight * 0.6);

    cats.forEach(cat => {
      const rect = cat.getBoundingClientRect();
      cat.classList.toggle('is-active', rect.top < vh * 0.5 && rect.bottom > vh * 0.5);
    });
  });
}

/* -------------------------------------------------------------------------- */
/* Parallax for scattered images                                              */
/* -------------------------------------------------------------------------- */
function initParallax() {
  const items = [...document.querySelectorAll('[data-speed]')];
  if (!items.length || reduceMotion) return;

  onScroll(() => {
    const vh = window.innerHeight;
    items.forEach(el => {
      const rect = el.parentElement.getBoundingClientRect();
      if (rect.bottom < -vh || rect.top > vh * 2) return;
      const top = el.offsetTop + rect.top;
      const offset = (top + el.offsetHeight / 2 - vh / 2) * parseFloat(el.dataset.speed);
      el.style.transform = `translate3d(0, ${-offset}px, 0)`;
    });
  });
}

/* -------------------------------------------------------------------------- */
/* Fade-in on scroll                                                          */
/* -------------------------------------------------------------------------- */
function initReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    items.forEach(el => el.classList.add('is-in'));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -10% 0px' });

  items.forEach(el => io.observe(el));
}

/* -------------------------------------------------------------------------- */
/* Boat video modal                                                           */
/* -------------------------------------------------------------------------- */
function initBoatVideoModal() {
  const openBtn = document.getElementById('btn-open-boat-video');
  const modal = document.getElementById('boat-video-modal');
  const video = document.getElementById('boat-modal-video');
  if (!openBtn || !modal) return;

  openBtn.addEventListener('click', () => {
    openModal(modal);
    video?.play().catch(() => {});
  });

  bindModalClose(modal, document.getElementById('btn-close-boat-video'), () => video?.pause());
}

/* -------------------------------------------------------------------------- */
/* Catch filter & lightbox                                                    */
/* -------------------------------------------------------------------------- */
function initCatchFilterAndLightbox() {
  const grid = document.getElementById('catch-grid');
  const filterBtns = document.querySelectorAll('.catch-filter .filter-btn');
  const cards = document.querySelectorAll('.catch-card');
  const lightbox = document.getElementById('catch-lightbox');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.toggle('is-active', b === btn));
      const filter = btn.dataset.filter;
      grid?.classList.toggle('is-filtered', filter !== 'all');
      cards.forEach(card => {
        card.classList.toggle('is-hidden', filter !== 'all' && card.dataset.category !== filter);
      });
    });
  });

  if (!lightbox) return;

  const modalImg = document.getElementById('catch-modal-img');
  const fields = [
    [document.getElementById('catch-modal-title'), '.catch-title'],
    [document.getElementById('catch-modal-specs'), '.catch-specs'],
    [document.getElementById('catch-modal-comment'), '.catch-comment'],
    [document.getElementById('catch-modal-category'), '.catch-category-tag'],
  ];

  cards.forEach(card => {
    card.addEventListener('click', () => {
      const img = card.querySelector('img');
      if (modalImg && img) {
        modalImg.src = img.src;
        modalImg.alt = img.alt;
      }
      fields.forEach(([target, selector]) => {
        if (target) target.textContent = card.querySelector(selector)?.textContent || '';
      });
      openModal(lightbox);
    });
  });

  bindModalClose(lightbox, document.getElementById('btn-close-catch-modal'));
}

/* -------------------------------------------------------------------------- */
/* License modal                                                              */
/* -------------------------------------------------------------------------- */
function initLicenseModal() {
  const modal = document.getElementById('license-modal');
  const modalImg = document.getElementById('license-modal-img');
  const modalTitle = document.getElementById('license-modal-title');
  if (!modal) return;

  document.querySelectorAll('.license-paper-wrapper').forEach(wrap => {
    wrap.addEventListener('click', () => {
      const title = wrap.dataset.title || '遊漁船業者票';
      if (modalImg) {
        modalImg.src = wrap.dataset.doc || '';
        modalImg.alt = title;
      }
      if (modalTitle) modalTitle.textContent = title;
      openModal(modal);
    });
  });

  bindModalClose(modal, document.getElementById('btn-close-license-modal'));
}

/* -------------------------------------------------------------------------- */
/* Reservation form                                                           */
/* -------------------------------------------------------------------------- */
function initReservationForm() {
  const form = document.getElementById('reservation-form');
  const modal = document.getElementById('form-modal');
  if (!form || !modal) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    openModal(modal);
    form.reset();
  });

  bindModalClose(modal, document.getElementById('btn-close-form-modal'));
}

/* -------------------------------------------------------------------------- */
/* Smooth scroll                                                              */
/* -------------------------------------------------------------------------- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      const top = href === '#top' ? 0 : target.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  });
}
