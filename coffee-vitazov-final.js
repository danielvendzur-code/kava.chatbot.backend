(() => {
  'use strict';

  if (document.body.dataset.demo !== 'vitazov') return;
  const officialLogo = '/assets/vitazov-logo.svg';

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
        <a class="kv-company-brand" href="https://kavavitazov.sk/" target="_blank" rel="noreferrer"><img class="kv-official-logo" src="${officialLogo}" alt="Káva Víťazov"></a>`;
    }

    const badge = document.querySelector('.demo-tag');
    if (badge) {
      badge.href = 'https://mojchatbot.sk';
      badge.innerHTML = '<span>Ukážka riešenia</span><b>mojchatbot.sk</b><i>↗</i>';
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
      widgetBrand.innerHTML = `<img class="kv-widget-logo" src="${officialLogo}" alt="Káva Víťazov">`;
    }

    const launcher = document.querySelector('#openWidget');
    if (launcher) launcher.innerHTML = `<span class="kv-launcher-logo"><img src="${officialLogo}" alt=""></span><span class="launcher__status" aria-hidden="true"></span>`;

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
      if (mark) mark.innerHTML = `<img class="kv-entry-logo" src="${officialLogo}" alt="">`;
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
      avatar.innerHTML = `<img class="kv-message-logo" src="${officialLogo}" alt="">`;
    });
  }

  /**
   * The result used to end in a simulated shop: pack sizes, a gift-box upsell
   * and an "Pridať do košíka" button that only relabelled itself. None of it
   * reached a real basket, which made the closing step read as a demo of a
   * feature rather than a way to buy. The recommendation now ends the way
   * Jolka's does — one link to the actual product page.
   */
  function enhanceResult() {
    const card = document.querySelector('#advisorBody .result-card');
    if (!card || card.dataset.kvFinalCta === 'true') return;
    const actions = card.querySelector('.result-actions');
    if (!actions) return;
    card.dataset.kvFinalCta = 'true';

    const link = actions.querySelector('a[href]');
    const href = link?.href || 'https://kavavitazov.sk/obchod/';
    actions.innerHTML = `<a class="kv-final-cta" href="${href}" target="_blank" rel="noreferrer">Pozrieť produkt v e-shope <span aria-hidden="true">\u2197</span></a>`;
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
