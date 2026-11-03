/*
 * main.js - Shared interactivity for Ngobeni Chain Supply (Part 3)
 * Features: mobile navigation, scroll animations, back-to-top button,
 * accordion, tabs, modal dialogs, gallery lightbox, dynamic services
 * (search / filter / sort) and the Leaflet contact map.
 * Written in plain JavaScript (no framework needed) and loaded with "defer".
 */
(function () {
  'use strict';

  /* ---------- Small helpers ---------- */
  const $ = (selector, scope) => (scope || document).querySelector(selector);
  const $$ = (selector, scope) => Array.from((scope || document).querySelectorAll(selector));
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. Responsive navigation (hamburger menu) ---------- */
  function initNavigation() {
    const nav = $('.site-header nav');
    const list = nav && $('.nav-list', nav);
    if (!nav || !list) return;

    // The toggle button is created here (not in the HTML) so that, without
    // JavaScript, the full menu simply stays visible on every screen size.
    list.id = 'primary-nav';
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'nav-toggle';
    button.setAttribute('aria-controls', 'primary-nav');
    button.setAttribute('aria-expanded', 'false');
    button.innerHTML = '<span class="nav-toggle-bars" aria-hidden="true"></span><span>Menu</span>';
    nav.insertBefore(button, list);
    nav.classList.add('has-toggle');

    function setOpen(open) {
      list.classList.toggle('is-open', open);
      button.classList.toggle('is-open', open);
      button.setAttribute('aria-expanded', String(open));
    }

    button.addEventListener('click', function () {
      setOpen(!list.classList.contains('is-open'));
    });
    // Close the menu when a link is chosen, Escape is pressed or the screen becomes wide again.
    list.addEventListener('click', function (event) {
      if (event.target.closest('a')) setOpen(false);
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') setOpen(false);
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 900) setOpen(false);
    });
  }

  /* ---------- 2. Scroll animations (IntersectionObserver + CSS transitions) ---------- */
  let revealObserver = null;

  function reveal(elements) {
    if (!revealObserver) return;
    elements.forEach(function (el) {
      el.classList.add('reveal');
      revealObserver.observe(el);
    });
  }

  function initReveal() {
    if (reduceMotion || !('IntersectionObserver' in window)) return;
    revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        el.classList.add('is-visible');
        revealObserver.unobserve(el);
        // Remove helper classes afterwards so normal hover effects keep working.
        window.setTimeout(function () {
          el.classList.remove('reveal', 'is-visible');
        }, 800);
      });
    }, { threshold: 0.12 });
    reveal($$('.card, .step, .gallery-grid figure, .feature-image, .note, .form, .accordion, .tabs, .map-wrap'));
  }

  /* ---------- 3. Back-to-top button (DOM manipulation) ---------- */
  function initBackToTop() {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'back-to-top';
    button.setAttribute('aria-label', 'Back to top');
    button.textContent = '\u2191';
    document.body.appendChild(button);

    function toggle() {
      button.classList.toggle('is-shown', window.scrollY > 400);
    }
    window.addEventListener('scroll', toggle, { passive: true });
    button.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
    toggle();
  }

  /* ---------- 4. Accordion (How It Works FAQ) ---------- */
  function initAccordions() {
    $$('[data-accordion]').forEach(function (accordion) {
      const triggers = $$('.accordion-trigger', accordion);

      function setItem(trigger, open) {
        const panel = document.getElementById(trigger.getAttribute('aria-controls'));
        trigger.setAttribute('aria-expanded', String(open));
        trigger.closest('.accordion-item').classList.toggle('is-open', open);
        if (panel) panel.hidden = !open;
      }

      triggers.forEach(function (trigger, index) {
        trigger.addEventListener('click', function () {
          setItem(trigger, trigger.getAttribute('aria-expanded') !== 'true');
        });
        // Arrow keys move between questions.
        trigger.addEventListener('keydown', function (event) {
          let next = null;
          if (event.key === 'ArrowDown') next = triggers[(index + 1) % triggers.length];
          if (event.key === 'ArrowUp') next = triggers[(index - 1 + triggers.length) % triggers.length];
          if (event.key === 'Home') next = triggers[0];
          if (event.key === 'End') next = triggers[triggers.length - 1];
          if (next) { event.preventDefault(); next.focus(); }
        });
      });

      const toggleAll = $('[data-accordion-toggle]', accordion.parentElement);
      if (toggleAll) {
        toggleAll.addEventListener('click', function () {
          const openAll = toggleAll.dataset.state !== 'open';
          triggers.forEach(function (t) { setItem(t, openAll); });
          toggleAll.dataset.state = openAll ? 'open' : 'closed';
          toggleAll.textContent = openAll ? 'Collapse all' : 'Expand all';
        });
      }
    });
  }

  /* ---------- 5. Tabs (Services page) ---------- */
  function initTabs() {
    $$('[data-tabs]').forEach(function (tabs) {
      const tabButtons = $$('[role="tab"]', tabs);

      function select(tab, focus) {
        tabButtons.forEach(function (t) {
          const active = t === tab;
          t.setAttribute('aria-selected', String(active));
          t.tabIndex = active ? 0 : -1;
          const panel = document.getElementById(t.getAttribute('aria-controls'));
          if (panel) panel.hidden = !active;
        });
        if (focus) tab.focus();
      }

      tabButtons.forEach(function (tab, index) {
        tab.addEventListener('click', function () { select(tab, false); });
        tab.addEventListener('keydown', function (event) {
          let target = null;
          if (event.key === 'ArrowRight') target = tabButtons[(index + 1) % tabButtons.length];
          if (event.key === 'ArrowLeft') target = tabButtons[(index - 1 + tabButtons.length) % tabButtons.length];
          if (event.key === 'Home') target = tabButtons[0];
          if (event.key === 'End') target = tabButtons[tabButtons.length - 1];
          if (target) { event.preventDefault(); select(target, true); }
        });
      });
    });
  }

  /* ---------- 6. Modal dialogs (native <dialog> with a fallback) ---------- */
  function openDialog(dialog) {
    if (typeof dialog.showModal === 'function') {
      if (!dialog.open) dialog.showModal();
    } else {
      dialog.setAttribute('open', '');
    }
  }

  function closeDialog(dialog) {
    if (typeof dialog.close === 'function') dialog.close();
    else dialog.removeAttribute('open');
  }

  function initModals() {
    $$('[data-modal-open]').forEach(function (button) {
      button.addEventListener('click', function () {
        const dialog = document.getElementById(button.dataset.modalOpen);
        if (dialog) openDialog(dialog);
      });
    });
    $$('dialog.modal').forEach(function (dialog) {
      $$('[data-modal-close]', dialog).forEach(function (button) {
        button.addEventListener('click', function () { closeDialog(dialog); });
      });
      // Clicking the dark backdrop (outside the dialog box) closes it.
      dialog.addEventListener('click', function (event) {
        if (event.target === dialog) closeDialog(dialog);
      });
    });
  }

  /* ---------- 7. Gallery lightbox ---------- */
  function initLightbox() {
    const images = $$('.gallery-grid img');
    if (!images.length) return;

    const overlay = document.createElement('div');
    overlay.className = 'lightbox';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Image viewer');
    overlay.hidden = true;
    overlay.innerHTML =
      '<button type="button" class="lightbox-close" aria-label="Close image viewer">\u00d7</button>' +
      '<button type="button" class="lightbox-nav lightbox-prev" aria-label="Previous image">\u2039</button>' +
      '<figure class="lightbox-figure"><img class="lightbox-image" alt="Enlarged gallery image"><figcaption class="lightbox-caption"></figcaption></figure>' +
      '<button type="button" class="lightbox-nav lightbox-next" aria-label="Next image">\u203a</button>';
    document.body.appendChild(overlay);

    const bigImage = $('.lightbox-image', overlay);
    const caption = $('.lightbox-caption', overlay);
    let current = 0;
    let lastFocused = null;

    function show(index) {
      current = (index + images.length) % images.length;
      const source = images[current];
      const figcaption = source.closest('figure') && source.closest('figure').querySelector('figcaption');
      bigImage.src = source.currentSrc || source.src;
      bigImage.alt = source.alt;
      caption.textContent = (figcaption ? figcaption.textContent : source.alt) +
        '  (' + (current + 1) + ' of ' + images.length + ')';
    }

    function open(index) {
      lastFocused = document.activeElement;
      show(index);
      overlay.hidden = false;
      document.body.classList.add('no-scroll');
      $('.lightbox-close', overlay).focus();
    }

    function close() {
      overlay.hidden = true;
      document.body.classList.remove('no-scroll');
      if (lastFocused) lastFocused.focus();
    }

    images.forEach(function (img, index) {
      img.tabIndex = 0;
      img.setAttribute('role', 'button');
      img.setAttribute('aria-label', 'View larger: ' + img.alt);
      img.addEventListener('click', function () { open(index); });
      img.addEventListener('keydown', function (event) {
        if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); open(index); }
      });
    });

    $('.lightbox-close', overlay).addEventListener('click', close);
    $('.lightbox-prev', overlay).addEventListener('click', function () { show(current - 1); });
    $('.lightbox-next', overlay).addEventListener('click', function () { show(current + 1); });
    overlay.addEventListener('click', function (event) {
      if (event.target === overlay) close();
    });
    document.addEventListener('keydown', function (event) {
      if (overlay.hidden) return;
      if (event.key === 'Escape') close();
      if (event.key === 'ArrowLeft') show(current - 1);
      if (event.key === 'ArrowRight') show(current + 1);
      // Keep keyboard focus inside the viewer while it is open.
      if (event.key === 'Tab') {
        const focusable = $$('button', overlay);
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    });
  }

  /* ---------- 8. Dynamic services (loaded with JavaScript + search / filter / sort) ---------- */
  const SERVICES = [
    { id: 'uco', title: 'Used Cooking Oil Collection', category: 'collection',
      text: 'Collection from food businesses that have used cooking oil available and need an organised way to remove it.',
      keywords: 'restaurant hotel caterer fryer oil recycling' },
    { id: 'fat', title: 'Animal Fat Collection', category: 'collection',
      text: 'Collection support for businesses such as butcheries and food processors that produce suitable animal fats.',
      keywords: 'butchery abattoir tallow fat processor' },
    { id: 'transport', title: 'Safe Transportation', category: 'transport',
      text: 'Planned transport from suppliers to the next business customer or processing point, depending on the material and arrangement.',
      keywords: 'lorry vehicle delivery logistics drums containers' },
    { id: 'communication', title: 'Supplier Communication', category: 'support',
      text: 'Clear communication about collection dates, locations, quantities and material types.',
      keywords: 'schedule dates updates contact' },
    { id: 'industrial', title: 'Industrial Enquiries', category: 'industrial',
      text: 'Information for manufacturers that may need fats or oils for production processes such as soap, biodiesel or cosmetics.',
      keywords: 'manufacturer soap biodiesel cosmetics chemical raw material' },
    { id: 'quote', title: 'Quotation Support', category: 'support',
      text: 'A simple quote request process so potential partners can explain what they need before pricing is discussed.',
      keywords: 'price pricing estimate cost quote' }
  ];

  const CATEGORY_LABELS = {
    collection: 'Collection', transport: 'Transport', industrial: 'Industrial', support: 'Support'
  };

  function initServices() {
    const grid = $('#service-grid');
    const tools = $('#service-tools');
    if (!grid || !tools) return;

    const searchInput = $('#service-search', tools);
    const sortSelect = $('#service-sort', tools);
    const count = $('#service-count', tools);
    const chips = $$('[data-filter]', tools);
    let activeFilter = 'all';

    function render() {
      const query = searchInput.value.trim().toLowerCase();
      let results = SERVICES.filter(function (service) {
        const matchesFilter = activeFilter === 'all' || service.category === activeFilter;
        const haystack = (service.title + ' ' + service.text + ' ' + service.keywords + ' ' + service.category).toLowerCase();
        const matchesQuery = !query || query.split(/\s+/).every(function (word) { return haystack.indexOf(word) !== -1; });
        return matchesFilter && matchesQuery;
      });

      results.sort(function (a, b) {
        return sortSelect.value === 'za' ? b.title.localeCompare(a.title) : a.title.localeCompare(b.title);
      });

      grid.textContent = '';
      results.forEach(function (service) {
        const card = document.createElement('article');
        card.className = 'card service-card';
        card.dataset.category = service.category;

        const tag = document.createElement('span');
        tag.className = 'tag';
        tag.textContent = CATEGORY_LABELS[service.category];

        const heading = document.createElement('h3');
        heading.textContent = service.title;

        const text = document.createElement('p');
        text.textContent = service.text;

        const link = document.createElement('a');
        link.className = 'card-link';
        link.href = 'enquiry.html?service=' + encodeURIComponent(service.id);
        link.textContent = 'Enquire about this service \u2192';

        card.append(tag, heading, text, link);
        grid.appendChild(card);
        reveal([card]);
      });

      if (!results.length) {
        const empty = document.createElement('p');
        empty.className = 'no-results note';
        empty.textContent = 'No services match your search. Try a different word, such as "transport" or "biodiesel", or choose "All".';
        grid.appendChild(empty);
      }

      count.textContent = 'Showing ' + results.length + ' of ' + SERVICES.length + ' services';
    }

    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        activeFilter = chip.dataset.filter;
        chips.forEach(function (c) { c.setAttribute('aria-pressed', String(c === chip)); });
        render();
      });
    });
    searchInput.addEventListener('input', render);
    sortSelect.addEventListener('change', render);

    tools.hidden = false; // The controls only appear when JavaScript is available.
    render();
  }

  /* ---------- 9. Interactive map (Leaflet + OpenStreetMap) ---------- */
  // Change these values to the real business address once it is confirmed.
  const NCS_LOCATION = {
    lat: -26.2041,
    lng: 28.0473,
    name: 'Ngobeni Chain Supply',
    note: 'Proposed service hub. Exact address to be confirmed.',
    radiusMetres: 50000
  };

  function initMap() {
    const mapElement = $('#map');
    if (!mapElement) return;

    if (typeof window.L === 'undefined') {
      mapElement.innerHTML = '<p class="map-fallback">The interactive map could not be loaded. Please check your internet connection or use the contact details above.</p>';
      return;
    }

    const L = window.L;
    const map = L.map(mapElement, { scrollWheelZoom: false }).setView([NCS_LOCATION.lat, NCS_LOCATION.lng], 8);

    const streets = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors'
    }).addTo(map);

    const terrain = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      maxZoom: 17,
      attribution: 'Map data: &copy; OpenStreetMap contributors, SRTM | Style: &copy; <a href="https://opentopomap.org" target="_blank" rel="noopener noreferrer">OpenTopoMap</a> (CC-BY-SA)'
    });

    const marker = L.marker([NCS_LOCATION.lat, NCS_LOCATION.lng], { title: NCS_LOCATION.name, alt: NCS_LOCATION.name }).addTo(map);
    const popup = document.createElement('div');
    const strong = document.createElement('strong');
    strong.textContent = NCS_LOCATION.name;
    const note = document.createElement('p');
    note.textContent = NCS_LOCATION.note;
    popup.append(strong, note);
    marker.bindPopup(popup).openPopup();

    const area = L.circle([NCS_LOCATION.lat, NCS_LOCATION.lng], {
      radius: NCS_LOCATION.radiusMetres, color: '#2e6b3a', fillColor: '#2e6b3a', fillOpacity: 0.12
    }).bindTooltip('Primary collection area (prototype)');

    L.control.layers({ 'Street map': streets, 'Terrain': terrain }, { 'Collection area': area }).addTo(map);
    area.addTo(map);
    L.control.scale({ imperial: false }).addTo(map);

    // Scroll-wheel zoom is switched on only after the visitor clicks the map, so page scrolling is not hijacked.
    map.on('click', function () { map.scrollWheelZoom.enable(); });
    map.on('mouseout', function () { map.scrollWheelZoom.disable(); });
  }

  /* ---------- 10. Footer share links (off-page SEO: easy social sharing) ---------- */
  function initShareLinks() {
    const target = $('[data-share]');
    if (!target) return;
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(document.title);
    const links = [
      ['Share on Facebook', 'https://www.facebook.com/sharer/sharer.php?u=' + url],
      ['Share on X', 'https://twitter.com/intent/tweet?url=' + url + '&text=' + text],
      ['Share on LinkedIn', 'https://www.linkedin.com/sharing/share-offsite/?url=' + url],
      ['Share on WhatsApp', 'https://wa.me/?text=' + text + '%20' + url]
    ];
    const list = document.createElement('ul');
    list.className = 'share-links';
    links.forEach(function (item) {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = item[1];
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.textContent = item[0];
      li.appendChild(a);
      list.appendChild(li);
    });
    target.appendChild(list);
  }

  /* ---------- 10. Share links in the footer (off-page SEO / social media) ---------- */
  function initShareLinks() {
    const footer = $('.site-footer');
    if (!footer || $('.share-row', footer)) return;
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent('Ngobeni Chain Supply - used cooking oil and fat collection for business');
    const links = [
      ['Share on Facebook', 'https://www.facebook.com/sharer/sharer.php?u=' + url],
      ['Share on WhatsApp', 'https://wa.me/?text=' + text + '%20' + url],
      ['Share on LinkedIn', 'https://www.linkedin.com/sharing/share-offsite/?url=' + url]
    ];
    const list = document.createElement('ul');
    list.className = 'share-row';
    list.setAttribute('aria-label', 'Share this page');
    links.forEach(function (item) {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = item[1];
      a.textContent = item[0];
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      li.appendChild(a);
      list.appendChild(li);
    });
    // Place the list just before the copyright line (a direct child of the footer).
    const copyright = Array.from(footer.children).filter(function (c) { return c.tagName === 'P'; }).pop();
    footer.insertBefore(list, copyright || null);
  }

  /* ---------- Start everything once the page is ready ---------- */
  function init() {
    initNavigation();
    initShareLinks();
    initReveal();
    initBackToTop();
    initAccordions();
    initTabs();
    initModals();
    initLightbox();
    initServices();
    initMap();
    initShareLinks();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
