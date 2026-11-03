# Deployment guide

The site is plain HTML, CSS and JavaScript, so it needs no build step. Any static host works.

## Option A: GitHub Pages (simplest, same place as your repository)

1. Push the project to your GitHub repository (see `docs/commit-plan.sh`).
2. On GitHub open **Settings > Pages**.
3. Under **Build and deployment** choose **Deploy from a branch**, pick `main` and the `/ (root)` folder, then **Save**.
4. Wait one to two minutes. Your address will be `https://YOUR-USERNAME.github.io/REPOSITORY-NAME/`.

## Option B: Netlify

1. Sign in at netlify.com and choose **Add new site > Import an existing project** (connect GitHub) or drag the project folder onto the deploy area.
2. Leave the build command empty and set the publish directory to the project root.
3. Netlify reads `_headers` automatically and applies the security headers.

## After deploying (do not skip)

1. **Replace the placeholder address.** `sitemap.xml` and `robots.txt` contain `https://YOUR-USERNAME.github.io/ngobeni-chain-supply/`. Replace it with your real address:
   `sed -i 's#https://YOUR-USERNAME.github.io/ngobeni-chain-supply/#https://REAL-ADDRESS/#g' sitemap.xml robots.txt`
2. **Test the deployed site, not only your computer:** open every page, click every menu link, open the gallery lightbox, use the Services search, submit the Enquiry and Contact forms (empty, wrong and correct), and check the map loads.
3. Test on your phone and with the browser window narrowed to about 375 px.
4. Add the repository link and the live link to the top of `README.md`.
