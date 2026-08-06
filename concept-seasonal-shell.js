(() => {
  'use strict';
  const app = window.ConceptSeasonalApp;
  const { config, root, $, escapeHTML, mark, icons } = app;
  root.innerHTML = `
    <main class="concept-page" aria-label="Neoficiálny personalizovaný návrh pre ${escapeHTML(config.brand)}">
      <header class="site-head">
        <div class="site-brand">
          <span class="site-brand__mark">${mark()}</span>
          <span class="site-brand__copy"><strong>${escapeHTML(config.brand)}</strong><span>${escapeHTML(config.subbrand)}</span></span>
        </div>
        <span class="unofficial-label">Neoficiálny návrh</span>
      </header>

      <section class="hero">
        <div class="hero-copy">
          <p class="eyebrow">Aktuálna sezóna, zrozumiteľne</p>
          <h1>Nájsť výraznú kávu bez <em>hádaniek.</em></h1>
          <p class="hero-intro">Poradca preloží prípravu a bežné chute do konkrétneho odporúčania z overenej sezónnej ponuky Concept Coffee Roasters.</p>
          <ul class="hero-benefits" aria-label="Výhody poradcu">
            <li>konkrétna káva a dôvod</li>
            <li>ovocnosť bez elitárstva</li>
            <li>balenie až po výbere</li>
          </ul>
          <div class="hero-action-row">
            <button class="primary-action" id="heroOpen" type="button">Objaviť svoju kávu ${icons.arrow}</button>
            <small>Funkčná personalizovaná ukážka. Nie je súčasťou oficiálneho webu Concept Coffee Roasters.</small>
          </div>
        </div>

        <aside class="editorial-card" aria-label="Ukážka sezónneho odporúčania">
          <div class="editorial-card__image">
            <img src="/assets/concept/result-filter.webp" width="1280" height="900" alt="Príprava filtrovanej kávy">
            <span class="season-stamp"><b>08/26</b><span>season</span></span>
          </div>
          <div class="editorial-card__body">
            <small>Ukážka odporúčania</small>
            <h2>Weithaga AA</h2>
            <p>Šťavnatá Keňa pre filter: čierne ríbezle, granátové jablko a kakaový záver vysvetlené bez zbytočného slovníka.</p>
            <div class="editorial-card__meta"><span>Nyeri · washed</span><b>od 15 €</b></div>
          </div>
        </aside>
      </section>

      <footer class="site-foot">
        <span>Produktové údaje overené ${escapeHTML(config.verifiedAt)}.</span>
        <a href="${escapeHTML(config.shopUrl)}" target="_blank" rel="noreferrer">Pozrieť oficiálnu ponuku</a>
      </footer>
    </main>

    <div class="launcher" id="launcher">
      <aside class="launcher-teaser" id="launcherTeaser" aria-label="Pozvánka do poradcu">
        <button class="launcher-teaser__close" id="closeTeaser" type="button" aria-label="Skryť pozvánku">×</button>
        <button class="launcher-teaser__open" id="openFromTeaser" type="button">
          <b>Čo chutí ako „ovocná káva“?</b>
          <span>Vysvetlím to normálne a vyberieme konkrétny sezónny lot.</span>
        </button>
      </aside>
      <button class="launcher__button" id="openWidget" type="button" aria-label="Otvoriť kávového poradcu" aria-expanded="false">
        ${mark()}<span class="launcher__status" aria-hidden="true"></span>
      </button>
    </div>

    <section class="widget" id="widget" role="dialog" aria-modal="true" aria-label="Kávový poradca ${escapeHTML(config.brand)}" aria-hidden="true">
      <header class="widget__header">
        <div class="widget-brand">
          <span class="widget-brand__mark">${mark()}</span>
          <span class="widget-brand__copy"><strong>${escapeHTML(config.brand)}</strong><small><i class="online-dot"></i> Poradca je pripravený</small></span>
        </div>
        <div class="widget-actions">
          <button class="icon-button" id="resetAll" type="button" aria-label="Začať odznova">${icons.reset}</button>
          <button class="icon-button" id="closeWidget" type="button" aria-label="Zavrieť poradcu">${icons.close}</button>
        </div>
      </header>

      <nav class="mode" id="modeSwitch" aria-label="Režim poradcu">
        <span class="mode__indicator" aria-hidden="true"></span>
        <button class="mode__button is-active" type="button" data-mode="chat">${icons.chat}<b>Chat</b></button>
        <button class="mode__button" type="button" data-mode="advisor">${icons.compass}<b>Výber</b></button>
      </nav>

      <div class="stage">
        <section class="screen chat-screen is-active" id="chatScreen" aria-label="Chat s poradcom">
          <button class="advisor-entry" id="openAdvisor" type="button">
            <span class="advisor-entry__mark">${mark()}</span>
            <span class="advisor-entry__copy"><small>Postupný výber</small><b>Nájsť kávu podľa seba</b><span>4 otázky · približne minúta</span></span>
            <span class="advisor-entry__arrow">${icons.arrow}</span>
          </button>
          <div class="chat" id="chatMessages" aria-live="polite"></div>
          <div class="chips" id="quickChips" aria-label="Rýchle otázky"></div>
          <form class="composer" id="chatForm">
            <div class="composer__shell">
              <input id="chatInput" autocomplete="off" maxlength="500" placeholder="Opýtaj sa na kávu…" aria-label="Otázka o káve">
              <button class="composer__send" type="submit" aria-label="Odoslať otázku">${icons.send}</button>
            </div>
          </form>
          <div class="support-row" id="supportRow" aria-label="Kontaktné možnosti"></div>
        </section>

        <section class="screen advisor-screen" id="advisorScreen" aria-label="Výber kávy">
          <div class="advisor-progress">
            <button class="progress-back" id="prevBtn" type="button" aria-label="Predchádzajúci krok">${icons.back}</button>
            <div class="advisor-progress__copy"><b id="stepLabel">1 / 4</b><span id="stepName">Príprava</span></div>
            <div class="progress" id="progress" aria-label="Priebeh výberu"></div>
          </div>
          <div class="advisor" id="advisorBody" aria-live="polite"></div>
        </section>
      </div>
    </section>`;

  document.title = `${config.brand} – sezónny kávový poradca`;
  const widget = $('#widget');
  const launcher = $('#launcher');
  const teaser = $('#launcherTeaser');
  const modeSwitch = $('#modeSwitch');
  const chatScreen = $('#chatScreen');
  const advisorScreen = $('#advisorScreen');
  const chat = $('#chatMessages');
  const chips = $('#quickChips');
  const advisor = $('#advisorBody');
  let lockedScrollY = 0;
  app.refs = { widget, launcher, teaser, modeSwitch, chatScreen, advisorScreen, chat, chips, advisor };
})();
