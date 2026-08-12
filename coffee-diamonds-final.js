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
    if (title) title.textContent = 'Diamonds poradca';
    if (description) description.textContent = 'Kávový poradca';

    const entryTitle = document.querySelector('#openAdvisor b');
    const entryDetail = document.querySelector('#openAdvisor em');
    if (entryTitle) entryTitle.textContent = 'Nájsť svoju kávu';
    if (entryDetail) entryDetail.textContent = '4 otázky · konkrétna káva';

    const teaser = document.querySelector('#teaser');
    const teaserTitle = teaser?.querySelector('strong');
    const teaserText = teaser?.querySelector('span');
    if (teaserTitle) teaserTitle.textContent = 'Nájdite svoju kávu';
    if (teaserText) teaserText.textContent = '4 otázky · konkrétny výsledok';

    const chips = ['Do automatu', 'Na filter', 'Čokoládová', 'Bez kofeínu'];
    document.querySelectorAll('#quickChips button').forEach((button, index) => {
      if (!chips[index]) return;
      button.textContent = chips[index];
      button.dataset.prompt = chips[index];
    });
  }

  function addTimestamps() {
    const now = new Intl.DateTimeFormat('sk-SK', { hour:'2-digit', minute:'2-digit' }).format(new Date());
    document.querySelectorAll('.chat-line').forEach((line) => {
      if (line.querySelector('.diamonds-time')) return;
      const stamp = document.createElement('small');
      stamp.className = 'diamonds-time';
      stamp.textContent = now;
      line.append(stamp);
    });
  }

  function commerceMarkup(productName, href) {
    return `
      <section class="diamonds-commerce" aria-label="Balenie a košík">
        <div class="diamonds-packs">
          <span><small>Balenie</small><b>Vyberte veľkosť</b></span>
          <div>
            <button class="is-selected" type="button" data-pack="250 g" aria-pressed="true">250 g</button>
            <button type="button" data-pack="500 g" aria-pressed="false">500 g</button>
            <button type="button" data-pack="1 kg" aria-pressed="false">1 kg</button>
          </div>
        </div>
        <button class="diamonds-upsell" type="button" aria-pressed="false">
          <span class="diamonds-upsell__photos"><img src="/assets/diamonds/brazil-fazenda-official.jpg" alt=""><img src="/assets/diamonds/kenya-mugaya-official.jpg" alt=""></span>
          <span class="diamonds-upsell__copy"><small>Pridať navyše</small><b>Tasting Pack 4 × 60 g</b><span>Ochutnávka · 17,90 €</span></span>
          <i aria-hidden="true">+</i>
        </button>
        <div class="diamonds-commerce__actions">
          <button class="diamonds-add" type="button"><span>Pridať do košíka</span><b aria-hidden="true">→</b></button>
          <a href="${href}" target="_blank" rel="noreferrer">Otvoriť produkt ↗</a>
        </div>
        <div class="diamonds-cart" hidden><span>${productName} · 250 g</span><b>Pridané</b></div>
      </section>`;
  }

  function enhanceResult() {
    const view = document.querySelector('#advisorContent .result-view');
    if (!view || view.dataset.diamondsFinal === 'true') return;
    const title = view.querySelector('.result-copy h2');
    const oldLink = view.querySelector('.result-cta');
    const productName = title?.textContent?.trim() || 'Vybraná káva';
    const href = oldLink?.href || 'https://diroastery.sk/kategoria-produktu/kava/';
    const editorial = view.querySelector('.result-editorial');
    if (!editorial) return;

    view.dataset.diamondsFinal = 'true';
    oldLink?.remove();
    editorial.insertAdjacentHTML('afterend', commerceMarkup(productName, href));
    view.querySelector('.next-best-action')?.remove();

    const packs = [...view.querySelectorAll('.diamonds-packs button')];
    const upsell = view.querySelector('.diamonds-upsell');
    const add = view.querySelector('.diamonds-add');
    const cart = view.querySelector('.diamonds-cart');
    let pack = '250 g';

    packs.forEach((button) => button.addEventListener('click', () => {
      pack = button.dataset.pack;
      packs.forEach((item) => {
        const selected = item === button;
        item.classList.toggle('is-selected', selected);
        item.setAttribute('aria-pressed', String(selected));
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
      const withPack = upsell?.getAttribute('aria-pressed') === 'true';
      cart.querySelector('span').textContent = `${productName} · ${pack}${withPack ? ' + Tasting Pack' : ''}`;
      cart.hidden = false;
      add.classList.add('is-added');
      add.querySelector('span').textContent = 'Pridané do košíka';
    });
  }

  setOwnerPage();
  setWidgetCopy();
  addTimestamps();
  enhanceResult();

  const chat = document.querySelector('#chatMessages');
  if (chat) new MutationObserver(addTimestamps).observe(chat, { childList:true, subtree:true });
  const advisor = document.querySelector('#advisorContent');
  if (advisor) new MutationObserver(enhanceResult).observe(advisor, { childList:true, subtree:true });
})();
