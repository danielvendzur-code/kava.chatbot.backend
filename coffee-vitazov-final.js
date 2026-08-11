(() => {
  'use strict';

  if (document.body.dataset.demo !== 'vitazov') return;

  const bubbleMark = (className = '') => `
    <span class="kv-chat-mark ${className}" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M5.1 17.4 3.8 21l4.2-1.7c1.2.5 2.5.8 4 .8 5 0 9-3.7 9-8.3s-4-8.3-9-8.3-9 3.7-9 8.3c0 2.1.8 4.1 2.1 5.6Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
        <path d="M8.2 11.8h.1m3.6 0h.1m3.6 0h.1" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
      </svg>
    </span>`;

  function setOwnerPage() {
    const brand = document.querySelector('.demo-brand');
    if (brand) {
      brand.innerHTML = `
        <a class="kv-solution-brand" href="https://mojchatbot.sk" target="_blank" rel="noreferrer">
          <span>Ukážka riešenia</span><strong>mojchatbot.sk</strong><i>↗</i>
        </a>`;
    }

    const badge = document.querySelector('.demo-tag');
    if (badge) {
      badge.href = 'https://mojchatbot.sk';
      badge.innerHTML = 'Návrh pre Kávu Víťazov';
    }

    const copy = document.querySelector('.demo-copy');
    const eyebrow = copy?.querySelector('.owner-note');
    const heading = copy?.querySelector('h1');
    const intro = copy?.querySelector(':scope > p');
    if (eyebrow) eyebrow.textContent = 'Návrh AI chatbota pre Kávu Víťazov';
    if (heading) heading.textContent = 'Káva domov aj do firmy. Vybraná za minútu.';
    if (intro) intro.textContent = 'Zákazník odpovie na štyri krátke otázky. Poradca odporučí konkrétnu kávu, ukáže balenie aj doplnok a pripraví výber do košíka.';

    const benefitCopy = [
      ['Odpovie 24/7', 'Pomôže aj mimo otváracích hodín.'],
      ['Vyberie konkrétnu kávu', 'Podľa chuti, prípravy a použitia.'],
      ['Zvýši objednávku', 'Ponúkne väčšie balenie alebo degustáciu.']
    ];
    document.querySelectorAll('.demo-benefit').forEach((card, index) => {
      const item = benefitCopy[index];
      if (!item) return;
      const title = card.querySelector('b');
      const text = card.querySelector('small');
      if (title) title.textContent = item[0];
      if (text) text.textContent = item[1];
    });

    const heroButton = document.querySelector('#heroOpen');
    if (heroButton) heroButton.innerHTML = 'Vyskúšať poradcu <span aria-hidden="true">→</span>';

    const previewTop = document.querySelector('.preview-panel__top small');
    const previewCopy = document.querySelector('.preview-product__copy > span');
    const previewReason = document.querySelector('.preview-reason b');
    const previewCta = document.querySelector('.preview-cta');
    if (previewTop) previewTop.textContent = 'Ukážka výsledku';
    if (previewCopy) previewCopy.textContent = 'Odporúčanie pre zákazníka';
    if (previewReason) previewReason.textContent = 'Prečo práve táto káva';
    if (previewCta) {
      previewCta.innerHTML = 'Otvoriť výber <span aria-hidden="true">→</span>';
      previewCta.setAttribute('role', 'button');
      previewCta.setAttribute('tabindex', '0');
      previewCta.addEventListener('click', () => heroButton?.click());
      previewCta.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          heroButton?.click();
        }
      });
    }

    const footer = document.querySelector('.demo-footer');
    if (footer) footer.innerHTML = '<span>Interaktívny návrh pre Kávu Víťazov</span><a href="https://mojchatbot.sk" target="_blank" rel="noreferrer">mojchatbot.sk ↗</a>';
  }

  function setWidgetBrand() {
    const widgetBrand = document.querySelector('.widget-brand');
    if (widgetBrand) {
      widgetBrand.innerHTML = `${bubbleMark()}<span class="kv-final-brand-copy"><strong>Kávový poradca</strong><small>Káva Víťazov</small></span>`;
    }

    const launcher = document.querySelector('#openWidget');
    if (launcher) launcher.innerHTML = `${bubbleMark('kv-chat-mark--launcher')}<span class="launcher__status" aria-hidden="true"></span>`;

    const teaser = document.querySelector('#launcherTeaser');
    if (teaser) {
      const title = teaser.querySelector('b');
      const text = teaser.querySelector('span');
      if (title) title.textContent = 'Nájdite svoju kávu';
      if (text) text.textContent = '4 otázky · konkrétny výsledok';
    }

    const advisorEntry = document.querySelector('#openAdvisor');
    if (advisorEntry) {
      const mark = advisorEntry.querySelector(':scope > span:first-child');
      const title = advisorEntry.querySelector('b');
      if (mark) mark.innerHTML = bubbleMark();
      if (title) title.textContent = 'Nájsť svoju kávu';
    }

    const labels = document.querySelectorAll('.mode__button b');
    if (labels[0]) labels[0].textContent = 'Chat';
    if (labels[1]) labels[1].textContent = 'Výber kávy';

    const chipLabels = ['Do automatu', 'Čokoládová', 'Do mlieka', 'Bez kofeínu'];
    document.querySelectorAll('#quickChips .chip span').forEach((label, index) => {
      if (chipLabels[index]) label.textContent = chipLabels[index];
    });
  }

  function decorateMessages() {
    document.querySelectorAll('.message__avatar').forEach((avatar) => {
      if (avatar.dataset.kvFinalAvatar === 'true') return;
      avatar.dataset.kvFinalAvatar = 'true';
      avatar.innerHTML = bubbleMark('kv-chat-mark--message');
    });
  }

  function commerceMarkup(productName, productUrl) {
    return {
      packs: `
        <div class="kv-final-packs" aria-label="Veľkosť balenia">
          <span><small>Balenie</small><b>Vyberte veľkosť</b></span>
          <div>
            <button class="is-selected" type="button" data-pack="250 g" aria-pressed="true">250 g</button>
            <button type="button" data-pack="500 g" aria-pressed="false">500 g</button>
            <button type="button" data-pack="1 kg" aria-pressed="false">1 kg</button>
          </div>
        </div>`,
      upsell: `
        <button class="kv-final-upsell" type="button" aria-pressed="false">
          <span class="kv-final-upsell__photos"><img src="/assets/vitazov-victory.jpeg" alt=""><img src="/assets/vitazov-ethiopia.jpeg" alt=""></span>
          <span class="kv-final-upsell__copy"><small>Pridať navyše</small><b>Darčekové balenie</b><span>4 kávy · 24,90 €</span></span>
          <i aria-hidden="true">+</i>
        </button>`,
      actions: `
        <div class="kv-final-actions">
          <button class="kv-final-add" type="button"><span>Pridať do košíka</span><b aria-hidden="true">→</b></button>
          <a href="${productUrl}" target="_blank" rel="noreferrer">Otvoriť produkt ↗</a>
        </div>
        <div class="kv-final-cart" hidden><span>${productName} · 250 g</span><b>Pridané</b></div>`
    };
  }

  function enhanceResult() {
    const card = document.querySelector('#advisorBody .result-card');
    if (!card || card.dataset.kvFinalCommerce === 'true') return;
    const heading = document.querySelector('#advisorBody .result-head h2');
    const productName = heading?.textContent?.trim() || 'Vybraná káva';
    const oldActions = card.querySelector('.result-actions');
    const productLink = oldActions?.querySelector('a')?.href || 'https://kavavitazov.sk/obchod/';
    if (!oldActions) return;

    card.dataset.kvFinalCommerce = 'true';
    const markup = commerceMarkup(productName, productLink);
    oldActions.insertAdjacentHTML('beforebegin', markup.packs + markup.upsell);
    oldActions.insertAdjacentHTML('afterend', markup.actions);
    oldActions.remove();

    const packs = [...card.querySelectorAll('.kv-final-packs button')];
    const upsell = card.querySelector('.kv-final-upsell');
    const addButton = card.querySelector('.kv-final-add');
    const cart = card.querySelector('.kv-final-cart');
    let selectedPack = '250 g';

    packs.forEach((button) => button.addEventListener('click', () => {
      selectedPack = button.dataset.pack;
      packs.forEach((item) => {
        const selected = item === button;
        item.classList.toggle('is-selected', selected);
        item.setAttribute('aria-pressed', String(selected));
      });
      cart.hidden = true;
      addButton.classList.remove('is-added');
      addButton.querySelector('span').textContent = 'Pridať do košíka';
    }));

    upsell?.addEventListener('click', () => {
      const selected = upsell.getAttribute('aria-pressed') !== 'true';
      upsell.setAttribute('aria-pressed', String(selected));
      upsell.classList.toggle('is-selected', selected);
      upsell.querySelector('i').textContent = selected ? '✓' : '+';
      cart.hidden = true;
      addButton.classList.remove('is-added');
      addButton.querySelector('span').textContent = 'Pridať do košíka';
    });

    addButton?.addEventListener('click', () => {
      const withGift = upsell?.getAttribute('aria-pressed') === 'true';
      cart.querySelector('span').textContent = `${productName} · ${selectedPack}${withGift ? ' + darčekové balenie' : ''}`;
      cart.hidden = false;
      addButton.classList.add('is-added');
      addButton.querySelector('span').textContent = 'Pridané do košíka';
    });
  }

  setOwnerPage();
  setWidgetBrand();
  decorateMessages();
  enhanceResult();

  const chat = document.querySelector('#chatMessages');
  if (chat) new MutationObserver(decorateMessages).observe(chat, { childList: true, subtree: true });
  const advisor = document.querySelector('#advisorBody');
  if (advisor) new MutationObserver(enhanceResult).observe(advisor, { childList: true, subtree: true });
})();
