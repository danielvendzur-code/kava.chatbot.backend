(() => {
  'use strict';

  const slug = String(
    window.COFFEE_DEMO_SLUG ||
    document.body.dataset.coffeeFinal ||
    document.body.dataset.coffeeRelease ||
    (location.pathname.includes('jolka') ? 'jolka' : '')
  ).replace('-v13', '');
  if (!['praziarnicka','jolka','kaffa','concept','vitazov','diamonds'].includes(slug)) return;

  document.documentElement.dataset.coffeeReleaseFinal = '2026-08-27-stable';

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

  const ensureOnlyImg = (host, src, className, alt = '') => {
    if (!(host instanceof HTMLElement)) return null;
    let img = host.querySelector(`:scope > img.${className}`);
    if (!img || host.children.length !== 1) {
      img = makeImg(src, className, alt);
      host.replaceChildren(img);
    } else if (img.getAttribute('src') !== src) {
      img.src = src;
    }
    return img;
  };

  function polishPraziarnicka() {
    if (slug !== 'praziarnicka') return;
    const entry = document.querySelector('#pz13-advisor-entry');
    if (!entry) return;
    const media = entry.firstElementChild;
    if (media) ensureOnlyImg(media, '/assets/jolka/method/lever.webp', 'cfr-praziarnicka-entry-photo');
    const title = entry.querySelector('b');
    const note = entry.querySelector('small');
    if (title) title.textContent = 'Nájsť svoju kávu';
    if (note) note.textContent = '4 otázky · jedno konkrétne odporúčanie';
  }

  function polishJolka() {
    if (slug !== 'jolka') return;
    document.querySelector('.widget__note')?.remove();
  }

  function polishKaffa() {
    if (slug !== 'kaffa') return;
    // Photo nodes are rendered by coffee-final-polish. Remove any legacy hidden
    // image duplicates so the audit and the user see one real image per card.
    document.querySelectorAll('.kf-option__visual').forEach((visual) => {
      const images = [...visual.querySelectorAll(':scope > img')];
      if (images.length <= 1) return;
      const keep = images.find((img) => img.classList.contains('cfp-option-photo')) || images.at(-1);
      images.forEach((img) => { if (img !== keep) img.remove(); });
    });
  }

  function polishConcept() {
    if (slug !== 'concept') return;
    const headerLogo = document.querySelector('.concept-widget-logo');
    if (headerLogo) {
      headerLogo.src = '/brand/concept-official-logo.png';
      headerLogo.alt = 'Concept Coffee Roasters';
    }

    document.querySelectorAll('.message__avatar').forEach((avatar) => {
      if (avatar.dataset.cfrLogo === 'concept') return;
      avatar.replaceChildren(makeImg('/brand/concept-official-logo.png', 'cfr-concept-chat-logo', ''));
      avatar.dataset.cfrLogo = 'concept';
    });

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
    if (brand && brand.dataset.cfrLogo !== 'vitazov') {
      brand.replaceChildren(makeImg('/assets/vitazov-logo.svg', 'cfr-vitazov-header-logo', 'Káva Víťazov'));
      brand.dataset.cfrLogo = 'vitazov';
    }

    const launcher = document.querySelector('#openWidget.launcher__button');
    if (launcher && launcher.dataset.cfrLogo !== 'vitazov') {
      const status = document.createElement('span');
      status.className = 'launcher__status';
      status.setAttribute('aria-hidden', 'true');
      launcher.replaceChildren(makeImg('/assets/vitazov-logo.svg', 'cfr-vitazov-launcher-logo', ''), status);
      launcher.dataset.cfrLogo = 'vitazov';
    }

    document.querySelectorAll('.message__avatar').forEach((avatar) => {
      if (avatar.dataset.cfrLogo === 'vitazov') return;
      avatar.replaceChildren(makeImg('/assets/vitazov-logo.svg', 'cfr-vitazov-avatar-logo', ''));
      avatar.dataset.cfrLogo = 'vitazov';
    });

    const entry = document.querySelector('#openAdvisor');
    if (entry) {
      const media = entry.firstElementChild;
      if (media && media.dataset.cfrPhoto !== 'vitazov') {
        media.replaceChildren(makeImg('/assets/vitazov-brazil.jpeg', 'cfr-vitazov-entry-photo', ''));
        media.dataset.cfrPhoto = 'vitazov';
      }
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
      if (!img || visual.querySelectorAll(':scope > img').length !== 1) {
        img = makeImg(src, 'cfr-vitazov-photo', '');
        visual.replaceChildren(img);
      } else if (img.getAttribute('src') !== src) {
        img.src = src;
      }
    });
  }

  function polishDiamonds() {
    if (slug !== 'diamonds') return;
    const header = document.querySelector('.widget-logo');
    if (header && header.dataset.cfrLogo !== 'diamonds') {
      header.replaceChildren(makeImg('/assets/diamonds/diroastery-logo.svg', 'cfr-diamonds-header-logo', 'Diamonds Roastery'));
      header.dataset.cfrLogo = 'diamonds';
    }
    document.querySelectorAll('.chat-logo').forEach((avatar) => {
      if (avatar.dataset.cfrLogo === 'diamonds') return;
      avatar.replaceChildren(makeImg('/assets/diamonds/diroastery-logo.svg', 'cfr-diamonds-chat-logo', ''));
      avatar.dataset.cfrLogo = 'diamonds';
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

  // Deterministic bounded reconciliation only. No global MutationObserver: the
  // old observers repeatedly replaced Concept/Victory nodes while Playwright
  // and real users were clicking them.
  document.addEventListener('click', () => {
    requestAnimationFrame(run);
    setTimeout(run, 90);
    setTimeout(run, 420);
  }, true);
  window.addEventListener('resize', run, { passive: true });

  run();
  [140, 480, 1100].forEach((delay) => setTimeout(run, delay));
})();