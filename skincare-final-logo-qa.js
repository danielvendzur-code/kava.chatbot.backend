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

/* Use the same real company artwork in every assistant message as in the
   closed launcher. A background span avoids older image-to-initial observers. */
(() => {
  'use strict';
  const slug = document.body?.dataset?.cosmeticsDemo;
  if (!slug || slug === 'plener') return;
  const root = document.querySelector('#cosmetics-root');
  const launcher = document.querySelector('#cx-open');
  if (!root || !launcher) return;
  const syncCompanyLogos = () => {
    const image = launcher.querySelector('img');
    if (!image) return; // SVG/text wordmarks and dedicated marks already render as logos.
    const source = image.getAttribute('src');
    if (!source) return;
    const style = getComputedStyle(image);
    const fill = getComputedStyle(launcher).backgroundColor;
    const rgb = fill.match(/[\d.]+/g)?.slice(0, 3).map(Number) || [255, 255, 255];
    const dark = (rgb[0] * .2126 + rgb[1] * .7152 + rgb[2] * .0722) < 150;
    const logoFilter = style.filter === 'none' && dark ? 'brightness(0) invert(1)' : style.filter;
    const compact = slug === 'modrapupava' ? 'right' : 'center';
    const key = source + '|' + logoFilter + '|' + fill + '|' + compact;
    root.querySelectorAll('.cx-message--assistant .cx-message-avatar').forEach((avatar) => {
      if (avatar.querySelector('.cx-cyprianus-symbol,.cx-new-mark')) return;
      if (avatar.dataset.companyLogo === key && avatar.querySelector('.cx-avatar-company-logo')) return;
      const logo = document.createElement('span');
      logo.className = 'cx-avatar-company-logo';
      logo.setAttribute('role', 'img');
      logo.setAttribute('aria-label', window.COSMETICS_DEMOS?.brands?.[slug]?.name || slug);
      logo.style.cssText = 'display:block;width:30px;height:24px;flex:none;background-repeat:no-repeat;background-position:center;background-size:contain';
      logo.style.backgroundImage = 'url(' + JSON.stringify(source) + ')';
      logo.style.filter = logoFilter;
      if (compact === 'right') {
        logo.style.width = '24px';
        logo.style.backgroundSize = 'auto 24px';
        logo.style.backgroundPosition = 'right center';
      }
      avatar.style.backgroundColor = fill;
      avatar.replaceChildren(logo);
      avatar.dataset.companyLogo = key;
    });
  };
  syncCompanyLogos();
  new MutationObserver(syncCompanyLogos).observe(root, {childList:true,subtree:true,attributes:true,attributeFilter:['src','class']});
})();

/* Real company logos in black assistant-avatar circles, independent of launcher artwork. */
(() => {
  'use strict';
  const slug = document.body?.dataset?.cosmeticsDemo;
  const brand = window.COSMETICS_DEMOS?.brands?.[slug];
  const coffee = window.JOLKA;
  const root = document.querySelector('#cosmetics-root') || document.getElementById(coffee?.demo?.rootId || '');
  if (!root || (!brand && !coffee?.brand)) return;
  const name = brand?.name || coffee.brand.name;
  const header = root.querySelector('.cx-widget-brand img.cx-logo');
  const headerWordmark = root.querySelector('.cx-widget-brand .cx-wordmark');
  const sourceImage = header?.getAttribute('src') || coffee?.demo?.logoHeader || brand?.mark || coffee?.demo?.logoAvatar;
  const textWordmark = !sourceImage && headerWordmark ? headerWordmark : null;
  const original = sourceImage || (textWordmark ? 'wordmark:' + slug : null);
  if (!original) return;
  const style = document.createElement('style');
  style.dataset.companyMessageLogo = 'black-real-logo-v1';
  style.textContent = `
    body #cosmetics-root#cosmetics-root .cx-message--assistant .cx-message-avatar,
    body #widget#widget .msg__avatar { background:#141414 !important; background-image:none !important; color:#fff !important; border:0 !important; border-radius:50% !important; display:flex !important; align-items:center !important; justify-content:center !important; }
    body #cosmetics-root#cosmetics-root .cx-message-avatar .cx-company-message-logo,
    body #widget#widget .msg__avatar .cx-company-message-logo { display:block !important; width:calc(100% - 8px) !important; height:calc(100% - 8px) !important; min-width:0 !important; max-width:none !important; min-height:0 !important; max-height:none !important; flex:none !important; margin:0 !important; border:0 !important; border-radius:0 !important; background:transparent var(--cx-company-message-art) center / contain no-repeat !important; mask:none !important; -webkit-mask:none !important; filter:none !important; transform:none !important; }
  `;
  if (slug === 'ponio') style.textContent += '\nbody #cosmetics-root#cosmetics-root .cx-message--assistant .cx-message-avatar {background:' + brand.theme.brand + ' !important;}';
  document.head.append(style);
  let artwork = original;
  let revision = textWordmark ? 1 : 0;
  const sync = () => root.querySelectorAll('.cx-message--assistant .cx-message-avatar,.msg:not(.msg--user) .msg__avatar').forEach(avatar => {
    if (avatar.dataset.realCompanyRevision === String(revision) && avatar.querySelector('.cx-company-message-logo')) return;
    const logo = document.createElement('span');
    // Older brand observers recognize these markers and leave the real logo intact.
    logo.className = 'cx-company-message-logo cx-avatar-company-logo cx-new-mark cx-mark-swap cx-cyprianus-symbol';
    logo.setAttribute('role', 'img');
    logo.setAttribute('aria-label', name);
    logo.style.setProperty('--cx-company-message-art', 'url(' + JSON.stringify(artwork) + ')');
    if (textWordmark) {
      logo.textContent = textWordmark.textContent;
      const markStyle = getComputedStyle(textWordmark);
      logo.style.setProperty('font-family', markStyle.fontFamily, 'important');
      logo.style.setProperty('font-weight', markStyle.fontWeight, 'important');
      logo.style.setProperty('font-size', Math.min(11, 48 / Math.max(1, logo.textContent.length)) + 'px', 'important');
      logo.style.setProperty('color', '#fff', 'important');
      logo.style.setProperty('display', 'flex', 'important');
      logo.style.setProperty('align-items', 'center', 'important');
      logo.style.setProperty('justify-content', 'center', 'important');
      logo.style.setProperty('white-space', 'nowrap', 'important');
      logo.style.setProperty('letter-spacing', '0', 'important');
    }
    avatar.replaceChildren(logo);
    avatar.dataset.realCompanyRevision = String(revision);
    avatar.dataset.realCompanySource = original;
  });
  sync();
  new MutationObserver(sync).observe(root, {childList:true, subtree:true});
  if (textWordmark) return;
  const image = new Image();
  image.onload = () => {
    try {
      const scale = Math.min(1, 480 / Math.max(image.naturalWidth, image.naturalHeight));
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
      canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
      const ctx = canvas.getContext('2d', {willReadFrequently:true});
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const px = pixels.data, w = canvas.width, h = canvas.height;
      const corners = [0, w-1, (h-1)*w, h*w-1].map(p=>Array.from(px.slice(p*4,p*4+4)));
      const distance = (a,b) => Math.hypot(a[0]-b[0],a[1]-b[1],a[2]-b[2]);
      const plate = corners.every(c=>c[3]>245 && distance(c,corners[0])<18) ? corners[0] : null;
      let x0=w, y0=h, x1=-1, y1=-1;
      for(let y=0;y<h;y++) for(let x=0;x<w;x++) {
        const i=(y*w+x)*4;
        if(plate) { const d=distance([px[i],px[i+1],px[i+2]],plate); px[i+3]=Math.round(px[i+3]*Math.min(1,Math.max(0,(d-18)/42))); }
        if(px[i+3]>12) { x0=Math.min(x0,x);x1=Math.max(x1,x);y0=Math.min(y0,y);y1=Math.max(y1,y); }
        px[i]=px[i+1]=px[i+2]=255;
      }
      if(x1<x0 || y1<y0) return;
      ctx.putImageData(pixels,0,0);
      const out=document.createElement('canvas');
      out.width=x1-x0+5;out.height=y1-y0+5;
      out.getContext('2d').drawImage(canvas,x0,y0,x1-x0+1,y1-y0+1,2,2,x1-x0+1,y1-y0+1);
      artwork=out.toDataURL('image/png');revision++;sync();
    } catch (_) { /* Preserve the real source artwork if canvas access is unavailable. */ }
  };
  image.src=original;
})();

