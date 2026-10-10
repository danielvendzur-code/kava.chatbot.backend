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
      <button class="cx-teaser-open" type="button" aria-label="Otvoriť výber starostlivosti">
        <b>Pomôcť s výberom?</b><span>4 otázky · konkrétny produkt</span>
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

  /* Every one of the four advisor steps now gets photography. Prefer a real
     packshot from this brand that carries the selected tag; first-six demos do
     not have per-product packshots, so their existing semantic photo is the
     fallback. */
  const optionByValue = new Map(
    data.questions.flatMap((question) => question.options.map((option) => [option.value, option]))
  );
  const questionKeyByValue = new Map(
    data.questions.flatMap((question) => question.options.map((option) => [option.value, question.key]))
  );
  questionKeyByValue.set('mask', 'texture');
  if(slug==='modrapupava')document.querySelector('#cx-widget')?.classList.add('cx-has-own-photos');
  const photoFor = (value) => {
    const product = brand.products.find((item) => Array.isArray(item.tags) && item.tags.includes(value) && item.photo);
    return product?.photo || ((brand.catalogue || slug==='modrapupava') ? brand.products[0]?.photo : optionByValue.get(value)?.image) || brand.hero;
  };

  const hydrateOptionPhotos = () => {
    const usedPhotos=new Set();
    document.querySelectorAll('.cx-option[data-value]').forEach((button) => {
      const value = button.dataset.value;
      const holder = button.querySelector('.cx-option-photo');
      let src = photoFor(value);
      if(brand.catalogue&&usedPhotos.has(src))src=(brand.products.find(p=>p.tags?.includes(value)&&p.photo&&!usedPhotos.has(p.photo))||brand.products.find(p=>p.photo&&!usedPhotos.has(p.photo)))?.photo||src;
      usedPhotos.add(src);
      if (!holder || !src) return;
      const current = holder.querySelector('img')?.getAttribute('src');
      if (current === src && !holder.classList.contains('cx-option-photo--mark')) return;
      holder.classList.remove('cx-option-photo--mark');
      holder.removeAttribute('data-image-failed');
      holder.innerHTML = `<img src="${esc(src)}" alt="" loading="lazy" referrerpolicy="no-referrer">`;
      const img = holder.querySelector('img');
      img?.addEventListener('error', () => holder.setAttribute('data-image-failed', 'true'), { once: true });
    });
  };

  /* Recommendation guard. The base scorer allowed routine + texture to beat
     both primary answers in a few edge combinations. A skincare recommendation
     must first match at least the selected skin type or the user's main goal;
     only then may texture/routine break the tie. */
  const answers = {};
  const recommendationScore = (product, selected) => {
    let total = 0;
    if (product.tags.includes(selected.goal)) total += 18;
    if (product.tags.includes(selected.skin)) total += 15;
    if (selected.texture !== 'any' && product.tags.includes(selected.texture)) total += 7;
    if (product.tags.includes(selected.routine)) total += 4;
    return total;
  };
  const rankedProducts = (selected) => {
    const matchingForm = selected.texture && selected.texture !== 'any' ? brand.products.filter((product) => product.tags.includes(selected.texture)) : brand.products;
    const formPool = matchingForm.length ? matchingForm : brand.products;
    const matchingSkin = formPool.filter((product) => product.tags.includes(selected.skin));
    const pool = matchingSkin.length ? matchingSkin : formPool;
    return pool.map((product, index) => ({ product, index, score: recommendationScore(product, selected) }))
      .sort((a, b) => b.score - a.score || a.index - b.index);
  };

  const ANSWER_LABELS = {
    dry:'suchá pleť', oily:'mastenie', sensitive:'citlivá pleť', balanced:'zmiešaná pleť',
    hydrate:'hydratácia', calm:'upokojenie', clarity:'nedokonalosti', mature:'zrelá pleť',
    simple:'jeden krok', basic:'2–3 kroky', full:'celá rutina', target:'cielený krok',
    cream:'krém', serum:'sérum', oil:'olej', mask:'maska'
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

    const matched = data.questions
      .map((question) => answers[question.key])
      .filter((value) => value && value !== 'any' && product.tags.includes(value))
      .map((value) => ANSWER_LABELS[value])
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
  let critical = 0;
  for (const skin of values.skin) for (const goal of values.goal) for (const routine of values.routine) for (const texture of values.texture) {
    const selected = { skin, goal, routine, texture };
    const winner = rankedProducts(selected)[0]?.product;
    if (!winner) { critical += 1; continue; }
    const hasPrimary = brand.products.some((product) => product.tags.includes(skin) || product.tags.includes(goal));
    if (hasPrimary && !winner.tags.includes(skin) && !winner.tags.includes(goal)) critical += 1;
  }
  window.__SKINCARE_RUNTIME_QA__ = { slug, combinations: 256, criticalRecommendationFailures: critical };
})();
