(() => {
  'use strict';

  if (!window.__KAFFA_EDITORIAL__) return;

  const bubble = '<svg viewBox="0 0 28 28" aria-hidden="true"><path d="M5.2 5.8h17.6v11.1H13l-5.1 4v-4H5.2z" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linejoin="round"/><circle cx="10" cy="11.35" r="1.05" fill="currentColor"/><circle cx="14" cy="11.35" r="1.05" fill="currentColor"/><circle cx="18" cy="11.35" r="1.05" fill="currentColor"/></svg>';
  const setText = (node, value) => { if (node && node.textContent !== value) node.textContent = value; };

  function setOwnerPage() {
    const head = document.querySelector('.kf-head');
    if (head && !head.querySelector('.kf-company-brand')) {
      head.innerHTML = `
        <a class="kf-company-brand" href="https://kaffaroastery.sk/" target="_blank" rel="noreferrer">
          <span class="kf-company-mark">${bubble}</span>
          <span><b>Kaffa Roastery</b><small>Výberová káva</small></span>
        </a>
        <a class="kf-owner-badge" href="https://mojchatbot.sk" target="_blank" rel="noreferrer">mojchatbot.sk <span aria-hidden="true">↗</span></a>`;
    }

    const copy = document.querySelector('.kf-copy');
    if (copy && !copy.querySelector('.kf-final-eyebrow')) {
      copy.insertAdjacentHTML('afterbegin', '<span class="kf-final-eyebrow">Kávový poradca Kaffa Roastery</span>');
    }
    const heading = copy?.querySelector('h1');
    const lead = copy?.querySelector('.kf-lead');
    setText(heading, 'Káva vybraná za minútu.');
    setText(lead, 'Zákazník odpovie na štyri otázky o príprave a chuti. Poradca odporučí konkrétnu kávu, veľkosť balenia aj užitočný doplnok a pripraví výber do košíka.');

    const benefitCopy = [
      ['Odpovie 24/7', 'Pomôže aj mimo otváracích hodín.'],
      ['Vyberie kávu', 'Štyri otázky podľa chuti a prípravy.'],
      ['Zvýši objednávku', 'Ponúkne balenie alebo vhodný doplnok.']
    ];
    document.querySelectorAll('.kf-benefit').forEach((item, index) => {
      const value = benefitCopy[index];
      if (!value) return;
      const title = item.querySelector('b');
      const text = item.querySelector('p');
      setText(title, value[0]);
      setText(text, value[1]);
    });

    const primary = document.querySelector('#openAdvisor');
    if (primary && !primary.textContent.includes('Vyskúšať poradcu')) {
      primary.innerHTML = 'Vyskúšať poradcu <span aria-hidden="true">→</span>';
      primary.dataset.kfFinalLabel = 'true';
    }

    const storyKicker = document.querySelector('.kf-story-kicker');
    const storyDescription = document.querySelector('.kf-story-copy p');
    const storyFoot = document.querySelector('.kf-story-foot > span');
    setText(storyKicker, 'Odporúčanie z reálnej ponuky');
    setText(storyDescription, 'Sladšie espresso s chuťou kakaa, mandlí a orechov.');
    setText(storyFoot, '4 otázky · konkrétny výsledok');

    const footer = document.querySelector('.kf-foot');
    if (footer && !footer.classList.contains('kf-final-footer')) {
      footer.classList.add('kf-final-footer');
      footer.innerHTML = '<span>Interaktívny návrh pre Kaffa Roastery</span><a href="https://mojchatbot.sk" target="_blank" rel="noreferrer">mojchatbot.sk ↗</a>';
    }
  }

  function setWidgetCopy() {
    const brand = document.querySelector('.kf-widget-brand');
    if (brand && !brand.querySelector('.kf-widget-bubble')) {
      brand.innerHTML = `<span class="kf-widget-bubble">${bubble}</span><span class="kf-widget-title"><strong>Kaffa poradca</strong></span>`;
    }

    const launcher = document.querySelector('#launcher');
    if (launcher && !launcher.querySelector('svg')) launcher.innerHTML = bubble;

    const teaser = document.querySelector('#teaser');
    const teaserTitle = teaser?.querySelector('b');
    const teaserText = teaser?.querySelector('span');
    setText(teaserTitle, 'Nájdite svoju kávu');
    setText(teaserText, '4 otázky · konkrétny výsledok');

    const entryTitle = document.querySelector('.kf-advisor-entry__copy b');
    setText(entryTitle, 'Nájsť svoju kávu');

    document.querySelectorAll('.kf-bot-avatar,.kf-advisor-entry__mark').forEach((avatar) => {
      if (!avatar.querySelector('svg')) avatar.innerHTML = bubble;
    });

    const chipLabels = ['Do automatu', 'Na filter', 'Čokoládová', 'Ovocná'];
    document.querySelectorAll('.kf-chip').forEach((chip, index) => {
      if (chipLabels[index]) setText(chip, chipLabels[index]);
    });
  }

  function commerceMarkup(productName, href, packs) {
    return `
      <section class="kf-final-commerce" aria-label="Balenie a košík">
        <div class="kf-final-packs">
          <span><small>Balenie</small><b>Vyberte veľkosť</b></span>
          <div>${packs.map((pack, index) => `<button class="${index === 0 ? 'is-selected' : ''}" type="button" data-pack="${pack}" aria-pressed="${index === 0}">${pack}</button>`).join('')}</div>
        </div>
        <button class="kf-final-upsell" type="button" aria-pressed="false">
          <span class="kf-final-upsell__art"><img src="/assets/kaffa/vak-official.webp" alt=""></span>
          <span class="kf-final-upsell__copy"><small>Pridať navyše</small><b>ONLY GOOD KAFFA vak</b><span>Bio bavlna · 13,00 €</span></span>
          <i aria-hidden="true">+</i>
        </button>
        <div class="kf-final-actions">
          <button class="kf-final-add" type="button"><span>Pridať do košíka</span><b aria-hidden="true">→</b></button>
          <a href="${href}" target="_blank" rel="noreferrer">Otvoriť produkt ↗</a>
        </div>
        <div class="kf-final-cart" hidden><span>${productName} · ${packs[0]}</span><b>Pridané</b></div>
      </section>`;
  }

  function enhanceResult() {
    const result = document.querySelector('.kf-result');
    if (!result || result.dataset.kfFinal === 'true') return;

    const title = result.querySelector('.kf-result-hero__copy h2');
    const oldLink = result.querySelector('.kf-result-cta');
    const oldChoice = result.querySelector('.kf-result-choice');
    const productName = title?.textContent?.trim() || 'Vybraná káva';
    const href = oldLink?.href || 'https://kaffaroastery.sk';
    const packs = [...(oldChoice?.querySelector('select')?.options || [])].map((option) => option.textContent.trim()).filter(Boolean);
    if (!packs.length) packs.push('250 g');

    result.dataset.kfFinal = 'true';
    oldLink?.remove();
    oldChoice?.remove();
    result.querySelector('.kf-result-next')?.remove();
    result.querySelector('.kf-result-hero')?.insertAdjacentHTML('afterend', commerceMarkup(productName, href, packs));

    const packButtons = [...result.querySelectorAll('.kf-final-packs button')];
    const upsell = result.querySelector('.kf-final-upsell');
    const add = result.querySelector('.kf-final-add');
    const cart = result.querySelector('.kf-final-cart');
    let pack = packs[0];

    packButtons.forEach((button) => button.addEventListener('click', () => {
      pack = button.dataset.pack;
      packButtons.forEach((candidate) => {
        const selected = candidate === button;
        candidate.classList.toggle('is-selected', selected);
        candidate.setAttribute('aria-pressed', String(selected));
      });
      cart.hidden = true;
      add.classList.remove('is-added');
      add.querySelector('span').textContent = 'Pridať do košíka';
    }));

    upsell?.addEventListener('click', () => {
      const selected = upsell.getAttribute('aria-pressed') !== 'true';
      upsell.setAttribute('aria-pressed', String(selected));
      upsell.classList.toggle('is-selected', selected);
      upsell.querySelector('i').textContent = selected ? '✓' : '+';
      cart.hidden = true;
      add.classList.remove('is-added');
      add.querySelector('span').textContent = 'Pridať do košíka';
    });

    add?.addEventListener('click', () => {
      const extra = upsell?.getAttribute('aria-pressed') === 'true';
      cart.querySelector('span').textContent = `${productName} · ${pack}${extra ? ' + KAFFA vak' : ''}`;
      cart.hidden = false;
      add.classList.add('is-added');
      add.querySelector('span').textContent = 'Pridané do košíka';
    });
  }

  function enhance() {
    setOwnerPage();
    setWidgetCopy();
    enhanceResult();
  }

  enhance();
  let queued = false;
  new MutationObserver(() => {
    if (queued) return;
    queued = true;
    queueMicrotask(() => { queued = false; enhance(); });
  }).observe(document.querySelector('#coffee-demo-root') || document.body, { childList:true, subtree:true });
  setTimeout(enhance, 0);
  setTimeout(enhance, 120);
})();
