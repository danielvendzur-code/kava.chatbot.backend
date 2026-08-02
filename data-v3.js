(() => {
  'use strict';

  const icon = (body, viewBox = '0 0 24 24') => `<svg viewBox="${viewBox}" fill="none" aria-hidden="true">${body}</svg>`;
  const path = (d, extra = '') => `<path d="${d}" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`;

  window.BEANO_ICONS = {
    brand: `<svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <path d="M8 13.5A8.5 8.5 0 0 1 16.5 5h15A8.5 8.5 0 0 1 40 13.5v12A8.5 8.5 0 0 1 31.5 34H25l-8.8 7v-7A8.4 8.4 0 0 1 8 25.5v-12Z" fill="currentColor" opacity=".18"/>
      <path d="M16 22.4c0-7.2 4.4-12.5 10-12.5 4.5 0 7.8 3.4 7.8 8 0 6.9-5.2 12.9-11.4 13.5-3.7.4-6.4-3.3-6.4-9Z" stroke="currentColor" stroke-width="2.8"/>
      <path d="M21.2 29c5.6-4.2 7.8-9.6 7.5-15.8" stroke="currentColor" stroke-width="2.8" stroke-linecap="round"/>
      <path d="M31 30.5 35 34.5" stroke="currentColor" stroke-width="2.8" stroke-linecap="round"/>
    </svg>`,
    refresh: icon(path('M20 11a8 8 0 1 0-2.3 5.7') + path('M20 5v6h-6')),
    close: icon(path('m6 6 12 12M18 6 6 18')),
    back: icon(path('m15 18-6-6 6-6')),
    next: icon(path('m9 18 6-6-6-6')),
    send: icon(path('m4 4 16 8-16 8 3-8-3-8Z') + path('M7 12h13')),
    spark: icon(path('M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8') + '<circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.9"/>'),
    check: icon(path('m5 12 4 4L19 6')),
    machine: icon('<rect x="4" y="3" width="16" height="15" rx="3" stroke="currentColor" stroke-width="1.9"/>' + path('M8 7h8M8 11h5v3H8zM7 21h10M17 10v5')),
    lever: icon(path('M5 20h14M7 20V9h10v11M9 9V5h6v4M15 12h4M19 12v5') + '<path d="M9 14h6v3H9z" stroke="currentColor" stroke-width="1.9"/>'),
    moka: icon(path('m8 3 8 1 2 6-2 11H8L6 10l2-7Z') + path('M7 10h10M9 5h6M18 8h2.5v6H18')),
    filter: icon(path('M6 4h12l-2 10H8L6 4Z') + path('M9 18h6M12 14v4M8 4l4 10 4-10')),
    gentle: icon(path('M4 15c3-1 4-6 8-8 3-1 5 3 8 3') + path('M5 19h14')),
    balanced: icon(path('M12 3v18M5 7h14M6 7l-3 7h6L6 7Zm12 0-3 7h6l-3-7Z')),
    strong: icon(path('M8 21c-2-4 1-6 2-9 1-2 0-5 2-9 4 4 5 7 4 10 3-1 4-2 4-4 3 6 0 12-6 12H8Z')),
    unsure: icon('<circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.9"/>' + path('M9.8 9a2.3 2.3 0 1 1 3.7 1.8c-.9.6-1.5 1-1.5 2.2M12 17h.01')),
    black: icon(path('M5 8h12v7a5 5 0 0 1-5 5h-2a5 5 0 0 1-5-5V8ZM17 10h2a2 2 0 0 1 0 4h-2M8 4c0 1 1 1 1 2M12 4c0 1 1 1 1 2')),
    milk: icon(path('M7 3h10l1 4v14H6V7l1-4ZM6 8h12M9 12c2 2 4 2 6 0')),
    both: icon('<path d="M4 6h7v12H4zM13 6h7v12h-7z" stroke="currentColor" stroke-width="1.9"/>' + path('M6 9h3M15 9h3M6 13h3M15 13h3')),
    classic: icon(path('m13 2-7 11h6l-1 9 7-12h-6l1-8Z')),
    decaf: icon(path('M20 15.5A8 8 0 1 1 8.5 4 7 7 0 0 0 20 15.5ZM15 5h.01M18 8h.01')),
    either: icon(path('M5 8h14M5 16h14M16 5l3 3-3 3M8 13l-3 3 3 3'))
  };

  window.BEANO_MASCOT = (pose = 'idle') => `<span class="mascot-stage" data-pose="${pose}">
    <svg class="mascot-svg" viewBox="0 0 78 78" fill="none" aria-hidden="true">
      <ellipse cx="39" cy="70" rx="22" ry="4.5" fill="#123f36" opacity=".13"/>
      <g class="head">
        <path d="M21 38c0-18 11-31 25-31 11 0 20 8.7 20 20.6 0 17.1-13.1 31.7-29.1 33-9 .7-15.9-8.6-15.9-22.6Z" fill="#71412D"/>
        <path d="M27 43c0-12.8 7.7-22 17.5-22 7.5 0 13.4 5.5 13.4 13.7 0 11.7-8.8 21.7-19.7 22.6C31.8 57.8 27 52 27 43Z" fill="#A6633F"/>
        <path d="M33 13c8.8 7.8 13.1 17.1 11.3 29.1" stroke="#F5C96B" stroke-width="3.2" stroke-linecap="round" opacity=".95"/>
        <g class="eye"><circle cx="37" cy="35" r="2.4" fill="#fff"/><circle cx="51" cy="35" r="2.4" fill="#fff"/><circle cx="37" cy="35" r="1.1" fill="#163F35"/><circle cx="51" cy="35" r="1.1" fill="#163F35"/></g>
        <path d="M40 43c2.7 2.1 5.5 2.1 8.2 0" stroke="#fff" stroke-width="2.1" stroke-linecap="round"/>
      </g>
      <path d="M30 52c8-4.8 16-4.8 24 0v11.2c-8.8 5.5-17.4 5.5-24 0V52Z" fill="#F06F42"/>
      <path d="M33 55h18" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".62"/>
      <path d="M34 64v5M50 64v5" stroke="#71412D" stroke-width="4.2" stroke-linecap="round"/>
      <path d="M27 47c-6.8 1.4-9 6.2-6 11" stroke="#71412D" stroke-width="4.2" stroke-linecap="round"/>
      <g class="arm-wave"><path d="M58 46c6-2 8.5-7 6-11" stroke="#71412D" stroke-width="4.2" stroke-linecap="round"/><circle cx="64" cy="34" r="3.2" fill="#A6633F"/></g>
      <path d="M55 54h9v8h-9z" fill="#fff"/><path d="M64 56h2.7a2.5 2.5 0 0 1 0 5H64" stroke="#fff" stroke-width="2"/>
      <path d="M58 51c0-1 1-1.4 1-2.4M62 51c0-1 1-1.4 1-2.4" stroke="#F5C96B" stroke-width="1.5" stroke-linecap="round"/>
    </svg>
  </span>`;

  window.BEANO_PRODUCTS = [
    {id:'paganini',name:'Paganini blend',short:'PAGANINI',origin:'75 % Arabica · 25 % Robusta',price:{250:11.9,500:21.5,1000:39.9},prep:['automatic','lever','moka'],taste:['balanced','unsure'],drink:['milk','black','both'],caffeine:['classic','either'],tags:['čokoláda','mandle','krémová'],reason:'Vyvážená a univerzálna káva, ktorá funguje čierna aj s mliekom.',why:'Má dosť tela do mlieka, ale zostáva príjemná aj ako čisté espresso.'},
    {id:'brazil',name:'Brazil Santos',short:'BRAZIL',origin:'100 % Arabica',price:{250:9.9,500:18.5,1000:34.9},prep:['automatic','lever','moka','filter'],taste:['gentle','unsure'],drink:['black','both'],caffeine:['classic','either'],tags:['kakao','sladká','nízka acidita'],reason:'Jemná a sladšia arabica s minimálnou kyslosťou.',why:'Je bezpečná pre ľudí, ktorí nechcú ovocnú aciditu ani výraznú horkosť.'},
    {id:'puccini',name:'Puccini blend',short:'PUCCINI',origin:'60 % Arabica · 40 % Robusta',price:{250:11.5,500:20.9,1000:38.9},prep:['automatic','lever','moka'],taste:['strong','balanced'],drink:['milk','both'],caffeine:['classic','either'],tags:['tmavá čokoláda','silná','hustá kréma'],reason:'Výrazná zmes, ktorá sa nestratí ani v cappuccine.',why:'Vyšší podiel robusty pridá krému, silu a chuť, ktorú mlieko neprekryje.'},
    {id:'cuba',name:'Cuba Serrano',short:'CUBA',origin:'100 % Arabica',price:{250:12.9,500:23.5,1000:43.9},prep:['lever','moka','filter'],taste:['gentle','balanced'],drink:['black'],caffeine:['classic','either'],tags:['kakao','orechy','bez acidity'],reason:'Plná arabica bez výraznej acidity pre čiernu kávu.',why:'Má elegantnú, plnú chuť a veľmi nízku kyslosť bez potreby mlieka.'},
    {id:'decaf',name:'Bezkofeínová Brazil',short:'DECAF',origin:'100 % Arabica · bez kofeínu',price:{250:12.9,500:23.9,1000:44.9},prep:['automatic','lever','moka','filter'],taste:['gentle','balanced','unsure'],drink:['black','milk','both'],caffeine:['decaf'],tags:['bez kofeínu','jemná','na večer'],reason:'Chuť kávy bez povzbudivého účinku, vhodná aj večer.',why:'Zostáva jemná a čokoládová, ale bez kofeínu a zbytočného kompromisu v chuti.'}
  ];

  window.BEANO_QUESTIONS = [
    {key:'prep',name:'Príprava',kicker:'Začíname',title:'Ako kávu najčastejšie pripravujete?',help:'Vyberte zariadenie, ktoré používate najviac.',guide:'Začnime prípravou. Tá rozhoduje, ako sa chuť kávy rozvinie.',options:[['automatic','machine','Automatický kávovar','Stlačím tlačidlo a káva je hotová'],['lever','lever','Pákový kávovar','Espresso pripravujem ručne'],['moka','moka','Moka kanvička','Výrazná domáca káva na sporáku'],['filter','filter','Filter alebo zalievanie','V60, French press alebo klasické zalievanie']]},
    {key:'taste',name:'Chuť',kicker:'Chuťový profil',title:'Aká chuť vám sedí najviac?',help:'Nemusíte poznať odborné názvy. Stačí pocit.',guide:'Teraz doladíme chuť. Neexistuje zlá odpoveď.',options:[['gentle','gentle','Jemná a sladšia','Čokoláda, kakao, minimum horkosti'],['balanced','balanced','Vyvážená','Plná chuť bez extrémov'],['strong','strong','Silná a výrazná','Hustá kréma a intenzívnejší dojem'],['unsure','unsure','Neviem to pomenovať','Vyberte mi bezpečnú univerzálnu voľbu']]},
    {key:'drink',name:'Nápoj',kicker:'Spôsob pitia',title:'Ako ju pijete najčastejšie?',help:'Mlieko dokáže prekryť jemnejšie chuťové tóny.',guide:'Mlieko vie odporúčanie dosť zmeniť, preto je táto otázka dôležitá.',options:[['black','black','Čiernu','Espresso, lungo alebo filtrovanú'],['milk','milk','S mliekom','Cappuccino, flat white alebo latte'],['both','both','Striedam oboje','Potrebujem univerzálnu kávu']]},
    {key:'caffeine',name:'Kofeín',kicker:'Posledný krok',title:'Klasickú alebo bezkofeínovú?',help:'Po tejto odpovedi pripravím konkrétne odporúčanie.',guide:'Už iba posledná drobnosť a môžem porovnať vhodné kávy.',options:[['classic','classic','Klasickú','Bežná káva s kofeínom'],['decaf','decaf','Bezkofeínovú','Na večer alebo bez povzbudenia'],['either','either','Je mi to jedno','Rozhodnite hlavne podľa chuti']]}
  ];
})();
