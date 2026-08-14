(() => {
  'use strict';
  const app = window.ConceptSeasonalApp;
  const { $, $$, escapeHTML, icons, productById, rankings, persist, emit, animateMarks } = app;
  const { advisor } = app.refs;

  function resultProduct() {
    const list = rankings();
    const best = list[0];
    const selected = productById(app.state.selectedProduct);
    return selected ? { ...selected, matchScore: list.find((item) => item.id === selected.id)?.matchScore || 0 } : best;
  }

  function priceLabel(product) {
    const price = Math.min(...product.packages.map((pack) => pack.price));
    return `od ${price.toLocaleString('sk-SK', { minimumFractionDigits: price % 1 ? 2 : 0 })} €`;
  }

  function renderResult() {
    const list = rankings();
    const product = resultProduct();
    app.state.selectedProduct = product.id;
    const alternative = list.find((item) => item.id !== product.id);
    const image = product.productPhoto || product.photo;
    const alternativeImage = alternative?.productPhoto || alternative?.photo;
    if (!app.state.packageGrams || !product.packages.some((pack) => pack.grams === app.state.packageGrams)) {
      app.state.packageGrams = product.packages.find((pack) => pack.grams === 250)?.grams || product.packages[0].grams;
    }
    const selectedPack = product.packages.find((pack) => pack.grams === app.state.packageGrams);
    const packLabel = (grams) => grams === 1000 ? '1 kg' : `${grams} g`;
    const packPrice = (price) => `${price.toLocaleString('sk-SK', { minimumFractionDigits: price % 1 ? 2 : 0 })} €`;
    advisor.innerHTML = `
      <div class="result-head"><span class="result-kicker">Vybrané podľa 4 odpovedí</span><h2>Vaša káva</h2></div>
      <section class="result-card" aria-label="Odporúčaná káva ${escapeHTML(product.name)}">
        <div class="result-main">
          <div class="result-photo"><img src="${escapeHTML(image)}" width="1024" height="1024" alt="Produktová fotografia ${escapeHTML(product.name)}"></div>
          <div class="result-main__copy"><small>${escapeHTML(product.country)} · ${escapeHTML(product.process)}</small><h3>${escapeHTML(product.name)}</h3><p>${escapeHTML(product.plainTaste)}</p><div class="taste-tags">${product.tags.slice(0, 3).map((tag) => `<span>${escapeHTML(tag)}</span>`).join('')}</div></div>
        </div>
        <div class="result-price"><b>${escapeHTML(packPrice(selectedPack.price))}</b><span>/ ${escapeHTML(packLabel(selectedPack.grams))}</span></div>
        <div class="result-actions"><a class="result-cta" href="${escapeHTML(product.url)}" target="_blank" rel="noreferrer">Pozrieť produkt v e-shope <span aria-hidden="true">\u2197</span></a></div>
        ${alternative ? `<button class="alternative" type="button" data-product="${escapeHTML(alternative.id)}"><span class="alternative__main"><img src="${escapeHTML(alternativeImage)}" alt=""><span><small>Ďalšia dobrá voľba</small><b>${escapeHTML(alternative.name)}</b></span><i>${icons.arrow}</i></span></button>` : ''}
        <button class="result-restart" id="restartResult" type="button">Zmeniť odpovede</button>
      </section>`;
    $('#restartResult').addEventListener('click', app.resetAdvisor);
    $('.alternative', advisor)?.addEventListener('click', (event) => {
      app.state.selectedProduct = event.currentTarget.dataset.product;
      app.state.packageGrams = null;
      app.state.addon = false;
      app.state.inCart = false;
      persist();
      renderResult();
      animateMarks('is-mark-result');
    });
    persist();
    emit('recommendation_view', { product: product.name });
  }

  function formatUpsell(pack) {
    return `Balenie ${pack.grams === 1000 ? '1 kg' : `${pack.grams} g`} je praktickejšie.`;
  }

  Object.assign(app, { resultProduct, priceLabel, renderResult, formatUpsell });
})();
