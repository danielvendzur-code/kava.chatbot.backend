(() => {
  'use strict';
  const app = window.ConceptSeasonalApp;
  const { config, root, $, escapeHTML, mark, icons } = app;

  root.innerHTML = `
    <main class="concept-page" aria-label="Neoficiálny personalizovaný návrh pre ${escapeHTML(config.brand)}">
      <header class="site-head">
        <div class="site-brand" aria-label="Concept Coffee Roasters">
          <img class="site-brand__logo" src="/brand/concept-official-logo.png" width="180" height="42" alt="Concept Coffee Roasters">
        </div>
        <div class="site-head__note"><span class="site-head__dot"></span><span>Personalizovaný návrh · neoficiálne</span></div>
      </header>

      <section class="hero">
        <div class="hero-copy">
          <h1>Vitajte vo vašom návrhu AI poradcu pre Concept Coffee Roasters.</h1>
          <p class="hero-intro">Zákazník nájde svoju kávu rýchlejšie. Poradca vysvetlí rozdiely v sezónnej ponuke, zohľadní prípravu aj chuť a dovedie ho ku konkrétnemu produktu.</p>
          <ul class="hero-benefits" aria-label="Hodnota poradcu pre firmu">
            <li><span class="benefit-index">01</span><b>Jednoduchší výber</b><span>menej váhania medzi sezónnymi lotmi</span></li>
            <li><span class="benefit-index">02</span><b>Viac istoty</b><span>chuť a príprava vysvetlené ľudsky</span></li>
            <li><span class="benefit-index">03</span><b>Priamy nákup</b><span>od preferencie až ku konkrétnej káve</span></li>
          </ul>
          <div class="hero-action-row">
            <button class="primary-action" id="heroOpen" type="button">Otvoriť ukážku poradcu ${icons.arrow}</button>
            <div class="hero-note"><span>Funkčný sales demo</span><small>Nie je súčasťou oficiálneho webu.</small></div>
          </div>
        </div>

        <aside class="editorial-card" aria-label="Ukážka výsledku, ktorý uvidí zákazník">
          <div class="editorial-card__image">
            <img src="/assets/concept/product-weithaga.jpg" width="1024" height="1024" alt="Oficiálna produktová fotografia Weithaga AA – Kenya">
            <span class="season-stamp">WEITHAGA AA · KENYA</span>
          </div>
          <div class="editorial-card__body">
            <small>Customer experience v praxi</small>
            <h2>Konkrétne odporúčanie, nie zoznam.</h2>
            <p><b>Weithaga AA</b> — Keňa pre filter, vysvetlená jednoducho a s priamym pokračovaním na oficiálny produkt.</p>
            <div class="editorial-card__meta"><span>4 otázky · reálna ponuka · 1 CTA</span><b>od 15 €</b></div>
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
          <img class="widget-brand__logo" src="/brand/concept-official-logo.png" width="126" height="30" alt="Concept Coffee Roasters">
          <span class="widget-brand__status"><i class="online-dot"></i> AI poradca je pripravený</span>
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
