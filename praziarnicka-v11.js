(() => {
  'use strict';

  const root = document.querySelector('#praziarnicka-root');
  if (!root) return;

  const asset = name => `/assets/praziarnicka/${name}`;
  const mark = `<svg class="pz-mark" viewBox="0 0 64 64" fill="none" aria-hidden="true" focusable="false"><path d="M31.9 5.8c14.7 0 26.3 10.7 26.3 24.8 0 15.3-12.4 27.6-28.5 27.6-14.4 0-23.9-9.6-23.9-22.6C5.8 18.2 17.2 5.8 31.9 5.8Z" fill="#F8F2E8"/><path d="M17.3 37.1c0-12.8 7.8-22 17.7-22 7.7 0 13.5 5.8 13.5 13.9 0 12-9.4 22.3-20.4 23.2-6 .5-10.8-5.8-10.8-15.1Z" fill="#173F37"/><path d="M25.9 47.3c9.5-7 13-15.9 12.4-26.5" stroke="#F8F2E8" stroke-width="3.6" stroke-linecap="round"/><path d="M15 21.3c5.2.2 9.4 2.7 12.1 7.3" stroke="#C66B49" stroke-width="2.5" stroke-linecap="round"/><path d="M18.6 14.3c5.4.9 9.4 3.9 11.4 8.7" stroke="#C66B49" stroke-width="2.5" stroke-linecap="round"/></svg>`;
  const icon = path => `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="${path}" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  const icons = {
    arrow: icon('M5 12h13m-5-6 6 6-6 6'),
    send: icon('m4 4 16 8-16 8 3-8-3-8Zm3 8h13'),
    close: icon('m6 6 12 12M18 6 6 18'),
    back: icon('m15 18-6-6 6-6'),
    check: icon('m5 12 4 4L19 6'),
    chat: icon('M5 5h14v10H9l-4 4V5Z'),
    cup: icon('M5 7h11v7a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5V7Zm11 2h2a2 2 0 0 1 0 4h-2'),
    reset: icon('M20 11a8 8 0 1 0-2.3 5.7M20 5v6h-6')
  };

  const products = [
    {
      id: 'paganini', name: 'Paganini blend', price: 'od 11,90 €', profile: 'Plná a čokoládová',
      url: 'https://praziarnicka.sk/produkt/paganini-blend-75-arabica-25-robusta', photo: asset('result-espresso.webp'),
      prep: ['automatic', 'lever', 'moka'], taste: ['balanced', 'chocolate', 'strong'], drink: ['milk', 'black', 'both'], caffeine: ['classic'],
      notes: ['čokoláda', 'mandle', 'orechy'], reason: 'Chcete plné espresso, ktoré chutí dobre samostatne aj s mliekom. Paganini je príjemná istota na každý deň.'
    },
    {
      id: 'brazil', name: 'Brazil Santos', price: 'od 9,90 €', profile: 'Jemná a sladká',
      url: 'https://praziarnicka.sk/produkt/brazil-santos-100percent-arabica', photo: asset('result-filter.webp'),
      prep: ['automatic', 'lever', 'moka', 'filter'], taste: ['chocolate', 'balanced'], drink: ['black', 'both'], caffeine: ['classic'],
      notes: ['kakao', 'sladkosť', 'jemná chuť'], reason: 'Hľadáte pokojnú a sladšiu kávu bez výraznej ovocnosti. Brazil Santos sa ľahko pije každý deň.'
    },
    {
      id: 'puccini', name: 'Puccini blend', price: 'od 11,50 €', profile: 'Silná a výrazná',
      url: 'https://praziarnicka.sk/produkt/puccini-60arabica-40-robusta', photo: asset('result-espresso.webp'),
      prep: ['automatic', 'lever', 'moka'], taste: ['strong', 'balanced', 'chocolate'], drink: ['milk', 'both'], caffeine: ['classic'],
      notes: ['tmavá čokoláda', 'marhuľa', 'hustá pena'], reason: 'Máte radi výraznejšiu kávu alebo ju často pijete s mliekom. Puccini zostane chuťovo plná aj v cappuccine.'
    },
    {
      id: 'cuba', name: 'Cuba Serrano Lavado', price: 'od 12,90 €', profile: 'Sladká a orechová',
      url: 'https://praziarnicka.sk/produkt/cuba-serrano-lavado-100-arabica', photo: asset('result-filter.webp'),
      prep: ['lever', 'moka', 'filter'], taste: ['balanced', 'chocolate'], drink: ['black'], caffeine: ['classic'],
      notes: ['kakao', 'tabak', 'vlašské orechy'], reason: 'Pijete kávu čiernu a chcete plnú, sladkú chuť s orechovou dochuťou.'
    },
    {
      id: 'decaf', name: 'Bezkofeínová káva Brazil', price: 'od 12,90 €', profile: 'Jemná a bez kofeínu',
      url: 'https://praziarnicka.sk/produkt/bezkofeinova-kava-brazilia', photo: asset('result-decaf.webp'),
      prep: ['automatic', 'lever', 'moka', 'filter'], taste: ['chocolate', 'balanced'], drink: ['black', 'milk', 'both'], caffeine: ['decaf'],
      notes: ['sladká', 'jemná', 'dobrá na večer'], reason: 'Chcete dobrú kávu aj večer. Táto Brazília je jemná a sladká, len bez povzbudenia.'
    }
  ];

  const questions = [
    { key: 'prep', label: 'Príprava', title: 'Ako si kávu pripravujete?', help: 'Vyberte spôsob, ktorý používate najčastejšie.', options: [
      ['automatic', 'Automat', 'Káva stlačením tlačidla'],
      ['lever', 'Pákový kávovar', 'Espresso pripravujete ručne'],
      ['moka', 'Moka kanvička', 'Silnejšia káva zo sporáka'],
      ['filter', 'Filter', 'Prekvapkávaná alebo zalievaná káva']
    ] },
    { key: 'taste', label: 'Chuť', title: 'Aká chuť vám je najbližšia?', help: 'Vyberte to, na čo by ste mali práve chuť.', options: [
      ['chocolate', 'Čokoláda a orechy', 'Plná a pokojná chuť'],
      ['balanced', 'Sladká a vyvážená', 'Jemná bez extrémov'],
      ['fruity', 'Ovocná a svieža', 'Ľahšia a voňavá'],
      ['strong', 'Silná a výrazná', 'Intenzívna a dlhšia chuť']
    ] },
    { key: 'drink', label: 'Nápoj', title: 'Ako ju najčastejšie pijete?', help: 'Čiernu, s mliekom alebo podľa nálady.', options: [
      ['black', 'Čiernu', 'Espresso, lungo alebo filter'],
      ['milk', 'S mliekom', 'Cappuccino alebo latte'],
      ['both', 'Striedam oboje', 'Hľadám univerzálnu kávu']
    ] },
    { key: 'caffeine', label: 'Kofeín', title: 'Má vás káva povzbudiť?', help: 'Vyberte klasickú kávu alebo kávu bez kofeínu.', options: [
      ['classic', 'Áno', 'Klasická káva'],
      ['decaf', 'Radšej bez kofeínu', 'Dobrá aj na večer']
    ] }
  ];

  const state = { screen: 'chat', step: 0, answers: {}, result: null, ranked: [], messages: [], transitioning: false, lastFocus: null };
  const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));

  root.innerHTML = `
    <main class="pz-page">
      <header class="pz-page-head">
        <a class="pz-brand" href="https://praziarnicka.sk/" target="_blank" rel="noreferrer">${mark}<span><strong>Pražiarnička</strong><small>Čerstvo pražená káva z Trenčína</small></span></a>
        <nav class="pz-nav" aria-label="Hlavná navigácia"><a href="https://praziarnicka.sk/eshop" target="_blank" rel="noreferrer">Káva</a><button class="pz-open" type="button">Výber podľa vás</button><a href="https://praziarnicka.sk/o-nas" target="_blank" rel="noreferrer">O nás</a><a href="https://praziarnicka.sk/kontakt" target="_blank" rel="noreferrer">Kontakt</a></nav>
        <button class="pz-head-cta pz-open" type="button">Nájsť svoju kávu</button>
      </header>
      <section class="pz-hero" aria-labelledby="pz-title">
        <div class="pz-copy">
          <p class="pz-overline">Čerstvo pražená · poctivo vybraná</p>
          <h1 id="pz-title">Káva, na ktorú sa tešíte.</h1>
          <p class="pz-lead">Pražíme v Trenčíne a pomôžeme vám vybrať kávu podľa toho, ako ju pripravujete a čo vám chutí.</p>
          <div class="pz-benefits" aria-label="Prečo Pražiarnička">
            <article><i>01</i><b>Čerstvo pražená</b><span>V malých dávkach pre plnú chuť.</span></article>
            <article><i>02</i><b>Výber bez hádania</b><span>Štyri odpovede a konkrétny tip.</span></article>
            <article><i>03</i><b>Pomoc kedykoľvek</b><span>Poradíme aj večer alebo cez víkend.</span></article>
          </div>
          <button class="pz-primary pz-open" type="button">Nájsť svoju kávu ${icons.arrow}</button>
        </div>
        <div class="pz-showcase">
          <figure class="pz-photo"><img src="${asset('result-filter.webp')}" alt="Čerstvo pripravená filtrovaná káva"><figcaption><span>Pražená v Trenčíne</span><b>Pre váš spôsob prípravy</b></figcaption></figure>
          <article class="pz-product-peek"><img src="${asset('result-espresso.webp')}" alt="Čerstvé espresso"><div><small>Obľúbená voľba</small><b>Paganini blend</b><span>čokoláda · mandle · orechy</span></div><em>od 11,90 €</em></article>
        </div>
      </section>
      <footer class="pz-page-foot"><span>© Pražiarnička · Trenčín</span><a href="https://praziarnicka.sk/" target="_blank" rel="noreferrer">praziarnicka.sk ↗</a></footer>
    </main>

    <div class="pz-launcher-wrap"><div class="pz-teaser" id="pz-teaser"><button class="pz-teaser-close" type="button" aria-label="Zavrieť pozvánku">×</button><strong>Pomôžeme s výberom?</strong><span>Štyri otázky a konkrétna káva.</span></div><button class="pz-launcher" id="pz-launcher" type="button" aria-label="Otvoriť kávového poradcu" aria-expanded="false">${mark}</button></div>
    <div class="pz-backdrop" id="pz-backdrop" hidden></div>
    <section class="pz-widget" id="pz-widget" role="dialog" aria-modal="true" aria-labelledby="pz-dialog-title" aria-hidden="true" hidden>
      <header class="pz-widget-head">
        <div class="pz-widget-brand">${mark}<span><strong id="pz-dialog-title">Pražiarnička</strong><small><i></i>Online</small></span></div>
        <div class="pz-widget-actions"><button class="pz-icon-btn" id="pz-reset" type="button" aria-label="Začať odznova">${icons.reset}</button><button class="pz-icon-btn" id="pz-close" type="button" aria-label="Zavrieť poradcu">${icons.close}</button></div>
      </header>
      <div class="pz-mode" role="tablist" aria-label="Čo chcete urobiť"><span class="pz-mode-indicator"></span><button class="pz-mode-btn" data-mode="chat" role="tab" type="button">${icons.chat}<b>Chat</b></button><button class="pz-mode-btn" data-mode="advisor" role="tab" type="button">${icons.cup}<b>Výber kávy</b></button></div>
      <div class="pz-view" id="pz-view"></div>
    </section>`;

  const widget = root.querySelector('#pz-widget');
  const backdrop = root.querySelector('#pz-backdrop');
  const view = root.querySelector('#pz-view');
  const mode = root.querySelector('.pz-mode');

  function score(product) {
    const weights = { prep: 9, taste: 10, drink: 7, caffeine: 14 };
    return questions.reduce((total, question) => {
      const answer = state.answers[question.key];
      if (!answer) return total;
      return total + (product[question.key].includes(answer) ? weights[question.key] : question.key === 'caffeine' ? -14 : -2);
    }, 0);
  }

  function rankProducts() {
    const ranked = products.map(product => ({ product, score: score(product) })).sort((a, b) => b.score - a.score);
    if (state.answers.caffeine === 'decaf') ranked.sort((a, b) => Number(b.product.id === 'decaf') - Number(a.product.id === 'decaf'));
    state.ranked = ranked;
    state.result = ranked[0].product;
  }

  const cannedReply = text => {
    const q = text.toLowerCase();
    if (/automat/.test(q)) return 'Do automatu by som začal kávou Paganini alebo Brazil Santos. Obe sú príjemné, plné a dobre sa pripravujú každý deň.';
    if (/čokol|orech|ovoc/.test(q)) return 'Ak chcete čokoládu a orechy, skúste Brazil Santos. Na výraznejšiu, ovocnejšiu chuť je najistejší krátky výber podľa prípravy.';
    if (/mlie|capp|latte/.test(q)) return 'Do cappuccina alebo latte odporúčam Paganini. Má plnú chuť, ktorá sa v mlieku nestratí.';
    if (/bez kofe|večer/.test(q)) return 'Na večer je tu Bezkofeínová káva Brazil. Je jemná a sladká, len bez povzbudenia.';
    return 'Najistejšie vám poradím cez štyri krátke otázky. Potom ukážem konkrétnu kávu z ponuky.';
  };

  function messageMarkup(message) {
    return message.role === 'assistant'
      ? `<div class="pz-message-row"><span class="pz-assistant-avatar">${mark}</span><div class="pz-bubble pz-bubble-assistant">${escapeHtml(message.text)}</div></div>`
      : `<div class="pz-bubble pz-bubble-user">${escapeHtml(message.text)}</div>`;
  }

  async function sendMessage(text, trigger) {
    const clean = text.trim();
    if (!clean) return;
    if (trigger) trigger.disabled = true;
    state.messages.push({ role: 'user', text: clean }, { role: 'assistant', text: cannedReply(clean) });
    renderChat();
    try {
      const response = await fetch('/api/chat', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ demoId: 'praziarnicka', messages: state.messages.slice(-8).map(item => ({ role: item.role, content: item.text })) }) });
      if (!response.ok) return;
      const data = await response.json();
      if (data.reply) { state.messages[state.messages.length - 1].text = data.reply; renderChat(); }
    } catch (_) {
      // The immediate local answer stays visible offline.
    }
  }

  function renderChat() {
    const chips = ['Káva do automatu', 'Skôr čokoládová', 'Káva s mliekom', 'Bez kofeínu'];
    view.innerHTML = `<div class="pz-chat-panel"><div class="pz-chat-scroll" id="pz-chat-scroll"><button class="pz-advisor-cta" id="pz-start-advisor" type="button"><span class="pz-advisor-mark">${mark}</span><span><b>Nájsť svoju kávu</b><small>4 otázky · výsledok do minúty</small></span><i>${icons.arrow}</i></button><div class="pz-message-row"><span class="pz-assistant-avatar">${mark}</span><div class="pz-bubble pz-bubble-assistant">Dobrý deň. Povedzte mi, ako si kávu pripravujete alebo čo vám chutí. Pomôžem vám vybrať.</div></div><figure class="pz-chat-photo"><img src="${asset('result-espresso.webp')}" alt="Čerstvé espresso"><figcaption><small>Pražená v Trenčíne</small><b>Káva podľa vašej chuti.</b></figcaption></figure>${state.messages.map(messageMarkup).join('')}</div><div class="pz-chat-bottom"><div class="pz-chips" aria-label="Rýchle otázky">${chips.map(chip => `<button class="pz-chip" type="button">${chip}</button>`).join('')}</div><form class="pz-composer" id="pz-composer"><input id="pz-input" autocomplete="off" placeholder="Napíšte svoju otázku…" aria-label="Správa"><button class="pz-send" type="submit" aria-label="Odoslať správu">${icons.send}</button></form></div></div>`;
    view.querySelector('#pz-start-advisor').onclick = () => { state.screen = 'advisor'; render(); };
    view.querySelectorAll('.pz-chip').forEach(chip => { chip.onclick = () => sendMessage(chip.textContent, chip); });
    view.querySelector('#pz-composer').onsubmit = event => { event.preventDefault(); const input = view.querySelector('#pz-input'); const text = input.value; input.value = ''; sendMessage(text); };
    if (state.messages.length) view.querySelector('.pz-chat-photo').hidden = true;
    requestAnimationFrame(() => { const scroll = view.querySelector('#pz-chat-scroll'); scroll.scrollTop = scroll.scrollHeight; });
  }

  function spritePosition(index, row) {
    const x = index === 0 ? 0 : index === 1 ? 33.333 : index === 2 ? 66.667 : 100;
    const y = row === 0 ? 0 : row === 1 ? 33.333 : row === 2 ? 66.667 : 100;
    return `--sprite-x:${x}%;--sprite-y:${y}%`;
  }

  function renderAdvisor() {
    const question = questions[state.step];
    const selected = state.answers[question.key];
    view.innerHTML = `<div class="pz-advisor-panel"><div class="pz-advisor-head"><button class="pz-back" id="pz-back" type="button" aria-label="Späť" ${state.step === 0 ? 'disabled' : ''}>${icons.back}</button><div class="pz-progress">${questions.map((_, index) => `<i class="${index < state.step ? 'is-done' : index === state.step ? 'is-active' : ''}"></i>`).join('')}</div><span id="stepLabel">${state.step + 1} z ${questions.length}</span></div><div class="pz-advisor-scroll"><div class="pz-advisor-copy"><small>${question.label}</small><h2>${question.title}</h2></div><div class="pz-options">${question.options.map(([value, title, help], index) => `<button class="pz-option ${selected === value ? 'is-selected' : ''}" data-value="${value}" type="button" aria-pressed="${selected === value}" style="--delay:${index * 45}ms;${spritePosition(index, state.step)}"><span class="pz-option-photo" role="img" aria-label="${escapeHtml(title)}"></span><span class="pz-option-copy"><b>${escapeHtml(title)}</b><small>${escapeHtml(help)}</small></span><i>${selected === value ? icons.check : '+'}</i></button>`).join('')}</div></div></div>`;
    view.querySelectorAll('.pz-option').forEach(option => {
      option.onclick = () => {
        if (state.transitioning) return;
        state.transitioning = true;
        state.answers[question.key] = option.dataset.value;
        view.querySelectorAll('.pz-option').forEach(candidate => {
          const on = candidate === option;
          candidate.classList.toggle('is-selected', on);
          candidate.setAttribute('aria-pressed', String(on));
          candidate.querySelector(':scope > i').innerHTML = on ? icons.check : '+';
          candidate.disabled = true;
        });
        const delay = matchMedia('(prefers-reduced-motion: reduce)').matches ? 10 : 300;
        setTimeout(advanceQuestion, delay);
      };
    });
    function advanceQuestion() {
      if (!state.answers[question.key]) { state.transitioning = false; return; }
      if (state.step < questions.length - 1) { state.step += 1; state.transitioning = false; renderAdvisor(); }
      else { rankProducts(); state.transitioning = false; render(); }
    }
    view.querySelector('#pz-back').onclick = () => { state.transitioning = false; if (state.step > 0) { state.step -= 1; renderAdvisor(); } };
  }

  function prepLabel(value) {
    return ({ automatic: 'automat', lever: 'pákový kávovar', moka: 'moka kanvička', filter: 'filter' })[value] || 'váš kávovar';
  }

  function renderResult() {
    const product = state.result;
    const alternative = (state.ranked.find(item => item.product.id !== product.id) || { product: products[1] }).product;
    view.innerHTML = `<div class="pz-result"><div class="pz-result-head"><button class="pz-back" id="pz-result-back" type="button" aria-label="Späť">${icons.back}</button><div class="pz-progress">${questions.map(() => '<i class="is-done"></i>').join('')}</div><span>Hotovo</span></div><div class="pz-result-scroll"><div class="pz-result-hero"><img src="${product.photo}" alt="${escapeHtml(product.name)}"><div><small>Táto vám môže sadnúť</small><h2>${escapeHtml(product.name)}</h2><b>${escapeHtml(product.price)}</b></div></div><div class="pz-result-facts"><div><small>Hodí sa na</small><b>${prepLabel(state.answers.prep)}</b></div><div><small>Aká je</small><b>${escapeHtml(product.profile)}</b></div></div><div class="pz-tags">${product.notes.map(note => `<span>${escapeHtml(note)}</span>`).join('')}</div><div class="pz-why"><b>Prečo sme ju vybrali</b><p>${escapeHtml(product.reason)}</p></div><a class="pz-product-cta" href="${product.url}" target="_blank" rel="noreferrer">Pozrieť kávu ${icons.arrow}</a><div class="pz-result-tip"><b>Praktický tip</b><span>Ak ju pijete denne, pozrite si aj väčšie balenie.</span></div><article class="pz-alternative"><img src="${alternative.photo}" alt="${escapeHtml(alternative.name)}"><div><small>Ďalšia možnosť</small><b>${escapeHtml(alternative.name)}</b><span>${escapeHtml(alternative.profile)}</span></div><a href="${alternative.url}" target="_blank" rel="noreferrer">Pozrieť ${icons.arrow}</a></article></div></div>`;
    view.querySelector('#pz-result-back').onclick = () => { state.result = null; state.step = questions.length - 1; state.transitioning = false; render(); };
  }

  function render() {
    const selectedMode = state.result ? 'advisor' : state.screen;
    mode.classList.toggle('is-advisor', selectedMode === 'advisor');
    root.querySelectorAll('.pz-mode-btn').forEach(button => { const selected = button.dataset.mode === selectedMode; button.classList.toggle('is-selected', selected); button.setAttribute('aria-selected', String(selected)); });
    if (state.result) renderResult(); else if (state.screen === 'advisor') renderAdvisor(); else renderChat();
  }

  function resetAll() {
    state.screen = 'chat'; state.step = 0; state.answers = {}; state.result = null; state.ranked = []; state.messages = []; state.transitioning = false;
    render();
  }

  function setWidget(open, nextScreen) {
    if (nextScreen) state.screen = nextScreen;
    if (open) {
      state.lastFocus = document.activeElement;
      widget.hidden = false; backdrop.hidden = false; widget.setAttribute('aria-hidden', 'false'); document.body.classList.add('pz-lock');
      render();
      requestAnimationFrame(() => { widget.classList.add('is-open'); backdrop.classList.add('is-visible'); root.querySelector('#pz-close').focus(); });
    } else {
      widget.classList.remove('is-open'); backdrop.classList.remove('is-visible'); widget.setAttribute('aria-hidden', 'true'); document.body.classList.remove('pz-lock');
      setTimeout(() => { widget.hidden = true; backdrop.hidden = true; }, 220);
      state.lastFocus?.focus?.();
    }
    root.querySelector('#pz-launcher').setAttribute('aria-expanded', String(open));
  }

  function focusables() {
    return [...widget.querySelectorAll('button:not([disabled]),a[href],input:not([disabled]),[tabindex]:not([tabindex="-1"])')].filter(node => node.offsetParent !== null);
  }

  root.querySelectorAll('.pz-open').forEach(button => { button.onclick = () => setWidget(true, 'advisor'); });
  root.querySelector('#pz-launcher').onclick = () => setWidget(true, 'chat');
  root.querySelector('#pz-close').onclick = () => setWidget(false);
  root.querySelector('#pz-reset').onclick = resetAll;
  root.querySelector('#pz-backdrop').onclick = () => setWidget(false);
  root.querySelector('.pz-teaser-close').onclick = () => root.querySelector('#pz-teaser').remove();
  root.querySelectorAll('.pz-mode-btn').forEach(button => { button.onclick = () => { state.result = null; state.screen = button.dataset.mode; render(); }; });

  document.addEventListener('keydown', event => {
    if (!widget.classList.contains('is-open')) return;
    if (event.key === 'Escape') { setWidget(false); return; }
    if (event.key !== 'Tab') return;
    const nodes = focusables();
    if (!nodes.length) return;
    const first = nodes[0], last = nodes[nodes.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });

  document.title = 'Pražiarnička – nájdite svoju kávu';
  render();
})();
