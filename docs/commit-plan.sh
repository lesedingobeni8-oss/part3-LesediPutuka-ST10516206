#!/usr/bin/env bash
# Creates a series of small, descriptive commits for Part 3.
# Run from the project root after copying the new files into your repository:
#   bash docs/commit-plan.sh
# Then: git push origin main
set -e
commit () { msg="$1"; shift; git add "$@"; git commit -m "$msg"; }

commit "Add responsive breakpoints for tablet and mobile (Part 2 feedback)" assets/css/styles.css
commit "Add shared JavaScript: hamburger menu, scroll animations, back-to-top button" assets/js/main.js
commit "Add FAQ accordion to How It Works page" pages/how-it-works.html
commit "Add industry tabs to Industrial Customers page" pages/industrial-customers.html
commit "Load services dynamically with search, filter and sort" pages/services.html
commit "Add gallery lightbox with keyboard navigation and improved alt text" pages/gallery.html
commit "Add safety guidelines modal and validated supplier form" pages/suppliers.html
commit "Add form validation script (phone, date, length and format checks)" assets/js/forms.js
commit "Add enquiry page with validation and AJAX cost/availability response" pages/enquiry.html data/rates.json
commit "Add contact form with validation, e-mail generation and Leaflet map" pages/contact.html
commit "Add validation to quote request form" pages/quote.html
commit "Add SEO titles, meta descriptions, keywords and structured data to home and about pages" index.html pages/about.html
commit "Add robots.txt, sitemap.xml, favicon and security headers" robots.txt sitemap.xml assets/images/favicon.svg _headers
commit "Add Harvard references and deployment guide" docs/REFERENCES.md docs/DEPLOYMENT.md
commit "Update README and CHANGELOG with Part 3 and Part 2 feedback entries" README.md CHANGELOG.md docs/commit-plan.sh
echo "Done. Now run: git push origin main"
