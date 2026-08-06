(() => {
  'use strict';
  const app = window.ConceptSeasonalApp;
  const { config, root, $, escapeHTML, mark, brandSeal, icons } = app;

  root.innerHTML = `
    <main class="concept-page" aria-label="Neoficiálny personalizovaný návrh pre ${escapeHTML(config.brand)}">
      <header class="site-head">
        <div class="site-brand">
          <span class="site-brand__seal">${brandSeal()}</span>
          <span class="site-brand__copy"><strong>CONCEPT</strong><span>COFFEE ROASTERS</span></span>
        </div>
        <span class="unofficial-label">Personalizovaný návrh · neoficiálne</span>
      </header>

      <section class="hero">
        <div class="hero-copy">
          <p class="eyebrow">Vitajte vo vašom návrhu chatbotu</p>
          <h1>AI poradca pre <em>Concept Coffee Roasters.</em></h1>
          <p class="hero-intro">Takto môže vyzerať AI poradca pre váš e-shop. Pomôže zákazníkom pochopiť sezónnu ponuku, odpovie na otázky a nasmeruje ich ku konkrétnym produktom.</p>
          <ul class="hero-benefits" aria-label="Hodnota poradcu pre firmu">
            <li><b>Pomôže s výberom</b><span>zjednoduší sezónnu ponuku</span></li>
            <li><b>Odpovie okamžite</b><span>na časté otázky o chuti a príprave</span></li>
            <li><b>Vedie k produktu</b><span>nie iba na všeobecnú kategóriu</span></li>
          </ul>
          <div class="hero-action-row">
            <button class="primary-action" id="heroOpen" type="button">Otvoriť personalizovanú ukážku ${icons.arrow}</button>
            <small>Funkčný koncept pripravený pre majiteľa Concept Coffee Roasters. Nie je súčasťou oficiálneho webu.</small>
          </div>
        </div>

        <aside class="editorial-card" aria-label="Ukážka výsledku, ktorý uvidí zákazník">
          <div class="editorial-card__image">
            <img src="/assets/concept/result-filter.webp" width="1280" height="900" alt="Príprava filtrovanej kávy">
            <span class="season-stamp"><b>SEASON</b><span>selection</span></span>
          </div>
          <div class="editorial-card__body">
            <small>Čo uvidí zákazník</small>
            <h2>Konkrétne odporúčanie, nie zoznam.</h2>
            <p><b>Weithaga AA</b> — šťavnatá Keňa pre filter, vysvetlená zrozumiteľne a s priamym pokračovaním na produkt.</p>
            <div class="editorial-card__meta"><span>pôvod · profil · príprava · dôvod</span><b>od 15 €</b></div>
          </div>
        </aside>
      </section>

      <footer class="site-foot">
        <span>Neoficiálny personalizovaný návrh pre ${escapeHTML(config.brand)}.</span>
        <a href="${escapeHTML(config.shopUrl)}" target="_blank" rel="noreferrer">Pozrieť oficiálnu ponuku</a>
      </footer>
    </main>

    <div class="launcher" id="launcher">
      <aside class="launcher-teaser" id="launcherTeaser" aria-label="Pozvánka do poradcu">
        <button class="launcher-teaser__close" id="closeTeaser" type="button" aria-label="Skryť pozvánku">×</button>
        <button class="launcher-teaser__open" id="openFromTeaser" type="button">
          <b>Pozrite si vášho AI poradcu</b>
          <span>Chat aj výber kávy sú pripravené ako funkčná ukážka.</span>
        </button>
      </aside>
      <button class="launcher__button" id="openWidget" type="button" aria-label="Otvoriť kávového poradcu" aria-expanded="false">
        ${mark()}<span class="launcher__status" aria-hidden="true"></span>
      </button>
    </div>

    <section class="widget" id="widget" role="dialog" aria-modal="true" aria-label="Kávový poradca ${escapeHTML(config.brand)}" aria-hidden="true">
      <header class="widget__header">
        <div class="widget-brand">
          <span class="widget-brand__seal">${brandSeal()}</span>
          <span class="widget-brand__copy"><strong>Concept Coffee Roasters</strong><small><i class="online-dot"></i> AI poradca je pripravený</small></span>
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
            <span class="advisor-entry__visual"><img src="/assets/concept/prep-filter.webp" width="1200" height="760" alt=""></span>
            <span class="advisor-entry__copy"><small>Odporúčací poradca</small><b>Nájsť kávu podľa seba</b><span>4 krátke otázky · konkrétny produkt</span></span>
            <span class="advisor-entry__arrow">${icons.arrow}</span>
          </button>
          <div class="chat" id="chatMessages" aria-live="polite"></div>
          <div class="chat-bottom">
            <div class="chips" id="quickChips" aria-label="Rýchle otázky"></div>
            <form class="composer" id="chatForm">
              <div class="composer__shell">
                <input id="chatInput" autocomplete="off" maxlength="500" placeholder="Opýtaj sa na kávu…" aria-label="Otázka o káve">
                <button class="composer__send" type="submit" aria-label="Odoslať otázku">${icons.send}</button>
              </div>
            </form>
            <div class="widget-credit">Personalizovaná ukážka od <a href="https://mojchatbot.sk" target="_blank" rel="noreferrer">mojchatbot.sk</a></div>
          </div>
        </section>

        <section class="screen advisor-screen" id="advisorScreen" aria-label="Výber kávy">
          <div class="advisor-progress">
            <button class="progress-back" id="prevBtn" type="button" aria-label="Predchádzajúci krok">${icons.back}</button>
            <div class="advisor-progress__copy"><b id="stepLabel">1 / 4</b><span id="stepName">Príprava</span></div>
            <div class="progress" id="progress" aria-label="Priebeh výberu"></div>
          </div>
          <div class="advisor" id="advisorBody" aria-live="polite"></div>
          <div class="advisor-credit">Personalizovaná ukážka od <a href="https://mojchatbot.sk" target="_blank" rel="noreferrer">mojchatbot.sk</a></div>
        </section>
      </div>
    </section>`;

  document.title = `${config.brand} – personalizovaný návrh AI poradcu`;
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
