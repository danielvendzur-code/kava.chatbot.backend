(() => {
  'use strict';

  const data = window.COSMETICS_DEMOS;
  const slug = document.body?.dataset?.cosmeticsDemo;
  const brand = data?.brands?.[slug];
  const launcher = document.querySelector('#cx-open');
  if (!brand || !launcher) return;

  /* PONIO remains the original approved reference. */
  if (slug === 'ponio') return;

  const approvedAsIs = new Set(['two', 'biofy']);

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

    if (!approvedAsIs.has(slug)) {
      colorizeRasterMark(mark, launcher, brand.theme?.brand, brand.theme?.accent);
    }
  } else {
    launcher.classList.add('cx-launcher-has-wordmark');
    mark.classList.add('cx-launcher-real-wordmark');
  }

  function hexToRgb(hex) {
    const value = String(hex || '').trim().replace('#', '');
    if (!/^[0-9a-f]{6}$/i.test(value)) return null;
    return {
      r: parseInt(value.slice(0, 2), 16),
      g: parseInt(value.slice(2, 4), 16),
      b: parseInt(value.slice(4, 6), 16)
    };
  }

  function colorizeRasterMark(target, button, baseHex, hoverHex) {
    const base = hexToRgb(baseHex);
    const hover = hexToRgb(hoverHex);
    const src = target.getAttribute('src');
    if (!base || !hover || !src) return;

    const image = new Image();
    image.decoding = 'async';
    image.onload = () => {
      try {
        const width = image.naturalWidth || image.width;
        const height = image.naturalHeight || image.height;
        if (!width || !height) return;

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) return;

        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(image, 0, 0, width, height);
        const original = ctx.getImageData(0, 0, width, height);
        const pixels = original.data;

        /* Detect a baked-in rectangular background from the image corners.
           If the corners are opaque and visually similar, that colour is
           treated as the plate and removed. Transparent PNGs skip this step. */
        const cornerIndexes = [
          0,
          (width - 1) * 4,
          ((height - 1) * width) * 4,
          ((height * width) - 1) * 4
        ];
        const opaqueCorners = cornerIndexes
          .map(i => ({ r:pixels[i], g:pixels[i+1], b:pixels[i+2], a:pixels[i+3] }))
          .filter(p => p.a > 220);

        let background = null;
        if (opaqueCorners.length >= 3) {
          const avg = opaqueCorners.reduce((acc, p) => ({
            r: acc.r + p.r,
            g: acc.g + p.g,
            b: acc.b + p.b
          }), { r:0, g:0, b:0 });
          background = {
            r: avg.r / opaqueCorners.length,
            g: avg.g / opaqueCorners.length,
            b: avg.b / opaqueCorners.length
          };
        }

        const makeTint = (rgb) => {
          const out = ctx.createImageData(width, height);
          const dst = out.data;

          for (let i = 0; i < pixels.length; i += 4) {
            let alpha = pixels[i + 3] / 255;
            if (alpha <= 0) continue;

            if (background) {
              const dr = pixels[i] - background.r;
              const dg = pixels[i + 1] - background.g;
              const db = pixels[i + 2] - background.b;
              const distance = Math.sqrt(dr*dr + dg*dg + db*db);

              /* Remove the flat plate and retain antialiased logo edges. */
              const coverage = Math.max(0, Math.min(1, (distance - 7) / 52));
              alpha *= coverage;
            }

            if (alpha <= 0.015) continue;
            dst[i] = rgb.r;
            dst[i + 1] = rgb.g;
            dst[i + 2] = rgb.b;
            dst[i + 3] = Math.round(alpha * 255);
          }

          ctx.clearRect(0, 0, width, height);
          ctx.putImageData(out, 0, 0);
          return canvas.toDataURL('image/png');
        };

        const baseSrc = makeTint(base);
        const hoverSrc = makeTint(hover);
        if (!baseSrc || !hoverSrc) return;

        target.src = baseSrc;
        target.classList.add('cx-launcher-colorized-logo');

        const showHover = () => { target.src = hoverSrc; };
        const showBase = () => { target.src = baseSrc; };
        button.addEventListener('pointerenter', showHover, { passive:true });
        button.addEventListener('pointerleave', showBase, { passive:true });
        button.addEventListener('focus', showHover, { passive:true });
        button.addEventListener('blur', showBase, { passive:true });
      } catch (_) {
        /* Safe fallback: keep the real source logo. CSS still guarantees no
           contrasting ring and keeps the launcher background brand-correct. */
      }
    };
    image.src = src;
  }
})();
