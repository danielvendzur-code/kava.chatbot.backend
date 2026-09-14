(() => {
  'use strict';

  const data = window.COSMETICS_DEMOS;
  const slug = document.body?.dataset?.cosmeticsDemo;
  const brand = data?.brands?.[slug];
  const launcher = document.querySelector('#cx-open');
  if (!brand || !launcher) return;

  /* The widget header should say what the green state actually means. Keep the
     existing dot/animation and only replace the text. */
  const status = document.querySelector('.cx-widget-brand > span.cx-status');
  if (status) {
    const dot = status.querySelector('i') || document.createElement('i');
    status.replaceChildren(dot, document.createTextNode(' poradca online'));
  }

  /* PONIO keeps its approved launcher exactly as it is. */
  if (slug === 'ponio') return;

  /* The closed preview always uses the company's real mark from the same
     wordmark used in the header. Its established button colours and geometry
     stay untouched here. */
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

  const hexToRgb = (hex, fallback = [255, 255, 255]) => {
    const raw = String(hex || '').trim().replace('#', '');
    if (/^[0-9a-f]{3}$/i.test(raw)) return raw.split('').map((c) => parseInt(c + c, 16));
    if (/^[0-9a-f]{6}$/i.test(raw)) return [0, 2, 4].map((i) => parseInt(raw.slice(i, i + 2), 16));
    return fallback;
  };
  const distance = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);

  /* Build clean colour variants from the real raster mark. If the PNG has a
     flat white/coloured rectangle baked into it, remove only that corner-matched
     plate first. The mark keeps its original alpha/shape and button footprint. */
  function tintRasterMark(target, { baseHex, hoverHex, button }) {
    if (!(target instanceof HTMLImageElement)) return;
    const originalSrc = target.getAttribute('src');
    if (!originalSrc) return;

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

      let original;
      try { original = ctx.getImageData(0, 0, width, height); }
      catch (_) { return; }

      const px = original.data;
      const at = (x, y) => {
        const i = (y * width + x) * 4;
        return [px[i], px[i + 1], px[i + 2], px[i + 3]];
      };
      const corners = [at(0, 0), at(width - 1, 0), at(0, height - 1), at(width - 1, height - 1)]
        .filter((c) => c[3] > 180);
      let plate = null;
      if (corners.length >= 3) {
        const avg = [0, 1, 2].map((ch) => corners.reduce((sum, c) => sum + c[ch], 0) / corners.length);
        if (corners.every((c) => distance(c, avg) < 34)) plate = avg;
      }

      const makeVariant = (hex) => {
        const tint = hexToRgb(hex);
        const copy = new ImageData(new Uint8ClampedArray(original.data), width, height);
        const out = copy.data;
        for (let i = 0; i < out.length; i += 4) {
          const alpha = out[i + 3];
          if (alpha < 8) {
            out[i + 3] = 0;
            continue;
          }
          if (plate) {
            const d = distance([out[i], out[i + 1], out[i + 2]], plate);
            if (d <= 26) {
              out[i + 3] = 0;
              continue;
            }
            if (d < 70) out[i + 3] = Math.round(alpha * ((d - 26) / 44));
          }
          if (out[i + 3] > 0) {
            out[i] = tint[0];
            out[i + 1] = tint[1];
            out[i + 2] = tint[2];
          }
        }
        const result = document.createElement('canvas');
        result.width = width;
        result.height = height;
        result.getContext('2d').putImageData(copy, 0, 0);
        return result.toDataURL('image/png');
      };

      const base = makeVariant(baseHex);
      const hover = makeVariant(hoverHex);
      target.src = base;
      const showBase = () => { target.src = base; };
      const showHover = () => { target.src = hover; };
      button.addEventListener('mouseenter', showHover);
      button.addEventListener('mouseleave', showBase);
      button.addEventListener('focusin', showHover);
      button.addEventListener('focusout', showBase);
    };
    image.src = originalSrc;
  }

  /* Fytopharma: orange base circle + green real logo. Natureal: its established
     accent base + dark mark. On hover both marks become white, so the existing
     darker hover colour can never swallow the logo. */
  if (mark instanceof HTMLImageElement && (slug === 'fytopharma' || slug === 'natureal')) {
    tintRasterMark(mark, {
      baseHex: brand.theme?.brand || '#222222',
      hoverHex: '#ffffff',
      button: launcher
    });
  }

  /* Kvitok's source PNG carries a coloured circular plate. In the already-green
     open widget header that would create a second colour field. Clean only the
     HEADER copy, tint the real mark white and crop transparent leftovers so the
     mark is not visibly tiny. The closed launcher is not processed. */
  if (slug === 'kvitok') {
    const headerLogo = document.querySelector('.cx-widget-brand > img.cx-logo');
    if (!headerLogo) return;

    const cleanHeaderLogo = () => {
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
        const plate = [dominant.r / dominant.count, dominant.g / dominant.count, dominant.b / dominant.count];

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
        cropped.getContext('2d').drawImage(canvas, sx, sy, sw, sh, 0, 0, sw, sh);

        headerLogo.src = cropped.toDataURL('image/png');
        headerLogo.classList.add('cx-kvitok-header-clean');
      };
      img.src = originalSrc;
    };

    if (headerLogo.complete) cleanHeaderLogo();
    else headerLogo.addEventListener('load', cleanHeaderLogo, { once: true });
  }
})();
