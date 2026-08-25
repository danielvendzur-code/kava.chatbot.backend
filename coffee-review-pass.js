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

  document.documentElement.dataset.coffeeReviewPass = '2026-08-25';
  document.body.dataset.coffeeReviewPass = slug;

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
    const brand = window.__MCB_BRAND__ || {};
    const existing = document.querySelector('.mcb-btn[href*="/kontakt"], .mc-owner-contact[href*="/kontakt"]');
    let params = new URLSearchParams();

    if (existing) {
      try { params = new URL(existing.href, location.href).searchParams; } catch (_) {}
    }

    if (!params.get('source')) params.set('source', `coffee-demo-${slug}`);
    if (!params.get('company') && brand.name) params.set('company', brand.name);
    if (!params.get('web') && brand.shop) params.set('web', brand.shop);
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

    const current = button.querySelector(':scope > img.coffee-official-launcher__logo');
    if (current?.getAttribute('src') === src) return;

    button.querySelectorAll(':scope > .launcher__chat-mark, :scope > .advisor-logo').forEach((node) => node.remove());
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
    const host = document.querySelector(selectors[slug] || '');
    if (host) host.dataset.greetingTop = 'true';
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
    }
  }

  function run() {
    setPublishedBrandMark();
    rewriteContactLinks();
    replaceLauncherMark();
    replaceVitazovHeaderMark();
    markExistingOfficialHeaders();
    keepGreetingAtTop();
    improveAdvisorEntryCopy();
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
  run();
  [180, 650, 1500, 3000].forEach((delay) => setTimeout(run, delay));
})();
