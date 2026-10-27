/**
 * BAMBOO SPA - Advanced Animation Helpers
 * Provides reusable animation controllers for scroll reveals, parallax,
 * text effects, image reveals, counters, and magnetic button effects.
 *
 * All animations respect prefers-reduced-motion.
 *
 * @version 1.0.0
 * @author Bamboo Spa Development
 */

/* ==========================================================================
   Reduced Motion Check
   ========================================================================== */

const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ==========================================================================
   ScrollReveal Class
   ========================================================================== */

/**
 * Configurable Intersection Observer wrapper for scroll-triggered reveals.
 */
class ScrollReveal {
  /**
   * @param {Object} options
   * @param {string}  options.selector   - CSS selector for target elements
   * @param {string}  options.activeClass - Class to add when revealed
   * @param {number}  options.threshold  - Intersection threshold (0–1)
   * @param {string}  options.rootMargin - Root margin for the observer
   * @param {boolean} options.once       - Unobserve after first reveal
   * @param {number}  options.staggerDelay - Delay (ms) between sibling reveals
   */
  constructor(options = {}) {
    this.selector = options.selector || '.reveal';
    this.activeClass = options.activeClass || 'revealed';
    this.threshold = options.threshold || 0.15;
    this.rootMargin = options.rootMargin || '0px 0px -50px 0px';
    this.once = options.once !== undefined ? options.once : true;
    this.staggerDelay = options.staggerDelay || 0;
    this.elements = [];
    this.observer = null;

    if (!REDUCED_MOTION) {
      this._init();
    } else {
      this._revealAll();
    }
  }

  /** @private */
  _init() {
    this.elements = [...document.querySelectorAll(this.selector)];
    if (this.elements.length === 0) return;

    this.observer = new IntersectionObserver(
      (entries) => this._onIntersect(entries),
      {
        threshold: this.threshold,
        rootMargin: this.rootMargin,
      },
    );

    this.elements.forEach((el) => this.observer.observe(el));
  }

  /**
   * Handle intersection changes.
   * @param {IntersectionObserverEntry[]} entries
   * @private
   */
  _onIntersect(entries) {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const el = entry.target;
      const delay = parseInt(el.dataset.delay, 10) || 0;
      const totalDelay = delay + this._getStaggerDelay(el);

      if (totalDelay > 0) {
        setTimeout(() => this._reveal(el), totalDelay);
      } else {
        this._reveal(el);
      }

      if (this.once) {
        this.observer.unobserve(el);
      }
    });
  }

  /**
   * Calculate stagger delay based on element index among siblings.
   * @param {HTMLElement} el
   * @returns {number}
   * @private
   */
  _getStaggerDelay(el) {
    if (this.staggerDelay <= 0) return 0;
    const siblings = el.parentElement
      ? [...el.parentElement.children].filter((child) =>
          child.matches(this.selector),
        )
      : [];
    const index = siblings.indexOf(el);
    return index >= 0 ? index * this.staggerDelay : 0;
  }

  /**
   * Reveal a single element.
   * @param {HTMLElement} el
   * @private
   */
  _reveal(el) {
    el.classList.add(this.activeClass);
    // Dispatch custom event for other modules to hook into
    el.dispatchEvent(new CustomEvent('revealed', { bubbles: true }));
  }

  /** Immediately reveal all elements (used when reduced motion is preferred). */
  _revealAll() {
    document.querySelectorAll(this.selector).forEach((el) => {
      el.classList.add(this.activeClass);
    });
  }

  /** Clean up the observer. */
  destroy() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }
}

/* ==========================================================================
   ParallaxController
   ========================================================================== */

/**
 * Manages parallax translations on scroll using requestAnimationFrame.
 */
class ParallaxController {
  /**
   * @param {string} selector - CSS selector for parallax elements
   */
  constructor(selector = '[data-parallax]') {
    this.elements = [];
    this.ticking = false;
    this._onScroll = this._onScroll.bind(this);
    this._update = this._update.bind(this);

    if (REDUCED_MOTION) return;

    this.elements = [...document.querySelectorAll(selector)].map((el) => ({
      el,
      speed: parseFloat(el.dataset.parallax) || 0.3,
      direction: el.dataset.parallaxDirection || 'vertical', // 'vertical' or 'horizontal'
      offsetTop: 0,
    }));

    if (this.elements.length === 0) return;

    this._cachePositions();
    window.addEventListener('scroll', this._onScroll, { passive: true });
    window.addEventListener('resize', () => this._cachePositions(), { passive: true });
    this._update();
  }

  /** Cache element offset positions for performance. */
  _cachePositions() {
    const scrollY = window.scrollY;
    this.elements.forEach((item) => {
      item.offsetTop = item.el.getBoundingClientRect().top + scrollY;
    });
  }

  /** @private */
  _onScroll() {
    if (!this.ticking) {
      this.ticking = true;
      requestAnimationFrame(this._update);
    }
  }

  /** @private */
  _update() {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;

    this.elements.forEach((item) => {
      const { el, speed, direction, offsetTop } = item;
      const elBottom = offsetTop + el.offsetHeight;

      // Skip if not near viewport
      if (scrollY + windowHeight < offsetTop - 200 || scrollY > elBottom + 200) return;

      const offset = (scrollY - offsetTop) * speed;

      if (direction === 'horizontal') {
        el.style.transform = `translate3d(${offset}px, 0, 0)`;
      } else {
        el.style.transform = `translate3d(0, ${offset}px, 0)`;
      }
    });

    this.ticking = false;
  }

  /** Clean up event listeners. */
  destroy() {
    window.removeEventListener('scroll', this._onScroll);
  }
}

/* ==========================================================================
   TextReveal
   ========================================================================== */

/**
 * Letter-by-letter or word-by-word text reveal animation.
 */
class TextReveal {
  /**
   * @param {HTMLElement} el - Target element
   * @param {Object} options
   * @param {'letter'|'word'} options.mode - Reveal mode
   * @param {number} options.delay      - Delay (ms) between each unit
   * @param {number} options.startDelay - Initial delay before animation starts
   */
  constructor(el, options = {}) {
    this.el = el;
    this.mode = options.mode || 'word';
    this.delay = options.delay || 50;
    this.startDelay = options.startDelay || 0;
    this.originalText = el.textContent;

    if (REDUCED_MOTION) return;

    this._prepare();
  }

  /** @private */
  _prepare() {
    const text = this.originalText.trim();
    this.el.textContent = '';
    this.el.setAttribute('aria-label', text);

    if (this.mode === 'letter') {
      this._splitLetters(text);
    } else {
      this._splitWords(text);
    }
  }

  /** @private */
  _splitLetters(text) {
    [...text].forEach((char, i) => {
      const span = document.createElement('span');
      span.className = 'text-reveal__char';
      span.textContent = char === ' ' ? '\u00A0' : char;
      span.style.animationDelay = `${this.startDelay + i * this.delay}ms`;
      span.setAttribute('aria-hidden', 'true');
      this.el.appendChild(span);
    });
  }

  /** @private */
  _splitWords(text) {
    text.split(/\s+/).forEach((word, i, arr) => {
      const span = document.createElement('span');
      span.className = 'text-reveal__word';
      span.textContent = word;
      span.style.animationDelay = `${this.startDelay + i * this.delay}ms`;
      span.setAttribute('aria-hidden', 'true');
      this.el.appendChild(span);

      // Add space between words (except after last)
      if (i < arr.length - 1) {
        this.el.appendChild(document.createTextNode(' '));
      }
    });
  }

  /** Trigger the reveal animation. */
  reveal() {
    this.el.classList.add('text-reveal--active');
  }

  /** Reset to original state. */
  reset() {
    this.el.textContent = this.originalText;
    this.el.classList.remove('text-reveal--active');
    this.el.removeAttribute('aria-label');
  }
}

/* ==========================================================================
   ImageReveal
   ========================================================================== */

/**
 * Clip-path or overlay-based image reveal on scroll.
 */
class ImageReveal {
  /**
   * @param {string} selector - CSS selector for image containers
   * @param {Object} options
   * @param {'clip'|'overlay'} options.style - Reveal style
   * @param {number} options.duration - Animation duration in ms
   */
  constructor(selector = '.image-reveal', options = {}) {
    this.style = options.style || 'clip';
    this.duration = options.duration || 1200;
    this.observer = null;

    if (REDUCED_MOTION) {
      document.querySelectorAll(selector).forEach((el) => {
        el.classList.add('image-reveal--revealed');
      });
      return;
    }

    this._init(selector);
  }

  /** @private */
  _init(selector) {
    const elements = document.querySelectorAll(selector);
    if (elements.length === 0) return;

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          this._reveal(entry.target);
          this.observer.unobserve(entry.target);
        });
      },
      { threshold: 0.2 },
    );

    elements.forEach((el) => this.observer.observe(el));
  }

  /**
   * Reveal a single image container.
   * @param {HTMLElement} el
   * @private
   */
  _reveal(el) {
    el.classList.add('image-reveal--revealing');

    if (this.style === 'clip') {
      el.style.transition = `clip-path ${this.duration}ms cubic-bezier(0.77, 0, 0.175, 1)`;
      el.style.clipPath = 'inset(0 0 0 0)';
    }

    setTimeout(() => {
      el.classList.remove('image-reveal--revealing');
      el.classList.add('image-reveal--revealed');
    }, this.duration);
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
   SmoothCounter
   ========================================================================== */

/**
 * Animated number counter with easing.
 */
class SmoothCounter {
  /**
   * @param {HTMLElement} el
   * @param {Object} options
   * @param {number} options.target   - Target number
   * @param {number} options.duration - Animation duration (ms)
   * @param {string} options.suffix   - Suffix text (e.g. '+', '%')
   * @param {string} options.prefix   - Prefix text (e.g. '€')
   */
  constructor(el, options = {}) {
    this.el = el;
    this.target = options.target || parseInt(el.dataset.counter, 10) || 0;
    this.duration = options.duration || parseInt(el.dataset.counterDuration, 10) || 2000;
    this.suffix = options.suffix || el.dataset.counterSuffix || '';
    this.prefix = options.prefix || el.dataset.counterPrefix || '';
    this.startValue = 0;
    this.frameId = null;

    if (REDUCED_MOTION) {
      this.el.textContent = this.prefix + this.target + this.suffix;
    }
  }

  /** Start the counting animation. */
  start() {
    if (REDUCED_MOTION) return;

    const startTime = performance.now();

    const step = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / this.duration, 1);

      // Ease-out exponential
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = Math.round(eased * this.target);

      this.el.textContent = this.prefix + current.toLocaleString('de-DE') + this.suffix;

      if (progress < 1) {
        this.frameId = requestAnimationFrame(step);
      }
    };

    this.frameId = requestAnimationFrame(step);
  }

  /** Stop the animation. */
  stop() {
    if (this.frameId) {
      cancelAnimationFrame(this.frameId);
      this.frameId = null;
    }
  }
}

/* ==========================================================================
   Magnetic Button Effect
   ========================================================================== */

/**
 * Subtle magnetic "follow cursor" effect for CTA buttons.
 * The button content shifts slightly toward the cursor on hover.
 */
class MagneticButton {
  /**
   * @param {HTMLElement} el
   * @param {Object} options
   * @param {number} options.strength - Movement strength (1–30)
   * @param {number} options.ease     - Lerp easing factor (0–1)
   */
  constructor(el, options = {}) {
    this.el = el;
    this.strength = options.strength || 12;
    this.ease = options.ease || 0.15;
    this.currentX = 0;
    this.currentY = 0;
    this.targetX = 0;
    this.targetY = 0;
    this.frameId = null;
    this.isHovering = false;

    if (REDUCED_MOTION) return;

    this._onMouseMove = this._onMouseMove.bind(this);
    this._onMouseLeave = this._onMouseLeave.bind(this);
    this._animate = this._animate.bind(this);

    this.el.addEventListener('mousemove', this._onMouseMove);
    this.el.addEventListener('mouseleave', this._onMouseLeave);
  }

  /** @private */
  _onMouseMove(e) {
    const rect = this.el.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    this.targetX = ((e.clientX - centerX) / (rect.width / 2)) * this.strength;
    this.targetY = ((e.clientY - centerY) / (rect.height / 2)) * this.strength;

    if (!this.isHovering) {
      this.isHovering = true;
      this._animate();
    }
  }

  /** @private */
  _onMouseLeave() {
    this.isHovering = false;
    this.targetX = 0;
    this.targetY = 0;
    // Animate back to center
    this._animate();
  }

  /** @private */
  _animate() {
    this.currentX += (this.targetX - this.currentX) * this.ease;
    this.currentY += (this.targetY - this.currentY) * this.ease;

    this.el.style.transform = `translate3d(${this.currentX}px, ${this.currentY}px, 0)`;

    // Continue animating if still hovering or not yet settled
    const isSettled =
      Math.abs(this.targetX - this.currentX) < 0.1 &&
      Math.abs(this.targetY - this.currentY) < 0.1;

    if (this.isHovering || !isSettled) {
      this.frameId = requestAnimationFrame(this._animate);
    } else {
      // Snap to zero when settled
      this.currentX = 0;
      this.currentY = 0;
      this.el.style.transform = '';
      cancelAnimationFrame(this.frameId);
      this.frameId = null;
    }
  }

  /** Clean up event listeners. */
  destroy() {
    this.el.removeEventListener('mousemove', this._onMouseMove);
    this.el.removeEventListener('mouseleave', this._onMouseLeave);
    if (this.frameId) cancelAnimationFrame(this.frameId);
    this.el.style.transform = '';
  }
}

/* ==========================================================================
   Header Background Opacity Transition
   ========================================================================== */

/**
 * Smoothly transitions the header background opacity from transparent to
 * opaque as the user scrolls down.
 */
class HeaderOpacity {
  /**
   * @param {string} selector - Header element selector
   * @param {number} scrollDistance - Distance (px) over which the transition completes
   */
  constructor(selector = '.header', scrollDistance = 300) {
    this.header = document.querySelector(selector);
    this.scrollDistance = scrollDistance;
    this.ticking = false;

    if (!this.header || REDUCED_MOTION) return;

    this._onScroll = this._onScroll.bind(this);
    this._update = this._update.bind(this);

    window.addEventListener('scroll', this._onScroll, { passive: true });
    this._update(); // Initial state
  }

  /** @private */
  _onScroll() {
    if (!this.ticking) {
      this.ticking = true;
      requestAnimationFrame(this._update);
    }
  }

  /** @private */
  _update() {
    const progress = Math.min(window.scrollY / this.scrollDistance, 1);
    this.header.style.setProperty('--header-bg-opacity', progress);
    this.ticking = false;
  }

  /** Clean up. */
  destroy() {
    window.removeEventListener('scroll', this._onScroll);
  }
}

/* ==========================================================================
   Initialization
   ========================================================================== */

/** Store instances for potential cleanup */
const animationInstances = {
  scrollReveal: null,
  parallax: null,
  imageReveal: null,
  headerOpacity: null,
  magneticButtons: [],
  textReveals: [],
};

/**
 * Initialize all animation controllers.
 */
function initAnimations() {
  // Scroll reveal for various element types
  animationInstances.scrollReveal = new ScrollReveal({
    selector: '.reveal, .reveal-left, .reveal-right, .reveal-up, .reveal-scale',
    activeClass: 'revealed',
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px',
    once: true,
    staggerDelay: 100,
  });

  // Parallax on scroll
  animationInstances.parallax = new ParallaxController('[data-parallax]');

  // Image reveals
  animationInstances.imageReveal = new ImageReveal('.image-reveal');

  // Header opacity fade
  animationInstances.headerOpacity = new HeaderOpacity('.header', 300);

  // Magnetic effect on CTA buttons (desktop only)
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches && !REDUCED_MOTION) {
    document.querySelectorAll('.btn--primary, .btn--cta, [data-magnetic]').forEach((btn) => {
      const instance = new MagneticButton(btn, { strength: 8, ease: 0.12 });
      animationInstances.magneticButtons.push(instance);
    });
  }

  // Text reveals (triggered by Intersection Observer from ScrollReveal)
  document.querySelectorAll('[data-text-reveal]').forEach((el) => {
    const mode = el.dataset.textReveal || 'word';
    const instance = new TextReveal(el, {
      mode,
      delay: mode === 'letter' ? 30 : 80,
      startDelay: parseInt(el.dataset.delay, 10) || 0,
    });

    // Reveal when element comes into view
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            instance.reveal();
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 },
    );
    observer.observe(el);

    animationInstances.textReveals.push({ instance, observer });
  });

  // Smooth counters triggered by scroll
  if (!REDUCED_MOTION) {
    document.querySelectorAll('[data-counter]').forEach((el) => {
      const counter = new SmoothCounter(el);
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              counter.start();
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.5 },
      );
      observer.observe(el);
    });
  }
}

/**
 * Clean up all animation instances (useful for SPA navigation).
 */
function destroyAnimations() {
  if (animationInstances.scrollReveal) animationInstances.scrollReveal.destroy();
  if (animationInstances.parallax) animationInstances.parallax.destroy();
  if (animationInstances.imageReveal) animationInstances.imageReveal.destroy();
  if (animationInstances.headerOpacity) animationInstances.headerOpacity.destroy();
  animationInstances.magneticButtons.forEach((mb) => mb.destroy());
  animationInstances.magneticButtons = [];
  animationInstances.textReveals.forEach(({ instance, observer }) => {
    instance.reset();
    observer.disconnect();
  });
  animationInstances.textReveals = [];
}

/* -- Bootstrap ----------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', initAnimations);

/* -- Expose for external use --------------------------------------------- */

window.BambooAnimations = {
  ScrollReveal,
  ParallaxController,
  TextReveal,
  ImageReveal,
  SmoothCounter,
  MagneticButton,
  HeaderOpacity,
  init: initAnimations,
  destroy: destroyAnimations,
};
