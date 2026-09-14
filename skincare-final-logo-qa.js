(() => {
  'use strict';

  const data = window.COSMETICS_DEMOS;
  const slug = document.body?.dataset?.cosmeticsDemo;
  const brand = data?.brands?.[slug];
  const launcher = document.querySelector('#cx-open');
  if (!brand || !launcher) return;

  /* Keep the existing status dot; only make the label explicit. */
  const status = document.querySelector('.cx-widget-brand > span.cx-status');
  if (status) {
    const dot = status.querySelector('i') || document.createElement('i');
    status.replaceChildren(dot, document.createTextNode(' online poradca'));
  }

  /* PONIO is the approved reference and its launcher stays untouched. */
  if (slug === 'ponio') return;

  /* The closed preview uses the real company mark. Do not recolour the source
     raster: previous canvas tinting could turn Natureal/Fytopharma into blank
     circles when logo colour and button colour collided. */
  const template = document.createElement('template');
  template.innerHTML = String(brand.wordmark || '').trim();
  const source = template.content.firstElementChild;
  if (!source) return;

  const mark = source.cloneNode(true);
  launcher.classList.remove('is-image-logo', 'cx-launcher-has-image-logo', 'cx-launcher-has-wordmark');
  launcher.replaceChildren(mark);

  if (mark.matches('img')) {
    launcher.classList.add('cx-launcher-has-image-logo');
    mark.classList.add('cx-launcher-real-logo');
    mark.removeAttribute('width');
    mark.removeAttribute('height');
    mark.decoding = 'async';
  } else {
    launcher.classList.add('cx-launcher-has-wordmark');
    mark.classList.add('cx-launcher-real-wordmark');
  }

  const distance = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);

  /* Kvitok's PNG contains a coloured circular plate/outline. In the green
     header and in the already-coloured launcher we only want the white Kvitok
     wordmark. Clean the plate once, crop to the visible wordmark and reuse the
     exact same clean image in both places. */
  if (slug === 'kvitok') {
    const headerLogo = document.querySelector('.cx-widget-brand > img.cx-logo');
    if (!headerLogo) return;

    const cleanKvitokLogo = () => {
      const originalSrc = headerLogo.currentSrc || headerLogo.getAttribute('src');
      if (!originalSrc || headerLogo.dataset.cxHeaderCleaned === '1') return;
      headerLogo.dataset.cxHeaderCleaned = '1';

      const img = new Image();
      img.decoding = 'async';
      img.onload = () => {
        const width = Math.max(1, img.naturalWidth || img.width);
        const height = Math.max(1, img.naturalHeight || img.height);
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) return;
        ctx.drawImage(img, 0, 0, width, height);

        let imageData;
        try { imageData = ctx.getImageData(0, 0, width, height); }
        catch (_) { return; }

        const px = imageData.data;
        const bins = new Map();
        let opaque = 0;
        for (let i = 0; i < px.length; i += 4) {
          if (px[i + 3] < 48) continue;
          opaque += 1;
          const r = px[i] >> 4;
          const g = px[i + 1] >> 4;
          const b = px[i + 2] >> 4;
          const key = (r << 8) | (g << 4) | b;
          const entry = bins.get(key) || { count: 0, r: 0, g: 0, b: 0 };
          entry.count += 1;
          entry.r += px[i];
          entry.g += px[i + 1];
          entry.b += px[i + 2];
          bins.set(key, entry);
        }
        if (!opaque || !bins.size) return;

        const dominant = [...bins.values()].sort((a, b) => b.count - a.count)[0];
        if (!dominant || dominant.count / opaque < 0.18) return;
        const plate = [
          dominant.r / dominant.count,
          dominant.g / dominant.count,
          dominant.b / dominant.count
        ];

        let minX = width, minY = height, maxX = -1, maxY = -1;
        for (let y = 0; y < height; y += 1) {
          for (let x = 0; x < width; x += 1) {
            const i = (y * width + x) * 4;
            const alpha = px[i + 3];
            if (alpha < 8) continue;
            const d = distance([px[i], px[i + 1], px[i + 2]], plate);
            if (d <= 34) {
              px[i + 3] = 0;
              continue;
            }
            if (d < 78) px[i + 3] = Math.round(alpha * ((d - 34) / 44));
            if (px[i + 3] > 10) {
              px[i] = 255;
              px[i + 1] = 255;
              px[i + 2] = 255;
              minX = Math.min(minX, x);
              minY = Math.min(minY, y);
              maxX = Math.max(maxX, x);
              maxY = Math.max(maxY, y);
            }
          }
        }
        if (maxX < minX || maxY < minY) return;

        ctx.putImageData(imageData, 0, 0);
        const pad = Math.max(2, Math.round(Math.min(width, height) * 0.012));
        const sx = Math.max(0, minX - pad);
        const sy = Math.max(0, minY - pad);
        const sw = Math.min(width - sx, maxX - minX + 1 + pad * 2);
        const sh = Math.min(height - sy, maxY - minY + 1 + pad * 2);
        const cropped = document.createElement('canvas');
        cropped.width = sw;
        cropped.height = sh;
        const croppedCtx = cropped.getContext('2d');
        if (!croppedCtx) return;
        croppedCtx.drawImage(canvas, sx, sy, sw, sh, 0, 0, sw, sh);

        const cleanUrl = cropped.toDataURL('image/png');
        headerLogo.src = cleanUrl;
        headerLogo.classList.add('cx-kvitok-header-clean');

        if (mark instanceof HTMLImageElement) {
          mark.src = cleanUrl;
          mark.classList.add('cx-kvitok-launcher-clean');
        }
      };
      img.src = originalSrc;
    };

    if (headerLogo.complete) cleanKvitokLogo();
    else headerLogo.addEventListener('load', cleanKvitokLogo, { once: true });
  }
})();
