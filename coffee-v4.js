(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const path = (d, extra = '') => `<path d="${d}" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`;
  const icon = (body, viewBox = '0 0 24 24') => `<svg viewBox="${viewBox}" fill="none" aria-hidden="true">${body}</svg>`;

  const icons = {
    brand: `<svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <path d="M8 15.5C8 9.7 12.7 5 18.5 5h11C35.3 5 40 9.7 40 15.5v12C40 33.3 35.3 38 29.5 38H23l-7.5 5v-5C11.2 36.7 8 32.7 8 28V15.5Z" fill="currentColor" opacity=".2"/>
      <path d="M17.3 24.2c0-7.5 4.7-13 10.6-13 4.6 0 8.1 3.5 8.1 8.4 0 7.1-5.4 13.4-11.9 14.1-3.8.4-6.8-3.6-6.8-9.5Z" stroke="currentColor" stroke-width="2.6"/>
      <path d="M22.6 31c5.9-4.4 8.1-10.1 7.8-16.6" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/>
      <path d="M12.6 12.6c2.1-2 4.6-3.1 7.4-3.5" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" opacity=".8"/>
      <path d="M35.5 32.5 39 36" stroke="currentColor" stroke-width="2.3" stroke-linecap="round"/>
    </svg>`,
    refresh: icon(path('M20 11a8 8 0 1 0-2.34 5.66') + path('M20 5v6h-6')),
    close: icon(path('m6 6 12 12M18 6 6 18')),
    back: icon(path('m15 18-6-6 6-6')),
    next: icon(path('m9 18 6-6-6-6')),
    send: icon(path('m4 4 16 8-16 8 3-8-3-8Z') + path('M7 12h13')),
    spark: icon(path('M12 3 14 9l6 2-6 2-2 6-2-6-6-2 6-2 2-6Z') + path('M19 3v4M21 5h-4')),
    check: icon(path('m5 12 4 4L19 6')),
    machine: icon('<rect x="4" y="3" width="16" height="15" rx="3" stroke="currentColor" stroke-width="1.9"/>' + path('M8 7h8M8 11h5v3H8zM7 21h10M17 10v5')),
    lever: icon(path('M5 20h14M7 20V9h10v11M9 9V5h6v4M15 12h4M19 12v5') + '<path d="M9 14h6v3H9z" stroke="currentColor" stroke-width="1.9"/>'),
    moka: icon(path('m8 3 8 1 2 6-2 11H8L6 10l2-7Z') + path('M7 10h10M9 5h6M18 8h2.5v6H18')),
    filter: icon(path('M6 4h12l-2 10H8L6 4Z') + path('M9 18h6M12 14v4M8 4l4 10 4-10')),
    gentle: icon(path('M4 14c4-1 4-7 8-8 4-1 4 5 8 4M5 18h14')),
    balanced: icon(path('M12 3v18M5 7h14M6 7l-3 7h6L6 7Zm12 0-3 7h6l-3-7Z')),
    strong: icon(path('M8 21c-2-4 1-6 2-9 1-2 0-5 2-9 4 4 5 7 4 10 3-1 4-2 4-4 3 6 0 12-6 12H8Z')),
    unsure: icon('<circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.9"/>' + path('M9.8 9a2.3 2.3 0 1 1 3.7 1.8c-.9.6-1.5 1-1.5 2.2M12 17h.01')),
    black: icon(path('M5 8h12v7a5 5 0 0 1-5 5h-2a5 5 0 0 1-5-5V8ZM17 10h2a2 2 0 0 1 0 4h-2M8 4c0 1 1 1 1 2M12 4c0 1 1 1 1 2')),
    milk: icon(path('M7 3h10l1 4v14H6V7l1-4ZM6 8h12M9 12c2 2 4 2 6 0')),
    both: icon('<path d="M4 6h7v12H4zM13 6h7v12h-7z" stroke="currentColor" stroke-width="1.9"/>' + path('M6 9h3M15 9h3M6 13h3M15 13h3')),
    classic: icon(path('m13 2-7 11h6l-1 9 7-12h-6l1-8Z')),
    decaf: icon(path('M20 15.5A8 8 0 1 1 8.5 4 7 7 0 0 0 20 15.5ZM15 5h.01M18 8h.01')),
    either: icon(path('M5 8h14M5 16h14M16 5l3 3-3 3M8 13l-3 3 3 3')),
    cart: icon(path('M4 5h2l2 10h9l2-7H7M10 20h.01M17 20h.01'))
  };

  const products = [
    {id:'brazil', name:'Brazil Santos', short:'BRAZIL', origin:'100 % Arabica', packClass:'', prices:{250:9.90,500:18.50,1000:34.90}, prep:['automatic','lever','moka','filter'], taste:['gentle','unsure'], drink:['black','both'], caffeine:['classic','either'], tags:['čokoláda','kakao','nízka acidita'], reason:'Jemná a sladšia arabica s minimálnou kyslosťou. Bezpečná voľba na každý deň.'},
    {id:'paganini', name:'Paganini blend', short:'PAGANINI', origin:'75 % Arabica · 25 % Robusta', packClass:'coffee-pack--gold', prices:{250:11.90,500:21.50,1000:39.90}, prep:['automatic','lever','moka'], taste:['balanced','unsure'], drink:['milk','black','both'], caffeine:['classic','either'], tags:['čokoláda','mandle','krémová'], reason:'Vyvážená a univerzálna zmes, ktorá funguje čierna aj s mliekom.'},
    {id:'puccini', name:'Puccini blend', short:'PUCCINI', origin:'60 % Arabica · 40 % Robusta', packClass:'coffee-pack--coral', prices:{250:11.50,500:20.90,1000:38.90}, prep:['automatic','lever','moka'], taste:['strong','balanced'], drink:['milk','both'], caffeine:['classic','either'], tags:['tmavá čokoláda','silná','hustá kréma'], reason:'Výrazná zmes s hustou krémou, ktorá sa nestratí ani v cappuccine.'},
    {id:'cuba', name:'Cuba Serrano', short:'CUBA', origin:'100 % Arabica', packClass:'coffee-pack--gold', prices:{250:12.90,500:23.50,1000:43.90}, prep:['lever','moka','filter'], taste:['gentle','balanced'], drink:['black'], caffeine:['classic','either'], tags:['kakao','orechy','bez acidity'], reason:'Plná arabica bez výraznej acidity pre milovníkov čiernej kávy.'},
    {id:'decaf', name:'Bezkofeínová Brazil', short:'DECAF', origin:'100 % Arabica · bez kofeínu', packClass:'coffee-pack--coral', prices:{250:12.90,500:23.90,1000:44.90}, prep:['automatic','lever','moka','filter'], taste:['gentle','balanced','unsure'], drink:['black','milk','both'], caffeine:['decaf'], tags:['bez kofeínu','jemná','na večer'], reason:'Plná chuť kávy bez povzbudivého účinku. Vhodná aj večer.'}
  ];

  const questions = [
    {key:'prep', name:'Príprava', title:'Ako kávu najčastejšie pripravujete?', help:'Vyberte zariadenie, ktoré používate najviac.', intro:'Spôsob prípravy najviac ovplyvní, ktorá káva sa rozvinie správne.', options:[
      ['automatic','machine','Automatický kávovar','Stlačím tlačidlo a káva je hotová'],
      ['lever','lever','Pákový kávovar','Espresso pripravujem ručne'],
      ['moka','moka','Moka kanvička','Výrazná domáca káva na sporáku'],
      ['filter','filter','Filter alebo zalievanie','V60, French press alebo klasické zalievanie']
    ]},
    {key:'taste', name:'Chuť', title:'Aká chuť vám sedí najviac?', help:'Nemusíte poznať odborné názvy. Stačí pocit.', intro:'Chuťový profil zúži výber na kávy, ktoré vám budú príjemné aj dlhodobo.', options:[
      ['gentle','gentle','Jemná a sladšia','Čokoláda, kakao, minimum horkosti'],
      ['balanced','balanced','Vyvážená','Plná chuť bez extrémov'],
      ['strong','strong','Silná a výrazná','Hustá kréma a intenzívnejší dojem'],
      ['unsure','unsure','Neviem to pomenovať','Vyberte mi bezpečnú univerzálnu voľbu']
    ]},
    {key:'drink', name:'Nápoj', title:'Ako ju pijete najčastejšie?', help:'Mlieko môže prekryť jemnejšie chuťové tóny.', intro:'Podľa mlieka alebo čiernej kávy upravíme intenzitu aj zloženie.', options:[
      ['black','black','Čiernu','Espresso, lungo alebo filtrovanú'],
      ['milk','milk','S mliekom','Cappuccino, flat white alebo latte'],
      ['both','both','Striedam oboje','Potrebujem univerzálnu kávu']
    ]},
    {key:'caffeine', name:'Kofeín', title:'Klasickú alebo bezkofeínovú?', help:'Posledná odpoveď a odporúčanie je hotové.', intro:'Posledný detail. Potom porovnáme všetky vhodné kávy.', options:[
      ['classic','classic','Klasickú','Bežná káva s kofeínom'],
      ['decaf','decaf','Bezkofeínovú','Na večer alebo bez povzbudenia'],
      ['either','either','Je mi to jedno','Rozhodnite hlavne podľa chuti']
    ]}
  ];

  const state = {
    screen:'chat',
    step:0,
    answers:{},
    ranking:[],
    product:null,
    weight:null,
    chatInitialized:false
  };

  const widget = $('#widget');
  const launcher = $('#launcher');
  const launcherLabel = $('#launcherLabel');
  const chatPanel = $('#chatPanel');
  const advisorPanel = $('#advisorPanel');
  const chatMessages = $('#chatMessages');
  const quickChips = $('#quickChips');
  const advisorBody = $('#advisorBody');
  const progressTrack = $('#progressTrack');
  const nextBtn = $('#nextBtn');
  const prevBtn = $('#prevBtn');
  const footerStatus = $('#footerStatus');

  const money = (value) => `${value.toFixed(2).replace('.', ',')} €`;
  const now = () => new Intl.DateTimeFormat('sk-SK',{hour:'2-digit',minute:'2-digit'}).format(new Date());
  const scrollBottom = (el) => requestAnimationFrame(() => { el.scrollTop = el.scrollHeight; });

  function initIcons(root = document){
    $$('[data-brand]', root).forEach(el => { el.innerHTML = icons.brand; });
    $$('[data-icon]', root).forEach(el => { el.innerHTML = icons[el.dataset.icon] || ''; });
  }
  initIcons();

  function openWidget(){
    widget.classList.add('is-open');
    widget.setAttribute('aria-hidden','false');
    launcher.style.display='none';
    if(!state.chatInitialized){
      initChat();
      state.chatInitialized=true;
    }
  }
  function closeWidget(){
    widget.classList.remove('is-open');
    widget.setAttribute('aria-hidden','true');
    launcher.style.display='flex';
    setTimeout(() => launcherLabel.classList.add('is-visible'), 350);
  }

  function switchPanel(target, direction='forward'){
    const to = target === 'chat' ? chatPanel : advisorPanel;
    const from = state.screen === 'chat' ? chatPanel : advisorPanel;
    if(to === from) return;
    from.classList.remove('panel--active','panel--forward','panel--back');
    to.classList.add('panel--active', direction === 'back' ? 'panel--back' : 'panel--forward');
    state.screen = target;
    setTimeout(() => to.classList.remove('panel--forward','panel--back'), 460);
  }

  function messageMarkup(text, user=false, typing=false){
    return `<div class="message ${user?'message--user':''}">
      ${user?'':`<span class="message__avatar">${icons.brand}</span>`}
      <div class="message__stack"><div class="message__bubble ${typing?'typing-bubble':''}">${typing?'<i></i><i></i><i></i>':text}</div>${typing?'':`<span class="message__time">${now()}</span>`}</div>
    </div>`;
  }

  function addMessage(text, user=false){
    chatMessages.insertAdjacentHTML('beforeend', messageMarkup(text,user));
    scrollBottom(chatMessages);
  }

  function addBotReply(text, delay=420){
    const typingId = `typing-${Date.now()}`;
    chatMessages.insertAdjacentHTML('beforeend', `<div id="${typingId}">${messageMarkup('',false,true)}</div>`);
    scrollBottom(chatMessages);
    setTimeout(() => {
      const node = document.getElementById(typingId);
      if(node) node.outerHTML = messageMarkup(text,false);
      scrollBottom(chatMessages);
    }, delay);
  }

  function initChat(){
    chatMessages.innerHTML='';
    addMessage('Dobrý deň. Pomôžem vám s výberom kávy, prípravou aj bežnými otázkami. Pre presné odporúčanie otvorte samostatný výber vyššie.');
    renderQuickChips();
  }

  const quickQuestions = ['Káva do automatu','Čo na cappuccino?','Nechcem kyslú kávu','Máte bezkofeínovú?'];
  function renderQuickChips(){
    quickChips.innerHTML = quickQuestions.map(q=>`<button class="quick-chip" type="button"><span>${q}</span></button>`).join('');
    $$('.quick-chip',quickChips).forEach(btn=>btn.addEventListener('click',()=>handleChatQuestion(btn.textContent.trim())));
  }

  function chatAnswer(text){
    const q=text.toLowerCase();
    if(q.includes('automat')) return 'Do automatického kávovaru je bezpečná voľba Brazil Santos alebo Paganini. Brazil je jemnejšia, Paganini má plnšiu krému.';
    if(q.includes('cappuccino')||q.includes('mlie')) return 'Do cappuccina odporúčam Puccini alebo Paganini. Obe kávy sa v mlieku nestratia a zostanú chuťovo výrazné.';
    if(q.includes('kysl')) return 'Vyberajte kávy s tónmi čokolády, kakaa a orechov. Brazil Santos a Cuba Serrano majú nízku aciditu.';
    if(q.includes('bez kof')||q.includes('bezkof')) return 'Áno. Bezkofeínová Brazil má jemný profil a je vhodná aj večer. Chuťovo nepôsobí prázdno ani vodnato.';
    if(q.includes('dopr')) return 'Doprava je v tejto ukážke len ilustračná. Na reálnom e-shope môže poradca odpovedať podľa skutočných podmienok firmy.';
    if(q.includes('mlet')) return 'Mletie musí zodpovedať príprave. Na espresso jemnejšie, na filter hrubšie. Najistejšie je uviesť typ kávovaru pri objednávke.';
    return 'Najpresnejšie odporúčanie získate cez samostatný výber kávy. Trvá približne minútu a výsledok prispôsobí vašej príprave aj chuti.';
  }

  function handleChatQuestion(text){
    if(!text.trim()) return;
    addMessage(text,true);
    addBotReply(chatAnswer(text),500);
  }

  function openAdvisor(){
    renderAdvisor();
    switchPanel('advisor','forward');
  }
  function backToChat(){
    switchPanel('chat','back');
  }

  function renderProgress(){
    const current = Math.min(state.step,3);
    progressTrack.innerHTML = Array.from({length:4},(_,i)=>`<span class="progress-segment ${i<=current?'is-on':''}"><i></i></span>`).join('');
    $('#stepLabel').textContent = state.step < 4 ? `Krok ${state.step+1} zo 4` : (state.product ? 'Výber balenia' : 'Odporúčanie');
    $('#stepName').textContent = state.step < 4 ? questions[state.step].name : (state.product ? 'Hmotnosť' : 'Výsledok');
  }

  function renderAdvisor(){
    renderProgress();
    if(state.step < 4) renderQuestion();
    else if(!state.product) renderResults();
    else if(!state.weight) renderWeights();
    else renderCheckout();
  }

  function renderQuestion(){
    const q=questions[state.step];
    const chosen=state.answers[q.key];
    advisorBody.innerHTML=`
      <div class="advisor-intro"><span class="advisor-intro__logo">${icons.brand}</span><div><b>${q.name}</b><span>${q.intro}</span></div></div>
      <div class="question-head"><h2>${q.title}</h2><p>${q.help}</p></div>
      <div class="option-grid ${chosen?'has-selection':''}">
        ${q.options.map(([value,iconName,title,desc])=>`
          <button class="option-card ${chosen===value?'is-selected':''}" type="button" data-value="${value}">
            <span class="option-card__icon">${icons[iconName]}</span>
            <span class="option-card__copy"><b>${title}</b><small>${desc}</small></span>
            <span class="option-card__chevron">${icons.next}</span>
            <span class="option-card__check">${icons.check}</span>
          </button>`).join('')}
      </div>`;
    $$('.option-card',advisorBody).forEach(btn=>btn.addEventListener('click',()=>selectAnswer(q.key,btn.dataset.value)));
    prevBtn.disabled=state.step===0;
    nextBtn.disabled=!chosen;
    nextBtn.innerHTML=`Pokračovať ${icons.next}`;
    footerStatus.textContent=chosen?'Možnosť je uložená':'Vyberte jednu možnosť';
    scrollBottom(advisorBody);
  }

  function selectAnswer(key,value){
    state.answers[key]=value;
    renderQuestion();
  }

  function rankProducts(){
    return products.map(product=>{
      let score=52;
      if(product.prep.includes(state.answers.prep)) score+=16;
      if(product.taste.includes(state.answers.taste)) score+=15;
      if(product.drink.includes(state.answers.drink)) score+=11;
      if(product.caffeine.includes(state.answers.caffeine)) score+=16;
      if(state.answers.caffeine==='decaf' && product.id!=='decaf') score-=45;
      if(state.answers.caffeine!=='decaf' && product.id==='decaf') score-=20;
      return {...product,score:Math.max(52,Math.min(98,score))};
    }).sort((a,b)=>b.score-a.score);
  }

  function packMarkup(product, extra=''){
    return `<div class="coffee-pack ${product.packClass} ${extra}"><strong>${product.short}</strong><small>${product.origin}</small><i></i></div>`;
  }

  function renderResults(){
    state.ranking=rankProducts();
    const [top,...alts]=state.ranking;
    advisorBody.innerHTML=`
      <div class="result-heading"><span>Výber je hotový</span><h2>Najlepšie vám sadne ${top.name}.</h2><p>Porovnali sme prípravu, chuť, spôsob pitia aj kofeín.</p></div>
      <article class="recommendation-hero">
        <div class="recommendation-top">
          ${packMarkup(top)}
          <div class="recommendation-info">
            <div class="match-block">
              <div class="match-ring"><svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="28"></circle><circle cx="32" cy="32" r="28" style="stroke-dashoffset:${(176*(1-top.score/100)).toFixed(1)}"></circle></svg><b>${top.score}%</b></div>
              <div class="match-copy"><span>Zhoda s výberom</span><strong>Najlepšia voľba</strong></div>
            </div>
            <h3>${top.name}</h3><span class="origin">${top.origin}</span>
            <p>${top.reason}</p>
            <div class="taste-tags">${top.tags.map(tag=>`<span>${tag}</span>`).join('')}</div>
          </div>
        </div>
        <div class="recommendation-footer"><div class="recommendation-price"><b>${money(top.prices[250])}</b><span>balenie 250 g</span></div><button class="choose-product" type="button" data-product="${top.id}"><span>Vybrať túto kávu</span></button></div>
      </article>
      <div class="alternatives">
        ${alts.slice(0,2).map((p,i)=>`<button class="alternative-card" type="button" data-product="${p.id}"><span class="alternative-card__top"><span class="mini-pack">${p.short}</span><b>${p.score}%</b></span><h4>${p.name}</h4><p>${p.reason}</p></button>`).join('')}
      </div>`;
    $$('[data-product]',advisorBody).forEach(btn=>btn.addEventListener('click',()=>selectProduct(btn.dataset.product)));
    prevBtn.disabled=false;
    nextBtn.disabled=true;
    nextBtn.innerHTML=`Pokračovať ${icons.next}`;
    footerStatus.textContent='Vyberte odporúčanú kávu';
    scrollBottom(advisorBody);
  }

  function selectProduct(id){
    state.product=products.find(p=>p.id===id)||null;
    state.weight=null;
    renderAdvisor();
  }

  function renderWeights(){
    const p=state.product;
    advisorBody.innerHTML=`
      <div class="weight-heading"><h2>Aké balenie vám vyhovuje?</h2><p>Cena sa aktualizuje okamžite. Najčastejšia voľba je 500 g.</p></div>
      <div class="selected-product-strip"><span class="mini-pack">${p.short}</span><span><b>${p.name}</b><span>${p.origin}</span></span><strong>${money(p.prices[state.weight || 250])}</strong></div>
      <div class="weight-grid">
        ${[
          [250,'Na ochutnanie','weight-pack--250'],
          [500,'Najčastejšia voľba','weight-pack--500'],
          [1000,'Najvýhodnejšie','weight-pack--1000']
        ].map(([grams,desc,sizeClass])=>`<button class="weight-card ${state.weight===grams?'is-selected':''}" type="button" data-weight="${grams}">${grams===500?'<span class="weight-card__badge">Odporúčame</span>':''}<span class="weight-pack ${sizeClass}"></span><b>${grams===1000?'1 kg':grams+' g'}</b><small>${desc}</small><strong>${money(p.prices[grams])}</strong></button>`).join('')}
      </div>`;
    $$('.weight-card',advisorBody).forEach(btn=>btn.addEventListener('click',()=>{state.weight=Number(btn.dataset.weight);renderWeights();}));
    prevBtn.disabled=false;
    nextBtn.disabled=!state.weight;
    nextBtn.innerHTML=`Rekapitulácia ${icons.next}`;
    footerStatus.textContent=state.weight?'Balenie je uložené':'Vyberte hmotnosť';
    scrollBottom(advisorBody);
  }

  function renderCheckout(){
    const p=state.product;
    advisorBody.innerHTML=`
      <article class="checkout-card">
        <div class="checkout-card__top">${packMarkup(p)}<div><h2>Vaša káva je pripravená</h2><p>Skontrolujte produkt, balenie a cenu pred vložením do košíka.</p></div></div>
        <div class="checkout-lines"><div class="checkout-line"><span>Káva</span><b>${p.name}</b></div><div class="checkout-line"><span>Balenie</span><b>${state.weight===1000?'1 kg':state.weight+' g'}</b></div><div class="checkout-line"><span>Chuť</span><b>${p.tags.slice(0,2).join(' · ')}</b></div></div>
        <div class="checkout-total"><span>Celková cena</span><strong>${money(p.prices[state.weight])}</strong></div>
        <button class="checkout-button" id="finishOrder" type="button">Pridať do košíka</button>
      </article>`;
    $('#finishOrder').addEventListener('click',renderSuccess);
    prevBtn.disabled=false;
    nextBtn.disabled=true;
    footerStatus.textContent='Skontrolujte rekapituláciu';
    scrollBottom(advisorBody);
  }

  function renderSuccess(){
    const p=state.product;
    advisorBody.innerHTML=`
      <div class="success-state"><span class="success-icon">${icons.check}</span><h2>Káva je v košíku.</h2><p>Výber zostal uložený. Môžete pokračovať v nákupe alebo sa vrátiť do chatu.</p><div class="success-summary"><b>${p.name} · ${state.weight===1000?'1 kg':state.weight+' g'}</b><span>${money(p.prices[state.weight])}</span></div><div class="success-actions"><button id="successChat" type="button">Späť do chatu</button><button id="successRestart" type="button">Nový výber</button></div></div>`;
    $('#successChat').addEventListener('click',backToChat);
    $('#successRestart').addEventListener('click',resetAdvisor);
    prevBtn.disabled=true;
    nextBtn.disabled=true;
    footerStatus.textContent='Hotovo';
    scrollBottom(advisorBody);
  }

  function goNext(){
    if(state.step<4){
      if(!state.answers[questions[state.step].key]) return;
      state.step+=1;
      if(state.step===4){state.ranking=rankProducts();}
      renderAdvisor();
      return;
    }
    if(state.product && state.weight) renderCheckout();
  }

  function goPrev(){
    if(state.step<4){
      if(state.step>0){state.step-=1;renderAdvisor();}
      return;
    }
    if(state.product && state.weight){state.weight=null;renderAdvisor();return;}
    if(state.product){state.product=null;renderAdvisor();return;}
    state.step=3;renderAdvisor();
  }

  function resetAdvisor(){
    state.step=0;
    state.answers={};
    state.ranking=[];
    state.product=null;
    state.weight=null;
    renderAdvisor();
  }

  $('#openWidget').addEventListener('click',openWidget);
  $('#launcherLabel').addEventListener('click',openWidget);
  $('#heroOpen').addEventListener('click',openWidget);
  $('#closeWidget').addEventListener('click',closeWidget);
  $('#openAdvisor').addEventListener('click',openAdvisor);
  $('#quickAdvisor').addEventListener('click',openAdvisor);
  $('#backToChat').addEventListener('click',backToChat);
  $('#resetAdvisor').addEventListener('click',resetAdvisor);
  $('#resetChat').addEventListener('click',initChat);
  nextBtn.addEventListener('click',goNext);
  prevBtn.addEventListener('click',goPrev);
  $('#chatForm').addEventListener('submit',(event)=>{
    event.preventDefault();
    const input=$('#chatInput');
    const value=input.value.trim();
    if(!value) return;
    input.value='';
    handleChatQuestion(value);
  });

  setTimeout(()=>launcherLabel.classList.add('is-visible'),900);
})();
