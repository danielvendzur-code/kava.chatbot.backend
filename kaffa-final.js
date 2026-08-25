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
    setText(storyFoot, '4 otázky · jedno odporúčanie');

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
    setText(teaserText, '4 otázky · jedno odporúčanie');

    const entryTitle = document.querySelector('.kf-advisor-entry__copy b');
    setText(entryTitle, 'Nájsť svoju kávu');

    document.querySelectorAll('.kf-bot-avatar,.kf-advisor-entry__mark').forEach((avatar) => {
      if (!avatar.querySelector('svg')) avatar.innerHTML = bubble;
    });

    const chipLabels = ['Espresso do automatu', 'Káva do mlieka', 'Odkiaľ je káva?', 'Porovnajte dve kávy'];
    document.querySelectorAll('.kf-chip').forEach((chip, index) => {
      if (chipLabels[index]) setText(chip, chipLabels[index]);
    });
  }

  /**
   * Kaffa closed on a simulated basket too — pack buttons, a tote-bag upsell and
   * an add-to-cart that only changed its own label. The result keeps the real
   * product link as its single closing action.
   */
  function enhanceResult() {
    const result = document.querySelector('.kf-result');
    if (!result || result.dataset.kfFinal === 'true') return;
    const cta = result.querySelector('.kf-result-cta');
    if (!cta) return;
    result.dataset.kfFinal = 'true';
    cta.textContent = 'Pozrieť produkt v e-shope ';
    cta.insertAdjacentHTML('beforeend', '<span aria-hidden="true">\u2197</span>');
    result.querySelector('.kf-result-choice')?.remove();
    result.querySelector('.kf-result-next')?.remove();
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
