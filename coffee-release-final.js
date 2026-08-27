(() => {
  'use strict';

  const slug = String(
    window.COFFEE_DEMO_SLUG ||
    document.body.dataset.coffeeFinal ||
    document.body.dataset.coffeeRelease ||
    (location.pathname.includes('jolka') ? 'jolka' : '')
  ).replace('-v13', '');
  if (!['praziarnicka','jolka','kaffa','concept','vitazov','diamonds'].includes(slug)) return;

  document.documentElement.dataset.coffeeReleaseFinal = '2026-08-27';

  // Historic coffee-final-tune.js installed a 1.6 s Promise.race around
  // /api/chat. That could display a local fallback while the Anthropic request
  // continued in the background and consumed credits. Restore the canonical
  // production wrapper captured immediately after coffee-api-route.js loaded.
  if (typeof window.__COFFEE_STABLE_FETCH__ === 'function') {
    window.fetch = window.__COFFEE_STABLE_FETCH__;
    document.documentElement.dataset.coffeeApiRoute = 'stable';
  }

  const makeImg = (src, className, alt = '') => {
    const img = document.createElement('img');
    img.src = src;
    img.className = className || '';
    img.alt = alt;
    img.decoding = 'async';
    img.loading = 'eager';
    img.draggable = false;
    return img;
  };

  const ensureImg = (host, src, className, alt = '') => {
    if (!(host instanceof HTMLElement)) return null;
    let img = host.querySelector(`:scope > img.${className}`);
    if (!img) {
      img = makeImg(src, className, alt);
      host.replaceChildren(img);
    } else if (img.getAttribute('src') !== src) {
      img.src = src;
    }
    return img;
  };

  function conceptCrop(host, className) {
    if (!(host instanceof HTMLElement)) return;
    if (host.querySelector(`:scope > .${className}`)) return;
    const wrap = document.createElement('span');
    wrap.className = className;
    wrap.appendChild(makeImg('/brand/concept-official-logo.png', '', ''));
    host.replaceChildren(wrap);
    host.dataset.cfLogo = 'concept';
  }

  function polishPraziarnicka() {
    if (slug !== 'praziarnicka') return;
    const entry = document.querySelector('#pz13-advisor-entry');
    if (!entry) return;
    const media = entry.firstElementChild;
    if (media) ensureImg(media, '/assets/jolka/method/lever.webp', 'cfr-praziarnicka-entry-photo');
    const title = entry.querySelector('b');
    const note = entry.querySelector('small');
    if (title) title.textContent = 'Nájsť svoju kávu';
    if (note) note.textContent = '4 otázky · jedno konkrétne odporúčanie';
  }

  function polishJolka() {
    if (slug !== 'jolka') return;
    document.querySelector('.widget__note')?.remove();
  }

  const kaffaPhotos = {
    espresso:'/assets/kaffa/prep-espresso.webp',
    automatic:'/assets/kaffa/prep-automatic.webp',
    filter:'/assets/kaffa/prep-filter.webp',
    moka:'/assets/kaffa/prep-moka.webp',
    chocolate:'/assets/kaffa/mokka-hero.webp',
    balanced:'/assets/kaffa/brew-espresso.webp',
    fruity:'/assets/kaffa/kamundu-official.webp',
    adventurous:'/assets/kaffa/wilder-lazo-official.webp',
    black:'/assets/jolka/method/black.webp',
    milk:'/assets/jolka/method/milk.webp',
    classic:'/assets/kaffa/mokka-official.webp',
    decaf:'/assets/kaffa/decaf-official.jpg'
  };

  function polishKaffa() {
    if (slug !== 'kaffa') return;
    document.querySelectorAll('.kf-option[data-value]').forEach((option) => {
      const visual = option.querySelector('.kf-option__visual');
      const src = kaffaPhotos[option.dataset.value];
      if (!visual || !src) return;
      const existing = visual.querySelector(':scope > img.cfr-option-photo');
      if (existing) {
        if (existing.getAttribute('src') !== src) existing.src = src;
        return;
      }
      visual.replaceChildren(makeImg(src, 'cfr-option-photo', ''));
    });
  }

  function polishConcept() {
    if (slug !== 'concept') return;

    const launcher = document.querySelector('#openWidget.launcher__button');
    if (launcher && !launcher.querySelector(':scope > .cfr-concept-launcher-crop')) {
      const status = launcher.querySelector('.launcher__status') || document.createElement('span');
      status.className = 'launcher__status';
      status.setAttribute('aria-hidden', 'true');
      const crop = document.createElement('span');
      crop.className = 'cfr-concept-launcher-crop';
      crop.appendChild(makeImg('/brand/concept-official-logo.png', '', ''));
      launcher.replaceChildren(crop, status);
      launcher.dataset.cfLogo = 'concept';
    }

    document.querySelectorAll('.message__avatar').forEach((avatar) => conceptCrop(avatar, 'cfr-concept-mark-crop'));

    const headerLogo = document.querySelector('.concept-widget-logo');
    if (headerLogo) {
      headerLogo.src = '/brand/concept-official-logo.png';
      headerLogo.alt = 'Concept Coffee Roasters';
    }

    const entry = document.querySelector('#openAdvisor');
    if (entry) {
      const title = entry.querySelector('.advisor-entry__copy b');
      const note = entry.querySelector('.advisor-entry__copy span');
      if (title) title.textContent = 'Nájsť svoju kávu';
      if (note) note.textContent = '4 otázky · jedno odporúčanie';
    }
  }

  const victoryPhotos = {
    home:'/assets/jolka/method/moka.webp',
    office:'/assets/jolka/method/both.webp',
    automatic:'/assets/jolka/method/automat.webp',
    discovery:'/assets/jolka/method/filter.webp',
    strong:'/assets/vitazov-brazil.jpeg',
    smooth:'/assets/kaffa/brew-espresso.webp',
    balanced:'/assets/kaffa/brew-espresso.webp',
    fruity:'/assets/vitazov-ethiopia.jpeg',
    decaf:'/assets/vitazov-decaf.jpeg',
    lever:'/assets/jolka/method/lever.webp',
    moka:'/assets/jolka/method/moka.webp',
    filter:'/assets/jolka/method/filter.webp',
    black:'/assets/jolka/method/black.webp',
    milk:'/assets/jolka/method/milk.webp',
    both:'/assets/jolka/method/both.webp',
    classic:'/assets/vitazov-brazil.jpeg',
    medium:'/assets/kaffa/brew-espresso.webp'
  };

  function polishVitazov() {
    if (slug !== 'vitazov') return;

    const brand = document.querySelector('.widget-brand');
    if (brand && !brand.querySelector(':scope > img.cfr-vitazov-header-logo')) {
      brand.replaceChildren(makeImg('/assets/vitazov-logo.svg', 'cfr-vitazov-header-logo', 'Káva Víťazov'));
    }

    const launcher = document.querySelector('#openWidget.launcher__button');
    if (launcher && !launcher.querySelector(':scope > img.cfr-vitazov-launcher-logo')) {
      const status = document.createElement('span');
      status.className = 'launcher__status';
      status.setAttribute('aria-hidden', 'true');
      launcher.replaceChildren(makeImg('/assets/vitazov-logo.svg', 'cfr-vitazov-launcher-logo', ''), status);
      launcher.dataset.cfLogo = 'vitazov';
    }

    document.querySelectorAll('.message__avatar').forEach((avatar) => {
      const img = ensureImg(avatar, '/assets/vitazov-logo.svg', 'cfr-vitazov-avatar-logo');
      if (img) avatar.dataset.cfLogo = 'vitazov';
    });

    const entry = document.querySelector('#openAdvisor');
    if (entry) {
      const media = entry.firstElementChild;
      if (media) ensureImg(media, '/assets/vitazov-brazil.jpeg', 'cfr-vitazov-entry-photo');
      const title = entry.querySelector('b');
      const note = entry.querySelector('em');
      if (title) title.textContent = 'Nájsť svoju kávu';
      if (note) note.textContent = '4 krátke otázky · jedno odporúčanie';
    }

    document.querySelectorAll('#advisorBody .option[data-value]').forEach((option) => {
      const src = victoryPhotos[option.dataset.value];
      const visual = option.querySelector('.option__photo');
      if (!src || !visual) return;
      let img = visual.querySelector(':scope > img.cfr-vitazov-photo');
      if (!img) {
        img = makeImg(src, 'cfr-vitazov-photo', '');
        visual.prepend(img);
      } else if (img.getAttribute('src') !== src) {
        img.src = src;
      }
    });
  }

  function polishDiamonds() {
    if (slug !== 'diamonds') return;
    const header = document.querySelector('.widget-logo');
    if (header) ensureImg(header, '/assets/diamonds/diroastery-logo.svg', 'cfr-diamonds-header-logo', 'Diamonds Roastery');
    document.querySelectorAll('.chat-logo').forEach((avatar) => {
      const img = ensureImg(avatar, '/assets/diamonds/diroastery-logo.svg', 'cfr-diamonds-chat-logo');
      if (img) avatar.dataset.cfLogo = 'diamonds';
    });
  }

  function run() {
    polishPraziarnicka();
    polishJolka();
    polishKaffa();
    polishConcept();
    polishVitazov();
    polishDiamonds();
  }

  let queued = false;
  const observer = new MutationObserver(() => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      run();
    });
  });
  observer.observe(document.body, { childList:true, subtree:true });

  run();
  [120,360,850,1600].forEach((delay) => setTimeout(run, delay));
})();
