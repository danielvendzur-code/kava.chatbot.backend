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
  document.documentElement.dataset.coffeeFinal = '2026-08-26-release-repair';

  const logo = {
    praziarnicka: '/brand/praziarnicka-logo-official.png',
    diamonds: '/assets/diamonds/diroastery-logo.svg',
    vitazov: '/assets/vitazov-logo.svg',
    concept: '/brand/concept-official-logo.png',
    jolka: '/assets/jolka/logo-badge.webp'
  };

  const company = {
    praziarnicka: { name: 'Pražiarnička', web: 'https://praziarnicka.sk/' },
    diamonds: { name: 'Diamonds Roastery', web: 'https://diroastery.sk/' },
    kaffa: { name: 'Kaffa Roastery', web: 'https://kaffaroastery.sk/' },
    vitazov: { name: 'Káva Víťazov', web: 'https://kavavitazov.sk/' },
    concept: { name: 'Concept Coffee Roasters', web: 'https://www.conceptcoffee.sk/' },
    jolka: { name: 'Pražiareň Jolka', web: 'https://www.praziarenjolka.sk/' }
  }[slug];

  const productionContact = 'https://mojchatbot.sk/kontakt';

  function image(src, className = 'cf-brand-logo', alt = '') {
    const img = document.createElement('img');
    img.src = src;
    img.alt = alt;
    img.decoding = 'async';
    img.draggable = false;
    img.className = className;
    return img;
  }

  function kaffaWordmark() {
    const mark = document.createElement('span');
    mark.className = 'kf-wordmark cf-avatar-wordmark';
    mark.setAttribute('aria-label', 'Kaffa Roastery');
    mark.innerHTML = '<strong>KAFFA</strong><small>speciality coffee beans</small>';
    return mark;
  }

  function replaceWithLogo(host, brandSlug = slug) {
    if (!host || host.dataset.cfLogo === brandSlug) return;
    if (brandSlug === 'kaffa') {
      host.replaceChildren(kaffaWordmark());
    } else {
      const src = logo[brandSlug];
      if (!src) return;
      host.replaceChildren(image(src, 'cf-brand-logo', ''));
    }
    host.dataset.cfLogo = brandSlug;
  }

  function fixWidgetBrandIdentity() {
    if (slug === 'kaffa') {
      const brand = document.querySelector('.kf-widget-brand');
      if (brand && brand.dataset.cfHeaderLogo !== 'true') {
        const online = document.createElement('span');
        online.className = 'cf-kaffa-online';
        online.innerHTML = '<i></i> Online poradca';
        brand.replaceChildren(kaffaWordmark(), online);
        brand.dataset.cfHeaderLogo = 'true';
      }
      return;
    }

    if (slug === 'vitazov') {
      const brand = document.querySelector('.widget-brand');
      if (brand && !brand.querySelector('.widget-brand__mark img[src*="vitazov-logo"]')) {
        const mark = document.createElement('span');
        mark.className = 'widget-brand__mark';
        mark.dataset.officialBrand = 'vitazov';
        mark.replaceChildren(image('/assets/vitazov-logo.svg', 'kv-widget-logo cf-brand-logo', 'Káva Víťazov'));
        brand.replaceChildren(mark);
      }
      return;
    }

    if (slug === 'concept') {
      document.querySelectorAll('.widget-brand__mark,.brand-mark').forEach((node) => replaceWithLogo(node, 'concept'));
      return;
    }

    if (slug === 'diamonds') {
      document.querySelectorAll('.widget-logo').forEach((node) => replaceWithLogo(node, 'diamonds'));
    }
  }

  function fixBrandAvatars() {
    if (slug === 'kaffa') {
      /* The advisor entry intentionally keeps the real preparation photo. Only
         actual chat avatars use the compact Kaffa wordmark. */
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
    ['Automat', ['/assets/praziarnicka/prep-automatic.webp', 'scene']],
    ['Pákový kávovar', ['/assets/praziarnicka/prep-lever.webp', 'scene']],
    ['Moka kanvička', ['/assets/praziarnicka/prep-moka.webp', 'scene']],
    ['Filter', ['/assets/praziarnicka/prep-filter.webp', 'scene']],
    ['Čokoláda a orechy', ['/assets/praziarnicka/official-paganini.jpg', 'product']],
    ['Sladká a vyvážená', ['/assets/praziarnicka/official-brazil.jpg', 'product']],
    ['Ovocná a svieža', ['/assets/praziarnicka/official-cuba.jpg', 'product']],
    ['Silná a výrazná', ['/assets/praziarnicka/official-puccini.jpg', 'product']],
    ['Čiernu', ['/assets/jolka/method/black.webp', 'scene']],
    ['S mliekom', ['/assets/jolka/method/milk.webp', 'scene']],
    ['Striedam oboje', ['/assets/jolka/method/both.webp', 'scene']],
    ['Podľa nálady', ['/assets/jolka/method/filter.webp', 'scene']],
    ['Počas dňa', ['/assets/praziarnicka/official-brazil.jpg', 'product']],
    ['Aj večer', ['/assets/praziarnicka/official-bezkofeinova.jpg', 'product']],
    ['Je mi to jedno', ['/assets/praziarnicka/official-cuba.jpg', 'product']],
    ['Chcem povzbudenie', ['/assets/praziarnicka/official-puccini.jpg', 'product']]
  ]);

  const diamondsPhotoMap = new Map([
    ['Automat', ['/assets/jolka/method/automat.webp', 'scene']],
    ['Espresso', ['/assets/jolka/method/lever.webp', 'scene']],
    ['Filter', ['/assets/jolka/method/filter.webp', 'scene']],
    ['Moka', ['/assets/jolka/method/moka.webp', 'scene']],
    ['Sladká a čokoládová', ['/assets/diamonds/brazil-fazenda-official.jpg', 'product']],
    ['Vyvážená', ['/assets/diamonds/kumanday-official.jpg', 'product']],
    ['Ovocná a svieža', ['/assets/diamonds/kenya-mugaya-official.jpg', 'product']],
    ['Čiernu', ['/assets/jolka/method/black.webp', 'scene']],
    ['S mliekom', ['/assets/jolka/method/milk.webp', 'scene']],
    ['Oboje', ['/assets/jolka/method/both.webp', 'scene']],
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
      img = image(src, 'pz13-option__img cf-real-photo', title || '');
      visual.prepend(img);
    } else if (img.getAttribute('src') !== src) {
      img.src = src;
    }
    img.classList.add('cf-real-photo');
    img.alt = title || '';
    img.loading = 'lazy';
    visual.dataset.cfRealPhoto = title || '';
    visual.dataset.photoKind = kind;
  }

  function setDiamondsPhoto(card) {
    const title = card.querySelector('.answer-copy b')?.textContent?.trim();
    const mapping = diamondsPhotoMap.get(title);
    const visual = card.querySelector('.answer-photo');
    if (!mapping || !visual) return;
    const [src, kind] = mapping;
    let img = visual.querySelector('.cf-real-photo');
    if (!img) {
      img = image(src, 'cf-real-photo', title || '');
      visual.replaceChildren(img);
    } else if (img.getAttribute('src') !== src) {
      img.src = src;
    }
    img.alt = title || '';
    img.loading = 'lazy';
    visual.dataset.cfRealPhoto = title || '';
    visual.dataset.photoKind = kind;
  }

  function fixAdvisorPhotos() {
    if (slug === 'praziarnicka') {
      document.querySelectorAll('.pz13-option').forEach(setPraziarnickaPhoto);
    } else if (slug === 'diamonds') {
      document.querySelectorAll('.answer-card').forEach(setDiamondsPhoto);
    }
  }

  const vitazovContextPhotos = {
    home: '/assets/jolka/method/lever.webp',
    office: '/assets/jolka/method/both.webp',
    automatic: '/assets/jolka/method/automat.webp',
    discovery: '/assets/jolka/method/filter.webp'
  };

  function fixVitazovContextPhotos() {
    if (slug !== 'vitazov') return;
    const stepName = document.querySelector('#stepName')?.textContent?.trim();
    if (stepName !== 'Použitie') return;
    document.querySelectorAll('#advisorBody .option[data-value]').forEach((option) => {
      const visual = option.querySelector('.option__photo');
      const src = vitazovContextPhotos[option.dataset.value];
      if (!visual || !src) return;
      let img = visual.querySelector('.cf-context-photo');
      if (!img) {
        img = image(src, 'cf-context-photo', '');
        visual.prepend(img);
      } else if (img.getAttribute('src') !== src) {
        img.src = src;
      }
    });

    const entryMark = document.querySelector('#openAdvisor > span:first-child');
    if (entryMark && entryMark.dataset.cfContextPhoto !== 'true') {
      entryMark.replaceChildren(image('/assets/jolka/method/automat.webp', 'cf-context-photo', ''));
      entryMark.dataset.cfContextPhoto = 'true';
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

  function normalizeTeaserAndLauncher() {
    const teaserSelectors = {
      diamonds: '.teaser',
      kaffa: '.kf-teaser',
      vitazov: '.launcher__teaser',
      concept: '.launcher__teaser',
      praziarnicka: '.pz13-preview',
      jolka: '.launcher__teaser'
    };
    const teaser = document.querySelector(teaserSelectors[slug]);
    if (!teaser) return;

    /* A past generic pass injected a second close button into brand teasers.
       Keep the brand-native close control and delete only duplicates. */
    const preferred = teaser.querySelector('#teaserClose,#closeTeaser,#pz13-preview-close,.kf-teaser-close,.launcher__teaser-close');
    teaser.querySelectorAll('button').forEach((button) => {
      const looksLikeClose = /close|zavrie|skry/i.test(`${button.id} ${button.className} ${button.getAttribute('aria-label') || ''}`);
      if (looksLikeClose && preferred && button !== preferred) button.remove();
    });

    if (slug === 'diamonds') {
      const title = teaser.querySelector('strong,b');
      const copy = teaser.querySelector('span');
      if (title) title.textContent = 'Nájdite svoju kávu';
      if (copy) copy.textContent = '4 otázky · jedno odporúčanie';

      const launcher = document.querySelector('#launcherButton');
      if (launcher && launcher.dataset.cfLauncherLogo !== 'true') {
        const status = document.createElement('i');
        status.setAttribute('aria-hidden', 'true');
        launcher.replaceChildren(image('/assets/diamonds/diroastery-logo.svg', 'cf-brand-logo', ''), status);
        launcher.dataset.cfLauncherLogo = 'true';
      }
    }
  }

  function publicDemoHref() {
    const fromHost = new URLSearchParams(location.search).get('public');
    if (fromHost) {
      try {
        const url = new URL(fromHost);
        if (url.protocol === 'https:' && url.hostname === 'mojchatbot.sk') return url.toString();
      } catch {}
    }
    return location.href;
  }

  function contactTarget() {
    const params = new URLSearchParams({
      source: `coffee-demo-${slug}`,
      company: company.name,
      web: company.web,
      demo: publicDemoHref()
    });
    return `${productionContact}?${params.toString()}`;
  }

  function fixContactLinks() {
    const target = contactTarget();
    const owner = document.querySelector('[data-mcb-page="true"]');
    const links = new Set([
      ...document.querySelectorAll('a[href*="/kontakt"],a[data-coffee-prefill="true"]'),
      ...(owner ? owner.querySelectorAll('.mcb-head a.mcb-btn,.mcb-pricing-side a.mcb-btn') : [])
    ]);
    links.forEach((link) => {
      if (!(link instanceof HTMLAnchorElement)) return;
      link.href = target;
      link.dataset.coffeePrefill = 'true';
    });

    if (!owner || owner.querySelector('a[href*="mojchatbot.sk/kontakt"]')) return;
    const head = owner.querySelector('.mcb-head');
    const existing = head?.querySelector('.mcb-btn');
    if (!head || !existing) return;
    const anchor = document.createElement('a');
    anchor.className = existing.className;
    anchor.href = target;
    anchor.target = '_blank';
    anchor.rel = 'noreferrer';
    anchor.dataset.coffeePrefill = 'true';
    anchor.innerHTML = existing.innerHTML;
    existing.replaceWith(anchor);
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
    document.querySelectorAll('[data-mcb-teaser="true"],.launcher__teaser,.launcher-teaser,.teaser,.kf-teaser,.pz13-preview').forEach((node) => {
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
      const rawUrl = typeof input === 'string' ? input : input?.url || '';
      let pathname = rawUrl;
      try { pathname = new URL(rawUrl, location.href).pathname; } catch {}
      if (pathname !== '/api/chat') return upstream(input, init);

      let timer;
      try {
        return await Promise.race([
          upstream(input, init),
          new Promise((_, reject) => {
            timer = setTimeout(() => reject(new Error('coffee-fast-fallback')), 1600);
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

  function installStepMotion() {
    if (slug === 'jolka' || document.documentElement.dataset.cfStepMotion === 'true') return;
    document.documentElement.dataset.cfStepMotion = 'true';
    const optionSelector = '.kf-option,.option,.answer-card,.pz13-option';
    document.addEventListener('click', (event) => {
      const button = event.target.closest(optionSelector);
      if (!button || button.disabled) return;
      const container = button.closest('.kf-stage,#advisorBody,#advisorContent,.advisor,.pz13-advisor');
      if (!container || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      setTimeout(() => container.classList.add('cf-step-leaving'), 150);
      setTimeout(() => container.classList.remove('cf-step-leaving'), 275);
    }, true);
  }

  /* The source chats already keep their messages in state. What looked like
     deletion was the scroll position jumping all the way to a newly appended
     typing row. While a reply is pending, keep the last real exchange visible
     above the indicator instead of presenting an apparently empty chat. */
  function installConversationContextGuard() {
    if (document.documentElement.dataset.cfConversationGuard === 'true') return;
    document.documentElement.dataset.cfConversationGuard = 'true';

    const selectors = '#chatMessages,.kf-messages,.pz13-chat__messages,#chat';
    const guarded = new WeakSet();

    const guard = (container) => {
      if (!(container instanceof HTMLElement) || guarded.has(container)) return;
      guarded.add(container);
      const observer = new MutationObserver(() => {
        const typing = container.querySelector('#typingRow,#typing,.typing');
        const pendingText = [...container.children].at(-1)?.textContent?.trim() === 'Premýšľam…';
        if (!typing && !pendingText) return;
        requestAnimationFrame(() => {
          const rows = [...container.children].filter((node) => node instanceof HTMLElement && node.getClientRects().length);
          if (rows.length < 2) return;
          const anchor = rows[Math.max(0, rows.length - 3)];
          const top = Math.max(0, anchor.offsetTop - 8);
          container.scrollTop = Math.min(top, Math.max(0, container.scrollHeight - container.clientHeight));
        });
      });
      observer.observe(container, { childList: true, subtree: true });
    };

    document.querySelectorAll(selectors).forEach(guard);
    const rootObserver = new MutationObserver(() => document.querySelectorAll(selectors).forEach(guard));
    rootObserver.observe(document.body, { childList: true, subtree: true });
  }

  function run() {
    document.body.dataset.coffeeFinal = slug;
    fixWidgetBrandIdentity();
    fixBrandAvatars();
    fixAdvisorPhotos();
    fixVitazovContextPhotos();
    fixKaffaSeed();
    normalizeTeaserAndLauncher();
    fixContactLinks();
    improveVitazovEntry();
    hideMobileTeasers();
  }

  installFastChatFallback();
  installStepMotion();
  installConversationContextGuard();

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
