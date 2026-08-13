/**
 * Pražiareň Jolka — AI coffee advisor.
 *
 * Single entry point: renders the owner-facing landing, the launcher and the
 * widget (chat + advisor). Data comes from jolka-data.js, which is sourced from
 * the roastery's own store. No post-render DOM patching, no !important overrides.
 */
(() => {
  'use strict';

  const DATA = window.JOLKA;
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  if (!DATA) {
    document.body.textContent = 'Ukážka sa nenačítala.';
    return;
  }

  const { brand, acidityScale, products, steps, chat: chatCopy, fallbacks } = DATA;
  const byId = Object.fromEntries(products.map((p) => [p.id, p]));

  /* ---------------------------------------------------------------- icons */

  const stroke = (d) => `<path d="${d}" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>`;
  const svg = (body, box = 24) => `<svg viewBox="0 0 ${box} ${box}" aria-hidden="true" focusable="false">${body}</svg>`;

  const icons = {
    arrow: svg(stroke('M5 12h13M13 6l6 6-6 6')),
    back: svg(stroke('M15 18l-6-6 6-6')),
    close: svg(stroke('M6 6l12 12M18 6L6 18')),
    reset: svg(stroke('M19.5 12a7.5 7.5 0 1 1-2.2-5.3M19 4v4.5h-4.5')),
    send: svg(stroke('M4.5 12h13M4.5 12 3 4.5 20.5 12 3 19.5 4.5 12Z')),
    check: svg(stroke('M5 12.5 9.5 17 19 7')),
    cup: svg(stroke('M5 8h11v6a5 5 0 0 1-5 5H10a5 5 0 0 1-5-5V8ZM16 10h1.8a2.2 2.2 0 0 1 0 4.4H16M4 22h13')),
    drop: svg(stroke('M12 3.5c3.4 3.6 5.5 6.3 5.5 9a5.5 5.5 0 1 1-11 0c0-2.7 2.1-5.4 5.5-9Z')),
    bean: svg(stroke('M17.5 6.5a7.8 7.8 0 1 1-11 11 7.8 7.8 0 0 1 11-11ZM6.7 17.3c3.2-1.2 3.6-3.9 2.6-6.2-1-2.4-.5-4.6 2.2-6.1M17.3 6.7c-3.2 1.2-3.6 3.9-2.6 6.2 1 2.4.5 4.6-2.2 6.1')),
    // preparation glyphs, drawn to match the icon language printed on Jolka bags
    automat: svg(stroke('M4 4h16v6.5a3 3 0 0 1-3 3h-1.5M4 4v10a3 3 0 0 0 3 3h1M8.5 8h7M10 17h4v3a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-3ZM6 22h12')),
    lever: svg(stroke('M4.5 4h15v5.5a3.5 3.5 0 0 1-3.5 3.5H8a3.5 3.5 0 0 1-3.5-3.5V4ZM8.5 13v2.5h7V13M12 15.5v2M9 20.5h6M8 8h8')),
    moka: svg(stroke('M8 3.5h6l1.5 6h-9L8 3.5ZM6.5 9.5h9l1.2 8a3 3 0 0 1-3 3.4H8.3a3 3 0 0 1-3-3.4l1.2-8ZM16.7 11.5l3.3-2v6l-3.3-2')),
    filter: svg(stroke('M5.5 6.5h13l-4.2 6.2v5.1l-4.6 2.2v-7.3L5.5 6.5ZM8 3.2c1.2 1 2.8 1 4 0s2.8-1 4 0')),
    black: svg(stroke('M5 8h11v6a5 5 0 0 1-5 5H10a5 5 0 0 1-5-5V8ZM16 10h1.8a2.2 2.2 0 0 1 0 4.4H16M4 22h13M8.5 4.5c.8-.8.8-1.6 0-2.4M12 4.5c.8-.8.8-1.6 0-2.4')),
    milk: svg(stroke('M8 2.5h8l1 4.5v12a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V7l1-4.5ZM7 8h10M9.5 12.5c1.7 1.6 3.3 1.6 5 0')),
    both: svg(stroke('M3.5 8h7v5.5a3 3 0 0 1-3 3h-1a3 3 0 0 1-3-3V8ZM13.5 8h7v5.5a3 3 0 0 1-3 3h-1a3 3 0 0 1-3-3V8ZM10.5 10h1.2a1.6 1.6 0 0 1 0 3.2h-1.2M20.5 10h.4a1.6 1.6 0 0 1 0 3.2h-.4M3 20h18')),
    explore: svg(stroke('M12 3.2 13.9 9l6.1.1-4.9 3.6 1.8 5.9L12 15.1l-4.9 3.5L8.9 12.7 4 9.1 10.1 9 12 3.2Z')),
    shop: svg(stroke('M4.5 8.5h15l-1 11.5a1.5 1.5 0 0 1-1.5 1.4H7a1.5 1.5 0 0 1-1.5-1.4L4.5 8.5ZM8.5 8.5V6a3.5 3.5 0 1 1 7 0v2.5'))
  };

  const glyph = (name) => icons[name] || icons.bean;

  const dots = (level) =>
    `<span class="dots" aria-hidden="true">${[0, 1, 2, 3]
      .map((i) => `<i class="${i <= level ? 'on' : ''}"></i>`)
      .join('')}</span>`;

  const esc = (value) =>
    String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* ------------------------------------------------------------- scoring */

  const WEIGHTS = { taste: 3.2, prep: 2.4, drink: 2.0, acidity: 2.6 };
  const MAX_SCORE = WEIGHTS.taste + WEIGHTS.prep + WEIGHTS.drink + WEIGHTS.acidity;
  const ACIDITY_TARGET = { none: 0, mild: 1, bright: 3 };

  /**
   * Weighted, deterministic. Every answer contributes to every product, so the
   * recommendation comes from the combination — not from a single option.
   */
  function score(product, answers) {
    let total = 0;
    if (answers.taste) total += WEIGHTS.taste * (product.taste[answers.taste] ?? 0);
    if (answers.prep) total += WEIGHTS.prep * (product.prep[answers.prep] ?? 0);
    if (answers.drink) total += WEIGHTS.drink * (product.drink[answers.drink] ?? 0);
    if (answers.acidity) {
      if (answers.acidity === 'explore') {
        total += WEIGHTS.acidity * product.explore;
      } else {
        const distance = Math.abs(ACIDITY_TARGET[answers.acidity] - product.acidity);
        total += WEIGHTS.acidity * (1 - distance / 3);
      }
    }
    // Decaf is chosen through chat, never pushed on someone who did not ask.
    if (product.decaf) total -= 1.6;
    return total;
  }

  function rank(answers) {
    return products
      .map((product) => ({ product, value: score(product, answers) }))
      .sort((a, b) => b.value - a.value || a.product.name.localeCompare(b.product.name, 'sk'));
  }

  function matchPercent(value) {
    return Math.max(62, Math.min(97, Math.round(50 + (value / MAX_SCORE) * 47)));
  }

  /* --------------------------------------------------------------- state */

  const state = {
    mode: 'advisor',
    step: 0,
    answers: {},
    stage: 'questions',
    chosen: null,
    busy: false,
    history: [],
    lastFocus: null
  };

  /* --------------------------------------------------------------- shell */

  const heroProduct = byId['zmes-jolka'];

  document.getElementById('jolka-root').innerHTML = `
    <main class="page">
      <header class="topbar">
        <div class="lockup">
          <img src="/assets/jolka/logo-ink.webp" width="52" height="52" alt="Pražiareň Jolka">
          <span class="lockup__text"><b>${esc(brand.name)}</b><span>${esc(brand.place)}</span></span>
        </div>
        <span class="demo-flag"><i class="dot"></i> Návrh AI poradcu · ukážka</span>
      </header>

      <section class="hero">
        <div class="hero__copy">
          <span class="eyebrow">Pre tím Pražiarne Jolka</span>
          <h1>Vitajte vo vašom návrhu AI poradcu pre Pražiareň Jolka.</h1>
          <p class="hero__lead">Takto môže zákazníkovi vysvetliť rozdiel medzi klasickými zmesami a výberovou kávou a odporučiť konkrétny produkt.</p>

          <div class="benefits">
            <article class="benefit"><span class="benefit__num">01</span><div><b>Menej váhania</b><span>Zákazník dostane jednu konkrétnu kávu, nie zoznam.</span></div></article>
            <article class="benefit"><span class="benefit__num">02</span><div><b>Menej otázok</b><span>Aciditu, praženie aj prípravu vysvetlí poradca.</span></div></article>
            <article class="benefit"><span class="benefit__num">03</span><div><b>Priamy nákupný krok</b><span>Odporúčanie vedie rovno na produkt v e-shope.</span></div></article>
          </div>

          <div class="hero__actions">
            <button class="cta" id="heroOpen" type="button">Otvoriť ukážku poradcu ${icons.arrow}</button>
            <span class="hero__hint">Funguje s reálnou ponukou Jolky, overenou ${esc(brand.verifiedOn)}.</span>
          </div>
        </div>

        <aside class="showcase" aria-label="Ukážka odporúčania">
          <div class="showcase__frame">
            <span class="showcase__tag">Vaša ponuka v poradcovi</span>
            <img class="showcase__photo" src="/assets/jolka/hero-bags.webp" width="878" height="920" alt="Balenia kávy Pražiarne Jolka">
          </div>
          <div class="showcase__card">
            <img src="${heroProduct.photo}" width="54" height="76" alt="" loading="lazy">
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
          <li><b>Poradí 24/7</b><span>Aj v nedeľu o polnoci, keď nemá kto odpísať.</span></li>
          <li><b>Odbúra otázky</b><span>Acidita, praženie a mletie vysvetlené hneď v chate.</span></li>
          <li><b>Zvyšuje hodnotu košíka</b><span>Ukáže väčšie balenie aj druhú vhodnú kávu.</span></li>
          <li><b>Vedie k nákupu</b><span>Z odporúčania jedným klikom na produkt.</span></li>
        </ul>
        <p class="page__by">Návrh pripravil <a href="https://mojchatbot.sk" target="_blank" rel="noreferrer">mojchatbot.sk</a> · ukážka pre Pražiareň Jolka</p>
      </footer>
    </main>

    <div class="launcher" id="launcher">
      <button class="launcher__teaser" id="teaser" type="button">
        <b>Neviete, ktorú kávu vybrať?</b>
        <span>Za štyri otázky nájdeme tú vašu.</span>
      </button>
      <button class="launcher__button" id="open" type="button" aria-label="Otvoriť kávového poradcu" aria-expanded="false" aria-controls="widget">
        <img src="/assets/jolka/logo-badge.webp" width="52" height="52" alt="">
      </button>
    </div>

    <section class="widget" id="widget" role="dialog" aria-modal="true" aria-label="Kávový poradca Pražiareň Jolka" aria-hidden="true" tabindex="-1">
      <header class="widget__header">
        <div class="widget__brand">
          <img src="/assets/jolka/logo-cream.webp" width="40" height="40" alt="">
          <div>
            <b>${esc(brand.name)}</b>
            <span><i></i> Kávový poradca</span>
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
              <div class="advisor-top__copy"><b id="stepTitle">Krok 1 zo 4</b><span id="stepName">Chuť</span></div>
            </div>
            <div class="progress" id="progress" aria-hidden="true"></div>
          </div>
          <div class="advisor" id="advisor" aria-live="polite"></div>
          <div class="advisor-foot" id="advisorFoot" hidden></div>
        </section>

        <section class="screen" id="chatScreen" aria-label="Chat">
          <button class="entry" id="entry" type="button">
            <span class="entry__thumb"><img src="/assets/jolka/tile/zmes-jolka.webp" alt="" width="120" height="96"></span>
            <span class="entry__copy">
              <small>Kávový výber</small>
              <b>Vyberte kávu na mieru</b>
              <span>4 otázky · odporúčanie do minúty</span>
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

      <p class="widget__note">Chatbot dodáva <a href="https://mojchatbot.sk" target="_blank" rel="noreferrer">${esc(brand.author)}</a></p>
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

  /* ------------------------------------------------------- open / close */

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
    setTimeout(() => teaser.classList.add('is-visible'), 600);
  }

  document.addEventListener('keydown', (event) => {
    if (!widget.classList.contains('is-open')) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      closeWidget();
      return;
    }
    if (event.key !== 'Tab') return;
    const items = $$(FOCUSABLE, widget).filter((el) => el.offsetParent !== null || el === document.activeElement);
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && (document.activeElement === first || document.activeElement === widget)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  /* ------------------------------------------------------------- modes */

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

  /* ------------------------------------------------------------ advisor */

  function updateProgress() {
    const done = state.stage !== 'questions';
    $('#stepTitle').textContent = done ? 'Vaša káva' : `Krok ${state.step + 1} zo ${steps.length}`;
    $('#stepName').textContent = done ? 'Osobné odporúčanie' : steps[state.step].name;
    $('#back').disabled = state.stage === 'questions' && state.step === 0;
    $('#progress').innerHTML = steps
      .map((step, index) => {
        const cls = done || index < state.step ? 'is-done' : index === state.step ? 'is-active' : '';
        return `<i class="${cls}"><b>${esc(step.name)}</b></i>`;
      })
      .join('');
  }

  /**
   * Every answer shows what it means: the flavour for taste, the brew for the
   * method steps, the coffee itself for acidity, where the dot scale carries
   * the reading.
   */
  function optionVisual(option) {
    const src = option.photo || byId[option.product].tile;
    const badge = option.glyph
      ? `<span class="option__badge">${glyph(option.glyph)}</span>`
      : typeof option.dots === 'number'
        ? `<span class="option__badge option__badge--dots">${dots(option.dots - 1)}</span>`
        : '';
    return `<span class="option__visual"><img src="${src}" alt="" loading="lazy" width="240" height="192">${badge}</span>`;
  }

  function renderQuestion() {
    const step = steps[state.step];
    const selected = state.answers[step.key];
    const last = state.step === steps.length - 1;

    advisor.innerHTML = `
      <div class="question"><h2>${esc(step.title)}</h2></div>
      <div class="options" role="group" aria-label="${esc(step.title)}">
        ${step.options
          .map((option, index) => {
            const isSelected = selected === option.value;
            return `<button class="option${isSelected ? ' is-selected' : ''}" type="button" data-value="${option.value}" aria-pressed="${isSelected}" style="--reveal:${index * 70}ms">
              ${optionVisual(option)}
              <span class="option__copy"><b>${esc(option.title)}</b><small>${esc(option.detail)}</small></span>
              <span class="option__mark">${icons.check}</span>
            </button>`;
          })
          .join('')}
      </div>`;

    advisorFoot.hidden = true;
    advisorFoot.innerHTML = '';

    $$('.option', advisor).forEach((button) =>
      button.addEventListener('click', () => select(button.dataset.value))
    );
    return last;
  }

  /** Selecting confirms the step: mark it, let the choice register, then glide on. */
  function select(value) {
    if (state.busy || state.stage !== 'questions') return;
    state.busy = true;
    state.answers[steps[state.step].key] = value;

    $$('.option', advisor).forEach((button) => {
      const on = button.dataset.value === value;
      button.classList.toggle('is-selected', on);
      button.classList.toggle('is-dimmed', !on);
      button.setAttribute('aria-pressed', String(on));
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
    const current = state.chosen
      ? ranked.find((entry) => entry.product.id === state.chosen) || best
      : best;
    const product = current.product;
    const alternative = ranked.find((entry) => entry.product.id !== product.id);

    advisor.innerHTML = `
      <div class="result">
        <span class="result__badge">${product.id === best.product.id ? 'Najlepšia zhoda' : 'Vaša voľba'} · ${matchPercent(current.value)} %</span>

        <div class="result__hero">
          <img class="result__photo" src="${product.photo}" alt="${esc(product.name)}" width="132" height="178">
          <div class="result__headline">
            <h2>${esc(product.name)}</h2>
            <p>${esc(product.line)}</p>
            <span class="result__price"><b>${esc(product.price)}</b><span>/ ${esc(product.priceUnit)}</span></span>
            <small class="result__weights">${esc(product.weights)} · od ${esc(product.priceFrom)}${product.roast ? ` · ${esc(product.roast)}` : ''}</small>
          </div>
        </div>

        <div class="result__body">
          <div class="notes">${product.notes.map((note) => `<span>${esc(note)}</span>`).join('')}</div>

          <div class="why"><b>Prečo práve táto</b><p>${esc(product.why)}</p></div>

          <div class="facts">
            <div class="fact">
              <b>${icons.drop} Acidita</b>
              <span class="fact__value">${dots(product.acidity)} ${esc(acidityScale[product.acidity])}</span>
            </div>
            <div class="fact">
              <b>${icons.cup} Príprava</b>
              <span class="fact__value">${esc(product.bestFor)}</span>
            </div>
          </div>
          <p class="acidity-note">${esc(product.acidityNote)}</p>

          ${
            product.bulk
              ? `<div class="bulk"><b>${esc(product.bulk.label)}</b><span>${esc(product.bulk.saving)}</span></div>`
              : ''
          }

          ${
            alternative
              ? `<div class="alt">
                  <span>Ak by ste chceli inú</span>
                  <button class="alt__card" type="button" data-product="${alternative.product.id}">
                    <img src="${alternative.product.photo}" alt="" loading="lazy" width="42" height="58">
                    <div><b>${esc(alternative.product.name)}</b><small>${esc(alternative.product.notes.slice(0, 2).join(' · '))} · ${matchPercent(alternative.value)} % zhoda</small></div>
                    ${icons.arrow}
                  </button>
                </div>`
              : ''
          }
        </div>
      </div>`;

    advisorFoot.hidden = false;
    advisorFoot.innerHTML = `
      <a class="cta" href="${product.url}" target="_blank" rel="noreferrer" id="productCta">Pozrieť produkt v e-shope ${icons.shop}</a>
      <button class="ghost" type="button" id="restart">Zmeniť odpovede</button>`;

    $('#restart').addEventListener('click', resetAdvisor);
    const altCard = $('.alt__card', advisor);
    if (altCard) {
      altCard.addEventListener('click', () => {
        state.chosen = altCard.dataset.product;
        renderResult();
        advisor.scrollTop = 0;
      });
    }
  }

  /** Shows a fade at the pane edge only while there is more to scroll to. */
  function updateScrollHint() {
    const more = advisor.scrollHeight - advisor.clientHeight - advisor.scrollTop > 4;
    advisorScreen.classList.toggle('has-more', more);
  }

  function renderAdvisor() {
    updateProgress();
    if (state.stage === 'questions') renderQuestion();
    else renderResult();
    advisor.scrollTop = 0;
    requestAnimationFrame(updateScrollHint);
  }

  advisor.addEventListener('scroll', updateScrollHint, { passive: true });
  addEventListener('resize', updateScrollHint);

  function resetAdvisor() {
    state.step = 0;
    state.answers = {};
    state.stage = 'questions';
    state.chosen = null;
    state.busy = false;
    renderAdvisor();
  }

  /* --------------------------------------------------------------- chat */

  function addMessage(html, fromUser = false) {
    const row = document.createElement('div');
    row.className = `msg${fromUser ? ' msg--user' : ''}`;
    row.innerHTML = `${fromUser ? '' : '<span class="msg__avatar"><img src="/assets/jolka/logo-cream.webp" width="26" height="26" alt="Poradca"></span>'}<div class="bubble">${html}</div>`;
    chatLog.appendChild(row);
    requestAnimationFrame(() => { chatLog.scrollTop = chatLog.scrollHeight; });
    return row;
  }

  function showTyping() {
    const row = document.createElement('div');
    row.className = 'msg';
    row.id = 'typing';
    row.innerHTML = '<span class="msg__avatar"><img src="/assets/jolka/logo-cream.webp" width="26" height="26" alt=""></span><div class="bubble typing"><i></i><i></i><i></i></div>';
    chatLog.appendChild(row);
    requestAnimationFrame(() => { chatLog.scrollTop = chatLog.scrollHeight; });
  }

  /** Offline answer built from the verified catalogue — never invents a product. */
  function fallbackAnswer(text) {
    const query = text.toLowerCase();
    const hit = fallbacks.find((entry) => entry.match.some((needle) => query.includes(needle)));
    if (!hit) {
      return 'Rád vám poradím konkrétnu kávu. Najpresnejšie to pôjde cez krátky výber — štyri otázky na chuť, prípravu a aciditu.';
    }
    const product = byId[hit.product];
    return `${hit.lead} <b>${esc(product.name)}</b>. ${esc(product.why)} ${esc(product.priceUnit)} stojí ${esc(product.price)}.`;
  }

  async function requestReply(text) {
    state.history.push({ role: 'user', content: text });
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ demoId: 'jolka', messages: state.history.slice(-10) })
    });
    if (!response.ok) throw new Error('AI unavailable');
    const data = await response.json();
    if (!data.reply) throw new Error('Empty reply');
    state.history.push({ role: 'assistant', content: data.reply });
    return esc(data.reply);
  }

  async function send(text) {
    const value = text.trim();
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

  function setChipsDisabled(disabled) {
    $$('.chip').forEach((chip) => { chip.disabled = disabled; });
  }

  function renderChips() {
    $('#chips').innerHTML = chatCopy.chips
      .map((label) => `<button class="chip" type="button">${esc(label)}</button>`)
      .join('');
    $$('.chip').forEach((chip) => chip.addEventListener('click', () => send(chip.textContent)));
  }

  function seedChat() {
    chatLog.innerHTML = '';
    state.history = [];
    addMessage(esc(chatCopy.welcome));
  }

  /* ------------------------------------------------------------- wiring */

  $('#heroOpen').addEventListener('click', openWidget);
  openButton.addEventListener('click', openWidget);
  teaser.addEventListener('click', openWidget);
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
  $$('.mode__button').forEach((button) =>
    button.addEventListener('click', () => setMode(button.dataset.mode))
  );
  $('#composer').addEventListener('submit', (event) => {
    event.preventDefault();
    send(input.value);
  });

  renderChips();
  seedChat();
  renderAdvisor();
  setTimeout(() => {
    if (!widget.classList.contains('is-open')) teaser.classList.add('is-visible');
  }, 1200);
})();
