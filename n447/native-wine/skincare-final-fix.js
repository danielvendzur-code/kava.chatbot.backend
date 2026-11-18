(() => {
  'use strict';

  const data = window.COSMETICS_DEMOS;
  const slug = document.body?.dataset?.cosmeticsDemo;
  const brand = data?.brands?.[slug];
  if (!data || !brand) return;

  const esc = (value = '') => String(value).replace(/[&<>"']/g, (ch) => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[ch]));

  /* Raw raster logos such as SynCare include their own rectangular badge.
     Inside a round launcher that reads as a button inside a button. Keep the
     actual logo in the page/widget header, but use a clean brand wordmark in
     the closed round launcher. */
  const launcherButton = document.querySelector('#cx-open');
  if (launcherButton?.classList.contains('is-image-logo')) {
    const long = String(brand.name).length > 11 ? ' is-long' : '';
    launcherButton.classList.remove('is-image-logo');
    launcherButton.innerHTML = `<span class="cx-launcher-label${long}">${esc(brand.name)}</span>`;
  }

  /* The teaser needs its own close control. The original teaser was a button,
     so replace it with a neutral bubble containing two real buttons rather than
     nesting one interactive element inside another. */
  const originalTeaser = document.querySelector('#cx-teaser');
  if (originalTeaser) {
    const teaser = document.createElement('div');
    teaser.id = 'cx-teaser';
    teaser.className = 'cx-teaser';
    teaser.innerHTML = `
      <button class="cx-teaser-open" type="button" aria-label="Otvoriť výber vína">
        <b>Pomôcť s výberom?</b><span>Krátky výber · konkrétne víno</span>
      </button>
      <button class="cx-teaser-close" type="button" aria-label="Zavrieť náhľad">×</button>`;
    originalTeaser.replaceWith(teaser);

    teaser.querySelector('.cx-teaser-open')?.addEventListener('click', () => {
      document.querySelector('[data-open="advisor"]')?.click();
    });
    teaser.querySelector('.cx-teaser-close')?.addEventListener('click', (event) => {
      event.stopPropagation();
      teaser.hidden = true;
      try { sessionStorage.setItem(`cx-teaser-dismissed:${slug}`, '1'); } catch (_) {}
    });
    try {
      if (sessionStorage.getItem(`cx-teaser-dismissed:${slug}`) === '1') teaser.hidden = true;
    } catch (_) {}
  }

  /* Question cards explain the answer; product packshots belong in results.
     Quantity cards combine actual bottle photos without suggesting a sold bundle. */
  const optionByValue = new Map(data.questions.flatMap(q => q.options.map(o => [o.value,o])));
  const questionKeyByValue = new Map(data.questions.flatMap(q => q.options.map(o => [o.value,q.key])));
  const styleScenes = {'dry':'crisp','medium-dry':'fruity','medium-sweet':'sweet','no-preference':'any'};
  const counts = {simple:1,basic:3,full:4,target:1};
  /* One bottle geometry for every quantity card; drawn, not photographed. */
  const bottle = (x, cap) => `<ellipse cx="${x}" cy="180" rx="24" ry="4" fill="#000" opacity=".08"/><path d="M${x - 6} 28h12v40c0 14 12 16 12 34v70a6 6 0 0 1-6 6h-24a6 6 0 0 1-6-6v-70c0-18 12-20 12-34z" fill="#2f3a2b"/><path d="M${x - 14} 104v66" stroke="#fff" stroke-opacity=".16" stroke-width="3" stroke-linecap="round"/><rect x="${x - 7}" y="24" width="14" height="18" rx="2" fill="${cap}"/><rect x="${x - 13}" y="116" width="26" height="36" rx="2" fill="#f7f3ea"/><rect x="${x - 8}" y="126" width="16" height="2" fill="#b9ad98"/><rect x="${x - 8}" y="132" width="10" height="2" fill="#d5ccba"/>`;
  const caps = ['#c8a96a', '#7b1e2b', '#d98c98', '#c8a96a'];
  const quantityArt = (value) => {
    const xs = {simple:[150], basic:[104,150,196], full:[81,127,173,219], target:[150]}[value] || [150];
    const crate = value === 'full' ? '<path d="M44 132h212v50a6 6 0 0 1-6 6H50a6 6 0 0 1-6-6z" fill="#d8c3a1"/><path d="M44 132h212v8H44z" fill="#c4ac86"/><path d="M118 150h64" stroke="#a88f68" stroke-width="3" stroke-linecap="round"/>' : '';
    const bow = value === 'target' ? '<g fill="none" stroke="#a8323f" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"><path d="M150 78c-22-18-36-6-26 6 6 7 18 2 26-6zM150 78c22-18 36-6 26 6-6 7-18 2-26-6z" fill="#c8434f"/><path d="M148 80l-12 30M152 80l12 30"/></g><circle cx="150" cy="78" r="5" fill="#a8323f"/>' : '';
    return `<svg class="cx-wine-quantity" viewBox="0 0 300 200" preserveAspectRatio="xMidYMid slice" role="img" aria-hidden="true"><rect width="300" height="200" fill="#f1ebe0"/><rect y="182" width="300" height="18" fill="#e6dccb"/>${xs.map((x, i) => bottle(x, caps[i])).join('')}${crate}${bow}</svg>`;
  };
  const hydrateOptionPhotos = () => {
    document.querySelectorAll('.cx-option[data-value]').forEach(button => {
      const value=button.dataset.value,holder=button.querySelector('.cx-option-photo');
      if(!holder)return;
      const quantity=questionKeyByValue.get(value)==='routine' ? counts[value] : 0;
      const pool=brand.products.filter(p=>p.photo);
      const images=quantity ? ['svg:'+value] : [];
      const scene=styleScenes[value]||value;
      const src=data.semanticPhotos?.[scene]||optionByValue.get(value)?.image||brand.hero;
      const signature=JSON.stringify([value,quantity,images,src]);
      if(holder.dataset.wineScene===signature)return;
      holder.dataset.wineScene=signature;
      holder.classList.remove('cx-option-photo--mark');
      holder.classList.remove('cx-option-photo--bottles');
      holder.style.setProperty('--bottle-count',String(quantity||1));
      holder.removeAttribute('data-image-failed');
      holder.innerHTML=quantity
        ? quantityArt(value)
        : `<img src="${esc(src)}" alt="" loading="lazy" referrerpolicy="no-referrer">`;
      holder.querySelectorAll('img').forEach(img=>img.addEventListener('error',()=>holder.setAttribute('data-image-failed','true'),{once:true}));
    });
  };

  /* Recommendation guard: a wine recommendation must first match the colour
     the customer chose; style and food only break the tie. */
  const answers = {};
  /* Food pairing: wineries that publish it keep their own tags. Where the catalogue has none,
     the general pairing by colour and style applies, so the question always has an effect. */
  const FOOD = ['fish', 'meat', 'cheese'];
  const hasFoodTags = brand.products.some((product) => FOOD.some((tag) => product.tags.includes(tag)));
  const pairing = (product) => {
    if (hasFoodTags) return product.tags;
    const t = product.tags, extra = [];
    if (t.includes('sweet')) extra.push('cheese');
    else if (t.includes('red')) extra.push('meat', ...(t.includes('bold') ? ['cheese'] : []));
    else extra.push('fish', ...(t.includes('bold') || t.includes('sparkling') ? ['cheese'] : []));
    return [...t, ...extra];
  };
  const recommendationScore = (product, selected) => {
    let total = 0;
    if (selected.texture !== 'any' && pairing(product).includes(selected.texture)) total += 7;
    if (selected.routine === 'target' && product.tags.includes('target')) total += 4;
    return total;
  };
  /* Colour and style are conditions, in that order. A condition is relaxed only when the winery
     has no such wine at all, and the result then says so. Equal wines keep the winery's own order. */
  let relaxed = [];
  const rankedProducts = (selected) => {
    relaxed = [];
    let pool = brand.products;
    for (const key of ['skin', 'goal']) {
      const value = selected[key];
      if (!value || value === 'no-preference' || value === 'mixed' || value === 'any') continue;
      const matching = pool.filter((product) => product.tags.includes(value));
      if (matching.length) pool = matching; else relaxed.push(value);
    }
    return pool.map((product, index) => ({ product, index, score: recommendationScore(product, selected) }))
      .sort((a, b) => b.score - a.score || a.index - b.index);
  };

  window.CX_WINE_RANK = rankedProducts;

  const ANSWER_LABELS = {
    white:'biele', red:'červené', rose:'ružové', sparkling:'šumivé',
    crisp:'suché a svieže', fruity:'ovocné', bold:'plné', sweet:'sladšie',
    target:'na darček',
    dry:'suché', 'medium-dry':'polosuché', 'medium-sweet':'polosladké',
    fish:'k rybe a hydine', meat:'k mäsu', cheese:'k syrom a dezertom'
  };

  /* The alternative must be something the result does not already show. A
     trio, a carton or a routine lists several products, and ranked[1] is then
     usually one of them, so the "alternative" repeated a card right above it.
     Runs after every change to the result, whichever layer rendered last. */
  const reconcileAlternative = () => {
    const resultRoot = document.querySelector('.cx-result');
    const alt = resultRoot?.querySelector('.cx-alt');
    if (!alt || !data.questions.every((question) => answers[question.key])) return;
    const shown = new Set([...resultRoot.querySelectorAll('.cx-product-copy h2, .cx-routine-card b')]
      .map((node) => node.textContent.trim()));
    const pick = rankedProducts(answers).map((item) => item.product)
      .find((product) => !shown.has(product.name));
    const altName = alt.querySelector('b');
    const altLink = alt.querySelector('a');
    if (!pick) { if (!alt.hidden) alt.hidden = true; return; }
    if (altName && altName.textContent !== pick.name) altName.textContent = pick.name;
    if (altLink && altLink.getAttribute('href') !== pick.url) altLink.href = pick.url;
    if (alt.hidden) alt.hidden = false;
  };

  let lastPatched = '';
  const patchResult = () => {
    if (!data.questions.every((question) => answers[question.key])) return;
    const resultRoot = document.querySelector('.cx-result');
    if (!resultRoot) return;
    const ranked = rankedProducts(answers);
    const product = ranked[0]?.product;
    if (!product) return;

    const key = `${product.id}:${Object.values(answers).join('|')}`;
    const title = resultRoot.querySelector('.cx-product-copy h2');
    if (lastPatched === key && title?.textContent === product.name) { reconcileAlternative(); return; }
    lastPatched = key;

    const img = resultRoot.querySelector('.cx-product-photo img');
    if (img) {
      img.src = product.photo || brand.hero;
      img.alt = product.name;
    }
    if (title) title.textContent = product.name;

    const price = resultRoot.querySelector('.cx-product-price strong');
    if (price) price.textContent = product.price;
    const productLink = resultRoot.querySelector('.cx-product-price a');
    if (productLink) productLink.href = product.url;
    const why = resultRoot.querySelector('.cx-why p');
    if (why) why.textContent = product.reason;
    resultRoot.querySelector('.cx-wine-relaxed')?.remove();
    if (relaxed.length) {
      const note = document.createElement('p');
      note.className = 'cx-wine-relaxed';
      note.textContent = `V ponuke vinárstva nie je víno, ktoré by spĺňalo aj odpoveď „${relaxed.map((value) => brand.answerLabels?.[value] || ANSWER_LABELS[value] || value).join('“ a „')}“. Toto je najbližšia možnosť.`;
      resultRoot.querySelector('.cx-product')?.insertAdjacentElement('beforebegin', note);
    }

    const matched = data.questions
      .map((question) => answers[question.key])
      .filter((value) => value && value !== 'any' && product.tags.includes(value))
      .map((value) => brand.answerLabels?.[value] || ANSWER_LABELS[value])
      .filter(Boolean);
    let tags = resultRoot.querySelector('.cx-product-tags');
    if (matched.length) {
      if (!tags) {
        tags = document.createElement('div');
        tags.className = 'cx-product-tags';
        title?.insertAdjacentElement('afterend', tags);
      }
      tags.innerHTML = matched.map((label) => `<span>${esc(label)}</span>`).join('');
    } else if (tags) {
      tags.remove();
    }

    reconcileAlternative();
  };

  const stage = document.querySelector('#cx-stage');
  if (stage) {
    hydrateOptionPhotos();
    stage.addEventListener('click', (event) => {
      const option = event.target.closest?.('.cx-option[data-value]');
      if (option) {
        const value = option.dataset.value;
        const key = questionKeyByValue.get(value);
        if (key) answers[key] = value;
        setTimeout(patchResult, 620);
      }
      if (event.target.closest?.('#cx-restart')) {
        for (const key of Object.keys(answers)) delete answers[key];
        lastPatched = '';
      }
    }, true);
    new MutationObserver(() => {
      hydrateOptionPhotos();
      patchResult();
    }).observe(stage, { childList: true, subtree: true });
  }

  /* Exhaustive per-brand runtime audit of the exact final guard. */
  const values = Object.fromEntries(data.questions.map((question) => [question.key, question.options.map((option) => option.value)]));
  let critical = 0, combinations = 0;
  const winners = {};
  const neutral = new Set(['no-preference', 'mixed']);
  const unsupportedColours = values.skin.filter((value) => !neutral.has(value) && !brand.products.some((product) => product.tags.includes(value)));
  for (const skin of values.skin) for (const goal of values.goal) for (const routine of values.routine) for (const texture of values.texture) {
    combinations += 1;
    const selected = { skin, goal, routine, texture };
    const winner = rankedProducts(selected)[0]?.product;
    if (!winner) { critical += 1; continue; }
    winners[winner.id] = (winners[winner.id] || 0) + 1;
    const hasColour = brand.products.some((product) => product.tags.includes(skin));
    if (hasColour && !winner.tags.includes(skin)) critical += 1;
  }
  window.__SKINCARE_RUNTIME_QA__ = { slug, combinations, criticalRecommendationFailures: critical, unsupportedColours, winners };
})();
