(() => {
  'use strict';
  const app = window.ConceptSeasonalApp;
  const { $, escapeHTML, icons, productById, rankings, persist, emit, animateMarks } = app;
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
    const upsell = product.packages?.find((pack) => pack.grams >= 1000);
    const image = product.productPhoto || product.photo;
    const alternativeImage = alternative?.productPhoto || alternative?.photo;
    advisor.innerHTML = `
      <div class="result-head"><span class="result-kicker">Odporúčanie podľa odpovedí</span><h2>Toto by som vám odporučil.</h2></div>
      <section class="result-card" aria-label="Odporúčaná káva ${escapeHTML(product.name)}">
        <div class="result-photo">
          <img src="${escapeHTML(image)}" width="1024" height="1024" alt="Oficiálna produktová fotografia ${escapeHTML(product.name)}">
          <div class="result-photo__copy"><small>${escapeHTML(product.country)} · ${escapeHTML(product.process)}</small><h3>${escapeHTML(product.name)}</h3><span>${escapeHTML(priceLabel(product))}</span></div>
        </div>
        <div class="result-body">
          <div class="result-facts">
            <div><span>Pôvod</span><p>${escapeHTML(product.region)}</p></div>
            <div><span>Ako chutí</span><p>${escapeHTML(product.plainTaste)}</p></div>
            <div><span>Príprava</span><p>${escapeHTML(product.suitable)}</p></div>
          </div>
          <div class="reason"><b>Prečo práve táto</b><p>${escapeHTML(product.reason)}</p></div>
          <div class="result-actions"><a class="result-button result-button--primary" id="choosePack" href="${escapeHTML(product.url)}" target="_blank" rel="noreferrer">Vybrať balenie na e-shope ${icons.arrow}</a><button class="result-button" id="restartResult" type="button">Zmeniť odpovede</button></div>
          ${alternative ? `<button class="alternative" type="button" data-product="${escapeHTML(alternative.id)}"><span>Ak chcete iný smer</span><span class="alternative__main"><img src="${escapeHTML(alternativeImage)}" alt=""><b>${escapeHTML(alternative.name)}</b><i>${icons.arrow}</i></span><small>${escapeHTML(alternative.tags.slice(0, 3).join(' · '))}</small></button>` : ''}
          ${upsell ? `<a class="upsell-note" href="${escapeHTML(product.url)}" target="_blank" rel="noreferrer"><span><b>Pijete ju každý deň?</b> ${formatUpsell(upsell)} <u>pozrieť varianty</u></span>${icons.arrow}</a>` : ''}
        </div>
      </section>`;
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

  function formatUpsell(pack) {
    return `Balenie ${pack.grams === 1000 ? '1 kg' : `${pack.grams} g`} je praktickejšie.`;
  }

  Object.assign(app, { resultProduct, priceLabel, renderResult, formatUpsell });
})();
