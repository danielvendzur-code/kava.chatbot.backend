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
    const back = document.querySelector('.kf-progress-back');
    if (back && !back.querySelector('span')) {
      const label = document.createElement('span');
      label.textContent = 'Späť';
      back.appendChild(label);
    }
    const brand = document.querySelector('#panel .kf-widget-brand');
    if (brand && !brand.querySelector('.kf-jolka-brand__copy')) {
      const copy = document.createElement('span');
      copy.className = 'kf-jolka-brand__copy';
      copy.innerHTML = '<strong>Kaffa poradca</strong><small><i></i> Online poradca</small>';
      brand.appendChild(copy);
    }
  }

  const brandAssets = {
    praziarnicka: '/brand/praziarnicka-logo-official.png',
    concept: '/brand/concept-official-logo.png',
    vitazov: '/assets/vitazov-logo.svg'
  };

  function brandImage(src, className, alt = '') {
    const image = document.createElement('img');
    image.src = src;
    image.className = className;
    image.alt = alt;
    image.decoding = 'async';
    return image;
  }

  function ensureHeaderCopy(brand, name, accentClass = '') {
    if (!brand) return;
    let copy = brand.querySelector('.cf-jolka-brand__copy');
    if (!copy) {
      copy = document.createElement('span');
      copy.className = `cf-jolka-brand__copy ${accentClass}`.trim();
      copy.innerHTML = `<strong></strong><small><i></i> Online poradca</small>`;
      brand.appendChild(copy);
    }
    copy.querySelector('strong').textContent = name;
  }

  function enforcePraziarnickaIdentity() {
    if (slug !== 'praziarnicka') return;
    document.querySelectorAll('.pz13-widget__brand > img, .pz13-avatar img, #pz13-open img').forEach((image) => {
      if (image.getAttribute('src') !== brandAssets.praziarnicka) image.src = brandAssets.praziarnicka;
      image.classList.add('cf-praziarnicka-logo');
      image.alt = image.closest('.pz13-widget__brand') ? 'Pražiarnička' : '';
    });
    const entryMark = document.querySelector('#pz13-widget .pz13-advisor-entry > span:first-child');
    if (entryMark && !entryMark.querySelector('img.cf-entry-photo')) {
      entryMark.replaceChildren(brandImage('/assets/praziarnicka/prep-automatic.webp', 'cf-entry-photo', ''));
    }
  }

  function enforceConceptIdentity() {
    if (slug !== 'concept') return;
    const brand = document.querySelector('#widget .widget-brand');
    if (brand) {
      let logo = brand.querySelector('img');
      if (!logo) {
        logo = brandImage(brandAssets.concept, 'concept-widget-logo cf-header-logo', 'Concept Coffee Roasters');
        brand.prepend(logo);
      }
      logo.src = brandAssets.concept;
      logo.classList.add('cf-header-logo');
      ensureHeaderCopy(brand, 'Concept Coffee Roasters', 'cf-jolka-brand__copy--concept');
    }
    document.querySelectorAll('#widget .message__avatar').forEach((avatar) => {
      if (avatar.querySelector('img.cf-message-logo')) return;
      avatar.replaceChildren(brandImage(brandAssets.concept, 'cf-message-logo', ''));
    });
    const entryMark = document.querySelector('#widget .advisor-entry__mark');
    if (entryMark && !entryMark.querySelector('img.cf-entry-photo')) {
      entryMark.replaceChildren(brandImage('/assets/concept/prep-filter.webp', 'cf-entry-photo', ''));
    }
    const back = document.querySelector('#widget #prevBtn');
    if (back && !back.querySelector('span')) {
      const label = document.createElement('span');
      label.textContent = 'Späť';
      back.appendChild(label);
    }
  }

  function enforceVictoryIdentity() {
    if (slug !== 'vitazov') return;
    const brand = document.querySelector('#widget .widget-brand');
    if (brand) {
      brand.querySelectorAll('.cf-header-logo-lockup:empty').forEach((node) => node.remove());
      let mark = brand.querySelector('.widget-brand__mark');
      if (!mark) {
        mark = document.createElement('span');
        mark.className = 'widget-brand__mark';
        mark.appendChild(brandImage(brandAssets.vitazov, 'kv-widget-logo cf-header-logo', 'Káva Víťazov'));
        brand.prepend(mark);
      }
      ensureHeaderCopy(brand, 'Káva Víťazov', 'cf-jolka-brand__copy--vitazov');
    }
    document.querySelectorAll('#widget .message__avatar').forEach((avatar) => {
      if (avatar.querySelector('img.cf-message-logo')) return;
      avatar.replaceChildren(brandImage(brandAssets.vitazov, 'cf-message-logo', ''));
    });
    const entryMark = document.querySelector('#widget #openAdvisor > span:first-child');
    if (entryMark && !entryMark.querySelector('img.cf-entry-photo')) {
      entryMark.replaceChildren(brandImage('/assets/vitazov-office.jpeg', 'cf-entry-photo', ''));
    }
    const back = document.querySelector('#widget #prevBtn');
    if (back && !back.querySelector('span')) {
      const label = document.createElement('span');
      label.textContent = 'Späť';
      back.appendChild(label);
    }
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
    const title = document.querySelector('#widgetTitle');
    const description = document.querySelector('#widgetDescription');
    if (title && title.textContent !== 'Diamonds Roastery') title.textContent = 'Diamonds Roastery';
    if (description && (description.textContent.trim() !== 'Online poradca' || !description.querySelector('i'))) {
      description.replaceChildren(document.createElement('i'), document.createTextNode('Online poradca'));
    }
    const teaser = document.querySelector('.teaser');
    if (!teaser) return;
    const teaserTitle = teaser.querySelector('strong,b');
    const copy = teaser.querySelector('span');
    if (teaserTitle) teaserTitle.textContent = 'Nájdite svoju kávu';
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
    '.mcb-plan-price strong',
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
    enforcePraziarnickaIdentity();
    enforceConceptIdentity();
    enforceVictoryIdentity();
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
