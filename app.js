(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const svg = (body, size = 20, viewBox = '0 0 24 24') => `<svg width="${size}" height="${size}" viewBox="${viewBox}" fill="none" aria-hidden="true">${body}</svg>`;
  const stroke = (d, extra = '') => `<path d="${d}" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`;

  const icons = {
    logo: `<svg class="brand-logo-svg" viewBox="0 0 48 48" aria-hidden="true"><path d="M10 22.5C10 14.5 16.2 8 24 8s14 6.5 14 14.5c0 7.1-4.8 13-11.3 14.3L20 42v-5.1C14.2 35.1 10 29.3 10 22.5Z" fill="currentColor" opacity=".24"/><path d="M17 24.2c0-6.2 4-10.9 9.2-10.9 4.1 0 7.3 3 7.3 7.3 0 6.1-4.8 11.8-10.6 12.5-3.4.4-5.9-3.1-5.9-8.9Z" fill="none" stroke="currentColor" stroke-width="2.7"/><path d="M21.8 30.3c5.5-4.1 7.5-9.3 7.1-15.1" fill="none" stroke="currentColor" stroke-width="2.7" stroke-linecap="round"/><path d="M31.5 31.6 35 35" stroke="currentColor" stroke-width="2.7" stroke-linecap="round"/></svg>`,
    close: svg(stroke('m6 6 12 12M18 6 6 18'), 18),
    refresh: svg(stroke('M20 11a8 8 0 1 0-2.34 5.66') + stroke('M20 5v6h-6'), 17),
    route: svg('<circle cx="6" cy="6" r="2" stroke="currentColor" stroke-width="2"/><circle cx="18" cy="18" r="2" stroke="currentColor" stroke-width="2"/>' + stroke('M8 6h3a4 4 0 0 1 4 4v4a4 4 0 0 0 1 2.7'), 17),
    chat: svg(stroke('M5 18.5 3.5 21v-5A8.5 8.5 0 1 1 12 20.5c-2.7 0-5.1-.7-7-2Z') + stroke('M8 12h.01M12 12h.01M16 12h.01'), 17),
    back: svg(stroke('m15 18-6-6 6-6'), 15),
    next: svg(stroke('m9 18 6-6-6-6'), 15),
    bookmark: svg(stroke('M6 4.8A1.8 1.8 0 0 1 7.8 3h8.4A1.8 1.8 0 0 1 18 4.8V21l-6-3.6L6 21V4.8Z'), 15),
    send: svg(stroke('m4 4 16 8-16 8 3-8-3-8Z') + stroke('M7 12h13'), 16),
    check: svg(stroke('m5 12 4 4L19 6'), 18),
    machine: svg('<rect x="4" y="3" width="16" height="15" rx="3" stroke="currentColor" stroke-width="1.9"/>' + stroke('M8 7h8M8 11h5v3H8zM7 21h10M17 10v5'), 24),
    lever: svg(stroke('M5 20h14M7 20V9h10v11M9 9V5h6v4M15 12h4M19 12v5') + '<path d="M9 14h6v3H9z" stroke="currentColor" stroke-width="1.9"/>', 24),
    moka: svg(stroke('m8 3 8 1 2 6-2 11H8L6 10l2-7Z') + stroke('M7 10h10M9 5h6M18 8h2.5v6H18'), 24),
    filter: svg(stroke('M6 4h12l-2 10H8L6 4Z') + stroke('M9 18h6M12 14v4M8 4l4 10 4-10'), 24),
    gentle: svg(stroke('M4 14c4-1 4-7 8-8 4-1 4 5 8 4M5 18h14'), 24),
    balanced: svg(stroke('M12 3v18M5 7h14M6 7l-3 7h6L6 7Zm12 0-3 7h6l-3-7Z'), 24),
    strong: svg(stroke('M8 21c-2-4 1-6 2-9 1-2 0-5 2-9 4 4 5 7 4 10 3-1 4-2 4-4 3 6 0 12-6 12H8Z'), 24),
    unsure: svg('<circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.9"/>' + stroke('M9.8 9a2.3 2.3 0 1 1 3.7 1.8c-.9.6-1.5 1-1.5 2.2M12 17h.01'), 24),
    black: svg(stroke('M5 8h12v7a5 5 0 0 1-5 5h-2a5 5 0 0 1-5-5V8ZM17 10h2a2 2 0 0 1 0 4h-2M8 4c0 1 1 1 1 2M12 4c0 1 1 1 1 2'), 24),
    milk: svg(stroke('M7 3h10l1 4v14H6V7l1-4ZM6 8h12M9 12c2 2 4 2 6 0'), 24),
    both: svg('<path d="M4 6h7v12H4zM13 6h7v12h-7z" stroke="currentColor" stroke-width="1.9"/>' + stroke('M6 9h3M15 9h3M6 13h3M15 13h3'), 24),
    classic: svg(stroke('m13 2-7 11h6l-1 9 7-12h-6l1-8Z'), 24),
    decaf: svg(stroke('M20 15.5A8 8 0 1 1 8.5 4 7 7 0 0 0 20 15.5ZM15 5h.01M18 8h.01'), 24),
    either: svg(stroke('M5 8h14M5 16h14M16 5l3 3-3 3M8 13l-3 3 3 3'), 24)
  };

  $$('.logo-slot').forEach((el) => { el.innerHTML = icons.logo; });
  $$('[data-icon]').forEach((el) => { el.innerHTML = icons[el.dataset.icon] || ''; });

  const products = [
    {id:'paganini',name:'Paganini blend',origin:'75 % Arabica · 25 % Robusta',price:{250:11.9,500:21.5,1000:39.9},prep:['automatic','lever','moka'],drink:['milk','black','both'],caffeine:'classic',taste:['balanced','unsure'],tags:['čokoláda','mandle','oriešky'],reason:'Vyvážená, krémová a univerzálna káva, ktorá funguje čierna aj s mliekom.'},
    {id:'brazil',name:'Brazil Santos',origin:'100 % Arabica',price:{250:9.9,500:18.5,1000:34.9},prep:['automatic','lever','moka','filter'],drink:['black','both'],caffeine:'classic',taste:['gentle','unsure'],tags:['čokoláda','kakao','nízka acidita'],reason:'Jemná a sladšia káva s minimálnou kyslosťou, vhodná na každý deň.'},
    {id:'puccini',name:'Puccini blend',origin:'60 % Arabica · 40 % Robusta',price:{250:11.5,500:20.9,1000:38.9},prep:['automatic','lever','moka'],drink:['milk','both'],caffeine:'classic',taste:['strong','balanced'],tags:['tmavá čokoláda','hustá kréma','výrazná'],reason:'Silnejšia káva s hustou krémou, ktorá sa nestratí ani v cappuccine.'},
    {id:'cuba',name:'Cuba Serrano Lavado',origin:'100 % Arabica',price:{250:12.9,500:23.5,1000:43.9},prep:['lever','moka','filter'],drink:['black'],caffeine:'classic',taste:['gentle','balanced'],tags:['kakao','vlašský orech','bez acidity'],reason:'Plná arabica bez výraznej acidity, ideálna pre milovníkov čiernej kávy.'},
    {id:'decaf',name:'Bezkofeínová Brazil',origin:'100 % Arabica · bez kofeínu',price:{250:12.9,500:23.9,1000:44.9},prep:['automatic','lever','moka','filter'],drink:['black','milk','both'],caffeine:'decaf',taste:['gentle','balanced','unsure'],tags:['bez kofeínu','jemná','na večer'],reason:'Chuť kávy bez povzbudivého účinku – vhodná aj na večer.'}
  ];

  const questions = [
    {key:'prep',label:'Spôsob prípravy',title:'Ako kávu najčastejšie pripravujete?',help:'Vyberte zariadenie, ktoré používate najviac.',reply:'Výborne, spôsob prípravy mám.',options:[['automatic','machine','Automatický kávovar','Stlačím tlačidlo a káva je hotová'],['lever','lever','Pákový kávovar','Espresso pripravujem ručne'],['moka','moka','Moka kanvička','Výrazná domáca káva na sporáku'],['filter','filter','Filter alebo zalievanie','V60, French press alebo klasické zalievanie']]},
    {key:'taste',label:'Chuť kávy',title:'Aká chuť vám sedí najviac?',help:'Nemusíte poznať odborné názvy. Stačí pocit.',reply:'Dobre, chuťový profil sa už črtá.',options:[['gentle','gentle','Jemná a sladšia','Čokoláda, kakao, minimum horkosti'],['balanced','balanced','Vyvážená','Plná chuť bez extrémov'],['strong','strong','Silná a výrazná','Hustá kréma a intenzívnejší dojem'],['unsure','unsure','Neviem to pomenovať','Vyberte mi bezpečnú univerzálnu voľbu']]},
    {key:'drink',label:'Spôsob pitia',title:'Ako ju pijete najčastejšie?',help:'Mlieko dokáže prekryť jemnejšie chuťové tóny.',reply:'Super, už viem, či má káva vyniknúť sama alebo v mlieku.',options:[['black','black','Čiernu','Espresso, lungo alebo filtrovanú'],['milk','milk','S mliekom','Cappuccino, flat white alebo latte'],['both','both','Striedam oboje','Potrebujem univerzálnu kávu']]},
    {key:'caffeine',label:'Kofeín',title:'Klasickú alebo bezkofeínovú?',help:'Posledná otázka a pripravím odporúčanie.',reply:'Hotovo. Teraz porovnám kávy, ktoré vám najviac sedia.',options:[['classic','classic','Klasickú','Bežná káva s kofeínom'],['decaf','decaf','Bezkofeínovú','Na večer alebo bez povzbudenia'],['either','either','Je mi to jedno','Rozhodnite hlavne podľa chuti']]}
  ];

  const state = {step:0,answers:{},selected:null,weight:null,mode:'advisor'};
  const widget = $('#widget');
  const launcher = $('#launcher');
  const advisorScroll = $('#advisorScroll');
  const progress = $('#progress');
  const backBtn = $('#backBtn');
  const continueBtn = $('#continueBtn');

  const avatar = () => `<span class="avatar">${icons.logo}</span>`;
  const bot = (text) => `<div class="message">${avatar()}<div class="bubble">${text}</div></div>`;
  const user = (text) => `<div class="message me"><div class="bubble">${text}</div></div>`;
  const typing = () => `<div class="message" id="typing">${avatar()}<div class="bubble typing"><i></i><i></i><i></i></div></div>`;
  const money = (value) => `${value.toFixed(2).replace('.', ',')} €`;
  const scrollBottom = (el = advisorScroll) => requestAnimationFrame(() => { el.scrollTop = el.scrollHeight; });

  function openWidget() {
    widget.classList.add('open');
    widget.setAttribute('aria-hidden', 'false');
    launcher.style.display = 'none';
  }
  function closeWidget() {
    widget.classList.remove('open');
    widget.setAttribute('aria-hidden', 'true');
    launcher.style.display = 'flex';
  }
  $('#openWidget').addEventListener('click', openWidget);
  $('#closeWidget').addEventListener('click', closeWidget);

  function setMode(mode) {
    state.mode = mode;
    $$('.mode-btn').forEach((button) => {
      const active = button.dataset.mode === mode;
      button.classList.toggle('active', active);
      button.setAttribute('aria-selected', String(active));
    });
    $('#advisorView').classList.toggle('active', mode === 'advisor');
    $('#chatView').classList.toggle('active', mode === 'chat');
    if (mode === 'chat') setTimeout(() => $('#chatInput').focus(), 60);
  }
  $$('.mode-btn').forEach((button) => button.addEventListener('click', () => setMode(button.dataset.mode)));

  function renderProgress() {
    progress.innerHTML = Array.from({length:5}, (_, index) => `<i class="${index <= state.step ? 'on' : ''}"></i>`).join('');
    $('#stepLabel').textContent = `Krok ${Math.min(state.step + 1, 5)} z 5`;
    $('#stepHint').textContent = state.step < 4 ? questions[state.step].label : (state.selected ? 'Vyberte balenie' : 'Vaše odporúčanie');
  }

  function optionObject(raw) {
    return {value:raw[0],icon:raw[1],title:raw[2],text:raw[3]};
  }

  function renderQuestion() {
    const question = questions[state.step];
    const selected = state.answers[question.key];
    renderProgress();
    const history = questions.slice(0, state.step).map((q) => {
      const found = q.options.map(optionObject).find((option) => option.value === state.answers[q.key]);
      return found ? user(found.title) : '';
    }).join('');
    const intro = state.step === 0
      ? bot('Dobrý deň. Pomôžem vám vybrať kávu podľa chuti aj spôsobu prípravy. Zaberie to približne minútu.')
      : history;
    const reply = state.step === 0 ? 'Začnime tým najdôležitejším.' : questions[state.step - 1].reply;
    advisorScroll.innerHTML = intro + bot(reply) + `<div class="question-card"><h3>${question.title}</h3><p>${question.help}</p><div class="options">${question.options.map(optionObject).map((option, index) => `<button class="option ${selected === option.value ? 'selected' : ''}" data-value="${option.value}" style="animation-delay:${index * 45}ms"><span class="option-icon">${icons[option.icon]}</span><span><b>${option.title}</b><small>${option.text}</small></span><span class="chev">${selected === option.value ? icons.check : icons.next}</span></button>`).join('')}</div></div>`;
    $$('.option', advisorScroll).forEach((button) => button.addEventListener('click', () => selectOption(button.dataset.value)));
    continueBtn.disabled = !selected;
    continueBtn.style.display = 'inline-flex';
    continueBtn.innerHTML = state.step === 3 ? `Zobraziť výsledok ${icons.next}` : `Pokračovať ${icons.next}`;
    backBtn.disabled = state.step === 0;
    scrollBottom();
  }

  function selectOption(value) {
    const question = questions[state.step];
    state.answers[question.key] = value;
    $$('.option', advisorScroll).forEach((button) => {
      const active = button.dataset.value === value;
      button.classList.toggle('selected', active);
      button.querySelector('.chev').innerHTML = active ? icons.check : icons.next;
    });
    continueBtn.disabled = false;
  }

  function rankProducts() {
    return products.map((product) => {
      let score = 40;
      if (product.prep.includes(state.answers.prep)) score += 19;
      if (product.taste.includes(state.answers.taste)) score += 21;
      if (product.drink.includes(state.answers.drink)) score += 14;
      if (state.answers.caffeine === 'either' || product.caffeine === state.answers.caffeine) score += 18;
      else score -= 22;
      return {...product, score: Math.max(38, Math.min(98, score))};
    }).sort((a, b) => b.score - a.score).slice(0, 3);
  }

  function renderResults() {
    state.step = 4;
    renderProgress();
    backBtn.disabled = false;
    continueBtn.style.display = 'none';
    const ranked = rankProducts();
    advisorScroll.innerHTML = bot('Mám to. Podľa vašich odpovedí som vybral tri najvhodnejšie možnosti. Prvú odporúčam ako najistejšiu voľbu.') + `<div class="result-intro"><b>Odporúčanie je zoradené podľa zhody</b><span>Pri každej káve vidíte, prečo sa hodí práve k vašim odpovediam.</span></div>` + ranked.map((product, index) => `<article class="product-card ${index === 0 ? 'top' : ''}" style="animation-delay:${index * 70}ms"><div class="product-top"><div class="pack"><span>${product.name.split(' ')[0].toUpperCase()}</span></div><div><h4>${product.name}</h4><p>${product.origin}</p></div><span class="match">${product.score}% zhoda</span></div><p>${product.reason}</p><div class="tags">${product.tags.map((tag) => `<span class="tag">${tag}</span>`).join('')}</div><div class="product-foot"><span class="price">od ${money(product.price[250])}</span><button class="pick-btn" data-product="${product.id}">${index === 0 ? 'Vybrať odporúčanú' : 'Vybrať túto'}</button></div></article>`).join('');
    $$('.pick-btn', advisorScroll).forEach((button) => button.addEventListener('click', () => chooseProduct(button.dataset.product)));
    advisorScroll.scrollTop = 0;
  }

  function chooseProduct(id) {
    state.selected = products.find((product) => product.id === id);
    state.weight = null;
    renderWeight();
  }

  function renderWeight() {
    renderProgress();
    continueBtn.style.display = 'none';
    const product = state.selected;
    advisorScroll.innerHTML = bot(`Dobrá voľba. <strong>${product.name}</strong> vám podľa odpovedí sedí najlepšie. Ešte vyberte veľkosť balenia.`) + `<div class="question-card weight-wrap"><h3>Aké veľké balenie chcete?</h3><p>Pri väčšom balení vychádza jedna šálka výhodnejšie. Výber môžete ešte zmeniť.</p><div class="weight-grid">${[250,500,1000].map((weight) => `<button class="weight-btn ${weight === 500 ? 'popular' : ''}" data-weight="${weight}"><strong>${weight === 1000 ? '1 kg' : `${weight} g`}</strong><span>${weight === 250 ? 'Na vyskúšanie' : weight === 500 ? 'Najlepší pomer' : 'Domácnosť / firma'}</span><b>${money(product.price[weight])}</b></button>`).join('')}</div><div id="orderSummary"></div></div>`;
    $$('.weight-btn', advisorScroll).forEach((button) => button.addEventListener('click', () => {
      state.weight = Number(button.dataset.weight);
      $$('.weight-btn', advisorScroll).forEach((item) => item.classList.toggle('selected', item === button));
      renderSummary();
    }));
    advisorScroll.scrollTop = 0;
  }

  function renderSummary() {
    const product = state.selected;
    const weight = state.weight;
    $('#orderSummary').innerHTML = `<div class="summary"><div class="summary-row"><span>Káva</span><strong>${product.name}</strong></div><div class="summary-row"><span>Balenie</span><strong>${weight === 1000 ? '1 kg' : `${weight} g`}</strong></div><div class="summary-row summary-total"><span>Spolu</span><strong>${money(product.price[weight])}</strong></div></div><button class="full-btn" id="orderBtn">Pridať do košíka</button>`;
    $('#orderBtn').addEventListener('click', renderSuccess);
    scrollBottom();
  }

  function renderSuccess() {
    $('#orderSummary').innerHTML = `<div class="success-card"><div class="success-icon">${icons.check}</div><h3>Káva je pripravená v košíku</h3><p>${state.selected.name}, ${state.weight === 1000 ? '1 kg' : `${state.weight} g`}. V ostrom e-shope by sa teraz otvoril reálny košík.</p></div><button class="full-btn" id="startAgain">Vybrať inú kávu</button>`;
    $('#startAgain').addEventListener('click', resetAdvisor);
    scrollBottom();
  }

  continueBtn.addEventListener('click', () => {
    if (state.step < 3) {
      state.step += 1;
      renderQuestion();
    } else renderResults();
  });
  backBtn.addEventListener('click', () => {
    if (state.step === 4) {
      state.selected = null;
      state.weight = null;
      state.step = 3;
      renderQuestion();
    } else if (state.step > 0) {
      state.step -= 1;
      renderQuestion();
    }
  });

  function resetAdvisor() {
    state.step = 0;
    state.answers = {};
    state.selected = null;
    state.weight = null;
    renderQuestion();
    setMode('advisor');
  }
  $('#resetBtn').addEventListener('click', resetAdvisor);

  const chatMessages = $('#chatMessages');
  const quicks = ['Ktorá je najmenej kyslá?','Aká káva do automatu?','Káva na cappuccino','Máte bezkofeínovú?'];
  chatMessages.innerHTML = bot('Dobrý deň. Môžete sa ma opýtať na chuť, prípravu, mletie, dopravu alebo konkrétnu kávu. Pre presný výber použite režim <strong>Vybrať kávu</strong>.');
  $('#quickChips').innerHTML = quicks.map((question) => `<button type="button">${question}</button>`).join('');
  $$('#quickChips button').forEach((button) => button.addEventListener('click', () => sendChat(button.textContent)));

  function answerFor(text) {
    const value = text.toLowerCase();
    if (value.includes('kysl')) return 'Najnižšiu aciditu majú Brazil Santos, Cuba Serrano a zmesi Paganini a Puccini. Pre jemnú čiernu kávu by som začal Brazil Santos.';
    if (value.includes('automat')) return 'Do automatu je najbezpečnejšia Paganini: má dobrú krému a funguje čierna aj s mliekom. Jemnejšia alternatíva je Brazil Santos.';
    if (value.includes('capp') || value.includes('latte') || value.includes('mliek')) return 'Do cappuccina odporúčam Puccini pre výraznejšiu chuť alebo Paganini pre vyváženejší výsledok.';
    if (value.includes('bez kof') || value.includes('decaf') || value.includes('večer')) return 'Bezkofeínová Brazil je jemná, má nízku aciditu a hodí sa aj do automatu či moka kanvičky.';
    if (value.includes('mlet')) return 'Najlepšiu arómu má zrnková káva zomletá tesne pred prípravou. Mletie treba prispôsobiť automatu, páke, moka kanvičke alebo filtru.';
    if (value.includes('dopr') || value.includes('odosl')) return 'Objednávky sa zvyčajne expedujú nasledujúci pracovný deň. Presnú cenu dopravy zobrazí e-shop pred dokončením objednávky.';
    return 'Najpresnejšie odporúčanie pripravím cez režim „Vybrať kávu“. Môžete mi však dopísať, aký kávovar používate a či pijete kávu s mliekom.';
  }

  function sendChat(text) {
    const clean = (text || '').trim();
    if (!clean) return;
    chatMessages.insertAdjacentHTML('beforeend', user(clean) + typing());
    $('#chatInput').value = '';
    scrollBottom(chatMessages);
    setTimeout(() => {
      $('#typing')?.remove();
      chatMessages.insertAdjacentHTML('beforeend', bot(answerFor(clean)));
      scrollBottom(chatMessages);
    }, 520);
  }
  $('#chatForm').addEventListener('submit', (event) => {
    event.preventDefault();
    sendChat($('#chatInput').value);
  });

  renderQuestion();
  if (new URLSearchParams(location.search).get('open') === '1') openWidget();
})();
