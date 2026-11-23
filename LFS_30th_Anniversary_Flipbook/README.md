# LFS 30th Anniversary Zine — Digital Flipbook

A ready-to-host, **22-page**, mobile-friendly digital flipbook built from the supplied `Zine.pdf`.

## Publish for free with GitHub Pages

1. Sign in at https://github.com and create a **public** repository named `lfs-zine` (or any name you like).
2. Open the repository. Choose **Add file → Upload files**. Upload **all the contents of this folder**, not the enclosing folder itself. Keep the `pages` subfolder and the files inside it. GitHub's browser uploader accepts dragged folders on supported browsers; alternatively use GitHub Desktop to commit the unzipped folder if a folder upload does not work.
3. Commit the files to the `main` branch.
4. Go to **Settings → Pages**. Under **Build and deployment**, choose **Deploy from a branch**. Set branch to **main** and folder to **/(root)**, then **Save**.
5. GitHub will display the published URL once deployment completes. It will look like `https://YOUR-USERNAME.github.io/lfs-zine/`.
6. Open that URL on a phone or iPad and test the arrows, swipe navigation, and zoom. Turn the URL into a QR code using your preferred QR code maker.

See GitHub's official instructions: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

## How the flipbook works

- On a desktop: the cover is shown by itself, followed by two-page spreads, ending with the back cover.
- On phones and tablets with narrow screens: one page at a time.
- Tap a page, or use **Enlarge**, to see the page on a larger scale.
- Use on-screen arrows, keyboard arrow keys, or swipe left/right on touchscreens.
- **All pages** opens the page browser / thumbnails.
- The reader remembers the last page you visited in that browser; you can also share a specific page with a URL ending in `?page=12`.
- All resources are local. No subscriptions, external libraries, accounts, analytics, or trackers are needed for readers.

## Edit the website

- `index.html` contains the interface.
- `style.css` contains the design and responsive layout.
- `script.js` contains the controls.
- `pages/01.webp` through `pages/22.webp` are images converted from the PDF.

The website does not need the original PDF to function. Images were used to ensure the original collage typography and imagery stay in place and the website remains quick to load.

## Public-sharing note

GitHub Pages publishes the zine publicly on the internet. Confirm that the publication has appropriate permissions for included student work and photos before publishing the repository.
