(() => {
  'use strict';

  const menuButton = document.querySelector('#nav-toggle');
  const menu = document.querySelector('#nav-menu');
  const overlay = document.querySelector('.nav-overlay');

  function setMenu(open) {
    if (!menuButton || !menu) return;
    menuButton.classList.toggle('active', open);
    menu.classList.toggle('active', open);
    overlay?.classList.toggle('active', open);
    document.body.classList.toggle('menu-open', open);
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
  }

  menuButton?.addEventListener('click', () => {
    setMenu(!menu?.classList.contains('active'));
  });

  overlay?.addEventListener('click', () => setMenu(false));
  menu?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setMenu(false));
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setMenu(false);
  });

  document.querySelectorAll('.lang-switch__btn').forEach((button) => {
    button.addEventListener('click', () => {
      if (typeof window.setLanguage === 'function') {
        window.setLanguage(button.dataset.lang);
      }
    });
  });

  const revealItems = document.querySelectorAll('.reveal-item');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -6% 0px' });

    revealItems.forEach((item, index) => {
      item.style.transitionDelay = `${Math.min(index % 5, 3) * 70}ms`;
      revealObserver.observe(item);
    });
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }

  const toast = document.querySelector('#booking-toast');
  let toastTimer;

  function hideToast() {
    if (!toast) return;
    toast.hidden = true;
    window.clearTimeout(toastTimer);
  }

  document.querySelectorAll('[data-booking]').forEach((button) => {
    button.addEventListener('click', (event) => {
      event.preventDefault();
      if (!toast) return;
      toast.hidden = false;
      window.clearTimeout(toastTimer);
      toastTimer = window.setTimeout(hideToast, 4200);
    });
  });

  toast?.querySelector('button')?.addEventListener('click', hideToast);

  const cookieBanner = document.querySelector('#cookie-banner');
  const consentKey = 'bamboo_cookie_consent';

  try {
    if (cookieBanner && !localStorage.getItem(consentKey)) cookieBanner.hidden = false;
  } catch {
    if (cookieBanner) cookieBanner.hidden = false;
  }

  function saveConsent(value) {
    try {
      localStorage.setItem(consentKey, value);
    } catch {
      // The page still works if storage is unavailable.
    }
    if (cookieBanner) cookieBanner.hidden = true;
  }

  document.querySelector('#cookie-accept')?.addEventListener('click', () => saveConsent('accepted'));
  document.querySelector('#cookie-decline')?.addEventListener('click', () => saveConsent('essential'));
})();
