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
    bag: svg(path('M6 8h12l-1 12H7L6 8Zm3 0V6a3 3 0 0 1 6 0v2')),
    spark: svg(path('M12 3l1.4 5.4L19 10l-5.6 1.6L12 17l-1.4-5.4L5 10l5.6-1.6L12 3Z'))
  };

  const products = [
    {
      id:'paganini', name:'Paganini blend', price:'od 11,90 €', profile:'Plná a čokoládová',
      url:'https://praziarnicka.sk/produkt/paganini-blend-75-arabica-25-robusta', photo:asset('official-paganini.jpg'),
      prep:['automatic','lever','moka'], taste:['balanced','chocolate','strong'], drink:['milk','black','both'], caffeine:['classic'],
      notes:['čokoláda','mandle','orechy'], reason:'Plná, príjemná káva, ktorá sa nestratí ani v cappuccine. Dobrá voľba na každý deň.'
    },
    {
      id:'brazil', name:'Brazil Santos', price:'od 9,90 €', profile:'Jemná a sladká',
      url:'https://praziarnicka.sk/produkt/brazil-santos-100percent-arabica', photo:asset('official-brazil.jpg'),
      prep:['automatic','lever','moka','filter'], taste:['chocolate','balanced'], drink:['black','both'], caffeine:['classic'],
      notes:['kakao','sladkosť','jemná chuť'], reason:'Jemnejšia káva bez výraznej kyslosti. Ľahko sa pije a funguje pri viacerých spôsoboch prípravy.'
    },
    {
      id:'puccini', name:'Puccini blend', price:'od 11,50 €', profile:'Silná a výrazná',
      url:'https://praziarnicka.sk/produkt/puccini-60arabica-40-robusta', photo:asset('official-puccini.jpg'),
      prep:['automatic','lever','moka'], taste:['strong','balanced','chocolate'], drink:['milk','both'], caffeine:['classic'],
      notes:['tmavá čokoláda','marhuľa','hustá pena'], reason:'Výrazná káva s plnou chuťou. Vhodná najmä vtedy, keď ju radi pijete s mliekom.'
    },
    {
      id:'cuba', name:'Cuba Serrano Lavado', price:'od 12,90 €', profile:'Sladká a orechová',
      url:'https://praziarnicka.sk/produkt/cuba-serrano-lavado-100-arabica', photo:asset('official-cuba.jpg'),
      prep:['lever','moka','filter'], taste:['balanced','chocolate'], drink:['black'], caffeine:['classic'],
      notes:['kakao','tabak','vlašské orechy'], reason:'Plná a sladká káva s orechovou dochuťou. Najlepšie vynikne bez mlieka.'
    },
    {
      id:'decaf', name:'Bezkofeínová Brazil', price:'od 12,90 €', profile:'Jemná a bez kofeínu',
      url:'https://praziarnicka.sk/produkt/bezkofeinova-kava-brazilia', photo:asset('official-bezkofeinova.jpg'),
      prep:['automatic','lever','moka','filter'], taste:['chocolate','balanced'], drink:['black','milk','both'], caffeine:['decaf'],
      notes:['sladká','jemná','dobrá na večer'], reason:'Dobrá káva aj na večer. Je jemná a sladká, len bez povzbudenia.'
    }
  ];

  const questions = [
    { key:'prep', label:'Príprava', title:'Ako si kávu pripravujete?', options:[
      ['automatic','Automat','Rýchlo stlačením tlačidla'],
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
    lastFocus:null,
    scrollY:0,
    previewClosed:false
  };

  root.innerHTML = `
    <main class="pz13-page" aria-labelledby="pz13-title">
      <header class="pz13-head">
        <div class="pz13-brand"><img src="${logoUrl}" alt="Pražiarnička by Caffè Vita"><span><b>Pražiarnička</b><small>ukážka predajného poradcu</small></span></div>
        <a class="pz13-by" href="https://mojchatbot.sk" target="_blank" rel="noreferrer">mojchatbot.sk ↗</a>
      </header>

      <section class="pz13-hero">
        <div class="pz13-copy">
          <span class="pz13-eyebrow">AKO TO FUNGUJE PRE ZÁKAZNÍKA</span>
          <h1 id="pz13-title">Z neistoty pri výbere ku konkrétnej káve za štyri kroky.</h1>
          <p>Zákazník nemusí poznať odrody ani praženie. Poradca sa opýta na prípravu, chuť, spôsob pitia a kofeín, potom vysvetlí výsledok a pošle ho na konkrétny produkt.</p>
          <button class="pz13-primary" id="pz13-hero-open" type="button">Otvoriť poradcu ${icons.arrow}</button>
        </div>

        <aside class="pz13-flow" aria-label="Štyri kroky poradcu">
          <div class="pz13-flow__lead"><span>PROBLÉM</span><b>„Neviem, ktorú kávu si mám vybrať.“</b></div>
          <div class="pz13-flow__steps">
            <article><i>01</i><div><b>Príprava</b><span>automat · páka · moka · filter</span></div></article>
            <article><i>02</i><div><b>Chuť</b><span>čokoládová · vyvážená · ovocná</span></div></article>
            <article><i>03</i><div><b>Spôsob pitia</b><span>čierna · s mliekom · oboje</span></div></article>
            <article><i>04</i><div><b>Kofeín</b><span>denná · bezkofeínová</span></div></article>
          </div>
          <div class="pz13-flow__result"><span>${icons.spark}</span><div><small>VÝSLEDOK</small><b>Konkrétna káva + dôvod + odkaz na produkt</b></div>${icons.arrow}</div>
        </aside>
      </section>

      <footer class="pz13-proof" aria-label="Čo poradca rieši">
        <div><b>Menej váhania</b><span>Jedna konkrétna voľba namiesto katalógu.</span></div>
        <div><b>Jednoduchšie vysvetlenie</b><span>Chuť a príprava bez odborných výrazov.</span></div>
        <div><b>Chat aj výber</b><span>Otázka alebo štyri rýchle kroky.</span></div>
        <div><b>Priamy nákupný krok</b><span>Výsledok vedie na konkrétny produkt.</span></div>
      </footer>
    </main>

    <div class="pz13-launcher" id="pz13-launcher-wrap">
      <button class="pz13-preview" id="pz13-preview" type="button">
        <b>Neviete, ktorú kávu vybrať?</b>
        <span>4 krátke otázky · konkrétny výsledok</span>
      </button>
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

      <nav class="pz13-mode" aria-label="Režim poradcu">
        <button data-mode="chat" type="button" aria-pressed="true" class="is-active">${icons.chat}<b>Chat</b></button>
        <button data-mode="advisor" type="button" aria-pressed="false">${icons.cup}<b>Výber kávy</b></button>
      </nav>

      <div class="pz13-stage" id="pz13-stage"></div>
    </section>`;

  const widget = root.querySelector('#pz13-widget');
  const stage = root.querySelector('#pz13-stage');
  const launcherWrap = root.querySelector('#pz13-launcher-wrap');
  const preview = root.querySelector('#pz13-preview');
  const backdrop = root.querySelector('#pz13-backdrop');
  const modeButtons = [...root.querySelectorAll('.pz13-mode button')];

  function setMode(mode) {
    state.mode = mode;
    modeButtons.forEach((button) => {
      const active = button.dataset.mode === mode;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    if (mode === 'chat') renderChat(); else renderAdvisor();
  }

  function lockPage() {
    state.scrollY = window.scrollY;
    document.documentElement.classList.add('pz13-open');
  }

  function unlockPage() {
    document.documentElement.classList.remove('pz13-open');
  }

  function openWidget(mode = state.mode) {
    if (!state.open) state.lastFocus = document.activeElement;
    state.open = true;
    widget.classList.add('is-open');
    widget.setAttribute('aria-hidden', 'false');
    root.querySelector('#pz13-open').setAttribute('aria-expanded', 'true');
    launcherWrap.classList.add('is-hidden');
    backdrop.hidden = false;
    requestAnimationFrame(() => backdrop.classList.add('is-visible'));
    lockPage();
    setMode(mode);
    requestAnimationFrame(() => root.querySelector('#pz13-close')?.focus());
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
    return 'Pomôžem vám. Napíšte, ako kávu pripravujete a aké chute máte radi, alebo použite hore „Výber kávy“ a prejdite štyri krátke kroky.';
  }

  function messageMarkup(message) {
    const assistant = message.role === 'assistant';
    return `<div class="pz13-message ${assistant ? 'pz13-message--assistant' : 'pz13-message--user'}">
      ${assistant ? `<span class="pz13-avatar"><img src="${iconUrl}" alt=""></span>` : ''}
      <div class="pz13-bubble">${esc(message.text)}</div>
    </div>`;
  }

  function renderChat() {
    const chips = ['Káva do automatu', 'Nie veľmi kyslú', 'Káva do mlieka', 'Bezkofeínovú'];
    stage.innerHTML = `
      <section class="pz13-chat">
        <div class="pz13-chat__messages" id="pz13-messages" aria-live="polite">
          ${state.messages.map(messageMarkup).join('')}
          ${!state.interacted ? `<button class="pz13-advisor-entry" id="pz13-advisor-entry" type="button"><span>${icons.spark}</span><div><b>Nájsť svoju kávu za 4 kroky</b><small>Príprava · chuť · nápoj · kofeín</small></div>${icons.arrow}</button>` : ''}
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
      // Deterministic catalogue answer remains visible when the provider is unavailable.
    } finally {
      state.busy = false;
      renderChat();
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

  function renderAdvisor() {
    if (state.result) {
      renderResult();
      return;
    }
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
              <button class="pz13-option ${selected === value ? 'is-selected' : ''}" data-value="${value}" type="button" aria-pressed="${selected === value}" style="${spriteStyle(index, state.step)}">
                <span class="pz13-option__photo" role="img" aria-label="${esc(title)}"></span>
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
              <div class="pz13-product__buy"><strong>${esc(product.price)}</strong><a href="${product.url}" target="_blank" rel="noreferrer">Pozrieť produkt ${icons.arrow}</a></div>
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

  root.querySelector('#pz13-hero-open').addEventListener('click', () => openWidget('chat'));
  root.querySelector('#pz13-open').addEventListener('click', () => openWidget(state.mode));
  preview.addEventListener('click', () => openWidget('advisor'));
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
