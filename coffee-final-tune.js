(() => {
  'use strict';

  const raw = String(
    window.COFFEE_DEMO_SLUG ||
    window.__COFFEE_DEMO_SLUG__ ||
    document.body.dataset.coffeeRelease ||
    document.body.dataset.demo ||
    (location.pathname.includes('jolka') ? 'jolka' : '')
  );
  const slug = raw.replace('-v13', '');
  const valid = new Set(['praziarnicka', 'diamonds', 'kaffa', 'vitazov', 'concept', 'jolka']);
  if (!valid.has(slug)) return;

  document.body.dataset.coffeeFinal = slug;
  document.documentElement.dataset.coffeeFinal = '2026-08-26';

  const logo = {
    praziarnicka: '/brand/praziarnicka-icon-official.svg',
    diamonds: '/assets/diamonds/diroastery-logo.svg',
    vitazov: '/assets/vitazov-logo.svg',
    concept: '/brand/concept-official-logo.png',
    jolka: '/assets/jolka/logo-badge.webp'
  };

  const company = {
    praziarnicka: { name: 'Pražiarnička', web: 'https://praziarnicka.sk/' },
    diamonds: { name: 'Diamonds Roastery', web: 'https://diroastery.sk/' },
    kaffa: { name: 'Kaffa Roastery', web: 'https://kaffaroastery.sk/' },
    vitazov: { name: 'Káva Víťazov', web: 'https://www.kavavitazov.sk/' },
    concept: { name: 'Concept Coffee Roasters', web: 'https://www.conceptcoffee.sk/' },
    jolka: { name: 'Pražiareň Jolka', web: 'https://www.praziarenjolka.sk/' }
  }[slug];

  const previewContact = 'https://vne-n-git-agent-coffee-demo-6cbc05-danielvendzur-codes-projects.vercel.app/kontakt';
  const productionContact = 'https://mojchatbot.sk/kontakt';
  const isPreview = /(?:^|\.)vercel\.app$/i.test(location.hostname) || /^(?:localhost|127\.0\.0\.1)$/i.test(location.hostname);

  function image(src, className = 'cf-brand-logo') {
    const img = document.createElement('img');
    img.src = src;
    img.alt = '';
    img.decoding = 'async';
    img.draggable = false;
    img.className = className;
    return img;
  }

  function replaceWithLogo(host, brandSlug = slug) {
    if (!host || host.dataset.cfLogo === brandSlug) return;
    if (brandSlug === 'kaffa') {
      const source = document.querySelector('.kf-widget-brand .kf-wordmark, .kf-panel-head .kf-wordmark, .kf-brand .kf-wordmark');
      if (!source) return;
      const clone = source.cloneNode(true);
      clone.classList.add('cf-avatar-wordmark');
      host.replaceChildren(clone);
    } else {
      const src = logo[brandSlug];
      if (!src) return;
      host.replaceChildren(image(src));
    }
    host.dataset.cfLogo = brandSlug;
  }

  function fixBrandAvatars() {
    if (slug === 'kaffa') {
      document.querySelectorAll('.kf-bot-avatar').forEach((node) => replaceWithLogo(node, 'kaffa'));
      return;
    }
    if (slug === 'concept' || slug === 'vitazov') {
      document.querySelectorAll('.message__avatar').forEach((node) => replaceWithLogo(node, slug));
      return;
    }
    if (slug === 'diamonds') {
      document.querySelectorAll('.chat-logo').forEach((node) => replaceWithLogo(node, 'diamonds'));
    }
  }

  const praziarnickaPhotoMap = new Map([
    ['Automat', ['/assets/kaffa/prep-automatic.webp', 'scene']],
    ['Pákový kávovar', ['/assets/kaffa/prep-espresso.webp', 'scene']],
    ['Moka kanvička', ['/assets/kaffa/prep-moka.webp', 'scene']],
    ['Filter', ['/assets/kaffa/prep-filter.webp', 'scene']],
    ['Čokoláda a orechy', ['/assets/praziarnicka/official-paganini.jpg', 'product']],
    ['Sladká a vyvážená', ['/assets/praziarnicka/official-brazil.jpg', 'product']],
    ['Ovocná a svieža', ['/assets/praziarnicka/official-cuba.jpg', 'product']],
    ['Silná a výrazná', ['/assets/praziarnicka/official-puccini.jpg', 'product']],
    ['Čiernu', ['/assets/kaffa/brew-filter.webp', 'scene']],
    ['S mliekom', ['/assets/kaffa/brew-espresso.webp', 'scene']],
    ['Striedam oboje', ['/assets/concept/prep-automatic.webp', 'scene']],
    ['Podľa nálady', ['/assets/concept/prep-moka.webp', 'scene']],
    ['Počas dňa', ['/assets/praziarnicka/official-brazil.jpg', 'product']],
    ['Aj večer', ['/assets/praziarnicka/official-bezkofeinova.jpg', 'product']],
    ['Je mi to jedno', ['/assets/praziarnicka/official-cuba.jpg', 'product']],
    ['Chcem povzbudenie', ['/assets/praziarnicka/official-puccini.jpg', 'product']]
  ]);

  const diamondsPhotoMap = new Map([
    ['Automat', ['/assets/kaffa/prep-automatic.webp', 'scene']],
    ['Espresso', ['/assets/kaffa/prep-espresso.webp', 'scene']],
    ['Filter', ['/assets/kaffa/prep-filter.webp', 'scene']],
    ['Moka', ['/assets/kaffa/prep-moka.webp', 'scene']],
    ['Sladká a čokoládová', ['/assets/diamonds/brazil-fazenda-official.jpg', 'product']],
    ['Vyvážená', ['/assets/diamonds/kumanday-official.jpg', 'product']],
    ['Ovocná a svieža', ['/assets/diamonds/kenya-mugaya-official.jpg', 'product']],
    ['Čiernu', ['/assets/diamonds/kenya-mugaya.webp', 'scene']],
    ['S mliekom', ['/assets/diamonds/brazil-fazenda.webp', 'scene']],
    ['Oboje', ['/assets/diamonds/kumanday.webp', 'scene']],
    ['Počas dňa', ['/assets/diamonds/kumanday-official.jpg', 'product']],
    ['Aj večer', ['/assets/diamonds/el-buho-official.jpg', 'product']]
  ]);

  function setCardPhoto(card, visualSelector, copySelector, photoMap) {
    const title = card.querySelector(copySelector)?.textContent?.trim();
    const mapping = photoMap.get(title);
    const visual = card.querySelector(visualSelector);
    if (!mapping || !visual || visual.dataset.cfRealPhoto === title) return;
    const [src, kind] = mapping;
    const img = image(src, 'cf-real-photo');
    img.alt = title || '';
    img.loading = 'lazy';
    visual.replaceChildren(img);
    visual.dataset.cfRealPhoto = title;
    visual.dataset.photoKind = kind;
  }

  function fixAdvisorPhotos() {
    if (slug === 'praziarnicka') {
      document.querySelectorAll('.pz13-option').forEach((card) => setCardPhoto(card, '.pz13-option__visual', '.pz13-option__copy b', praziarnickaPhotoMap));
      return;
    }
    if (slug === 'diamonds') {
      document.querySelectorAll('.answer-card').forEach((card) => setCardPhoto(card, '.answer-photo', '.answer-copy b', diamondsPhotoMap));
    }
  }

  function fixKaffaSeed() {
    if (slug !== 'kaffa') return;
    const seed = document.querySelector('.kf-chat-seed');
    if (!seed) return;
    const entry = seed.querySelector('.kf-advisor-entry');
    const greeting = seed.querySelector('.kf-message-row');
    if (entry && seed.firstElementChild !== entry) seed.prepend(entry);
    if (entry && greeting && entry.nextElementSibling !== greeting) entry.after(greeting);
  }

  function fixContactLinks() {
    const params = new URLSearchParams({
      source: `coffee-demo-${slug}`,
      company: company.name,
      web: company.web,
      demo: location.href
    });
    const target = `${isPreview ? previewContact : productionContact}?${params.toString()}`;
    document.querySelectorAll('a[href*="/kontakt"],a[data-coffee-prefill="true"]').forEach((link) => {
      if (!/mojchatbot|vercel\.app/i.test(link.href)) return;
      link.href = target;
      link.dataset.coffeePrefill = 'true';
    });
  }

  function improveVitazovEntry() {
    if (slug !== 'vitazov') return;
    const entry = document.querySelector('#openAdvisor');
    if (!entry) return;
    const title = entry.querySelector('b');
    const note = entry.querySelector('em');
    if (title) title.textContent = 'Nájsť svoju kávu';
    if (note) note.textContent = '4 krátke otázky · jedno odporúčanie';
  }

  function run() {
    document.body.dataset.coffeeFinal = slug;
    fixBrandAvatars();
    fixAdvisorPhotos();
    fixKaffaSeed();
    fixContactLinks();
    improveVitazovEntry();
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
  [120, 350, 800, 1600, 3000].forEach((delay) => setTimeout(run, delay));
})();
