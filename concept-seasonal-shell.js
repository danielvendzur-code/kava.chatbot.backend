(() => {
  'use strict';
  const app = window.ConceptSeasonalApp;
  const { config, root, $, escapeHTML, mark, icons } = app;

  root.innerHTML = `
    <main class="concept-page" aria-label="Výber kávy ${escapeHTML(config.brand)}">
      <header class="site-head">
        <img class="site-brand__logo" src="/brand/concept-official-logo.png" width="180" height="42" alt="Concept Coffee Roasters">
        <a class="site-head__link" href="${escapeHTML(config.shopUrl)}" target="_blank" rel="noreferrer">conceptcoffee.sk ${icons.arrow}</a>
      </header>

      <section class="hero">
        <div class="hero-copy">
          <h1>Každý zákazník si nájde svoju kávu.</h1>
          <p class="hero-intro">Poradca odpovie 24/7, vysvetlí chute jednoducho a odporučí konkrétnu kávu.</p>
          <ul class="hero-benefits" aria-label="Výhody kávového poradcu">
            <li><span class="benefit-icon">${icons.compass}</span><span><b>Jednoduchý výber</b><small>Pár otázok a nájdeme kávu, ktorá vám sadne.</small></span></li>
            <li><span class="benefit-icon">${icons.upsell}</span><span><b>Vhodné balenie</b><small>Odporučíme ho podľa toho, koľko kávy pijete.</small></span></li>
            <li><span class="benefit-icon">${icons.clock}</span><span><b>Pomoc 24/7</b><small>Sme tu, keď potrebujete poradiť.</small></span></li>
          </ul>
          <button class="primary-action" id="heroOpen" type="button">Vyskúšať výber kávy ${icons.arrow}</button>
        </div>

        <aside class="hero-visual" aria-label="Sezónna káva Weithaga AA">
          <div class="hero-visual__shape"></div>
          <img src="/assets/concept/product-weithaga.jpg" width="1024" height="1024" alt="Oficiálna produktová fotografia Weithaga AA">
          <div class="hero-visual__caption"><span>Sezónny výber</span><b>Weithaga AA · Kenya</b></div>
        </aside>
      </section>

      <footer class="site-foot">
        <span>Concept Coffee · sezónny výber kávy.</span>
        <a href="${escapeHTML(config.shopUrl)}" target="_blank" rel="noreferrer">Pozrieť ponuku Concept Coffee</a>
      </footer>
    </main>

    <div class="launcher" id="launcher">
      <aside class="launcher-teaser" id="launcherTeaser" aria-label="Pozvánka do poradcu">
        <button class="launcher-teaser__close" id="closeTeaser" type="button" aria-label="Skryť pozvánku">×</button>
        <button class="launcher-teaser__open" id="openFromTeaser" type="button">
          <b>Pomôžem vám vybrať kávu</b>
          <span>Štyri otázky, konkrétne odporúčanie.</span>
        </button>
      </aside>
      <button class="launcher__button" id="openWidget" type="button" aria-label="Otvoriť kávového poradcu" aria-expanded="false">
        ${mark()}<span class="launcher__status" aria-hidden="true"></span>
      </button>
    </div>

    <section class="widget" id="widget" role="dialog" aria-modal="true" aria-label="Kávový poradca ${escapeHTML(config.brand)}" aria-hidden="true">
      <header class="widget__header">
        <div class="widget-brand">
          <img class="widget-brand__logo" src="/brand/concept-official-logo.png" width="126" height="30" alt="Concept Coffee Roasters">
          <span class="widget-brand__status"><i class="online-dot"></i> Online</span>
        </div>
        <div class="widget-actions">
          <button class="icon-button" id="resetAll" type="button" aria-label="Začať odznova">${icons.reset}</button>
          <button class="icon-button" id="closeWidget" type="button" aria-label="Zavrieť poradcu">${icons.close}</button>
        </div>
      </header>

      <nav class="mode" id="modeSwitch" aria-label="Režim poradcu">
        <span class="mode__indicator" aria-hidden="true"></span>
        <button class="mode__button is-active" type="button" data-mode="chat">${icons.chat}<b>Chat</b></button>
        <button class="mode__button" type="button" data-mode="advisor">${icons.compass}<b>Výber kávy</b></button>
      </nav>

      <div class="stage">
        <section class="screen chat-screen is-active" id="chatScreen" aria-label="Chat s poradcom">
          <button class="advisor-entry" id="openAdvisor" type="button">
            <span class="advisor-entry__mark">${mark()}</span>
            <span class="advisor-entry__copy"><b>Nájsť svoju kávu</b><span>4 otázky · výsledok do minúty</span></span>
            <span class="advisor-entry__arrow">${icons.arrow}</span>
          </button>
          <div class="chat" id="chatMessages" aria-live="polite"></div>
          <div class="chat-bottom">
            <div class="chips" id="quickChips" aria-label="Rýchle otázky"></div>
            <form class="composer" id="chatForm">
              <div class="composer__shell">
                <input id="chatInput" autocomplete="off" maxlength="500" placeholder="Opýtajte sa na kávu…" aria-label="Otázka o káve">
                <button class="composer__send" type="submit" aria-label="Odoslať otázku">${icons.send}</button>
              </div>
            </form>
          </div>
        </section>

        <section class="screen advisor-screen" id="advisorScreen" aria-label="Výber kávy">
          <div class="advisor-progress">
            <button class="progress-back" id="prevBtn" type="button" aria-label="Predchádzajúci krok">${icons.back}</button>
            <div class="advisor-progress__copy"><b id="stepLabel">1 z 4</b><span id="stepName">Príprava</span></div>
            <div class="progress" id="progress" aria-label="Priebeh výberu"></div>
          </div>
          <div class="advisor" id="advisorBody" aria-live="polite"></div>
        </section>
      </div>
    </section>`;

  document.title = `${config.brand} – nájdite svoju kávu`;
  const widget = $('#widget');
  const launcher = $('#launcher');
  const teaser = $('#launcherTeaser');
  const modeSwitch = $('#modeSwitch');
  const chatScreen = $('#chatScreen');
  const advisorScreen = $('#advisorScreen');
  const chat = $('#chatMessages');
  const chips = $('#quickChips');
  const advisor = $('#advisorBody');
  app.refs = { widget, launcher, teaser, modeSwitch, chatScreen, advisorScreen, chat, chips, advisor };
})();
