/* Hover colour of the closed bubble – same rule as ukazky-final.js: another brand colour if it is
   dark enough for the mark and clearly different, otherwise a deeper shade of the rest colour. */
window.CXLauncherHover = ((rest, candidates = []) => {
  const rgb = (value) => {
    const v = String(value || '').trim();
    if (v.startsWith('#')) { const h = v.length === 4 ? v.slice(1).split('').map((c) => c + c).join('') : v.slice(1, 7); return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)); }
    const m = v.match(/[\d.]+/g); return m ? m.slice(0, 3).map(Number) : [255, 255, 255];
  };
  const lum = (c) => { const [r, g, b] = rgb(c).map((x) => { x /= 255; return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4; }); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
  const dist = (a, b) => { const x = rgb(a), y = rgb(b); return Math.hypot(x[0] - y[0], x[1] - y[1], x[2] - y[2]); };
  const css = (c) => 'rgb(' + rgb(c).join(', ') + ')';
  const mix = (c, target, k) => css(rgb(c).map((x, i) => Math.round(x + (target[i] - x) * k)));
  /* Another brand colour that is clearly different and not close to white … */
  let bg = candidates.map((c) => String(c || '').trim()).find((c) => c && lum(c) < 0.7 && dist(c, rest) > 60);
  /* … otherwise a strong step lighter (dark brands) or darker (light brands). */
  if (!bg) bg = lum(rest) < 0.2 ? mix(rest, [255, 255, 255], 0.38) : mix(rest, [0, 0, 0], 0.42);
  return {bg: css(bg), fg: lum(bg) > 0.45 ? (lum(rest) < 0.2 ? css(rest) : '#141414') : '#fff'};
});
/* Final shared pass for every coffee demo: the real company logo, cleanly, in the
   launcher, the widget header and each assistant avatar. Loaded after all brand overrides. */
(() => {
  'use strict';
  const coffee = window.JOLKA;
  const root = document.getElementById(coffee?.demo?.rootId || '') || document.body;
  const launcher = document.querySelector('#open');
  const widget = document.querySelector('#widget');
  if (!coffee?.brand || !launcher || !widget) return;
  const demo = coffee.demo;
  const name = coffee.brand.name;

  document.querySelectorAll('span').forEach((span) => { if (/^Ukážka riešenia/.test(span.textContent.trim())) span.remove(); });

  const status = widget.querySelector('.widget__brand span');
  if (status) status.replaceChildren(status.querySelector('i') || document.createElement('i'), document.createTextNode(' online poradca'));

  const rgb = (element) => (getComputedStyle(element).backgroundColor.match(/[\d.]+/g) || [20, 20, 20]).slice(0, 3).map(Number);
  const isLight = (c) => (c[0] * .2126 + c[1] * .7152 + c[2] * .0722) > 170;
  const distance = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);

  /* Remove only a flat background plate and paint the remaining mark in one tone.
     Resolves null when the artwork is a filled badge that would turn into a blank blob. */
  const clean = (src, tone) => new Promise((resolve) => {
    const image = new Image();
    image.onerror = () => resolve(null);
    image.onload = () => {
      try {
        const scale = Math.min(1, 640 / Math.max(image.naturalWidth, image.naturalHeight));
        const canvas = document.createElement('canvas');
        const w = canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
        const h = canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
        const ctx = canvas.getContext('2d', {willReadFrequently:true});
        ctx.drawImage(image, 0, 0, w, h);
        const pixels = ctx.getImageData(0, 0, w, h), px = pixels.data;
        const corners = [0, w - 1, (h - 1) * w, h * w - 1].map((p) => Array.from(px.slice(p * 4, p * 4 + 4)));
        let plate = corners.find((c) => c[3] > 245 && corners.filter((o) => o[3] > 245 && distance(o, c) < 18).length >= 3);
        if (!plate) {
          /* Transparent corners but a filled interior (e.g. a white disc behind the drawing):
             the fill is the dominant colour, as long as a real drawing remains beside it. */
          const bins = new Map(); let opaque = 0;
          for (let i = 0; i < px.length; i += 16) {
            if (px[i + 3] < 200) continue;
            opaque++;
            const key = (px[i] >> 4) << 8 | (px[i + 1] >> 4) << 4 | (px[i + 2] >> 4);
            bins.set(key, (bins.get(key) || 0) + 1);
          }
          const top = [...bins].sort((a, b) => b[1] - a[1])[0];
          if (top && top[1] / opaque > .45) {
            const fill = [(top[0] >> 8 & 15) * 17, (top[0] >> 4 & 15) * 17, (top[0] & 15) * 17];
            let other = 0;
            for (let i = 0; i < px.length; i += 16) if (px[i + 3] >= 200 && distance([px[i], px[i + 1], px[i + 2]], fill) > 72) other++;
            if (other / opaque > .12) plate = fill;
          }
        }
        let x0 = w, y0 = h, x1 = -1, y1 = -1, solid = 0;
        for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
          const i = (y * w + x) * 4;
          if (plate) px[i + 3] = Math.round(px[i + 3] * Math.min(1, Math.max(0, (distance([px[i], px[i + 1], px[i + 2]], plate) - 30) / 42)));
          px[i] = px[i + 1] = px[i + 2] = tone;
          if (px[i + 3] > 12) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
          if (px[i + 3] > 128) solid++;
        }
        if (x1 < x0 || y1 < y0 || solid / ((x1 - x0 + 1) * (y1 - y0 + 1)) > .72) return resolve(null);
        ctx.putImageData(pixels, 0, 0);
        const out = document.createElement('canvas');
        out.width = x1 - x0 + 5; out.height = y1 - y0 + 5;
        out.getContext('2d').drawImage(canvas, x0, y0, x1 - x0 + 1, y1 - y0 + 1, 2, 2, x1 - x0 + 1, y1 - y0 + 1);
        resolve(out.toDataURL('image/png'));
      } catch (_) { resolve(null); }
    };
    image.src = src;
  });

  const markSource = demo.logoAvatar || demo.logoBadge || demo.logoHeader || demo.logoInk;
  let art = markSource, revision = 0;
  const paint = (host) => {
    if (host.dataset.cqLogo === String(revision) && host.querySelector('.cq-mark')) return;
    const mark = document.createElement('span');
    mark.className = 'cq-mark';
    mark.setAttribute('role', 'img');
    mark.setAttribute('aria-label', name);
    mark.style.setProperty('--cq-art', 'url(' + JSON.stringify(art) + ')');
    host.replaceChildren(mark);
    host.dataset.cqLogo = String(revision);
  };
  const sync = () => { paint(launcher); widget.querySelectorAll('.msg:not(.msg--user) .msg__avatar').forEach(paint); };

  if (markSource) {
    /* Until the artwork is processed, show the untouched logo on white rather than a filtered square. */
    document.documentElement.classList.add('cq-logo-plain');
    sync();
    new MutationObserver(sync).observe(root, {childList:true, subtree:true});
    const dark = isLight(rgb(widget.querySelector('.widget__header') || launcher));
    document.documentElement.style.setProperty('--cq-fg', dark ? '#141414' : '#fff');
    const tokens = getComputedStyle(document.documentElement);
    /* The bubble's rest colour is the brand ink token (the computed colour is still the loading state here). */
    const hover = window.CXLauncherHover(tokens.getPropertyValue('--ink'), [tokens.getPropertyValue('--kraft-deep'), tokens.getPropertyValue('--kraft'), tokens.getPropertyValue('--ink-2')]);
    document.documentElement.style.setProperty('--cq-hover', hover.bg);
    document.documentElement.style.setProperty('--cq-hover-fg', hover.fg);
    clean(markSource, dark ? 20 : 255).then((url) => {
      if (!url) return;
      art = url; revision++;
      document.documentElement.classList.remove('cq-logo-plain');
      /* One-colour mark: the closed bubble can invert on hover. */
      document.documentElement.classList.add('cq-logo-mask');
      sync();
    });
  }

  const headerLogo = widget.querySelector('.widget__brand > img');
  const head = widget.querySelector('.widget__header');
  if (headerLogo && head) {
    const light = isLight(rgb(head));
    headerLogo.classList.add(light ? 'cq-header-plain' : 'cq-header-pending');
    if (!light) clean(headerLogo.getAttribute('src'), 255).then((url) => {
      headerLogo.classList.remove('cq-header-pending');
      if (url) { headerLogo.src = url; headerLogo.classList.add('cq-header-clean'); }
      else headerLogo.classList.add('cq-header-plate');
    });
  }
})();
