/**
 * Shared clean coffee advisor runtime.
 * Geometry and interaction are shared; every brand keeps its own data and media.
 */
(() => {
  'use strict';

  const DATA = window.JOLKA;
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  if (!DATA || !Array.isArray(DATA.products) || !Array.isArray(DATA.steps) || !DATA.demo || !DATA.brand) {
    document.body.textContent = 'Ukážka sa nenačítala.';
    return;
  }

  const {
    brand,
    acidityScale = ['minimálna', 'jemná', 'stredná', 'výrazná'],
    products,
    steps,
    chat: chatCopy,
    fallbacks = []
  } = DATA;
  const demo = DATA.demo;
  const root = document.getElementById(demo.rootId);

  if (!root || products.length === 0 || steps.length === 0 || !chatCopy) {
    document.body.textContent = 'Ukážka sa nenačítala.';
    return;
  }

  document.documentElement.dataset.coffeeDemo = demo.id;
  document.body.dataset.coffeeDemo = demo.id;

  const byId = Object.fromEntries(products.map((product) => [product.id, product]));
  const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[character]));

  const stroke = (path) => `<path d="${path}" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>`;
  const svg = (body) => `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">${body}</svg>`;
  const icons = {
    arrow: svg(stroke('M5 12h13M13 6l6 6-6 6')),
    back: svg(stroke('M15 18l-6-6 6-6')),
    close: svg(stroke('M6 6l12 12M18 6L6 18')),
    reset: svg(stroke('M19.5 12a7.5 7.5 0 1 1-2.2-5.3M19 4v4.5h-4.5')),
    send: svg(stroke('M4.5 12h13M4.5 12 3 4.5 20.5 12 3 19.5 4.5 12Z')),
    check: svg(stroke('M5 12.5 9.5 17 19 7')),
    cup: svg(stroke('M5 8h11v6a5 5 0 0 1-5 5H10a5 5 0 0 1-5-5V8ZM16 10h1.8a2.2 2.2 0 0 1 0 4.4H16M4 22h13')),
    drop: svg(stroke('M12 3.5c3.4 3.6 5.5 6.3 5.5 9a5.5 5.5 0 1 1-11 0c0-2.7 2.1-5.4 5.5-9Z')),
    shop: svg(stroke('M4.5 8.5h15l-1 11.5a1.5 1.5 0 0 1-1.5 1.4H7a1.5 1.5 0 0 1-1.5-1.4L4.5 8.5ZM8.5 8.5V6a3.5 3.5 0 1 1 7 0v2.5'))
  };

  const dots = (level) => `<span class="dots" aria-hidden="true">${[0, 1, 2, 3]
    .map((index) => `<i class="${index <= level ? 'on' : ''}"></i>`)
    .join('')}</span>`;

  /* Notes are shown as the taste itself, without a source remark in every sentence. */
  products.forEach((product) => { if (typeof product.why === 'string') product.why = product.why.replace(/Chuťový profil podľa e-shopu:/g, 'Chuť:'); });

  const WEIGHTS = { taste: 3.2, prep: 2.4, drink: 2.0, acidity: 2.6 };
  const MAX_SCORE = WEIGHTS.taste + WEIGHTS.prep + WEIGHTS.drink + WEIGHTS.acidity;
  const ACIDITY_TARGET = { none: 0, mild: 1, bright: 3 };

  function score(product, answers) {
    let total = 0;
    if (answers.taste) total += WEIGHTS.taste * (product.taste?.[answers.taste] ?? 0);
    if (answers.prep) total += WEIGHTS.prep * (product.prep?.[answers.prep] ?? 0);
    if (answers.drink) total += WEIGHTS.drink * (product.drink?.[answers.drink] ?? 0);
    if (answers.acidity && answers.acidity!=='any') {
      if (answers.acidity === 'explore') {
        total += WEIGHTS.acidity * (product.explore ?? 0);
      } else {
        const target = ACIDITY_TARGET[answers.acidity];
        const acidity = Number.isFinite(product.acidity) ? product.acidity : 1;
        total += WEIGHTS.acidity * (1 - Math.abs(target - acidity) / 3);
      }
    }

    return total;
  }

  /* Each explicit preference must be supported by the product facts. */
  function unmet(product, answers) {
    const missing = [];
    /* Black coffee needs no milk suitability claim. “Both” explicitly promises
       milk too, so unknown milk suitability remains an unconfirmed preference. */
    const drinkUnknown=!Object.values(product.drink||{}).some(v=>v>0)&&answers.drink==='black';
    for(const key of ['taste','drink'])if(answers[key]&&answers[key]!=='any'&&!(key==='drink'&&drinkUnknown)&&(product[key]?.[answers[key]]??0)<.5)missing.push(key);
    if (answers.prep && answers.prep!=='any' && (product.prep?.[answers.prep] ?? 0) < 0.6) missing.push('prep');
    const acidity = Number.isFinite(product.acidity) ? product.acidity : null;
    if(answers.caffeine&&answers.caffeine!=='any'&&product.decaf!==(answers.caffeine==='no'))missing.push('caffeine');
    if(answers.acidity&&answers.acidity!=='any'&&answers.acidity!=='explore'&&acidity===null)missing.push('acidity');
    if (answers.acidity === 'none' && acidity > 1) missing.push('acidity');
    if(answers.acidity==='mild'&&acidity>2)missing.push('acidity');
    if (answers.acidity === 'bright' && acidity !== null && acidity < 2) missing.push('acidity');
    return missing;
  }

  /* Among equally good coffees a regular pack comes first: a kilo, a multipack or a sample is not the first suggestion. */
  function packRank(product) {
    const text = `${product.name} ${product.priceUnit || ''}`;
    const m = text.match(/(\d+(?:[.,]\d+)?)\s*(kg|g)\b/i);
    const grams = m ? Number(m[1].replace(',', '.')) * (/kg/i.test(m[2]) ? 1000 : 1) : null;
    return /\d\s*x\s*\d|\d\s*\+\s*\d|vzork|vzorek|degust|balíček|balicek/i.test(text) || (grams && (grams >= 1000 || grams < 150)) ? 1 : 0;
  }

  function rank(answers) {
    return products
      .filter(product=>product.available!==false).map((product) => ({ product, value: score(product, answers), unmet: unmet(product, answers) }))
      /* Caffeine is a firm requirement; for the rest the closest coffee is shown with an honest note. */
      .filter(entry=>!entry.unmet.includes('caffeine'))
      .sort((left, right) => left.unmet.length - right.unmet.length || right.value - left.value || packRank(left.product) - packRank(right.product) || left.product.name.localeCompare(right.product.name, 'sk'));
  }

  const state = {
    mode: 'advisor',
    step: 0,
    answers: {},
    stage: 'questions',
    chosen: null,
    busy: false,
    history: [],
    lastFocus: null,
    teaserDismissed: false,
    chatStarted: false
  };

  const heroProduct = byId[demo.heroProductId] || products[0];
  const heroHint = demo.heroHint || `Funguje s reálnou ponukou ${brand.name}${brand.verifiedOn ? `, overenou ${brand.verifiedOn}` : ''}.`;

  root.innerHTML = `
    <main class="page ${esc(demo.pageClass || '')}">
      <header class="topbar">
        <div class="lockup">
          <img src="${esc(demo.logoInk)}" width="52" height="52" alt="${esc(brand.name)}">
          <span class="lockup__text"><b>${esc(brand.name)}</b><span>${esc(brand.place)}</span></span>
        </div>
        <span class="demo-flag"><i class="dot"></i> Návrh poradcu · ukážka</span>
      </header>

      <section class="hero">
        <div class="hero__copy">
          <span class="eyebrow">${esc(demo.eyebrow)}</span>
          <h1>${esc(demo.heroTitle)}</h1>
          <p class="hero__lead">${esc(demo.heroLead)}</p>
          <div class="benefits">
            <article class="benefit"><span class="benefit__num">01</span><div><b>Menej váhania</b><span>Zákazník dostane jednu konkrétnu kávu, nie zoznam.</span></div></article>
            <article class="benefit"><span class="benefit__num">02</span><div><b>Menej otázok</b><span>Chuť, aciditu aj prípravu vysvetlí poradca.</span></div></article>
            <article class="benefit"><span class="benefit__num">03</span><div><b>Priamy nákupný krok</b><span>Odporúčanie končí konkrétnym produktom.</span></div></article>
          </div>
          <div class="hero__actions">
            <button class="cta" id="heroOpen" type="button">Otvoriť ukážku poradcu ${icons.arrow}</button>
            <span class="hero__hint">${esc(heroHint)}</span>
          </div>
        </div>
        <aside class="showcase" aria-label="Ukážka odporúčania">
          <div class="showcase__frame">
            <span class="showcase__tag">Vaša ponuka v poradcovi</span>
            <img class="showcase__photo" src="${esc(demo.heroImage)}" width="878" height="920" alt="${esc(demo.heroImageAlt)}">
          </div>
          <div class="showcase__card">
            <img src="${esc(heroProduct.photo)}" width="54" height="76" alt="" loading="lazy">
            <div><small>Odporúčanie</small><b>${esc(heroProduct.name)}</b><span>${esc(heroProduct.notes.slice(0, 2).join(' · '))}</span></div>
          </div>
        </aside>
      </section>

      <footer class="page__footer">
        <ul class="perks">
          <li><b>Poradí 24/7</b><span>Zákazník dostane odpoveď aj mimo otváracích hodín.</span></li>
          <li><b>Odbúra otázky</b><span>Chuť, pôvod a prípravu vysvetlí priamo v chate.</span></li>
          <li><b>Zjednoduší výber</b><span>Štyri odpovede skončia jednou konkrétnou kávou.</span></li>
          <li><b>Vedie k nákupu</b><span>Výsledok má priamy odkaz na detail produktu.</span></li>
        </ul>
        <p class="page__by">Návrh pripravil <a href="https://mojchatbot.sk" target="_blank" rel="noreferrer">mojchatbot.sk</a> · ${esc(demo.ownerCredit)}</p>
      </footer>
    </main>

    <div class="launcher" id="launcher">
      <div class="launcher__teaser" id="teaser">
        <button class="launcher__teaser-body" id="teaserOpen" type="button"><b>${esc(demo.teaserTitle)}</b><span>${esc(demo.teaserText)}</span></button>
        <button class="launcher__teaser-close" id="teaserClose" type="button" aria-label="Skryť pozvánku">${icons.close}</button>
      </div>
      <button class="launcher__button" id="open" type="button" aria-label="Otvoriť kávového poradcu" aria-expanded="false" aria-controls="widget">
        <img src="${esc(demo.logoBadge)}" width="52" height="52" alt="">
      </button>
    </div>

    <section class="widget" id="widget" role="dialog" aria-modal="true" aria-label="${esc(demo.dialogLabel)}" aria-hidden="true" tabindex="-1">
      <header class="widget__header">
        <div class="widget__brand">
          <img src="${esc(demo.logoHeader)}" width="40" height="40" alt="">
          <div><b>${esc(brand.name)}</b><span><i></i> ${esc(demo.advisorLabel)}</span></div>
        </div>
        <div class="widget__actions">
          <button class="icon-button" id="reset" type="button" aria-label="Začať odznova">${icons.reset}</button>
          <button class="icon-button" id="close" type="button" aria-label="Zavrieť poradcu">${icons.close}</button>
        </div>
      </header>

      <nav class="mode" id="mode" aria-label="Režim poradcu">
        <span class="mode__thumb" aria-hidden="true"></span>
        <button class="mode__button is-active" type="button" data-mode="advisor" aria-pressed="true">Výber kávy</button>
        <button class="mode__button" type="button" data-mode="chat" aria-pressed="false">Chat</button>
      </nav>

      <div class="stage">
        <section class="screen is-active" id="advisorScreen" aria-label="Výber kávy">
          <div class="advisor-top">
            <div class="advisor-top__row">
              <button class="back" id="back" type="button">${icons.back}<span>Späť</span></button>
              <div class="advisor-top__copy"><b id="stepTitle">Krok 1 zo ${steps.length}</b><span id="stepName">${esc(steps[0].name)}</span></div>
            </div>
            <div class="progress" id="progress" aria-hidden="true"></div>
          </div>
          <div class="advisor" id="advisor" aria-live="polite"></div>
          <div class="advisor-foot" id="advisorFoot" hidden></div>
        </section>

        <section class="screen" id="chatScreen" aria-label="Chat">
          <button class="entry" id="entry" type="button">
            <span class="entry__thumb"><img src="${esc(demo.entryImage)}" alt="" width="120" height="96"></span>
            <span class="entry__copy"><small>${esc(demo.entryKicker)}</small><b>${esc(demo.entryTitle)}</b><span>${esc(demo.entryText)}</span></span>
            <span class="entry__arrow">${icons.arrow}</span>
          </button>
          <div class="chat" id="chat" role="log" aria-live="polite"></div>
          <div class="composer-area">
            <div class="chips" id="chips"></div>
            <form class="composer" id="composer">
              <div class="composer__field"><input id="input" type="text" autocomplete="off" placeholder="${esc(chatCopy.placeholder)}" aria-label="Napíšte otázku o káve"></div>
              <button class="send" type="submit" aria-label="Odoslať správu">${icons.send}</button>
            </form>
          </div>
        </section>
      </div>
      <p class="widget__note"><a href="https://mojchatbot.sk" target="_blank" rel="noreferrer">${esc(brand.author || 'mojchatbot.sk')}</a></p>
    </section>`;

  const widget = $('#widget');
  const launcher = $('#launcher');
  const teaser = $('#teaser');
  const openButton = $('#open');
  const modeNav = $('#mode');
  const advisorScreen = $('#advisorScreen');
  const chatScreen = $('#chatScreen');
  const advisor = $('#advisor');
  const advisorFoot = $('#advisorFoot');
  const chatLog = $('#chat');
  const entryCard = $('#entry');
  const chips = $('#chips');
  const composer = $('#composer');
  const input = $('#input');
  const FOCUSABLE = 'button:not([disabled]), a[href], input, [tabindex]:not([tabindex="-1"])';

  function syncChatStarted() {
    const started = state.chatStarted === true;
    chatScreen.classList.toggle('is-chat-started', started);
    entryCard.hidden = started;
    entryCard.setAttribute('aria-hidden', String(started));
    chips.hidden = started;
    chips.setAttribute('aria-hidden', String(started));
  }

  function startChat() {
    if (state.chatStarted) return;
    state.chatStarted = true;
    syncChatStarted();
  }

  function resetChat() {
    state.chatStarted = false;
    syncChatStarted();
  }

  function openWidget() {
    if (widget.classList.contains('is-open')) return;
    state.lastFocus = document.activeElement;
    widget.classList.add('is-open');
    widget.setAttribute('aria-hidden', 'false');
    openButton.setAttribute('aria-expanded', 'true');
    launcher.hidden = true;
    teaser.classList.remove('is-visible');
    document.documentElement.classList.add('widget-open');
    document.body.classList.add('widget-open');
    requestAnimationFrame(() => widget.focus());
  }

  function closeWidget() {
    if (!widget.classList.contains('is-open')) return;
    widget.classList.remove('is-open');
    widget.setAttribute('aria-hidden', 'true');
    openButton.setAttribute('aria-expanded', 'false');
    document.documentElement.classList.remove('widget-open');
    document.body.classList.remove('widget-open');
    launcher.hidden = false;
    (state.lastFocus instanceof HTMLElement ? state.lastFocus : openButton).focus();
    if (!state.teaserDismissed) setTimeout(() => teaser.classList.add('is-visible'), 600);
  }

  document.addEventListener('keydown', (event) => {
    if (!widget.classList.contains('is-open')) return;
    if (event.key === 'Escape') { event.preventDefault(); closeWidget(); return; }
    if (event.key !== 'Tab') return;
    const items = $$(FOCUSABLE, widget).filter((element) => element.offsetParent !== null || element === document.activeElement);
    if (!items.length) return;
    const first = items[0];
    const last = items.at(-1);
    if (event.shiftKey && (document.activeElement === first || document.activeElement === widget)) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });

  function setMode(mode, { focusInput = true } = {}) {
    state.mode = mode;
    modeNav.classList.toggle('is-chat', mode === 'chat');
    $$('.mode__button', modeNav).forEach((button) => {
      const active = button.dataset.mode === mode;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    advisorScreen.classList.toggle('is-active', mode === 'advisor');
    chatScreen.classList.toggle('is-active', mode === 'chat');
    if (mode === 'advisor') renderAdvisor();
    else if (focusInput && matchMedia('(min-width:641px)').matches) requestAnimationFrame(() => input.focus());
  }

  function updateProgress() {
    const done = state.stage !== 'questions';
    $('#stepTitle').textContent = done ? 'Vaša káva' : `Krok ${state.step + 1} zo ${steps.length}`;
    $('#stepName').textContent = done ? 'Osobné odporúčanie' : steps[state.step].name;
    $('#back').disabled = state.stage === 'questions' && state.step === 0;
    $('#progress').innerHTML = steps.map((step, index) => {
      const className = done || index < state.step ? 'is-done' : index === state.step ? 'is-active' : '';
      return `<i class="${className}"><b>${esc(step.name)}</b></i>`;
    }).join('');
  }

  /* The question steps ask about taste, preparation and how the coffee is
     drunk. Several demos illustrated those answers with a photograph of a bag,
     which meant the first step showed the same packaging four times and told
     the visitor nothing. Every answer now carries a picture of the thing it
     describes; the product itself is what the result is for. */
  const CHOICE_PHOTOS = {
    taste: {
      chocolate: '/assets/scenes/coffee-nuts.jpg',
      balanced: '/assets/scenes/coffee-caramel.jpg',
      fruity: '/assets/scenes/coffee-berries.jpg',
      bold: '/assets/scenes/coffee-beans.jpg'
    },
    prep: {
      automat: '/assets/scenes/coffee-automatic-brew.jpg',
      lever: '/assets/scenes/coffee-espresso.jpg',
      moka: '/assets/scenes/coffee-moka.jpg',
      filter: '/assets/scenes/coffee-filter.jpg'
    },
    drink: {
      black: '/assets/scenes/coffee-black.jpg',
      milk: '/assets/scenes/coffee-milk.jpg',
      both: '/assets/scenes/coffee-both.jpg'
    },
    /* Acidity reads as a scale and never repeats the taste photos of the first step. */
    acidity: {
      none: '/assets/scenes/coffee-chocolate.jpg',
      mild: '/assets/scenes/coffee-acidity-mild.jpg',
      bright: '/assets/scenes/coffee-acidity-bright.jpg',
      explore: '/assets/scenes/coffee-explore.jpg'
    }
  };

  function optionVisual(option, stepKey) {
    const product = option.product ? byId[option.product] : null;
    const source = CHOICE_PHOTOS[stepKey]?.[option.value]
      || option.photo || product?.tile || product?.photo || demo.entryImage;
    return `<span class="option__visual"><img src="${esc(source)}" alt="" loading="lazy" width="240" height="192" style="object-position:${source.includes('automatic-brew')?'50% 90%':source.includes('espresso')?'50% 43%':'center'} !important"></span>`;
  }

  function equalCopy(){if(!advisor.classList.contains('is-questions'))return;const copies=$$('.option__copy',advisor);copies.forEach(e=>e.style.removeProperty('min-height'));const h=Math.max(0,...copies.map(e=>e.offsetHeight));copies.forEach(e=>e.style.setProperty('min-height',h+'px','important'));}
  window.addEventListener('resize',()=>requestAnimationFrame(equalCopy));
  function renderQuestion() {
    const step = steps[state.step];
    const selected = state.answers[step.key];
    advisor.classList.add('is-questions');
    advisor.classList.remove('is-result');
    advisor.innerHTML = `
      <div class="question"><h2>${esc(step.title)}</h2></div>
      <div class="options" role="group" aria-label="${esc(step.title)}">
        ${step.options.map((option, index) => {
          const isSelected = selected === option.value;
          return `<button class="option${isSelected ? ' is-selected' : ''}" type="button" data-value="${esc(option.value)}" aria-pressed="${isSelected}" style="--reveal:${index * 70}ms">
            ${optionVisual(option, step.key)}
            <span class="option__copy"><b>${esc(option.title)}</b><small>${esc(option.detail)}</small></span>
            <span class="option__mark">${icons.check}</span>
          </button>`;
        }).join('')}
      </div>`;
    advisorFoot.hidden = true;
    advisorFoot.innerHTML = '';
    $$('.option', advisor).forEach((button) => button.addEventListener('click', () => select(button.dataset.value)));
    requestAnimationFrame(equalCopy);
    document.fonts?.ready.then(equalCopy);
  }

  function select(value) {
    if (state.busy || state.stage !== 'questions') return;
    state.busy = true;
    state.answers[steps[state.step].key] = value;
    $$('.option', advisor).forEach((button) => {
      const selected = button.dataset.value === value;
      button.classList.toggle('is-selected', selected);
      button.classList.toggle('is-dimmed', !selected);
      button.setAttribute('aria-pressed', String(selected));
    });
    setTimeout(() => {
      advisor.classList.add('is-leaving');
      setTimeout(() => {
        if (state.step < steps.length - 1) state.step += 1;
        else state.stage = 'result';
        state.busy = false;
        advisor.classList.remove('is-leaving');
        renderAdvisor();
      }, 200);
    }, 300);
  }

  /* Result helpers. Every reason, variant and difference below comes from the shop's own product
     record; an answer the record cannot confirm is never shown as met. */
  const T = (sk, cs) => window.CX_LANG === 'cs' ? cs : sk;
  const PREP_REASON = {automat: ['Do automatu', 'Do automatu'], lever: ['Na espresso', 'Na espresso'], moka: ['Do moka kanvičky', 'Do moka konvičky'], filter: ['Na filter', 'Na filtr']};
  const TASTE_REASON = {chocolate: ['Čokoládová chuť', 'Čokoládová chuť'], balanced: ['Vyvážená chuť', 'Vyvážená chuť'], fruity: ['Ovocná chuť', 'Ovocná chuť'], bold: ['Výrazná chuť', 'Výrazná chuť']};
  const PREP_GRIND = {automat: /^$/, lever: /espresso|páka|pák/i, moka: /moka|koťog|kotog/i, filter: /filter|filtr|french|v60|chemex|drip|prekvap/i};
  const amountText = (value, currency) => {
    if (!Number.isFinite(value)) return '';
    if (currency === 'CZK') return Math.round(value).toLocaleString('cs-CZ').replace(/ /g, ' ') + ' Kč';
    const fixed = Math.round(value * 100) / 100;
    return (Number.isInteger(fixed) ? String(fixed) : fixed.toFixed(2).replace('.', ',')) + ' €';
  };
  const packOf = (product) => { const m = String(product.priceUnit || product.weights || product.name || '').match(/(\d+(?:[.,]\d+)?)\s*(kg|g)\b/i); return m ? Math.round(Number(m[1].replace(',', '.')) * (/kg/i.test(m[2]) ? 1000 : 1)) : null; };
  const composition = (product) => { const text = `${product.name} ${product.line || ''}`; return /100\s*%\s*arabi/i.test(text) ? 'arabica' : /robust|\b\d{2}\s*\/\s*\d{2}\b/i.test(text) ? 'blend' : ''; };
  const baseName = (product) => String(product.name || '').toLowerCase().replace(/\(.*?\)|\d+(?:[.,]\d+)?\s*(?:kg|g)\b|\d+\s*\+\s*\d+|\d+\s*x\s*/g, '').replace(/[^a-záäčďéíĺľňóôŕšťúýž0-9]+/g, ' ').trim();

  /* One concrete pack: whole beans for an automatic machine, otherwise the smallest regular pack. */
  function pickVariant(product, answers) {
    const live = (product.variants || []).filter((v) => v.available !== false && Number.isFinite(v.price) && (v.grams || v.grind));
    if (!live.length) return null;
    const regular = live.filter((v) => !(v.grams && v.grams < 150) && !/vzork|vzorek|sample/i.test(v.label || ''));
    let pool = regular.length ? regular : live;
    if (pool.some((v) => v.grind === 'beans')) pool = pool.filter((v) => v.grind === 'beans');
    /* Roast/preparation is a separate shop variant from grinding. Prefer the
       requested preparation before choosing the pack, rather than the first
       equal-priced variant (which could be Filter for an automatic machine). */
    const prep = {automat: /automat/i, lever: /espresso/i, moka: /moka/i, filter: /filter|filtr/i}[answers.prep];
    let suited = prep ? pool.filter((v) => prep.test(v.extra || '')) : [];
    if (!suited.length && /^(automat|moka)$/.test(answers.prep || ''))
      suited = pool.filter((v) => /espresso/i.test(v.extra || ''));
    if (suited.length) pool = suited;
    const pick = pool.slice().sort((a, b) => (a.grams || 1e6) - (b.grams || 1e6) || a.price - b.price)[0];
    const grounds = answers.prep && answers.prep !== 'automat' ? live.filter((v) => v.grind === 'ground' && v.grams === pick.grams && PREP_GRIND[answers.prep].test(v.label || '')) : [];
    const ground = grounds.find((v) => v.extra === pick.extra) || grounds[0] || null;
    const label = String(pick.label || '').replace(/Zrnková/g, T('zrnková', 'zrnková')).replace(/\s*·\s*/g, ' · ');
    return {...pick, label, ground};
  }

  function reasonsFor(product, answers, entry, variant) {
    const out = [];
    const a = answers;
    if (a.prep && (product.prep?.[a.prep] ?? 0) >= 0.6) {
      const [sk, cs] = PREP_REASON[a.prep] || [];
      if (sk) out.push([T(sk, cs), a.prep === 'automat' && variant?.grind === 'beans' ? T('Zrnková, akú automat potrebuje.', 'Zrnková, jakou automat potřebuje.') : T('Podľa popisu sa hodí na túto prípravu.', 'Podle popisu se hodí na tuto přípravu.')]);
    }
    if (a.taste && (product.taste?.[a.taste] ?? 0) >= 0.6 && product.notes?.length) {
      // A taste-family score is not evidence of a specific flavour note.
      out.push([T('Chuťový profil', 'Chuťový profil'), T('V chuti: ', 'V chuti: ') + product.notes.slice(0, 3).join(', ') + '.']);
    }
    if (a.caffeine === 'no' && product.decaf) out.push([T('Bez kofeínu', 'Bez kofeinu'), T('E-shop ju označuje ako bezkofeínovú.', 'E-shop ji označuje jako bezkofeinovou.')]);
    if (a.acidity && a.acidity !== 'explore' && Number.isFinite(product.acidity) && !entry.unmet.includes('acidity')) {
      out.push([product.acidity <= 1 ? T('Nízka kyslosť', 'Nízká kyselost') : T('Výraznejšia kyslosť', 'Výraznější kyselost'), T('Kyslosť: ', 'Kyselost: ') + T(acidityScale[product.acidity], ['minimální', 'jemná', 'střední', 'výrazná'][product.acidity] || acidityScale[product.acidity]) + '.']);
    }
    if ((a.drink === 'milk' || a.drink === 'both') && (product.drink?.milk ?? 0) >= 0.6) out.push([T('Aj do mlieka', 'I do mléka'), T('Hodí sa do cappuccina a latte.', 'Hodí se do cappuccina a latte.')]);
    if (out.length < 3) {
      const comp = composition(product);
      if (comp === 'arabica') out.push([T('100 % arabica', '100 % arabika'), T('Bez robusty, jemnejšia chuť.', 'Bez robusty, jemnější chuť.')]);
      else if (comp === 'blend' && /robust/i.test(`${product.name} ${product.line || ''}`)) out.push([T('Arabica s robustou', 'Arabika s robustou'), T('Plnšia chuť a hustejšia crema.', 'Plnější chuť a hustší crema.')]);
    }
    return out.slice(0, 3);
  }

  /* What actually differs from the main coffee; nothing to say means it is not a useful alternative. */
  function differenceOf(main, other) {
    const parts = [];
    const cm = composition(main), co = composition(other);
    if (co === 'arabica' && cm === 'blend') parts.push(T(`100 % arabica, oproti ${main.name} neobsahuje robustu`, `100 % arabika, oproti ${main.name} neobsahuje robustu`));
    else if (co === 'blend' && cm === 'arabica' && /robust/i.test(`${other.name} ${other.line || ''}`)) parts.push(T('zmes s robustou, plnšia a silnejšia', 'směs s robustou, plnější a silnější'));
    const fresh = (other.notes || []).filter((note) => !(main.notes || []).includes(note));
    if (fresh.length) parts.push(T('v chuti ', 'v chuti ') + (other.notes || []).slice(0, 3).join(', '));
    if (Number.isFinite(main.acidity) && Number.isFinite(other.acidity) && main.acidity !== other.acidity) parts.push(other.acidity > main.acidity ? T('viac kyslosti', 'více kyselosti') : T('menej kyslosti', 'méně kyselosti'));
    if (other.decaf && !main.decaf) parts.push(T('bez kofeínu', 'bez kofeinu'));
    return parts;
  }

  function displayedPack(product, variant) {
    if (variant?.label) return variant.label;
    return /\d+(?:[.,]\d+)?\s*(kg|g)\b/i.test(product.priceUnit || '') ? product.priceUnit : T('Balenie overte v e-shope', 'Balení ověřte v e-shopu');
  }

  /* A storage canister from the same shop, sized for the recommended pack. */
  function accessoryFor(product, variant) {
    const offer = Array.isArray(DATA.fullOffer) ? DATA.fullOffer : [];
    const STORE = /\bdóz[auy]?\b|\bdoz[auy]?\b|dóza|vákuov|vakuov|tightvac|airscape|coffeevac|turn-n-seal/i;
    const seen = new Set();
    const list = offer.filter((p) => p && p.available !== false && STORE.test(p.name || '') && !/matcha|čaj|ube|cukr/i.test(p.name || '') && Number.isFinite(p.priceAmount) && (p.currency || product.currency) === product.currency && !seen.has(p.url) && seen.add(p.url));
    if (!list.length) return null;
    const pack = variant?.grams || packOf(product);
    const capacity = (p) => p.coffeeCapacityGrams || Number(String(p.name).match(/(\d+)\s*g\b/i)?.[1]) || null;
    const candidates = list.flatMap((p) => Array.isArray(p.storageVariants) ? p.storageVariants
      .filter((v) => v.available !== false && Number.isFinite(v.price) && v.capacityGrams > 0)
      .map((v) => ({...p, name: `${p.name} · ${v.label}`, coffeeCapacityGrams: v.capacityGrams, priceAmount: v.price})) : [p]);
    const sized = pack ? candidates.filter((p) => capacity(p) >= pack) : candidates;
    if (!sized.length) return null;
    const pick = sized.slice().sort((a, b) => (capacity(a) || 1e6) - (capacity(b) || 1e6) || a.priceAmount - b.priceAmount)[0];
    return {product: pick, pack};
  }

  function renderResult() {
    advisor.classList.remove('is-questions');
    advisor.classList.add('is-result');
    const ranked = rank(state.answers);
    const best = ranked[0];
    if(!best){advisor.innerHTML='<div class="result"><h2>Takúto kombináciu v ponuke nemáme</h2><p>Žiadna overená káva nespĺňa tieto podmienky naraz. Upravte odpovede alebo niektorú otázku preskočte.</p><button class="ghost" type="button" id="restartEmpty">Zmeniť odpovede</button></div>';advisorFoot.hidden=true;$('#restartEmpty',advisor).addEventListener('click',resetAdvisor);return;}
    const current = state.chosen ? ranked.find((entry) => entry.product.id === state.chosen) || best : best;
    const product = current.product;
    const variant = pickVariant(product, state.answers);
    const priceLabel = variant ? variant.priceLabel || amountText(variant.price, product.currency) : product.price;
    const priceValue = variant ? variant.price : Number.isFinite(product.priceAmount) && !/^od\s/i.test(String(product.price || '')) ? product.priceAmount : null;
    const reasons = reasonsFor(product, state.answers, current, variant);
    const exactOthers = ranked.filter((entry) => entry.product.id !== product.id && !entry.unmet.length && baseName(entry.product) !== baseName(product));
    const altEntry = exactOthers.find((entry) => differenceOf(product, entry.product).length) || null;
    const alternative = altEntry ? {entry: altEntry, variant: pickVariant(altEntry.product, state.answers), diff: differenceOf(product, altEntry.product)} : null;
    const accessory = accessoryFor(product, variant);
    const acidityLabel = Number.isFinite(product.acidity)?acidityScale[product.acidity]:'Neuvedená';
    const whyText = typeof product.why === 'string' && !/^Vybran[áa] z aktuálnej ponuky|^Chuť:|^Chuťový profil:/i.test(product.why.trim()) ? product.why : '';

    const differences=current.unmet.map(key=>{
      const step=steps.find(step=>step.key===key),wanted=step?.options.find(option=>option.value===state.answers[key])?.title||'';
      const label={prep:'Príprava',caffeine:'Kofeín',taste:'Chuť',drink:'Spôsob pitia',acidity:'Acidita'}[key]||key;
      const offered=key==='prep'?product.bestFor||'Neuvedená':key==='taste'?product.notes.join(' · ')||'Neuvedená':key==='acidity'?acidityLabel:step?.options.filter(option=>(product[key]?.[option.value]??0)>=0.6).map(option=>option.title).join(' · ')||'Neuvedené';
      return {label,wanted,offered};
    });
    const altPrice = alternative ? (alternative.variant ? alternative.variant.priceLabel || amountText(alternative.variant.price, alternative.entry.product.currency) : alternative.entry.product.price) : '';
    const sum = accessory && Number.isFinite(priceValue) ? amountText(priceValue + accessory.product.priceAmount, product.currency) : '';
    advisor.innerHTML = `
      <div class="result">
        <span class="result__badge">${current.unmet.length ? 'Najbližšia možnosť' : product.id === best.product.id ? 'Odporúčam vám' : 'Vaša voľba'}</span>
        <div class="result__hero">
          <img class="result__photo" src="${esc(product.photo)}" alt="${esc(product.name)}" width="132" height="178">
          <div class="result__headline"><h2>${esc(product.name)}</h2>${product.line&&!variant?`<p>${esc(product.line)}</p>`:''}${variant?`<span class="result__variant">${esc(variant.label)}</span>`:''}<span class="result__price"><b>${esc(priceLabel)}</b>${!variant&&product.priceUnit?`<span>/ ${esc(product.priceUnit)}</span>`:''}</span>${variant?.ground?`<small class="result__weights">${esc(T('Predáva sa aj pomletá: ', 'Prodává se i mletá: ') + String(variant.ground.label || '').replace(/^\d+\s*g\s*·\s*/, '').toLowerCase() + ' · ' + (variant.ground.priceLabel || amountText(variant.ground.price, product.currency)))}</small>`:''}${product.roast ? `<small class="result__weights">${esc(product.roast)}</small>` : ''}</div>
        </div>
        <div class="result__body">
          ${reasons.length ? `<ul class="result__reasons">${reasons.map(([title, text]) => `<li><b>${esc(title)}</b><span>${esc(text)}</span></li>`).join('')}</ul>` : `<div class="notes">${product.notes.map((note) => `<span>${esc(note)}</span>`).join('')}</div>`}
          ${whyText ? `<div class="why"><p>${esc(whyText)}</p></div>` : ''}
          <div class="facts"><div class="fact"><b>${icons.drop} Acidita</b><span class="fact__value">${Number.isFinite(product.acidity)?dots(product.acidity):''} ${esc(acidityLabel)}</span></div><div class="fact"><b>${icons.cup} Príprava</b><span class="fact__value">${esc(product.bestFor || 'Neuvedená')}</span></div></div>
          ${differences.length?`<details class="result__differences"><summary>Rozdiely oproti vášmu výberu</summary><dl>${differences.map(item=>`<div><dt>${esc(item.label)}</dt><dd><small>Váš výber</small><span>${esc(item.wanted)}</span><small>Táto káva</small><span>${esc(item.offered)}</span></dd></div>`).join('')}</dl></details>`:''}
          ${product.bulk ? `<div class="bulk"><b>${esc(product.bulk.label)}</b><span>${esc(product.bulk.saving)}</span></div>` : ''}
          ${alternative ? `<div class="alt"><span>${T('Ak by ste chceli inú', 'Pokud byste chtěli jinou')}</span><button class="alt__card" type="button" data-product="${esc(alternative.entry.product.id)}"><img src="${esc(alternative.entry.product.photo)}" alt="" loading="lazy" width="42" height="58"><div><b>${esc(alternative.entry.product.name)}</b><small>${esc(displayedPack(alternative.entry.product, alternative.variant))}</small><small>${esc(alternative.diff.join('; ').replace(/^./, (c) => c.toUpperCase()))}.</small>${altPrice?`<strong class="alt__price">${esc(altPrice)}</strong>`:''}</div>${icons.arrow}</button></div>` : ''}
          ${accessory ? `<div class="result__addon"><span>${T('Hodí sa k nákupu · voliteľné', 'Hodí se k nákupu · volitelné')}</span><a class="addon__card" href="${esc(accessory.product.url)}" target="_blank" rel="noopener noreferrer">${accessory.product.photo?`<img src="${esc(accessory.product.photo)}" alt="" loading="lazy" width="42" height="58">`:''}<div><b>${esc(accessory.product.name)}</b><small>${esc(accessory.pack ? T(`Na uskladnenie otvoreného ${accessory.pack >= 1000 ? accessory.pack / 1000 + ' kg' : accessory.pack + ' g'} balenia.`, `Na uskladnění otevřeného ${accessory.pack >= 1000 ? accessory.pack / 1000 + ' kg' : accessory.pack + ' g'} balení.`) : T('Na uskladnenie otvoreného balenia.', 'Na uskladnění otevřeného balení.'))}</small><strong class="alt__price">${esc(amountText(accessory.product.priceAmount, product.currency) || accessory.product.price)}</strong>${sum?`<small class="addon__sum">${esc(T(`Káva + dóza: ${sum} za produkty.`, `Káva + dóza: ${sum} za produkty.`))}</small>`:''}</div>${icons.arrow}</a></div>` : ''}
        </div>
      </div>`;

    advisorFoot.hidden = false;
    advisorFoot.innerHTML = `<button class="cta" type="button" id="addToCart">Otvoriť v e-shope ${icons.shop}</button><div class="foot-row"><button class="ghost" type="button" id="restart">Zmeniť odpovede</button></div>`;

    const addButton = $('#addToCart');
    addButton.addEventListener('click', () => window.open(product.url || brand.shopUrl, '_blank', 'noopener,noreferrer'));
    $('#restart').addEventListener('click', resetAdvisor);
    const exact=ranked.filter(e=>!e.unmet.length);
    if(exact.filter(e=>e.product.id!==product.id).length){
      const more=document.createElement('details');more.className='coffee-more-matches';
      const title=document.createElement('summary');title.textContent='Ďalšie kávy spĺňajúce váš výber ('+exact.filter(e=>e.product.id!==product.id).length+')';more.append(title);
      const list=document.createElement('div');let count=0;
      function append(){const rows=exact.filter(e=>e.product.id!==product.id).slice(count,count+24);for(const row of rows){const p=row.product;const v=pickVariant(p,state.answers);const link=document.createElement('a');link.href=p.url;link.target='_blank';link.rel='noopener noreferrer';link.className='coffee-match-link';link.innerHTML='<img src="'+esc(p.photo)+'" alt="" loading="lazy"><span><b>'+esc(p.name)+'</b><small>'+esc(displayedPack(p,v))+'</small><small>'+esc(p.notes.join(' · '))+'</small><strong>'+esc(v ? v.priceLabel || amountText(v.price,p.currency) : p.price)+'</strong></span>';list.append(link);}count+=rows.length;}
      append();more.append(list);if(exact.filter(e=>e.product.id!==product.id).length>count){const next=document.createElement('button');next.className='ghost';next.type='button';next.textContent='Načítať ďalšie';next.addEventListener('click',()=>{append();if(count>=exact.filter(e=>e.product.id!==product.id).length)next.remove();});more.append(next);}advisor.append(more);
    }
    const alternativeButton = $('.alt__card', advisor);
    if (alternativeButton) alternativeButton.addEventListener('click', () => { state.chosen = alternativeButton.dataset.product; renderResult(); advisor.scrollTop = 0; });
  }

  function updateScrollHint() {
    const hasMore = state.stage === 'result' && advisor.scrollHeight - advisor.clientHeight - advisor.scrollTop > 4;
    advisorScreen.classList.toggle('has-more', hasMore);
  }

  function renderAdvisor() {
    updateProgress();
    if (state.stage === 'questions') renderQuestion(); else renderResult();
    advisor.scrollTop = 0;
    requestAnimationFrame(updateScrollHint);
  }

  function resetAdvisor() {
    state.step = 0;
    state.answers = {};
    state.stage = 'questions';
    state.chosen = null;
    state.busy = false;
    renderAdvisor();
  }

  advisor.addEventListener('scroll', updateScrollHint, { passive:true });
  addEventListener('resize', updateScrollHint);

  function addMessage(html, fromUser = false) {
    const row = document.createElement('div');
    row.className = `msg${fromUser ? ' msg--user' : ''}`;
    row.innerHTML = `${fromUser ? '' : `<span class="msg__avatar"><img src="${esc(demo.logoAvatar || demo.logoHeader)}" width="26" height="26" alt="${esc(brand.name)}"></span>`}<div class="bubble">${html}</div>`;
    chatLog.appendChild(row);
    requestAnimationFrame(() => { chatLog.scrollTop = chatLog.scrollHeight; });
    return row;
  }

  function showTyping() {
    const row = document.createElement('div');
    row.className = 'msg';
    row.id = 'typing';
    row.innerHTML = `<span class="msg__avatar"><img src="${esc(demo.logoAvatar || demo.logoHeader)}" width="26" height="26" alt=""></span><div class="bubble typing"><i></i><i></i><i></i></div>`;
    chatLog.appendChild(row);
    requestAnimationFrame(() => { chatLog.scrollTop = chatLog.scrollHeight; });
  }

  function linkReply(text){return esc(text).replace(/https:\/\/[^\s<>]+/g,url=>(DATA.fullOffer||products).some(p=>esc(p.url)===url)?`<a href="${url}" target="_blank" rel="noopener noreferrer">Pozrieť v e-shope ↗</a>`:url).replace(/\n/g,'<br>');}
  function fallbackAnswer(text) {
    const catalogue=globalThis.CX_COFFEE_CATALOGUES?.[demo.id];
    const grounded=catalogue&&globalThis.CXCoffeeReplyCore?.(catalogue,text,state.history);
    if(grounded)return linkReply(grounded);
    /* Matching ignores diacritics and understands the Czech spelling of the same words. */
    const fold = (value) => String(value ?? '').normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
    const query = fold(text).replace(/filtr(?!e)/g, 'filter').replace(/mlek/g, 'mliek').replace(/neco/g, 'nieco').replace(/netradicniho/g, 'netradicne');
    const hit = fallbacks.find((entry) => entry.match.some((needle) => query.includes(fold(needle))));
    const product = hit && byId[hit.product];
    if (product) return `${esc(hit.lead)} <b>${esc(product.name)}</b>. ${esc(product.why)} ${esc(product.price)}.${demo.productOptionPhotos?` Balenie ${esc(product.priceUnit)}. <a href="${esc(product.url)}" target="_blank" rel="noopener noreferrer">Pozrieť v e-shope ↗</a>`:''}`;

    /* What is left used to be answered with "Rád vám poradím konkrétnu kávu",
       which names nothing and reads to an owner as if the advisor knows only
       the four questions it was given. The questions every shop is asked are
       answered from this roastery's own catalogue instead. */
    if (/odkia|odkud|povod|puvod|pestuj|farm|krajin|zeme|plantaz/.test(query)) {
      const named = products.filter((item) => item.line).slice(0, 3)
        .map((item) => `${item.name} (${item.line})`);
      if (named.length) {
        return `Pôvod je uvedený pri každej káve — napríklad ${esc(named.join(', '))}. `
          + 'Napíšte, akú chuť hľadáte, a vyberiem jednu konkrétnu.';
      }
    }
    if (/cena|ceny|cenu|kolko|kolik|stoj|draho|lacn|levn/.test(query)) {
      const weights = heroProduct.weights ? ` (${heroProduct.weights})` : '';
      return `Ceny sa líšia podľa gramáže — <b>${esc(heroProduct.name)}</b> je `
        + `${esc(heroProduct.price)} / ${esc(heroProduct.priceUnit || 'balenie')}${esc(weights)}. `
        + 'Cez krátky výber vyberiem tú, ktorá vám sadne, aj s cenou.';
    }
    if (/porovna|srovna|rozdiel|rozdil|leps|ktora|ktoru|ktera|kterou/.test(query)) {
      const [first, second] = products;
      if (first && second) {
        return `<b>${esc(first.name)}</b>: ${esc(first.why)} <b>${esc(second.name)}</b>: ${esc(second.why)}`;
      }
    }
    return `Z ponuky by som začal kávou <b>${esc(heroProduct.name)}</b>. ${esc(heroProduct.why)} `
      + 'Cez štyri krátke otázky vo Výbere kávy vyberiem jednu konkrétnu aj s dôvodom.';
  }

  /* Two bounds, not one. The request gets long enough for a real model reply;
     the visitor gets an answer well before that whether it arrives or not. */
  const AI_TIMEOUT_MS = 12000;
  const PATIENCE_MS = 4500;

  async function requestReply(text) {
    const abort = new AbortController();
    const timer = setTimeout(() => abort.abort(), AI_TIMEOUT_MS);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ demoId: demo.id, messages: state.history.slice(-10) }),
        signal: abort.signal
      });
      if (!response.ok) throw new Error(`AI unavailable: ${response.status}`);
      const payload = await response.json();
      if (typeof payload.reply !== 'string' || payload.reply.trim() === '') throw new Error('Empty reply');
      return linkReply(payload.reply);
    } finally {
      clearTimeout(timer);
    }
  }

  function setChipsDisabled(disabled) { $$('.chip').forEach((chip) => { chip.disabled = disabled; }); }

  async function send(text) {
    const value = String(text ?? '').trim();
    if (!value || state.busy) return;
    startChat();
    const generation=state.generation||0;
    state.busy = true;
    addMessage(esc(value), true);
    input.value = '';
    showTyping();
    setChipsDisabled(true);
    state.history.push({ role: 'user', content: value });

    /* The answer this demo can always give is settled before the request goes
       out, and it is put on screen as soon as waiting would start to read as
       silence. The model's reply replaces it whenever it arrives. There is no
       path where the visitor asks and gets nothing back. */
    const offline = fallbackAnswer(value);
    const pending = requestReply(value).catch(() => '');
    const patience = new Promise((resolve) => setTimeout(() => resolve(null), PATIENCE_MS));

    const raced = await Promise.race([pending, patience]);
    if(generation!==(state.generation||0))return;
    $('#typing')?.remove();
    const shown = raced || offline;
    const row = addMessage(shown);
    const historyEntry={ role: 'assistant', content: shown.replace(/<[^>]*>/g, '') };
    state.history.push(historyEntry);

    /* The answer is on screen, so the chat is free again — a request still in
       flight upgrades this one bubble in the background. */
    state.busy = false;
    setChipsDisabled(false);

    if (!raced) {
      const late = await pending;
      if (late && generation===(state.generation||0)) {
        row.querySelector('.bubble').innerHTML = late;
        historyEntry.content = late.replace(/<[^>]*>/g, '');
      }
    }
  }

  function renderChips() {
    $('#chips').innerHTML = chatCopy.chips.map((label) => `<button class="chip" type="button">${esc(label)}</button>`).join('');
    $$('.chip').forEach((chip) => chip.addEventListener('click', () => send(chip.textContent)));
  }

  function seedChat() { state.generation=(state.generation||0)+1;state.busy=false;chatLog.innerHTML = ''; state.history = []; addMessage(esc(chatCopy.welcome));renderChips(); }

  $('#heroOpen').addEventListener('click', openWidget);
  openButton.addEventListener('click', openWidget);
  $('#teaserOpen').addEventListener('click', openWidget);
  $('#teaserClose').addEventListener('click', () => { teaser.hidden = true; teaser.classList.remove('is-visible'); state.teaserDismissed = true; });
  $('#close').addEventListener('click', closeWidget);
  $('#entry').addEventListener('click', () => setMode('advisor'));
  $('#reset').addEventListener('click', () => { resetAdvisor(); resetChat(); seedChat(); setMode('advisor'); });
  $('#back').addEventListener('click', () => {
    if (state.stage !== 'questions') { state.stage = 'questions'; state.step = steps.length - 1; state.chosen = null; }
    else if (state.step > 0) state.step -= 1;
    state.busy = false;
    renderAdvisor();
  });
  $$('.mode__button').forEach((button) => button.addEventListener('click', () => setMode(button.dataset.mode)));
  composer.addEventListener('submit', (event) => { event.preventDefault(); send(input.value); });

  renderChips();
  resetChat();
  seedChat();
  renderAdvisor();
  document.documentElement.dataset.coffeeReleaseReady = 'true';
  window.__COFFEE_CLEAN_READY__ = true;

  setTimeout(() => {
    if (!widget.classList.contains('is-open') && !state.teaserDismissed) teaser.classList.add('is-visible');
  }, 1200);
})();

