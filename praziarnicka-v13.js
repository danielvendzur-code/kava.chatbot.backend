(() => {
  'use strict';

  const root = document.querySelector('#praziarnicka-root');
  if (!root) return;

  const asset = (name) => `/assets/praziarnicka/${name}`;
  const logoUrl = '/brand/praziarnicka-logo-official.png';
  const iconUrl = '/brand/praziarnicka-icon-official.svg';
  const esc = (value = '') => String(value).replace(/[&<>"']/g, (char) => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[char]));
  const svg = (body) => `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">${body}</svg>`;
  const path = (d) => `<path d="${d}" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>`;
  const icons = {
    arrow: svg(path('M5 12h13m-5-6 6 6-6 6')),
    send: svg(path('m4 4 16 8-16 8 3-8-3-8Zm3 8h13')),
    close: svg(path('m6 6 12 12M18 6 6 18')),
    back: svg(path('m15 18-6-6 6-6')),
    reset: svg(path('M20 11a8 8 0 1 0-2.3 5.7M20 5v6h-6')),
    chat: svg(path('M5 5h14v10H9l-4 4V5Z')),
    cup: svg(path('M5 7h11v7a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5V7Zm11 2h2a2 2 0 0 1 0 4h-2')),
    check: svg(path('m5 12 4 4L19 6')),
    spark: svg(path('M12 3l1.4 5.4L19 10l-5.6 1.6L12 17l-1.4-5.4L5 10l5.6-1.6L12 3Z')),
    pin: svg(path('M12 21s6-5.2 6-11a6 6 0 1 0-12 0c0 5.8 6 11 6 11Zm0-8.3a2.7 2.7 0 1 0 0-5.4 2.7 2.7 0 0 0 0 5.4Z')),
    bag: svg(path('M6 8h12l-1 12H7L6 8Zm3 0V6a3 3 0 0 1 6 0v2'))
  };

  const products = [
    {
      id:'paganini', name:'Paganini blend', subtitle:'75 % arabica · 25 % robusta', price:'od 11,90 €', profile:'Plná a čokoládová',
      url:'https://praziarnicka.sk/produkt/paganini-blend-75-arabica-25-robusta', photo:asset('official-paganini.jpg'),
      prep:['automatic','lever','moka'], taste:['balanced','chocolate','strong'], drink:['milk','black','both'], caffeine:['classic'],
      notes:['čokoláda','mandle','orechy'], reason:'Plná, príjemná káva, ktorá sa nestratí ani v cappuccine. Dobrá voľba na každý deň.'
    },
    {
      id:'brazil', name:'Brazil Santos', subtitle:'100 % arabica', price:'od 9,90 €', profile:'Jemná a sladká',
      url:'https://praziarnicka.sk/produkt/brazil-santos-100percent-arabica', photo:asset('official-brazil.jpg'),
      prep:['automatic','lever','moka','filter'], taste:['chocolate','balanced'], drink:['black','both'], caffeine:['classic'],
      notes:['kakao','sladkosť','jemná chuť'], reason:'Jemnejšia káva bez výraznej kyslosti. Ľahko sa pije a funguje pri viacerých spôsoboch prípravy.'
    },
    {
      id:'cuba', name:'Cuba Serrano', subtitle:'100 % arabica', price:'od 12,90 €', profile:'Sladká a orechová',
      url:'https://praziarnicka.sk/produkt/cuba-serrano-lavado-100-arabica', photo:asset('official-cuba.jpg'),
      prep:['lever','moka','filter'], taste:['balanced','chocolate'], drink:['black'], caffeine:['classic'],
      notes:['kakao','tabak','vlašské orechy'], reason:'Plná a sladká káva s orechovou dochuťou. Najlepšie vynikne bez mlieka.'
    },
    {
      id:'puccini', name:'Puccini blend', subtitle:'60 % arabica · 40 % robusta', price:'od 11,50 €', profile:'Silná a výrazná',
      url:'https://praziarnicka.sk/produkt/puccini-60arabica-40-robusta', photo:asset('official-puccini.jpg'),
      prep:['automatic','lever','moka'], taste:['strong','balanced','chocolate'], drink:['milk','both'], caffeine:['classic'],
      notes:['tmavá čokoláda','marhuľa','hustá pena'], reason:'Výrazná káva s plnou chuťou. Vhodná najmä vtedy, keď ju radi pijete s mliekom.'
    },
    {
      id:'decaf', name:'Bezkofeínová Brazil', subtitle:'100 % arabica', price:'od 12,90 €', profile:'Jemná a bez kofeínu',
      url:'https://praziarnicka.sk/produkt/bezkofeinova-kava-brazilia', photo:asset('official-bezkofeinova.jpg'),
      prep:['automatic','lever','moka','filter'], taste:['chocolate','balanced'], drink:['black','milk','both'], caffeine:['decaf'],
      notes:['sladká','jemná','dobrá na večer'], reason:'Dobrá káva aj na večer. Je jemná a sladká, len bez povzbudenia.'
    }
  ];

  const prepPhotos = {
    automatic: asset('prep-automatic.webp'),
    lever: asset('prep-lever.webp'),
    moka: asset('prep-moka.webp'),
    filter: asset('prep-filter.webp')
  };

  const questions = [
    { key:'prep', label:'Príprava', title:'Ako si kávu pripravujete?', options:[
      ['automatic','Automat','Káva stlačením tlačidla'],
      ['lever','Pákový kávovar','Espresso pripravujete ručne'],
      ['moka','Moka kanvička','Silnejšia káva zo sporáka'],
      ['filter','Filter','V60, dripper alebo prekvapkávanie']
    ]},
    { key:'taste', label:'Chuť', title:'Čo chcete cítiť v šálke?', options:[
      ['chocolate','Čokoláda a orechy','Plná, pokojná chuť'],
      ['balanced','Sladká a vyvážená','Jemná, bez extrémov'],
      ['fruity','Ovocná a svieža','Ľahšia a aromatická'],
      ['strong','Silná a výrazná','Intenzívnejšie telo']
    ]},
    { key:'drink', label:'Nápoj', title:'Ako ju pijete najčastejšie?', options:[
      ['black','Čiernu','Espresso, lungo alebo filter'],
      ['milk','S mliekom','Cappuccino, latte, flat white'],
      ['both','Striedam oboje','Chcem univerzálnu kávu'],
      ['either','Podľa nálady','Nech rozhodne hlavne chuť']
    ]},
    { key:'caffeine', label:'Kofeín', title:'Kedy ju chcete piť?', options:[
      ['classic','Počas dňa','Klasická káva s kofeínom'],
      ['decaf','Aj večer','Radšej bez kofeínu'],
      ['either','Je mi to jedno','Rozhodnite podľa chuti'],
      ['strong','Chcem povzbudenie','Výraznejšia denná voľba']
    ]}
  ];

  const state = {
    open:false,
    mode:'chat',
    step:0,
    answers:{},
    result:null,
    alternative:null,
    transitioning:false,
    interacted:false,
    busy:false,
    messages:[{ role:'assistant', text:'Dobrý deň. Povedzte mi, ako si kávu pripravujete alebo čo vám chutí. Pomôžem vám zúžiť výber.' }],
    lastFocus:null
  };

  // The widget does two separate things, so the page says so in two blocks: the
  // chat, where the customer asks in their own words, and the picker, where four
  // questions lead to one coffee. The chat examples are the questions
  // Pražiarnička's own customers ask about this catalogue.
  const asks = ['Aká káva do automatu?', 'Ktorá nie je veľmi kyslá?', 'Máte niečo bez kofeínu?'];
  const flow = ['Príprava', 'Chuť', 'Nápoj', 'Kofeín'];

  root.innerHTML = `
    <main class="pz13-site" aria-label="Pražiarnička — návrh kávového poradcu">
      <header class="pz13-site-head">
        <span class="pz13-site-logo"><img src="${logoUrl}" alt="Pražiarnička by Caffè Vita"></span>
        <span class="pz13-site-flag"><i></i> Kávový poradca · ukážka</span>
      </header>

      <section class="pz13-site-hero">
        <div class="pz13-site-copy">
          <span class="pz13-site-eyebrow">Pre tím Pražiarničky</span>
          <h1>Chat a výber kávy na vašom webe.</h1>
          <p>Widget robí dve veci naraz: odpovedá na otázky o vašich kávach a v štyroch krokoch dovedie zákazníka k jednej konkrétnej.</p>
          <div class="pz13-site-actions">
            <button id="pz13-hero-open" type="button">Otvoriť ukážku ${icons.arrow}</button>
            <span class="pz13-site-hint">Bublina vpravo dole. Otvorí sa jedným klikom.</span>
          </div>
        </div>

        <div class="pz13-flow" aria-label="Ukážka odporúčania">
          <span class="pz13-flow__stamp">Ukážka odporúčania</span>
          <div class="pz13-flow__card">
            <img src="${products[0].photo}" alt="Paganini blend">
            <div>
              <small>Odporúčanie</small>
              <b>Paganini blend</b>
              <span>čokoláda · mandle · orechy</span>
              <em>Pridať do košíka</em>
            </div>
          </div>
        </div>
      </section>

      <section class="pz13-site-modes" aria-label="Čo widget robí">
        <article class="pz13-site-mode">
          <header><span>${icons.chat}</span><div><small>Prvá časť</small><b>Chat</b></div></header>
          <p>Zákazník sa pýta vlastnými slovami, tak ako by sa spýtal vás.</p>
          <ul>${asks.map((ask) => `<li>„${esc(ask)}“</li>`).join('')}</ul>
          <p class="pz13-site-mode__note">Odpovedá z vášho katalógu — nikdy si nevymyslí kávu, ktorú nepražíte.</p>
        </article>

        <article class="pz13-site-mode">
          <header><span>${icons.cup}</span><div><small>Druhá časť</small><b>Výber kávy</b></div></header>
          <p>Kto sa pýtať nechce, prejde štyri kroky s veľkými fotkami.</p>
          <ol>${flow.map((step, index) => `<li><i>${index + 1}</i>${esc(step)}</li>`).join('')}</ol>
          <p class="pz13-site-mode__note">Jedna káva, dôvod prečo sedí, a pridanie do košíka.</p>
        </article>
      </section>

      <footer class="pz13-proof">
        <p class="pz13-site-by">Návrh pripravil <a href="https://mojchatbot.sk" target="_blank" rel="noreferrer">mojchatbot.sk</a> · ukážka pre Pražiarničku</p>
      </footer>
    </main>

    <div class="pz13-launcher" id="pz13-launcher-wrap">
      <div class="pz13-preview" id="pz13-preview">
        <button class="pz13-preview__body" id="pz13-preview-open" type="button">
          <b>Neviete, ktorú kávu vybrať?</b>
          <span>4 krátke otázky · konkrétne odporúčanie</span>
        </button>
        <button class="pz13-preview__close" id="pz13-preview-close" type="button" aria-label="Skryť pozvánku">${icons.close}</button>
      </div>
      <button class="pz13-launcher__button" id="pz13-open" type="button" aria-label="Otvoriť kávového poradcu" aria-expanded="false">
        <img src="${iconUrl}" alt="">
      </button>
    </div>

    <div class="pz13-backdrop" id="pz13-backdrop" hidden></div>

    <section class="pz13-widget" id="pz13-widget" role="dialog" aria-modal="true" aria-label="Kávový poradca Pražiarničky" aria-hidden="true" tabindex="-1">
      <header class="pz13-widget__head">
        <div class="pz13-widget__brand"><img src="${logoUrl}" alt="Pražiarnička"><span><b>Pražiarnička</b><small><i></i> Online poradca</small></span></div>
        <div class="pz13-widget__actions">
          <button id="pz13-reset" type="button" aria-label="Začať odznova">${icons.reset}</button>
          <button id="pz13-close" type="button" aria-label="Zavrieť poradcu">${icons.close}</button>
        </div>
      </header>

      <!-- The switch sits directly under the header: at the bottom it floated
           over the last row of answers on a 768 px-tall screen. -->
      <div class="pz13-mode-shell">
        <nav class="pz13-mode" aria-label="Režim poradcu">
          <span class="pz13-mode-thumb" aria-hidden="true"></span>
          <button data-mode="chat" type="button" aria-pressed="true" class="is-active"><b>Chat</b></button>
          <button data-mode="advisor" type="button" aria-pressed="false"><b>Výber kávy</b></button>
        </nav>
      </div>

      <div class="pz13-stage" id="pz13-stage"></div>
    </section>`;

  const widget = root.querySelector('#pz13-widget');
  const stage = root.querySelector('#pz13-stage');
  const launcherWrap = root.querySelector('#pz13-launcher-wrap');
  const preview = root.querySelector('#pz13-preview');
  const backdrop = root.querySelector('#pz13-backdrop');
  const mode = root.querySelector('.pz13-mode');
  const modeButtons = [...root.querySelectorAll('.pz13-mode button')];

  function setMode(nextMode) {
    state.mode = nextMode;
    mode.classList.toggle('is-advisor', nextMode === 'advisor');
    modeButtons.forEach((button) => {
      const active = button.dataset.mode === nextMode;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    if (nextMode === 'chat') renderChat(); else renderAdvisor();
  }

  function lockPage() { document.documentElement.classList.add('pz13-open'); }
  function unlockPage() { document.documentElement.classList.remove('pz13-open'); }

  function openWidget(nextMode = state.mode) {
    if (!state.open) state.lastFocus = document.activeElement;
    state.open = true;
    widget.classList.add('is-open');
    widget.setAttribute('aria-hidden', 'false');
    root.querySelector('#pz13-open').setAttribute('aria-expanded', 'true');
    launcherWrap.classList.add('is-hidden');
    backdrop.hidden = false;
    requestAnimationFrame(() => backdrop.classList.add('is-visible'));
    lockPage();
    setMode(nextMode);
    // Focus the dialog itself, not the close button: focusing Close drew a
    // focus ring around it every time the widget opened. Moving focus happens a
    // frame later, so only take it if the customer has not already put it
    // somewhere inside the widget — typing straight into the composer used to
    // lose the keystrokes to this call.
    requestAnimationFrame(() => {
      if (!widget.contains(document.activeElement)) widget.focus();
    });
  }

  function closeWidget() {
    state.open = false;
    widget.classList.remove('is-open');
    widget.setAttribute('aria-hidden', 'true');
    root.querySelector('#pz13-open').setAttribute('aria-expanded', 'false');
    launcherWrap.classList.remove('is-hidden');
    backdrop.classList.remove('is-visible');
    window.setTimeout(() => { backdrop.hidden = true; }, 180);
    unlockPage();
    state.lastFocus?.focus?.();
  }

  function cannedReply(text) {
    const q = text.toLocaleLowerCase('sk');
    if (/automat/.test(q)) return 'Do automatu by som začal Paganini blendom alebo Brazil Santos. Paganini je plnší, Brazil jemnejší a sladší.';
    if (/čokol|orech|kakao/.test(q)) return 'Ak máte radi čokoládu a orechy, Brazil Santos je bezpečná jemná voľba. Ak chcete plnšie telo, skúste Paganini blend.';
    if (/ovoc|sviež|kysl/.test(q)) return 'Ak chcete sviežejší profil, najistejšie bude prejsť krátky výber podľa prípravy a chuti, aby som neodporučil kávu, ktorá vám nesadne.';
    if (/mlie|capp|latte|flat/.test(q)) return 'Do cappuccina a latte sa hodí Paganini alebo Puccini. Obe majú dosť plnú chuť, aby sa v mlieku nestratili.';
    if (/bez kofe|večer|decaf/.test(q)) return 'Na večer je vhodná Bezkofeínová Brazil. Je jemná a sladká, len bez kofeínu.';
    if (/filter|v60|drip/.test(q)) return 'Na filter by som pozeral najmä na Brazil Santos alebo Cuba Serrano. Krátky výber ešte zohľadní, či chcete skôr jemnú alebo výraznejšiu chuť.';
    return 'Pomôžem vám. Napíšte, ako kávu pripravujete a aké chute máte radi, alebo použite dole „Výber kávy“ a prejdite štyri krátke kroky.';
  }

  function messageMarkup(message) {
    const assistant = message.role === 'assistant';
    return `<div class="pz13-message ${assistant ? 'pz13-message--assistant' : 'pz13-message--user'}">
      ${assistant ? `<span class="pz13-avatar"><img src="${iconUrl}" alt=""></span>` : ''}
      <div class="pz13-bubble">${esc(message.text)}</div>
    </div>`;
  }

  function renderChat() {
    const chips = ['Káva do automatu', 'Nie veľmi kyslú', 'Odkiaľ je káva?', 'Porovnajte dve kávy'];
    stage.innerHTML = `
      <section class="pz13-chat">
        <div class="pz13-chat__messages" id="pz13-messages" aria-live="polite">
          ${!state.interacted ? `<button class="pz13-advisor-entry" id="pz13-advisor-entry" type="button"><span>${icons.spark}</span><div><b>Nájsť svoju kávu za 4 kroky</b><small>Príprava · chuť · nápoj · kofeín</small></div>${icons.arrow}</button>` : ''}
          ${state.messages.map(messageMarkup).join('')}
        </div>
        <div class="pz13-chat__bottom">
          ${!state.interacted ? `<div class="pz13-chips">${chips.map((chip) => `<button type="button" class="pz13-chip">${chip}</button>`).join('')}</div>` : ''}
          <form class="pz13-composer" id="pz13-form">
            <input id="pz13-input" autocomplete="off" maxlength="500" placeholder="Opýtajte sa na kávu…" aria-label="Otázka o káve">
            <button type="submit" aria-label="Odoslať správu" ${state.busy ? 'disabled' : ''}>${icons.send}</button>
          </form>
        </div>
      </section>`;

    const messages = stage.querySelector('#pz13-messages');
    requestAnimationFrame(() => { messages.scrollTop = messages.scrollHeight; });
    stage.querySelector('#pz13-advisor-entry')?.addEventListener('click', () => setMode('advisor'));
    stage.querySelectorAll('.pz13-chip').forEach((button) => button.addEventListener('click', () => send(button.textContent)));
    stage.querySelector('#pz13-form').addEventListener('submit', (event) => {
      event.preventDefault();
      const input = stage.querySelector('#pz13-input');
      const value = input.value;
      input.value = '';
      send(value);
    });
  }

  async function send(text) {
    const clean = String(text || '').trim().slice(0, 500);
    if (!clean || state.busy) return;
    state.interacted = true;
    state.busy = true;
    state.messages.push({ role:'user', text:clean });
    const fallback = { role:'assistant', text:cannedReply(clean) };
    state.messages.push(fallback);
    renderChat();

    try {
      const response = await fetch('/api/chat', {
        method:'POST',
        headers:{ 'content-type':'application/json' },
        body:JSON.stringify({ demoId:'praziarnicka', messages:state.messages.slice(-8).map((m) => ({ role:m.role, content:m.text })) })
      });
      if (response.ok) {
        const data = await response.json();
        const reply = String(data.reply || '').trim();
        if (reply) fallback.text = reply;
      }
    } catch (_) {
      // A deterministic catalogue answer stays visible when the provider is unavailable.
    } finally {
      state.busy = false;
      // Only redraw the chat if the customer is still in it: switching to the
      // advisor while a reply was in flight used to be undone by this render.
      if (state.mode === 'chat') renderChat();
    }
  }

  function score(product) {
    const weights = { prep:8, taste:10, drink:6, caffeine:14 };
    let total = 0;
    for (const question of questions) {
      const answer = state.answers[question.key];
      if (!answer || answer === 'either') continue;
      const values = product[question.key] || [];
      total += values.includes(answer) ? weights[question.key] : question.key === 'caffeine' ? -12 : -2;
    }
    if (state.answers.caffeine === 'decaf' && product.id === 'decaf') total += 16;
    if (state.answers.taste === 'strong' && product.id === 'puccini') total += 4;
    if (state.answers.drink === 'milk' && product.id === 'paganini') total += 3;
    return total;
  }

  function calculateResult() {
    const ranked = products.map((product, index) => ({ product, index, score:score(product) })).sort((a,b) => b.score - a.score || a.index - b.index);
    state.result = ranked[0]?.product || products[0];
    state.alternative = ranked.find((item) => item.product.id !== state.result.id)?.product || products[1];
  }

  function spriteStyle(optionIndex, stepIndex) {
    const pos = [0, 33.333, 66.667, 100];
    return `--pz13-x:${pos[optionIndex] ?? 0}%;--pz13-y:${pos[stepIndex] ?? 0}%`;
  }

  function optionVisual(question, value, title, index) {
    const proxy = `<span class="pz13-option__photo${question.key === 'prep' ? ' is-proxy' : ''}" role="img" aria-label="${esc(title)}" style="${spriteStyle(index, state.step)}"></span>`;
    if (question.key !== 'prep') return `<span class="pz13-option__visual">${proxy}</span>`;
    return `<span class="pz13-option__visual"><img class="pz13-option__img" src="${prepPhotos[value]}" alt="${esc(title)}">${proxy}</span>`;
  }

  function renderAdvisor() {
    if (state.result) { renderResult(); return; }
    const question = questions[state.step];
    const selected = state.answers[question.key];
    stage.innerHTML = `
      <section class="pz13-advisor">
        <header class="pz13-progress">
          <button id="pz13-back" type="button" ${state.step === 0 ? 'disabled' : ''}>${icons.back}<span>Späť</span></button>
          <div class="pz13-progress__bars">${questions.map((_, index) => `<i class="${index <= state.step ? 'is-on' : ''}"></i>`).join('')}</div>
          <b>${state.step + 1} z 4</b>
        </header>
        <div class="pz13-advisor__body">
          <span class="pz13-kicker">${question.label}</span>
          <h2>${question.title}</h2>
          <div class="pz13-options">
            ${question.options.map(([value,title,description], index) => `
              <button class="pz13-option ${selected === value ? 'is-selected' : ''}" data-value="${value}" type="button" aria-pressed="${selected === value}">
                ${optionVisual(question, value, title, index)}
                <span class="pz13-option__copy"><b>${esc(title)}</b><small>${esc(description)}</small></span>
                <i>${selected === value ? icons.check : ''}</i>
              </button>`).join('')}
          </div>
        </div>
      </section>`;

    stage.querySelector('#pz13-back')?.addEventListener('click', () => {
      if (state.step > 0 && !state.transitioning) {
        state.step -= 1;
        renderAdvisor();
      }
    });
    stage.querySelectorAll('.pz13-option').forEach((button) => button.addEventListener('click', () => {
      if (state.transitioning) return;
      state.transitioning = true;
      state.answers[question.key] = button.dataset.value;
      stage.querySelectorAll('.pz13-option').forEach((candidate) => {
        const on = candidate === button;
        candidate.classList.toggle('is-selected', on);
        candidate.setAttribute('aria-pressed', String(on));
        candidate.disabled = true;
      });
      window.setTimeout(() => {
        if (state.step < questions.length - 1) {
          state.step += 1;
          state.transitioning = false;
          renderAdvisor();
        } else {
          calculateResult();
          state.transitioning = false;
          renderResult();
        }
      }, 230);
    }));
  }

  function renderResult() {
    const product = state.result;
    const alternative = state.alternative;
    stage.innerHTML = `
      <section class="pz13-result">
        <header class="pz13-progress pz13-progress--result">
          <button id="pz13-result-back" type="button">${icons.back}<span>Späť</span></button>
          <div class="pz13-progress__bars">${questions.map(() => '<i class="is-on"></i>').join('')}</div>
          <b>Výsledok</b>
        </header>
        <div class="pz13-result__body">
          <span class="pz13-kicker">Vaša káva</span>
          <article class="pz13-product">
            <img src="${product.photo}" alt="${esc(product.name)}">
            <div class="pz13-product__copy">
              <span>${esc(product.profile)}</span>
              <h2>${esc(product.name)}</h2>
              <div class="pz13-tags">${product.notes.map((note) => `<b>${esc(note)}</b>`).join('')}</div>
              <p>${esc(product.reason)}</p>
              <div class="pz13-product__buy"><strong>${esc(product.price)}</strong><button class="pz13-add" id="pz13-add" type="button">Pridať do košíka ${icons.bag}</button></div>
              <div class="pz13-product__links"><a href="${product.url}" target="_blank" rel="noreferrer">Detail produktu</a><span class="pz13-cart-note" role="status" hidden></span></div>
            </div>
          </article>
          <article class="pz13-alternative">
            <img src="${alternative.photo}" alt="">
            <div><small>Ďalšia vhodná voľba</small><b>${esc(alternative.name)}</b><span>${esc(alternative.profile)}</span></div>
            <a href="${alternative.url}" target="_blank" rel="noreferrer" aria-label="Pozrieť ${esc(alternative.name)}">${icons.arrow}</a>
          </article>
          <button class="pz13-restart" id="pz13-restart" type="button">Vybrať znova</button>
        </div>
      </section>`;

    stage.querySelector('#pz13-result-back').addEventListener('click', () => {
      state.result = null;
      state.alternative = null;
      state.step = questions.length - 1;
      renderAdvisor();
    });
    stage.querySelector('#pz13-restart').addEventListener('click', resetAdvisor);

    // The widget stands in for one already installed on the shop, so the
    // recommendation ends in the basket rather than on a product listing.
    const add = stage.querySelector('#pz13-add');
    const note = stage.querySelector('.pz13-cart-note');
    add.addEventListener('click', () => {
      if (add.classList.contains('is-added')) return;
      add.classList.add('is-added');
      add.innerHTML = `Pridané do košíka ${icons.check}`;
      note.textContent = `${product.name} je v košíku.`;
      note.hidden = false;
    });
  }

  function resetAdvisor() {
    state.step = 0;
    state.answers = {};
    state.result = null;
    state.alternative = null;
    state.transitioning = false;
    renderAdvisor();
  }

  function resetAll() {
    state.step = 0;
    state.answers = {};
    state.result = null;
    state.alternative = null;
    state.transitioning = false;
    state.interacted = false;
    state.busy = false;
    state.messages = [{ role:'assistant', text:'Dobrý deň. Povedzte mi, ako si kávu pripravujete alebo čo vám chutí. Pomôžem vám zúžiť výber.' }];
    setMode('chat');
  }

  function trapFocus(event) {
    if (!state.open || event.key !== 'Tab') return;
    const focusable = [...widget.querySelectorAll('button:not([disabled]),a[href],input:not([disabled]),[tabindex]:not([tabindex="-1"])')].filter((node) => node.offsetParent !== null);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }

  root.querySelector('#pz13-hero-open').addEventListener('click', () => openWidget('advisor'));
  root.querySelectorAll('[data-open-advisor]').forEach((button) => button.addEventListener('click', () => openWidget('advisor')));
  root.querySelector('#pz13-open').addEventListener('click', () => openWidget('chat'));
  root.querySelector('#pz13-preview-open').addEventListener('click', () => openWidget('advisor'));
  // The invitation is a suggestion, not a banner the visitor has to live with.
  root.querySelector('#pz13-preview-close').addEventListener('click', () => { preview.hidden = true; });
  root.querySelector('#pz13-close').addEventListener('click', closeWidget);
  root.querySelector('#pz13-reset').addEventListener('click', resetAll);
  backdrop.addEventListener('click', closeWidget);
  modeButtons.forEach((button) => button.addEventListener('click', () => setMode(button.dataset.mode)));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && state.open) closeWidget();
    trapFocus(event);
  });

  document.documentElement.dataset.demoReady = 'true';
  setMode('chat');
})();
