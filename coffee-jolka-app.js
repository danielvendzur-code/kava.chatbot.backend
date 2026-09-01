/**
 * Shared clean coffee advisor runtime.
 *
 * The DOM contract deliberately mirrors the approved Jolka implementation so
 * every branded demo inherits the same geometry, interaction model and mobile
 * behaviour from /jolka/jolka.css. Brand files provide only data and theme.
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

  const { brand, acidityScale = ['minimálna', 'jemná', 'stredná', 'výrazná'], products, steps, chat: chatCopy, fallbacks = [] } = DATA;
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

  const WEIGHTS = { taste: 3.2, prep: 2.4, drink: 2.0, acidity: 2.6 };
  const MAX_SCORE = WEIGHTS.taste + WEIGHTS.prep + WEIGHTS.drink + WEIGHTS.acidity;
  const ACIDITY_TARGET = { none: 0, mild: 1, bright: 3 };

  function score(product, answers) {
    let total = 0;
    if (answers.taste) total += WEIGHTS.taste * (product.taste?.[answers.taste] ?? 0);
    if (answers.prep) total += WEIGHTS.prep * (product.prep?.[answers.prep] ?? 0);
    if (answers.drink) total += WEIGHTS.drink * (product.drink?.[answers.drink] ?? 0);
    if (answers.acidity) {
      if (answers.acidity === 'explore') {
        total += WEIGHTS.acidity * (product.explore ?? 0);
      } else {
        const target = ACIDITY_TARGET[answers.acidity];
        const acidity = Number.isFinite(product.acidity) ? product.acidity : 1;
        const distance = Math.abs(target - acidity);
        total += WEIGHTS.acidity * (1 - distance / 3);
      }
    }
    if (product.decaf) total -= 1.6;
    return total;
  }

  function rank(answers) {
    return products
      .map((product) => ({ product, value: score(product, answers) }))
      .sort((left, right) => right.value - left.value || left.product.name.localeCompare(right.product.name, 'sk'));
  }

  function matchPercent(value) {
    return Math.max(62, Math.min(97, Math.round(50 + (value / MAX_SCORE) * 47)));
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
    teaserDismissed: false
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
        <span class="demo-flag"><i class="dot"></i> Návrh AI poradcu · ukážka</span>
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
            <div>
              <small>Odporúčanie</small>
              <b>${esc(heroProduct.name)}</b>
              <span>${esc(heroProduct.notes.slice(0, 2).join(' · '))}</span>
            </div>
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
        <button class="launcher__teaser-body" id="teaserOpen" type="button">
          <b>${esc(demo.teaserTitle)}</b>
          <span>${esc(demo.teaserText)}</span>
        </button>
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
          <div>
            <b>${esc(brand.name)}</b>
            <span><i></i> ${esc(demo.advisorLabel)}</span>
          </div>
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
            <span class="entry__copy">
              <small>${esc(demo.entryKicker)}</small>
              <b>${esc(demo.entryTitle)}</b>
              <span>${esc(demo.entryText)}</span>
            </span>
            <span class="entry__arrow">${icons.arrow}</span>
          </button>
          <div class="chat" id="chat" role="log" aria-live="polite"></div>
          <div class="composer-area">
            <div class="chips" id="chips"></div>
            <form class="composer" id="composer">
              <div class="composer__field">
                <input id="input" type="text" autocomplete="off" placeholder="${esc(chatCopy.placeholder)}" aria-label="Napíšte otázku o káve">
              </div>
              <button class="send" type="submit" aria-label="Odoslať správu">${icons.send}</button>
            </form>
          </div>
        </section>
      </div>

      <p class="widget__note">Chatbot dodáva <a href="https://mojchatbot.sk" target="_blank" rel="noreferrer">${esc(brand.author || 'mojchatbot.sk')}</a></p>
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
  const input = $('#input');
  const FOCUSABLE = 'button:not([disabled]), a[href], input, [tabindex]:not([tabindex="-1"])';

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
    if (event.key === 'Escape') {
      event.preventDefault();
      closeWidget();
      return;
    }
    if (event.key !== 'Tab') return;
    const items = $$(FOCUSABLE, widget).filter((element) => element.offsetParent !== null || element === document.activeElement);
    if (!items.length) return;
    const first = items[0];
    const last = items.at(-1);
    if (event.shiftKey && (document.activeElement === first || document.activeElement === widget)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
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
    else if (focusInput && matchMedia('(min-width: 641px)').matches) requestAnimationFrame(() => input.focus());
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

  function optionVisual(option) {
    const product = option.product ? byId[option.product] : null;
    const source = option.photo || product?.tile || product?.photo || demo.entryImage;
    return `<span class="option__visual"><img src="${esc(source)}" alt="" loading="lazy" width="240" height="192"></span>`;
  }

  function renderQuestion() {
    const step = steps[state.step];
    const selected = state.answers[step.key];
    advisor.innerHTML = `
      <div class="question"><h2>${esc(step.title)}</h2></div>
      <div class="options" role="group" aria-label="${esc(step.title)}">
        ${step.options.map((option, index) => {
          const isSelected = selected === option.value;
          return `<button class="option${isSelected ? ' is-selected' : ''}" type="button" data-value="${esc(option.value)}" aria-pressed="${isSelected}" style="--reveal:${index * 70}ms">
            ${optionVisual(option)}
            <span class="option__copy"><b>${esc(option.title)}</b><small>${esc(option.detail)}</small></span>
            <span class="option__mark">${icons.check}</span>
          </button>`;
        }).join('')}
      </div>`;

    advisorFoot.hidden = true;
    advisorFoot.innerHTML = '';
    $$('.option', advisor).forEach((button) => button.addEventListener('click', () => select(button.dataset.value)));
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
    }, 340);
  }

  function renderResult() {
    const ranked = rank(state.answers);
    const best = ranked[0];
    const current = state.chosen ? ranked.find((entry) => entry.product.id === state.chosen) || best : best;
    const product = current.product;
    const alternative = ranked.find((entry) => entry.product.id !== product.id);
    const acidityLabel = acidityScale[product.acidity] || acidityScale[1] || 'jemná';

    advisor.innerHTML = `
      <div class="result">
        <span class="result__badge">${product.id === best.product.id ? 'Najlepšia zhoda' : 'Vaša voľba'} · ${matchPercent(current.value)} %</span>
        <div class="result__hero">
          <img class="result__photo" src="${esc(product.photo)}" alt="${esc(product.name)}" width="132" height="178">
          <div class="result__headline">
            <h2>${esc(product.name)}</h2>
            <p>${esc(product.line)}</p>
            <span class="result__price"><b>${esc(product.price)}</b><span>/ ${esc(product.priceUnit)}</span></span>
            <small class="result__weights">${esc(product.weights)}${product.priceFrom ? ` · ${esc(product.priceFrom)}` : ''}${product.roast ? ` · ${esc(product.roast)}` : ''}</small>
          </div>
        </div>
        <div class="result__body">
          <div class="notes">${product.notes.map((note) => `<span>${esc(note)}</span>`).join('')}</div>
          <div class="why"><b>Prečo práve táto</b><p>${esc(product.why)}</p></div>
          <div class="facts">
            <div class="fact"><b>${icons.drop} Acidita</b><span class="fact__value">${dots(product.acidity)} ${esc(acidityLabel)}</span></div>
            <div class="fact"><b>${icons.cup} Príprava</b><span class="fact__value">${esc(product.bestFor)}</span></div>
          </div>
          <p class="acidity-note">${esc(product.acidityNote)}</p>
          ${product.bulk ? `<div class="bulk"><b>${esc(product.bulk.label)}</b><span>${esc(product.bulk.saving)}</span></div>` : ''}
          ${alternative ? `<div class="alt">
            <span>Ak by ste chceli inú</span>
            <button class="alt__card" type="button" data-product="${esc(alternative.product.id)}">
              <img src="${esc(alternative.product.photo)}" alt="" loading="lazy" width="42" height="58">
              <div><b>${esc(alternative.product.name)}</b><small>${esc(alternative.product.notes.slice(0, 2).join(' · '))} · ${matchPercent(alternative.value)} % zhoda</small></div>
              ${icons.arrow}
            </button>
          </div>` : ''}
        </div>
      </div>`;

    advisorFoot.hidden = false;
    advisorFoot.innerHTML = `
      <button class="cta" type="button" id="addToCart">Pridať do košíka ${icons.shop}</button>
      <div class="foot-row">
        <a class="foot-link" href="${esc(product.url)}" target="_blank" rel="noreferrer" id="productCta">Detail produktu</a>
        <button class="ghost" type="button" id="restart">Zmeniť odpovede</button>
      </div>
      <p class="cart-note" role="status" hidden></p>`;

    const addButton = $('#addToCart');
    const cartNote = $('.cart-note', advisorFoot);
    addButton.addEventListener('click', () => {
      if (addButton.classList.contains('is-added')) return;
      addButton.classList.add('is-added');
      addButton.innerHTML = `Pridané do košíka ${icons.check}`;
      cartNote.textContent = `${product.name} je v košíku.`;
      cartNote.hidden = false;
    });
    $('#restart').addEventListener('click', resetAdvisor);
    const alternativeButton = $('.alt__card', advisor);
    if (alternativeButton) {
      alternativeButton.addEventListener('click', () => {
        state.chosen = alternativeButton.dataset.product;
        renderResult();
        advisor.scrollTop = 0;
      });
    }
  }

  function updateScrollHint() {
    const hasMore = advisor.scrollHeight - advisor.clientHeight - advisor.scrollTop > 4;
    advisorScreen.classList.toggle('has-more', hasMore);
  }

  function renderAdvisor() {
    updateProgress();
    if (state.stage === 'questions') renderQuestion();
    else renderResult();
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

  advisor.addEventListener('scroll', updateScrollHint, { passive: true });
  addEventListener('resize', updateScrollHint);

  function addMessage(html, fromUser = false) {
    const row = document.createElement('div');
    row.className = `msg${fromUser ? ' msg--user' : ''}`;
    row.innerHTML = `${fromUser ? '' : `<span class="msg__avatar"><img src="${esc(demo.logoHeader)}" width="26" height="26" alt="Poradca"></span>`}<div class="bubble">${html}</div>`;
    chatLog.appendChild(row);
    requestAnimationFrame(() => { chatLog.scrollTop = chatLog.scrollHeight; });
    return row;
  }

  function showTyping() {
    const row = document.createElement('div');
    row.className = 'msg';
    row.id = 'typing';
    row.innerHTML = `<span class="msg__avatar"><img src="${esc(demo.logoHeader)}" width="26" height="26" alt=""></span><div class="bubble typing"><i></i><i></i><i></i></div>`;
    chatLog.appendChild(row);
    requestAnimationFrame(() => { chatLog.scrollTop = chatLog.scrollHeight; });
  }

  function fallbackAnswer(text) {
    const query = text.toLocaleLowerCase('sk');
    const hit = fallbacks.find((entry) => entry.match.some((needle) => query.includes(needle)));
    if (!hit) return 'Rád vám poradím konkrétnu kávu. Najpresnejšie to pôjde cez krátky výber — štyri otázky na chuť, prípravu a aciditu.';
    const product = byId[hit.product];
    if (!product) return 'Rád vám poradím konkrétnu kávu. Skúste krátky výber a podľa odpovedí vyberiem jednu konkrétnu.';
    return `${esc(hit.lead)} <b>${esc(product.name)}</b>. ${esc(product.why)} ${esc(product.price)}.`;
  }

  async function requestReply(text) {
    state.history.push({ role: 'user', content: text });
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ demoId: demo.id, messages: state.history.slice(-10) })
    });
    if (!response.ok) throw new Error(`AI unavailable: ${response.status}`);
    const payload = await response.json();
    if (typeof payload.reply !== 'string' || payload.reply.trim() === '') throw new Error('Empty reply');
    state.history.push({ role: 'assistant', content: payload.reply });
    return esc(payload.reply);
  }

  function setChipsDisabled(disabled) {
    $$('.chip').forEach((chip) => { chip.disabled = disabled; });
  }

  async function send(text) {
    const value = String(text ?? '').trim();
    if (!value || state.busy) return;
    state.busy = true;
    addMessage(esc(value), true);
    input.value = '';
    showTyping();
    setChipsDisabled(true);
    try {
      const reply = await requestReply(value);
      $('#typing')?.remove();
      addMessage(reply);
    } catch (_) {
      await new Promise((resolve) => setTimeout(resolve, 380));
      $('#typing')?.remove();
      addMessage(fallbackAnswer(value));
    } finally {
      state.busy = false;
      setChipsDisabled(false);
    }
  }

  function renderChips() {
    $('#chips').innerHTML = chatCopy.chips.map((label) => `<button class="chip" type="button">${esc(label)}</button>`).join('');
    $$('.chip').forEach((chip) => chip.addEventListener('click', () => send(chip.textContent)));
  }

  function seedChat() {
    chatLog.innerHTML = '';
    state.history = [];
    addMessage(esc(chatCopy.welcome));
  }

  $('#heroOpen').addEventListener('click', openWidget);
  openButton.addEventListener('click', openWidget);
  $('#teaserOpen').addEventListener('click', openWidget);
  $('#teaserClose').addEventListener('click', () => {
    teaser.hidden = true;
    teaser.classList.remove('is-visible');
    state.teaserDismissed = true;
  });
  $('#close').addEventListener('click', closeWidget);
  $('#entry').addEventListener('click', () => setMode('advisor'));
  $('#reset').addEventListener('click', () => {
    resetAdvisor();
    seedChat();
    setMode('advisor');
  });
  $('#back').addEventListener('click', () => {
    if (state.stage !== 'questions') {
      state.stage = 'questions';
      state.step = steps.length - 1;
      state.chosen = null;
    } else if (state.step > 0) {
      state.step -= 1;
    }
    state.busy = false;
    renderAdvisor();
  });
  $$('.mode__button').forEach((button) => button.addEventListener('click', () => setMode(button.dataset.mode)));
  $('#composer').addEventListener('submit', (event) => {
    event.preventDefault();
    send(input.value);
  });

  renderChips();
  seedChat();
  renderAdvisor();
  document.documentElement.dataset.coffeeReleaseReady = 'true';
  window.__COFFEE_CLEAN_READY__ = true;

  setTimeout(() => {
    if (!widget.classList.contains('is-open') && !state.teaserDismissed) teaser.classList.add('is-visible');
  }, 1200);
})();
