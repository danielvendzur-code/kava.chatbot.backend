(() => {
  'use strict';

  const slug = String(window.COFFEE_DEMO_SLUG || document.body.dataset.coffeeFinal || (location.pathname.includes('jolka') ? 'jolka' : '')).replace('-v13', '');
  if (!['praziarnicka','jolka','kaffa','concept','vitazov','diamonds'].includes(slug)) return;
  document.documentElement.dataset.coffeeFinalPolish = '2026-08-27';

  const makeImg = (src, className, alt = '') => {
    const img = document.createElement('img');
    img.src = src;
    img.alt = alt;
    img.decoding = 'async';
    img.loading = 'eager';
    img.draggable = false;
    if (className) img.className = className;
    return img;
  };

  function ensureImage(host, src, className, alt = '') {
    if (!(host instanceof HTMLElement)) return null;
    let img = host.querySelector(`img.${className}`);
    if (!img) {
      img = makeImg(src, className, alt);
      host.replaceChildren(img);
    } else if (img.getAttribute('src') !== src) {
      img.src = src;
    }
    return img;
  }

  function polishPraziarnicka() {
    if (slug !== 'praziarnicka') return;
    const entry = document.querySelector('#pz13-advisor-entry');
    if (entry) {
      const media = entry.firstElementChild;
      if (media) ensureImage(media, '/assets/jolka/method/lever.webp', 'cfp-praziarnicka-entry-photo');
      const title = entry.querySelector('b');
      const copy = entry.querySelector('small');
      if (title) title.textContent = 'Nájsť svoju kávu';
      if (copy) copy.textContent = '4 otázky · jedno konkrétne odporúčanie';
    }
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
      const src = kaffaPhotos[option.dataset.value];
      const visual = option.querySelector('.kf-option__visual');
      if (!src || !visual) return;
      ensureImage(visual, src, 'cfp-option-photo');
    });
  }

  function polishConcept() {
    if (slug !== 'concept') return;

    const launcher = document.querySelector('#openWidget.launcher__button');
    if (launcher && !launcher.querySelector('.cfp-concept-launcher-logo')) {
      launcher.replaceChildren(makeImg('/brand/concept-official-logo.png', 'cfp-concept-launcher-logo', ''));
    }

    const entry = document.querySelector('#openAdvisor');
    if (entry) {
      const media = entry.querySelector('.advisor-entry__mark');
      if (media) ensureImage(media, '/assets/concept/prep-lever.webp', 'cfp-concept-entry-photo');
    }

    document.querySelectorAll('.message__avatar').forEach((avatar) => {
      ensureImage(avatar, '/brand/concept-official-logo.png', 'cfp-concept-chat-logo');
    });
  }

  const victoryPhotos = {
    home:'/assets/jolka/method/moka.webp',
    office:'/assets/jolka/method/both.webp',
    automatic:'/assets/jolka/method/automat.webp',
    discovery:'/assets/jolka/method/filter.webp',
    strong:'/assets/vitazov-brazil.jpeg',
    smooth:'/assets/kaffa/brew-espresso.webp',
    fruity:'/assets/vitazov-ethiopia.jpeg',
    decaf:'/assets/vitazov-decaf.jpeg',
    lever:'/assets/jolka/method/lever.webp',
    moka:'/assets/jolka/method/moka.webp',
    filter:'/assets/jolka/method/filter.webp',
    black:'/assets/jolka/method/black.webp',
    milk:'/assets/jolka/method/milk.webp',
    both:'/assets/jolka/method/both.webp'
  };

  function polishVictory() {
    if (slug !== 'vitazov') return;

    const brand = document.querySelector('.widget-brand');
    if (brand) ensureImage(brand, '/assets/vitazov-logo.svg', 'cfp-vitazov-header-logo', 'Káva Víťazov');

    const launcher = document.querySelector('#openWidget.launcher__button');
    if (launcher && !launcher.querySelector('.cfp-vitazov-launcher-logo')) {
      const img = makeImg('/assets/vitazov-logo.svg', 'cfp-vitazov-launcher-logo', '');
      const status = document.createElement('span');
      status.className = 'launcher__status';
      status.setAttribute('aria-hidden', 'true');
      launcher.replaceChildren(img, status);
    }

    document.querySelectorAll('.message__avatar').forEach((avatar) => {
      ensureImage(avatar, '/assets/vitazov-logo.svg', 'cfp-vitazov-chat-logo');
    });

    const entry = document.querySelector('#openAdvisor');
    if (entry) {
      const media = entry.firstElementChild;
      if (media) ensureImage(media, '/assets/vitazov-brazil.jpeg', 'cfp-vitazov-entry-photo');
      const title = entry.querySelector('b');
      const copy = entry.querySelector('em');
      if (title) title.textContent = 'Nájsť svoju kávu';
      if (copy) copy.textContent = '4 krátke otázky · jedno odporúčanie';
    }

    document.querySelectorAll('#advisorBody .option[data-value]').forEach((option) => {
      const src = victoryPhotos[option.dataset.value];
      const visual = option.querySelector('.option__photo');
      if (!src || !visual) return;
      ensureImage(visual, src, 'cfp-vitazov-photo');
    });
  }

  function polishDiamonds() {
    if (slug !== 'diamonds') return;
    const logo = document.querySelector('.widget-logo');
    if (logo) ensureImage(logo, '/assets/diamonds/diroastery-logo.svg', 'cfp-diamonds-header-logo', 'Diamonds Roastery');
    document.querySelectorAll('.chat-logo').forEach((avatar) => ensureImage(avatar, '/assets/diamonds/diroastery-logo.svg', 'cfp-diamonds-chat-logo'));
  }

  function polishJolka() {
    if (slug !== 'jolka') return;
    document.querySelector('.widget__note')?.remove();
  }

  function run() {
    polishPraziarnicka();
    polishJolka();
    polishKaffa();
    polishConcept();
    polishVictory();
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
  [100,300,700,1400].forEach((delay) => setTimeout(run, delay));
})();