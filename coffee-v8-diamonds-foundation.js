(() => {
  'use strict';
  const root = document.querySelector('#coffee-demo-root');
  const config = window.COFFEE_DEMOS?.diamonds;
  if (!root || !config) return;

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  const esc = (value = '') => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  const iconPaths = {
    arrow:'<path d="m8 5 7 7-7 7"/>', back:'<path d="m15 5-7 7 7 7"/>', close:'<path d="M6 6l12 12M18 6 6 18"/>',
    reset:'<path d="M20 11a8 8 0 1 0-2.4 5.7M20 5v6h-6"/>', chat:'<path d="M5 18.5 3.5 21v-5A8.5 8.5 0 1 1 12 20.5c-2.7 0-5.1-.7-7-2Z"/><path d="M8 12h.01M12 12h.01M16 12h.01"/>',
    select:'<path d="M5 7h14M5 12h10M5 17h7"/><path d="m16 16 2 2 4-5"/>', send:'<path d="m4 4 16 8-16 8 3-8-3-8Z"/><path d="M7 12h13"/>',
    filter:'<path d="M5 5h14l-5 8v6h-4v-6L5 5Z"/>', espresso:'<path d="M5 8h12v7a5 5 0 0 1-5 5h-2a5 5 0 0 1-5-5V8ZM17 10h2a2 2 0 0 1 0 4h-2"/>',
    automatic:'<path d="M5 3h14v18H5z"/><path d="M8 7h8M8 11h8M9 15h6v3H9z"/>', moka:'<path d="m8 3 8 1 2 7-3 10H9L6 11l2-8Z"/><path d="M7 10h10"/>',
    chocolate:'<path d="M5 5h14v14H5zM10 5v14M14 5v14M5 10h14M5 14h14"/>', balanced:'<path d="M12 3v18M5 7h14M6 7l-3 7h6L6 7Zm12 0-3 7h6l-3-7Z"/>',
    fruity:'<path d="M12 7c4-3 7 0 7 4 0 5-3 9-7 10-4-1-7-5-7-10 0-4 3-7 7-4ZM12 7c0-2 1-4 4-5"/>',
    black:'<path d="M5 8h12v7a5 5 0 0 1-5 5h-2a5 5 0 0 1-5-5V8ZM17 10h2a2 2 0 0 1 0 4h-2"/>',
    milk:'<path d="M7 3h10l1 4v14H6V7l1-4ZM6 8h12M9 12c2 2 4 2 6 0"/>', both:'<path d="M4 6h7v12H4zM13 6h7v12h-7z"/>',
    classic:'<path d="M5 17c3-7 7-11 14-12-1 7-5 12-12 14"/><path d="M7 19c3-3 6-6 10-9"/>', explore:'<path d="M12 3l2.2 6.8L21 12l-6.8 2.2L12 21l-2.2-6.8L3 12l6.8-2.2L12 3Z"/>', decaf:'<path d="M20 15.5A8 8 0 1 1 8.5 4 7 7 0 0 0 20 15.5Z"/>', shop:'<path d="M5 9h14l-1 11H6L5 9ZM8 9V6a4 4 0 0 1 8 0v3"/>'
  };
  const icon = (name) => `<svg class="ui-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${iconPaths[name] || iconPaths.select}</svg>`;

  const advisorMark = () => `<svg class="advisor-mark" viewBox="0 0 64 64" aria-hidden="true" fill="none">
    <path class="advisor-mark__d" d="M18 11h17c11.6 0 20 7.6 20 18.5S46.6 48 35 48H27l-10 7 2.4-10.2C13.2 41.2 9 35.5 9 29.5 9 18.8 16.8 11 27.2 11"/>
    <path class="advisor-mark__bean" d="M26.5 39c8-3.4 13-10.1 14-18.3-6.4-1.3-12.8 1.5-15.7 7.1-2 3.8-1.2 8.2 1.7 11.2Z"/>
  </svg>`;

  const officialLogo = () => `<span class="brand-lockup"><img src="${esc(config.officialLogo)}" alt="Diamonds Roastery" decoding="async" onerror="this.style.display='none';this.nextElementSibling.style.display='block'"><span class="brand-lockup__fallback">DIAMONDS<br>ROASTERY</span></span>`;
  const productImage = (product, className = '') => `<figure class="product-photo ${className}"><img src="${esc(product.image)}" alt="${esc(product.name)}" loading="lazy" decoding="async"><span class="product-photo__offline"><b>${esc(product.name)}</b><small>oficiálna produktová fotografia</small></span></figure>`;

  const questions = [
    {id:'prep', eyebrow:'1 z 4 · Príprava', title:'Ako si zákazník pripravuje kávu?', help:'Najprv odfiltrujeme kávy, ktoré pri jeho príprave dávajú zmysel.', options:[
      {value:'filter',title:'Filter',description:'V60, Chemex, AeroPress',icon:'filter'}, {value:'lever',title:'Espresso',description:'Pákový kávovar',icon:'espresso'}, {value:'automatic',title:'Automat',description:'Automatický kávovar',icon:'automatic'}, {value:'moka',title:'Moka',description:'Moka kanvička',icon:'moka'}]},
    {id:'taste', eyebrow:'2 z 4 · Chuť', title:'Ktorý chuťový smer mu je najbližší?', help:'Jednoduché chute namiesto odborných výrazov.', options:[
      {value:'chocolate',title:'Sladká a čokoládová',description:'Kakao, orechy, karamel',icon:'chocolate',productId:'brazil-fazenda'}, {value:'balanced',title:'Vyvážená',description:'Čistá a univerzálna',icon:'balanced',productId:'kumanday'}, {value:'fruity',title:'Ovocná a svieža',description:'Výraznejší pôvod',icon:'fruity',productId:'kenya-mugaya'}]},
    {id:'drink', eyebrow:'3 z 4 · Spôsob pitia', title:'Pije ju čiernu alebo s mliekom?', help:'Mlieko potrebuje profil, ktorý sa v nápoji nestratí.', options:[
      {value:'black',title:'Čiernu',description:'Chcem cítiť kávu naplno',icon:'black'}, {value:'milk',title:'S mliekom',description:'Cappuccino alebo flat white',icon:'milk'}, {value:'both',title:'Oboje',description:'Striedam podľa nálady',icon:'both'}]},
    {id:'direction', eyebrow:'4 z 4 · Charakter', title:'Ako odvážne chce ísť pri výbere?', help:'Diamonds používa aj vlastný Funky faktor. Preto tu rozlišujeme istotu, objavovanie a decaf.', options:[
      {value:'classic',title:'Bezpečná klasika',description:'Sladká, čistá, menej divoká',icon:'classic',productId:'kumanday'}, {value:'explore',title:'Chcem objavovať',description:'Ovocnejší a výraznejší profil',icon:'explore',productId:'kenya-mugaya'}, {value:'decaf',title:'Bez kofeínu',description:'Plná chuť aj bez kofeínu',icon:'decaf',productId:'el-buho'}]}
  ];

  const state = {open:false,mode:'chat',step:0,answers:{},result:null,alternative:null,chat:[{role:'assistant',content:config.welcome}],scrollY:0};
  const products = config.products;
  const findProduct = id => products.find(p => p.id === id);

  root.innerHTML = `
    <main class="diamonds-page">
      <header class="site-head"><a href="${esc(config.shopUrl)}" target="_blank" rel="noreferrer">${officialLogo()}</a><span class="owner-label"><i></i>Personalizovaná ukážka pre majiteľa</span></header>
      <section class="owner-hero">
        <div class="owner-copy">
          <h1>Vitajte vo vašom návrhu AI poradcu pre Diamonds Roastery.</h1>
          <p>Ukážka, ako môže zákazníkovi vysvetliť rozdiely medzi výberovými kávami a doviesť ho ku konkrétnemu produktu.</p>
          <div class="hero-actions"><button id="heroOpen" class="button-primary">Otvoriť návrh poradcu ${icon('arrow')}</button><button id="heroAdvisor" class="button-secondary">Prejsť na výber kávy</button></div>
          <div class="owner-benefits"><article><b>Pomoc pri orientácii</b><span>Rozdiely medzi pôvodmi a spracovaním bez odbornej bariéry.</span></article><article><b>Menej otázok</b><span>Poradca odpovedá na prípravu, aciditu aj chuť.</span></article><article><b>Konkrétny produkt</b><span>Výber končí konkrétnou kávou z aktuálnej ponuky.</span></article></div>
        </div>
        <div class="hero-media">
          <div class="hero-media__frame">
            ${productImage(findProduct('kumanday'),'hero-photo')}
            <div class="hero-media__caption"><span>Takto môže skončiť výber</span><b>Kolumbia Kumanday Reserve</b><small>Karamel · kakao · sladký citrus</small></div>
          </div>
          <div class="hero-media__rail">${['brazil-fazenda','kenya-mugaya'].map(id=>productImage(findProduct(id),'rail-photo')).join('')}</div>
        </div>
      </section>
      <section class="owner-strip"><div><span>Chat</span><b>Odpovie na konkrétnu otázku.</b></div><div><span>Výber kávy</span><b>Štyri rozhodnutia → jeden produkt.</b></div><a href="${esc(config.mojChatbotUrl)}" target="_blank" rel="noreferrer">Ukážka od Môj Chatbot ${icon('arrow')}</a></section>
    </main>

    <div class="launcher" id="launcher"><div class="teaser" id="teaser"><button id="teaserClose" type="button" aria-label="Skryť">${icon('close')}</button><strong>Pomôžem vybrať správnu kávu.</strong><span>Chat alebo 4-krokový výber.</span></div><button id="launcherButton" class="launcher-button" type="button" aria-label="Otvoriť poradcu" aria-expanded="false">${advisorMark()}<i></i></button></div>

    <section class="widget" id="widget" aria-label="Diamonds Roastery poradca" aria-hidden="true">
      <header class="widget-head"><div class="widget-brand"><span class="widget-mark">${advisorMark()}</span><span><b>Diamonds poradca</b><small><i></i> ukážka pre váš e-shop</small></span></div><div class="head-actions"><button id="resetAll" type="button" aria-label="Začať odznova">${icon('reset')}</button><button id="closeWidget" type="button" aria-label="Zavrieť">${icon('close')}</button></div></header>
      <nav class="mode-switch" data-mode="chat"><button data-mode="chat" class="is-active" type="button">${icon('chat')}<span><b>Chat</b><small>Opýtať sa</small></span></button><button data-mode="advisor" type="button">${icon('select')}<span><b>Výber kávy</b><small>4 kroky</small></span></button></nav>
      <div class="widget-stage">
        <section class="screen is-active chat-screen" id="chatScreen">
          <div class="welcome-card"><span class="welcome-mark">${advisorMark()}</span><div><small>Diamonds poradca</small><h2>Otázka alebo osobný výber?</h2><p>Spýtajte sa na kávu, alebo nechajte poradcu zúžiť ponuku cez štyri krátke rozhodnutia.</p></div></div>
          <button class="advisor-entry" id="openAdvisor" type="button"><span>${icon('select')}</span><div><small>Najrýchlejšia cesta k produktu</small><b>Nájsť kávu podľa chuti</b><em>4 kroky · približne minúta</em></div>${icon('arrow')}</button>
          <div class="chat-messages" id="chatMessages" aria-live="polite"></div>
          <div class="chat-bottom"><div class="quick-grid" id="quickChips"></div><form id="chatForm" class="composer"><input id="chatInput" autocomplete="off" placeholder="Opýtajte sa na kávu…" aria-label="Otázka o káve"><button type="submit" aria-label="Odoslať">${icon('send')}</button></form><a class="widget-credit" href="${esc(config.mojChatbotUrl)}" target="_blank" rel="noreferrer">Ukážka od Môj Chatbot ${icon('arrow')}</a></div>
        </section>
        <section class="screen advisor-screen" id="advisorScreen"><header class="advisor-top"><button id="backButton" type="button">${icon('back')} Späť</button><div class="progress"><span id="progressFill"></span></div><span id="progressText">1 / 4</span></header><div class="advisor-content" id="advisorContent"></div></section>
      </div>
    </section>`;

  window.DIAMONDS_APP = {root,config,$,$$,esc,icon,advisorMark,officialLogo,productImage,questions,state,products,findProduct};
})();
