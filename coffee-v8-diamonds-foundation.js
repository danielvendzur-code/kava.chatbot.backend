(() => {
  'use strict';

  const root = document.querySelector('#coffee-demo-root');
  const config = window.COFFEE_DEMOS?.diamonds;
  if (!root || !config) return;

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  const escapeHtml = (value = '') => String(value).replace(/[&<>'"]/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  }[char]));

  const icon = (name) => {
    const paths = {
      arrow: '<path d="m8 5 7 7-7 7"/>',
      back: '<path d="m15 5-7 7 7 7"/>',
      close: '<path d="M6 6l12 12M18 6 6 18"/>',
      reset: '<path d="M20 11a8 8 0 1 0-2.4 5.7M20 5v6h-6"/>',
      chat: '<path d="M5 18.5 3.5 21v-5A8.5 8.5 0 1 1 12 20.5c-2.7 0-5.1-.7-7-2Z"/><path d="M8 12h.01M12 12h.01M16 12h.01"/>',
      select: '<path d="M12 3v18M5 7h14M6 7l-3 7h6L6 7Zm12 0-3 7h6l-3-7Z"/>',
      send: '<path d="m4 4 16 8-16 8 3-8-3-8Z"/><path d="M7 12h13"/>',
      check: '<path d="m5 12 4 4L19 6"/>',
      shop: '<path d="M5 9h14l-1 11H6L5 9ZM8 9V6a4 4 0 0 1 8 0v3"/>',
      phone: '<path d="M7.2 3.5 4.7 5.8c-.8.8-.4 3.4 2.8 6.7 3.3 3.3 5.9 3.7 6.7 2.8l2.3-2.5-3-2-1.7 1.7c-1.2-.5-2.3-1.4-3.2-2.3-.9-.9-1.8-2-2.3-3.2L8 5.3l-.8-1.8Z"/>',
      mail: '<path d="M3 6h18v12H3z"/><path d="m4 7 8 6 8-6"/>',
      bean: '<path d="M15.5 4.5C10.8 2 5.4 5.2 4.4 10.1c-1 4.8 2.3 9.6 7 9.9 4.6.3 8.5-3.6 8.1-8.5-.2-2.9-1.7-5.6-4-7Z"/><path d="M7.5 17c4.4-2.3 6.2-6.4 6.6-10.8"/>',
      filter: '<path d="M5 5h14l-5 8v6h-4v-6L5 5Z"/><path d="M8 5c2 2 6 2 8 0"/>',
      espresso: '<path d="M5 8h12v7a5 5 0 0 1-5 5h-2a5 5 0 0 1-5-5V8ZM17 10h2a2 2 0 0 1 0 4h-2"/>',
      automatic: '<path d="M5 3h14v18H5z"/><path d="M8 7h8M8 11h8M9 15h6v3H9z"/>',
      moka: '<path d="m8 3 8 1 2 7-3 10H9L6 11l2-8Z"/><path d="M7 10h10M16 6h3"/>',
      chocolate: '<path d="M5 5h14v14H5zM9.7 5v14M14.3 5v14M5 9.7h14M5 14.3h14"/>',
      balanced: '<path d="M12 3v18M5 7h14M6 7l-3 7h6L6 7Zm12 0-3 7h6l-3-7Z"/>',
      fruity: '<path d="M12 7c4-3 7 0 7 4 0 5-3 9-7 10-4-1-7-5-7-10 0-4 3-7 7-4ZM12 7c0-2 1-4 4-5"/>',
      black: '<path d="M5 8h12v7a5 5 0 0 1-5 5h-2a5 5 0 0 1-5-5V8ZM17 10h2a2 2 0 0 1 0 4h-2"/>',
      milk: '<path d="M7 3h10l1 4v14H6V7l1-4ZM6 8h12M9 12c2 2 4 2 6 0"/>',
      both: '<path d="M4 6h7v12H4zM13 6h7v12h-7zM6 9h3M15 9h3"/>',
      classic: '<path d="m13 2-7 11h6l-1 9 7-12h-6l1-8Z"/>',
      decaf: '<path d="M20 15.5A8 8 0 1 1 8.5 4 7 7 0 0 0 20 15.5ZM15 5h.01M18 8h.01"/>',
      either: '<path d="M5 8h14M5 16h14M16 5l3 3-3 3M8 13l-3 3 3 3"/>'
    };
    return `<svg class="ui-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${paths[name] || paths.bean}</svg>`;
  };

  const advisorMark = () => `
    <svg class="diamond-mark" viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      <path class="diamond-mark__outline" d="M47.8 9.6C37.7 3.3 23.6 5.1 14.9 14.2 5.8 23.8 5.5 39 14.2 48.5c6.7 7.3 17.2 9.9 26.2 6.3l10.4 3.3-2.4-10.5c8.5-8.7 9.1-22.7 1.5-32.2-0.7-0.9-1.4-1.7-2.1-2.5"/>
      <path class="diamond-mark__facet" d="M23.2 42.4c8.7-4.1 14.5-12.1 15.5-21.7-7.2-1.7-14.8 1.7-18.1 8.2-2.3 4.5-1.3 9.8 2.6 13.5Z"/>
    </svg>`;

  const products = config.products;
  const questions = [
    {
      id: 'prep',
      eyebrow: '1 · Príprava',
      title: 'Ako si kávu najčastejšie pripravujete?',
      help: 'Podľa prípravy odfiltrujeme kávy, ktoré doma prirodzene fungujú.',
      options: [
        ['filter', 'Filter', 'V60, Chemex, AeroPress', 'filter'],
        ['lever', 'Espresso', 'Pákový kávovar', 'espresso'],
        ['automatic', 'Automat', 'Automatický kávovar', 'automatic'],
        ['moka', 'Moka', 'Moka kanvička', 'moka']
      ]
    },
    {
      id: 'taste',
      eyebrow: '2 · Chuť',
      title: 'Ktorý chuťový smer vám je najbližší?',
      help: 'Nejde o pridané arómy. Sú to prirodzené tóny, ktoré môže káva pripomínať.',
      options: [
        ['chocolate', 'Kakao a karamel', 'Sladšie, pokojnejšie, menej ovocné', 'chocolate'],
        ['balanced', 'Vyvážená', 'Jemná sladkosť a čistá dochuť', 'balanced'],
        ['fruity', 'Ovocná a svieža', 'Výraznejší pôvod a ľahšia šálka', 'fruity']
      ]
    },
    {
      id: 'drink',
      eyebrow: '3 · Šálka',
      title: 'Pijete kávu čiernu alebo s mliekom?',
      help: 'Mlieko potrebuje profil, ktorý sa v nápoji nestratí.',
      options: [
        ['black', 'Čiernu', 'Chcem cítiť kávu naplno', 'black'],
        ['milk', 'S mliekom', 'Cappuccino alebo flat white', 'milk'],
        ['both', 'Oboje', 'Striedam podľa nálady', 'both']
      ]
    },
    {
      id: 'caffeine',
      eyebrow: '4 · Kofeín',
      title: 'Má to byť klasická alebo bezkofeínová káva?',
      help: 'Pri bezkofeínovej voľbe odporučíme iba reálny decaf z ponuky.',
      options: [
        ['classic', 'Klasická', 'S kofeínom', 'classic'],
        ['decaf', 'Bezkofeínová', 'Na celý deň alebo večer', 'decaf'],
        ['either', 'Je mi to jedno', 'Rozhodne najlepšia zhoda', 'either']
      ]
    }
  ];

  const state = {
    open: false,
    mode: 'chat',
    step: 0,
    answers: {},
    result: null,
    alternative: null,
    packageSize: '250g',
    grind: 'Zrnková',
    chat: [
      { role: 'assistant', content: 'Dobrý deň. Môžete sa opýtať na prípravu, chuť alebo konkrétnu kávu. Na osobné odporúčanie slúži krátky výber v druhej záložke.' }
    ],
    scrollY: 0
  };

  root.innerHTML = `
    <main class="diamond-page">
      <header class="diamond-header">
        <a class="diamond-brand" href="${escapeHtml(config.shopUrl)}" target="_blank" rel="noreferrer" aria-label="Otvoriť e-shop Diamonds Roastery">
          <span class="diamond-brand__mark">${advisorMark()}</span>
          <span><strong>Diamonds Roastery</strong><small>návrh osobného poradcu</small></span>
        </a>
        <span class="diamond-header__note">Neoficiálna interaktívna ukážka</span>
      </header>

      <section class="diamond-hero" aria-labelledby="hero-title">
        <div class="diamond-hero__copy">
          <p class="diamond-eyebrow">${escapeHtml(config.ownerGreeting)}</p>
          <h1 id="hero-title">Zákazník nemusí rozumieť spracovaniu, aby si vybral správnu kávu.</h1>
          <p class="diamond-lead">Štyri jednoduché otázky preložia jeho prípravu a chuť do jedného konkrétneho odporúčania z aktuálnej ponuky Diamonds Roastery.</p>
          <div class="diamond-actions">
            <button class="diamond-primary" id="heroOpen" type="button">Vyskúšať výber kávy ${icon('arrow')}</button>
            <button class="diamond-secondary" id="heroChat" type="button">Najprv sa opýtať</button>
          </div>
          <dl class="diamond-proof" aria-label="Obsah ukážky">
            <div><dt>4</dt><dd>krátke otázky</dd></div>
            <div><dt>1 + 1</dt><dd>odporúčanie a alternatíva</dd></div>
            <div><dt>0</dt><dd>vymyslených produktov</dd></div>
          </dl>
        </div>

        <div class="diamond-hero__visual" aria-label="Náhľad výsledku poradcu">
          <div class="facet-frame" aria-hidden="true"></div>
          <article class="sample-card">
            <header class="sample-card__head">
              <span class="sample-card__mark">${advisorMark()}</span>
              <div><small>Osobné odporúčanie</small><strong>Diamonds poradca</strong></div>
              <span class="sample-card__step">4 otázky</span>
            </header>
            <div class="sample-product">
              <div class="coffee-pack" aria-hidden="true"><span>DR</span><b>KUMANDAY</b><small>COLOMBIA</small></div>
              <div class="sample-product__copy">
                <small>Najlepšia zhoda</small>
                <h2>Kolumbia Kumanday Reserve</h2>
                <p>Karamel · kakao · sladký citrus</p>
                <div class="sample-tags"><span>Automat</span><span>Espresso</span></div>
              </div>
            </div>
            <p class="sample-reason"><b>Prečo práve táto:</b> sladká, menej ovocná a vhodná do automatu aj pákového kávovaru.</p>
            <span class="sample-link">Otvoriť konkrétny produkt ${icon('arrow')}</span>
          </article>
        </div>
      </section>

      <section class="diamond-process" aria-label="Ako poradca pomáha">
        <p><span>01</span> Zistí prípravu a chuť bez odborných výrazov.</p>
        <p><span>02</span> Vysvetlí dôvod odporúčania ľudskou rečou.</p>
        <p><span>03</span> Pošle zákazníka priamo na reálny produkt.</p>
      </section>

      <footer class="diamond-footer">
        <span>Ukážka nie je súčasťou oficiálneho webu Diamonds Roastery.</span>
        <a href="${escapeHtml(config.shopUrl)}" target="_blank" rel="noreferrer">Aktuálna ponuka kávy ${icon('arrow')}</a>
      </footer>
    </main>

    <div class="diamond-launcher" id="launcher">
      <div class="diamond-teaser" id="launcherTeaser" role="status">
        <button class="diamond-teaser__close" id="closeTeaser" type="button" aria-label="Skryť oznam">${icon('close')}</button>
        <button class="diamond-teaser__body" id="teaserOpen" type="button">
          <span class="diamond-teaser__eyebrow">Kávový poradca</span>
          <strong>Vyberieme jednu kávu, ktorá vám sadne.</strong>
          <small>4 otázky · bez registrácie</small>
        </button>
      </div>
      <button class="diamond-launcher__button" id="openWidget" type="button" aria-label="Otvoriť kávového poradcu" aria-expanded="false">
        ${advisorMark()}<span class="diamond-launcher__status" aria-hidden="true"></span>
      </button>
    </div>

    <section class="diamond-widget" id="widget" aria-label="Kávový poradca Diamonds Roastery" aria-hidden="true">
      <header class="diamond-widget__header">
        <div class="widget-brand">
          <span class="widget-brand__mark">${advisorMark()}</span>
          <span><strong>Diamonds poradca</strong><small><i></i> pripravený pomôcť</small></span>
        </div>
        <div class="widget-actions">
          <button class="round-button" id="resetAll" type="button" aria-label="Začať odznova">${icon('reset')}</button>
          <button class="round-button" id="closeWidget" type="button" aria-label="Zavrieť poradcu">${icon('close')}</button>
        </div>
      </header>

      <nav class="diamond-mode" aria-label="Spôsob pomoci">
        <button type="button" class="diamond-mode__button is-active" data-mode="chat">
          ${icon('chat')}<span><b>Chat</b><small>Otázky o káve</small></span>
        </button>
        <button type="button" class="diamond-mode__button" data-mode="advisor">
          ${icon('select')}<span><b>Výber kávy</b><small>4 krátke kroky</small></span>
        </button>
        <span class="diamond-mode__indicator" aria-hidden="true"></span>
      </nav>

      <div class="diamond-stage">
        <section class="diamond-screen is-active" id="chatScreen" aria-label="Chat s poradcom">
          <button class="quiz-entry" id="openAdvisor" type="button">
            <span class="quiz-entry__mark">${advisorMark()}</span>
            <span><small>Najrýchlejšia cesta</small><b>Nájsť kávu podľa chuti</b><em>4 otázky · približne minúta</em></span>
            ${icon('arrow')}
          </button>
          <div class="chat-messages" id="chatMessages" aria-live="polite"></div>
          <div class="quick-chips" id="quickChips" aria-label="Rýchle otázky"></div>
          <form class="chat-composer" id="chatForm">
            <label class="sr-only" for="chatInput">Otázka o káve</label>
            <input id="chatInput" name="message" type="text" autocomplete="off" inputmode="text" placeholder="Opýtajte sa na kávu…">
            <button type="submit" aria-label="Odoslať správu">${icon('send')}</button>
          </form>
          <div class="contact-row" id="contactRow"></div>
        </section>

        <section class="diamond-screen" id="advisorScreen" aria-label="Výber kávy">
          <header class="advisor-topbar">
            <button class="advisor-back" id="backButton" type="button" aria-label="Predchádzajúci krok">${icon('back')}<span>Späť</span></button>
            <div class="advisor-meter" aria-label="Priebeh výberu"><span id="meterFill"></span></div>
            <span class="advisor-count" id="advisorCount">1 / 4</span>
          </header>
          <div class="advisor-content" id="advisorContent"></div>
        </section>
      </div>
    </section>
  `;

  window.DIAMONDS_ADVISOR_FOUNDATION = { root, config, $, $$, escapeHtml, icon, advisorMark, products, questions, state };
})();
