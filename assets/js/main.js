/**
 * YUSHINMARU (有真丸) - Vibrant Marine Blue & Pure White Engine
 * Video Hero Scroll-Driven Interaction, Clean Nav Control & Smooth Animations
 */

document.addEventListener('DOMContentLoaded', () => {
  initSplashScreen();
  initHeaderScroll();
  initMobileNav();
  initScrollVideoHero();
  initSmoothScroll();
});

/* -------------------------------------------------------------------------- */
/* 1. Opening Calligraphy Brush Splash Screen (毛筆風 ズームアップ演出)        */
/* -------------------------------------------------------------------------- */
function initSplashScreen() {
  const splashScreen = document.getElementById('splash-screen');
  if (!splashScreen) return;

  setTimeout(() => {
    splashScreen.style.display = 'none';
  }, 3600);
}

/* -------------------------------------------------------------------------- */
/* 2. Header Scroll Effect                                                     */
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

  navLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });
}

/* -------------------------------------------------------------------------- */
/* 4. Scroll-Driven Video Hero Effect (有真丸動画スクロール連動演出)           */
/* -------------------------------------------------------------------------- */
function initScrollVideoHero() {
  const heroSection = document.getElementById('hero');
  const heroVideo = document.getElementById('hero-video');
  const heroContent = document.querySelector('.hero-content');

  if (!heroSection || !heroVideo) return;

  // 確実に自動再生させるための発火処理
  heroVideo.muted = true;
  heroVideo.play().catch(err => {
    console.log('Autoplay prevented, user interaction required:', err);
  });

  let ticking = false;

  function updateVideoOnScroll() {
    const scrollY = window.scrollY;
    const heroHeight = heroSection.offsetHeight || window.innerHeight;

    if (scrollY <= heroHeight) {
      const scrollRatio = scrollY / heroHeight;

      // 動画のスケール＆ブラー連動（スクロールするにつれて動画が拡大・トーン調整）
      const videoScale = 1.05 + scrollRatio * 0.15;
      const videoBrightness = Math.max(0.4, 0.85 - scrollRatio * 0.3);

      heroVideo.style.transform = `scale(${videoScale})`;
      heroVideo.style.filter = `brightness(${videoBrightness}) contrast(1.05)`;

      // テキストコンテンツのパララックス＆フェードアウト
      if (heroContent) {
        const contentTranslateY = scrollY * 0.4;
        const contentOpacity = Math.max(0, 1 - scrollRatio * 1.4);

        heroContent.style.transform = `translateY(${contentTranslateY}px)`;
        heroContent.style.opacity = contentOpacity;
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

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        heroVideo.play().catch(() => {});
      } else {
        heroVideo.pause();
      }
    });
  }, { threshold: 0.1 });

  observer.observe(heroSection);
}

/* -------------------------------------------------------------------------- */
/* 5. Smooth Scroll                                                            */
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
