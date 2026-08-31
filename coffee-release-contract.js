(() => {
  'use strict';

  const slug = String(window.COFFEE_DEMO_SLUG || document.body.dataset.coffeeFinal || '').replace('-v13', '');
  if (!['praziarnicka', 'diamonds', 'kaffa', 'vitazov', 'concept', 'jolka'].includes(slug)) return;
  document.documentElement.dataset.coffeeReleaseContract = 'ready';

  /* Several legacy layers append their styles into body after page load. Keep
     this contract at the actual end of the cascade, with a finite reorder pass. */
  const lateStyle = document.querySelector('link[href="/coffee-release-contract.css"]') || document.createElement('link');
  lateStyle.rel = 'stylesheet';
  lateStyle.href = '/coffee-release-contract.css';
  lateStyle.dataset.coffeeReleaseStyle = 'true';
  lateStyle.dataset.mcOrder = '110';
  document.body.appendChild(lateStyle);

  const orderLateStyles = () => {
    const ranked = [...document.body.querySelectorAll('link[rel="stylesheet"][data-mc-order]')]
      .sort((left, right) => Number(left.dataset.mcOrder) - Number(right.dataset.mcOrder));
    ranked.forEach((node) => document.body.appendChild(node));
  };
  orderLateStyles();
  [80, 400, 1200].forEach((delay) => setTimeout(orderLateStyles, delay));

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
    home: '/assets/jolka/method/lever.webp',
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

  function enforceJolkaCredit() {
    if (slug !== 'jolka') return;
    const note = document.querySelector('.widget__note');
    if (!note || note.dataset.releaseCredit === 'true') return;
    const link = note.querySelector('a') || document.createElement('a');
    link.href = 'https://mojchatbot.sk';
    link.target = '_blank';
    link.rel = 'noreferrer';
    link.textContent = 'mojchatbot.sk';
    note.replaceChildren(link);
    note.dataset.releaseCredit = 'true';
  }

  const priceSelectors = [
    '.pz13-product__buy strong',
    '.result-facts dd',
    '.kf-result-hero__copy strong',
    '.result-main__copy > span',
    '.result-price b',
    '.result__price b'
  ].join(',');

  function animatePrice(node) {
    if (node.dataset.priceAnimated === 'true' || !node.textContent.includes('€')) return;
    const original = node.textContent.trim();
    const match = original.match(/\d+(?:[.,]\d+)?/);
    if (!match) return;

    node.dataset.priceAnimated = 'true';
    const token = match[0];
    const separator = token.includes(',') ? ',' : token.includes('.') ? '.' : '';
    const decimals = separator ? token.split(separator)[1].length : 0;
    const target = Number(token.replace(',', '.'));
    const prefix = original.slice(0, match.index);
    const suffix = original.slice(match.index + token.length);
    const format = (value) => `${prefix}${value.toFixed(decimals).replace('.', separator || '.')}${suffix}`;

    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      node.textContent = original;
      return;
    }

    const started = performance.now();
    const duration = 680;
    const frame = (now) => {
      const progress = Math.min(1, (now - started) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      node.textContent = progress === 1 ? original : format(target * eased);
      if (progress < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }

  function enforcePriceMotion() {
    document.querySelectorAll(priceSelectors).forEach(animatePrice);
  }

  function run() {
    enforceKaffa();
    enforceVictoryPhotos();
    enforceDiamondsCopy();
    enforceJolkaCredit();
    enforcePriceMotion();
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
  [120, 350, 900, 1600, 2600].forEach((delay) => setTimeout(run, delay));
})();
