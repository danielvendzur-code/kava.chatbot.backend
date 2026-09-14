(() => {
  'use strict';

  const data = window.COSMETICS_DEMOS;
  const slug = document.body?.dataset?.cosmeticsDemo;
  const brand = data?.brands?.[slug];
  const launcher = document.querySelector('#cx-open');
  if (!brand || !launcher) return;

  /* PONIO is the approved reference and must remain exactly as it is. */
  if (slug === 'ponio') return;

  /* The closed preview always uses the company's real mark from the same
     wordmark used in the header. No SC/N/BM initials or invented substitutes.
     Its established colours, size and placement are left untouched here. */
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

  /* Kvitok's source PNG carries a coloured circular plate. That plate is fine
     as source artwork, but inside the already-coloured widget header it creates
     a second coloured disc. Clean only the HEADER copy: remove the dominant
     plate colour and render the remaining real mark in white. The launcher is
     deliberately not processed, so its approved colour/layout stay exactly as
     they were before this fix. */
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
        try {
          imageData = ctx.getImageData(0, 0, width, height);
        } catch (_) {
          return;
        }

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
        const distance = (r, g, b) => Math.hypot(r - plate[0], g - plate[1], b - plate[2]);

        for (let i = 0; i < px.length; i += 4) {
          const alpha = px[i + 3];
          if (alpha < 8) continue;
          const d = distance(px[i], px[i + 1], px[i + 2]);
          if (d <= 34) {
            px[i + 3] = 0;
            continue;
          }
          if (d < 78) {
            px[i + 3] = Math.round(alpha * ((d - 34) / 44));
          }
          px[i] = 255;
          px[i + 1] = 255;
          px[i + 2] = 255;
        }

        ctx.putImageData(imageData, 0, 0);
        headerLogo.src = canvas.toDataURL('image/png');
        headerLogo.classList.add('cx-kvitok-header-clean');
      };
      img.src = originalSrc;
    };

    if (headerLogo.complete) cleanHeaderLogo();
    else headerLogo.addEventListener('load', cleanHeaderLogo, { once: true });
  }
})();
