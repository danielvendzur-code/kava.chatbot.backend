(() => {
  'use strict';

  const raw = String(
    window.COFFEE_DEMO_SLUG ||
    window.__COFFEE_DEMO_SLUG__ ||
    document.body?.dataset.coffeeRelease ||
    document.body?.dataset.demo ||
    (location.pathname.includes('jolka') ? 'jolka' : '')
  );
  const slug = raw.replace('-v13', '');
  const valid = new Set(['praziarnicka', 'diamonds', 'kaffa', 'vitazov', 'concept', 'jolka']);
  if (!valid.has(slug) || !document.body) return;

  const company = {
    praziarnicka: { name: 'Pražiarnička', web: 'https://praziarnicka.sk/' },
    diamonds: { name: 'Diamonds Roastery', web: 'https://diroastery.sk/' },
    kaffa: { name: 'Kaffa Roastery', web: 'https://kaffaroastery.sk/' },
    vitazov: { name: 'Káva Víťazov', web: 'https://kavavitazov.sk/' },
    concept: { name: 'Concept Coffee Roasters', web: 'https://www.conceptcoffee.sk/' },
    jolka: { name: 'Pražiareň Jolka', web: 'https://www.praziarenjolka.sk/' }
  }[slug];

  const logo = {
    praziarnicka: '/brand/praziarnicka-logo-official.png',
    diamonds: '/assets/diamonds/diroastery-logo.svg',
    vitazov: '/assets/vitazov-logo.svg',
    concept: '/brand/concept-official-logo.png',
    jolka: '/assets/jolka/logo-badge.webp'
  };

  const createImage = (src, className = '', alt = '') => {
    const img = document.createElement('img');
    img.src = src;
    img.alt = alt;
    img.className = className;
    img.decoding = 'async';
    img.draggable = false;
    return img;
  };

  function kaffaWordmark() {
    const mark = document.createElement('span');
    mark.className = 'kf-wordmark cf-avatar-wordmark';
    mark.setAttribute('aria-label', 'Kaffa Roastery');
    mark.innerHTML = '<strong>KAFFA</strong><small>speciality coffee beans</small>';
    return mark;
  }

  function replaceWithBrand(host, brandSlug = slug) {
    if (!host || host.dataset.craBrand === brandSlug) return;
    if (brandSlug === 'kaffa') {
      host.replaceChildren(kaffaWordmark());
    } else if (logo[brandSlug]) {
      host.replaceChildren(createImage(logo[brandSlug], 'cf-brand-logo', brandSlug === 'vitazov' ? 'Káva Víťazov' : ''));
    }
    host.dataset.craBrand = brandSlug;
  }

  function setOwnerPrice() {
    document.querySelectorAll('.mcb-plan-price').forEach((row) => {
      const setup = row.querySelector('strong:first-child');
      if (!setup) return;
      if (setup.textContent.replace(/\s+/g, ' ').trim() !== '247 €') setup.textContent = '247 €';
      setup.dataset.releasePrice = 'true';
    });
  }

  function publicDemoHref() {
    const supplied = new URLSearchParams(location.search).get('public');
    if (supplied) {
      try {
        const url = new URL(supplied);
        if (url.protocol === 'https:' && url.hostname === 'mojchatbot.sk') return url.toString();
      } catch {}
    }
    return location.href;
  }

  function fixContactLinks() {
    const target = `https://mojchatbot.sk/kontakt?${new URLSearchParams({
      source: `coffee-demo-${slug}`,
      company: company.name,
      web: company.web,
      demo: publicDemoHref()
    }).toString()}`;

    document.querySelectorAll('a[href*="mojchatbot.sk/kontakt"],a[data-coffee-prefill="true"]').forEach((link) => {
      if (!(link instanceof HTMLAnchorElement)) return;
      link.href = target;
      link.dataset.coffeePrefill = 'true';
    });
  }

  function fixWidgetBrandIdentity() {
    if (slug === 'kaffa') {
      const brand = document.querySelector('.kf-widget-brand');
      if (brand && brand.dataset.craHeader !== 'true') {
        const online = document.createElement('span');
        online.className = 'cf-kaffa-online';
        online.innerHTML = '<i></i> Online poradca';
        brand.replaceChildren(kaffaWordmark(), online);
        brand.dataset.craHeader = 'true';
      }
      return;
    }

    if (slug === 'vitazov') {
      const brand = document.querySelector('.widget-brand');
      if (!brand) return;
      let mark = brand.querySelector('.widget-brand__mark');
      let img = brand.querySelector('img[src*="vitazov-logo"]');
      if (!img) img = createImage('/assets/vitazov-logo.svg', 'kv-widget-logo cf-brand-logo', 'Káva Víťazov');
      img.classList.add('kv-widget-logo', 'cf-brand-logo');
      if (!mark) {
        mark = document.createElement('span');
        mark.className = 'widget-brand__mark';
        brand.prepend(mark);
      }
      if (!mark.contains(img)) mark.replaceChildren(img);
      return;
    }

    if (slug === 'concept') {
      document.querySelectorAll('.widget-brand__mark,.brand-mark').forEach((node) => replaceWithBrand(node, 'concept'));
      return;
    }

    if (slug === 'diamonds') {
      document.querySelectorAll('.widget-logo').forEach((node) => replaceWithBrand(node, 'diamonds'));
    }
  }

  function fixBrandAvatars() {
    if (slug === 'kaffa') {
      document.querySelectorAll('.kf-bot-avatar').forEach((node) => replaceWithBrand(node, 'kaffa'));
    } else if (slug === 'concept' || slug === 'vitazov') {
      document.querySelectorAll('.message__avatar').forEach((node) => replaceWithBrand(node, slug));
    } else if (slug === 'diamonds') {
      document.querySelectorAll('.chat-logo').forEach((node) => replaceWithBrand(node, 'diamonds'));
    }
  }

  function fixLaunchersAndEntries() {
    if (slug === 'praziarnicka') {
      const launcher = document.querySelector('#pz13-open');
      if (launcher) {
        let img = launcher.querySelector('img.cra-launcher-photo');
        if (!img) {
          img = createImage('/assets/praziarnicka/official-puccini.jpg', 'cra-launcher-photo', '');
          launcher.replaceChildren(img);
        }
        if (img.getAttribute('src') !== '/assets/praziarnicka/official-puccini.jpg') img.src = '/assets/praziarnicka/official-puccini.jpg';
      }
      const entry = document.querySelector('#pz13-advisor-entry > span:first-child');
      if (entry && !entry.querySelector('img.cra-entry-photo')) {
        entry.replaceChildren(createImage('/assets/praziarnicka/official-puccini.jpg', 'cra-entry-photo', ''));
      }
      return;
    }

    if (slug === 'diamonds') {
      const launcher = document.querySelector('#launcherButton');
      if (launcher && !launcher.querySelector('img.cra-diamonds-launcher')) {
        const status = document.createElement('i');
        status.setAttribute('aria-hidden', 'true');
        launcher.replaceChildren(createImage('/assets/diamonds/diroastery-logo.svg', 'cra-diamonds-launcher', ''), status);
      }
      const entry = document.querySelector('#openAdvisor > span:first-child');
      if (entry && !entry.querySelector('img.cra-entry-photo')) {
        entry.replaceChildren(createImage('/assets/kaffa/prep-espresso.webp', 'cra-entry-photo', ''));
      }
      return;
    }

    if (slug === 'concept') {
      const entry = document.querySelector('.advisor-entry__mark');
      if (entry && !entry.querySelector('img.cra-entry-photo')) {
        entry.replaceChildren(createImage('/assets/concept/prep-filter.webp', 'cra-entry-photo', ''));
      }
    }
  }

  const praziarnickaPhotos = new Map([
    ['Automat', ['/assets/praziarnicka/prep-automatic.webp', 'scene']],
    ['Pákový kávovar', ['/assets/praziarnicka/prep-lever.webp', 'scene']],
    ['Moka kanvička', ['/assets/praziarnicka/prep-moka.webp', 'scene']],
    ['Filter', ['/assets/praziarnicka/prep-filter.webp', 'scene']],
    ['Čokoláda a orechy', ['/assets/praziarnicka/official-paganini.jpg', 'product']],
    ['Sladká a vyvážená', ['/assets/praziarnicka/official-brazil.jpg', 'product']],
    ['Ovocná a svieža', ['/assets/praziarnicka/official-cuba.jpg', 'product']],
    ['Silná a výrazná', ['/assets/praziarnicka/official-puccini.jpg', 'product']],
    ['Čiernu', ['/assets/praziarnicka/prep-lever.webp', 'scene']],
    ['S mliekom', ['/assets/praziarnicka/official-paganini.jpg', 'product']],
    ['Striedam oboje', ['/assets/praziarnicka/official-brazil.jpg', 'product']],
    ['Podľa nálady', ['/assets/praziarnicka/prep-filter.webp', 'scene']],
    ['Počas dňa', ['/assets/praziarnicka/official-brazil.jpg', 'product']],
    ['Aj večer', ['/assets/praziarnicka/official-bezkofeinova.jpg', 'product']],
    ['Je mi to jedno', ['/assets/praziarnicka/official-cuba.jpg', 'product']],
    ['Chcem povzbudenie', ['/assets/praziarnicka/official-puccini.jpg', 'product']]
  ]);

  const diamondsPhotos = new Map([
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

  function syncCardImage(card, map, titleSelector, visualSelector, className) {
    const title = card.querySelector(titleSelector)?.textContent?.trim();
    const mapping = map.get(title);
    const visual = card.querySelector(visualSelector);
    if (!title || !mapping || !visual) return;
    const [src, kind] = mapping;
    let img = visual.querySelector(`img.${className}`) || visual.querySelector('img');
    if (!img) {
      img = createImage(src, className, title);
      visual.prepend(img);
    }
    img.classList.add(className);
    if (img.getAttribute('src') !== src) img.src = src;
    img.alt = title;
    img.loading = kind === 'scene' ? 'eager' : 'lazy';
    visual.dataset.photoKind = kind;
  }

  function fixAdvisorPhotos() {
    if (slug === 'praziarnicka') {
      document.querySelectorAll('.pz13-option').forEach((card) => {
        syncCardImage(card, praziarnickaPhotos, '.pz13-option__copy b', '.pz13-option__visual', 'pz13-option__img');
      });
    } else if (slug === 'diamonds') {
      document.querySelectorAll('.answer-card').forEach((card) => {
        syncCardImage(card, diamondsPhotos, '.answer-copy b', '.answer-photo', 'cf-real-photo');
      });
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

  function normalizeTeasers() {
    const selectors = {
      praziarnicka: '.pz13-preview',
      diamonds: '.teaser',
      kaffa: '.kf-teaser',
      vitazov: '.launcher__teaser',
      concept: '.launcher__teaser',
      jolka: '.launcher__teaser'
    };
    const teaser = document.querySelector(selectors[slug]);
    if (!teaser) return;

    const preferred = teaser.querySelector('#teaserClose,#closeTeaser,#pz13-preview-close,.kf-teaser-close,.launcher__teaser-close,.teaser__close');
    teaser.querySelectorAll('button').forEach((button) => {
      const text = `${button.id} ${button.className} ${button.getAttribute('aria-label') || ''}`;
      if (/close|zavrie|skry/i.test(text) && preferred && button !== preferred) button.remove();
    });

    if (slug === 'diamonds') {
      const title = teaser.querySelector('strong,b');
      const copy = teaser.querySelector('span');
      if (title) title.textContent = 'Nájdite svoju kávu';
      if (copy) copy.textContent = '4 otázky · jedno odporúčanie';
    }
  }

  function improveVitazovEntry() {
    if (slug !== 'vitazov') return;
    const entry = document.querySelector('#openAdvisor');
    const title = entry?.querySelector('b');
    const note = entry?.querySelector('em');
    if (title) title.textContent = 'Nájsť svoju kávu';
    if (note) note.textContent = '4 krátke otázky · jedno odporúčanie';
  }

  function hideMobileTeasers() {
    const mobile = matchMedia('(max-width: 640px)').matches;
    document.querySelectorAll('[data-mcb-teaser="true"],.launcher__teaser,.launcher-teaser,.teaser,.kf-teaser,.pz13-preview').forEach((node) => {
      if (!(node instanceof HTMLElement)) return;
      if (mobile) {
        node.dataset.craMobileHidden = 'true';
        node.style.setProperty('display', 'none', 'important');
      } else if (node.dataset.craMobileHidden === 'true') {
        node.style.removeProperty('display');
        delete node.dataset.craMobileHidden;
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
    if (window.__CRA_CHAT_FALLBACK__) return;
    window.__CRA_CHAT_FALLBACK__ = true;
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
            timer = setTimeout(() => reject(new Error('coffee-release-fallback')), 1500);
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
    if (document.documentElement.dataset.craStepMotion === 'true') return;
    document.documentElement.dataset.craStepMotion = 'true';
    document.addEventListener('click', (event) => {
      const option = event.target.closest('.kf-option,.option,.answer-card,.pz13-option');
      if (!option || option.disabled || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const container = option.closest('.kf-stage,#advisorBody,#advisorContent,.advisor,.pz13-advisor');
      if (!container) return;
      setTimeout(() => container.classList.add('cf-step-leaving'), 150);
      setTimeout(() => container.classList.remove('cf-step-leaving'), 275);
    }, true);
  }

  function installConversationGuard() {
    if (document.documentElement.dataset.craConversationGuard === 'true') return;
    document.documentElement.dataset.craConversationGuard = 'true';
    const guarded = new WeakSet();
    const guard = (container) => {
      if (!(container instanceof HTMLElement) || guarded.has(container)) return;
      guarded.add(container);
      const observer = new MutationObserver(() => {
        const typing = container.querySelector('#typingRow,#typing,.typing,.cf-typing-row');
        if (!typing) return;
        requestAnimationFrame(() => {
          const rows = [...container.children].filter((node) => node instanceof HTMLElement && node.getClientRects().length);
          if (rows.length < 2) return;
          const anchor = rows[Math.max(0, rows.length - 3)];
          container.scrollTop = Math.min(
            Math.max(0, anchor.offsetTop - 8),
            Math.max(0, container.scrollHeight - container.clientHeight)
          );
        });
      });
      observer.observe(container, { childList: true, subtree: true });
    };
    const apply = () => document.querySelectorAll('#chatMessages,.kf-messages,.pz13-chat__messages,#chat').forEach(guard);
    apply();
    const rootObserver = new MutationObserver(apply);
    rootObserver.observe(document.body, { childList: true, subtree: true });
  }

  function run() {
    setOwnerPrice();
    fixContactLinks();
    fixWidgetBrandIdentity();
    fixBrandAvatars();
    fixLaunchersAndEntries();
    fixAdvisorPhotos();
    fixKaffaSeed();
    normalizeTeasers();
    improveVitazovEntry();
    hideMobileTeasers();

    /* This marker is deliberately LAST. Browser tests and previews may treat it
       as authoritative only after all release DOM work above has completed and
       all release stylesheets have already loaded. */
    document.body.dataset.coffeeFinal = slug;
    document.body.dataset.coffeeLastMile = 'true';
    document.body.dataset.coffeeReleaseReady = 'true';
    document.documentElement.dataset.coffeeReleaseReady = 'true';
  }

  installFastChatFallback();
  installStepMotion();
  installConversationGuard();

  let queued = false;
  const observer = new MutationObserver(() => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      run();
    });
  });
  observer.observe(document.body, { childList: true, subtree: true });
  matchMedia('(max-width: 640px)').addEventListener?.('change', hideMobileTeasers);

  run();
  [100, 350, 900, 1800].forEach((delay) => setTimeout(run, delay));
})();
