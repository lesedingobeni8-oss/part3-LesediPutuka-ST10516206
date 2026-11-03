# Ngobeni Chain Supply Website

This is my WEDE5020 website project (Parts 1 to 3) for Ngobeni Chain Supply (NCS). The website is for a proposed South African business that collects and transports used cooking oil and animal fats for business customers. Part 3 adds JavaScript interactivity, search engine optimisation (SEO), validated forms, an interactive map and deployment.

- **GitHub repository:** `[paste your repository link here]`
- **Live website:** `[paste your deployed website link here]`

## Project Purpose

The purpose of the website is to give Ngobeni Chain Supply a professional online presence. It explains the business, its services and how collection works, and it gives suppliers and industrial customers a way to enquire, request quotes and make contact.

## Website Pages

- `index.html` - Home page
- `pages/about.html` - About the business
- `pages/services.html` - Services offered (loaded with JavaScript, with search, filter and sort)
- `pages/how-it-works.html` - Collection process and FAQ accordion
- `pages/suppliers.html` - Supplier collection request page with a safety guidelines modal
- `pages/industrial-customers.html` - Information for industrial customers with industry tabs
- `pages/quote.html` - Quote request form
- `pages/enquiry.html` - **New in Part 3:** enquiry form that returns a cost and availability response
- `pages/gallery.html` - Image gallery with a lightbox
- `pages/contact.html` - Contact details, contact form that builds an e-mail, and an interactive map

## Folder Structure

```text
ngobeni-chain-supply/
  index.html
  README.md
  CHANGELOG.md
  robots.txt
  sitemap.xml
  _headers
  assets/
    css/
      styles.css
    js/
      main.js
      forms.js
    images/
      favicon.svg
      biodiesel-industrial-process.jpg
      biodiesel-oil-collection-can.jpg
      oil-collection-lorry.jpg
      oil-recycling-container.jpg
  data/
    rates.json
  docs/
    REFERENCES.md
    DEPLOYMENT.md
    commit-plan.sh
    STEP-BY-STEP-VSCODE-GUIDE.md
  pages/
    about.html
    contact.html
    enquiry.html
    gallery.html
    how-it-works.html
    industrial-customers.html
    quote.html
    services.html
    suppliers.html
```

## Technologies Used

- HTML5, CSS3 and plain JavaScript (no framework, so pages load quickly)
- [Leaflet](https://leafletjs.com) 1.9.4 with OpenStreetMap and OpenTopoMap tiles for the interactive map (loaded from the unpkg CDN)
- `fetch` (AJAX) to load `data/rates.json` for enquiry processing
- Visual Studio Code, Google Chrome / Microsoft Edge for testing
- Git and GitHub for version control; GitHub Pages or Netlify for deployment

## Part 3 Features

### Interactive elements and animation
- **Accordion** (How It Works): six FAQ items, keyboard accessible, with an "Expand all" button.
- **Tabs** (Industrial Customers): soap, biodiesel, cosmetics and chemicals, with arrow-key navigation.
- **Modal dialog** (Suppliers): container and safety guidelines using the native `<dialog>` element; closes with Escape, the close button or a click outside.
- **Gallery lightbox** (Gallery): click or press Enter on any image to see it larger, move with the arrows or arrow keys, close with Escape, focus kept inside the viewer.
- **Animations:** cards and sections fade in on scroll (IntersectionObserver), hover lift effects, a smooth hamburger icon and a back-to-top button. Animations switch off for visitors who prefer reduced motion.
- **DOM manipulation:** the services cards, hamburger button, lightbox, back-to-top button, footer share links and form messages are all created or updated by JavaScript.

### Interactive map (Contact)
A Leaflet map shows the proposed service hub with a popup, a circle for the collection area, a street/terrain layer switcher and a scale bar. Scroll-zoom turns on only after a click so it does not interrupt page scrolling. If the map library cannot load, a clear message is shown instead. **The coordinates are placeholders (Johannesburg) until the real address is confirmed; change `NCS_LOCATION` at the top of the map section in `assets/js/main.js`.**

### Dynamic content and search (Services)
The six services are built by JavaScript. Visitors can search by any word (including keywords such as "biodiesel" or "restaurant"), filter by category (Collection, Transport, Industrial, Support), and sort A to Z or Z to A. A live count shows the number of results, and an empty-state message appears when nothing matches. Without JavaScript the original static cards remain visible.

### Forms
| Form | Purpose | Validation | Result |
|---|---|---|---|
| `enquiry.html` | Enquire about a service | Required fields, e-mail format, South African phone format, quantity 1-20 000 kg, date not in the past and within 180 days, 10+ characters for notes, consent | Data is processed with AJAX (`fetch` of `data/rates.json`) and the page shows an estimated cost, the earliest available collection date and a reference number |
| `contact.html` | General message | Name 2+ characters, e-mail format, optional phone format, type chosen, reply method chosen, message 10-1000 characters, consent | The validated data is built into an e-mail to `info@ngobenichainsupply.co.za` (set as `RECIPIENT` in `forms.js`); the visitor opens it in their mail app or copies the text |
| `quote.html`, `suppliers.html` | Quote and collection requests | Same validation rules | Same ready-to-send e-mail |

Controls used: text, e-mail, telephone, number, date, select, radio buttons, checkbox and textarea (with live character counter). Every control has a visible label, errors appear next to the field in red, valid fields turn green, and the first invalid field receives focus. Error messages are announced to screen readers.

**Important limits:** the prices and dates in the enquiry response are *indicative prototype estimates* from `data/rates.json` (they are not real prices). Because the site is static and has no server, the contact, quote and supplier forms prepare an e-mail for the visitor to send rather than sending it silently from the server.

### Search engine optimisation (SEO)
- Unique, keyword-rich `<title>` and a 150-160 character `<meta name="description">` on every page.
- `<meta name="keywords">` on every page, chosen from keyword research around "used cooking oil collection", "animal fat collection", "biodiesel feedstock" and "South Africa". (Most search engines ignore this tag, but it is included because the brief requires it.)
- Open Graph tags, `robots` meta tag, theme colour and favicon.
- `LocalBusiness` structured data (JSON-LD) on the Home and Contact pages.
- One `<h1>` per page, ordered `h2` and `h3` headings, semantic landmarks and a "Skip to main content" link.
- Descriptive, hyphenated image file names and descriptive alt text for every image.
- Clean, readable URLs, internal links in the header and footer on every page, and contextual links (for example from a service to the enquiry form).
- `robots.txt` and `sitemap.xml` (see "Before you submit" for the address you must replace).
- Mobile-friendly responsive design; lazy-loaded images; no framework; browser caching and security headers in `_headers` (Netlify).
- Off-page and local SEO: footer share links (Facebook, WhatsApp, LinkedIn), "South Africa" local keywords and `areaServed` data. Backlinks and social profiles must be built by the business once it is live.

### Responsive design (Part 2 feedback)
Breakpoints at 1400 px and up, 1100 px, 900 px (tablet), 800 px, 600 px (mobile) and 400 px (small mobile). Layout columns reduce from three to two to one, headings scale with `clamp()` and smaller font sizes, images keep their aspect ratio and never overflow, and the navigation collapses into an accessible hamburger menu on tablet and mobile. If JavaScript is unavailable the full menu stays visible.

## Testing

I tested the pages in Chromium at 1280 px and 375 px wide: every page loads without script errors, every internal link resolves, every page has one `<h1>`, a title, meta description, keywords and alt text on all images, no page scrolls sideways on mobile, and the accordion, tabs, modal, lightbox, search/filter/sort, form validation, enquiry response, e-mail generation and hamburger menu all behave as described (94 automated checks). The pages also work with JavaScript turned off (menu and static service cards remain).

Not yet tested: the live map tiles (they need an internet connection to unpkg and OpenStreetMap), and e-mail sending in your own mail app. **Please check both on the deployed site.**

## Before you submit

1. Replace `https://YOUR-USERNAME.github.io/ngobeni-chain-supply/` in `sitemap.xml` and `robots.txt` with your real address (command in `docs/DEPLOYMENT.md`).
2. Complete the four image entries in `docs/REFERENCES.md`.
3. Paste your repository and live links at the top of this README.
4. Test the **deployed** site as listed in `docs/DEPLOYMENT.md`.

## How to Open the Website

Open the project folder in Visual Studio Code and open `index.html` in a browser (or use the Live Server extension). Use the navigation menu to test every page. See `docs/DEPLOYMENT.md` to publish it.

## Changelog (summary)

The full, dated record is in [CHANGELOG.md](CHANGELOG.md). Highlights:

### 2026-10-27 - Part 3: Enhancing functionality and SEO
- Added `assets/js/main.js` (menu, animations, accordion, tabs, modal, lightbox, services search, map, share links) and `assets/js/forms.js` (validation, enquiry processing, e-mail creation).
- Added `pages/enquiry.html`, `data/rates.json`, `robots.txt`, `sitemap.xml`, `_headers` and `assets/images/favicon.svg`.
- Added SEO metadata, structured data, skip links and improved alt text to every page.
- Replaced the basic forms on Contact, Quote and Suppliers with validated forms.

### 2026-10-27 - Changes made from Part 2 feedback
| Part 2 criterion (mark) | What was done |
|---|---|
| Media queries / breakpoints (7/10) | Added breakpoints at 1400, 1100, 900, 600 and 400 px on top of the existing 800 px rule |
| Layout adjustment (4/5) | Grids move from 3 to 2 to 1 columns; hero, forms, tabs and footer re-flow; spacing reduced on mobile |
| Typography adjustment (4/5) | Heading sizes use `clamp()` and step down at 900 px and 600 px; paragraph and tagline sizes adjusted for small screens |
| Navigation menu (4/5) | Hamburger menu with `aria-expanded`, Escape to close and link-to-close; works without JavaScript |
| Images (4/5) | `max-width: 100%`, aspect ratios per breakpoint, lazy loading and async decoding; hero image given high fetch priority |
| GitHub commits (2/5) | Work is split into small commits with descriptive messages (`docs/commit-plan.sh`) |
| README (4/5) | Rewritten with features, testing, deployment and a changelog summary |
| Changelog (2/5) | `CHANGELOG.md` rewritten with detailed dated entries linked to the feedback |
| References (0/5) | `docs/REFERENCES.md` written in Harvard format with accessed dates |
| Feedback for Part 1 (5/10) | Recorded in this table and in the changelog |
