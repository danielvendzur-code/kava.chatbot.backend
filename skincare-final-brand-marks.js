(() => {
  'use strict';

  const slug = document.body?.dataset?.cosmeticsDemo;
  const launcher = document.querySelector('#cx-open');
  if (!slug || !launcher) return;

  const trimTransparentImage = (img, className, done) => {
    if (!(img instanceof HTMLImageElement)) return;
    const src = img.currentSrc || img.getAttribute('src');
    if (!src) return;
    const source = new Image();
    source.decoding = 'async';
    source.onload = () => {
      const w = Math.max(1, source.naturalWidth || source.width);
      const h = Math.max(1, source.naturalHeight || source.height);
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;
      ctx.drawImage(source, 0, 0, w, h);
      let data;
      try { data = ctx.getImageData(0, 0, w, h); }
      catch (_) { return; }
      const px = data.data;
      let minX = w, minY = h, maxX = -1, maxY = -1;
      for (let y = 0; y < h; y += 1) {
        for (let x = 0; x < w; x += 1) {
          const a = px[(y * w + x) * 4 + 3];
          if (a < 10) continue;
          minX = Math.min(minX, x);
          minY = Math.min(minY, y);
          maxX = Math.max(maxX, x);
          maxY = Math.max(maxY, y);
        }
      }
      if (maxX < minX || maxY < minY) return;
      const pad = 2;
      const sx = Math.max(0, minX - pad);
      const sy = Math.max(0, minY - pad);
      const sw = Math.min(w - sx, maxX - minX + 1 + pad * 2);
      const sh = Math.min(h - sy, maxY - minY + 1 + pad * 2);
      const out = document.createElement('canvas');
      out.width = sw;
      out.height = sh;
      const outCtx = out.getContext('2d');
      if (!outCtx) return;
      outCtx.drawImage(canvas, sx, sy, sw, sh, 0, 0, sw, sh);
      img.src = out.toDataURL('image/png');
      img.classList.add(className);
      if (typeof done === 'function') done({ source, canvas, sx, sy, sw, sh });
    };
    source.src = src;
  };

  /* Modrá púpava: the launcher should show the flower symbol only, not the full
     horizontal wordmark. The brand asset is a wide mark with its compact symbol
     at the left edge, so the launcher clips exactly one logo-height square. */
  if (slug === 'modrapupava') {
    launcher.classList.remove('is-image-logo', 'cx-launcher-has-image-logo', 'cx-launcher-has-wordmark');
    launcher.classList.add('cx-launcher-has-image-logo');
    launcher.innerHTML = '<span class="cx-modrapupava-symbol" aria-label="Modrá púpava"><img src="/assets/cosmetics/modrapupava-logo.png" alt=""></span>';

    const header = document.querySelector('.cx-widget-brand > img.cx-logo');
    if (header) trimTransparentImage(header, 'cx-final-trimmed-header');
    return;
  }

  /* Cyprianus: its SVG is 150x35 and the standalone emblem occupies the first
     35x35 block. Use that same real emblem in the launcher and every assistant
     message avatar, including messages rendered after this script runs. */
  if (slug === 'cyprianus') {
    const symbolMarkup = '<span class="cx-cyprianus-symbol" aria-label="Cyprianus"><img src="/assets/cosmetics/cyprianus-logo.svg" alt=""></span>';
    launcher.classList.remove('is-image-logo', 'cx-launcher-has-image-logo', 'cx-launcher-has-wordmark');
    launcher.classList.add('cx-launcher-has-image-logo');
    launcher.innerHTML = symbolMarkup;

    const syncCyprianusAvatars = () => {
      document.querySelectorAll('.cx-message-avatar').forEach((avatar) => {
        if (avatar.querySelector('.cx-cyprianus-symbol')) return;
        avatar.innerHTML = symbolMarkup;
      });
    };
    syncCyprianusAvatars();
    const root = document.querySelector('#cosmetics-root');
    if (root) {
      const observer = new MutationObserver(syncCyprianusAvatars);
      observer.observe(root, { childList: true, subtree: true });
    }
    return;
  }

  /* Facederma: keep the real source artwork, but trim transparent padding so
     the high-resolution wordmark uses the available launcher area cleanly. */
  if (slug === 'facederma') {
    const launchLogo = launcher.querySelector('img');
    if (launchLogo) trimTransparentImage(launchLogo, 'cx-final-trimmed-launcher');
  }

  /* Barbora Lori: the source PNG carries generous transparent side padding.
     Trim it in the closed launcher and open header so the real wordmark starts
     at the same visual edge as the other brands and is not rendered tiny. */
  if (slug === 'barboralori') {
    const launchLogo = launcher.querySelector('img');
    const headerLogo = document.querySelector('.cx-widget-brand > img.cx-logo');
    if (launchLogo) trimTransparentImage(launchLogo, 'cx-final-trimmed-launcher');
    if (headerLogo) trimTransparentImage(headerLogo, 'cx-final-trimmed-header');
  }
})();
