(() => {
  'use strict';
  const root = document.querySelector('#praziarnicka-root');
  if (!root) return;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (v = '') => String(v).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const path = d => `<path d="${d}" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>`;
  const icon = d => `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">${d}</svg>`;
  const I = {
    chat: icon(path('M5 18.5 3.5 21v-5A8.5 8.5 0 1 1 12 20.5c-2.7 0-5.1-.7-7-2Z') + path('M8 12h.01M12 12h.01M16 12h.01')),
    bean: icon(path('M7 19c-2-4 1-7 3-10 1-2 1-4 2-6 5 4 7 8 5 12 2-1 3-3 3-5 2 6-2 11-7 11H7Z')),
    close: icon(path('m6 6 12 12M18 6 6 18')),
    reset: icon(path('M20 11a8 8 0 1 0-2.3 5.7') + path('M20 5v6h-6')),
    send: icon(path('m4 4 16 8-16 8 3-8-3-8Z') + path('M7 12h13')),
    arrow: icon(path('m9 18 6-6-6-6')),
    back: icon(path('m15 18-6-6 6-6')),
    check: icon(path('m5 12 4 4L19 6')),
    automatic: icon(path('M5 3h14v18H5zM8 7h8M8 11h8M9 15h6v3H9z')),
    lever: icon(path('M5 4h11v7H5zM8 11v8M13 11v8M5 19h11M16 7h5')),
    moka: icon(path('M8 3h8l2 6-2 12H8L6 9l2-6ZM6 9h12')),
    filter: icon(path('M5 4h14l-5 8v7l-4 2v-9L5 4Z')),
    chocolate: icon(path('M5 5h14v14H5zM10 5v14M14 5v14M5 10h14M5 14h14')),
    balanced: icon(path('M12 3v18M5 7h14M6 7l-3 7h6L6 7Zm12 0-3 7h6l-3-7Z')),
    fruity: icon(path('M12 7c4-3 7 0 7 4 0 5-3 9-7 10-4-1-7-5-7-10 0-4 3-7 7-4ZM12 7c0-2 1-4 4-5')),
    strong: icon(path('m13 2-7 11h6l-1 9 7-12h-6l1-8Z')),
    black: icon(path('M5 8h12v7a5 5 0 0 1-5 5h-2a5 5 0 0 1-5-5V8ZM17 10h2a2 2 0 0 1 0 4h-2')),
    milk: icon(path('M7 3h10l1 4v14H6V7l1-4ZM6 8h12M9 12c2 2 4 2 6 0')),
    both: icon(path('M4 6h7v12H4zM13 6h7v12h-7z')),
    classic: icon(path('M12 3v18M7 8h10M8 13h8')),
    decaf: icon(path('M20 15.5A8 8 0 1 1 8.5 4 7 7 0 0 0 20 15.5Z')),
    shop: icon(path('M4 9h16l-1 11H5L4 9ZM7 9V6a5 5 0 0 1 10 0v3'))
  };
  const mark = (cls = '') => `<svg class="pz-mark ${cls}" viewBox="0 0 64 64" fill="none" aria-hidden="true"><path d="M32 6C17 6 7 15.5 7 28.8c0 7.4 3.5 13.6 9.2 17.8L14 56l10.2-5.1c2.4.7 5 1.1 7.8 1.1 15 0 25-9.7 25-23.2S47 6 32 6Z" fill="currentColor"/><path d="M25 36c0-9.5 5.2-16 12.4-16 5.4 0 9.3 4.2 9.3 9.8 0 8.5-6.2 15.1-13.9 15.7C28.3 45.8 25 41.6 25 36Z" fill="var(--pz-paper)"/><path d="M30 41c5.8-4.8 8-10.8 7.8-17.3" stroke="var(--pz-accent)" stroke-width="3.4" stroke-linecap="round"/></svg>`;
  const asset = name => `/assets/praziarnicka/${name}`;
  const products = [
    {id:'brazil',name:'Brazil Santos',price:'od 9,90 €',origin:'Brazília · 100 % Arabica',tags:['oriešky','čokoláda','nízka acidita'],prep:['automatic','lever','moka','filter'],taste:['chocolate','balanced'],drink:['black','both'],caffeine:['classic'],image:asset('result-filter.webp'),url:'https://praziarnicka.sk/produkt/brazil-santos-100-arabica',reason:'Pokojný, krémový profil s čokoládou a orechmi. Dáva zmysel zákazníkovi, ktorý chce každodennú kávu bez ostrej acidity.'},
    {id:'paganini',name:'Paganini blend',price:'od 11,90 €',origin:'75 % Arabica · 25 % Robusta',tags:['čokoláda','mandle','plné telo'],prep:['automatic','lever','moka'],taste:['balanced','strong','chocolate'],drink:['milk','black','both'],caffeine:['classic'],image:asset('result-espresso.webp'),url:'https://praziarnicka.sk/produkt/paganini-blend-75-arabica-25-robusta',reason:'Plnšie espresso, ktoré ostane čitateľné aj v cappuccine. Dobrá voľba pre automat a klasické espresso.'},
    {id:'puccini',name:'Puccini blend',price:'od 11,50 €',origin:'60 % Arabica · 40 % Robusta',tags:['výrazná','krémová','do mlieka'],prep:['automatic','lever','moka'],taste:['strong','balanced'],drink:['milk','both'],caffeine:['classic'],image:asset('result-espresso.webp'),url:'https://praziarnicka.sk/produkt/puccini-60arabica-40-robusta',reason:'Výraznejšia zmes s telom, ktorá sa nestratí v latte alebo cappuccine.'},
    {id:'cuba',name:'Cuba Serrano Lavado',price:'od 12,90 €',origin:'Kuba · 100 % Arabica',tags:['kakao','orechy','bez ostrej acidity'],prep:['lever','moka','filter'],taste:['chocolate','balanced'],drink:['black'],caffeine:['classic'],image:asset('result-filter.webp'),url:'https://praziarnicka.sk/produkt/cuba-serrano-lavado-100-arabica',reason:'Kakaové telo a orechová dochuť pre zákazníka, ktorý chce čiernu kávu bez ovocnej ostrosti.'},
    {id:'decaf',name:'Bezkofeínová Brazil',price:'od 12,90 €',origin:'Brazília · bez kofeínu',tags:['bez kofeínu','jemná','na večer'],prep:['automatic','lever','moka','filter'],taste:['chocolate','balanced'],drink:['black','milk','both'],caffeine:['decaf'],image:asset('result-decaf.webp'),url:'https://praziarnicka.sk/produkt/bezkofeinova-kava-brazil-100-arabica',reason:'Plnohodnotná bezkofeínová voľba pre večer alebo pre zákazníka, ktorý nechce povzbudivý účinok.'}
  ];
  const questions = [
    {key:'prep',name:'Príprava',title:'Ako si kávu pripravujete?',hint:'Najprv vyradíme kávy, ktoré pri vašej príprave nedávajú zmysel.',options:[['automatic','Automatický kávovar','Jedno tlačidlo, stabilný výsledok','automatic','prep-automatic.webp'],['lever','Pákový kávovar','Espresso pripravujete ručne','lever','prep-lever.webp'],['moka','Moka kanvička','Výrazná domáca príprava','moka','prep-moka.webp'],['filter','Filter alebo zalievanie','V60, French press či prekvapkávanie','filter','prep-filter.webp']]},
    {key:'taste',name:'Chuť',title:'Ktorý chuťový smer vám sedí?',hint:'Jednoduché chute namiesto odbornej terminológie.',options:[['chocolate','Čokoládová a sladká','Minimum ovocnej acidity','chocolate'],['balanced','Vyvážená','Plná chuť bez extrémov','balanced'],['fruity','Sviežejšia a aromatická','Viac pôvodu a ovocnosti','fruity'],['strong','Silná a výrazná','Intenzívne telo a dochuť','strong']]},
    {key:'drink',name:'Nápoj',title:'Ako ju pijete najčastejšie?',hint:'Mlieko potrebuje viac tela, čierna káva ukáže viac detailu.',options:[['black','Čiernu','Espresso, lungo alebo filter','black'],['milk','S mliekom','Cappuccino, flat white alebo latte','milk'],['both','Striedam oboje','Potrebujem univerzálnu voľbu','both']]},
    {key:'caffeine',name:'Kofeín',title:'Klasickú alebo bezkofeínovú?',hint:'Posledný krok zabráni odporúčaniu, ktoré pre vás nedáva zmysel.',options:[['classic','Klasickú','Bežná káva s kofeínom','classic'],['decaf','Bezkofeínovú','Na večer alebo bez povzbudenia','decaf'],['either','Je mi to jedno','Rozhodnite hlavne podľa chuti','both']]}
  ];
  const state = {open:false,mode:'chat',step:0,answers:{},stage:'question',product:null,transitioning:false,chat:[]};
  function score(p){let s=0;for(const [k,v] of Object.entries(state.answers)){if((p[k]||[]).includes(v))s+=k==='caffeine'?8:k==='prep'?5:3;}if(state.answers.drink==='milk'&&p.id==='paganini')s+=4;if(state.answers.caffeine==='decaf')s+=p.id==='decaf'?20:-20;if(state.answers.taste==='strong'&&p.id==='puccini')s+=5;return s;}
  function best(){return [...products].sort((a,b)=>score(b)-score(a))[0]||products[0];}

  root.innerHTML = `
    <main class="pz-page">
      <header class="pz-page-head"><div class="pz-brand">${mark()}<span><b>Pražiarnička</b><small>návrh AI poradcu pre e-shop</small></span></div><span class="pz-badge"><i></i>Personalizovaná ukážka</span></header>
      <section class="pz-hero">
        <div class="pz-copy"><p class="pz-kicker">Návrh pre Pražiarničku</p><h1>Váš e-shop môže <em>vybrať kávu za zákazníka</em> skôr, než odíde.</h1><p class="pz-lead">Štyri krátke odpovede premenia spôsob prípravy a chuť na konkrétny produkt. Chat zároveň zvládne otázky o kyslosti, mlieku, automate aj bezkofeínovej káve.</p><div class="pz-benefits"><article><b>Menej váhania</b><span>Zákazník sa dostane ku konkrétnej káve bez preklikávania celého katalógu.</span></article><article><b>Menej opakovaných otázok</b><span>Poradca vysvetlí aciditu, prípravu a rozdiel medzi zmesami.</span></article><article><b>Priamy nákupný krok</b><span>Výsledok končí produktom a jasným pokračovaním do e-shopu.</span></article></div><div class="pz-actions"><button id="pzHeroOpen" class="pz-primary" type="button">Vyskúšať poradcu ${I.arrow}</button><span>4 otázky · konkrétny produkt</span></div></div>
        <aside class="pz-showcase"><div class="pz-photo"><img src="${asset('result-espresso.webp')}" alt="Príprava espressa"><div><small>Od prípravy k produktu</small><b>Nie zoznam. Jedno odporúčanie s dôvodom.</b></div></div><div class="pz-preview"><small>Ukážka výsledku</small><div class="pz-preview-row"><img src="${asset('result-filter.webp')}" alt="Odporúčaná káva"><span><b>Brazil Santos</b><em>čokoláda · orechy · nízka acidita</em></span></div><div class="pz-tags"><span>automat</span><span>espresso</span><span>moka</span></div></div></aside>
      </section>
      <footer class="pz-page-foot"><span>Neoficiálna personalizovaná ukážka pripravená pre Pražiarničku.</span><a href="https://mojchatbot.sk" target="_blank" rel="noreferrer">mojchatbot.sk</a></footer>
    </main>
    <div class="pz-launcher-wrap" id="pzLauncherWrap"><div class="pz-teaser"><b>Pomôžem vybrať správnu kávu.</b><span>Chat alebo 4 krátke otázky.</span></div><button class="pz-launcher" id="pzLauncher" aria-label="Otvoriť poradcu" type="button">${mark()}</button></div>
    <section class="pz-widget" id="pzWidget" role="dialog" aria-modal="true" aria-hidden="true" aria-label="Pražiarnička AI poradca">
      <header class="pz-widget-head"><div class="pz-widget-brand">${mark()}<span><b>Pražiarnička poradca</b><small><i></i> ukážka pre váš e-shop</small></span></div><div class="pz-widget-actions"><button id="pzReset" aria-label="Začať odznova" type="button">${I.reset}</button><button id="pzClose" aria-label="Zavrieť" type="button">${I.close}</button></div></header>
      <nav class="pz-switch" id="pzSwitch"><button class="is-active" data-mode="chat" type="button">${I.chat}<span><b>Chat</b><small>Opýtať sa</small></span></button><button data-mode="advisor" type="button">${I.bean}<span><b>Výber kávy</b><small>4 kroky</small></span></button></nav>
      <div class="pz-stage"><section class="pz-screen is-active" id="pzChatScreen"><div class="pz-chat" id="pzChat"></div><div class="pz-chat-bottom"><button class="pz-advisor-entry" id="pzAdvisorEntry" type="button"><span>${I.bean}</span><div><small>Najrýchlejšia cesta k produktu</small><b>Nájsť kávu podľa seba</b><em>4 otázky · konkrétny produkt</em></div>${I.arrow}</button><div class="pz-chips" id="pzChips"></div><form class="pz-composer" id="pzChatForm"><input id="pzChatInput" autocomplete="off" placeholder="Opýtajte sa na kávu…" aria-label="Otázka o káve"><button class="pz-send" type="submit" aria-label="Odoslať">${I.send}</button></form></div></section><section class="pz-screen" id="pzAdvisorScreen"><div class="pz-progress"><button id="pzBack" type="button" aria-label="Späť">${I.back}</button><div><b id="pzProgressLabel">1 / 4</b><small id="pzProgressName">Príprava</small></div><span id="pzProgressBars"></span></div><div class="pz-advisor" id="pzAdvisor"></div></section></div>
      <footer class="pz-widget-foot">Personalizovaná ukážka od <a href="https://mojchatbot.sk" target="_blank" rel="noreferrer">mojchatbot.sk</a></footer>
    </section>`;

  const widget=$('#pzWidget'), launcher=$('#pzLauncherWrap'), chat=$('#pzChat'), advisor=$('#pzAdvisor');
  function openWidget(mode='chat'){state.open=true;widget.classList.add('is-open');widget.setAttribute('aria-hidden','false');launcher.hidden=true;document.body.classList.add('pz-lock');switchMode(mode);}
  function closeWidget(){state.open=false;widget.classList.remove('is-open');widget.setAttribute('aria-hidden','true');launcher.hidden=false;document.body.classList.remove('pz-lock');}
  function switchMode(mode){state.mode=mode;$$('#pzSwitch button').forEach(b=>b.classList.toggle('is-active',b.dataset.mode===mode));$('#pzChatScreen').classList.toggle('is-active',mode==='chat');$('#pzAdvisorScreen').classList.toggle('is-active',mode==='advisor');if(mode==='advisor')renderAdvisor();}
  function seedChat(){chat.innerHTML=`<div class="pz-message"><span>${mark()}</span><p>Dobrý deň. Pomôžem vybrať kávu podľa prípravy a chuti, alebo stručne vysvetlím kyslosť, mlieko či bezkofeínovú voľbu.</p></div>`;const chips=['Káva do automatu','Nechcem kyslú','Na cappuccino','Bez kofeínu'];$('#pzChips').innerHTML=chips.map(c=>`<button class="pz-chip" type="button">${c}</button>`).join('');$$('.pz-chip').forEach(b=>b.onclick=()=>sendChat(b.textContent));}
  function canned(q){q=q.toLowerCase();if(q.includes('automat'))return 'Do automatu by som začal Brazil Santos alebo Paganini. Brazil je jemnejšia a čokoládová, Paganini má viac tela.';if(q.includes('kysl'))return 'Ak nechcete výraznú aciditu, Brazil Santos a Cuba Serrano sú bezpečnejší smer.';if(q.includes('capp')||q.includes('mlie'))return 'Na cappuccino je praktický Paganini blend: má plnšie telo a v mlieku sa nestratí.';if(q.includes('kofe'))return 'Bezkofeínová Brazil je voľba na večer alebo bez povzbudenia, bez potreby meniť spôsob prípravy.';return 'Najpresnejšie vás ku konkrétnej káve dovedie 4-krokový výber podľa prípravy, chuti, mlieka a kofeínu.';}
  async function sendChat(text){const value=text.trim();if(!value)return;chat.insertAdjacentHTML('beforeend',`<div class="pz-message pz-message--user"><p>${esc(value)}</p></div>`);$('#pzChatInput').value='';chat.insertAdjacentHTML('beforeend',`<div class="pz-message"><span>${mark()}</span><p>${esc(canned(value))}</p></div>`);chat.scrollTop=chat.scrollHeight;}
  function updateProgress(){const inQ=state.stage==='question';$('#pzProgressLabel').textContent=inQ?`${state.step+1} / ${questions.length}`:'Výsledok';$('#pzProgressName').textContent=inQ?questions[state.step].name:'Vaša káva';$('#pzBack').disabled=inQ&&state.step===0;$('#pzProgressBars').innerHTML=questions.map((_,i)=>`<i class="${!inQ||i<=state.step?'is-on':''}"></i>`).join('');}
  function visual(q,o){if(q.key==='prep'&&o[4])return `<span class="pz-option-photo"><img src="${asset(o[4])}" alt=""></span>`;return `<span class="pz-option-icon">${I[o[3]]||I.bean}</span>`;}
  function renderQuestion(){const q=questions[state.step],sel=state.answers[q.key];advisor.innerHTML=`<div class="pz-question"><small>${q.name}</small><h2>${q.title}</h2><p>${q.hint}</p></div><div class="pz-options">${q.options.map(o=>`<button class="pz-option ${sel===o[0]?'is-selected':''}" data-value="${o[0]}" type="button">${visual(q,o)}<span><b>${o[1]}</b><small>${o[2]}</small></span><em>${sel===o[0]?I.check:I.arrow}</em></button>`).join('')}</div>`;$$('.pz-option',advisor).forEach(b=>b.onclick=()=>selectAnswer(b.dataset.value));}
  function selectAnswer(value){if(state.transitioning)return;const q=questions[state.step];state.answers[q.key]=value;state.transitioning=true;renderQuestion();setTimeout(()=>{if(state.step<questions.length-1)state.step++;else{state.stage='result';state.product=best();}state.transitioning=false;renderAdvisor();},360);}
  function renderResult(){const p=state.product||best();advisor.innerHTML=`<div class="pz-result-head"><small>Osobné odporúčanie</small><h2>Táto káva dáva podľa vašich odpovedí najväčší zmysel.</h2></div><article class="pz-result"><div class="pz-result-product"><img src="${p.image}" alt="${esc(p.name)}"><div><small>${esc(p.origin)}</small><h3>${esc(p.name)}</h3><b>${esc(p.price)}</b><div class="pz-tags">${p.tags.map(t=>`<span>${esc(t)}</span>`).join('')}</div></div></div><div class="pz-result-reason"><small>Prečo práve táto</small><p>${esc(p.reason)}</p></div><a class="pz-result-cta" href="${esc(p.url)}" target="_blank" rel="noreferrer">Pozrieť produkt v e-shope ${I.shop}</a><button class="pz-result-secondary" id="pzRestart" type="button">Zmeniť odpovede</button></article>`;$('#pzRestart').onclick=resetAdvisor;}
  function renderAdvisor(){updateProgress();state.stage==='result'?renderResult():renderQuestion();advisor.scrollTop=0;}
  function resetAdvisor(){state.step=0;state.answers={};state.stage='question';state.product=null;state.transitioning=false;renderAdvisor();}

  $('#pzHeroOpen').onclick=()=>openWidget('chat');$('#pzLauncher').onclick=()=>openWidget('chat');$('#pzClose').onclick=closeWidget;$('#pzReset').onclick=()=>{resetAdvisor();seedChat();switchMode('chat');};$('#pzAdvisorEntry').onclick=()=>switchMode('advisor');$$('#pzSwitch button').forEach(b=>b.onclick=()=>switchMode(b.dataset.mode));$('#pzBack').onclick=()=>{if(state.stage==='result'){state.stage='question';state.step=3;state.product=null;renderAdvisor();}else if(state.step>0){state.step--;renderAdvisor();}};$('#pzChatForm').onsubmit=e=>{e.preventDefault();sendChat($('#pzChatInput').value);};document.addEventListener('keydown',e=>{if(e.key==='Escape'&&state.open)closeWidget();});
  seedChat();renderAdvisor();setTimeout(()=>$('.pz-teaser')?.classList.add('is-visible'),500);
})();