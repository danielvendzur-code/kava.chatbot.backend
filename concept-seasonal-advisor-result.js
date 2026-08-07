(() => {
  'use strict';
  const app = window.ConceptSeasonalApp;
  const { $, escapeHTML, productById, rankings, persist, emit, animateMarks } = app;
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
    advisor.innerHTML = `
      <div class="result-head"><span class="result-kicker">Odporúčanie podľa odpovedí</span><h2>Toto by som ti odporučil.</h2></div>
      <section class="result-card" aria-label="Odporúčaná káva ${escapeHTML(product.name)}">
        <div class="result-photo">
          <img src="${escapeHTML(product.photo)}" width="1280" height="900" alt="Príprava vhodná pre odporúčanú kávu">
          <div class="result-photo__copy"><small>${escapeHTML(product.country)} · ${escapeHTML(product.process)}</small><h3>${escapeHTML(product.name)}</h3><span>${escapeHTML(priceLabel(product))}</span></div>
        </div>
        <div class="result-body">
          <div class="result-facts">
            <div><span>Pôvod</span><p>${escapeHTML(product.region)}</p></div>
            <div><span>Ako chutí</span><p>${escapeHTML(product.plainTaste)}</p></div>
            <div><span>Príprava</span><p>${escapeHTML(product.suitable)}</p></div>
          </div>
          <div class="reason"><b>Prečo práve táto</b><p>${escapeHTML(product.reason)}</p></div>
          <div class="result-actions"><button class="result-button result-button--primary" id="choosePack" type="button">Vybrať balenie</button><button class="result-button" id="restartResult" type="button">Zmeniť odpovede</button></div>
          ${alternative ? `<button class="alternative" type="button" data-product="${escapeHTML(alternative.id)}"><span>Jedna alternatíva</span><b>${escapeHTML(alternative.name)}</b><small>${escapeHTML(alternative.tags.slice(0, 3).join(' · '))}</small></button>` : ''}
        </div>
      </section>`;
    $('#choosePack').addEventListener('click', () => { app.state.stage = 'package'; persist(); app.renderAdvisor(); });
    $('#restartResult').addEventListener('click', app.resetAdvisor);
    $('.alternative', advisor)?.addEventListener('click', (event) => {
      app.state.selectedProduct = event.currentTarget.dataset.product;
      persist();
      renderResult();
      animateMarks('is-mark-result');
    });
    persist();
    emit('recommendation_view', { product: product.name });
  }

  Object.assign(app, { resultProduct, priceLabel, renderResult });
})();
