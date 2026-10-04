/**
 * YUSHINMARU (有真丸) - Vibrant Marine Blue & Pure White Engine
 * Interactive Controls, Catch Filter, A4 License Zoom, Modals & Video Parallax
 */

document.addEventListener('DOMContentLoaded', () => {
  initSplashScreen();
  initHeaderScroll();
  initMobileNav();
  initScrollVideoHero();
  initBoatVideoModal();
  initCatchFilterAndLightbox();
  initLicenseModal();
  initReservationForm();
  initSmoothScroll();
});

/* -------------------------------------------------------------------------- */
/* 1. Splash Screen Timeout                                                   */
/* -------------------------------------------------------------------------- */
function initSplashScreen() {
  const splashScreen = document.getElementById('splash-screen');
  if (!splashScreen) return;
  setTimeout(() => {
    splashScreen.style.display = 'none';
  }, 3600);
}

/* -------------------------------------------------------------------------- */
/* 2. Header Scroll Backdrop                                                  */
/* -------------------------------------------------------------------------- */
function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  function checkScroll() {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', checkScroll, { passive: true });
  checkScroll();
}

/* -------------------------------------------------------------------------- */
/* 3. Mobile Navigation Drawer                                                 */
/* -------------------------------------------------------------------------- */
function initMobileNav() {
  const toggleBtn = document.querySelector('.mobile-nav-toggle');
  const drawer = document.querySelector('.mobile-drawer');
  const overlay = document.querySelector('.drawer-overlay');
  const closeBtn = document.querySelector('.drawer-close');
  const navLinks = document.querySelectorAll('.mobile-nav-link');

  if (!toggleBtn || !drawer || !overlay) return;

  function openDrawer() {
    drawer.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  toggleBtn.addEventListener('click', openDrawer);
  closeBtn?.addEventListener('click', closeDrawer);
  overlay.addEventListener('click', closeDrawer);
  navLinks.forEach(link => link.addEventListener('click', closeDrawer));
}

/* -------------------------------------------------------------------------- */
/* 4. Scroll Video Hero Effect                                                */
/* -------------------------------------------------------------------------- */
function initScrollVideoHero() {
  const heroSection = document.getElementById('hero');
  const heroVideo = document.getElementById('hero-video');
  const heroContent = document.querySelector('.hero-content');

  if (!heroSection || !heroVideo) return;

  heroVideo.muted = true;
  heroVideo.play().catch(err => console.log('Autoplay deferred:', err));

  let ticking = false;

  function updateVideoOnScroll() {
    const scrollY = window.scrollY;
    const heroHeight = heroSection.offsetHeight || window.innerHeight;

    if (scrollY <= heroHeight) {
      const scrollRatio = scrollY / heroHeight;
      const videoScale = 1.05 + scrollRatio * 0.15;
      const videoBrightness = Math.max(0.45, 0.85 - scrollRatio * 0.3);

      heroVideo.style.transform = `scale(${videoScale})`;
      heroVideo.style.filter = `brightness(${videoBrightness}) contrast(1.05)`;

      if (heroContent) {
        heroContent.style.transform = `translateY(${scrollY * 0.35}px)`;
        heroContent.style.opacity = Math.max(0, 1 - scrollRatio * 1.3);
      }
    }
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateVideoOnScroll);
      ticking = true;
    }
  }, { passive: true });
}

/* -------------------------------------------------------------------------- */
/* 5. Boat Video Modal                                                        */
/* -------------------------------------------------------------------------- */
function initBoatVideoModal() {
  const openBtn = document.getElementById('btn-open-boat-video');
  const closeBtn = document.getElementById('btn-close-boat-video');
  const modal = document.getElementById('boat-video-modal');
  const video = document.getElementById('boat-modal-video');

  if (!openBtn || !modal) return;

  openBtn.addEventListener('click', () => {
    modal.classList.add('active');
    if (video) video.play();
  });

  function closeModal() {
    modal.classList.remove('active');
    if (video) video.pause();
  }

  closeBtn?.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
}

/* -------------------------------------------------------------------------- */
/* 6. Catch Gallery Filter & Lightbox                                         */
/* -------------------------------------------------------------------------- */
function initCatchFilterAndLightbox() {
  const filterBtns = document.querySelectorAll('.catch-filter-bar .filter-btn');
  const catchCards = document.querySelectorAll('.catch-card');
  const lightbox = document.getElementById('catch-lightbox');
  const closeBtn = document.getElementById('btn-close-catch-modal');
  const modalImg = document.getElementById('catch-modal-img');
  const modalTitle = document.getElementById('catch-modal-title');
  const modalSpecs = document.getElementById('catch-modal-specs');
  const modalComment = document.getElementById('catch-modal-comment');
  const modalCat = document.getElementById('catch-modal-category');

  // Filter functionality
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      catchCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Lightbox functionality
  catchCards.forEach(card => {
    card.addEventListener('click', () => {
      const img = card.querySelector('img')?.src;
      const title = card.querySelector('.catch-title')?.textContent;
      const specs = card.querySelector('.catch-specs')?.textContent;
      const comment = card.querySelector('.catch-comment')?.textContent;
      const cat = card.querySelector('.catch-category-tag')?.textContent;

      if (lightbox && modalImg) {
        modalImg.src = img || '';
        if (modalTitle) modalTitle.textContent = title || '';
        if (modalSpecs) modalSpecs.textContent = specs || '';
        if (modalComment) modalComment.textContent = comment || '';
        if (modalCat) modalCat.textContent = cat || '';

        lightbox.classList.add('active');
      }
    });
  });

  closeBtn?.addEventListener('click', () => lightbox?.classList.remove('active'));
  lightbox?.addEventListener('click', (e) => {
    if (e.target === lightbox) lightbox.classList.remove('active');
  });
}

/* -------------------------------------------------------------------------- */
/* 7. License Documents Zoom Lightbox (A4 5 Documents)                        */
/* -------------------------------------------------------------------------- */
function initLicenseModal() {
  const wrappers = document.querySelectorAll('.license-paper-wrapper');
  const modal = document.getElementById('license-modal');
  const closeBtn = document.getElementById('btn-close-license-modal');
  const modalImg = document.getElementById('license-modal-img');
  const modalTitle = document.getElementById('license-modal-title');

  if (!modal) return;

  wrappers.forEach(wrap => {
    wrap.addEventListener('click', () => {
      const docSrc = wrap.getAttribute('data-doc');
      const docTitle = wrap.getAttribute('data-title');

      if (modalImg) modalImg.src = docSrc || '';
      if (modalTitle) modalTitle.textContent = docTitle || '遊漁船業者票';

      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  closeBtn?.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
}

/* -------------------------------------------------------------------------- */
/* 8. Web Reservation Form Submission & Success Modal                         */
/* -------------------------------------------------------------------------- */
function initReservationForm() {
  const form = document.getElementById('reservation-form');
  const modal = document.getElementById('form-modal');
  const closeBtn = document.getElementById('btn-close-form-modal');

  if (!form || !modal) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    modal.classList.add('active');
    form.reset();
  });

  closeBtn?.addEventListener('click', () => {
    modal.classList.remove('active');
  });
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('active');
  });
}

/* -------------------------------------------------------------------------- */
/* 9. Smooth Scroll for Anchor Links                                          */
/* -------------------------------------------------------------------------- */
function initSmoothScroll() {
  const internalLinks = document.querySelectorAll('a[href^="#"]');

  internalLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#' || !href) return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const headerHeight = document.querySelector('.site-header')?.offsetHeight || 70;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}
