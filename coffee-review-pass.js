(() => {
  'use strict';

  const valid = new Set(['praziarnicka', 'diamonds', 'kaffa', 'vitazov', 'concept', 'jolka']);
  const rawSlug = String(
    window.__COFFEE_DEMO_SLUG__ ||
    window.COFFEE_DEMO_SLUG ||
    document.body.dataset.coffeeRelease ||
    document.body.dataset.demo ||
    (location.pathname.includes('jolka') ? 'jolka' : '')
  );
  const slug = rawSlug.replace('-v13', '');
  if (!valid.has(slug)) return;

  document.documentElement.dataset.coffeeReviewPass = '2026-08-25-r3';
  document.body.dataset.coffeeReviewPass = slug;
  document.documentElement.dataset.jolkaParity = 'ready';

  const BRAND_CONTACT = {
    praziarnicka: { name: 'Pražiarnička', web: 'https://praziarnicka.sk/eshop' },
    diamonds: { name: 'Diamonds Roastery', web: 'https://diroastery.sk/kategoria-produktu/kava/' },
    kaffa: { name: 'Kaffa Roastery', web: 'https://kaffaroastery.sk/' },
    vitazov: { name: 'Káva Víťazov', web: 'https://kavavitazov.sk/obchod/' },
    concept: { name: 'Concept Coffee Roasters', web: 'https://www.conceptcoffee.sk/' },
    jolka: { name: 'Pražiareň Jolka', web: 'https://www.praziarenjolka.sk/eshop-kava/' }
  };

  const OFFICIAL_MARKS = {
    diamonds: '/assets/diamonds/diroastery-logo.svg',
    vitazov: '/assets/vitazov-logo.svg',
    concept: '/brand/concept-official-logo.png'
  };

  const LAUNCHERS = {
    diamonds: '#launcherButton',
    vitazov: '#openWidget',
    concept: '#openWidget'
  };

  const VITAZOV_HEADER_MARK = '.widget-brand__mark';
  const PREVIEW_CONTACT = 'https://vne-n-git-agent-coffee-demo-6cbc05-danielvendzur-codes-projects.vercel.app/kontakt';
  const PRODUCTION_CONTACT = 'https://mojchatbot.sk/kontakt';

  function isPreviewHost() {
    return /(?:^|\.)vercel\.app$/i.test(location.hostname) || location.hostname === 'localhost' || location.hostname === '127.0.0.1';
  }

  function personalisedContactHref() {
    const published = window.__MCB_BRAND__ || {};
    const fallback = BRAND_CONTACT[slug];
    const existing = document.querySelector('.mcb-btn[href*="/kontakt"], .mc-owner-contact[href*="/kontakt"]');
    let params = new URLSearchParams();

    if (existing) {
      try { params = new URL(existing.href, location.href).searchParams; } catch (_) {}
    }

    params.set('source', `coffee-demo-${slug}`);
    params.set('company', published.name || fallback.name);
    params.set('web', published.shop || fallback.web);
    params.set('demo', location.href);

    return `${isPreviewHost() ? PREVIEW_CONTACT : PRODUCTION_CONTACT}?${params.toString()}`;
  }

  function rewriteContactLinks() {
    const href = personalisedContactHref();
    document.querySelectorAll(
      '.mcb-btn[href*="/kontakt"], .mc-owner-contact[href*="/kontakt"], .mc-owner-foot a[href*="/kontakt"]'
    ).forEach((link) => {
      if (link.href !== href) link.href = href;
      link.dataset.coffeePrefill = 'true';
    });
  }

  function setPublishedBrandMark() {
    const src = OFFICIAL_MARKS[slug];
    const brand = window.__MCB_BRAND__;
    if (!src || !brand) return;
    brand.mark = { src };
  }

  function officialImage(src, className) {
    const image = document.createElement('img');
    image.src = src;
    image.alt = '';
    image.decoding = 'async';
    image.className = className;
    image.draggable = false;
    return image;
  }

  function replaceLauncherMark() {
    const src = OFFICIAL_MARKS[slug];
    const selector = LAUNCHERS[slug];
    if (!src || !selector) return;
    const button = document.querySelector(selector);
    if (!button) return;

    button.classList.add('mcb-w-launcher', 'coffee-official-launcher');
    button.dataset.officialBrand = slug;
    button.removeAttribute('data-mcw-mark');

    // Some brand runtimes place their own lockup span directly in the button.
    // Remove it before checking our injected image; otherwise Diamonds ended up
    // with the original lockup plus the review-pass image stacked in one circle.
    button.querySelectorAll(':scope > .brand-lockup, :scope > .launcher-logo, :scope > .launcher__chat-mark, :scope > .advisor-logo')
      .forEach((node) => node.remove());

    const current = button.querySelector(':scope > img.coffee-official-launcher__logo');
    if (current?.getAttribute('src') === src) return;

    button.querySelectorAll(':scope > svg').forEach((node) => node.remove());
    button.querySelectorAll(':scope > img').forEach((node) => node.remove());
    button.prepend(officialImage(src, 'coffee-official-launcher__logo'));
  }

  function replaceVitazovHeaderMark() {
    if (slug !== 'vitazov') return;
    const host = document.querySelector(VITAZOV_HEADER_MARK);
    if (!host || host.dataset.officialBrand === 'vitazov') return;
    host.textContent = '';
    host.appendChild(officialImage(OFFICIAL_MARKS.vitazov, 'coffee-official-header-logo'));
    host.dataset.officialBrand = 'vitazov';
  }

  function markExistingOfficialHeaders() {
    if (slug === 'concept') {
      document.querySelector('.concept-widget-logo')?.classList.add('coffee-official-header-logo');
    }
    if (slug === 'diamonds') {
      document.querySelectorAll('.widget-logo img, .brand-lockup.widget-logo img').forEach((image) => image.classList.add('coffee-official-header-logo'));
    }
  }

  function keepGreetingAtTop() {
    const selectors = {
      diamonds: '#chatMessages',
      kaffa: '#kf-messages, .kf-messages',
      vitazov: '#chatMessages',
      concept: '#chatMessages',
      jolka: '#chat'
    };
    const selector = selectors[slug];
    if (!selector) return;
    const host = document.querySelector(selector);
    if (host) host.dataset.greetingTop = 'true';
  }

  function refineOwnerCopy() {
    const lead = document.querySelector('[data-mcb-page="true"] .mcb-lead');
    if (!lead) return;
    const copy = 'Zákazníci často nevedia, aké kávy máte a ktorá im sadne. Chat odpovie na pôvod, chuť, prípravu aj konkrétne produkty. Keď si stále nevedia vybrať, štyri krátke otázky ich dovedú k jednej odporúčanej káve aj s dôvodom.';
    if (lead.textContent !== copy) lead.textContent = copy;
  }

  function removeFakeThinkingState() {
    document.querySelectorAll('.mcw-thinking').forEach((result) => result.classList.remove('mcw-thinking'));
    document.querySelectorAll('.mcw-thinking-note').forEach((note) => note.remove());
  }

  function improveAdvisorEntryCopy() {
    const entry = document.querySelector('#openAdvisor, #kf-advisor-entry, .kf-advisor-entry, #entry');
    if (!entry) return;
    entry.dataset.reviewEntry = 'true';

    if (slug === 'vitazov') {
      const title = entry.querySelector('b');
      const note = entry.querySelector('em, small, .entry__copy span');
      if (title) title.textContent = 'Nájsť svoju kávu';
      if (note) note.textContent = '4 krátke otázky · konkrétne odporúčanie';
      entry.style.setProperty('height', '68px', 'important');
      entry.style.setProperty('min-height', '68px', 'important');
    }
  }

  function protectOwnerMobileCta() {
    const root = document.querySelector('[data-mcb-page="true"]');
    if (!root) return;
    const cta = root.querySelector('.mcb-pricing-side .mcb-btn');
    if (!cta) return;
    if (matchMedia('(max-width: 640px)').matches) {
      cta.style.setProperty('width', 'calc(100% - 78px)', 'important');
      cta.style.setProperty('max-width', 'calc(100% - 78px)', 'important');
      cta.style.setProperty('justify-self', 'start', 'important');
    } else {
      cta.style.removeProperty('width');
      cta.style.removeProperty('max-width');
      cta.style.removeProperty('justify-self');
    }
  }

  function run() {
    setPublishedBrandMark();
    rewriteContactLinks();
    replaceLauncherMark();
    replaceVitazovHeaderMark();
    markExistingOfficialHeaders();
    keepGreetingAtTop();
    refineOwnerCopy();
    removeFakeThinkingState();
    improveAdvisorEntryCopy();
    protectOwnerMobileCta();
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

  observer.observe(document.documentElement, { childList: true, subtree: true });
  addEventListener('resize', protectOwnerMobileCta, { passive: true });
  run();
  [180, 650, 1500, 3000].forEach((delay) => setTimeout(run, delay));
})();