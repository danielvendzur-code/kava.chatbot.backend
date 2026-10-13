/* Final pass over the closed chat bubble.
   - A logo on a pale or white bubble looks washed out: the bubble takes the brand colour, the logo
     turns white, and the two swap on hover.
   - A logo that is a very wide wordmark is unreadable in a small circle: only then the bubble shows
     a chat icon in the brand colour instead.
   - A full-colour picture logo cannot change colour: the bubble gets a ring on hover, so every
     bubble reacts to the pointer.
   Loaded last on the demo page. */
(() => {
  'use strict';
  const ICON = '<svg viewBox="0 0 28 28" aria-hidden="true" focusable="false"><path d="M14 4.4c5.5 0 9.8 3.8 9.8 8.6s-4.3 8.6-9.8 8.6c-1.2 0-2.4-.2-3.5-.55L5.8 23.4l1.15-4.3C5.250 17.550 4.2 15.4 4.2 13c0-4.800 4.3-8.600 9.800-8.600Z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/><circle cx="9.9" cy="13" r="1.15" fill="currentColor"/><circle cx="14" cy="13" r="1.15" fill="currentColor"/><circle cx="18.1" cy="13" r="1.15" fill="currentColor"/></svg>';
  const ID = 'html body #cx-open#cx-open#cx-open#cx-open#cx-open';
  const style = document.createElement('style');
  style.textContent = [
    ID + '.cx-lf-chat{display:grid!important;place-items:center!important;padding:0!important;background:var(--lf-bg,#141414)!important;background-image:none!important;color:#fff!important;border:1px solid var(--lf-bg,#141414)!important;outline:none!important;transform:none!important;filter:none!important;box-shadow:0 14px 30px -16px rgba(20,20,20,.55)!important;transition:background-color .16s,color .16s!important;}',
    ID + '.cx-lf-chat:hover,' + ID + '.cx-lf-chat:focus-visible{background:#fff!important;color:var(--lf-bg,#141414)!important;}',
    ID + '.cx-lf-chat::before,' + ID + '.cx-lf-chat::after{content:none!important;display:none!important;}',
    'html body #cx-open#cx-open#cx-open.cx-lf-chat>svg{display:block!important;width:56%!important;height:56%!important;filter:none!important;transform:none!important;opacity:1!important;}',
    ID + '.cx-lf-solid{display:grid!important;place-items:center!important;background:var(--lf-bg,#141414)!important;background-color:var(--lf-bg,#141414)!important;background-image:none!important;color:#fff!important;border:1px solid var(--lf-bg,#141414)!important;box-sizing:border-box!important;outline:none!important;transform:none!important;transition:background-color .16s,color .16s!important;}',
    ID + '.cx-lf-solid:hover,' + ID + '.cx-lf-solid:focus-visible{background:#fff!important;background-color:#fff!important;color:var(--lf-bg,#141414)!important;}',
    ID + '.cx-lf-solid .cx-lf-ink{background:currentColor!important;background-color:currentColor!important;transition:none!important;}',
    ID + '.cx-lf-solid .cx-launcher-name{color:currentColor!important;}',
    ID + '.cx-lf-mark-host{padding:0!important;}',
    'html body #cx-open#cx-open#cx-open.cx-lf-solid>.cx-lf-mark{display:block!important;width:62%!important;height:62%!important;margin:0!important;border:0!important;border-radius:0!important;background:currentColor!important;-webkit-mask:var(--lf-mark) center / contain no-repeat!important;mask:var(--lf-mark) center / contain no-repeat!important;filter:none!important;transform:none!important;opacity:1!important;}',
    ID + '.cx-lf-ring{transition:box-shadow .16s!important;}',
    ID + '.cx-lf-ring:hover,' + ID + '.cx-lf-ring:focus-visible{box-shadow:0 0 0 3px var(--lf-bg,#141414),0 14px 30px -16px rgba(20,20,20,.55)!important;outline:none!important;transform:none!important;}'
  ].join('');
  document.head.append(style);

  const rgb = (value) => { const m = String(value || '').match(/[\d.]+/g); return m && m.length >= 3 ? m.slice(0, 4).map(Number) : null; };
  const lum = (value) => {
    const m = Array.isArray(value) ? value : rgb(value);
    if (!m) return null;
    const [r, g, b] = m.slice(0, 3).map((v) => { v /= 255; return v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; });
    return r * .2126 + g * .7152 + b * .0722;
  };
  const saturation = (c) => { const max = Math.max(c[0], c[1], c[2]), min = Math.min(c[0], c[1], c[2]); return max ? (max - min) / max : 0; };
  const resolve = (name) => {
    const probe = document.createElement('i');
    probe.style.cssText = 'position:absolute;visibility:hidden;color:var(' + name + ')';
    document.body.append(probe);
    const colour = getComputedStyle(probe).color;
    probe.remove();
    return rgb(colour);
  };
  /* The brand's own colour carries a white icon; a pale one is darkened until white reads on it. */
  function brandColour() {
    const options = ['--cx-brand', '--cx-accent', '--cx-ink'].map(resolve).filter(Boolean).map((c) => c.slice(0, 3));
    if (!options.length) return '#141414';
    const coloured = options.filter((c) => saturation(c) > .3 && lum(c) > .012).sort((a, b) => saturation(b) - saturation(a));
    let pick = saturation(options[0]) > .2 && lum(options[0]) > .012 ? options[0] : coloured[0] || options[0];
    while (lum(pick) > .3) pick = pick.map((v) => v * .92);
    return 'rgb(' + pick.map(Math.round).join(',') + ')';
  }
  /* Reads a logo: width to height of its inked part, a cut-out of it, and how much of its box it fills. */
  const readLogo = (src) => new Promise((done) => {
    const image = new Image();
    image.onerror = () => done(null);
    image.onload = () => {
      const whole = {aspect: image.naturalWidth / image.naturalHeight, mark: '', cover: 1};
      try {
        const scale = Math.min(1, 320 / Math.max(image.naturalWidth, image.naturalHeight));
        const w = Math.max(1, Math.round(image.naturalWidth * scale)), h = Math.max(1, Math.round(image.naturalHeight * scale));
        const canvas = document.createElement('canvas');
        canvas.width = w; canvas.height = h;
        const ctx = canvas.getContext('2d', {willReadFrequently: true});
        ctx.drawImage(image, 0, 0, w, h);
        const data = ctx.getImageData(0, 0, w, h), px = data.data;
        const corner = [px[0], px[1], px[2], px[3]], plate = corner[3] > 200;
        let x0 = w, y0 = h, x1 = -1, y1 = -1, ink = 0;
        for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
          const i = (y * w + x) * 4;
          let alpha = px[i + 3];
          if (plate) alpha *= Math.max(0, Math.min(1, (Math.abs(px[i] - corner[0]) + Math.abs(px[i + 1] - corner[1]) + Math.abs(px[i + 2] - corner[2]) - 30) / 70));
          px[i] = px[i + 1] = px[i + 2] = 255; px[i + 3] = alpha;
          if (alpha > 40) { ink++; if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
        }
        if (x1 < x0) return done(whole);
        const bw = x1 - x0 + 1, bh = y1 - y0 + 1;
        ctx.clearRect(0, 0, w, h);
        ctx.putImageData(data, 0, 0);
        const cut = document.createElement('canvas');
        cut.width = bw; cut.height = bh;
        cut.getContext('2d').drawImage(canvas, x0, y0, bw, bh, 0, 0, bw, bh);
        done({aspect: bw / bh, mark: cut.toDataURL('image/png'), cover: ink / (bw * bh), plate: plate ? lum(corner) : null});
      } catch (_) { done(whole); }
    };
    image.src = src;
  });
  const urlOf = (value) => (String(value || '').match(/url\((['"]?)(.*?)\1\)/) || [])[2] || '';
  /* Logos that stay unreadable in a circle although they are not wide. */
  const UNREADABLE = ['skoupil', 'gotberg', 'pristal', 'cyprianus', 'pravaja', 'almara', 'magula'];

  const MARK = '<span class="cx-lf-mark" aria-hidden="true"></span>';
  const logos = new Map();
  const maskOf = (button) => [...button.querySelectorAll('*')].find((el) => { const s = getComputedStyle(el); return /url\(/.test(s.maskImage || s.webkitMaskImage || ''); });
  let mode = '', mark = '', busy = false, paleSeen = 0;
  /* Keeps the verdict on the bubble: the page redraws it and drops our classes. */
  function hold(button) {
    const brand = brandColour();
    if (button.style.getPropertyValue('--lf-bg') !== brand) button.style.setProperty('--lf-bg', brand);
    if (mode === 'chat') {
      if (!button.classList.contains('cx-lf-chat')) { button.classList.remove('cx-lf-ring'); button.classList.add('cx-lf-chat'); }
      if (!button.querySelector(':scope > svg') || button.childElementCount !== 1) button.innerHTML = ICON;
      return;
    }
    if (!button.classList.contains('cx-lf-solid')) { button.classList.remove('cx-lf-ring'); button.classList.add('cx-lf-solid'); }
    if (mode === 'mark') {
      if (!button.classList.contains('cx-lf-mark-host')) button.classList.add('cx-lf-mark-host');
      if (button.style.getPropertyValue('--lf-mark') !== mark) button.style.setProperty('--lf-mark', mark);
      if (!button.querySelector(':scope > .cx-lf-mark') || button.childElementCount !== 1) button.innerHTML = MARK;
    } else {
      const masked = maskOf(button);
      if (masked && !masked.classList.contains('cx-lf-ink')) masked.classList.add('cx-lf-ink');
    }
  }
  /* The page builds, redraws and sometimes replaces the bubble, and the brand colours can arrive
     late: the bubble is looked at again and again, and a verdict is final. */
  async function finish() {
    const button = document.querySelector('#cx-open');
    if (!button || busy) return;
    if (mode) return hold(button);
    busy = true;
    try {
      const picture = button.querySelector('img');
      const masked = maskOf(button);
      const rest = rgb(getComputedStyle(button).backgroundColor);
      /* A pale bubble counts only when it stays pale, not while the brand styles are still loading. */
      paleSeen = !button.matches(':hover') && (!rest || (rest.length > 3 && rest[3] < .5) || lum(rest) > .38) ? paleSeen + 1 : 0;
      const pale = paleSeen >= 2;
      /* A logo painted as a background picture brings its own plate, which hides the bubble's colour. */
      const art = picture || masked ? null : [...button.querySelectorAll('*')].find((el) => /url\(/.test(getComputedStyle(el).backgroundImage));
      const src = picture ? (picture.currentSrc || picture.src) : masked ? urlOf(getComputedStyle(masked).maskImage || getComputedStyle(masked).webkitMaskImage) : art ? urlOf(getComputedStyle(art).backgroundImage) : '';
      if (!src) return;                                  /* a text wordmark: it has its own colours */
      if (src && !logos.has(src)) logos.set(src, await readLogo(src));
      const logo = src ? logos.get(src) : null;
      const wide = !!logo && (logo.aspect >= 4 || logo.aspect <= .25);
      if (wide || UNREADABLE.includes(document.body.dataset.cosmeticsDemo)) mode = 'chat';
      else if (pale && masked) mode = 'solid';
      /* A cut-out that fills its box is a photo or a round badge, not a mark: it stays as it is. */
      else if ((art && logo && typeof logo.plate === 'number' ? logo.plate > .38 : pale) && logo && logo.mark && logo.cover < .68) { mark = 'url("' + logo.mark + '")'; mode = 'mark'; }
      if (mode) hold(button);
      else if (picture && !masked && !button.classList.contains('cx-lf-ring')) {
        button.style.setProperty('--lf-bg', brandColour());
        button.classList.add('cx-lf-ring');
      }
    } finally { busy = false; }
  }  setInterval(finish, 250);
})();
