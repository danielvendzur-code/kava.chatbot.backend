(() => {
  'use strict';

  if (document.body?.dataset?.cosmeticsDemo !== 'kvitok') return;

  const launcher = document.querySelector('#cx-open');
  const headerLogo = document.querySelector('.cx-widget-brand > img.cx-logo');
  if (!launcher) return;

  let mark = launcher.querySelector('img');
  if (!(mark instanceof HTMLImageElement)) {
    mark = document.createElement('img');
    mark.alt = 'Kvitok';
    mark.className = 'cx-launcher-real-logo';
    launcher.replaceChildren(mark);
  }

  launcher.classList.add('cx-launcher-has-image-logo', 'cx-kvitok-processing');
  launcher.classList.remove('is-image-logo', 'cx-launcher-has-wordmark', 'cx-kvitok-logo-ready');

  const fallback = document.createElement('span');
  fallback.className = 'cx-kvitok-fallback-wordmark';
  fallback.textContent = 'Kvitok';
  launcher.appendChild(fallback);

  const distance = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);

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
    const bins = new Map();
    let opaque = 0;

    for (let i = 0; i < px.length; i += 4) {
      if (px[i + 3] < 40) continue;
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
    if (!dominant) return;
    const plate = [
      dominant.r / dominant.count,
      dominant.g / dominant.count,
      dominant.b / dominant.count
    ];

    let minX = width, minY = height, maxX = -1, maxY = -1;
    let visible = 0;

    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        const i = (y * width + x) * 4;
        const alpha = px[i + 3];
        if (alpha < 8) continue;

        const d = distance([px[i], px[i + 1], px[i + 2]], plate);
        if (d <= 38) {
          px[i + 3] = 0;
          continue;
        }
        if (d < 82) px[i + 3] = Math.round(alpha * ((d - 38) / 44));

        if (px[i + 3] > 12) {
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

    if (visible < 60 || maxX < minX || maxY < minY) return;

    ctx.putImageData(data, 0, 0);
    const pad = Math.max(2, Math.round(Math.min(width, height) * 0.018));
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
    mark.src = cleanUrl;
    mark.classList.add('cx-kvitok-launcher-clean');
    mark.style.opacity = '1';

    if (headerLogo) {
      headerLogo.src = cleanUrl;
      headerLogo.classList.add('cx-kvitok-header-clean');
    }

    launcher.classList.remove('cx-kvitok-processing');
    launcher.classList.add('cx-kvitok-logo-ready');
    fallback.remove();
  };

  image.onerror = () => launcher.classList.remove('cx-kvitok-processing');
  image.src = '/assets/cosmetics/kvitok-logo.png?v=20260914e';
})();
