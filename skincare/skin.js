export function mountAdvisor(brand, products) {
  const app = document.querySelector('#app');
  const state = { tab: 'advisor', started: false, step: null, choice: null, limit: null, unscented: false, messages: [] };
  const escape = value => String(value ?? '').replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
  const copy = message => brand.copy?.[message] ?? message;
  const ui = message => escape(copy(message));
  const decimal = brand.currency === 'EUR';
  const norm = value => value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const price = amount => new Intl.NumberFormat(brand.language, { style: 'currency', currency: brand.currency, minimumFractionDigits: decimal ? 2 : 0, maximumFractionDigits: decimal ? 2 : 0 }).format(amount);
  const photo = (product, className = '') => `<img class="${className}" src="${escape(product.photo)}" alt="${escape(product.title)}">`;
  const productLink = product => `<a href="${escape(product.url)}" target="_blank" rel="noopener">${ui('Detail v e-shopu')}</a>`;

  function eligible(product) {
    return product.stock === (brand.availableLabel ?? 'Skladem') && (state.limit === null || product.price <= state.limit)
      && (!state.unscented || product.fragranceFree);
  }

  function recommendations() {
    return state.choice?.ids.map(id => products[id]).filter(eligible) ?? [];
  }

  function comparison(first, second) {
    const rows = [
      [ui('Účel'), 'purpose'], [ui('Textura'), 'texture'], [ui('Použití'), 'use'], [ui('Balení'), 'pack'], ['Cena', 'price'],
    ];
    return `<table class="comparison">
      <caption>${ui('Porovnání výrobků')}</caption>
      <thead><tr><th scope="col"><span class="sr-only">${ui('Vlastnost')}</span></th>${[first, second].map(product => `<th scope="col">${photo(product)}${escape(product.title)}</th>`).join('')}</tr></thead>
      <tbody>${rows.map(([label, key]) => `<tr><th scope="row">${label}</th>${[first, second].map(product => `<td>${escape(key === 'price' ? price(product.price) : product[key])}</td>`).join('')}</tr>`).join('')}
      <tr><th scope="row">E-shop</th><td>${productLink(first)}</td><td>${productLink(second)}</td></tr></tbody>
    </table>`;
  }

  function routine(product) {
    const id = Object.keys(products).find(key => products[key] === product);
    const sequence = (brand.routine[id] ?? []).map(key => products[key]);
    const total = sequence.reduce((sum, item) => sum + Math.round(item.price * 100), 0) / 100;
    if (sequence.length < 2 || !sequence.every(eligible) || (state.limit !== null && total > state.limit)) return '';
    return `<details><summary>${ui('Sestavit jednoduchou rutinu')} <span>${price(total)}</span></summary>
      ${brand.routineNote ? `<p>${escape(brand.routineNote)}</p>` : ''}<ol class="routine">${sequence.map(item => `<li><div><strong>${escape(item.role)} · ${escape(item.title)}</strong><p>${escape(item.use)}</p>${productLink(item)}</div><b>${price(item.price)}</b></li>`).join('')}</ol>
      <div class="total">${ui('Celkem')} <strong>${price(total)}</strong></div></details>`;
  }

  function preferences() {
    return `<details class="preferences"${state.limit !== null || state.unscented ? ' open' : ''}>
      <summary>${ui('Rozpočet a složení')}</summary>
      <form id="preferences">
        <label for="limit">${ui('Nejvyšší celková cena v Kč')}</label>
        <div class="price-input"><input id="limit" name="limit" type="number" min="0" max="999999" step="${decimal ? '0.01' : '1'}" inputmode="${decimal ? 'decimal' : 'numeric'}" placeholder="${ui('Bez limitu')}" value="${state.limit ?? ''}"><span>${ui('Kč')}</span></div>
        <div class="budget-buttons">${brand.budgets.map(budget => `<button class="chip" type="button" data-budget="${budget}">${price(budget)}</button>`).join('')}</div>
        <label class="check"><input id="unscented" name="unscented" type="checkbox" ${state.unscented ? 'checked' : ''}> ${ui('Bez přidané parfemace a vonných silic podle uvedeného složení')}</label>
        <button class="text-button" type="submit">${ui('Použít podmínky')}</button>
      </form></details>`;
  }

  function advisor() {
    if (!state.choice) {
      const step = state.step;
      const choices = step?.choices ?? brand.steps;
      return `<div class="panel-head"><p class="eyebrow">${step ? escape(step.name) : ui('Výběr péče')}</p><h2 id="panel-title" tabindex="-1">${step ? escape(step.title) : ui('Který krok péče hledáte?')}</h2></div>
        <div class="choice-grid ${step ? 'specific' : ''}">${choices.map((choice, index) => `<button type="button" class="choice" data-action="choose" data-index="${index}">
          ${photo(products[choice.photo ?? choice.ids[0]])}<span><strong>${escape(step ? choice.title : choice.name)}</strong><small>${escape(choice.hint ?? choice.description)}</small></span><span aria-hidden="true">→</span>
          </button>`).join('')}</div>${preferences()}
        ${step ? `<button type="button" class="text-button" data-action="back">${ui('← Zpět')}</button>` : ''}`;
    }

    const [main, alt] = recommendations();
    if (!main) {
      return `<div class="panel-head"><p class="eyebrow">${escape(state.step.name)}</p><h2 id="panel-title" tabindex="-1">${ui('Žádný produkt nesplňuje vaše podmínky')}</h2><p>${ui('Změňte rozpočet, požadavek na složení nebo se vraťte k výběru.')}</p></div>${preferences()}${resultActions()}`;
    }

    const altId = Object.keys(products).find(key => products[key] === alt);
    const reason = main === products[state.choice.ids[0]] ? state.choice.why : `${main.difference} ${copy('Odpovídá vašim nastaveným podmínkám.')}`;
    return `<div class="panel-head"><p class="eyebrow">${ui('Váš výběr')} · ${escape(state.step.name)}</p><h2 id="panel-title" tabindex="-1">${ui('Doporučení pro vás')}</h2></div>
      <article class="result-card">
        <div class="product-visual">${photo(main)}</div>
        <div class="product-info"><p class="eyebrow">${escape(main.role)}</p><h3>${escape(main.title)}</h3><p>${escape(reason)}</p>
          <div class="product-meta"><strong>${price(main.price)}</strong><span>${escape(main.pack)}</span></div>
          <a class="button primary" href="${escape(main.url)}" target="_blank" rel="noopener">${ui('Zobrazit v e-shopu')}</a>
        </div>
      </article>
      ${alt ? `<article class="alternative">${photo(alt)}<div><p class="eyebrow">${ui('Alternativa')}</p><h3>${escape(alt.title)}</h3><p>${escape(state.choice.differences?.[altId] ?? alt.difference)}</p><p><strong>${price(alt.price)}</strong> · ${escape(alt.pack)} · ${productLink(alt)}</p></div></article>
        <details class="compare"><summary>${ui('Porovnat oba produkty')}</summary>${comparison(main, alt)}</details>` : ''}
      ${routine(main)}
      ${preferences()}
      <p class="checked">${ui('Ceny a dostupnost ověřeny')} ${brand.checkedAt}. ${ui('Aktuální stav najdete v e-shopu.')}</p>
      ${resultActions()}`;
  }

  function resultActions() {
    return `<div class="result-actions"><button type="button" class="text-button" data-action="back">${ui('← Zpět')}</button>
      <button type="button" class="text-button" data-action="restart">${ui('Začít znovu')}</button>
      <button type="button" class="button secondary" data-action="chat">${ui('Zeptat se v chatu')}</button></div>`;
  }

  function catalogChat() {
    const [main, alt] = recommendations();
    const suggestions = main
      ? [`${copy('Jak použít')} ${main.title}?`, alt ? copy('Porovnej doporučené produkty') : copy('Jaké je pořadí rutiny?')]
      : brand.chatSuggestions;
    return `<div class="panel-head"><p class="eyebrow">${ui('Poradna')} ${escape(brand.name)}</p><h2 id="panel-title" tabindex="-1">${ui('Na co se chcete zeptat?')}</h2>
      <p>${main ? `${ui('Navazujeme na váš výběr')} · ${escape(main.title)}.` : ui('Zeptejte se na použití, cenu, složení nebo rozdíl mezi dvěma produkty.')}</p></div>
      <div class="suggestions">${suggestions.map(text => `<button type="button" class="chip" data-suggest="${escape(text)}">${escape(text)}</button>`).join('')}</div>
      <div id="chat-log" class="chat-log" role="log" aria-label="${ui('Konverzace')}">${state.messages.map(entry => `<div class="message ${entry.kind}">${entry.html}</div>`).join('')}</div>
      <form id="chat-form" class="chat-form"><label class="sr-only" for="chat-input">${ui('Vaše otázka')}</label>
        <input id="chat-input" name="question" autocomplete="off" maxlength="450" required placeholder="${ui('Napište otázku…')}">
        <button class="button primary" type="submit" aria-label="${ui('Odeslat otázku')}">${ui('Odeslat')} <span aria-hidden="true">↑</span></button>
      </form>`;
  }

  function answer(question) {
    const text = norm(question);
    const all = Object.values(products);
    const match = all.filter(product => [product.title, ...product.aliases].some(alias =>
      new RegExp(`(?:^|[^a-z0-9])${norm(alias).replace(/[.*+?^$${}()|[\]\\]/g, '\\$&')}(?:$|[^a-z0-9])`).test(text),
    ));
    const current = recommendations();
    const item = match[0] ?? current[0];
    const link = item ? productLink(item) : `<a href="${brand.category}" target="_blank" rel="noopener">${ui('Oficiální nabídka péče o pleť')}</a>`;
    if (/alerg|ekzem|rosace|dermatit|tehot|kojen|dojcen|akne|snas|znas|reakc/.test(text)) {
      return `<p>${ui('Snášenlivost ani vhodnost při zdravotních potížích nemohu potvrdit.')} ${item ? escape(item.suitability ?? '') : ui('Upřesněte název produktu a mohu dohledat uvedené složení.')}</p>
        ${item?.inci ? `<p>${ui('Výrobce u tohoto produktu uvádí následující složení.')}</p><p class="ingredients">${escape(item.inci)}</p>` : ''}<p>${link} · <a href="${brand.contact}" target="_blank" rel="noopener">Kontakt ${escape(brand.name)}</a></p>`;
    }
    if (/porovn|rozdil|rozdiel|versus|\bvs\b/.test(text)) {
      const pair = match.length === 2 ? match : match.length === 0 ? current.slice(0, 2) : [];
      return pair.length === 2 ? comparison(...pair) : `<p>${ui('Napište názvy dvou produktů, které chcete porovnat.')}</p>`;
    }
    if (/rutin|poradi|poradie|vrstv/.test(text)) {
      const option = item && routine(item);
      return `<p>${escape(brand.routineOrder)}</p>${option || ''}`;
    }
    if (item) {
      if (/cen[auy]|kolik stoji|kolko stoji|objem|baleni|balenie|skladem|skladom|dostupnost/.test(text)) return `<p><strong>${escape(item.title)}</strong> · ${escape(item.pack)} · ${price(item.price)}. ${ui('Stav při kontrole')} (${brand.checkedAt}) ${ui('byl skladem.')}</p><p>${link}</p>`;
      if (/[sz]lozen|inci|obsahuje|z ceho|ingredien|parfem|vune|vona|vonu/.test(text)) return `<p><strong>${escape(item.title)}</strong></p><p>${escape(item.ingredients)}.</p>${item.inci ? `<details><summary>${ui('Úplné uvedené složení')}</summary><p class="ingredients">${escape(item.inci)}</p></details>` : ''}<p>${link}</p>`;
      if (/pouzi|nan[aá]s|(?:(?:jak|ako) .*aplik|aplikovat|aplikujte|aplikuje)|[ov]plach|textur|k cemu|na co|kazdy den/.test(text)) return `<p><strong>${escape(item.title)}</strong> · ${escape(item.texture)}.</p><p>${escape(item.use)}</p><p>${link}</p>`;
      if (match.length === 1 && (norm(item.title) === text.trim() || /^(co je|rekni mi o|povedz mi o|ukaz)/.test(text))) return `<p><strong>${escape(item.title)}</strong> · ${escape(item.pack)} · ${price(item.price)}.</p><p>${escape(item.purpose)}. ${escape(item.use)}</p><p>${link}</p>`;
    }
    return `<p>${ui('Tento údaj v ověřených podkladech nemám. Mohu ověřit cenu a balení, uvedené složení nebo použití produktů v průvodci.')}</p><p>${link} · <a href="${brand.contact}" target="_blank" rel="noopener">Kontakt ${escape(brand.name)}</a></p>`;
  }

  function render({ focus = false } = {}) {
    app.innerHTML = `<header class="top"><div class="top-inner"><a href="${brand.shop}" aria-label="${escape(brand.name)} – e-shop"><img src="${brand.logo}" alt="${escape(brand.name)}"></a><a class="shop-link" href="${brand.category}" target="_blank" rel="noopener">${escape(brand.shopLabel)}</a></div></header>
      <main>
        <section class="hero${state.started ? ' compact' : ''}" aria-labelledby="hero-title">
          <div class="hero-text"><p class="eyebrow">${escape(brand.name)} · ${ui('Pleťová péče')}</p><h1 id="hero-title">${escape(brand.title)}</h1><p>${escape(brand.intro)}</p>
            ${state.started ? '' : `<div class="hero-actions"><button type="button" class="button primary" data-action="start">${ui('Najít péči')} <span aria-hidden="true">→</span></button><button type="button" class="button secondary" data-action="chat">${ui('Napsat do chatu')}</button></div>`}
          </div><div class="hero-photo${brand.heroSecondary ? ' product-pair' : ''}"><img src="${escape(brand.hero)}" alt="${escape(brand.heroAlt)}">${brand.heroSecondary && !state.started ? `<img src="${escape(brand.heroSecondary)}" alt="">` : ''}</div>
        </section>
        <section class="workspace" aria-labelledby="panel-title" ${state.started ? '' : 'hidden'}>
          <nav class="switcher" aria-label="${ui('Režim poradny')}"><button type="button" data-action="advisor" aria-pressed="${state.tab === 'advisor'}">${ui('Průvodce výběrem')}</button><button type="button" data-action="chat" aria-pressed="${state.tab === 'chat'}">Chat</button></nav>
          <div class="panel">${state.tab === 'advisor' ? advisor() : catalogChat()}</div>
        </section>
      </main>
      <footer><a href="${brand.shop}">${escape(brand.legalName)}</a><span>${ui('Ukázka průvodce výběrem')}</span></footer>`;
    if (focus) {
      document.querySelector('#panel-title')?.focus({ preventScroll: true });
      document.querySelector('.workspace')?.scrollIntoView({ block: 'start' });
    }
  }

  function send(question) {
    const value = question.trim();
    if (!value) return;
    const reply = answer(value);
    const log = document.querySelector('#chat-log');
    const entries = [{ kind: 'user', html: `<p>${escape(value)}</p>` }, { kind: 'bot', html: reply }];
    for (const entry of entries) {
      state.messages.push(entry);
      log.insertAdjacentHTML('beforeend', `<div class="message ${entry.kind}">${entry.html}</div>`);
    }
    log.scrollTop = log.scrollHeight;
    const input = document.querySelector('#chat-input');
    input.value = '';
    input.focus();
  }

  app.addEventListener('click', event => {
    const button = event.target.closest('button');
    if (!button) return;
    if (button.dataset.suggest) return send(button.dataset.suggest);
    if (button.dataset.budget) {
      document.querySelector('#limit').value = button.dataset.budget;
      return button.form.requestSubmit();
    }
    const { action, index } = button.dataset;
    if (!action) return;
    state.started = true;
    switch (action) {
      case 'chat':
        state.tab = 'chat';
        break;
      case 'start':
      case 'advisor':
        state.tab = 'advisor';
        break;
      case 'choose':
        if (state.step) state.choice = state.step.choices[Number(index)];
        else state.step = brand.steps[Number(index)];
        break;
      case 'back':
        if (state.choice) state.choice = null;
        else state.step = null;
        break;
      case 'restart':
        Object.assign(state, { step: null, choice: null, limit: null, unscented: false, messages: [] });
        break;
    }
    render({ focus: true });
  });

  app.addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(event.target);
    if (event.target.id === 'chat-form') return send(String(data.get('question')));
    const rawLimit = data.get('limit');
    state.limit = rawLimit === '' ? null : Number(rawLimit);
    state.unscented = data.has('unscented');
    render({ focus: true });
  });

  render();
}
