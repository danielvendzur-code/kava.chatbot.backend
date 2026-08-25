(() => {
  'use strict';

  const slug = window.__COFFEE_DEMO_SLUG__ || window.COFFEE_DEMO_SLUG || document.body.dataset.demo || (location.pathname.includes('jolka') ? 'jolka' : '');
  const normalized = String(slug).replace('-v13', '');
  if (!['praziarnicka','diamonds','kaffa','vitazov','concept','jolka'].includes(normalized)) return;

  document.documentElement.dataset.coffeeRelease = '2026-08-final';
  document.body.dataset.coffeeRelease = normalized;

  const css = document.createElement('link');
  css.rel = 'stylesheet';
  css.href = '/coffee-usability-release.css';
  css.dataset.coffeeUsabilityRelease = 'true';
  // Ranked instead of observed. This sheet and coffee-widget-final.css used to
  // fight over being the last child of <body>, each move waking the other's
  // MutationObserver — an endless loop that also kept aborting both stylesheet
  // loads. Ranks are ordered once by a bounded pass in coffee-widget-final.js.
  css.dataset.mcOrder = '10';
  document.body.appendChild(css);

  const keepCssLast = () => {};

  const brand = {
    praziarnicka: { name:'Pražiarnička', logo:'<img src="/brand/praziarnicka-logo-official.png" alt="Pražiarnička">' },
    diamonds: { name:'Diamonds Roastery' },
    kaffa: { name:'Kaffa Roastery', logo:'<span class="mc-owner-wordmark"><b>KAFFA</b><small>SPECIALITY COFFEE BEANS</small></span>' },
    vitazov: { name:'Káva Víťazov' },
    concept: { name:'Concept Coffee Roasters' },
    jolka: { name:'Pražiareň Jolka', logo:'<span class="mc-owner-jolka"><img src="/assets/jolka/logo-ink.webp" alt="Pražiareň Jolka"><b>Pražiareň Jolka</b></span>' }
  }[normalized];

  const icon = (d) => `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="${d}" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  const icons = {
    arrow: icon('M5 12h13m-5-6 6 6-6 6'),
    chat: icon('M5 5h14v10H9l-4 4V5Z'),
    picker: icon('M5 7h11v7a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5V7Zm11 2h2a2 2 0 0 1 0 4h-2'),
    check: icon('m5 12 4 4L19 6')
  };

  function existingLockup() {
    if (brand.logo) return brand.logo;
    const root = document.querySelector('[data-owner-page="true"]');
    const old = root?.querySelector('.op-lockup');
    if (old?.innerHTML?.trim()) return old.innerHTML;
    if (normalized === 'concept') return '<img src="/brand/concept-official-logo.png" alt="Concept Coffee Roasters">';
    if (normalized === 'diamonds') return '<img src="/assets/diamonds/diroastery-logo.svg" alt="Diamonds Roastery">';
    if (normalized === 'vitazov') return '<img src="/assets/vitazov-logo.svg" alt="Káva Víťazov">';
    return `<b>${brand.name}</b>`;
  }

  function ownerTarget() {
    if (normalized === 'praziarnicka') return document.querySelector('.pz13-site');
    if (normalized === 'jolka') return document.querySelector('.page');
    return document.querySelector('[data-owner-page="true"]');
  }

  function ownerMarkup() {
    return `
      <header class="mc-owner-head">
        <div class="mc-owner-lockup">${existingLockup()}</div>
        <span class="mc-owner-label"><i></i> Ukážka pre váš web</span>
      </header>
      <section class="mc-owner-hero">
        <div class="mc-owner-copy">
          <span class="mc-owner-eyebrow">Pomoc zákazníkovi aj vášmu tímu</span>
          <h1>Menej otázok.<br>Jednoduchší výber kávy.</h1>
          <p>Chat odpovie zákazníkovi hneď. Kto nevie, čo si vybrať, prejde štyri jednoduché kroky a dostane jednu konkrétnu kávu. Vy nemusíte stále dokola vysvetľovať to isté.</p>
          <div class="mc-owner-actions">
            <button type="button" data-release-open="advisor">Otvoriť Výber kávy ${icons.arrow}</button>
            <button class="is-secondary" type="button" data-release-open="chat">Pozrieť Chat ${icons.chat}</button>
          </div>
          <a class="mc-owner-contact" href="https://mojchatbot.sk/kontakt" target="_blank" rel="noreferrer">Chcem podobné riešenie na svoj web ${icons.arrow}</a>
        </div>
        <div class="mc-owner-demo" aria-label="Ako poradca pomáha zákazníkovi">
          <article class="mc-owner-demo-card">
            <span class="mc-owner-demo-icon">${icons.chat}</span>
            <div><small>CHAT</small><b>Zákazník sa normálne opýta.</b><p>„Čo by ste mi odporučili do automatu, keď nechcem kyslú kávu?“</p></div>
          </article>
          <article class="mc-owner-demo-card is-picker">
            <span class="mc-owner-demo-icon">${icons.picker}</span>
            <div><small>VÝBER KÁVY</small><b>Štyri kliknutia k produktu.</b><ol><li><i>1</i>Príprava</li><li><i>2</i>Chuť</li><li><i>3</i>Nápoj</li><li><i>4</i>Posledná voľba</li></ol></div>
          </article>
        </div>
      </section>
      <section class="mc-owner-benefits">
        <div>${icons.check}<span><b>Odpovie hneď</b><small>Menej opakovaných otázok pre váš tím.</small></span></div>
        <div>${icons.check}<span><b>Výber bez stresu</b><small>Štyri jasné kroky, ktoré zvládne každý.</small></span></div>
        <div>${icons.check}<span><b>Konkrétny výsledok</b><small>Nie zoznam možností, ale odporúčaná káva.</small></span></div>
        <div>${icons.check}<span><b>Vedie k nákupu</b><small>Výsledok prirodzene pokračuje do košíka.</small></span></div>
      </section>
      <footer class="mc-owner-foot">
        <span>Ukážku pripravil <a href="https://mojchatbot.sk" target="_blank" rel="noreferrer">mojchatbot.sk</a></span>
        <a href="https://mojchatbot.sk/kontakt" target="_blank" rel="noreferrer">Kontakt ${icons.arrow}</a>
      </footer>`;
  }

  function renderOwner() {
    // coffee-owner-brand.js builds the roastery's own page. When it is present
    // this generic version would only paint a page that gets replaced a frame
    // later, so it stands down.
    if (window.__MCB_OWNER__) return;
    const target = ownerTarget();
    if (!target || target.dataset.releaseOwner === 'true' || target.dataset.mcbPage === 'true') return;
    target.dataset.releaseOwner = 'true';
    target.classList.add('mc-owner');
    target.innerHTML = ownerMarkup();
    const primary = target.querySelector('[data-release-open="advisor"]');
    if (primary) primary.id = normalized === 'praziarnicka' ? 'pz13-hero-open' : 'heroOpen';
    target.querySelectorAll('[data-release-open]').forEach((button) => button.addEventListener('click', () => openMode(button.dataset.releaseOpen)));
  }

  const launchers = {
    praziarnicka:'#pz13-open', diamonds:'#launcherButton', kaffa:'#launcher', vitazov:'#openWidget', concept:'#openWidget', jolka:'#open'
  };
  const advisorButtons = {
    praziarnicka:'.pz13-mode button[data-mode="advisor"]', diamonds:'.mode-switch button[data-mode="advisor"]', kaffa:'.kf-switch button[data-mode="advisor"]', vitazov:'.mode__button[data-mode="advisor"],.mode-switch button[data-mode="advisor"]', concept:'.mode__button[data-mode="advisor"],.mode-switch button[data-mode="advisor"]', jolka:'.mode__button[data-mode="advisor"]'
  };
  const chatButtons = {
    praziarnicka:'.pz13-mode button[data-mode="chat"]', diamonds:'.mode-switch button[data-mode="chat"]', kaffa:'.kf-switch button[data-mode="chat"]', vitazov:'.mode__button[data-mode="chat"],.mode-switch button[data-mode="chat"]', concept:'.mode__button[data-mode="chat"],.mode-switch button[data-mode="chat"]', jolka:'.mode__button[data-mode="chat"]'
  };

  function openMode(mode) {
    const launcher = document.querySelector(launchers[normalized]);
    if (launcher && launcher.offsetParent !== null) launcher.click();
    requestAnimationFrame(() => requestAnimationFrame(() => {
      const selector = mode === 'advisor' ? advisorButtons[normalized] : chatButtons[normalized];
      document.querySelector(selector)?.click();
    }));
  }

  function fixJolkaFlow() {
    if (normalized !== 'jolka') return;
    const chatScreen = document.querySelector('#chatScreen');
    const entry = document.querySelector('#entry');
    const chat = document.querySelector('#chat');
    if (chatScreen && entry && chat && entry.nextElementSibling !== chat) chatScreen.insertBefore(entry, chat);
  }

  function cleanResultLabels() {
    document.querySelectorAll('.result__badge').forEach((badge) => {
      if (/\d+\s*%/.test(badge.textContent || '')) badge.textContent = 'Odporúčanie pre vás';
    });
  }

  function removeAICopy() {
    document.querySelectorAll('.demo-flag,.op-flag').forEach((node) => {
      if (/AI/i.test(node.textContent || '')) node.textContent = 'Ukážka pre váš web';
    });
  }

  function finaliseDom() {
    renderOwner();
    fixJolkaFlow();
    cleanResultLabels();
    removeAICopy();
    keepCssLast();
  }

  const upstreamFetch = window.fetch.bind(window);
  window.fetch = async (input, init) => {
    const url = typeof input === 'string' ? input : input?.url || '';
    if (!(url === '/api/chat' || url.endsWith('/api/chat'))) return upstreamFetch(input, init);
    let timer;
    try {
      return await Promise.race([
        upstreamFetch(input, init),
        new Promise((_, reject) => { timer = setTimeout(() => reject(new Error('coffee-chat-timeout')), 5200); })
      ]);
    } catch (error) {
      let text = '';
      try {
        const payload = JSON.parse(init?.body || '{}');
        text = String(payload.messages?.filter((message) => message?.role === 'user').at(-1)?.content || '').toLocaleLowerCase('sk');
      } catch {}
      let reply = 'Pomôžem vám. Ak chcete najjednoduchšiu cestu, prejdite Výber kávy — štyri krátke kroky vás dovedú ku konkrétnemu produktu.';
      if (/odkia[ľl]|p[ôo]vod|krajin|pochádz|farma/.test(text)) reply = 'Pri každej káve je uvedená krajina pôvodu a spôsob spracovania. Napíšte mi, ktorá vás zaujíma, alebo prejdite Výber kávy a odporučím vám jednu podľa chuti.';
      else if (/porovna|rozdiel|lep[šs]ia|ktor[áa] z|namiesto/.test(text)) reply = 'Rozdiel býva najmä v kyslosti a v tom, či sa káva nestratí v mlieku. Napíšte mi, ktoré dve porovnať, alebo prejdite Výber kávy — vyberiem tú, ktorá sedí vám.';
      else if (/automat|kancel/.test(text)) reply = 'Do automatu sa zvyčajne hodí plnšia a menej kyslá káva. Vo Výbere kávy to spresníme podľa chuti a toho, či ju pijete s mliekom.';
      else if (/mliek|capp|latte/.test(text)) reply = 'Do mliečnych nápojov sa hodí plnšia káva, ktorá sa v mlieku nestratí. Vo Výbere kávy ju vyberieme podľa vašej chuti.';
      else if (/filter|v60|ovoc|sviež/.test(text)) reply = 'Na filter sa dá ísť jemnejším aj ovocnejším smerom. Vo Výbere kávy to zúžime podľa toho, akú chuť chcete v šálke.';
      else if (/bez\s*kofe|decaf|večer/.test(text)) reply = 'Ak hľadáte kávu bez kofeínu, poradca vás nasmeruje na vhodnú voľbu z ponuky. Stačí povedať, ako ju pripravujete a akú chuť máte radi.';
      return new Response(JSON.stringify({ reply, fallback:true }), { status:200, headers:{ 'content-type':'application/json; charset=utf-8', 'cache-control':'no-store' } });
    } finally {
      clearTimeout(timer);
    }
  };

  let queued = false;
  const observer = new MutationObserver(() => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      finaliseDom();
    });
  });
  observer.observe(document.documentElement, { childList:true, subtree:true });
  finaliseDom();
})();
