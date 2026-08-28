(() => {
  'use strict';

  const slug = String(window.COFFEE_DEMO_SLUG || document.body.dataset.coffeeFinal || (location.pathname.includes('jolka') ? 'jolka' : '')).replace('-v13', '');
  if (!['praziarnicka','jolka','kaffa','concept','vitazov','diamonds'].includes(slug)) return;
  document.documentElement.dataset.coffeeFinalPolish = '2026-08-27-stable';

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

  function ensureOnlyImage(host, src, className, alt = '') {
    if (!(host instanceof HTMLElement)) return null;
    let img = host.querySelector(`:scope > img.${className}`);
    if (!img || host.children.length !== 1) {
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
    if (!entry) return;
    const media = entry.firstElementChild;
    if (media) ensureOnlyImage(media, '/assets/jolka/method/lever.webp', 'cfp-praziarnicka-entry-photo');
    const title = entry.querySelector('b');
    const copy = entry.querySelector('small');
    if (title) title.textContent = 'Nájsť svoju kávu';
    if (copy) copy.textContent = '4 otázky · jedno konkrétne odporúčanie';
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
      ensureOnlyImage(visual, src, 'cfp-option-photo');
    });
  }

  function polishConcept() {
    if (slug !== 'concept') return;
    const headerLogo = document.querySelector('.concept-widget-logo');
    if (headerLogo) {
      headerLogo.src = '/brand/concept-official-logo.png';
      headerLogo.alt = 'Concept Coffee Roasters';
    }
    const entry = document.querySelector('#openAdvisor .advisor-entry__mark');
    if (entry && !entry.querySelector('img')) {
      const img = makeImg('/assets/concept/prep-lever.webp', 'cfp-concept-entry-photo');
      entry.replaceChildren(img);
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

  function polishVictory() {
    if (slug !== 'vitazov') return;
    document.querySelectorAll('#advisorBody .option[data-value]').forEach((option) => {
      const src = victoryPhotos[option.dataset.value];
      const visual = option.querySelector('.option__photo');
      if (!src || !visual) return;
      ensureOnlyImage(visual, src, 'cfp-vitazov-photo');
    });
  }

  function polishDiamonds() {
    if (slug !== 'diamonds') return;
    const logo = document.querySelector('.widget-logo');
    if (logo && !logo.querySelector('img[src*="diroastery-logo"]')) ensureOnlyImage(logo, '/assets/diamonds/diroastery-logo.svg', 'cfp-diamonds-header-logo', 'Diamonds Roastery');
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

  // No global MutationObserver here. Earlier final layers used to observe and
  // replace the same brand nodes, creating a Concept/Victory DOM ping-pong.
  // Re-run only after real user interactions that can render a new advisor step.
  document.addEventListener('click', () => {
    requestAnimationFrame(run);
    setTimeout(run, 80);
    setTimeout(run, 380);
  }, true);
  window.addEventListener('resize', run, { passive: true });

  run();
  [120, 420, 1000].forEach((delay) => setTimeout(run, delay));
})();