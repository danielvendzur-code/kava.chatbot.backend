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
    const brand = document.querySelector('.demo-brand');
    if (brand && !brand.querySelector('.kv-official-logo')) {
      const logo = document.createElement('img');
      logo.className = 'kv-official-logo';
      logo.src = 'https://kavavitazov.sk/wp-content/uploads/2023/06/text-logo-tmave.svg';
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
      footerLink.href = 'https://mojchatbot.sk';
      footerLink.textContent = 'mojchatbot.sk';
    }

    document.querySelector('.advisor-entry')?.remove();
    document.querySelector('.support-row')?.remove();

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

    const chatScreen = document.querySelector('#chatScreen');
    if (chatScreen && !chatScreen.querySelector('.widget-credit')) {
      const credit = document.createElement('div');
      credit.className = 'widget-credit';
      credit.innerHTML = '<span>Ukážka zákazníckeho poradcu</span><a href="https://mojchatbot.sk" target="_blank" rel="noreferrer">mojchatbot.sk</a>';
      chatScreen.appendChild(credit);
    }
  }

  function orderResult() {
    const card = document.querySelector('.result-card');
    if (!card || card.dataset.kvOrdered === 'true') return;
    card.dataset.kvOrdered = 'true';
    card.style.display = 'flex';
    card.style.flexDirection = 'column';
    const order = [
      ['.result-main', 1],
      ['.reason', 2],
      ['.result-details', 3],
      ['.result-actions', 4],
      ['.alternative', 5],
      ['.office-followup', 6]
    ];
    order.forEach(([selector, value]) => {
      const element = card.querySelector(selector);
      if (element) element.style.order = String(value);
    });
  }

  function enhanceResult() {
    orderResult();
    const title = document.querySelector('.result-head h2');
    const visual = document.querySelector('.product-visual');
    if (!title || !visual || visual.classList.contains('kv-has-photo')) return;
    const key = productByName[title.textContent.trim()];
    const asset = media[key];
    if (!asset) return;
    visual.classList.add('kv-has-photo');
    visual.replaceChildren(createProductImage(asset, title.textContent.trim(), 'kv-result-photo'));
  }

  setupStaticBrand();
  enhanceResult();

  const advisorBody = document.querySelector('#advisorBody');
  if (advisorBody) {
    const observer = new MutationObserver(() => enhanceResult());
    observer.observe(advisorBody, { childList: true, subtree: true });
  }
})();
