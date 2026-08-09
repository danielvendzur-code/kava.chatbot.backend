(() => {
  'use strict';

  const requested = new URLSearchParams(location.search).get('demo');
  const pathSlug = location.pathname.split('/').filter(Boolean).at(-1);
  const slug = requested || (['index.html', 'ukazka', undefined].includes(pathSlug) ? 'praziarnicka' : pathSlug);
  if (slug !== 'vitazov') return;

  document.body.dataset.demo = 'vitazov';

  const media = {
    office: {
      src: 'https://kavavitazov.sk/wp-content/uploads/2023/05/prazena-kava-do-kancelarie-office.jpeg',
      fallback: 'https://kavavitazov.sk/wp-content/uploads/2023/05/prazena-kava-do-kancelarie-office-300x300.jpeg'
    },
    victory: {
      src: 'https://kavavitazov.sk/wp-content/uploads/2024/07/kava-prazena-slovensko-presov.jpeg',
      fallback: 'https://kavavitazov.sk/wp-content/uploads/2024/07/kava-prazena-slovensko-presov-300x300.jpeg'
    },
    brazil: {
      src: 'https://kavavitazov.sk/wp-content/uploads/2024/07/kava-z-praziarne-brazilia.jpeg',
      fallback: 'https://kavavitazov.sk/wp-content/uploads/2024/07/kava-z-praziarne-brazilia-300x300.jpeg'
    },
    ethiopia: {
      src: 'https://kavavitazov.sk/wp-content/uploads/2024/07/kava-etiopia-fairtrade-organicka.jpeg',
      fallback: 'https://kavavitazov.sk/wp-content/uploads/2024/07/kava-etiopia-fairtrade-organicka-844x1024.jpeg'
    },
    decaf: {
      src: 'https://kavavitazov.sk/wp-content/uploads/2023/05/kava-z-praziarne-bezkofeinova-decaf-bio-organicka.jpeg',
      fallback: 'https://kavavitazov.sk/wp-content/uploads/2023/05/kava-z-praziarne-bezkofeinova-decaf-bio-organicka-300x300.jpeg'
    }
  };

  const productByName = {
    'Office Blend': 'office',
    'Victory Blend': 'victory',
    'Brazília': 'brazil',
    'Etiópia': 'ethiopia',
    'Bezkofeínová': 'decaf'
  };

  const productUpsells = {
    victory: {
      eyebrow: 'Ak chcete skúsiť ešte jednu 100 % arabiku',
      title: 'Londýnsky Blend',
      copy: 'Korenie, vanilka a sušené slivky v plnom espressovom profile.',
      cta: 'Pozrieť Londýnsky Blend',
      href: 'https://kavavitazov.sk/espresso-arabica/'
    },
    brazil: {
      eyebrow: 'Ak chcete skúsiť ešte jednu 100 % arabiku',
      title: 'Londýnsky Blend',
      copy: 'Podobne plné espresso, tentoraz s tónmi korenia, vanilky a sliviek.',
      cta: 'Pozrieť Londýnsky Blend',
      href: 'https://kavavitazov.sk/espresso-arabica/'
    },
    ethiopia: {
      eyebrow: 'Ak chcete ochutnávať ďalej',
      title: 'Darčekové balenie',
      copy: 'Výber káv z celého sveta v jednom reálnom degustačnom balení.',
      cta: 'Pozrieť degustáciu',
      href: 'https://kavavitazov.sk/kava-darcekove-balenie/'
    }
  };

  const answers = {};

  function currentUse() {
    const qa = new URLSearchParams(location.search).get('qa');
    if (qa === 'office') return 'office';
    if (qa === 'discovery') return 'discovery';
    if (qa === 'decaf') return 'home';
    return answers.use || '';
  }

  function chosenUpsell(productKey) {
    if (currentUse() === 'office') return null;
    return productUpsells[productKey] || null;
  }

  function createProductImage(asset, alt, className, eager = false) {
    const wrapper = document.createElement('span');
    wrapper.className = className;
    const image = document.createElement('img');
    image.src = asset.src;
    image.alt = alt;
    image.decoding = 'async';
    image.loading = eager ? 'eager' : 'lazy';
    let usedFallback = false;
    image.addEventListener('error', () => {
      if (!usedFallback && asset.fallback && image.src !== asset.fallback) {
        usedFallback = true;
        image.src = asset.fallback;
        return;
      }
      wrapper.classList.add('is-broken');
    });
    wrapper.appendChild(image);
    return wrapper;
  }

  function setupStaticBrand() {
    const localLogo = '/assets/vitazov-logo.svg';
    const brand = document.querySelector('.demo-brand');
    if (brand && !brand.querySelector('.kv-official-logo')) {
      const logo = document.createElement('img');
      logo.className = 'kv-official-logo';
      logo.src = localLogo;
      logo.alt = 'Káva Víťazov';
      logo.addEventListener('error', () => brand.classList.add('kv-logo-fallback'));
      brand.prepend(logo);
    }

    const preview = document.querySelector('.preview-pack');
    if (preview && !preview.classList.contains('kv-has-photo')) {
      preview.classList.add('kv-has-photo');
      preview.replaceChildren(createProductImage(media.office, 'Office Blend', 'kv-preview-photo', true));
    }

    const footerLink = document.querySelector('.demo-footer a');
    if (footerLink) {
      footerLink.href = 'https://kavavitazov.sk/';
      footerLink.textContent = 'kavavitazov.sk';
    }

    document.querySelector('.support-row')?.remove();

    const widgetBrand = document.querySelector('.widget-brand');
    if (widgetBrand && !widgetBrand.querySelector('.kv-widget-logo')) {
      widgetBrand.innerHTML = `
        <img class="kv-widget-logo" src="${localLogo}" alt="Káva Víťazov">`;
    }

    const launcherButton = document.querySelector('#openWidget');
    if (launcherButton) launcherButton.innerHTML = `<span class="kv-launcher-logo"><img src="${localLogo}" alt=""></span><span class="launcher__status" aria-hidden="true"></span>`;

    const chatButton = document.querySelector('[data-mode="chat"] b');
    const advisorButton = document.querySelector('[data-mode="advisor"] b');
    if (chatButton) chatButton.textContent = 'Chat';
    if (advisorButton) advisorButton.textContent = 'Výber kávy';

    const teaser = document.querySelector('#launcherTeaser');
    if (teaser) {
      const title = teaser.querySelector('b');
      const text = teaser.querySelector('span');
      if (title) title.textContent = 'Neviete, ktorú kávu vybrať?';
      if (text) text.textContent = 'Štyri krátke voľby a konkrétne odporúčanie.';
    }

    const previewKicker = document.querySelector('.preview-product__copy > span');
    if (previewKicker) previewKicker.textContent = 'Konkrétny príklad';
    const previewReason = document.querySelector('.preview-reason b');
    if (previewReason) previewReason.textContent = 'Prečo to funguje';
    const previewCta = document.querySelector('.preview-cta');
    if (previewCta) previewCta.childNodes[0].textContent = 'Zobraziť odporúčanie ';

    const widget = document.querySelector('#widget');
    if (widget) {
      widget.setAttribute('role', 'dialog');
      widget.setAttribute('aria-modal', 'true');
      document.querySelector('#openWidget')?.setAttribute('aria-controls', 'widget');
      document.querySelector('#heroOpen')?.setAttribute('aria-controls', 'widget');
    }
    document.querySelector('#chatInput')?.setAttribute('aria-label', 'Napíšte otázku');
    document.querySelector('#chatForm button[type="submit"]')?.setAttribute('aria-label', 'Odoslať otázku');
  }

  function setupAccessibility() {
    const widget = document.querySelector('#widget');
    const openButtons = [...document.querySelectorAll('#heroOpen, #openWidget')];
    const closeButton = document.querySelector('#closeWidget');
    if (!widget || !closeButton) return;
    let returnFocus = null;
    const focusable = () => [...widget.querySelectorAll('button:not([disabled]), a[href], input:not([disabled])')].filter((node) => !node.hidden && node.getClientRects().length);
    const keepFocusInside = (event) => {
      if (!widget.classList.contains('is-open') || event.key !== 'Tab') return;
      const nodes = focusable();
      if (!nodes.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    openButtons.forEach((button) => button.addEventListener('click', () => {
      returnFocus = button;
      requestAnimationFrame(() => focusable()[0]?.focus());
    }, true));
    closeButton.addEventListener('click', () => {
      requestAnimationFrame(() => returnFocus?.focus());
    });
    document.addEventListener('keydown', keepFocusInside, true);
    document.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape' || !widget.classList.contains('is-open')) return;
      closeButton.click();
    }, true);
    document.querySelectorAll('.mode__button').forEach((button) => button.addEventListener('click', () => {
      document.querySelectorAll('.mode__button').forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
    }));
    document.querySelectorAll('.mode__button').forEach((button) => button.setAttribute('aria-pressed', String(button.classList.contains('is-active'))));
  }

  function orderResult() {
    const card = document.querySelector('.result-card');
    if (!card || card.dataset.kvOrdered === 'true') return;
    card.dataset.kvOrdered = 'true';
    card.style.display = 'flex';
    card.style.flexDirection = 'column';
    const order = [
      ['.result-main', 1],
      ['.result-details', 2],
      ['.reason', 3],
      ['.result-actions', 4],
      ['.alternative', 5],
      ['.kv-next-best-action', 6],
      ['.office-followup', 7]
    ];
    order.forEach(([selector, value]) => {
      const element = card.querySelector(selector);
      if (element) element.style.order = String(value);
    });
  }

  function normalizeResultDetails(card) {
    const details = [...card.querySelectorAll('.result-detail')];
    const labels = ['Komu sedí', 'Príprava', 'Chuť'];
    details.forEach((detail, index) => {
      const label = detail.querySelector('small');
      if (label && labels[index]) label.textContent = labels[index];
      detail.hidden = false;
    });
  }

  function ensureResultProductName(card, title) {
    const copy = card.querySelector('.result-main__copy');
    if (!copy || copy.querySelector('.kv-product-name')) return;
    const name = document.createElement('span');
    name.className = 'kv-product-name';
    name.textContent = title.textContent.trim();
    copy.prepend(name);
  }

  function renderNextBestAction(card, productKey) {
    const existing = card.querySelector('.kv-next-best-action');
    const offer = chosenUpsell(productKey);
    if (!offer) {
      existing?.remove();
      return;
    }
    if (existing) return;
    const next = document.createElement('aside');
    next.className = 'kv-next-best-action';
    next.setAttribute('aria-label', 'Ďalší tip od poradcu');
    next.innerHTML = `<div class="kv-next-best-action__copy"><small>${offer.eyebrow}</small><b>${offer.title}</b><span>${offer.copy}</span></div><a href="${offer.href}" target="_blank" rel="noreferrer">${offer.cta}<span aria-hidden="true">↗</span></a>`;
    card.append(next);
  }

  function enhanceResult() {
    const title = document.querySelector('.result-head h2');
    const card = document.querySelector('.result-card');
    const visual = card?.querySelector('.product-visual');
    if (!title || !card || !visual) return;
    const key = productByName[title.textContent.trim()];
    const asset = media[key];
    if (asset && !visual.classList.contains('kv-has-photo')) {
      visual.classList.add('kv-has-photo');
      visual.replaceChildren(createProductImage(asset, title.textContent.trim(), 'kv-result-photo'));
    }
    normalizeResultDetails(card);
    ensureResultProductName(card, title);
    renderNextBestAction(card, key);
    orderResult();
  }

  setupStaticBrand();
  setupAccessibility();
  enhanceResult();

  const advisorBody = document.querySelector('#advisorBody');
  if (advisorBody) {
    const observer = new MutationObserver(() => enhanceResult());
    observer.observe(advisorBody, { childList: true, subtree: true });
  }

  document.addEventListener('click', (event) => {
    const option = event.target.closest('.option');
    if (!option) return;
    const stepName = document.querySelector('#stepName')?.textContent?.trim();
    const stepKey = { Použitie: 'use', Chuť: 'profile', Nápoj: 'drink', Sila: 'taste' }[stepName];
    if (stepKey) answers[stepKey] = option.dataset.value;
    queueMicrotask(enhanceResult);
  }, true);

  document.querySelector('#resetAll')?.addEventListener('click', () => {
    Object.keys(answers).forEach((key) => delete answers[key]);
  });
})();
