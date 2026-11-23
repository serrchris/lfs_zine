# LFS Zine — minimal flipbook (updated design)

This version has the original 22 illustrated pages, a white interface, collage-style heading, **All Pages** thumbnail gallery, and two navigation arrows. All other interface copy, page numbers, progress indicators, and footers were removed.

Turning pages is optimized: nearby page images preload before animation; desktop turns use a GPU-composited 3D leaf animation; phones use a faster slide-in transition. Pages can still be enlarged by tapping them, and swipe and keyboard navigation work.

## Updating your existing GitHub Pages site

1. Download and unzip the ZIP file.
2. Open your repository, `https://github.com/serrchris/lfs_zine` (or its current name).
3. Upload the **contents** of the extracted folder (not the ZIP or its enclosing folder) into the repository root. Include `index.html`, `style.css`, `script.js`, `.nojekyll`, `README.md`, and the entire `pages` folder.
4. When GitHub asks about files already there, **replace/overwrite** those files. Commit the changes to `main`. If the browser uploader cannot overwrite existing files, delete the old `index.html`, `style.css` and `script.js` in the repository before uploading the new files, or use GitHub Desktop to replace them in one commit.
5. In **Settings → Pages**, keep **Deploy from a branch → main → /(root)**. Once deployed, refresh `https://serrchris.github.io/lfs_zine/`. A hard refresh (Mac: Cmd+Shift+R) can help if the old version remains cached.

All assets are local; there are no external dependencies. The site can be hosted for free on GitHub Pages. The zine is publicly accessible once published, so confirm permission for included student images and writing.
