(() => {
  'use strict';

  const data = window.COSMETICS_DEMOS;
  const slug = document.body?.dataset?.cosmeticsDemo;
  const brand = data?.brands?.[slug];
  const launcher = document.querySelector('#cx-open');
  if (!brand || !launcher) return;

  /* Keep the status in the layout defined by skincare-refresh.css. Only change
     the wording; do not move it per-brand. */
  const status = document.querySelector('.cx-widget-brand > span.cx-status');
  if (status) {
    const dot = status.querySelector('i') || document.createElement('i');
    status.replaceChildren(dot, document.createTextNode('online poradca'));
  }

  /* PONIO is the approved reference and its launcher stays untouched. */
  if (slug === 'ponio') return;

  /* The closed preview always uses the real company mark. */
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
  const hexToRgb = (hex) => {
    const raw = String(hex || '').replace('#', '').trim();
    if (/^[0-9a-f]{3}$/i.test(raw)) return raw.split('').map((c) => parseInt(c + c, 16));
    if (/^[0-9a-f]{6}$/i.test(raw)) return [0, 2, 4].map((i) => parseInt(raw.slice(i, i + 2), 16));
    return [47, 107, 63];
  };

  const cropAndApply = (canvas, data, target, className) => {
    const { width, height } = canvas;
    const px = data.data;
    let minX = width, minY = height, maxX = -1, maxY = -1;
    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        const i = (y * width + x) * 4;
        if (px[i + 3] <= 10) continue;
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
    }
    if (maxX < minX || maxY < minY) return null;

    const ctx = canvas.getContext('2d');
    ctx.putImageData(data, 0, 0);
    const pad = Math.max(2, Math.round(Math.min(width, height) * 0.015));
    const sx = Math.max(0, minX - pad);
    const sy = Math.max(0, minY - pad);
    const sw = Math.min(width - sx, maxX - minX + 1 + pad * 2);
    const sh = Math.min(height - sy, maxY - minY + 1 + pad * 2);
    const cropped = document.createElement('canvas');
    cropped.width = sw;
    cropped.height = sh;
    cropped.getContext('2d').drawImage(canvas, sx, sy, sw, sh, 0, 0, sw, sh);
    const url = cropped.toDataURL('image/png');
    target.src = url;
    target.classList.add(className);
    return url;
  };

  /* Kvitok source artwork is a dark green badge with a light wordmark. The
     launcher already supplies the coloured circle, so keep only the light
     wordmark and make it white. This prevents a same-colour disc inside a disc. */
  if (slug === 'kvitok' && mark instanceof HTMLImageElement) {
    const headerLogo = document.querySelector('.cx-widget-brand > img.cx-logo');
    const originalSrc = headerLogo?.currentSrc || headerLogo?.getAttribute('src') || mark.getAttribute('src');
    if (originalSrc) {
      const image = new Image();
      image.decoding = 'async';
      image.onload = () => {
        const width = Math.max(1, image.naturalWidth || image.width);
        const height = Math.max(1, image.naturalHeight || image.height);
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) return;
        ctx.drawImage(image, 0, 0, width, height);
        let imageData;
        try { imageData = ctx.getImageData(0, 0, width, height); }
        catch (_) { return; }

        const px = imageData.data;
        for (let i = 0; i < px.length; i += 4) {
          const alpha = px[i + 3];
          if (alpha < 8) continue;
          const lum = 0.2126 * px[i] + 0.7152 * px[i + 1] + 0.0722 * px[i + 2];
          if (lum < 145) {
            px[i + 3] = 0;
            continue;
          }
          px[i] = 255;
          px[i + 1] = 255;
          px[i + 2] = 255;
          if (lum < 195) px[i + 3] = Math.round(alpha * ((lum - 145) / 50));
        }

        const cleanUrl = cropAndApply(canvas, imageData, mark, 'cx-kvitok-launcher-clean');
        if (cleanUrl && headerLogo) {
          headerLogo.src = cleanUrl;
          headerLogo.classList.add('cx-kvitok-header-clean');
        }
      };
      image.src = originalSrc;
    }
  }

  /* Fytopharma: the launcher fill is the gold accent, so the real mark is
     rendered in the opposite brand green. If the source PNG has a flat plate,
     remove only that plate first; otherwise preserve its alpha silhouette. */
  if (slug === 'fytopharma' && mark instanceof HTMLImageElement) {
    const originalSrc = mark.getAttribute('src');
    if (originalSrc) {
      const image = new Image();
      image.decoding = 'async';
      image.onload = () => {
        const width = Math.max(1, image.naturalWidth || image.width);
        const height = Math.max(1, image.naturalHeight || image.height);
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) return;
        ctx.drawImage(image, 0, 0, width, height);
        let imageData;
        try { imageData = ctx.getImageData(0, 0, width, height); }
        catch (_) { return; }

        const px = imageData.data;
        const corners = [
          [0, 0], [width - 1, 0], [0, height - 1], [width - 1, height - 1]
        ].map(([x, y]) => {
          const i = (y * width + x) * 4;
          return [px[i], px[i + 1], px[i + 2], px[i + 3]];
        }).filter((c) => c[3] > 180);

        let plate = null;
        if (corners.length >= 3) {
          const avg = [0, 1, 2].map((ch) => corners.reduce((sum, c) => sum + c[ch], 0) / corners.length);
          if (corners.every((c) => distance(c, avg) < 28)) plate = avg;
        }

        const tint = hexToRgb(brand.theme?.brand || '#2f6b3f');
        for (let i = 0; i < px.length; i += 4) {
          const alpha = px[i + 3];
          if (alpha < 8) continue;
          if (plate) {
            const d = distance([px[i], px[i + 1], px[i + 2]], plate);
            if (d <= 28) {
              px[i + 3] = 0;
              continue;
            }
            if (d < 72) px[i + 3] = Math.round(alpha * ((d - 28) / 44));
          }
          if (px[i + 3] > 0) {
            px[i] = tint[0];
            px[i + 1] = tint[1];
            px[i + 2] = tint[2];
          }
        }

        cropAndApply(canvas, imageData, mark, 'cx-fytopharma-launcher-clean');
      };
      image.src = originalSrc;
    }
  }
})();
