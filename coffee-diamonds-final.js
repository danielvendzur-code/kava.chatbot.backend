(() => {
  'use strict';

  const app = window.DIAMONDS_APP;
  if (!app || window.__COFFEE_DEMO_SLUG__ !== 'diamonds') return;

  function setOwnerPage() {
    const headerBrand = document.querySelector('.brand-link');
    if (headerBrand) {
      headerBrand.href = 'https://diroastery.sk/';
      headerBrand.classList.add('diamonds-company-brand');
      headerBrand.innerHTML = '<img src="/assets/diamonds/diroastery-logo.svg" alt="Diamonds Roastery">';
    }

    const badge = document.querySelector('.owner-context');
    if (badge) {
      const ownerLink = document.createElement('a');
      ownerLink.className = 'owner-context diamonds-owner-badge';
      ownerLink.href = 'https://mojchatbot.sk';
      ownerLink.target = '_blank';
      ownerLink.rel = 'noreferrer';
      ownerLink.innerHTML = 'mojchatbot.sk <span aria-hidden="true">↗</span>';
      badge.replaceWith(ownerLink);
    }

    const copy = document.querySelector('.owner-copy');
    const heading = copy?.querySelector('h1');
    const intro = copy?.querySelector(':scope > p');
    if (copy && !copy.querySelector('.diamonds-eyebrow')) {
      copy.insertAdjacentHTML('afterbegin', '<span class="diamonds-eyebrow">Kávový poradca Diamonds Roastery</span>');
    }
    if (heading) heading.textContent = 'Výberová káva bez zložitého vyberania.';
    if (intro) intro.textContent = 'Zákazník odpovie na štyri otázky o chuti a príprave. Poradca odporučí konkrétnu kávu, balenie aj doplnok a pripraví výber do košíka.';

    const primary = document.querySelector('#heroOpen');
    if (primary) primary.innerHTML = 'Vyskúšať poradcu <span aria-hidden="true">→</span>';
    document.querySelector('.hero-actions .button-secondary')?.remove();

    const benefits = [
      ['Odpovie 24/7', 'Pomôže aj mimo otváracích hodín.'],
      ['Vyberie kávu', 'Štyri otázky podľa chuti a prípravy.'],
      ['Zvýši objednávku', 'Ponúkne balenie alebo ochutnávku.']
    ];
    document.querySelectorAll('.owner-benefits li').forEach((item, index) => {
      const copyItem = benefits[index];
      if (!copyItem) return;
      const title = item.querySelector('b');
      const text = item.querySelector('small');
      if (title) title.textContent = copyItem[0];
      if (text) text.textContent = copyItem[1];
    });
    document.querySelector('.advisor-flow')?.remove();
    document.querySelector('.owner-strip')?.remove();

    const main = document.querySelector('.diamonds-page');
    if (main && !main.querySelector('.diamonds-final-footer')) {
      main.insertAdjacentHTML('beforeend', '<footer class="diamonds-final-footer"><span>Výber kávy za štyri otázky</span><a href="https://mojchatbot.sk" target="_blank" rel="noreferrer">mojchatbot.sk ↗</a></footer>');
    }
  }

  function setWidgetCopy() {
    const title = document.querySelector('#widgetTitle');
    const description = document.querySelector('#widgetDescription');
    // The lockup beside it already says DIAMONDS ROASTERY, so the title no
    // longer repeats the brand and the subtitle no longer repeats the title.
    if (title) title.textContent = 'Kávový poradca';
    if (description) description.textContent = 'Vyberie kávu za 4 otázky';

    const entryTitle = document.querySelector('#openAdvisor b');
    const entryDetail = document.querySelector('#openAdvisor em');
    if (entryTitle) entryTitle.textContent = 'Nájsť svoju kávu';
    if (entryDetail) entryDetail.textContent = '4 otázky · konkrétna káva';

    const teaser = document.querySelector('#teaser');
    const teaserTitle = teaser?.querySelector('strong');
    const teaserText = teaser?.querySelector('span');
    if (teaserTitle) teaserTitle.textContent = 'Nájdite svoju kávu';
    if (teaserText) teaserText.textContent = '4 otázky · jedno odporúčanie';

    const chips = ['Káva na filter', 'Nie veľmi kyslú', 'Odkiaľ je káva?', 'Porovnajte dve kávy'];
    document.querySelectorAll('#quickChips button').forEach((button, index) => {
      if (!chips[index]) return;
      button.textContent = chips[index];
      button.dataset.prompt = chips[index];
    });
  }

  /**
   * Same correction as Víťazov: the pack picker, the tasting-pack upsell and the
   * "Pridať do košíka" button never reached a basket. The recommendation closes
   * with the real product link instead.
   */
  function enhanceResult() {
    const view = document.querySelector('#advisorContent .result-view');
    if (!view || view.dataset.diamondsFinal === 'true') return;
    const cta = view.querySelector('.result-cta');
    if (!cta) return;
    view.dataset.diamondsFinal = 'true';
    cta.textContent = 'Pozrieť produkt v e-shope ';
    cta.insertAdjacentHTML('beforeend', '<span aria-hidden="true">\u2197</span>');
    view.querySelector('.next-best-action')?.remove();
  }

  setOwnerPage();
  setWidgetCopy();
  enhanceResult();

  const advisor = document.querySelector('#advisorContent');
  if (advisor) new MutationObserver(enhanceResult).observe(advisor, { childList:true, subtree:true });
})();
