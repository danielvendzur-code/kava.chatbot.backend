/* Older skincare demos: one product photograph instead of a 2x2 collage, and
   equal photo height across the cards of an advisor step (as ukazky-final.js). */
(() => {
  'use strict';
  const root = document.querySelector('#cosmetics-root');
  const slug = document.body?.dataset?.cosmeticsDemo;
  const brand = window.COSMETICS_DEMOS?.brands?.[slug];
  if (!root || !brand) return;

  /* ---------- 3. one hero photograph ---------- */
  /* Only the demos whose hero is the generated 2x2 collage. */
  const heroImg = root.querySelector('.cx-owner-visual img');
  const collage = ['lavelin', 'kvitok', 'soaphoria', 'syncare', 'fytopharma', 'natureal'].includes(slug);
  if (heroImg && collage) {
    /* Studio photographs on a set: the clearest product of the set. */
    const STAGED = { kvitok: 'bbochranny', lavelin: 'bakuchiol' };
    const pick = brand.products.find((p) => p.id === (STAGED[slug] || brand.heroProduct));
    const product = pick || brand.products.find((p) => p.photo);
    if (product?.photo) {
      /* Packshots carry wide white margins. Crop to the product (plus air),
         then let the frame take the photograph's own background colour. */
      const box = heroImg.closest('.cx-owner-visual');
      const tighten = () => {
        try {
          const w = 120, h = Math.round(120 * heroImg.naturalHeight / heroImg.naturalWidth);
          const c = document.createElement('canvas'); c.width = w; c.height = h;
          const g = c.getContext('2d', { willReadFrequently: true }); g.drawImage(heroImg, 0, 0, w, h);
          const px = g.getImageData(0, 0, w, h).data;
          const at = (x, y) => px.slice((y * w + x) * 4, (y * w + x) * 4 + 3);
          const bg = at(1, 1);
          let x0 = w, y0 = h, x1 = 0, y1 = 0;
          for (let y = 0; y < h; y += 1) for (let x = 0; x < w; x += 1) {
            const p = at(x, y);
            if (Math.abs(p[0] - bg[0]) + Math.abs(p[1] - bg[1]) + Math.abs(p[2] - bg[2]) > 36) {
              if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y;
            }
          }
          box?.style.setProperty('--cx-hero-bg', `rgb(${bg[0]}, ${bg[1]}, ${bg[2]})`);
          if (x1 <= x0 || y1 <= y0) return;
          const k = heroImg.naturalWidth / w;
          const padX = (x1 - x0) * 0.22 + 4, padY = (y1 - y0) * 0.12 + 4;
          const sx = Math.max(0, (x0 - padX) * k), sy = Math.max(0, (y0 - padY) * k);
          const sw = Math.min(heroImg.naturalWidth - sx, (x1 - x0 + 2 * padX) * k);
          const sh = Math.min(heroImg.naturalHeight - sy, (y1 - y0 + 2 * padY) * k);
          if (sw * sh > heroImg.naturalWidth * heroImg.naturalHeight * 0.8) return;
          const out = document.createElement('canvas'); out.width = Math.round(sw); out.height = Math.round(sh);
          out.getContext('2d').drawImage(heroImg, sx, sy, sw, sh, 0, 0, out.width, out.height);
          heroImg.src = out.toDataURL('image/jpeg', 0.9);
        } catch { /* cross-origin photo: show it as it is */ }
      };
      heroImg.addEventListener('load', tighten, { once: true });
      heroImg.src = product.photo;
      heroImg.alt = `${product.name} – ${brand.name}`;
      document.body.dataset.cxHeroSingle = 'true';
    }
  }

  /* ---------- 4. equal photo height per step ---------- */
  let frame = 0;
  const equalize = () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      const copies = [...root.querySelectorAll('.cx-options .cx-option-copy')];
      if (!copies.length) return;
      const grid = copies[0].closest('.cx-options');
      grid.style.removeProperty('--cx-copy-h');
      const tallest = Math.max(...copies.map((c) => c.getBoundingClientRect().height));
      if (tallest > 0) grid.style.setProperty('--cx-copy-h', `${Math.ceil(tallest)}px`);
    });
  };
  new MutationObserver(equalize).observe(root, { childList: true, subtree: true });
  addEventListener('resize', equalize);
})();
