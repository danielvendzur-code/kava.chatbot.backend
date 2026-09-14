(() => {
  'use strict';

  if (document.body?.dataset?.cosmeticsDemo !== 'kvitok') return;

  const src = '/assets/cosmetics/kvitok-logo.png?v=20260914g';
  const launcher = document.querySelector('#cx-open');
  const headerLogo = document.querySelector('.cx-widget-brand > img.cx-logo');

  /* Keep the closed launcher simple and reliable: the real badge, no canvas
     processing. Sizing is handled only by kvitok-direct-logo.css. */
  if (launcher) {
    const mark = document.createElement('img');
    mark.src = src;
    mark.alt = 'Kvitok';
    mark.className = 'cx-kvitok-direct-mark';
    mark.decoding = 'async';
    launcher.classList.remove('is-image-logo', 'cx-launcher-has-wordmark', 'cx-kvitok-processing', 'cx-kvitok-logo-ready');
    launcher.classList.add('cx-launcher-has-image-logo');
    launcher.replaceChildren(mark);
  }

  /* The open-widget header looked better as the clean Kvitok wordmark without
     the source badge. Extract only the dark lettering from the real 220x220
     logo, recolour that lettering white and discard the surrounding plate. */
  if (!headerLogo) return;

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

    let data;
    try { data = ctx.getImageData(0, 0, width, height); }
    catch (_) { return; }

    const px = data.data;
    let minX = width, minY = height, maxX = -1, maxY = -1;
    let visible = 0;

    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        const i = (y * width + x) * 4;
        const alpha = px[i + 3];
        if (alpha < 8) continue;

        /* The wordmark sits through the centre of the badge. This spatial crop
           prevents the dark circular rim from ever becoming part of the mark. */
        const nx = x / width;
        const ny = y / height;
        if (nx < 0.055 || nx > 0.945 || ny < 0.28 || ny > 0.72) {
          px[i + 3] = 0;
          continue;
        }

        const lum = 0.2126 * px[i] + 0.7152 * px[i + 1] + 0.0722 * px[i + 2];
        if (lum >= 154) {
          px[i + 3] = 0;
          continue;
        }
        if (lum > 118) px[i + 3] = Math.round(alpha * ((154 - lum) / 36));

        if (px[i + 3] > 10) {
          px[i] = 255;
          px[i + 1] = 255;
          px[i + 2] = 255;
          visible += 1;
          minX = Math.min(minX, x);
          minY = Math.min(minY, y);
          maxX = Math.max(maxX, x);
          maxY = Math.max(maxY, y);
        }
      }
    }

    if (visible < 40 || maxX < minX || maxY < minY) return;

    ctx.putImageData(data, 0, 0);
    const pad = 3;
    const sx = Math.max(0, minX - pad);
    const sy = Math.max(0, minY - pad);
    const sw = Math.min(width - sx, maxX - minX + 1 + pad * 2);
    const sh = Math.min(height - sy, maxY - minY + 1 + pad * 2);
    const cropped = document.createElement('canvas');
    cropped.width = sw;
    cropped.height = sh;
    const cctx = cropped.getContext('2d');
    if (!cctx) return;
    cctx.drawImage(canvas, sx, sy, sw, sh, 0, 0, sw, sh);

    headerLogo.src = cropped.toDataURL('image/png');
    headerLogo.classList.add('cx-kvitok-header-clean');
  };
  image.src = src;
})();
