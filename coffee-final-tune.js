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

  const productionContact = 'https://mojchatbot.sk/kontakt';

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

  function setPraziarnickaPhoto(card) {
    const title = card.querySelector('.pz13-option__copy b')?.textContent?.trim();
    const mapping = praziarnickaPhotoMap.get(title);
    const visual = card.querySelector('.pz13-option__visual');
    if (!mapping || !visual) return;

    const [src, kind] = mapping;
    let img = visual.querySelector('.pz13-option__img');
    if (!img) {
      img = image(src, 'pz13-option__img cf-real-photo');
      visual.prepend(img);
    } else {
      img.src = src;
      img.classList.add('cf-real-photo');
    }
    img.alt = title || '';
    img.loading = 'lazy';
    visual.dataset.cfRealPhoto = title;
    visual.dataset.photoKind = kind;
  }

  function setDiamondsPhoto(card) {
    const title = card.querySelector('.answer-copy b')?.textContent?.trim();
    const mapping = diamondsPhotoMap.get(title);
    const visual = card.querySelector('.answer-photo');
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
      document.querySelectorAll('.pz13-option').forEach(setPraziarnickaPhoto);
      return;
    }
    if (slug === 'diamonds') {
      document.querySelectorAll('.answer-card').forEach(setDiamondsPhoto);
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
    const target = `${productionContact}?${params.toString()}`;
    document.querySelectorAll('a[href*="/kontakt"],a[data-coffee-prefill="true"]').forEach((link) => {
      if (!/mojchatbot/i.test(link.href)) return;
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

  function hideMobileTeasers() {
    const mobile = matchMedia('(max-width: 640px)').matches;
    document.querySelectorAll('[data-mcb-teaser="true"],.launcher__teaser,.launcher-teaser,.launcher-teaser,.teaser,.kf-teaser,.pz13-preview').forEach((node) => {
      if (!(node instanceof HTMLElement)) return;
      if (mobile) {
        node.dataset.cfMobileHidden = 'true';
        node.style.setProperty('display', 'none', 'important');
      } else if (node.dataset.cfMobileHidden === 'true') {
        node.style.removeProperty('display');
        delete node.dataset.cfMobileHidden;
      }
    });
  }

  function fallbackReply(text) {
    const q = text.toLocaleLowerCase('sk');
    if (/automat|kancel/.test(q)) return 'Do automatu sa zvyčajne hodí plnšia a menej kyslá káva. Vo Výbere kávy to spresníme podľa chuti a toho, či ju pijete s mliekom.';
    if (/odkia[ľl]|p[ôo]vod|krajin|pochádz|farma/.test(q)) return 'Pri každej káve je uvedená krajina pôvodu a spôsob spracovania. Napíšte mi, ktorá vás zaujíma, alebo prejdite Výber kávy a odporučím jednu podľa chuti.';
    if (/porovna|rozdiel|lep[šs]ia|ktor[áa] z|namiesto/.test(q)) return 'Rozdiel býva najmä v kyslosti, tele a v tom, či sa káva nestratí v mlieku. Napíšte mi, ktoré dve porovnať, alebo prejdite Výber kávy.';
    if (/mliek|capp|latte/.test(q)) return 'Do mliečnych nápojov sa hodí plnšia káva, ktorá sa v mlieku nestratí. Vo Výbere kávy ju vyberieme podľa vašej chuti.';
    if (/filter|v60|ovoc|sviež/.test(q)) return 'Na filter sa dá ísť jemnejším aj ovocnejším smerom. Vo Výbere kávy to zúžime podľa toho, akú chuť chcete v šálke.';
    if (/bez\s*kofe|decaf|večer/.test(q)) return 'Ak hľadáte kávu bez kofeínu, poradca vás nasmeruje na vhodnú voľbu z ponuky. Stačí povedať, ako ju pripravujete a akú chuť máte radi.';
    return 'Pomôžem vám vybrať. Ak chcete najjednoduchšiu cestu, prejdite Výber kávy — štyri krátke kroky vás dovedú ku konkrétnemu produktu.';
  }

  function installFastChatFallback() {
    if (window.__CF_FAST_CHAT_FALLBACK__) return;
    window.__CF_FAST_CHAT_FALLBACK__ = true;
    const upstream = window.fetch.bind(window);
    window.fetch = async (input, init) => {
      const url = typeof input === 'string' ? input : input?.url || '';
      if (!(url === '/api/chat' || url.endsWith('/api/chat'))) return upstream(input, init);

      let timer;
      try {
        return await Promise.race([
          upstream(input, init),
          new Promise((_, reject) => {
            timer = setTimeout(() => reject(new Error('coffee-fast-fallback')), 2600);
          })
        ]);
      } catch {
        let text = '';
        try {
          const payload = JSON.parse(init?.body || '{}');
          text = String(payload.messages?.filter((message) => message?.role === 'user').at(-1)?.content || '');
        } catch {}
        return new Response(JSON.stringify({ reply: fallbackReply(text), fallback: true }), {
          status: 200,
          headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' }
        });
      } finally {
        clearTimeout(timer);
      }
    };
  }

  function run() {
    document.body.dataset.coffeeFinal = slug;
    fixBrandAvatars();
    fixAdvisorPhotos();
    fixKaffaSeed();
    fixContactLinks();
    improveVitazovEntry();
    hideMobileTeasers();
  }

  installFastChatFallback();

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

  matchMedia('(max-width: 640px)').addEventListener?.('change', hideMobileTeasers);
  run();
  [120, 350, 800, 1600, 3000].forEach((delay) => setTimeout(run, delay));
})();
