(() => {
  'use strict';
  const app = window.ConceptSeasonalApp;
  const { $, $$, escapeHTML, icons, mark, productById, rankings, priceLabel, persist, emit, updateProgress, renderQuestion, renderResult } = app;
  const { advisor } = app.refs;
  const formatWeight = (grams) => grams === 1000 ? '1 kg' : `${grams} g`;
  const formatPrice = (price) => `${price.toLocaleString('sk-SK', { minimumFractionDigits: price % 1 ? 2 : 0 })} €`;

  function renderPackage() {
    const product = productById(app.state.selectedProduct) || rankings()[0];
    const selectedPack = product.packages.find((pack) => pack.grams === app.state.packageGrams);
    advisor.innerHTML = `
      <div class="package-head"><span class="result-kicker">Dokončite výber</span><h2>Balenie a mletie</h2><p>Zvoľte praktickú podobu odporúčanej kávy.</p></div>
      <div class="package-product"><div><small>Odporúčaná káva</small><b>${escapeHTML(product.name)}</b></div><strong>${escapeHTML(priceLabel(product))}</strong></div>
      <span class="choice-label">Balenie</span>
      <div class="choice-grid">${product.packages.map((pack) => `<button class="choice-card ${app.state.packageGrams === pack.grams ? 'is-selected' : ''}" type="button" data-grams="${pack.grams}"><b>${formatWeight(pack.grams)}</b><small>${formatPrice(pack.price)}</small></button>`).join('')}</div>
      <span class="choice-label">Mletie</span>
      <div class="grind-grid"><button class="grind ${app.state.grind === 'beans' ? 'is-selected' : ''}" type="button" data-grind="beans"><b>Zrnková</b><small>najbezpečnejšia voľba</small></button><button class="grind ${app.state.grind === 'recommend' ? 'is-selected' : ''}" type="button" data-grind="recommend"><b>Odporučiť mletie</b><small>podľa prípravy</small></button></div>
      <div class="summary"><div class="summary__row"><span>Káva</span><b>${escapeHTML(product.name)}</b></div><div class="summary__row"><span>Balenie</span><b>${selectedPack ? formatWeight(selectedPack.grams) : '—'}</b></div><div class="summary__row summary__row--total"><span>Cena produktu</span><b>${selectedPack ? formatPrice(selectedPack.price) : 'Vyberte balenie'}</b></div></div>
      <button class="checkout-button" id="checkout" type="button" ${selectedPack ? '' : 'disabled'}>Pokračovať na produkt</button>
      <p class="package-note">Balenie a mletie sa prenesú ku konkrétnemu produktu.</p>`;
    $$('.choice-card', advisor).forEach((button) => button.addEventListener('click', () => {
      app.state.packageGrams = Number(button.dataset.grams);
      app.state.inCart = false;
      persist();
      renderPackage();
    }));
    $$('.grind', advisor).forEach((button) => button.addEventListener('click', () => {
      app.state.grind = button.dataset.grind;
      persist();
      renderPackage();
    }));
    $('#checkout').addEventListener('click', () => {
      if (!app.state.packageGrams) return;
      app.state.inCart = true;
      app.state.stage = 'success';
      persist();
      renderAdvisor();
    });
  }

  function renderSuccess() {
    const product = productById(app.state.selectedProduct) || rankings()[0];
    const pack = product.packages.find((item) => item.grams === app.state.packageGrams);
    advisor.innerHTML = `<div class="success"><div class="success__mark is-mark-result">${mark()}</div><span class="result-kicker">Výber je pripravený</span><h2>${escapeHTML(product.name)}</h2><p>${pack ? `${formatWeight(pack.grams)} za ${formatPrice(pack.price)}` : ''}${app.state.addon ? '<br>+ ochutnávková dvojica' : ''}</p><a class="product-link" href="${escapeHTML(product.url)}" target="_blank" rel="noreferrer">Otvoriť produkt ${icons.arrow}</a><button class="result-button" id="startAgain" type="button">Vybrať ďalšiu kávu</button></div>`;
    $('#startAgain').addEventListener('click', resetAdvisor);
    emit('purchase_intent', { product: product.name, grams: app.state.packageGrams, grind: app.state.grind });
  }

  function renderAdvisor() {
    updateProgress();
    if (app.state.stage === 'questions') renderQuestion();
    else if (app.state.stage === 'result') renderResult();
    else if (app.state.stage === 'package') renderPackage();
    else renderSuccess();
    advisor.scrollTop = 0;
  }

  function resetAdvisor() {
    app.state.step = 0;
    app.state.answers = {};
    app.state.stage = 'questions';
    app.state.selectedProduct = null;
    app.state.packageGrams = null;
    app.state.grind = 'beans';
    app.state.addon = false;
    app.state.inCart = false;
    app.state.transitioning = false;
    persist();
    renderAdvisor();
  }

  Object.assign(app, { formatWeight, formatPrice, renderPackage, renderSuccess, renderAdvisor, resetAdvisor });
})();
