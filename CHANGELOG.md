# Changelog

All notable changes to the Ngobeni Chain Supply website. Newest entries first.

## 2026-10-27 - Part 3: Enhancing Functionality and SEO

### Changes made from Part 2 feedback
Part 2 feedback scored: Feedback for Part 1 5/10, media queries 7/10, layout 4/5, typography 4/5, navigation menu 4/5, images 4/5, commits 2/5, README 4/5, changelog 2/5, references 0/5. Each item was addressed as follows.

- **Media queries (7/10 -> improved):** Added a full set of breakpoints in `assets/css/styles.css` - 1400 px and up (centred maximum width), 1100 px (small desktop), 900 px (tablet), 600 px (mobile) and 400 px (small mobile) - in addition to the original 800 px rule. A bug found during testing was fixed: the new 1100 px rule overrode the 800 px rule and kept two columns on phones, so the single-column layout is restated inside the 800 px block.
- **Layout (4/5):** Card grids and the gallery change from three columns to two (1100 px) and one (800 px). The hero, footer, forms and tabs re-flow; buttons become full width on mobile; the result table stacks on small screens.
- **Typography (4/5):** Page and hero headings scale with `clamp()` and step down at 900 px and 600 px; paragraph, tagline and brand sizes are reduced on small screens; line height is kept at 1.6 for readability.
- **Navigation menu (4/5):** On screens of 900 px and narrower the menu collapses behind a "Menu" button (hamburger icon that animates into a cross). It uses `aria-expanded` and `aria-controls`, closes with Escape or when a link is chosen, and the full menu stays visible if JavaScript is off.
- **Images (4/5):** Images stay within their containers, use an aspect ratio per breakpoint, are lazy-loaded with async decoding (the home hero image loads first with high priority), and the Gallery alt text was rewritten to be more descriptive.
- **GitHub commits (2/5):** Work for this part is committed in small, regular, descriptive steps (see `docs/commit-plan.sh`), for example "Add FAQ accordion to How It Works page" and "Add enquiry page with validation and AJAX cost/availability response".
- **README (4/5):** Rewritten to describe every Part 3 feature, the form behaviour and its limits, SEO work, testing, deployment and the changelog summary.
- **Changelog (2/5):** This file now gives dated, detailed entries explaining what changed, where and why.
- **References (0/5):** Added `docs/REFERENCES.md` in Harvard format, with author or organisation, year, title, URL and accessed date for each source.
- **Feedback for Part 1 (5/10):** The Part 1 changelog entry was kept and extended, and fixes to earlier HTML problems are listed below.

### HTML fixes to existing pages (no design changes)
- Removed a stray `-` character that appeared before the `<nav>` on `industrial-customers.html`.
- Added the missing closing `</body>` tag on `contact.html`.
- Added links to the empty footer area on every sub-page (About, Services, How It Works, Suppliers, Enquiry, Gallery, Contact, Home), improving internal linking.
- Added an "Enquiry" link to the main navigation on every page and `id="main"` to each `<main>` element for the skip link.

### Functionality (JavaScript)
- Added `assets/js/main.js`: hamburger menu, scroll-triggered fade-in animations, back-to-top button, FAQ accordion, tabs, modal dialog, gallery lightbox, dynamic services with search/filter/sort, Leaflet map and footer share links.
- Added a FAQ accordion with six questions and an "Expand all" button to `how-it-works.html`.
- Added industry tabs (soap, biodiesel, cosmetics, chemicals) to `industrial-customers.html`.
- Added a container and safety guidelines modal to `suppliers.html`.
- Services on `services.html` are now built by JavaScript with search, category filters, A-Z/Z-A sorting, a result count and a "no results" message. The original static cards remain as a fallback.
- Added a gallery lightbox with previous/next buttons, keyboard controls, captions with image counts and focus management.
- Added an interactive Leaflet map to `contact.html` with a marker, popup, collection-area circle, layer switcher and scale. The coordinates are placeholders until the address is confirmed.

### Forms
- Added `pages/enquiry.html`. The form validates input and then uses `fetch` (AJAX) to load `data/rates.json`, calculates an estimated cost and the earliest available collection date and shows them with a reference number.
- Rebuilt the contact form on `contact.html` with name, e-mail, optional phone, message type, reply method, message with character counter and consent. Valid data becomes an e-mail addressed to `info@ngobenichainsupply.co.za`.
- Rebuilt the quote form (`quote.html`) and supplier form (`suppliers.html`) with the same validation, adding e-mail, optional phone, preferred date and consent fields.
- Added `assets/js/forms.js` with validation for required fields, e-mail format, South African phone numbers, numbers within a range, dates (not in the past, within 180 days) and character lengths. Errors show beside each field, valid fields turn green, and the first problem receives focus.
- Added `data/rates.json` containing clearly labelled prototype rates.

### SEO
- Unique, keyword-rich titles and meta descriptions, meta keywords, Open Graph tags and robots meta tags on all ten pages.
- Added `LocalBusiness` JSON-LD structured data to the Home and Contact pages.
- Added `robots.txt`, `sitemap.xml`, a favicon (`assets/images/favicon.svg`) and a `_headers` file with security and caching headers.
- Added a "Skip to main content" link, descriptive alt text and `lazy` image loading.
- Added footer share links for Facebook, WhatsApp and LinkedIn.

### Styling
- Appended Part 3 styles to `styles.css` below the original rules; the original Part 1/2 CSS was not edited.
- Added focus outlines, hover effects, transitions, a `prefers-reduced-motion` setting and print styles.

### Testing
- Ran 94 automated browser checks (pages load, links resolve, SEO tags present, alt text, no sideways scrolling on mobile, accordion, tabs, modal, lightbox, search/filter/sort, form validation messages, enquiry response, e-mail link, back-to-top, no-JavaScript fallback).
- Bugs found and fixed during testing: footer share links failed on sub-pages; the home page navigation showed "Enquiry" and "Gallery" twice; the 1100 px rule kept two columns on phones; the lightbox image had an empty alt attribute.

## 2026-08-14 - Part 1

- Created the main project folder and organised subfolders for pages, CSS, images and documentation.
- Built the home page with a clear introduction, call-to-action buttons and service summary cards.
- Added About, Services, How It Works, Suppliers, Industrial Customers, Quote, Gallery and Contact pages.
- Added consistent navigation to every page.
- Added forms for supplier collection requests, quote requests and contact enquiries.
- Added a shared CSS stylesheet with the proposed green, white, charcoal and gold colour style.
- Replaced placeholder illustrations with realistic Creative Commons images related to oil collection, recycling and biodiesel processing.
- Added README, references and a beginner Visual Studio Code guide.
