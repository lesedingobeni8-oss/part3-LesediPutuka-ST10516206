/*
 * forms.js - Form validation, enquiry processing and contact e-mail (Part 3)
 *
 *  - enquiry.html : validated enquiry form. After validation the data is sent
 *    asynchronously (AJAX / fetch) to data/rates.json, processed and a
 *    response about cost and availability is shown to the user.
 *  - contact.html : validated contact form. The validated data is turned into
 *    an e-mail that the visitor sends to the recipient defined below (mailto).
 *  - quote.html / suppliers.html : the same validation, then a ready-to-send
 *    e-mail request.
 *
 * The validation uses the HTML5 attributes written in the HTML (required,
 * type, minlength, maxlength, pattern, min, max) plus JavaScript checks for
 * South African phone numbers and dates. Messages are shown next to the field.
 */
(function () {
  'use strict';

  // The e-mail address that receives messages (the recipient "stated in the code").
  const RECIPIENT = 'info@ngobenichainsupply.co.za';

  const $ = (selector, scope) => (scope || document).querySelector(selector);
  const $$ = (selector, scope) => Array.from((scope || document).querySelectorAll(selector));

  /* ---------- Validation rules ---------- */
  // South African numbers: 0XX XXX XXXX or +27 XX XXX XXXX (spaces, dashes and brackets allowed).
  function isValidSAPhone(value) {
    const digits = value.replace(/[\s\-()]/g, '');
    return /^(\+27|0027|0)[1-9]\d{8}$/.test(digits);
  }

  function parseDate(value) {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
    if (!match) return null;
    const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
    // Reject impossible dates such as 2026-02-31.
    if (date.getFullYear() !== Number(match[1]) || date.getMonth() !== Number(match[2]) - 1 || date.getDate() !== Number(match[3])) return null;
    return date;
  }

  function startOfToday() {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }

  function fieldLabel(field) {
    const label = field.id ? document.querySelector('label[for="' + field.id + '"]') : null;
    if (!label) return 'This field';
    const clone = label.cloneNode(true);
    $$('.hint, .required-mark', clone).forEach(function (node) { node.remove(); });
    return clone.textContent.trim().replace(/[:*]\s*$/, '');
  }

  // Returns an error message, or '' when the field is valid.
  function validateField(field) {
    const value = (field.value || '').trim();
    const name = fieldLabel(field);

    if (field.type === 'checkbox') {
      return field.required && !field.checked ? 'Please tick this box to continue.' : '';
    }
    if (field.required && !value) {
      return field.tagName === 'SELECT' ? 'Please choose an option for "' + name + '".' : '"' + name + '" is required.';
    }
    if (!value) return ''; // optional and empty

    if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
      return 'Enter a valid e-mail address, for example name@company.co.za.';
    }
    if (field.type === 'tel' && !isValidSAPhone(value)) {
      return 'Enter a valid South African phone number, for example 067 140 2467 or +27 67 140 2467.';
    }
    if (field.dataset.minlength || field.minLength > 0) {
      const min = Number(field.dataset.minlength || field.minLength);
      if (value.length < min) return '"' + name + '" must be at least ' + min + ' characters (you have ' + value.length + ').';
    }
    if (field.maxLength > 0 && value.length > field.maxLength) {
      return '"' + name + '" must be ' + field.maxLength + ' characters or fewer.';
    }
    if (field.type === 'number') {
      const number = Number(value);
      if (Number.isNaN(number)) return 'Enter a number.';
      if (field.min !== '' && number < Number(field.min)) return '"' + name + '" must be at least ' + field.min + '.';
      if (field.max !== '' && number > Number(field.max)) return '"' + name + '" cannot be more than ' + field.max + '.';
    }
    if (field.type === 'date') {
      const date = parseDate(value);
      if (!date) return 'Enter a valid date.';
      if (field.dataset.futureOnly !== undefined && date < startOfToday()) return 'The date cannot be in the past.';
      if (field.dataset.maxDays) {
        const limit = new Date(startOfToday());
        limit.setDate(limit.getDate() + Number(field.dataset.maxDays));
        if (date > limit) return 'Please choose a date within the next ' + field.dataset.maxDays + ' days.';
      }
    }
    if (field.dataset.pattern) {
      if (!new RegExp(field.dataset.pattern).test(value)) return field.dataset.patternMessage || 'The format of "' + name + '" is not correct.';
    }
    return '';
  }

  function validateGroup(fieldset) {
    // A group of radio buttons that must have one option chosen.
    const radios = $$('input[type="radio"]', fieldset);
    if (!radios.length) return '';
    const required = radios.some(function (r) { return r.required; });
    const chosen = radios.some(function (r) { return r.checked; });
    return required && !chosen ? 'Please choose one option.' : '';
  }

  function errorBox(field) {
    return field.closest('fieldset') && field.type === 'radio'
      ? $('.field-error', field.closest('fieldset'))
      : document.getElementById(field.id + '-error');
  }

  function showFieldState(field, message) {
    const isRadio = field.type === 'radio';
    const holder = isRadio ? field.closest('fieldset') : field;
    const box = errorBox(field);
    holder.classList.toggle('is-invalid', Boolean(message));
    if (!isRadio) holder.classList.toggle('is-valid', !message && (field.value || '').trim() !== '');
    if (!isRadio) field.setAttribute('aria-invalid', message ? 'true' : 'false');
    if (box) box.textContent = message;
  }

  function checkField(field) {
    const message = field.type === 'radio' ? validateGroup(field.closest('fieldset')) : validateField(field);
    showFieldState(field, message);
    return message;
  }

  // Validates the whole form; focuses the first invalid control and returns true when everything is valid.
  function validateForm(form) {
    const errors = [];
    const seenGroups = new Set();
    $$('input, select, textarea', form).forEach(function (field) {
      if (field.type === 'hidden' || field.type === 'submit' || field.type === 'button') return;
      if (field.type === 'radio') {
        const group = field.closest('fieldset');
        if (seenGroups.has(group)) return;
        seenGroups.add(group);
      }
      const message = checkField(field);
      if (message) errors.push({ field: field, message: message });
    });
    if (errors.length) {
      const first = errors[0].field;
      first.focus();
      const summary = $('.form-status', form);
      if (summary) {
        summary.hidden = false;
        summary.classList.add('is-error');
        summary.innerHTML = '<h3>Please fix ' + errors.length + (errors.length === 1 ? ' problem' : ' problems') + '</h3><p>The highlighted fields need attention before the form can be sent.</p>';
        summary.setAttribute('role', 'alert');
      }
      return false;
    }
    return true;
  }

  function attachLiveValidation(form) {
    form.setAttribute('novalidate', '');
    form.addEventListener('focusout', function (event) {
      const field = event.target;
      if (!field.matches('input, select, textarea')) return;
      if (field.type === 'radio') return;
      // Do not complain about untouched empty required fields until submit.
      if (!field.value && !field.classList.contains('is-invalid')) return;
      checkField(field);
    });
    form.addEventListener('input', function (event) {
      const field = event.target;
      if (field.classList.contains('is-invalid')) checkField(field);
      const counter = field.id && document.getElementById(field.id + '-count');
      if (counter && field.maxLength > 0) counter.textContent = field.value.length + ' / ' + field.maxLength + ' characters';
    });
    form.addEventListener('change', function (event) {
      const field = event.target;
      if (field.type === 'radio' || field.tagName === 'SELECT' || field.type === 'checkbox') checkField(field);
    });
    form.addEventListener('reset', function () {
      $$('.is-invalid, .is-valid', form).forEach(function (el) { el.classList.remove('is-invalid', 'is-valid'); });
      $$('.field-error', form).forEach(function (el) { el.textContent = ''; });
      const status = $('.form-status', form);
      if (status) { status.hidden = true; status.textContent = ''; }
    });
    // Set the minimum for future-only dates so the date picker also blocks past days.
    $$('input[type="date"][data-future-only]', form).forEach(function (input) {
      const d = startOfToday();
      input.min = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    });
  }

  /* ---------- Helpers for results ---------- */
  function escapeHtml(text) {
    return String(text).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function formatRand(amount) {
    return 'R ' + Math.round(amount).toLocaleString('en-ZA');
  }

  function formatDate(date) {
    return date.toLocaleDateString('en-ZA', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  }

  function radioValue(form, name) {
    const checked = $('input[name="' + name + '"]:checked', form);
    return checked ? checked.value : '';
  }

  function makeMailto(subject, body) {
    return 'mailto:' + RECIPIENT + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
  }

  // Shows the e-mail the visitor is about to send, with buttons to open the mail app or copy the text.
  function showEmailReady(form, subject, body, heading) {
    const status = $('.form-status', form);
    const href = makeMailto(subject, body);
    status.hidden = false;
    status.classList.remove('is-error');
    status.setAttribute('role', 'status');
    status.innerHTML =
      '<h3>' + escapeHtml(heading) + '</h3>' +
      '<p>Your details are valid. Your e-mail is ready to send to <strong>' + escapeHtml(RECIPIENT) + '</strong>.</p>' +
      '<p><strong>Subject:</strong> ' + escapeHtml(subject) + '</p>' +
      '<div class="email-preview">' + escapeHtml(body) + '</div>' +
      '<div class="button-row">' +
      '<a class="button" id="mailto-link" href="' + escapeHtml(href) + '">Open in my e-mail app</a>' +
      '<button type="button" class="button secondary" id="copy-email">Copy e-mail text</button>' +
      '</div>' +
      '<p class="hint" id="copy-feedback" aria-live="polite"></p>' +
      '<p class="hint">If nothing opens, copy the text and send it to ' + escapeHtml(RECIPIENT) + ' from your usual e-mail account.</p>';
    $('#copy-email', status).addEventListener('click', function () {
      const text = 'To: ' + RECIPIENT + '\nSubject: ' + subject + '\n\n' + body;
      const feedback = $('#copy-feedback', status);
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(
          function () { feedback.textContent = 'E-mail text copied.'; },
          function () { feedback.textContent = 'Copying was blocked. Please select the text above and copy it.'; }
        );
      } else {
        feedback.textContent = 'Please select the text above and copy it.';
      }
    });
    status.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    status.focus && status.setAttribute('tabindex', '-1');
    status.focus();
  }

  function formSummary(form, labels) {
    // Builds "Label: value" lines from the form for the e-mail body.
    return labels.map(function (item) {
      const field = form.elements[item[0]];
      let value = '';
      if (!field) return '';
      if (field.length !== undefined && field.tagName !== 'SELECT' && field[0] && field[0].type === 'radio') value = radioValue(form, item[0]);
      else value = (field.value || '').trim();
      return value ? item[1] + ': ' + value : '';
    }).filter(Boolean).join('\n');
  }

  /* ---------- Enquiry form (processed with AJAX and answered on the page) ---------- */
  // Fallback prices used when data/rates.json cannot be loaded (for example when
  // the page is opened straight from the file system). Illustrative values only.
  const DEFAULT_RATES = {
    note: 'Indicative prototype rates. Final prices are confirmed in a written quotation.',
    leadTimeBusinessDays: 2,
    services: {
      collection: { label: 'Used cooking oil collection', perKg: 1.2, minimumCharge: 350 },
      fat: { label: 'Animal fat collection', perKg: 1.5, minimumCharge: 400 },
      transport: { label: 'Safe transportation', perKg: 0.9, minimumCharge: 600 },
      industrial: { label: 'Industrial supply enquiry', perKg: 0, minimumCharge: 0, quoteOnly: true },
      quote: { label: 'General quotation', perKg: 0, minimumCharge: 0, quoteOnly: true }
    },
    regions: {
      gauteng: { label: 'Gauteng', multiplier: 1.0, collectionDays: [1, 2, 3, 4, 5] },
      kzn: { label: 'KwaZulu-Natal', multiplier: 1.25, collectionDays: [2, 4] },
      wc: { label: 'Western Cape', multiplier: 1.4, collectionDays: [3, 5] },
      other: { label: 'Other province', multiplier: 1.6, collectionDays: [2, 4] }
    },
    urgency: { standard: { label: 'Standard', multiplier: 1.0 }, priority: { label: 'Priority (next available day)', multiplier: 1.3 } }
  };

  function loadRates(url) {
    // AJAX: fetch the rates file asynchronously; fall back to built-in values if it fails.
    return fetch(url, { headers: { Accept: 'application/json' }, cache: 'no-cache' })
      .then(function (response) {
        if (!response.ok) throw new Error('HTTP ' + response.status);
        return response.json();
      })
      .catch(function () { return DEFAULT_RATES; });
  }

  function nextCollectionDate(requested, region, leadDays, priority) {
    // Earliest allowed date = today + lead time (business days). Then move forward to the next collection day for the region.
    const earliest = startOfToday();
    let added = 0;
    const lead = priority ? 1 : leadDays;
    while (added < lead) {
      earliest.setDate(earliest.getDate() + 1);
      if (earliest.getDay() !== 0 && earliest.getDay() !== 6) added += 1;
    }
    const start = requested && requested > earliest ? new Date(requested) : earliest;
    const date = new Date(start);
    for (let i = 0; i < 14; i += 1) {
      if (region.collectionDays.indexOf(date.getDay()) !== -1) break;
      date.setDate(date.getDate() + 1);
    }
    return { date: date, moved: !requested || date.getTime() !== requested.getTime() };
  }

  function initEnquiry(form) {
    attachLiveValidation(form);

    // Pre-select the service when arriving from the Services page (enquiry.html?service=transport).
    const params = new URLSearchParams(window.location.search);
    const preset = params.get('service');
    const serviceSelect = form.elements.service;
    if (preset && serviceSelect && $('option[value="' + preset.replace(/[^a-z]/gi, '') + '"]', serviceSelect)) {
      serviceSelect.value = preset.replace(/[^a-z]/gi, '');
    }

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      if (!validateForm(form)) return;

      const submit = $('button[type="submit"]', form);
      const status = $('.form-status', form);
      submit.disabled = true;
      submit.textContent = 'Checking availability...';
      status.hidden = false;
      status.classList.remove('is-error');
      status.setAttribute('role', 'status');
      status.innerHTML = '<p>Processing your enquiry...</p>';

      loadRates(form.dataset.rates || 'data/rates.json').then(function (rates) {
        const service = rates.services[form.elements.service.value];
        const region = rates.regions[form.elements.region.value];
        const urgency = rates.urgency[radioValue(form, 'urgency')];
        const kilograms = Number(form.elements.quantity.value);
        const requested = parseDate(form.elements.date.value);
        const when = nextCollectionDate(requested, region, rates.leadTimeBusinessDays, radioValue(form, 'urgency') === 'priority');

        let costRow;
        if (service.quoteOnly) {
          costRow = '<tr><th scope="row">Estimated cost</th><td>Quotation required. We will price this after discussing the material and your needs.</td></tr>';
        } else {
          const base = Math.max(service.minimumCharge, kilograms * service.perKg);
          const total = base * region.multiplier * urgency.multiplier;
          costRow = '<tr><th scope="row">Estimated cost</th><td><strong>' + formatRand(total) + '</strong> (excluding VAT) - ' + kilograms + ' kg at the ' + escapeHtml(region.label) + ' rate, ' + escapeHtml(urgency.label.toLowerCase()) + ' service</td></tr>';
        }

        const dateText = when.moved
          ? formatDate(when.date) + ' (the earliest collection day for ' + escapeHtml(region.label) + (requested ? ', after your requested date' : '') + ')'
          : formatDate(when.date) + ' - your requested date is available';

        const name = escapeHtml(form.elements.name.value.trim());
        status.innerHTML =
          '<h3>Thank you, ' + name + '. Here is your enquiry response</h3>' +
          '<table class="result-table"><tbody>' +
          '<tr><th scope="row">Service</th><td>' + escapeHtml(service.label) + '</td></tr>' +
          '<tr><th scope="row">Material</th><td>' + escapeHtml(radioValue(form, 'material')) + '</td></tr>' +
          costRow +
          '<tr><th scope="row">Availability</th><td>' + dateText + '</td></tr>' +
          '<tr><th scope="row">Reference</th><td>NCS-' + Date.now().toString(36).toUpperCase() + '</td></tr>' +
          '</tbody></table>' +
          '<p class="hint">' + escapeHtml(rates.note) + ' To confirm this enquiry, send it to us by e-mail or use the Contact page.</p>' +
          '<div class="button-row"><a class="button" id="enquiry-mailto" href="#">Confirm by e-mail</a>' +
          '<a class="button secondary" href="quote.html">Request a formal quote</a></div>';

        const subject = 'Enquiry: ' + service.label;
        const body = 'Enquiry from the Ngobeni Chain Supply website\n\n' + formSummary(form, [
          ['name', 'Name'], ['company', 'Company'], ['email', 'E-mail'], ['phone', 'Phone'], ['service', 'Service key'],
          ['material', 'Material'], ['quantity', 'Quantity (kg)'], ['region', 'Region'], ['date', 'Preferred date'], ['urgency', 'Urgency'], ['details', 'Details']
        ]) + '\n\nEstimate shown on website: ' + (service.quoteOnly ? 'quotation required' : $('.result-table strong', status).textContent) + '\nEarliest available date: ' + formatDate(when.date);
        $('#enquiry-mailto', status).href = makeMailto(subject, body);
        status.setAttribute('tabindex', '-1');
        status.focus();
      }).catch(function () {
        status.classList.add('is-error');
        status.innerHTML = '<h3>Something went wrong</h3><p>We could not process the enquiry. Please try again or use the Contact page.</p>';
      }).then(function () {
        submit.disabled = false;
        submit.textContent = 'Check cost and availability';
      });
    });
  }

  /* ---------- Contact form (validated, then e-mailed) ---------- */
  function initContact(form) {
    attachLiveValidation(form);
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      if (!validateForm(form)) return;
      const type = form.elements.topic.value;
      const subject = '[Website] ' + type + ' - ' + form.elements['contact-name'].value.trim();
      const body = 'Message from the Ngobeni Chain Supply website\n\n' + formSummary(form, [
        ['contact-name', 'Name'], ['contact-email', 'E-mail'], ['contact-phone', 'Phone'], ['topic', 'Type of message'], ['contact-method', 'Preferred contact method']
      ]) + '\n\nMessage:\n' + form.elements['contact-message'].value.trim();
      showEmailReady(form, subject, body, 'Your message is ready to send');
    });
  }

  /* ---------- Quote and supplier forms: same validation, ready-to-send e-mail ---------- */
  function initEmailForm(form) {
    attachLiveValidation(form);
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      if (!validateForm(form)) return;
      const lines = [];
      $$('input, select, textarea', form).forEach(function (field) {
        if (field.type === 'submit' || field.type === 'button' || field.type === 'checkbox') return;
        if (field.type === 'radio' && !field.checked) return;
        const value = (field.value || '').trim();
        if (value) lines.push(fieldLabel(field) + ': ' + value);
      });
      showEmailReady(form, form.dataset.subject || 'Website request', 'Request from the Ngobeni Chain Supply website\n\n' + lines.join('\n'), form.dataset.heading || 'Your request is ready to send');
    });
  }

  function init() {
    $$('form[data-form]').forEach(function (form) {
      const kind = form.dataset.form;
      if (kind === 'enquiry') initEnquiry(form);
      else if (kind === 'contact') initContact(form);
      else initEmailForm(form);
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
