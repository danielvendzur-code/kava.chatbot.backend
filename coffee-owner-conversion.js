(() => {
  'use strict';

  const slug = String(
    window.__COFFEE_DEMO_SLUG__ ||
    window.COFFEE_DEMO_SLUG ||
    document.body.dataset.demo ||
    (location.pathname.includes('jolka') ? 'jolka' : '')
  ).replace('-v13', '');

  if (!['praziarnicka', 'diamonds', 'kaffa', 'vitazov', 'concept', 'jolka'].includes(slug)) return;

  const style = document.createElement('link');
  style.rel = 'stylesheet';
  style.href = '/coffee-owner-conversion.css';
  style.dataset.ownerConversionStyle = 'true';
  document.head.appendChild(style);

  const icon = (d) => `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="${d}" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  const icons = {
    arrow: icon('M5 12h13m-5-6 6 6-6 6'),
    chat: icon('M5 5h14v10H9l-4 4V5Z'),
    picker: icon('M5 7h11v7a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5V7Zm11 2h2a2 2 0 0 1 0 4h-2'),
    check: icon('m5 12 4 4L19 6')
  };

  const launchers = {
    praziarnicka: '#pz13-open',
    diamonds: '#launcherButton',
    kaffa: '#launcher',
    vitazov: '#openWidget',
    concept: '#openWidget',
    jolka: '#open'
  };

  const advisorButtons = {
    praziarnicka: '.pz13-mode button[data-mode="advisor"]',
    diamonds: '.mode-switch button[data-mode="advisor"]',
    kaffa: '.kf-switch button[data-view="advisor"],.kf-switch button[data-mode="advisor"]',
    vitazov: '.mode__button[data-mode="advisor"],.mode-switch button[data-mode="advisor"]',
    concept: '.mode__button[data-mode="advisor"],.mode-switch button[data-mode="advisor"]',
    jolka: '.mode__button[data-mode="advisor"]'
  };

  const chatButtons = {
    praziarnicka: '.pz13-mode button[data-mode="chat"]',
    diamonds: '.mode-switch button[data-mode="chat"]',
    kaffa: '.kf-switch button[data-view="chat"],.kf-switch button[data-mode="chat"]',
    vitazov: '.mode__button[data-mode="chat"],.mode-switch button[data-mode="chat"]',
    concept: '.mode__button[data-mode="chat"],.mode-switch button[data-mode="chat"]',
    jolka: '.mode__button[data-mode="chat"]'
  };

  function openMode(mode) {
    const launcher = document.querySelector(launchers[slug]);
    if (launcher && launcher.offsetParent !== null) launcher.click();
    requestAnimationFrame(() => requestAnimationFrame(() => {
      const selector = mode === 'advisor' ? advisorButtons[slug] : chatButtons[slug];
      document.querySelector(selector)?.click();
    }));
  }

  function markup(lockup) {
    return `
      <header class="mc-owner-head">
        <div class="mc-owner-lockup">${lockup}</div>
        <a class="mc-owner-head-cta" href="https://mojchatbot.sk/kontakt" target="_blank" rel="noreferrer">Chcem to na svoj web ${icons.arrow}</a>
      </header>

      <section class="mc-owner-hero">
        <div class="mc-owner-copy">
          <h1>Pomôžte zákazníkovi<br><span>vybrať správnu kávu.</span></h1>
          <p>Chat odpovie na otázky a Výber kávy ho pár kliknutiami dovedie ku konkrétnemu produktu.</p>

          <div class="mc-owner-actions">
            <button type="button" data-release-open="advisor">Vyskúšať Výber kávy ${icons.arrow}</button>
            <button class="is-secondary" type="button" data-release-open="chat">Skúsiť Chat ${icons.chat}</button>
          </div>
        </div>

        <div class="mc-owner-demo" aria-label="Ako riešenie pomáha zákazníkovi">
          <div class="mc-owner-demo-head"><b>Dve jednoduché cesty k výberu.</b></div>

          <article class="mc-owner-demo-card">
            <span class="mc-owner-demo-icon">${icons.chat}</span>
            <div><small>CHAT</small><b>Zákazník sa opýta a dostane odpoveď.</b></div>
          </article>

          <article class="mc-owner-demo-card is-picker">
            <span class="mc-owner-demo-icon">${icons.picker}</span>
            <div><small>VÝBER KÁVY</small><b>Krátky výber ho dovedie ku konkrétnej káve.</b></div>
          </article>

          <div class="mc-owner-demo-result">${icons.check}<span><b>Výsledok vedie priamo na produkt.</b></span></div>
        </div>
      </section>

      <section class="mc-owner-benefits">
        <div>${icons.check}<span><b>Menej opakovaných otázok</b></span></div>
        <div>${icons.check}<span><b>Jednoduchší výber pre zákazníka</b></span></div>
        <div>${icons.check}<span><b>Priama cesta k produktu</b></span></div>
      </section>

      <footer class="mc-owner-foot">
        <span>Ukážku pripravil <a href="https://mojchatbot.sk" target="_blank" rel="noreferrer">mojchatbot.sk</a></span>
        <a href="https://mojchatbot.sk/kontakt" target="_blank" rel="noreferrer">Kontakt ${icons.arrow}</a>
      </footer>`;
  }

  function render() {
    const owner = document.querySelector('.mc-owner');
    if (!owner || owner.dataset.ownerConversion === 'ready') return false;

    const lockup = owner.querySelector('.mc-owner-lockup')?.innerHTML?.trim() || '';
    if (!lockup) return false;

    owner.dataset.ownerConversion = 'ready';
    owner.innerHTML = markup(lockup);

    const primary = owner.querySelector('[data-release-open="advisor"]');
    if (primary) primary.id = slug === 'praziarnicka' ? 'pz13-hero-open' : 'heroOpen';

    owner.querySelectorAll('[data-release-open]').forEach((button) => {
      button.addEventListener('click', () => openMode(button.dataset.releaseOpen));
    });

    return true;
  }

  if (!render()) {
    let queued = false;
    const observer = new MutationObserver(() => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        if (render()) observer.disconnect();
      });
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
  }
})();
