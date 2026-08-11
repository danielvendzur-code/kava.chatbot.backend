(() => {
  'use strict';
  const app = window.ConceptSeasonalApp;
  const { config, root, $, escapeHTML, mark, icons } = app;

  root.innerHTML = `
    <main class="concept-page" aria-label="Návrh AI chatbota pre ${escapeHTML(config.brand)}">
      <header class="site-head">
        <a class="solution-brand" href="https://mojchatbot.sk" target="_blank" rel="noreferrer"><span>Ukážka riešenia</span><strong>mojchatbot.sk</strong>${icons.arrow}</a>
        <span class="owner-badge">Návrh pre Concept Coffee</span>
      </header>

      <section class="hero">
        <div class="hero-copy">
          <p class="hero-eyebrow">Návrh AI chatbota pre Concept Coffee</p>
          <h1>Sezónna káva bez zdĺhavého vyberania.</h1>
          <p class="hero-intro">Zákazník odpovie na štyri otázky o chuti a príprave. Poradca odporučí konkrétnu kávu, balenie aj mletie a pripraví ju do košíka.</p>
          <ul class="hero-benefits" aria-label="Čo AI poradca dokáže">
            <li><i>01</i><span><b>Odpovie 24/7</b><small>Pomôže aj mimo otváracích hodín.</small></span></li>
            <li><i>02</i><span><b>Vyberie kávu</b><small>Štyri otázky podľa chuti a prípravy.</small></span></li>
            <li><i>03</i><span><b>Zvýši objednávku</b><small>Ponúkne balenie, mletie alebo ochutnávku.</small></span></li>
          </ul>
          <button class="primary-action" id="heroOpen" type="button">Vyskúšať poradcu ${icons.arrow}</button>
        </div>

        <aside class="hero-visual" aria-label="Ukážka odporúčania Weithaga AA">
          <img src="/assets/concept/product-weithaga.jpg" width="1024" height="1024" alt="Produktová fotografia Weithaga AA">
          <div class="hero-visual__caption"><span>Odporúčanie pre zákazníka</span><b>Kenya Weithaga AA</b><small>ríbezle · grep · vanilka · čierny čaj</small></div>
          <div class="hero-visual__proof"><span>Filter roast</span><span>Kenya</span><b>od 15 €</b></div>
        </aside>
      </section>

      <footer class="site-foot">
        <span>Interaktívny návrh pre Concept Coffee Roasters</span>
        <a href="https://mojchatbot.sk" target="_blank" rel="noreferrer">mojchatbot.sk ↗</a>
      </footer>
    </main>

    <div class="launcher" id="launcher">
      <aside class="launcher-teaser" id="launcherTeaser" aria-label="Pozvánka do poradcu">
        <button class="launcher-teaser__close" id="closeTeaser" type="button" aria-label="Skryť pozvánku">×</button>
        <button class="launcher-teaser__open" id="openFromTeaser" type="button">
          <b>Vyskúšajte AI poradcu</b>
          <span>Chat aj výber kávy.</span>
        </button>
      </aside>
      <button class="launcher__button" id="openWidget" type="button" aria-label="Otvoriť kávového poradcu" aria-expanded="false">
        <span class="launcher__chat-mark">${icons.chat}</span>
      </button>
    </div>

    <section class="widget" id="widget" role="dialog" aria-modal="true" aria-label="Kávový poradca ${escapeHTML(config.brand)}" aria-hidden="true">
      <header class="widget__header">
        <div class="widget-brand">
          <span class="widget-brand__mark">${icons.chat}</span><span class="widget-brand__copy"><strong>Concept poradca</strong><small>Kávový poradca</small></span>
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
