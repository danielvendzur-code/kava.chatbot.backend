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
  const photoFor = (value) => {
    const product = brand.products.find((item) => Array.isArray(item.tags) && item.tags.includes(value) && item.photo);
    return product?.photo || optionByValue.get(value)?.image || brand.hero;
  };

  const hydrateOptionPhotos = () => {
    document.querySelectorAll('.cx-option[data-value]').forEach((button) => {
      const value = button.dataset.value;
      const holder = button.querySelector('.cx-option-photo');
      const src = photoFor(value);
      if (!holder || !src) return;
      const current = holder.querySelector('img')?.getAttribute('src');
      if (current === src && !holder.classList.contains('cx-option-photo--mark')) return;
      holder.classList.remove('cx-option-photo--mark');
      holder.innerHTML = `<img src="${esc(src)}" alt="" loading="lazy" referrerpolicy="no-referrer">`;
      const img = holder.querySelector('img');
      img?.addEventListener('error', () => holder.setAttribute('data-image-failed', 'true'), { once: true });
    });
  };

  const stage = document.querySelector('#cx-stage');
  if (stage) {
    hydrateOptionPhotos();
    new MutationObserver(hydrateOptionPhotos).observe(stage, { childList: true, subtree: true });
  }

  /* Small deterministic runtime audit used while checking all demos. */
  const weights = { skin: 9, goal: 11, routine: 5, texture: 6 };
  const score = (product, answers) => data.questions.reduce((total, question) => {
    const answer = answers[question.key];
    if (!answer || answer === 'any') return total;
    return total + (product.tags.includes(answer) ? weights[question.key] : -1);
  }, 0);

  const values = Object.fromEntries(data.questions.map((question) => [question.key, question.options.map((option) => option.value)]));
  let critical = 0;
  for (const skin of values.skin) for (const goal of values.goal) for (const routine of values.routine) for (const texture of values.texture) {
    const answers = { skin, goal, routine, texture };
    const ranked = brand.products.map((product, index) => ({ product, index, score: score(product, answers) }))
      .sort((a, b) => b.score - a.score || a.index - b.index);
    const winner = ranked[0]?.product;
    if (!winner) { critical += 1; continue; }
    const hasPrimaryCandidate = brand.products.some((product) => product.tags.includes(skin) || product.tags.includes(goal));
    if (hasPrimaryCandidate && !winner.tags.includes(skin) && !winner.tags.includes(goal)) critical += 1;
  }
  window.__SKINCARE_RUNTIME_QA__ = { slug, combinations: 256, criticalRecommendationFailures: critical };
})();
