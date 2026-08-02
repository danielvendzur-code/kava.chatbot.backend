(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const icons = window.BEANO_ICONS;
  const products = window.BEANO_PRODUCTS;
  const questions = window.BEANO_QUESTIONS;
  const mascot = window.BEANO_MASCOT;

  $$('[data-brand]').forEach((el) => { el.innerHTML = icons.brand; });
  $$('[data-icon]').forEach((el) => { el.innerHTML = icons[el.dataset.icon] || ''; });
  $$('[data-mascot]').forEach((el) => { el.innerHTML = mascot(el.dataset.mascot || 'idle'); });

  const state = {
    step: 0,
    answers: {},
    selectedProduct: null,
    weight: null,
    review: false,
    completed: false,
  };

  const widget = $('#widget');
  const launcher = $('#launcher');
  const chatScreen = $('#chatScreen');
  const advisorScreen = $('#advisorScreen');
  const advisorBody = $('#advisorBody');
  const nextBtn = $('#nextBtn');
  const prevBtn = $('#prevBtn');
  const navStatus = $('#navStatus');
  const chatMessages = $('#chatMessages');
  const quickChips = $('#quickChips');

  const money = (value) => `${value.toFixed(2).replace('.', ',')} €`;
  const timeNow = () => new Date().toLocaleTimeString('sk-SK', {hour: '2-digit', minute: '2-digit'});
  const scrollBottom = (element) => requestAnimationFrame(() => { element.scrollTop = element.scrollHeight; });

  function openWidget() {
    widget.classList.add('open');
    widget.setAttribute('aria-hidden', 'false');
    launcher.style.display = 'none';
    document.documentElement.classList.add('widget-open');
    document.body.classList.add('widget-open');
  }

  function closeWidget() {
    widget.classList.remove('open');
    widget.setAttribute('aria-hidden', 'true');
    launcher.style.display = 'flex';
    document.documentElement.classList.remove('widget-open');
    document.body.classList.remove('widget-open');
  }

  $('#openWidget').addEventListener('click', openWidget);
  $('#launcherLabel').addEventListener('click', openWidget);
  $('#heroOpen').addEventListener('click', openWidget);
  $('#closeWidget').addEventListener('click', closeWidget);

  function showScreen(name) {
    const advisor = name === 'advisor';
    chatScreen.classList.toggle('active', !advisor);
    advisorScreen.classList.toggle('active', advisor);
    if (advisor) {
      renderAdvisor();
      advisorBody.scrollTop = 0;
    }
  }

  $('#openAdvisor').addEventListener('click', () => showScreen('advisor'));
  $('#quickAdvisor').addEventListener('click', () => showScreen('advisor'));
  $('#backToChat').addEventListener('click', () => showScreen('chat'));

  const avatar = () => `<span class="msg-avatar">${icons.brand}</span>`;
  const messageHtml = (text, mine = false) => `<div class="msg${mine ? ' me' : ''}">${mine ? '' : avatar()}<div class="msg-stack"><div class="bubble">${text}</div><span class="time">${timeNow()}</span></div></div>`;
  const typingHtml = () => `<div class="msg" id="typing">${avatar()}<div class="msg-stack"><div class="bubble typing"><i></i><i></i><i></i></div></div></div>`;

  function addMessage(text, mine = false) {
    chatMessages.insertAdjacentHTML('beforeend', messageHtml(text, mine));
    scrollBottom(chatMessages);
  }

  function renderQuickChips() {
    const chips = ['Káva bez kyslosti', 'Do automatu', 'Na cappuccino', 'Bezkofeínová'];
    quickChips.innerHTML = chips.map((text, index) => `<button type="button" style="transition-delay:${index * 60}ms">${text}</button>`).join('');
    $$('button', quickChips).forEach((button) => button.addEventListener('click', () => answerChat(button.textContent)));
  }

  function initChat() {
    chatMessages.innerHTML = '';
    addMessage('<b>Dobrý deň, som Beano.</b> Môžete sa ma opýtať na chuť, prípravu alebo mletie. Keď chcete konkrétnu kávu, spustite zelený výber hore.');
    renderQuickChips();
  }

  function chatReply(question) {
    const lower = question.toLowerCase();
    if (lower.includes('kys')) return '<b>Najjemnejšia voľba:</b> Brazil Santos. Má čokoládový profil a veľmi nízku aciditu. Cuba Serrano je plnšia alternatíva bez ovocnej kyslosti.';
    if (lower.includes('automat')) return '<b>Do automatu:</b> Paganini blend je najbezpečnejšia voľba. Je vyvážený, krémový a funguje čierny aj s mliekom.';
    if (lower.includes('capp') || lower.includes('mliek')) return '<b>Na cappuccino:</b> Puccini má viac tela a hustejšiu krému, takže ho mlieko neprekryje. Jemnejšia alternatíva je Paganini.';
    if (lower.includes('bez') || lower.includes('kofe')) return '<b>Bez kofeínu:</b> Bezkofeínová Brazil je jemná a čokoládová. Hodí sa na večer aj do mliečnych nápojov.';
    if (lower.includes('mlet')) return 'Najlepšia chuť je zo zrnka pomletého tesne pred prípravou. Pri objednávke však môže e-shop ponúknuť mletie pre automat, páku, moka kanvičku alebo filter.';
    return 'Podľa jednej vety by som iba tipoval. Krátky výber zohľadní prípravu, chuť, mlieko aj kofeín a potom ukáže konkrétne produkty.';
  }

  function insertAdvisorMessageCta() {
    const id = `chatAdvisor-${Date.now()}`;
    chatMessages.insertAdjacentHTML('beforeend', `<div class="msg">${avatar()}<div class="msg-stack"><button class="advisor-cta" id="${id}" type="button"><span class="cta-illustration">${icons.spark}<i></i></span><span class="cta-copy"><b>Spustiť presný výber</b><span>4 otázky · bez registrácie</span></span><span class="cta-arrow">${icons.next}</span></button></div></div>`);
    $(`#${id}`).addEventListener('click', () => showScreen('advisor'));
  }

  function answerChat(question) {
    addMessage(question, true);
    quickChips.innerHTML = '';
    chatMessages.insertAdjacentHTML('beforeend', typingHtml());
    scrollBottom(chatMessages);
    window.setTimeout(() => {
      $('#typing')?.remove();
      addMessage(chatReply(question));
      insertAdvisorMessageCta();
      scrollBottom(chatMessages);
    }, 650);
  }

  $('#chatForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const input = $('#chatInput');
    const value = input.value.trim();
    if (!value) return;
    input.value = '';
    answerChat(value);
  });

  $('#resetChat').addEventListener('click', initChat);

  function setNav({back = true, next = true, disabled = false, status = '', label = 'Pokračovať'}) {
    prevBtn.style.visibility = back ? 'visible' : 'hidden';
    nextBtn.style.display = next ? 'inline-flex' : 'none';
    nextBtn.disabled = disabled;
    nextBtn.innerHTML = `${label} ${icons.next}`;
    navStatus.textContent = status;
  }

  function updateProgress() {
    const current = Math.min(state.step, 3);
    let label;
    let name;
    if (state.completed) {
      label = 'Hotovo';
      name = 'Košík';
    } else if (state.step < 4) {
      label = `Krok ${state.step + 1} zo 4`;
      name = questions[state.step].name;
    } else if (!state.selectedProduct) {
      label = 'Odporúčanie';
      name = 'Vyberte kávu';
    } else if (!state.review) {
      label = 'Balenie';
      name = state.selectedProduct.name;
    } else {
      label = 'Kontrola';
      name = 'Váš výber';
    }
    $('#stepLabel').textContent = label;
    $('#stepName').textContent = name;
    $('#progress').innerHTML = Array.from({length: 4}, (_, index) => {
      const done = state.step >= 4 || index < current;
      const active = state.step >= 4 || index === current;
      return `<i class="${done ? 'done ' : ''}${active ? 'on' : ''}"></i>`;
    }).join('');
  }

  function renderAdvisor() {
    updateProgress();
    if (state.completed) renderSuccess();
    else if (state.step < 4) renderQuestion();
    else if (!state.selectedProduct) renderResults();
    else if (!state.review) renderWeights();
    else renderReview();
  }

  function renderGuide(text, pose = 'idle') {
    return `<div class="guide-row">${mascot(pose)}<div class="guide-bubble"><b>Beano:</b> ${text}</div></div>`;
  }

  function renderQuestion() {
    const question = questions[state.step];
    const chosen = state.answers[question.key];
    advisorBody.innerHTML = `${renderGuide(question.guide, state.step === 3 ? 'thinking' : 'idle')}
      <div class="question-head">
        <span class="question-kicker"><i></i>${question.kicker}</span>
        <h2>${question.title}</h2>
        <p>${question.help}</p>
      </div>
      <div class="options">
        ${question.options.map((option, index) => {
          const selected = chosen === option[0];
          const dimmed = chosen && !selected;
          return `<button class="option${selected ? ' selected' : ''}${dimmed ? ' dimmed' : ''}" data-value="${option[0]}" style="animation-delay:${index * 55}ms">
            <span class="option-icon">${icons[option[1]]}</span>
            <span class="option-copy"><b>${option[2]}</b><small>${option[3]}</small></span>
            <span class="option-state">${selected ? icons.check : icons.next}</span>
          </button>`;
        }).join('')}
      </div>
      ${chosen ? `<div class="selection-note"><i>${icons.check}</i> Vybrané. Pokračujte tlačidlom dole.</div>` : ''}`;

    setNav({
      back: state.step > 0,
      next: true,
      disabled: !chosen,
      status: chosen ? 'Odpoveď je uložená' : 'Vyberte jednu možnosť',
      label: state.step === 3 ? 'Zobraziť výsledok' : 'Pokračovať',
    });

    $$('.option', advisorBody).forEach((button) => button.addEventListener('click', () => selectOption(button, question.key)));
  }

  function selectOption(button, key) {
    state.answers[key] = button.dataset.value;
    $$('.option', advisorBody).forEach((option) => {
      const selected = option === button;
      option.classList.toggle('selected', selected);
      option.classList.toggle('dimmed', !selected);
      $('.option-state', option).innerHTML = selected ? icons.check : icons.next;
    });
    $('.selection-note', advisorBody)?.remove();
    advisorBody.insertAdjacentHTML('beforeend', `<div class="selection-note"><i>${icons.check}</i> Vybrané. Pokračujte tlačidlom dole.</div>`);
    nextBtn.disabled = false;
    navStatus.textContent = 'Odpoveď je uložená';
  }

  function rankProducts() {
    return products.map((product) => {
      let score = 56;
      ['prep', 'taste', 'drink', 'caffeine'].forEach((key) => {
        if ((product[key] || []).includes(state.answers[key])) score += 10;
      });
      return {...product, score: Math.min(score, 96)};
    }).sort((a, b) => b.score - a.score).slice(0, 3);
  }

  function renderResults() {
    const ranked = rankProducts();
    advisorBody.innerHTML = `${renderGuide('Hotovo. Porovnal som prípravu, chuť aj spôsob pitia. Toto sú tri najlepšie zhody.', 'happy')}
      <div class="result-intro"><b>Odporúčanie podľa vašich odpovedí</b><span>Prvá káva je najpresnejšia zhoda. Každú voľbu môžete ešte porovnať.</span></div>
      ${ranked.map((product, index) => `<article class="product-card${index === 0 ? ' top' : ''}" style="animation-delay:${index * 70}ms">
        ${index === 0 ? '<span class="best-ribbon">Najlepšia zhoda</span>' : ''}
        <div class="product-top">
          <div class="coffee-pack"><div><b>${product.short}</b><span>ROASTED COFFEE</span></div></div>
          <div><h3>${product.name}</h3><p>${product.origin}<br>${product.reason}</p></div>
          <div class="match-ring" style="--score:${product.score}"><b>${product.score}%<small>zhoda</small></b></div>
        </div>
        <div class="tags">${product.tags.map((tag) => `<span class="tag">${tag}</span>`).join('')}</div>
        <div class="why-box"><b>Prečo sedí:</b> ${product.why}</div>
        <button class="pick-product" data-id="${product.id}" type="button">${index === 0 ? 'Vybrať najlepšiu zhodu' : 'Vybrať túto kávu'}</button>
      </article>`).join('')}`;

    setNav({back: true, next: false, status: 'Vyberte jednu z odporúčaných káv'});
    $$('.pick-product', advisorBody).forEach((button) => button.addEventListener('click', () => {
      state.selectedProduct = products.find((product) => product.id === button.dataset.id);
      state.weight = null;
      state.review = false;
      renderAdvisor();
      advisorBody.scrollTop = 0;
    }));
  }

  function usageFor(weight) {
    if (weight === 250) return 'na ochutnanie';
    if (weight === 500) return 'približne na mesiac';
    return 'pre väčšiu spotrebu';
  }

  function renderWeights() {
    const product = state.selectedProduct;
    advisorBody.innerHTML = `${renderGuide('Dobrá voľba. Zostáva už iba veľkosť balenia podľa vašej spotreby.', 'idle')}
      <div class="selected-product-mini">
        <span class="mini-pack">${product.short}</span>
        <div><b>${product.name}</b><span>${product.origin}</span></div>
        <button type="button" id="changeProduct">Zmeniť</button>
      </div>
      <div class="weight-title"><h2>Aké balenie vám vyhovuje?</h2><p>Cena sa prepočíta okamžite po výbere.</p></div>
      <div class="weights">
        ${[250, 500, 1000].map((weight) => `<button class="weight${state.weight === weight ? ' selected' : ''}" data-weight="${weight}" type="button">
          ${weight === 500 ? '<span class="popular">Najčastejšia voľba</span>' : ''}
          <span class="weight-bag"></span>
          <b>${weight === 1000 ? '1 kg' : `${weight} g`}</b>
          <small>${money(product.price[weight])}</small>
          <span class="usage">${usageFor(weight)}</span>
        </button>`).join('')}
      </div>
      <div class="order-summary">
        <div class="sum-row"><span>Káva</span><b>${product.name}</b></div>
        <div class="sum-row"><span>Balenie</span><b id="sumWeight">${state.weight ? (state.weight === 1000 ? '1 kg' : `${state.weight} g`) : '—'}</b></div>
        <div class="sum-row total"><span>Spolu</span><b id="sumPrice">${state.weight ? money(product.price[state.weight]) : '—'}</b></div>
      </div>`;

    setNav({back: true, next: true, disabled: !state.weight, status: state.weight ? 'Balenie je vybrané' : 'Vyberte veľkosť balenia', label: 'Skontrolovať výber'});
    $('#changeProduct').addEventListener('click', () => {
      state.selectedProduct = null;
      state.weight = null;
      renderAdvisor();
    });
    $$('.weight', advisorBody).forEach((button) => button.addEventListener('click', () => {
      state.weight = Number(button.dataset.weight);
      $$('.weight', advisorBody).forEach((item) => item.classList.toggle('selected', item === button));
      $('#sumWeight').textContent = state.weight === 1000 ? '1 kg' : `${state.weight} g`;
      $('#sumPrice').textContent = money(product.price[state.weight]);
      nextBtn.disabled = false;
      navStatus.textContent = 'Balenie je vybrané';
    }));
  }

  function renderReview() {
    const product = state.selectedProduct;
    const weight = state.weight;
    advisorBody.innerHTML = `${renderGuide('Všetko sedí. Ešte posledná kontrola pred vložením do košíka.', 'happy')}
      <div class="weight-title"><h2>Váš výber je pripravený</h2><p>Odporúčanie podľa vašich odpovedí.</p></div>
      <div class="review-card">
        <div class="review-product">
          <div class="coffee-pack"><div><b>${product.short}</b><span>ROASTED COFFEE</span></div></div>
          <div><h3>${product.name}</h3><p>${product.origin}<br>${product.tags.join(' · ')}</p></div>
        </div>
        <div class="sum-row"><span>Balenie</span><b>${weight === 1000 ? '1 kg' : `${weight} g`}</b></div>
        <div class="sum-row"><span>Odporúčanie</span><b>${product.reason}</b></div>
        <div class="sum-row total"><span>Spolu</span><b>${money(product.price[weight])}</b></div>
        <button class="order-btn" id="orderBtn" type="button">Pridať do košíka</button>
      </div>`;

    setNav({back: true, next: false, status: 'Skontrolujte produkt a cenu'});
    $('#orderBtn').addEventListener('click', completeOrder);
  }

  function renderSuccess() {
    const product = state.selectedProduct;
    const weight = state.weight;
    advisorBody.innerHTML = `<div class="success-card">
      <div class="success-icon">✓</div>
      <h2>Pridané do košíka</h2>
      <p>${product.name}, ${weight === 1000 ? '1 kg' : `${weight} g`} za ${money(product.price[weight])}. V reálnom e-shope by sa teraz otvoril košík.</p>
      <button class="order-btn" id="backChatSuccess" type="button">Späť do chatu</button>
    </div>`;
    setNav({back: false, next: false, status: 'Výber je dokončený'});
    $('#backChatSuccess').addEventListener('click', () => {
      showScreen('chat');
      addMessage(`Vybral som pre vás <b>${product.name}</b>, balenie ${weight === 1000 ? '1 kg' : `${weight} g`}. Výber zostáva uložený.`);
    });
  }

  function completeOrder() {
    state.completed = true;
    renderAdvisor();
    advisorBody.scrollTop = 0;
  }

  nextBtn.addEventListener('click', () => {
    if (state.step < 4) {
      const key = questions[state.step].key;
      if (!state.answers[key]) return;
      state.step += 1;
      state.selectedProduct = null;
      state.weight = null;
      state.review = false;
      state.completed = false;
      renderAdvisor();
      advisorBody.scrollTop = 0;
      return;
    }
    if (state.selectedProduct && state.weight && !state.review) {
      state.review = true;
      renderAdvisor();
      advisorBody.scrollTop = 0;
    }
  });

  prevBtn.addEventListener('click', () => {
    if (state.completed) return;
    if (state.step === 4) {
      if (state.review) {
        state.review = false;
      } else if (state.selectedProduct) {
        state.selectedProduct = null;
        state.weight = null;
      } else {
        state.step = 3;
      }
    } else if (state.step > 0) {
      state.step -= 1;
    }
    renderAdvisor();
    advisorBody.scrollTop = 0;
  });

  $('#resetAdvisor').addEventListener('click', () => {
    state.step = 0;
    state.answers = {};
    state.selectedProduct = null;
    state.weight = null;
    state.review = false;
    state.completed = false;
    renderAdvisor();
  });

  initChat();
  renderAdvisor();

  const demoState = new URLSearchParams(window.location.search).get('demo');
  if (demoState) {
    openWidget();
    if (demoState === 'chat') showScreen('chat');
    if (demoState.startsWith('advisor')) {
      showScreen('advisor');
      if (demoState === 'advisor-selected') {
        state.answers.prep = 'automatic';
        renderAdvisor();
      }
      if (demoState === 'results') {
        state.answers = {prep:'automatic',taste:'balanced',drink:'milk',caffeine:'classic'};
        state.step = 4;
        renderAdvisor();
      }
      if (demoState === 'weight') {
        state.answers = {prep:'automatic',taste:'balanced',drink:'milk',caffeine:'classic'};
        state.step = 4;
        state.selectedProduct = products[0];
        state.weight = 500;
        renderAdvisor();
      }
    }
  }
})();
