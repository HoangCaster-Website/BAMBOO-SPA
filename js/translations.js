/**
 * BAMBOO SPA - Translation System
 * Provides German (de) and English (en) translations for all site text.
 * Uses data-i18n attributes on HTML elements to swap content.
 *
 * @version 1.0.0
 * @author Bamboo Spa Development
 */

/* ==========================================================================
   Translation Data
   ========================================================================== */

const translations = {

  /* ---------- Navigation ------------------------------------------------ */

  'nav.home': {
    de: 'Startseite',
    en: 'Home',
  },
  'nav.about': {
    de: 'Über uns',
    en: 'About',
  },
  'nav.services': {
    de: 'Behandlungen',
    en: 'Treatments',
  },
  'nav.gallery': {
    de: 'Galerie',
    en: 'Gallery',
  },
  'nav.contact': {
    de: 'Kontakt',
    en: 'Contact',
  },
  'nav.booking': {
    de: 'Termin buchen',
    en: 'Book Appointment',
  },

  /* ---------- Hero Slide 1 ---------------------------------------------- */

  'hero.slide1.subtitle': {
    de: 'Willkommen bei Bamboo Spa',
    en: 'Welcome to Bamboo Spa',
  },
  'hero.slide1.title': {
    de: 'Harmonie für Körper & Seele',
    en: 'Harmony for Body & Soul',
  },
  'hero.slide1.text': {
    de: 'Erleben Sie traditionelle asiatische Wellnesskunst in modernem Ambiente - Ihr Rückzugsort in Zwickau.',
    en: 'Experience traditional Asian wellness art in a modern setting - your retreat in Zwickau.',
  },
  'hero.slide1.btn': {
    de: 'Termin buchen',
    en: 'Book Appointment',
  },

  /* ---------- Hero Slide 2 ---------------------------------------------- */

  'hero.slide2.subtitle': {
    de: 'Professionelle Behandlungen',
    en: 'Professional Treatments',
  },
  'hero.slide2.title': {
    de: 'Massage & Körperpflege',
    en: 'Massage & Body Care',
  },
  'hero.slide2.text': {
    de: 'Lassen Sie sich von unseren erfahrenen Therapeuten mit individuell abgestimmten Behandlungen verwöhnen.',
    en: 'Let our experienced therapists pamper you with individually tailored treatments.',
  },
  'hero.slide2.btn': {
    de: 'Mehr erfahren',
    en: 'Learn More',
  },

  /* ---------- Hero Slide 3 ---------------------------------------------- */

  'hero.slide3.subtitle': {
    de: 'Ganzheitliches Wohlbefinden',
    en: 'Holistic Well-Being',
  },
  'hero.slide3.title': {
    de: 'Entspannung neu definiert',
    en: 'Relaxation Redefined',
  },
  'hero.slide3.text': {
    de: 'Tauchen Sie ein in eine Welt der Ruhe und lassen Sie den Alltag hinter sich.',
    en: 'Immerse yourself in a world of tranquility and leave everyday life behind.',
  },
  'hero.slide3.btn': {
    de: 'Entdecken',
    en: 'Discover',
  },

  /* ---------- Service Bar ----------------------------------------------- */

  'servicebar.headspa.label': {
    de: 'Head Spa',
    en: 'Head Spa',
  },
  'servicebar.headspa.desc': {
    de: 'Entspannende Kopfbehandlung',
    en: 'Relaxing scalp treatment',
  },
  'servicebar.massage.label': {
    de: 'Massage',
    en: 'Massage',
  },
  'servicebar.massage.desc': {
    de: 'Traditionelle Körpermassagen',
    en: 'Traditional body massages',
  },
  'servicebar.kosmetik.label': {
    de: 'Kosmetik',
    en: 'Cosmetics',
  },
  'servicebar.kosmetik.desc': {
    de: 'Professionelle Hautpflege',
    en: 'Professional skin care',
  },
  'servicebar.fussmassage.label': {
    de: 'Fußmassage',
    en: 'Foot Massage',
  },
  'servicebar.fussmassage.desc': {
    de: 'Reflexzonen-Therapie',
    en: 'Reflexology therapy',
  },
  'servicebar.wellness.label': {
    de: 'Wellness',
    en: 'Wellness',
  },
  'servicebar.wellness.desc': {
    de: 'Ganzheitliche Programme',
    en: 'Holistic programs',
  },

  /* ---------- About Section --------------------------------------------- */

  'about.subtitle': {
    de: 'Über uns',
    en: 'About Us',
  },
  'about.title': {
    de: 'Ihr Rückzugsort in Zwickau',
    en: 'Your Retreat in Zwickau',
  },
  'about.text1': {
    de: 'Bamboo Spa vereint die jahrtausendealte Weisheit asiatischer Heilkunst mit modernem Komfort. In unserem liebevoll gestalteten Spa erwartet Sie eine Oase der Ruhe - fernab vom hektischen Alltag.',
    en: 'Bamboo Spa combines the ancient wisdom of Asian healing arts with modern comfort. In our lovingly designed spa, an oasis of tranquility awaits you - far from the hectic everyday life.',
  },
  'about.text2': {
    de: 'Unsere erfahrenen Therapeuten beherrschen traditionelle Techniken aus Asien und schaffen mit jeder Behandlung ein ganzheitliches Erlebnis für Körper, Geist und Seele.',
    en: 'Our experienced therapists master traditional techniques from Asia and create a holistic experience for body, mind, and soul with every treatment.',
  },
  'about.feature1.title': {
    de: 'Asiatische Tradition',
    en: 'Asian Tradition',
  },
  'about.feature1.text': {
    de: 'Authentische Techniken aus jahrtausendealter Praxis',
    en: 'Authentic techniques from millennia-old practice',
  },
  'about.feature2.title': {
    de: 'Erfahrene Therapeuten',
    en: 'Experienced Therapists',
  },
  'about.feature2.text': {
    de: 'Qualifiziertes Team mit langjähriger Erfahrung',
    en: 'Qualified team with years of experience',
  },
  'about.feature3.title': {
    de: 'Natürliche Produkte',
    en: 'Natural Products',
  },
  'about.feature3.text': {
    de: 'Hochwertige, natürliche Pflegeprodukte',
    en: 'High-quality, natural care products',
  },
  'about.btn': {
    de: 'Mehr erfahren',
    en: 'Learn More',
  },

  /* ---------- Treatments Section ---------------------------------------- */

  'treatments.subtitle': {
    de: 'Unsere Behandlungen',
    en: 'Our Treatments',
  },
  'treatments.title': {
    de: 'Verwöhnprogramm für jeden Anspruch',
    en: 'Pampering Program for Every Need',
  },
  'treatments.text': {
    de: 'Entdecken Sie unser vielfältiges Angebot an professionellen Behandlungen - individuell auf Ihre Bedürfnisse abgestimmt.',
    en: 'Discover our diverse range of professional treatments - individually tailored to your needs.',
  },

  /* -- Treatment Cards --------------------------------------------------- */

  'treatments.headspa.title': {
    de: 'Head Spa',
    en: 'Head Spa',
  },
  'treatments.headspa.text': {
    de: 'Tiefenreinigende und entspannende Kopfhautbehandlung mit hochwertigen Pflegeprodukten. Fördert die Durchblutung und sorgt für gesundes, glänzendes Haar.',
    en: 'Deep-cleansing and relaxing scalp treatment with premium care products. Promotes circulation and ensures healthy, shiny hair.',
  },
  'treatments.headspa.btn': {
    de: 'Mehr erfahren',
    en: 'Learn More',
  },
  'treatments.massage.title': {
    de: 'Massage',
    en: 'Massage',
  },
  'treatments.massage.text': {
    de: 'Von der klassischen Ganzkörpermassage bis zur gezielten Rückenmassage - unsere Therapeuten lösen Verspannungen und schenken neue Energie.',
    en: 'From classic full-body massage to targeted back massage - our therapists release tension and give you new energy.',
  },
  'treatments.massage.btn': {
    de: 'Mehr erfahren',
    en: 'Learn More',
  },
  'treatments.kosmetik.title': {
    de: 'Kosmetik',
    en: 'Cosmetics',
  },
  'treatments.kosmetik.text': {
    de: 'Professionelle Gesichtsbehandlungen mit hochwertiger Kosmetik. Reinigung, Peeling und Pflege für ein strahlendes, gesundes Hautbild.',
    en: 'Professional facial treatments with premium cosmetics. Cleansing, peeling, and care for a radiant, healthy complexion.',
  },
  'treatments.kosmetik.btn': {
    de: 'Mehr erfahren',
    en: 'Learn More',
  },
  'treatments.fussmassage.title': {
    de: 'Fußmassage',
    en: 'Foot Massage',
  },
  'treatments.fussmassage.text': {
    de: 'Wohltuende Fußreflexzonen-Massage basierend auf traditionellen asiatischen Techniken. Stimuliert die Selbstheilungskräfte des Körpers.',
    en: 'Soothing foot reflexology massage based on traditional Asian techniques. Stimulates the body\'s self-healing powers.',
  },
  'treatments.fussmassage.btn': {
    de: 'Mehr erfahren',
    en: 'Learn More',
  },
  'treatments.wellness.title': {
    de: 'Wellness',
    en: 'Wellness',
  },
  'treatments.wellness.text': {
    de: 'Ganzheitliche Wellness-Programme, die verschiedene Behandlungen zu einem harmonischen Gesamterlebnis verbinden. Perfekt zum Abschalten.',
    en: 'Holistic wellness programs that combine various treatments into a harmonious overall experience. Perfect for unwinding.',
  },
  'treatments.wellness.btn': {
    de: 'Mehr erfahren',
    en: 'Learn More',
  },

  /* ---------- Gallery Section ------------------------------------------- */

  'gallery.subtitle': {
    de: 'Galerie',
    en: 'Gallery',
  },
  'gallery.title': {
    de: 'Einblicke in unsere Welt',
    en: 'Glimpses Into Our World',
  },
  'gallery.text': {
    de: 'Lassen Sie sich von unserem liebevoll gestalteten Spa inspirieren und entdecken Sie die Atmosphäre, die Sie erwartet.',
    en: 'Be inspired by our lovingly designed spa and discover the atmosphere that awaits you.',
  },
  'gallery.filter.all': {
    de: 'Alle',
    en: 'All',
  },
  'gallery.filter.interior': {
    de: 'Räumlichkeiten',
    en: 'Interior',
  },
  'gallery.filter.treatments': {
    de: 'Behandlungen',
    en: 'Treatments',
  },
  'gallery.filter.ambiance': {
    de: 'Ambiente',
    en: 'Ambiance',
  },

  /* ---------- Booking Banner -------------------------------------------- */

  'booking.subtitle': {
    de: 'Bereit für Ihre Auszeit?',
    en: 'Ready for Your Break?',
  },
  'booking.title': {
    de: 'Buchen Sie Ihren Wohlfühltermin',
    en: 'Book Your Wellness Appointment',
  },
  'booking.text': {
    de: 'Gönnen Sie sich eine Auszeit vom Alltag. Vereinbaren Sie jetzt Ihren persönlichen Termin bei Bamboo Spa.',
    en: 'Treat yourself to a break from everyday life. Schedule your personal appointment at Bamboo Spa now.',
  },
  'booking.btn': {
    de: 'Jetzt Termin buchen',
    en: 'Book Appointment Now',
  },

  /* ---------- Contact Section ------------------------------------------- */

  'contact.subtitle': {
    de: 'Kontakt',
    en: 'Contact',
  },
  'contact.title': {
    de: 'Wir freuen uns auf Sie',
    en: 'We Look Forward to Seeing You',
  },
  'contact.address.label': {
    de: 'Adresse',
    en: 'Address',
  },
  'contact.email.label': {
    de: 'E-Mail',
    en: 'Email',
  },
  'contact.hours.label': {
    de: 'Öffnungszeiten',
    en: 'Opening Hours',
  },
  'contact.hours.weekdays': {
    de: 'Mo - Fr: 10:00 - 20:00',
    en: 'Mon - Fri: 10:00 AM - 8:00 PM',
  },
  'contact.hours.saturday': {
    de: 'Sa: 10:00 - 19:00',
    en: 'Sat: 10:00 AM - 7:00 PM',
  },
  'contact.hours.sunday': {
    de: 'So: Geschlossen',
    en: 'Sun: Closed',
  },
  'contact.form.name': {
    de: 'Ihr Name',
    en: 'Your Name',
  },
  'contact.form.email': {
    de: 'Ihre E-Mail-Adresse',
    en: 'Your Email Address',
  },
  'contact.form.subject': {
    de: 'Betreff',
    en: 'Subject',
  },
  'contact.form.message': {
    de: 'Ihre Nachricht',
    en: 'Your Message',
  },
  'contact.form.submit': {
    de: 'Nachricht senden',
    en: 'Send Message',
  },
  'contact.form.privacy': {
    de: 'Ich stimme der Verarbeitung meiner Daten gemäß der Datenschutzerklärung zu.',
    en: 'I agree to the processing of my data in accordance with the privacy policy.',
  },

  /* ---------- Footer ---------------------------------------------------- */

  'footer.brand.tagline': {
    de: 'RELAX · REBALANCE · RENEW',
    en: 'RELAX · REBALANCE · RENEW',
  },
  'footer.brand.text': {
    de: 'Ihr Rückzugsort für ganzheitliche Entspannung und traditionelle asiatische Wellnesskunst in Zwickau.',
    en: 'Your retreat for holistic relaxation and traditional Asian wellness art in Zwickau.',
  },
  'footer.nav.title': {
    de: 'Navigation',
    en: 'Navigation',
  },
  'footer.services.title': {
    de: 'Behandlungen',
    en: 'Treatments',
  },
  'footer.contact.title': {
    de: 'Kontakt',
    en: 'Contact',
  },
  'footer.hours.title': {
    de: 'Öffnungszeiten',
    en: 'Opening Hours',
  },
  'footer.hours.weekdays': {
    de: 'Mo - Fr: 10:00 - 20:00',
    en: 'Mon - Fri: 10:00 AM - 8:00 PM',
  },
  'footer.hours.saturday': {
    de: 'Sa: 10:00 - 19:00',
    en: 'Sat: 10:00 AM - 7:00 PM',
  },
  'footer.hours.sunday': {
    de: 'So: Geschlossen',
    en: 'Sun: Closed',
  },
  'footer.copyright': {
    de: '© {year} HoangCaster. Alle Rechte vorbehalten.',
    en: '© {year} HoangCaster. All rights reserved.',
  },
  'footer.legal.impressum': {
    de: 'Impressum',
    en: 'Legal Notice',
  },
  'footer.legal.datenschutz': {
    de: 'Datenschutz',
    en: 'Privacy Policy',
  },

  /* ---------- Cookie Banner --------------------------------------------- */

  'cookie.text': {
    de: 'Wir verwenden Cookies, um Ihnen die bestmögliche Erfahrung auf unserer Website zu bieten.',
    en: 'We use cookies to provide you with the best possible experience on our website.',
  },
  'cookie.link': {
    de: 'Mehr erfahren',
    en: 'Learn More',
  },
  'cookie.accept': {
    de: 'Akzeptieren',
    en: 'Accept',
  },
  'cookie.reject': {
    de: 'Ablehnen',
    en: 'Decline',
  },

  /* ---------- Homepage V2 ---------------------------------------------- */

  'home.hero.services': {
    de: 'Behandlungen ansehen',
    en: 'View Treatments',
  },
  'home.about.location': {
    de: 'In Zwickau',
    en: 'In Zwickau',
  },
  'home.about.note': {
    de: 'Raum für echte Ruhe.',
    en: 'Space for genuine calm.',
  },
  'home.tile.headspa': {
    de: 'Tiefenreinigung, Pflege und Ruhe',
    en: 'Deep cleansing, care and calm',
  },
  'home.tile.massage': {
    de: 'Spannung lösen, Kraft finden',
    en: 'Release tension, restore energy',
  },
  'home.tile.cosmetic': {
    de: 'Pflege für ein klares Hautgefühl',
    en: 'Care for fresh, clear skin',
  },
  'home.tile.foot': {
    de: 'Leichtigkeit von Grund auf',
    en: 'Lightness from the ground up',
  },
  'home.tile.wellness': {
    de: 'Ihre persönliche Auszeit',
    en: 'Your personal time to unwind',
  },
  'home.treatments.all': {
    de: 'Alle Behandlungen & Preise',
    en: 'All Treatments & Prices',
  },
  'home.booking.kicker': {
    de: 'Ein ruhiger Moment nur für Sie.',
    en: 'A quiet moment, just for you.',
  },
  'home.booking.title': {
    de: 'Ihre Auszeit beginnt hier.',
    en: 'Your time to unwind starts here.',
  },
  'home.visit.title': {
    de: 'Besuchen Sie uns in Zwickau.',
    en: 'Visit us in Zwickau.',
  },
  'home.visit.text': {
    de: 'Ein stiller Ort mitten in der Stadt. Wir freuen uns darauf, Ihre persönliche Behandlung gemeinsam auszuwählen.',
    en: 'A quiet place in the heart of the city. We will help you choose the treatment that suits you.',
  },
  'home.visit.cta': {
    de: 'Kontakt & Anfahrt',
    en: 'Contact & Directions',
  },
  'home.visit.address': {
    de: 'Adresse',
    en: 'Address',
  },
  'home.visit.hours': {
    de: 'Öffnungszeiten',
    en: 'Opening Hours',
  },
  'home.visit.hoursValue': {
    de: 'Montag - Freitag, 10:00 - 20:00 Uhr<br>Samstag, 10:00 - 19:00 Uhr',
    en: 'Monday - Friday, 10:00 AM - 8:00 PM<br>Saturday, 10:00 AM - 7:00 PM',
  },
  'home.visit.email': {
    de: 'E-Mail',
    en: 'Email',
  },
  'home.cookie.text': {
    de: 'Wir verwenden nur notwendige Cookies, damit diese Website zuverlässig funktioniert.',
    en: 'We only use essential cookies to keep this website working reliably.',
  },
  'home.cookie.essential': {
    de: 'Nur erforderliche',
    en: 'Essential only',
  },
  'home.toast': {
    de: 'Die Online-Terminbuchung ist bald verfügbar.',
    en: 'Online appointment booking will be available soon.',
  },

  /* ---------- Buttons / Labels ------------------------------------------ */

  'btn.booking': {
    de: 'Termin buchen',
    en: 'Book Appointment',
  },
  'btn.learnmore': {
    de: 'Mehr erfahren',
    en: 'Learn More',
  },
  'btn.discover': {
    de: 'Entdecken',
    en: 'Discover',
  },
  'btn.scrolltop': {
    de: 'Nach oben scrollen',
    en: 'Scroll to top',
  },

  /* ---------- Accessibility Labels -------------------------------------- */

  'aria.menu.open': {
    de: 'Menü öffnen',
    en: 'Open menu',
  },
  'aria.menu.close': {
    de: 'Menü schließen',
    en: 'Close menu',
  },
  'aria.slider.prev': {
    de: 'Vorheriges Bild',
    en: 'Previous slide',
  },
  'aria.slider.next': {
    de: 'Nächstes Bild',
    en: 'Next slide',
  },
  'aria.lightbox.close': {
    de: 'Galerie schließen',
    en: 'Close gallery',
  },
  'aria.lightbox.prev': {
    de: 'Vorheriges Bild',
    en: 'Previous image',
  },
  'aria.lightbox.next': {
    de: 'Nächstes Bild',
    en: 'Next image',
  },
  'aria.gallery.zoom': {
    de: 'Bild vergrößern',
    en: 'Zoom image',
  },
  'aria.language.de': {
    de: 'Deutsch',
    en: 'German',
  },
  'aria.language.en': {
    de: 'Englisch',
    en: 'English',
  },
};

/* ==========================================================================
   Language Functions
   ========================================================================== */

/** Currently active language. */
let currentLanguage = 'de';

/**
 * Set the active language and update all translatable elements on the page.
 *
 * Looks for the following data attributes:
 *  - data-i18n           → sets textContent
 *  - data-i18n-placeholder → sets placeholder attribute
 *  - data-i18n-aria      → sets aria-label attribute
 *  - data-i18n-title     → sets title attribute
 *  - data-i18n-html      → sets innerHTML (use sparingly)
 *
 * @param {string} lang - 'de' or 'en'
 */
function setLanguage(lang) {
  if (lang !== 'de' && lang !== 'en') {
    console.warn(`[i18n] Unsupported language "${lang}". Falling back to "de".`);
    lang = 'de';
  }

  currentLanguage = lang;

  // -- Text content --
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.dataset.i18n;
    const entry = translations[key] || translations[key.replace(/_/g, '.')] || translations[key.replace(/\./g, '_')];
    if (!entry) {
      return;
    }

    let text = entry[lang] || entry.de || '';

    // Handle dynamic placeholders like {year}
    text = text.replace('{year}', new Date().getFullYear());

    el.textContent = text;
  });

  // -- Placeholder attributes (for form inputs) --
  document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
    const key = el.dataset.i18nPlaceholder;
    const entry = translations[key];
    if (!entry) return;
    el.placeholder = entry[lang] || entry.de || '';
  });

  // -- ARIA labels --
  document.querySelectorAll('[data-i18n-aria]').forEach((el) => {
    const key = el.dataset.i18nAria;
    const entry = translations[key];
    if (!entry) return;
    el.setAttribute('aria-label', entry[lang] || entry.de || '');
  });

  // -- Title attributes --
  document.querySelectorAll('[data-i18n-title]').forEach((el) => {
    const key = el.dataset.i18nTitle;
    const entry = translations[key];
    if (!entry) return;
    el.title = entry[lang] || entry.de || '';
  });

  // -- innerHTML (use with caution) --
  document.querySelectorAll('[data-i18n-html]').forEach((el) => {
    const key = el.dataset.i18nHtml;
    const entry = translations[key];
    if (!entry) return;
    let html = entry[lang] || entry.de || '';
    html = html.replace('{year}', new Date().getFullYear());
    el.innerHTML = html;
  });

  // -- Update document lang attribute --
  document.documentElement.lang = lang;

  // -- Persist preference --
  try {
    localStorage.setItem('bamboo_language', lang);
  } catch (e) {
    // localStorage may be unavailable (private browsing, etc.)
  }

  // -- Update language switcher active states --
  document.querySelectorAll('.lang-switch__btn').forEach((btn) => {
    btn.classList.toggle('lang-switch__btn--active', btn.dataset.lang === lang);
  });

  // Dispatch a custom event so other modules can react
  document.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
}

/**
 * Initialize the language system.
 * Checks localStorage for a saved preference, defaults to 'de'.
 */
function initLanguage() {
  let savedLang = 'de';

  try {
    savedLang = localStorage.getItem('bamboo_language') || 'de';
  } catch (e) {
    // Fallback to German
  }

  // Validate
  if (savedLang !== 'de' && savedLang !== 'en') {
    savedLang = 'de';
  }

  setLanguage(savedLang);
}

/* ==========================================================================
   Initialization on DOM Ready
   ========================================================================== */

document.addEventListener('DOMContentLoaded', initLanguage);

/* ==========================================================================
   Expose globally for use in main.js and other modules
   ========================================================================== */

window.setLanguage = setLanguage;
window.initLanguage = initLanguage;
window.translations = translations;
window.getCurrentLanguage = () => currentLanguage;
