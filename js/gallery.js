/**
 * BAMBOO SPA - Gallery & Lightbox
 * Handles masonry layout, image filtering, lightbox with keyboard/swipe
 * navigation, lazy loading, and hover effects.
 *
 * @version 1.0.0
 * @author Bamboo Spa Development
 */

/* ==========================================================================
   Configuration
   ========================================================================== */

const GALLERY_CONFIG = {
  /** Selector for the gallery grid container */
  gridSelector: '.gallery__grid, .gallery-grid',
  /** Selector for individual gallery items */
  itemSelector: '.gallery__item, .gallery-item',
  /** Selector for filter buttons */
  filterSelector: '.gallery__filter-btn, .gallery-filter-btn',
  /** Selector for zoomable images within items */
  imageSelector: '.gallery__image, img',
  /** Transition duration for lightbox open/close (ms) */
  transitionDuration: 400,
  /** Minimum swipe distance (px) to trigger navigation */
  swipeThreshold: 50,
};

/* ==========================================================================
   Utility
   ========================================================================== */

const galleryQuery = (sel, ctx = document) => ctx.querySelector(sel);
const galleryQueryAll = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/**
 * Lock / unlock body scroll.
 * @param {boolean} lock
 */
function galleryLockScroll(lock) {
  document.body.style.overflow = lock ? 'hidden' : '';
  document.body.classList.toggle('scroll-locked', lock);
}

/* ==========================================================================
   Gallery Filter
   ========================================================================== */

class GalleryFilter {
  /**
   * @param {string} filterSelector - Selector for filter buttons
   * @param {string} itemSelector   - Selector for gallery items
   */
  constructor(filterSelector, itemSelector) {
    this.buttons = galleryQueryAll(filterSelector);
    this.items = galleryQueryAll(itemSelector);

    if (this.buttons.length === 0 || this.items.length === 0) return;

    this._bindEvents();
  }

  /** @private */
  _bindEvents() {
    this.buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const category = btn.dataset.filter || 'all';
        this._filter(category);
        this._setActiveButton(btn);
      });
    });
  }

  /**
   * Filter items by category.
   * @param {string} category - 'all' or a specific category slug
   * @private
   */
  _filter(category) {
    this.items.forEach((item) => {
      const itemCategory = item.dataset.category || '';
      const show = category === 'all' || itemCategory === category;

      if (show) {
        item.classList.remove('gallery__item--hidden');
        item.style.display = '';
        // Trigger re-layout animation
        requestAnimationFrame(() => {
          item.classList.add('gallery__item--visible');
        });
      } else {
        item.classList.remove('gallery__item--visible');
        item.classList.add('gallery__item--hidden');
        // Hide after transition
        setTimeout(() => {
          if (item.classList.contains('gallery__item--hidden')) {
            item.style.display = 'none';
          }
        }, 400);
      }
    });
  }

  /**
   * Update active state on filter buttons.
   * @param {HTMLElement} activeBtn
   * @private
   */
  _setActiveButton(activeBtn) {
    this.buttons.forEach((btn) => {
      btn.classList.remove('gallery__filter-btn--active');
      btn.setAttribute('aria-pressed', 'false');
    });
    activeBtn.classList.add('gallery__filter-btn--active');
    activeBtn.setAttribute('aria-pressed', 'true');
  }
}

/* ==========================================================================
   Lightbox
   ========================================================================== */

class Lightbox {
  constructor() {
    this.overlay = null;
    this.imageContainer = null;
    this.imgElement = null;
    this.closeBtn = null;
    this.prevBtn = null;
    this.nextBtn = null;
    this.counterEl = null;
    this.captionEl = null;
    this.images = [];
    this.currentIndex = 0;
    this.isOpen = false;
    this.isAnimating = false;

    // Touch / swipe state
    this.touchStartX = 0;
    this.touchStartY = 0;
    this.touchEndX = 0;
    this.touchEndY = 0;

    // Bind methods
    this._onKeyDown = this._onKeyDown.bind(this);
    this._onTouchStart = this._onTouchStart.bind(this);
    this._onTouchMove = this._onTouchMove.bind(this);
    this._onTouchEnd = this._onTouchEnd.bind(this);
    this._onOverlayClick = this._onOverlayClick.bind(this);
    this._onCustomClose = this._onCustomClose.bind(this);

    this._createDOM();
    this._bindGalleryClicks();
  }

  /* -- DOM Creation ------------------------------------------------------ */

  /** @private */
  _createDOM() {
    // Check if lightbox already exists
    if (galleryQuery('.lightbox')) {
      this.overlay = galleryQuery('.lightbox');
      this._cacheElements();
      return;
    }

    this.overlay = document.createElement('div');
    this.overlay.className = 'lightbox';
    this.overlay.setAttribute('role', 'dialog');
    this.overlay.setAttribute('aria-modal', 'true');
    this.overlay.setAttribute('aria-label', 'Bildergalerie');
    this.overlay.innerHTML = `
      <div class="lightbox__backdrop"></div>
      <button class="lightbox__close" aria-label="Schließen">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
      <button class="lightbox__nav lightbox__nav--prev" aria-label="Vorheriges Bild">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>
      <div class="lightbox__content">
        <div class="lightbox__image-wrapper">
          <img class="lightbox__image" src="" alt="" />
        </div>
      </div>
      <button class="lightbox__nav lightbox__nav--next" aria-label="Nächstes Bild">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="9 6 15 12 9 18"></polyline>
        </svg>
      </button>
      <div class="lightbox__counter" aria-live="polite"></div>
    `;

    document.body.appendChild(this.overlay);
    this._cacheElements();
  }

  /** @private */
  _cacheElements() {
    this.closeBtn = galleryQuery('.lightbox__close, .lightbox-close', this.overlay);
    this.prevBtn = galleryQuery('.lightbox__nav--prev, .lightbox-prev', this.overlay);
    this.nextBtn = galleryQuery('.lightbox__nav--next, .lightbox-next', this.overlay);
    this.imageContainer = galleryQuery('.lightbox__content, .lightbox-content', this.overlay);
    this.imgElement = galleryQuery('.lightbox__image, .lightbox-image', this.overlay);
    this.counterEl = galleryQuery('.lightbox__counter, .lightbox-counter', this.overlay);
    this.captionEl = galleryQuery('.lightbox__caption, .lightbox-caption', this.overlay);

    // Internal event listeners
    if (this.closeBtn) this.closeBtn.addEventListener('click', () => this.close());
    if (this.prevBtn) this.prevBtn.addEventListener('click', () => this.prev());
    if (this.nextBtn) this.nextBtn.addEventListener('click', () => this.next());
  }

  /* -- Gallery Binding --------------------------------------------------- */

  /** @private */
  _bindGalleryClicks() {
    const items = galleryQueryAll(GALLERY_CONFIG.itemSelector);
    if (items.length === 0) return;

    // Build image list from gallery items
    this.images = items
      .map((item) => {
        const img = galleryQuery('img', item);
        if (!img) return null;
        return {
          src: img.dataset.full || img.dataset.src || img.src,
          alt: img.alt || '',
          caption: galleryQuery('.gallery-overlay-label', item)?.textContent?.trim() || img.alt || '',
          element: item,
        };
      })
      .filter(Boolean);

    // Click handler for each item
    items.forEach((item, index) => {
      item.style.cursor = 'pointer';
      item.setAttribute('tabindex', '0');
      item.setAttribute('role', 'button');
      item.setAttribute('aria-label', 'Bild vergrößern');

      item.addEventListener('click', (e) => {
        e.preventDefault();
        this.open(index);
      });

      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.open(index);
        }
      });
    });
  }

  /* -- Open / Close ------------------------------------------------------ */

  /**
   * Open the lightbox at a given image index.
   * @param {number} index
   */
  open(index) {
    if (this.isOpen || !this.overlay || !this.imgElement || !this.images[index]) return;

    this.currentIndex = index;
    this.isOpen = true;
    this.isAnimating = false;

    this._showImage(index);
    this.overlay.classList.remove('lightbox--closing');
    this.overlay.classList.add('active');
    this.overlay.classList.add('lightbox--open');
    galleryLockScroll(true);

    // Attach global listeners
    document.addEventListener('keydown', this._onKeyDown);
    document.addEventListener('lightbox:close', this._onCustomClose);
    this.overlay.addEventListener('click', this._onOverlayClick);

    // Touch events for swipe
    this.overlay.addEventListener('touchstart', this._onTouchStart, { passive: true });
    this.overlay.addEventListener('touchmove', this._onTouchMove, { passive: false });
    this.overlay.addEventListener('touchend', this._onTouchEnd, { passive: true });

    // Focus the close button without blocking an immediate close action.
    requestAnimationFrame(() => {
      if (this.closeBtn) this.closeBtn.focus();
    });
  }

  /** Close the lightbox. */
  close() {
    if (!this.isOpen) return;
    this.isOpen = false;
    this.isAnimating = false;

    this.overlay.classList.remove('active');
    this.overlay.classList.remove('lightbox--open');
    this.overlay.classList.remove('lightbox--closing');
    galleryLockScroll(false);

    // Clean up global listeners immediately so the page never remains locked.
    document.removeEventListener('keydown', this._onKeyDown);
    document.removeEventListener('lightbox:close', this._onCustomClose);
    this.overlay.removeEventListener('click', this._onOverlayClick);
    this.overlay.removeEventListener('touchstart', this._onTouchStart);
    this.overlay.removeEventListener('touchmove', this._onTouchMove);
    this.overlay.removeEventListener('touchend', this._onTouchEnd);

    // Return focus to the triggering gallery item.
    const item = this.images[this.currentIndex];
    if (item && item.element) item.element.focus();
  }

  /* -- Navigation -------------------------------------------------------- */

  /** Go to the next image. */
  next() {
    if (this.isAnimating) return;
    const nextIndex = (this.currentIndex + 1) % this.images.length;
    this._showImage(nextIndex);
    this.currentIndex = nextIndex;
  }

  /** Go to the previous image. */
  prev() {
    if (this.isAnimating) return;
    const prevIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
    this._showImage(prevIndex);
    this.currentIndex = prevIndex;
  }

  /* -- Image Display ----------------------------------------------------- */

  /**
   * Show a specific image in the lightbox.
   * @param {number} index
   * @private
   */
  _showImage(index) {
    const imageData = this.images[index];
    if (!imageData || !this.imgElement) return;

    // Fade out current image briefly
    this.imgElement.classList.remove('lightbox__image--loaded');

    // Small delay for the fade transition
    setTimeout(() => {
      this.imgElement.src = imageData.src;
      this.imgElement.alt = imageData.alt;

      this.imgElement.onload = () => {
        this.imgElement.classList.add('lightbox__image--loaded');
      };

      // If already cached, fire immediately
      if (this.imgElement.complete) {
        this.imgElement.classList.add('lightbox__image--loaded');
      }
    }, 50);

    this._updateCounter(index);
    if (this.captionEl) this.captionEl.textContent = imageData.caption;
    this._preloadAdjacent(index);
    this._updateNavVisibility();
  }

  /**
   * Update the image counter display.
   * @param {number} index
   * @private
   */
  _updateCounter(index) {
    if (!this.counterEl) return;
    this.counterEl.textContent = `${index + 1} / ${this.images.length}`;
  }

  /**
   * Preload the next and previous images for smoother navigation.
   * @param {number} index
   * @private
   */
  _preloadAdjacent(index) {
    const preload = (i) => {
      const imgData = this.images[i];
      if (!imgData) return;
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.as = 'image';
      link.href = imgData.src;
      // Avoid duplicate prefetch links
      if (!document.querySelector(`link[href="${imgData.src}"]`)) {
        document.head.appendChild(link);
      }
    };

    preload((index + 1) % this.images.length);
    preload((index - 1 + this.images.length) % this.images.length);
  }

  /**
   * Show/hide prev/next buttons if only one image.
   * @private
   */
  _updateNavVisibility() {
    const hasMultiple = this.images.length > 1;
    if (this.prevBtn) this.prevBtn.style.display = hasMultiple ? '' : 'none';
    if (this.nextBtn) this.nextBtn.style.display = hasMultiple ? '' : 'none';
  }

  /* -- Event Handlers ---------------------------------------------------- */

  /** @private */
  _onKeyDown(e) {
    switch (e.key) {
      case 'Escape':
        this.close();
        break;
      case 'ArrowRight':
        e.preventDefault();
        this.next();
        break;
      case 'ArrowLeft':
        e.preventDefault();
        this.prev();
        break;
    }
  }

  /** @private */
  _onOverlayClick(e) {
    // Close if clicking the backdrop or the overlay itself (not nav/image)
    if (
      e.target === this.overlay ||
      e.target.classList.contains('lightbox__backdrop') ||
      e.target.classList.contains('lightbox-overlay') ||
      e.target.classList.contains('lightbox__content') ||
      e.target.classList.contains('lightbox-content')
    ) {
      this.close();
    }
  }

  /** @private */
  _onCustomClose() {
    this.close();
  }

  /* -- Touch / Swipe ----------------------------------------------------- */

  /** @private */
  _onTouchStart(e) {
    this.touchStartX = e.changedTouches[0].screenX;
    this.touchStartY = e.changedTouches[0].screenY;
  }

  /** @private */
  _onTouchMove(e) {
    // Prevent page scroll while swiping in lightbox
    this.touchEndX = e.changedTouches[0].screenX;
    this.touchEndY = e.changedTouches[0].screenY;

    const deltaX = Math.abs(this.touchEndX - this.touchStartX);
    const deltaY = Math.abs(this.touchEndY - this.touchStartY);

    // If horizontal swipe, prevent vertical scroll
    if (deltaX > deltaY) {
      e.preventDefault();
    }
  }

  /** @private */
  _onTouchEnd(e) {
    this.touchEndX = e.changedTouches[0].screenX;
    this.touchEndY = e.changedTouches[0].screenY;

    const deltaX = this.touchEndX - this.touchStartX;
    const deltaY = this.touchEndY - this.touchStartY;

    // Only act on horizontal swipes that exceed the threshold
    if (Math.abs(deltaX) < GALLERY_CONFIG.swipeThreshold) return;
    if (Math.abs(deltaX) < Math.abs(deltaY)) return; // Ignore diagonal swipes

    if (deltaX < 0) {
      this.next(); // Swipe left → next
    } else {
      this.prev(); // Swipe right → prev
    }
  }
}

/* ==========================================================================
   Gallery Lazy Loading
   ========================================================================== */

class GalleryLazyLoader {
  /**
   * @param {string} selector - Selector for lazy images inside gallery items
   */
  constructor(selector = '.gallery__image[data-src]') {
    this.observer = null;
    this._init(selector);
  }

  /** @private */
  _init(selector) {
    const images = galleryQueryAll(selector);
    if (images.length === 0) return;

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const img = entry.target;
          this._loadImage(img);
          this.observer.unobserve(img);
        });
      },
      {
        rootMargin: '300px 0px',
        threshold: 0.01,
      },
    );

    images.forEach((img) => this.observer.observe(img));
  }

  /**
   * Load a lazy image.
   * @param {HTMLImageElement} img
   * @private
   */
  _loadImage(img) {
    const src = img.dataset.src;
    if (!src) return;

    // Create a temporary image to preload
    const tempImg = new Image();
    tempImg.onload = () => {
      img.src = src;
      if (img.dataset.srcset) {
        img.srcset = img.dataset.srcset;
      }
      img.classList.add('loaded');
      img.removeAttribute('data-src');
      img.removeAttribute('data-srcset');
    };
    tempImg.onerror = () => {
      // Still try to set the src on error (show broken image icon)
      img.src = src;
      img.classList.add('loaded', 'loaded--error');
    };
    tempImg.src = src;
  }

  /** Clean up. */
  destroy() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }
}

/* ==========================================================================
   Gallery Hover Overlay
   ========================================================================== */

class GalleryHover {
  /**
   * @param {string} itemSelector - Gallery item selector
   */
  constructor(itemSelector = GALLERY_CONFIG.itemSelector) {
    this.items = galleryQueryAll(itemSelector);
    if (this.items.length === 0) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.items.forEach((item) => {
      // Skip if overlay already exists
      if (galleryQuery('.gallery__overlay', item)) return;

      // Create hover overlay
      const overlay = document.createElement('div');
      overlay.className = 'gallery__overlay';
      overlay.setAttribute('aria-hidden', 'true');
      overlay.innerHTML = `
        <div class="gallery__overlay-content">
          <svg class="gallery__overlay-icon" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            <line x1="11" y1="8" x2="11" y2="14"></line>
            <line x1="8" y1="11" x2="14" y2="11"></line>
          </svg>
        </div>
      `;
      item.appendChild(overlay);

      // Zoom effect on hover (if no reduced motion)
      if (!reducedMotion) {
        const img = galleryQuery('img', item);
        if (img) {
          item.addEventListener('mouseenter', () => {
            img.style.transform = 'scale(1.08)';
          });
          item.addEventListener('mouseleave', () => {
            img.style.transform = '';
          });
        }
      }
    });
  }
}

/* ==========================================================================
   Masonry Layout Helper
   ========================================================================== */

/**
 * Optional masonry-like layout using CSS grid.
 * This adds span classes to items based on their natural image aspect ratio.
 * The main layout is done via CSS Grid with auto-fill, but this helper
 * can assign "tall" or "wide" classes for visual variety.
 */
class MasonryLayout {
  /**
   * @param {string} gridSelector - Selector for the grid container
   * @param {string} itemSelector - Selector for grid items
   */
  constructor(gridSelector, itemSelector) {
    this.grid = galleryQuery(gridSelector);
    this.items = galleryQueryAll(itemSelector);

    if (!this.grid || this.items.length === 0) return;

    // Wait for images to load before calculating layout
    this._onLoad = this._onLoad.bind(this);
    this._resizeHandler = this._debounce(this._calculateLayout.bind(this), 200);

    this._waitForImages();
    window.addEventListener('resize', this._resizeHandler, { passive: true });
  }

  /** @private */
  _waitForImages() {
    const images = galleryQueryAll('img', this.grid);
    let loadedCount = 0;
    const total = images.length;

    if (total === 0) {
      this._calculateLayout();
      return;
    }

    const checkComplete = () => {
      loadedCount++;
      if (loadedCount >= total) {
        this._calculateLayout();
      }
    };

    images.forEach((img) => {
      if (img.complete) {
        checkComplete();
      } else {
        img.addEventListener('load', checkComplete, { once: true });
        img.addEventListener('error', checkComplete, { once: true });
      }
    });
  }

  /** @private */
  _onLoad() {
    this._calculateLayout();
  }

  /** @private */
  _calculateLayout() {
    // Let CSS Grid handle the main layout
    // We just add variety classes for span differences
    this.items.forEach((item, index) => {
      // Create a pattern: every 5th item spans 2 columns (if grid allows)
      if (index % 5 === 0 && index > 0) {
        item.classList.add('gallery__item--wide');
      }
      // Every 7th item is tall
      if (index % 7 === 3) {
        item.classList.add('gallery__item--tall');
      }
    });

    this.grid.classList.add('gallery__grid--loaded');
  }

  /**
   * Simple debounce utility.
   * @param {Function} fn
   * @param {number} delay
   * @returns {Function}
   * @private
   */
  _debounce(fn, delay) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  }

  /** Clean up. */
  destroy() {
    window.removeEventListener('resize', this._resizeHandler);
  }
}

/* ==========================================================================
   Initialization
   ========================================================================== */

/** Store gallery instances for potential cleanup */
const galleryInstances = {
  filter: null,
  lightbox: null,
  lazyLoader: null,
  hover: null,
  masonry: null,
};

/**
 * Initialize all gallery functionality.
 */
function initGallery() {
  const galleryGrid = galleryQuery(GALLERY_CONFIG.gridSelector);
  if (!galleryGrid) return; // No gallery on this page

  // Filter
  galleryInstances.filter = new GalleryFilter(
    GALLERY_CONFIG.filterSelector,
    GALLERY_CONFIG.itemSelector,
  );

  // Lightbox
  galleryInstances.lightbox = new Lightbox();

  // Lazy loading
  galleryInstances.lazyLoader = new GalleryLazyLoader(
    `${GALLERY_CONFIG.itemSelector} img[data-src]`,
  );

  // Hover effects
  galleryInstances.hover = new GalleryHover(GALLERY_CONFIG.itemSelector);

  // Masonry layout helper
  galleryInstances.masonry = new MasonryLayout(
    GALLERY_CONFIG.gridSelector,
    GALLERY_CONFIG.itemSelector,
  );
}

/**
 * Clean up gallery instances.
 */
function destroyGallery() {
  if (galleryInstances.lazyLoader) galleryInstances.lazyLoader.destroy();
  if (galleryInstances.masonry) galleryInstances.masonry.destroy();
}

/* -- Bootstrap ----------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', initGallery);

/* -- Expose for external use --------------------------------------------- */

window.BambooGallery = {
  Lightbox,
  GalleryFilter,
  GalleryLazyLoader,
  GalleryHover,
  MasonryLayout,
  init: initGallery,
  destroy: destroyGallery,
};
