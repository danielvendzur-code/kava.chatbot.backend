(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const line = (d) => `<path d="${d}" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>`;
  const svg = (body, viewBox = '0 0 24 24') => `<svg viewBox="${viewBox}" fill="none" aria-hidden="true">${body}</svg>`;

  const I = {
    chat: svg(line('M5 18.5 3.5 21v-5A8.5 8.5 0 1 1 12 20.5c-2.7 0-5.1-.7-7-2Z') + line('M8 12h.01M12 12h.01M16 12h.01')),
    bean: svg(line('M8 20c-2-4 1-6 2-9 1-2 0-5 2-8 4 4 5 7 4 10 3-1 4-2 4-4 2 6-1 11-6 11H8Z')),
    question: svg('<circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.9"/>' + line('M9.8 9a2.3 2.3 0 1 1 3.7 1.8c-.9.6-1.5 1-1.5 2.2M12 17h.01')),
    quiz: svg(line('M5 4h14v16H5zM8 8h8M8 12h5M8 16h3')),
    refresh: svg(line('M20 11a8 8 0 1 0-2.3 5.7') + line('M20 5v6h-6')),
    close: svg(line('m6 6 12 12M18 6 6 18')),
    back: svg(line('m15 18-6-6 6-6')),
    next: svg(line('m9 18 6-6-6-6')),
    send: svg(line('m4 4 16 8-16 8 3-8-3-8Z') + line('M7 12h13')),
    check: svg(line('m5 12 4 4L19 6')),
    shop: svg(line('M4 9h16l-1 11H5L4 9ZM7 9V6a5 5 0 0 1 10 0v3')),
    pin: svg('<circle cx="12" cy="10" r="3" stroke="currentColor" stroke-width="1.9"/>' + line('M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z')),
    phone: svg(line('M7.2 3.5 4.7 5.8c-.8.8-.4 3.4 2.8 6.7 3.3 3.3 5.9 3.7 6.7 2.8l2.3-2.5-3-2-1.7 1.7c-1.2-.5-2.3-1.4-3.2-2.3-.9-.9-1.8-2-2.3-3.2L8 5.3l-.8-1.8Z')),
    bulb: svg(line('M9 18h6M10 21h4M8.2 14.5A7 7 0 1 1 15.8 14.5c-.7.6-1 1.3-1 2.5H9.2c0-1.2-.3-1.9-1-2.5Z')),
    chocolate: svg(line('M5 5h14v14H5zM9.7 5v14M14.3 5v14M5 9.7h14M5 14.3h14')),
    balanced: svg(line('M12 3v18M5 7h14M6 7l-3 7h6L6 7Zm12 0-3 7h6l-3-7Z')),
    fruity: svg(line('M12 7c4-3 7 0 7 4 0 5-3 9-7 10-4-1-7-5-7-10 0-4 3-7 7-4ZM12 7c0-2 1-4 4-5')),
    strong: svg(line('M8 21c-2-4 1-6 2-9 1-2 0-5 2-9 4 4 5 7 4 10 3-1 4-2 4-4 3 6 0 12-6 12H8Z')),
    black: svg(line('M5 8h12v7a5 5 0 0 1-5 5h-2a5 5 0 0 1-5-5V8ZM17 10h2a2 2 0 0 1 0 4h-2')),
    milk: svg(line('M7 3h10l1 4v14H6V7l1-4ZM6 8h12M9 12c2 2 4 2 6 0')),
    both: svg('<path d="M4 6h7v12H4zM13 6h7v12h-7z" stroke="currentColor" stroke-width="1.9"/>' + line('M6 9h3M15 9h3M6 13h3M15 13h3')),
    classic: svg(line('m13 2-7 11h6l-1 9 7-12h-6l1-8Z')),
    decaf: svg(line('M20 15.5A8 8 0 1 1 8.5 4 7 7 0 0 0 20 15.5ZM15 5h.01M18 8h.01')),
    either: svg(line('M5 8h14M5 16h14M16 5l3 3-3 3M8 13l-3 3 3 3'))
  };

  function logo() {
    return `<svg class="pz-logo" viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path class="pz-logo__bubble" d="M52.5 39.2c3.8-4.1 6-9.2 6-14.8C58.5 12.1 47.2 4 32.6 4S6.5 12.1 6.5 24.4s11.3 20.7 26.1 20.7c3.4 0 6.7-.5 9.6-1.4L53 50l-2.3-10.8Z" stroke="currentColor" stroke-width="4.4"/>
      <path class="pz-logo__bean" d="M22.5 31.8c0-8.1 5-14.1 11.4-14.1 4.9 0 8.5 3.8 8.5 8.9 0 7.7-5.9 14.2-12.9 14.8-4 .3-7-3.8-7-9.6Z" stroke="currentColor" stroke-width="4.1"/>
      <path class="pz-logo__seam" d="M28.8 38.7c5.9-4.5 8.4-10.1 8.2-17.1" stroke="currentColor" stroke-width="3.1"/>
    </svg>`;
  }

  const products = [
    {
      id: 'paganini',
      name: 'Paganini blend',
      origin: '75 % arabica · 25 % robusta',
      price: 'od 11,90 €',
      url: 'https://praziarnicka.sk/produkt/paganini-blend-75-arabica-25-robusta',
      prep: ['automatic','lever','moka'], taste: ['balanced','strong'], drink: ['milk','black','both'], caffeine: ['classic','either'],
      tags: ['čokoláda','mandle','plné telo'],
      reason: 'Vyvážená zmes s plným telom, ktorá zostane čitateľná v espresse aj cappuccine.'
    },
    {
      id: 'brazil',
      name: 'Brazil Santos',
      origin: '100 % arabica',
      price: 'od 9,90 €',
      url: 'https://praziarnicka.sk/produkt/brazil-santos-100percent-arabica',
      prep: ['automatic','lever','moka','filter'], taste: ['chocolate','balanced'], drink: ['black','both'], caffeine: ['classic','either'],
      tags: ['kakao','sladká','nízka acidita'],
      reason: 'Jemná, sladšia arabica s minimálnou aciditou. Bezpečná každodenná voľba pre klasické chute.'
    },
    {
      id: 'puccini',
      name: 'Puccini blend',
      origin: '60 % arabica · 40 % robusta',
      price: 'od 11,50 €',
      url: 'https://praziarnicka.sk/produkt/puccini-60arabica-40-robusta',
      prep: ['automatic','lever','moka'], taste: ['strong','balanced'], drink: ['milk','both'], caffeine: ['classic','either'],
      tags: ['tmavá čokoláda','orechy','kréma'],
      reason: 'Výraznejšia a sladká zmes s hustou krémou, vhodná najmä do mliečnych nápojov a automatu.'
    },
    {
      id: 'cuba',
      name: 'Cuba Serrano Lavado',
      origin: '100 % arabica',
      price: 'od 12,90 €',
      url: 'https://praziarnicka.sk/produkt/cuba-serrano-lavado-100-arabica',
      prep: ['lever','moka','filter'], taste: ['chocolate','balanced'], drink: ['black'], caffeine: ['classic','either'],
      tags: ['kakao','vlašské orechy','bez acidity'],
      reason: 'Plná a sladká kubánska arabica s kakaovým telom a prakticky nulovou aciditou.'
    },
    {
      id: 'decaf',
      name: 'Bezkofeínová Brazil',
      origin: '100 % arabica · bez kofeínu',
      price: 'od 12,90 €',
      url: 'https://praziarnicka.sk/produkt/bezkofeinova-kava-brazilia',
      prep: ['automatic','lever','moka','filter'], taste: ['chocolate','balanced'], drink: ['black','milk','both'], caffeine: ['decaf'],
      tags: ['bez kofeínu','jemná','na večer'],
      reason: 'Bezkofeínová voľba pre večernú šálku bez toho, aby ste sa museli vzdať plnej kávovej chuti.'
    }
  ];

  const questions = [
    {
      key: 'prep', label: 'Príprava', title: 'Ako kávu pripravujete?',
      options: [
        ['automatic','Automatický kávovar','Jednoduchá príprava jedným tlačidlom','photo'],
        ['lever','Pákový kávovar','Espresso pripravujete ručne','photo'],
        ['moka','Moka kanvička','Výrazná domáca príprava','photo'],
        ['filter','Filter alebo zalievanie','V60, French press či prekvapkávanie','photo']
      ]
    },
    {
      key: 'taste', label: 'Chuť', title: 'Ktorá chuť vám je najbližšia?',
      options: [
        ['chocolate','Sladká a čokoládová','Bez výraznej ovocnej acidity','chocolate'],
        ['balanced','Vyvážená','Plná chuť bez extrémov','balanced'],
        ['fruity','Ovocná a svieža','Aromatickejší moderný profil','fruity'],
        ['strong','Silná a výrazná','Intenzívne telo a dlhšia dochuť','strong']
      ]
    },
    {
      key: 'drink', label: 'Nápoj', title: 'Ako ju pijete najčastejšie?',
      options: [
        ['black','Čiernu','Espresso, lungo alebo filter','black'],
        ['milk','S mliekom','Cappuccino, flat white alebo latte','milk'],
        ['both','Striedam oboje','Potrebujete univerzálnu kávu','both']
      ]
    },
    {
      key: 'caffeine', label: 'Kofeín', title: 'Klasickú alebo bezkofeínovú?',
      options: [
        ['classic','Klasickú','Bežná káva s kofeínom','classic'],
        ['decaf','Bezkofeínovú','Na večer alebo bez povzbudenia','decaf'],
        ['either','Je mi to jedno','Rozhodnite hlavne podľa chuti','either']
      ]
    }
  ];

  const facts = {
    automatic: 'Do automatu je vhodná stabilná káva s plnším telom, ktorá dobre funguje aj pri rôznom nastavení mlynčeka.',
    chocolate: 'Čokoládové tóny nevznikajú pridanou arómou. Prirodzene ich vytvára pôvod zrna a spôsob praženia.',
    fruity: 'Ovocnosť nemusí znamenať nepríjemnú kyslosť. Pri dobrej káve pôsobí skôr ako sviežosť a aróma.',
    milk: 'Mlieko zjemní chuť, preto je vhodná káva s plnším telom a výraznejšou dochuťou.',
    decaf: 'Bezkofeínová káva môže chutiť plnohodnotne. Rozdiel je v kofeíne, nie v potrebe zmieriť sa so slabou chuťou.'
  };

  const root = $('#praziarnicka-root');
  if (!root) return;

  root.innerHTML = `
    <main class="pz-page">
      <header class="pz-header">
        <div class="pz-brand"><span class="pz-brand__mark">${logo()}</span><span class="pz-brand__copy"><strong>Pražiarnička</strong><span>by Caffè Vita · Trenčín</span></span></div>
        <span class="pz-demo-label">Interaktívny návrh</span>
      </header>
      <section class="pz-hero">
        <div class="pz-copy">
          <h1>Káva, ktorú si zákazník vyberie s istotou.</h1>
          <p>Poradca odpovie na otázky, vysvetlí rozdiely a cez krátky chuťový kvíz odporučí konkrétnu kávu, balenie aj mletie z ponuky Pražiarničky.</p>
          <div class="pz-benefits">
            <div class="pz-benefit"><b>Pomôže s výberom</b><span>Zákazník dostane konkrétny produkt, nie iba všeobecnú radu.</span></div>
            <div class="pz-benefit"><b>Odpovie na otázky</b><span>Vysvetlí aciditu, mletie, kávovar aj rozdiel medzi zmesami.</span></div>
            <div class="pz-benefit"><b>Vyrieši nerozhodnosť</b><span>Štyri jednoduché otázky ho privedú k vhodnej káve za minútu.</span></div>
          </div>
          <div class="pz-hero-actions"><button class="pz-primary" id="pzHeroOpen" type="button">Vyskúšať výber kávy ${I.next}</button><small>Funkčná ukážka s reálnymi produktmi Pražiarničky.</small></div>
        </div>
        <aside class="pz-preview-wrap">
          <div class="pz-preview">
            <div class="pz-preview__head"><b>Osobné odporúčanie</b><span class="pz-online">pripravené za minútu</span></div>
            <div class="pz-preview__body">
              <div class="pz-preview-card"><div class="pz-bag"><small>PRAŽIARNIČKA</small><span class="pz-bag-logo">${logo()}</span></div><div class="pz-preview-card__copy"><small>Najlepšia voľba</small><strong>Paganini blend</strong><span>Vyvážená zmes na espresso aj cappuccino.</span><div class="pz-preview-tags"><i>čokoláda</i><i>mandle</i><i>plné telo</i></div></div></div>
              <div class="pz-preview-steps"><i></i><i></i><i></i><i></i></div>
              <p class="pz-preview-note">Výsledok vysvetlí dôvod odporúčania a pokračuje priamo k baleniu alebo produktu v e-shope.</p>
            </div>
          </div>
        </aside>
      </section>
      <footer class="pz-footer"><span>Neoficiálna ukážka pripravená pre Pražiarničku.</span><a href="https://praziarnicka.sk/eshop" target="_blank" rel="noreferrer">Aktuálny e-shop</a></footer>
    </main>

    <div class="pz-launcher" id="pzLauncher">
      <div class="pz-teaser" id="pzTeaser" role="button" tabindex="0" aria-label="Otvoriť kávového poradcu">
        <button class="pz-teaser__close" id="pzTeaserClose" type="button" aria-label="Skryť ukážku">×</button>
        <b>Neviete, ktorú kávu vybrať?</b><span>Opýtajte sa alebo ju nájdeme cez krátky chuťový kvíz.</span>
      </div>
      <button class="pz-launcher__button" id="pzOpen" type="button" aria-label="Otvoriť kávového poradcu" aria-expanded="false">${logo()}<span class="pz-launcher__dot"></span></button>
    </div>

    <section class="pz-widget" id="pzWidget" aria-hidden="true" aria-label="Kávový poradca Pražiarničky">
      <header class="pz-widget__head">
        <div class="pz-widget-brand"><span class="pz-widget-brand__mark">${logo()}</span><span class="pz-widget-brand__copy"><strong>Pražiarnička</strong><span>Online</span></span></div>
        <div class="pz-widget-actions"><button class="pz-icon-btn" id="pzReset" type="button" aria-label="Začať odznova">${I.refresh}</button><button class="pz-icon-btn" id="pzClose" type="button" aria-label="Zavrieť">${I.close}</button></div>
      </header>
      <nav class="pz-mode" id="pzMode"><span class="pz-mode__thumb"></span><button class="pz-mode__btn is-active" data-mode="chat" type="button">${I.chat}<b>Chat</b></button><button class="pz-mode__btn" data-mode="advisor" type="button">${I.bean}<b>Výber kávy</b></button></nav>
      <div class="pz-stage">
        <section class="pz-screen is-active" id="pzChatScreen">
          <button class="pz-advisor-entry" id="pzOpenAdvisor" type="button"><span class="pz-advisor-entry__icon">${I.bean}</span><span class="pz-advisor-entry__copy"><small>Chuťový kvíz</small><b>Nájsť kávu na mieru</b><span>4 otázky · približne 1 minúta</span></span><span class="pz-advisor-entry__arrow">${I.next}</span></button>
          <div class="pz-chat" id="pzMessages" aria-live="polite"></div>
          <div class="pz-chips" id="pzChips"></div>
          <form class="pz-composer" id="pzForm"><div class="pz-composer__shell"><input id="pzInput" autocomplete="off" placeholder="Opýtajte sa na kávu…" aria-label="Otázka o káve"><button class="pz-send" type="submit" aria-label="Odoslať">${I.send}</button></div></form>
          <div class="pz-support"><a href="https://praziarnicka.sk/eshop" target="_blank" rel="noreferrer">${I.shop}E-shop</a><a href="https://praziarnicka.sk/kaviaren" target="_blank" rel="noreferrer">${I.pin}Kaviareň</a><a href="tel:+421918560693">${I.phone}Zavolať</a></div>
        </section>
        <section class="pz-screen" id="pzAdvisorScreen">
          <div class="pz-progressbar"><button class="pz-back" id="pzBack" type="button" aria-label="Predchádzajúca otázka">${I.back}</button><div class="pz-progress-copy"><b id="pzStep">1 / 4</b><span id="pzStepName">Príprava</span></div><div class="pz-progress" id="pzProgress"></div></div>
          <div class="pz-advisor" id="pzAdvisor" aria-live="polite"></div>
        </section>
      </div>
    </section>`;

  const state = { mode: 'chat', step: 0, answers: {}, stage: 'questions', selectedProduct: null, weight: null, grind: 'beans', busy: false, history: [] };
  const widget = $('#pzWidget');
  const launcher = $('#pzLauncher');
  const teaser = $('#pzTeaser');
  const mode = $('#pzMode');
  const messages = $('#pzMessages');
  const advisor = $('#pzAdvisor');

  const time = () => new Date().toLocaleTimeString('sk-SK', { hour: '2-digit', minute: '2-digit' });
  const escapeHTML = (value) => value.replace(/[&<>'"]/g, (char) => ({ '&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;' }[char]));

  function openWidget() {
    widget.classList.add('is-open');
    widget.setAttribute('aria-hidden', 'false');
    $('#pzOpen').setAttribute('aria-expanded', 'true');
    launcher.style.display = 'none';
    document.body.classList.add('pz-open');
    teaser.classList.remove('is-visible');
  }
  function closeWidget() {
    widget.classList.remove('is-open');
    widget.setAttribute('aria-hidden', 'true');
    $('#pzOpen').setAttribute('aria-expanded', 'false');
    document.body.classList.remove('pz-open');
    setTimeout(() => { launcher.style.display = 'block'; }, 240);
  }
  function setMode(next) {
    state.mode = next;
    mode.classList.toggle('is-advisor', next === 'advisor');
    $$('.pz-mode__btn').forEach((btn) => btn.classList.toggle('is-active', btn.dataset.mode === next));
    $('#pzChatScreen').classList.toggle('is-active', next === 'chat');
    $('#pzAdvisorScreen').classList.toggle('is-active', next === 'advisor');
    if (next === 'advisor') renderAdvisor();
  }

  function addMessage(text, user = false, allowHTML = false) {
    const row = document.createElement('div');
    row.className = `pz-message${user ? ' pz-message--user' : ''}`;
    const body = allowHTML ? text : escapeHTML(text);
    row.innerHTML = `${user ? '' : `<span class="pz-avatar">${logo()}</span>`}<div class="pz-message__stack"><div class="pz-bubble">${body}</div><div class="pz-time">${time()}</div></div>`;
    messages.appendChild(row);
    requestAnimationFrame(() => { messages.scrollTop = messages.scrollHeight; });
  }
  function showTyping() {
    const row = document.createElement('div');
    row.id = 'pzTyping'; row.className = 'pz-message';
    row.innerHTML = `<span class="pz-avatar">${logo()}</span><div class="pz-message__stack"><div class="pz-bubble pz-typing"><i></i><i></i><i></i></div></div>`;
    messages.appendChild(row); messages.scrollTop = messages.scrollHeight;
  }
  function ranked() {
    return products.map((product) => {
      let score = 0;
      Object.entries(state.answers).forEach(([key, value]) => { if (product[key]?.includes(value)) score += key === 'caffeine' ? 4 : 3; });
      return { ...product, score };
    }).sort((a,b) => b.score - a.score);
  }
  function fallback(text) {
    const q = text.toLowerCase(); const list = ranked();
    if (q.includes('automat')) return `Do automatu by som odporučil <b>${list.find((p) => p.prep.includes('automatic'))?.name || list[0].name}</b>. Má stabilné telo a funguje pri každodennej príprave.`;
    if (q.includes('kysl') || q.includes('acid')) return `Skúste <b>${list.find((p) => p.taste.includes('chocolate'))?.name || list[0].name}</b>. Patrí medzi sladšie profily s nízkou aciditou.`;
    if (q.includes('mlie') || q.includes('capp')) return `Do cappuccina sa hodí <b>${list.find((p) => p.drink.includes('milk'))?.name || list[0].name}</b>, pretože zostane čitateľná aj po pridaní mlieka.`;
    if (q.includes('bez') || q.includes('večer')) return 'Najvhodnejšia je <b>Bezkofeínová Brazil</b> — jemná voľba na večer bez povzbudivého účinku.';
    return 'Najpresnejšie odporúčanie získate cez krátky výber kávy. Zohľadní prípravu, chuť, mlieko aj kofeín.';
  }
  async function send(text, chip) {
    const value = text.trim(); if (!value) return;
    addMessage(value, true); $('#pzInput').value = ''; showTyping();
    try {
      state.history.push({ role:'user', content:value });
      const response = await fetch('/api/chat', { method:'POST', headers:{'content-type':'application/json'}, body:JSON.stringify({ demoId:'praziarnicka', messages:state.history.slice(-10) }) });
      if (!response.ok) throw new Error('offline');
      const data = await response.json();
      if (!data.reply) throw new Error('empty');
      state.history.push({ role:'assistant', content:data.reply });
      $('#pzTyping')?.remove(); addMessage(data.reply, false, false);
    } catch (_) {
      await new Promise((resolve) => setTimeout(resolve, 380));
      $('#pzTyping')?.remove(); addMessage(fallback(value), false, true);
    } finally { chip?.classList.remove('is-sending'); }
  }
  function seedChat() {
    messages.innerHTML = ''; state.history = [];
    addMessage('Dobrý deň. Pomôžem vám vybrať kávu z ponuky Pražiarničky podľa chuti aj spôsobu prípravy.');
  }
  function renderChips() {
    const labels = ['Káva do automatu','Nechcem kyslú kávu','Káva na cappuccino','Bezkofeínová'];
    $('#pzChips').innerHTML = labels.map((label) => `<button class="pz-chip" type="button"><span>${label}</span></button>`).join('');
    $$('.pz-chip').forEach((chip) => {
      chip.addEventListener('pointerdown', (event) => { const rect = chip.getBoundingClientRect(); chip.style.setProperty('--fill-x', `${event.clientX - rect.left}px`); chip.style.setProperty('--fill-y', `${event.clientY - rect.top}px`); });
      chip.addEventListener('click', () => { if (chip.classList.contains('is-sending')) return; chip.classList.add('is-sending'); setTimeout(() => send(chip.textContent.trim(), chip), 480); });
    });
  }

  function updateProgress() {
    const result = state.stage !== 'questions';
    $('#pzStep').textContent = result ? 'Výsledok' : `${state.step + 1} / 4`;
    $('#pzStepName').textContent = result ? 'Vaša káva' : questions[state.step].label;
    $('#pzBack').disabled = state.stage === 'questions' && state.step === 0;
    $('#pzProgress').innerHTML = [0,1,2,3].map((index) => `<i class="${index < state.step || result ? 'is-done ' : ''}${index === state.step && !result ? 'is-active' : ''}"></i>`).join('');
  }
  function renderQuestion() {
    const q = questions[state.step]; const selected = state.answers[q.key]; const fact = selected && facts[selected];
    advisor.innerHTML = `<div class="pz-question"><small>${q.label}</small><h2>${q.title}</h2></div><div class="pz-options">${q.options.map(([value,label,desc,visual], index) => {
      const pic = visual === 'photo' ? `<span class="pz-option__photo pz-option__photo--${value}"></span>` : `<span class="pz-option__icon">${I[visual]}</span>`;
      return `<button class="pz-option ${selected === value ? 'is-selected' : selected ? 'is-muted' : ''}" type="button" data-value="${value}" style="animation-delay:${index * 85}ms">${pic}<span class="pz-option__copy"><b>${label}</b><span>${desc}</span></span><span class="pz-option__state">${selected === value ? I.check : I.next}</span></button>`;
    }).join('')}</div>${fact ? `<div class="pz-fact">${I.bulb}<span>${fact}</span></div>` : ''}`;
    $$('.pz-option', advisor).forEach((button) => button.addEventListener('click', () => choose(button.dataset.value)));
  }
  function choose(value) {
    if (state.busy || state.stage !== 'questions') return;
    const q = questions[state.step]; state.answers[q.key] = value; state.busy = true; renderQuestion();
    setTimeout(() => { if (state.step < 3) state.step += 1; else state.stage = 'result'; state.busy = false; renderAdvisor(); }, 760);
  }
  function bag(product) { return `<div class="pz-bag"><small>PRAŽIARNIČKA</small><span class="pz-bag-logo">${logo()}</span></div>`; }
  function renderResult() {
    const list = ranked(); const best = list[0];
    state.selectedProduct ||= best.id;
    const product = list.find((item) => item.id === state.selectedProduct) || best;
    const alternative = list.find((item) => item.id !== product.id);
    advisor.innerHTML = `<div class="pz-result-head"><small>Osobné odporúčanie</small><h2>Táto káva vám sedí najviac</h2></div><section class="pz-result-card"><div class="pz-result-badge"><b>Odporúčanie podľa vašich odpovedí</b><span>${product.price}</span></div><div class="pz-result-product">${bag(product)}<div class="pz-result-copy"><h3>${product.name}</h3><span>${product.origin}</span><div class="pz-tags">${product.tags.map((tag) => `<span>${tag}</span>`).join('')}</div></div></div><div class="pz-reason"><b>Prečo práve táto</b><p>${product.reason}</p></div><div class="pz-result-actions"><button class="pz-btn pz-btn--main" id="pzPack" type="button">Vybrať balenie</button><button class="pz-btn pz-btn--ghost" id="pzRestart" type="button">Zmeniť odpovede</button></div>${alternative ? `<button class="pz-alternative" data-product="${alternative.id}" type="button"><div><b>Alternatíva: ${alternative.name}</b><span>${alternative.tags.slice(0,2).join(' · ')}</span></div>${I.next}</button>` : ''}</section>`;
    $('#pzPack').addEventListener('click', () => { state.stage = 'package'; renderAdvisor(); });
    $('#pzRestart').addEventListener('click', resetAdvisor);
    $('.pz-alternative')?.addEventListener('click', (event) => { state.selectedProduct = event.currentTarget.dataset.product; renderResult(); });
  }
  const grinds = [['beans','Zrnková'],['espresso','Espresso'],['moka','Moka'],['filter','Filter']];
  function renderPackage() {
    const product = products.find((item) => item.id === state.selectedProduct) || ranked()[0];
    advisor.innerHTML = `<div class="pz-choice-head"><h2>Balenie a mletie</h2><p>Vyberte formu, v ktorej by zákazník pokračoval na produkt.</p></div><div class="pz-choice-grid">${[250,500,1000].map((weight) => `<button class="pz-choice-card ${state.weight === weight ? 'is-selected' : ''}" data-weight="${weight}" type="button"><i class="pz-pack-icon"></i><b>${weight === 1000 ? '1 kg' : `${weight} g`}</b><span>${weight === 250 ? 'na ochutnanie' : weight === 500 ? 'bežná zásoba' : 'najväčšie balenie'}</span></button>`).join('')}</div><div class="pz-choice-section"><b>Mletie</b><div class="pz-grinds">${grinds.map(([value,label]) => `<button class="pz-grind ${state.grind === value ? 'is-selected' : ''}" data-grind="${value}" type="button">${label}</button>`).join('')}</div></div><div class="pz-summary"><div><span>Káva</span><b>${product.name}</b></div><div><span>Balenie</span><b>${state.weight ? state.weight === 1000 ? '1 kg' : `${state.weight} g` : '—'}</b></div><div><span>Mletie</span><b>${grinds.find(([value]) => value === state.grind)[1]}</b></div><div><span>Cena</span><b>${product.price}</b></div></div><button class="pz-checkout" id="pzCheckout" type="button" ${state.weight ? '' : 'disabled'}>Pozrieť produkt v e-shope</button>`;
    $$('.pz-choice-card', advisor).forEach((button) => button.addEventListener('click', () => { state.weight = Number(button.dataset.weight); renderPackage(); }));
    $$('.pz-grind', advisor).forEach((button) => button.addEventListener('click', () => { state.grind = button.dataset.grind; renderPackage(); }));
    $('#pzCheckout').addEventListener('click', () => { state.stage = 'success'; renderAdvisor(); });
  }
  function renderSuccess() {
    const product = products.find((item) => item.id === state.selectedProduct) || ranked()[0];
    advisor.innerHTML = `<div class="pz-success"><div class="pz-success__icon">${I.check}</div><h2>Výber je pripravený</h2><p>${product.name}, ${state.weight === 1000 ? '1 kg' : `${state.weight} g`}, ${grinds.find(([value]) => value === state.grind)[1].toLowerCase()}. Zákazník by teraz pokračoval na konkrétny produkt.</p><a class="pz-primary" href="${product.url}" target="_blank" rel="noreferrer">Otvoriť produkt ${I.next}</a><button class="pz-btn pz-btn--ghost" id="pzAgain" type="button">Vybrať ďalšiu kávu</button></div>`;
    $('#pzAgain').addEventListener('click', resetAdvisor);
  }
  function renderAdvisor() { updateProgress(); if (state.stage === 'questions') renderQuestion(); else if (state.stage === 'result') renderResult(); else if (state.stage === 'package') renderPackage(); else renderSuccess(); advisor.scrollTop = 0; }
  function resetAdvisor() { Object.assign(state, { step:0, answers:{}, stage:'questions', selectedProduct:null, weight:null, grind:'beans', busy:false }); renderAdvisor(); }
  function resetAll() { resetAdvisor(); seedChat(); setMode('chat'); }

  $('#pzHeroOpen').addEventListener('click', () => { openWidget(); setMode('advisor'); });
  $('#pzOpen').addEventListener('click', openWidget);
  teaser.addEventListener('click', (event) => { if (!event.target.closest('#pzTeaserClose')) openWidget(); });
  teaser.addEventListener('keydown', (event) => { if (event.key === 'Enter' || event.key === ' ') openWidget(); });
  $('#pzTeaserClose').addEventListener('click', (event) => { event.stopPropagation(); teaser.classList.remove('is-visible'); });
  $('#pzClose').addEventListener('click', closeWidget);
  $('#pzReset').addEventListener('click', resetAll);
  $('#pzOpenAdvisor').addEventListener('click', () => setMode('advisor'));
  $$('.pz-mode__btn').forEach((button) => button.addEventListener('click', () => setMode(button.dataset.mode)));
  $('#pzForm').addEventListener('submit', (event) => { event.preventDefault(); send($('#pzInput').value); });
  $('#pzBack').addEventListener('click', () => { if (state.stage !== 'questions') { state.stage = 'questions'; state.step = 3; } else if (state.step > 0) state.step -= 1; state.busy = false; renderAdvisor(); });

  seedChat(); renderChips(); renderAdvisor();
  setTimeout(() => teaser.classList.add('is-visible'), 1250);
})();
