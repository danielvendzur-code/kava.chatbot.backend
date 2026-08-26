(() => {
  'use strict';

  const slug = String(window.COFFEE_DEMO_SLUG || document.body.dataset.coffeeFinal || '').replace('-v13', '');
  if (!['praziarnicka', 'diamonds', 'kaffa', 'vitazov', 'concept'].includes(slug)) return;
  document.documentElement.dataset.coffeeReleaseContract = 'ready';

  const setText = (nodes, labels) => {
    [...nodes].forEach((node, index) => {
      if (labels[index] && node.textContent !== labels[index]) node.textContent = labels[index];
    });
  };

  function enforceKaffa() {
    if (slug !== 'kaffa') return;
    setText(document.querySelectorAll('.kf-chip'), [
      'Espresso blend',
      'Niečo na filter',
      'Nechcem kyslú',
      'Chcem ovocnú'
    ]);
    const entry = document.querySelector('.kf-advisor-entry');
    const started = Boolean(document.querySelector('.kf-message-row--user'));
    if (entry) entry.hidden = started;
  }

  const victoryContext = {
    home: '/assets/jolka/method/moka.webp',
    office: '/assets/jolka/method/both.webp',
    automatic: '/assets/jolka/method/automat.webp',
    discovery: '/assets/jolka/method/filter.webp'
  };

  function enforceVictoryPhotos() {
    if (slug !== 'vitazov') return;
    const stepName = document.querySelector('#stepName')?.textContent?.trim();
    if (stepName !== 'Použitie') return;

    document.querySelectorAll('#advisorBody .option[data-value]').forEach((option) => {
      const src = victoryContext[option.dataset.value];
      const visual = option.querySelector('.option__photo');
      if (!src || !visual) return;
      let photo = visual.querySelector('.cf-context-photo');
      if (!photo) {
        photo = document.createElement('img');
        photo.className = 'cf-context-photo';
        photo.alt = '';
        photo.decoding = 'async';
        visual.prepend(photo);
      }
      if (photo.getAttribute('src') !== src) photo.src = src;
    });
  }

  function enforceDiamondsCopy() {
    if (slug !== 'diamonds') return;
    const teaser = document.querySelector('.teaser');
    if (!teaser) return;
    const title = teaser.querySelector('strong,b');
    const copy = teaser.querySelector('span');
    if (title) title.textContent = 'Nájdite svoju kávu';
    if (copy) copy.textContent = '4 otázky · jedno odporúčanie';
  }

  function run() {
    enforceKaffa();
    enforceVictoryPhotos();
    enforceDiamondsCopy();
  }

  let scheduled = false;
  const observer = new MutationObserver(() => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      run();
    });
  });
  observer.observe(document.body, { childList: true, subtree: true });

  run();
  [120, 350, 900].forEach((delay) => setTimeout(run, delay));
})();