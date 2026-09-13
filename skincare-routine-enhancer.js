(() => {
  'use strict';

  const data = window.COSMETICS_DEMOS;
  const slug = document.body?.dataset?.cosmeticsDemo;
  const brand = data?.brands?.[slug];
  const stage = document.querySelector('#cx-stage');
  if (!data || !brand || !stage) return;

  const esc = (value = '') => String(value).replace(/[&<>"']/g, (ch) => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[ch]));

  const questionKeyByValue = new Map(
    data.questions.flatMap((question) => question.options.map((option) => [option.value, question.key]))
  );
  const answers = {};

  const roleOf = (product) => {
    const tags = Array.isArray(product.tags) ? product.tags : [];
    const name = String(product.name || '').toLowerCase();
    if (tags.includes('serum')) return 'serum';
    if (tags.includes('oil')) return 'oil';
    if (tags.includes('cream')) return 'cream';
    if (/čist|cist|clean|gél|gel/.test(name)) return 'cleanser';
    if (/tonik|tonic|voda|hydrol/.test(name)) return 'toner';
    if (/mask/.test(name)) return 'mask';
    return 'care';
  };

  const score = (product, selected) => {
    const tags = product.tags || [];
    let total = 0;
    if (tags.includes(selected.goal)) total += 18;
    if (tags.includes(selected.skin)) total += 15;
    if (selected.texture !== 'any' && tags.includes(selected.texture)) total += 7;
    if (tags.includes(selected.routine)) total += 4;
    return total;
  };

  const ranked = (selected) => brand.products
    .map((product, index) => ({ product, index, score: score(product, selected) }))
    .sort((a, b) => b.score - a.score || a.index - b.index);

  const desiredCount = (routine) => {
    if (routine === 'basic') return 3;
    if (routine === 'full') return 4;
    return 1;
  };

  const pickRoutine = (selected) => {
    const all = ranked(selected);
    const primary = all.filter(({ product }) => product.tags.includes(selected.skin) || product.tags.includes(selected.goal));
    const ordered = [...primary, ...all.filter((item) => !primary.includes(item))];
    const count = Math.min(desiredCount(selected.routine), ordered.length);
    if (!ordered.length) return [];

    const chosen = [ordered[0].product];
    const usedRoles = new Set([roleOf(chosen[0])]);

    for (const item of ordered.slice(1)) {
      if (chosen.length >= count) break;
      const role = roleOf(item.product);
      if (!usedRoles.has(role)) {
        chosen.push(item.product);
        usedRoles.add(role);
      }
    }
    for (const item of ordered.slice(1)) {
      if (chosen.length >= count) break;
      if (!chosen.some((product) => product.id === item.product.id)) chosen.push(item.product);
    }
    return chosen;
  };

  const patchPrimary = (body, product) => {
    const card = body.querySelector('.cx-product');
    if (!card || !product) return;
    const img = card.querySelector('.cx-product-photo img');
    const title = card.querySelector('.cx-product-copy h2');
    const price = card.querySelector('.cx-product-price strong');
    const link = card.querySelector('.cx-product-price a');
    if (img) { img.src = product.photo || brand.hero; img.alt = product.name; }
    if (title) title.textContent = product.name;
    if (price) price.textContent = product.price;
    if (link) link.href = product.url;

    let badge = card.querySelector('.cx-step-badge');
    if (!badge) {
      badge = document.createElement('span');
      badge.className = 'cx-step-badge';
      card.querySelector('.cx-product-copy')?.prepend(badge);
    }
    badge.textContent = 'Krok 1';
  };

  const routineCopy = (routine, count) => {
    if (routine === 'basic') return `Vybral som ${count} navzájom sa dopĺňajúce kroky podľa typu pleti, priority a preferovanej textúry.`;
    if (routine === 'full') return `Vybral som kompletnú rutinu v ${count} krokoch. Prvý je hlavný krok, ostatné ju dopĺňajú.`;
    return '';
  };

  const patchResult = () => {
    if (!data.questions.every((question) => answers[question.key])) return;
    const body = stage.querySelector('.cx-result-body');
    if (!body) return;

    const products = pickRoutine(answers);
    if (!products.length) return;
    const key = `${slug}:${Object.values(answers).join('|')}:${products.map((p) => p.id).join(',')}`;
    if (body.dataset.routineEnhanced === key) return;
    body.dataset.routineEnhanced = key;

    body.querySelector('.cx-routine-set')?.remove();
    body.querySelector('.cx-routine-intro')?.remove();
    body.querySelector('.cx-step-badge')?.remove();

    const kicker = body.querySelector('.cx-kicker');
    const why = body.querySelector('.cx-why');
    const alt = body.querySelector('.cx-alt');

    patchPrimary(body, products[0]);

    if (products.length === 1) {
      if (kicker) kicker.textContent = 'Váš smer';
      return;
    }

    if (kicker) kicker.textContent = answers.routine === 'basic'
      ? `Vaša rutina · ${products.length} kroky`
      : `Kompletná rutina · ${products.length} kroky`;

    const intro = document.createElement('p');
    intro.className = 'cx-routine-intro';
    intro.textContent = routineCopy(answers.routine, products.length);
    body.querySelector('.cx-product')?.insertAdjacentElement('beforebegin', intro);

    const set = document.createElement('div');
    set.className = 'cx-routine-set';
    set.innerHTML = products.slice(1).map((product, index) => `
      <article class="cx-routine-card">
        <div class="cx-routine-card-photo"><img src="${esc(product.photo || brand.hero)}" alt="${esc(product.name)}" loading="lazy" referrerpolicy="no-referrer"></div>
        <div class="cx-routine-card-copy">
          <small>Krok ${index + 2}</small>
          <b>${esc(product.name)}</b>
          <span>${esc(product.price)}</span>
        </div>
        <a href="${esc(product.url)}" target="_blank" rel="noreferrer">Pozrieť</a>
      </article>`).join('');
    body.querySelector('.cx-product')?.insertAdjacentElement('afterend', set);

    if (why) {
      const label = why.querySelector('small');
      const text = why.querySelector('p');
      if (label) label.textContent = 'Prečo táto rutina';
      if (text) text.textContent = routineCopy(answers.routine, products.length);
    }
    if (alt) alt.hidden = true;
  };

  document.addEventListener('click', (event) => {
    const option = event.target.closest?.('.cx-option[data-value]');
    if (option) {
      const value = option.dataset.value;
      const key = questionKeyByValue.get(value);
      if (key) answers[key] = value;
      setTimeout(patchResult, 720);
    }
    if (event.target.closest?.('#cx-restart')) {
      Object.keys(answers).forEach((key) => delete answers[key]);
    }
  }, true);

  let queued = false;
  const observer = new MutationObserver(() => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      patchResult();
    });
  });
  observer.observe(stage, { childList: true, subtree: true });

  // Exhaustive local contract check for every possible answer combination for
  // this brand. A basic routine must never collapse to one product; a full
  // routine must never collapse below three while the catalogue has enough.
  const values = Object.fromEntries(data.questions.map((question) => [question.key, question.options.map((option) => option.value)]));
  let failures = 0;
  let checked = 0;
  for (const skin of values.skin) for (const goal of values.goal) for (const routine of values.routine) for (const texture of values.texture) {
    const selected = { skin, goal, routine, texture };
    const result = pickRoutine(selected);
    checked += 1;
    if (routine === 'basic' && brand.products.length >= 2 && result.length < 2) failures += 1;
    if (routine === 'full' && brand.products.length >= 3 && result.length < 3) failures += 1;
    const first = result[0];
    const hasPrimary = brand.products.some((product) => product.tags.includes(skin) || product.tags.includes(goal));
    if (hasPrimary && first && !first.tags.includes(skin) && !first.tags.includes(goal)) failures += 1;
  }
  window.__SKINCARE_ROUTINE_QA__ = { slug, checked, failures };
})();
