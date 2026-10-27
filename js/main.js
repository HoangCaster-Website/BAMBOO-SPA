/**
 * BAMBOO SPA - Main JavaScript
 * Handles core site functionality: navigation, hero slider, scroll effects,
 * cookie consent, booking, and general UI interactions.
 *
 * @version 1.0.0
 * @author Bamboo Spa Development
 */

/* ==========================================================================
   Configuration
   ========================================================================== */

/**
 * Online booking URL — replace with the real Treatwell (or other provider)
 * URL once it is available. While the value is '#', clicking the booking
 * button will show a "coming soon" message instead of navigating away.
 */
const BOOKING_URL = '#'; // TODO: Replace with Treatwell booking URL

/** Scroll distance (px) before the header gets the "scrolled" style */
const HEADER_SCROLL_THRESHOLD = 100;

/** Scroll distance (px) before the scroll-to-top button appears */
const SCROLL_TOP_THRESHOLD = 500;

/** Hero slider auto-advance interval in milliseconds */
const SLIDER_INTERVAL = 6000;

/** Intersection Observer threshold for scroll-reveal elements */
const REVEAL_THRESHOLD = 0.15;

/** Delay (ms) before the cookie banner appears (if not yet accepted) */
const COOKIE_BANNER_DELAY = 2000;

/* ==========================================================================
   Utility helpers
   ========================================================================== */

/**
 * Shorthand querySelector / querySelectorAll wrappers.
 */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/**
 * Lock or unlock body scrolling (used by mobile menu & lightbox).
 * @param {boolean} lock - true to lock, false to unlock
 */
function lockBodyScroll(lock) {
  document.body.style.overflow = lock ? 'hidden' : '';
  document.body.classList.toggle('scroll-locked', lock);
}

/**
 * Check if user prefers reduced motion.
 * @returns {boolean}
 */
function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/* ==========================================================================
   Preloader
   ========================================================================== */

function initPreloader() {
  const preloader = $('.preloader, #preloader');
  if (!preloader) return;

  const hide = () => {
    preloader.classList.add('preloader--hidden');
    preloader.style.opacity = '0';
    preloader.style.visibility = 'hidden';
    // Remove from DOM after the CSS transition finishes
    preloader.addEventListener('transitionend', () => {
      preloader.remove();
    }, { once: true });
    // Fallback removal if transitionend never fires
    setTimeout(() => {
      if (preloader.parentNode) preloader.remove();
    }, 1200);
  };

  if (document.readyState === 'complete') {
    setTimeout(hide, 200);
  } else {
    window.addEventListener('load', hide, { once: true });
    // Safety fallback
    setTimeout(hide, 3000);
  }
}

/* ==========================================================================
   Sticky Header
   ========================================================================== */

function initStickyHeader() {
  const header = $('.header');
  if (!header) return;

  let ticking = false;

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      header.classList.toggle('header--scrolled', window.scrollY > HEADER_SCROLL_THRESHOLD);
      ticking = false;
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  // Run once on load in case the page is already scrolled
  onScroll();
}

/* ==========================================================================
   Mobile Navigation
   ========================================================================== */

function initMobileNav() {
  const toggle = $('.nav__toggle, .nav-toggle, #navToggle, #nav-toggle');
  const nav = $('.nav__menu, .nav-menu, #navMenu, #nav-menu');
  const header = $('.header');
  if (!toggle || !nav) return;

  const links = $$('a', nav);
  const overlay = $('.nav__overlay');

  function openMenu() {
    toggle.classList.add('nav__toggle--active', 'active');
    toggle.setAttribute('aria-expanded', 'true');
    nav.classList.add('nav__menu--open', 'active');
    if (header) header.classList.add('header--menu-open');
    if (overlay) overlay.classList.add('nav__overlay--visible');
    lockBodyScroll(true);
  }

  function closeMenu() {
    toggle.classList.remove('nav__toggle--active', 'active');
    toggle.setAttribute('aria-expanded', 'false');
    nav.classList.remove('nav__menu--open', 'active');
    if (header) header.classList.remove('header--menu-open');
    if (overlay) overlay.classList.remove('nav__overlay--visible');
    lockBodyScroll(false);
  }

  function isOpen() {
    return nav.classList.contains('nav__menu--open');
  }

  // Hamburger button
  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    isOpen() ? closeMenu() : openMenu();
  });

  // Close when a nav link is clicked (smooth-scroll will take over)
  links.forEach((link) => {
    link.addEventListener('click', () => {
      if (isOpen()) closeMenu();
    });
  });

  // Close on overlay click
  if (overlay) {
    overlay.addEventListener('click', closeMenu);
  }

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (isOpen() && !nav.contains(e.target) && !toggle.contains(e.target)) {
      closeMenu();
    }
  });

  // Expose closeMenu globally so other modules (e.g. Escape key) can use it
  window._closeMobileMenu = closeMenu;
  window._isMobileMenuOpen = isOpen;
}

/* ==========================================================================
   Smooth Scrolling for anchor links
   ========================================================================== */

function initSmoothScroll() {
  document.addEventListener('click', (e) => {
    const anchor = e.target.closest('a[href^="#"]');
    if (!anchor) return;

    const targetId = anchor.getAttribute('href');
    if (targetId === '#' || targetId === '#!' || !targetId) return;

    const target = document.querySelector(targetId);
    if (!target) return;

    e.preventDefault();

    const header = $('.header');
    const headerOffset = header ? header.offsetHeight : 0;
    const top = target.getBoundingClientRect().top + window.scrollY - headerOffset;

    window.scrollTo({
      top,
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    });

    // Update URL hash without jumping
    history.pushState(null, '', targetId);
  });
}

/* ==========================================================================
   Hero Slider
   ========================================================================== */

function initHeroSlider() {
  const slider = $('.hero__slider, .hero-slider');
  if (!slider) return;

  const slides = $$('.hero__slide, .hero-slide', slider);
  const dots = $$('.hero__dot, .hero-dot');
  const counter = $('.hero__counter, .hero-counter');
  const totalSlides = slides.length;

  if (totalSlides === 0) return;

  let currentIndex = 0;
  let previousIndex = -1;
  let autoplayTimer = null;
  let isPaused = false;

  /**
   * Format slide number with leading zero.
   * @param {number} n
   * @returns {string}
   */
  const pad = (n) => String(n).padStart(2, '0');

  /**
   * Update the visible counter text, e.g. "02 / 03".
   */
  function updateCounter() {
    if (!counter) return;
    const current = counter.querySelector('.hero__counter-current, .hero-counter-current');
    const total = counter.querySelector('.hero__counter-total, .hero-counter-total');
    if (current) current.textContent = pad(currentIndex + 1);
    if (total) total.textContent = pad(totalSlides);
    // Fallback: if no sub-elements, set directly
    if (!current && !total) {
      counter.textContent = `${pad(currentIndex + 1)} / ${pad(totalSlides)}`;
    }
  }

  /**
   * Update active dot / pagination indicator.
   */
  function updateDots() {
    dots.forEach((dot, i) => {
      dot.classList.toggle('hero__dot--active', i === currentIndex);
      dot.classList.toggle('active', i === currentIndex);
      dot.setAttribute('aria-current', i === currentIndex ? 'true' : 'false');
    });
  }

  /**
   * Transition to a given slide index.
   * @param {number} index
   */
  function goToSlide(index) {
    if (index === currentIndex && previousIndex !== -1) return;

    previousIndex = currentIndex;
    currentIndex = (index + totalSlides) % totalSlides;

    slides.forEach((slide, i) => {
      slide.classList.remove('slide--active', 'slide--prev', 'active');
      if (i === currentIndex) {
        slide.classList.add('slide--active', 'active');
      } else if (i === previousIndex) {
        slide.classList.add('slide--prev');
      }
    });

    updateCounter();
    updateDots();
  }

  function nextSlide() {
    goToSlide(currentIndex + 1);
  }

  /* -- Autoplay ---------------------------------------------------------- */

  function startAutoplay() {
    stopAutoplay();
    if (prefersReducedMotion()) return;
    autoplayTimer = setInterval(() => {
      if (!isPaused) nextSlide();
    }, SLIDER_INTERVAL);
  }

  function stopAutoplay() {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  }

  // Pause on hover
  slider.addEventListener('mouseenter', () => { isPaused = true; });
  slider.addEventListener('mouseleave', () => { isPaused = false; });

  // Dot navigation
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      goToSlide(i);
      startAutoplay(); // reset timer on manual interaction
    });
  });

  // Arrow navigation (if present)
  const prevBtn = $('.hero__arrow--prev', slider);
  const nextBtn = $('.hero__arrow--next', slider);
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      goToSlide(currentIndex - 1);
      startAutoplay();
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      goToSlide(currentIndex + 1);
      startAutoplay();
    });
  }

  // Initialize first slide
  goToSlide(0);
  startAutoplay();
}

/* ==========================================================================
   Scroll Reveal (Intersection Observer)
   ========================================================================== */

function initScrollReveal() {
  if (prefersReducedMotion()) {
    // Instantly reveal everything if reduced motion is preferred
    $$('.reveal, .reveal-left, .reveal-right, .reveal-up, .reveal-scale').forEach((el) => {
      el.classList.add('revealed');
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const el = entry.target;
        const delay = parseInt(el.dataset.delay, 10) || 0;

        if (delay > 0) {
          setTimeout(() => el.classList.add('revealed'), delay);
        } else {
          el.classList.add('revealed');
        }

        // Stop observing after reveal (one-time animation)
        observer.unobserve(el);
      });
    },
    { threshold: REVEAL_THRESHOLD },
  );

  $$('.reveal, .reveal-left, .reveal-right, .reveal-up, .reveal-scale').forEach((el) => {
    observer.observe(el);
  });
}

/* ==========================================================================
   Service Bar Hover Interactions
   ========================================================================== */

function initServiceBar() {
  const items = $$('.service-bar__item');
  if (items.length === 0) return;

  items.forEach((item) => {
    item.addEventListener('mouseenter', () => {
      items.forEach((other) => other.classList.remove('service-bar__item--active'));
      item.classList.add('service-bar__item--active');
    });

    item.addEventListener('mouseleave', () => {
      item.classList.remove('service-bar__item--active');
    });

    // Keyboard focus support
    item.addEventListener('focusin', () => {
      item.classList.add('service-bar__item--active');
    });
    item.addEventListener('focusout', () => {
      item.classList.remove('service-bar__item--active');
    });
  });
}

/* ==========================================================================
   Parallax Effect (hero & booking banner)
   ========================================================================== */

function initParallax() {
  if (prefersReducedMotion()) return;

  const parallaxElements = $$('[data-parallax]');
  if (parallaxElements.length === 0) return;

  let ticking = false;

  function updateParallax() {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;

    parallaxElements.forEach((el) => {
      const speed = parseFloat(el.dataset.parallax) || 0.3;
      const rect = el.getBoundingClientRect();

      // Only apply when the element is in (or near) the viewport
      if (rect.bottom < -100 || rect.top > windowHeight + 100) return;

      const offset = (scrollY - el.offsetTop) * speed;
      el.style.transform = `translate3d(0, ${offset}px, 0)`;
    });

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(updateParallax);
    }
  }, { passive: true });
}

/* ==========================================================================
   Scroll-to-Top Button
   ========================================================================== */

function initScrollToTop() {
  const btn = $('.scroll-top, .scroll-to-top, #scroll-to-top');
  if (!btn) return;

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const isVisible = window.scrollY > SCROLL_TOP_THRESHOLD;
      btn.classList.toggle('scroll-top--visible', isVisible);
      btn.classList.toggle('visible', isVisible);
      ticking = false;
    });
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    });
  });
}

/* ==========================================================================
   Active Nav Link Highlighting
   ========================================================================== */

function initActiveNavHighlight() {
  const sections = $$('section[id]');
  const navLinks = $$('.nav__link[href^="#"]');
  if (sections.length === 0 || navLinks.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.getAttribute('id');
        navLinks.forEach((link) => {
          link.classList.toggle(
            'nav__link--active',
            link.getAttribute('href') === `#${id}`,
          );
        });
      });
    },
    {
      rootMargin: '-20% 0px -60% 0px', // Activate when section is roughly centered
      threshold: 0,
    },
  );

  sections.forEach((section) => observer.observe(section));
}

/* ==========================================================================
   Cookie Consent Banner
   ========================================================================== */

function initCookieConsent() {
  const banner = $('.cookie-banner, #cookie-banner, #cookieBanner');
  if (!banner) return;

  // Already handled
  if (localStorage.getItem('bamboo_cookie_consent')) {
    banner.remove();
    return;
  }

  const acceptBtn = $('.cookie-banner__accept, .btn-cookie-accept, .cookie-btn-accept, #cookie-accept, #cookieAccept', banner);
  const rejectBtn = $('.cookie-banner__reject, .btn-cookie-decline, .cookie-btn-decline, #cookie-decline, #cookieDecline', banner);

  function hideBanner(consent) {
    localStorage.setItem('bamboo_cookie_consent', consent);
    banner.classList.add('cookie-banner--hidden');
    banner.style.display = 'none';
    banner.addEventListener('transitionend', () => banner.remove(), { once: true });
    // Fallback
    setTimeout(() => { if (banner.parentNode) banner.remove(); }, 1000);
  }

  // Show banner after a short delay
  setTimeout(() => {
    banner.classList.add('cookie-banner--visible');
    banner.style.display = '';
  }, COOKIE_BANNER_DELAY);

  if (acceptBtn) {
    acceptBtn.addEventListener('click', () => hideBanner('accepted'));
  }
  if (rejectBtn) {
    rejectBtn.addEventListener('click', () => hideBanner('rejected'));
  }
}

/* ==========================================================================
   Booking Button Handler
   ========================================================================== */

function initBookingButtons() {
  const buttons = $$('[data-booking], [data-booking-url], .btn-booking, .nav-cta, .btn-booking-banner');

  buttons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const url = btn.getAttribute('data-booking-url') || BOOKING_URL;
      if (!url || url === '#') {
        e.preventDefault();
        showBookingMessage();
      } else {
        // Navigate to the real booking URL
        btn.setAttribute('href', url);
      }
    });
  });
}

/**
 * Display a temporary toast / notification when booking is not yet available.
 */
function showBookingMessage() {
  // Remove any existing message first
  const existing = $('.booking-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'booking-toast';
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-live', 'polite');
  toast.innerHTML = `
    <div class="booking-toast__inner">
      <p>Die Online-Terminbuchung ist bald verfügbar.</p>
      <button class="booking-toast__close" aria-label="Schließen">&times;</button>
    </div>
  `;

  document.body.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    toast.classList.add('booking-toast--visible');
  });

  // Auto-dismiss after 4 seconds
  const dismiss = () => {
    toast.classList.remove('booking-toast--visible');
    toast.addEventListener('transitionend', () => toast.remove(), { once: true });
    setTimeout(() => { if (toast.parentNode) toast.remove(); }, 1000);
  };

  const closeBtn = toast.querySelector('.booking-toast__close');
  if (closeBtn) closeBtn.addEventListener('click', dismiss);

  setTimeout(dismiss, 4000);
}

/* ==========================================================================
   Language Switcher
   ========================================================================== */

function initLanguageSwitcher() {
  const buttons = $$('.lang-switch__btn, .lang-btn');
  if (buttons.length === 0) return;

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const lang = btn.dataset.lang;
      if (!lang) return;

      // Update active state
      buttons.forEach((b) => {
        b.classList.remove('lang-switch__btn--active', 'active');
      });
      btn.classList.add('lang-switch__btn--active', 'active');

      // Trigger translation (defined in translations.js)
      if (typeof window.setLanguage === 'function') {
        window.setLanguage(lang);
      }
    });
  });
}

/* ==========================================================================
   Lazy Loading Images
   ========================================================================== */

function initLazyLoading() {
  const images = $$('img[data-src], [data-bg]');
  if (images.length === 0) return;

  // Use native lazy loading as fallback marker
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const el = entry.target;

        if (el.tagName === 'IMG' && el.dataset.src) {
          el.src = el.dataset.src;
          if (el.dataset.srcset) el.srcset = el.dataset.srcset;
          el.removeAttribute('data-src');
          el.removeAttribute('data-srcset');
        }

        // Background image lazy loading
        if (el.dataset.bg) {
          el.style.backgroundImage = `url('${el.dataset.bg}')`;
          el.removeAttribute('data-bg');
        }

        el.addEventListener('load', () => {
          el.classList.add('loaded');
        }, { once: true });

        // For non-img elements, add loaded immediately
        if (el.tagName !== 'IMG') {
          el.classList.add('loaded');
        }

        observer.unobserve(el);
      });
    },
    {
      rootMargin: '200px 0px', // Start loading 200px before entering viewport
      threshold: 0.01,
    },
  );

  images.forEach((img) => observer.observe(img));
}

/* ==========================================================================
   Counter Animation
   ========================================================================== */

function initCounterAnimation() {
  const counters = $$('[data-counter]');
  if (counters.length === 0) return;

  if (prefersReducedMotion()) {
    // Show final values immediately
    counters.forEach((el) => {
      el.textContent = el.dataset.counter;
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.5 },
  );

  counters.forEach((el) => observer.observe(el));
}

/**
 * Animate a counter element from 0 to its data-counter value.
 * @param {HTMLElement} el
 */
function animateCounter(el) {
  const target = parseInt(el.dataset.counter, 10);
  if (isNaN(target)) return;

  const duration = parseInt(el.dataset.counterDuration, 10) || 2000;
  const start = performance.now();
  const suffix = el.dataset.counterSuffix || '';

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease-out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(eased * target);

    el.textContent = current + suffix;

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

/* ==========================================================================
   Global Keyboard Handlers
   ========================================================================== */

function initKeyboardHandlers() {
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;

    // Close mobile menu
    if (typeof window._isMobileMenuOpen === 'function' && window._isMobileMenuOpen()) {
      window._closeMobileMenu();
    }

    // Close lightbox (handled in gallery.js, but provide a custom event as fallback)
    document.dispatchEvent(new CustomEvent('lightbox:close'));

    // Close booking toast
    const toast = $('.booking-toast');
    if (toast) {
      toast.classList.remove('booking-toast--visible');
      setTimeout(() => { if (toast.parentNode) toast.remove(); }, 300);
    }
  });
}

/* ==========================================================================
   Year in Footer
   ========================================================================== */

function initFooterYear() {
  const yearEl = $('.footer__year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

/* ==========================================================================
   Initialization
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initStickyHeader();
  initMobileNav();
  initSmoothScroll();
  initHeroSlider();
  initScrollReveal();
  initServiceBar();
  initParallax();
  initScrollToTop();
  initActiveNavHighlight();
  initCookieConsent();
  initBookingButtons();
  initLanguageSwitcher();
  initLazyLoading();
  initCounterAnimation();
  initKeyboardHandlers();
  initFooterYear();
});
