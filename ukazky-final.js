/* Last layer, shared by the wine, skincare and hair demos (same file in every
   project; see ukazky-final.css). Runs after nove-znacky.js has placed the
   brand symbol.
   1. Launcher contrast: never pale at rest; a pale hover becomes another
      brand colour or a deeper shade of the rest colour.
   2. Launcher symbol: brands whose symbol did not read in a small circle get
      a chat bubble or their full short name (decided brand by brand).
   3. Owner page: one large product photograph instead of the 2x2 collage.
   4. Advisor: equal photo height across the cards of a step. */
(() => {
  'use strict';

  const slug = document.body?.dataset?.cosmeticsDemo;
  const brand = window.COSMETICS_DEMOS?.brands?.[slug];
  const launcher = document.querySelector('#cx-open');
  const root = document.querySelector('#cosmetics-root');
  if (!brand || !root) return;

  /* ---------- colour helpers ---------- */
  const rgb = (value) => {
    const v = String(value || '').trim();
    if (v.startsWith('#')) {
      const h = v.length === 4 ? v.slice(1).split('').map((c) => c + c).join('') : v.slice(1, 7);
      return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
    }
    const m = v.match(/[\d.]+/g);
    return m ? m.slice(0, 3).map(Number) : [255, 255, 255];
  };
  const lum = (c) => {
    const [r, g, b] = rgb(c).map((x) => { x /= 255; return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4; });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const dist = (a, b) => { const x = rgb(a); const y = rgb(b); return Math.hypot(x[0] - y[0], x[1] - y[1], x[2] - y[2]); };
  const css = (c) => `rgb(${rgb(c).join(', ')})`;
  const shade = (c, k = 0.24) => css(rgb(c).map((x) => Math.round(x * (1 - k))));
  const lift = (c, k = 0.2) => css(rgb(c).map((x) => Math.round(x + (255 - x) * k)));
  const pale = (c) => lum(c) > 0.6;
  const theme = brand.theme || {};

  /* A hover colour for a dark rest colour: another brand colour if one is
     dark enough for the symbol and clearly different, else a deeper shade. */
  /* Where the symbol shares the accent's hue, the accent would swallow it. */
  const HOVER = { carpatediem: '#3b3226', medarek: '#2c4d18' };
  const hoverFor = (rest) => {
    if (HOVER[slug]) return HOVER[slug];
    for (const candidate of [theme.brand, theme.accent]) {
      if (candidate && !pale(candidate) && lum(candidate) < 0.32 && dist(candidate, rest) > 70) return css(candidate);
    }
    return lum(rest) < 0.02 ? lift(rest, 0.16) : shade(rest);
  };

  /* ---------- 2. symbol decisions ---------- */
  const BUBBLE = 'data:image/svg+xml,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">'
    + '<path d="M24 9c9.4 0 17 6.3 17 14.2S33.4 37.4 24 37.4c-2.1 0-4.1-.3-6-.9L9.6 40.5l2.4-6.9C8.9 31.1 7 27.4 7 23.2 7 15.3 14.6 9 24 9Z" fill="none" stroke="#000" stroke-width="3.2" stroke-linejoin="round"/>'
    + '<circle cx="16.6" cy="23.4" r="2.3"/><circle cx="24" cy="23.4" r="2.3"/><circle cx="31.4" cy="23.4" r="2.3"/></svg>');
  /* bg/hover/fg only where the brand's own launcher colours do not work. */
  const SWAP = {
    skoupil: { mark: BUBBLE, bg: '#ffbb00', hover: '#1d1d1b', fg: '#1d1d1b', fgHover: '#ffbb00' },
    ukaplicky: { mark: BUBBLE, bg: '#7a1b1f', hover: '#4f1013', fg: '#fff' },
    nechory: { mark: BUBBLE },
    almara: { mark: BUBBLE },
    botanica: { mark: BUBBLE },
    iuvenio: { mark: BUBBLE },
    smyssly: { mark: BUBBLE },
    andreine: { mark: BUBBLE },
    kapyderm: { mark: BUBBLE },
    voono: { mark: BUBBLE },
    dixi: { mark: '/assets/cosmetics/dixi-logo.png', wide: true }
  };

  /* ---------- 1. launcher colours ---------- */
  const setLauncher = (bg, hover, img, imgHover) => {
    const s = document.body.style;
    s.setProperty('--cx-l-bg', css(bg));
    s.setProperty('--cx-l-hover', css(hover));
    if (img) s.setProperty('--cx-l-img', `url('${img}')`);
    if (imgHover) s.setProperty('--cx-l-img-hover', `url('${imgHover}')`);
    s.setProperty('--cx-mark-bg', css(bg));
    document.body.dataset.cxLaunch = 'true';
  };

  const swap = SWAP[slug];
  if (launcher && swap) {
    const markup = `<span class="cx-new-mark cx-mark-swap${swap.wide ? ' cx-mark-swap--wide' : ''}" aria-hidden="true" style="--cx-mark:url('${swap.mark}')"></span>`;
    launcher.classList.remove('is-image-logo', 'cx-launcher-has-wordmark', 'cx-launcher-has-image-logo');
    launcher.classList.add('cx-launcher-has-new-mark');
    launcher.innerHTML = markup;
    delete document.body.dataset.cxNewMarkColor;
    document.body.dataset.cxNewMark = 'true';
    document.body.dataset.cxMarkSwap = 'true';
    const rest = swap.bg || getComputedStyle(launcher).backgroundColor;
    const restColor = pale(rest) ? (theme.accent || theme.brand) : rest;
    setLauncher(restColor, swap.hover || hoverFor(restColor));
    if (swap.fg) document.body.style.setProperty('--cx-l-fg', swap.fg);
    if (swap.fgHover) document.body.style.setProperty('--cx-l-fg-hover', swap.fgHover);
    const syncAvatars = () => document.querySelectorAll('.cx-message-avatar').forEach((avatar) => {
      if (!avatar.querySelector('.cx-mark-swap')) avatar.innerHTML = markup;
    });
    syncAvatars();
    new MutationObserver(syncAvatars).observe(root, { childList: true, subtree: true });
  } else if (launcher && brand.markColor) {
    /* Two-state symbols (own colours on one background, reversed on the
       other). The darker state becomes the rest state. */
    const c = brand.markColor;
    const restIsPale = pale(c.bg);
    const darkBg = restIsPale ? c.bgHover : c.bg;
    const darkImg = restIsPale ? c.reverse : brand.mark;
    const other = restIsPale ? c.bg : c.bgHover;
    if (restIsPale || pale(other)) {
      const hover = pale(other) ? hoverFor(darkBg) : other;
      setLauncher(darkBg, hover, darkImg, pale(other) ? darkImg : (restIsPale ? brand.mark : c.reverse));
    }
  } else if (launcher) {
    const rest = getComputedStyle(launcher).backgroundColor;
    if (pale(rest)) {
      const color = !pale(theme.accent || '#fff') ? theme.accent : theme.brand;
      setLauncher(color, hoverFor(color));
    }
  }

  /* ---------- 3. one hero photograph ---------- */
  /* Only the demos whose hero is the generated 2x2 collage. */
  const heroImg = root.querySelector('.cx-owner-visual img');
  const collage = /\/assets\/(vino|cosmetics)\/[a-z0-9-]+\.jpg$/.test(brand.hero || '') && brand.mark;
  if (heroImg && collage) {
    const pick = brand.heroProduct && brand.products.find((p) => p.id === brand.heroProduct);
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
