(() => {
  'use strict';

  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const svg = (body, viewBox = '0 0 24 24') => `<svg viewBox="${viewBox}" fill="none" aria-hidden="true">${body}</svg>`;
  const stroke = (d, extra = '') => `<path d="${d}" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`;

  const icons = {
    brand: `<svg viewBox="0 0 48 48" fill="none" aria-hidden="true"><circle cx="24" cy="24" r="21" fill="#F7F1E8" stroke="currentColor" stroke-width="1.5"/><path d="M16 27.5c0-9 5.2-15.5 11.8-15.5 5.1 0 9 4 9 9.5 0 8.4-6.3 15.6-13.8 16.2-4.1.4-7-4-7-10.2Z" fill="currentColor" opacity=".95"/><path d="M22.4 34.2c6.7-5 9.1-11.2 8.7-18.5" stroke="#F7F1E8" stroke-width="2.6" stroke-linecap="round"/><path d="M12 18.4c4.2 1.2 7.1 4 8.2 8.1M12.5 14.1c5.2.7 8.8 3.7 10.1 8.5" stroke="#DF6947" stroke-width="1.8" stroke-linecap="round"/></svg>`,
    refresh: svg(stroke('M20 11a8 8 0 1 0-2.3 5.7') + stroke('M20 5v6h-6')),
    close: svg(stroke('m6 6 12 12M18 6 6 18')),
    back: svg(stroke('m15 18-6-6 6-6')),
    next: svg(stroke('m9 18 6-6-6-6')),
    send: svg(stroke('m4 4 16 8-16 8 3-8-3-8Z') + stroke('M7 12h13')),
    check: svg(stroke('m5 12 4 4L19 6')),
    chat: svg(stroke('M5 18.5 3.5 21v-5A8.5 8.5 0 1 1 12 20.5c-2.7 0-5.1-.7-7-2Z') + stroke('M8 12h.01M12 12h.01M16 12h.01')),
    spark: svg(stroke('M12 3l1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5L12 3Z') + stroke('M19 16l.7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7L19 16Z')),
  };

  $$('[data-brand-symbol]').forEach((el) => { el.innerHTML = icons.brand; });
  $$('[data-icon]').forEach((el) => { el.innerHTML = icons[el.dataset.icon] || ''; });

  const photos = {
    automatic: 'https://images.unsplash.com/photo-1649882453801-d5f84502c3f0?auto=format&fit=crop&q=78&w=320',
    lever: 'https://images.unsplash.com/photo-1769625602704-f75f361892bf?auto=format&fit=crop&q=78&w=320',
    moka: 'https://images.unsplash.com/photo-1748010445321-6255efc521d2?auto=format&fit=crop&q=78&w=320',
    filter: 'https://images.unsplash.com/photo-1743584643724-95eb6e62d065?auto=format&fit=crop&q=78&w=320',
    gentle: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=78&w=320',
    balanced: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=78&w=320',
    strong: 'https://images.unsplash.com/photo-1512568400610-62da28bc8a13?auto=format&fit=crop&q=78&w=320',
    unsure: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&q=78&w=320',
    black: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=78&w=320',
    milk: 'https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&q=78&w=320',
    both: 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?auto=format&fit=crop&q=78&w=320',
    classic: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&q=78&w=320',
    decaf: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=78&w=320',
    either: 'https://images.unsplash.com/photo-1459755486867-b55449bb39ff?auto=format&fit=crop&q=78&w=320',
  };

  const questions = [
    {key:'prep', name:'Príprava', title:'Ako kávu najčastejšie pripravujete?', help:'Vyberte zariadenie, ktoré používate najviac.', options:[
      ['automatic','Automatický kávovar','Stlačím tlačidlo a káva je hotová'],
      ['lever','Pákový kávovar','Espresso pripravujem ručne'],
      ['moka','Moka kanvička','Výrazná domáca káva na sporáku'],
      ['filter','Filter alebo zalievanie','V60, French press alebo klasické zalievanie'],
    ]},
    {key:'taste', name:'Chuť', title:'Aká chuť vám sedí najviac?', help:'Nemusíte poznať odborné názvy. Stačí pocit.', options:[
      ['gentle','Jemná a sladšia','Čokoláda, kakao, minimum horkosti'],
      ['balanced','Vyvážená','Plná chuť bez extrémov'],
      ['strong','Silná a výrazná','Hustá kréma a intenzívnejší dojem'],
      ['unsure','Neviem to pomenovať','Vyberte mi bezpečnú univerzálnu voľbu'],
    ]},
    {key:'drink', name:'Nápoj', title:'Ako ju pijete najčastejšie?', help:'Mlieko dokáže prekryť jemnejšie chuťové tóny.', options:[
      ['black','Čiernu','Espresso, lungo alebo filtrovanú'],
      ['milk','S mliekom','Cappuccino, flat white alebo latte'],
      ['both','Striedam oboje','Potrebujem univerzálnu kávu'],
    ]},
    {key:'caffeine', name:'Kofeín', title:'Klasickú alebo bezkofeínovú?', help:'Posledná odpoveď a pripravíme odporúčanie.', options:[
      ['classic','Klasickú','Bežná káva s kofeínom'],
      ['decaf','Bezkofeínovú','Na večer alebo bez povzbudenia'],
      ['either','Je mi to jedno','Rozhodnite hlavne podľa chuti'],
    ]},
  ];

  const products = [
    {id:'paganini',name:'Paganini blend',short:'PAGANINI',origin:'75 % Arabica · 25 % Robusta',price:{250:11.9,500:21.5,1000:39.9},prep:['automatic','lever','moka'],taste:['balanced','unsure'],drink:['milk','black','both'],caffeine:['classic','either'],tags:['čokoláda','mandle','krémová'],reason:'Vyvážená a univerzálna káva, ktorá funguje čierna aj s mliekom.',pack:'green'},
    {id:'brazil',name:'Brazil Santos',short:'BRAZIL',origin:'100 % Arabica',price:{250:9.9,500:18.5,1000:34.9},prep:['automatic','lever','moka','filter'],taste:['gentle','unsure'],drink:['black','both'],caffeine:['classic','either'],tags:['kakao','sladká','nízka acidita'],reason:'Jemná a sladšia arabica s minimálnou kyslosťou.',pack:'gold'},
    {id:'puccini',name:'Puccini blend',short:'PUCCINI',origin:'60 % Arabica · 40 % Robusta',price:{250:11.5,500:20.9,1000:38.9},prep:['automatic','lever','moka'],taste:['strong','balanced'],drink:['milk','both'],caffeine:['classic','either'],tags:['tmavá čokoláda','silná','hustá kréma'],reason:'Výrazná zmes, ktorá sa nestratí ani v cappuccine.',pack:'orange'},
    {id:'cuba',name:'Cuba Serrano',short:'CUBA',origin:'100 % Arabica',price:{250:12.9,500:23.5,1000:43.9},prep:['lever','moka','filter'],taste:['gentle','balanced'],drink:['black'],caffeine:['classic','either'],tags:['kakao','orechy','bez acidity'],reason:'Plná arabica bez výraznej acidity pre čiernu kávu.',pack:'green'},
    {id:'decaf',name:'Bezkofeínová Brazil',short:'DECAF',origin:'100 % Arabica · bez kofeínu',price:{250:12.9,500:23.9,1000:44.9},prep:['automatic','lever','moka','filter'],taste:['gentle','balanced','unsure'],drink:['black','milk','both'],caffeine:['decaf'],tags:['bez kofeínu','jemná','na večer'],reason:'Chuť kávy bez povzbudivého účinku, vhodná aj večer.',pack:'orange'},
  ];

  const state = {mode:'chat', step:0, answers:{}, selectedProduct:null, weight:null, stage:'questions'};
  const widget = $('#widget');
  const launcher = $('#launcher');
  const modeSwitch = $('#modeSwitch');
  const chatScreen = $('#chatScreen');
  const advisorScreen = $('#advisorScreen');
  const chatMessages = $('#chatMessages');
  const quickChips = $('#quickChips');
  const advisorBody = $('#advisorBody');
  const prevBtn = $('#prevBtn');
  const nextBtn = $('#nextBtn');
  const footerStatus = $('#footerStatus');

  const money = (n) => `${n.toFixed(2).replace('.', ',')} €`;
  const now = () => new Date().toLocaleTimeString('sk-SK',{hour:'2-digit',minute:'2-digit'});
  const scrollBottom = (el) => requestAnimationFrame(() => { el.scrollTop = el.scrollHeight; });
  const brandAvatar = () => `<span class="message-avatar">${icons.brand}</span>`;

  function openWidget(){
    widget.classList.add('open');
    widget.setAttribute('aria-hidden','false');
    launcher.style.display='none';
    document.documentElement.classList.add('widget-open');
    document.body.classList.add('widget-open');
  }
  function closeWidget(){
    widget.classList.remove('open');
    widget.setAttribute('aria-hidden','true');
    launcher.style.display='flex';
    document.documentElement.classList.remove('widget-open');
    document.body.classList.remove('widget-open');
  }

  function setMode(mode){
    state.mode=mode;
    modeSwitch.classList.toggle('advisor-active',mode==='advisor');
    $$('.mode-button').forEach(btn=>btn.classList.toggle('active',btn.dataset.mode===mode));
    chatScreen.classList.toggle('active',mode==='chat');
    advisorScreen.classList.toggle('active',mode==='advisor');
    if(mode==='advisor') renderAdvisor();
    else setTimeout(()=>$('#chatInput').focus(),100);
  }

  function addMessage(text,user=false){
    const row=document.createElement('div');
    row.className=`message${user?' user':''}`;
    row.innerHTML=`${user?'':brandAvatar()}<div class="message-stack"><div class="bubble">${text}</div><div class="timestamp">${now()}</div></div>`;
    chatMessages.appendChild(row);
    scrollBottom(chatMessages);
  }
  function showTyping(){
    const row=document.createElement('div');
    row.className='message'; row.id='typingRow';
    row.innerHTML=`${brandAvatar()}<div class="message-stack"><div class="bubble typing-bubble"><i></i><i></i><i></i></div></div>`;
    chatMessages.appendChild(row); scrollBottom(chatMessages);
  }
  function hideTyping(){ $('#typingRow')?.remove(); }

  const quickQuestions=['Káva do automatu','Nechcem kyslú kávu','Káva na cappuccino','Bezkofeínová káva'];
  function renderQuickChips(){
    quickChips.innerHTML=quickQuestions.map(q=>`<button class="quick-chip" type="button"><span>${q}</span></button>`).join('');
    $$('.quick-chip',quickChips).forEach(btn=>btn.addEventListener('click',()=>sendChat(btn.textContent.trim())));
  }
  function answerFor(text){
    const t=text.toLowerCase();
    if(t.includes('automat')) return 'Do automatu je bezpečná voľba <b>Paganini</b>. Má stabilnú krému, vyváženú chuť a funguje čierna aj s mliekom.';
    if(t.includes('kysl')) return 'Hľadajte Brazil Santos alebo Cuba Serrano. Obe sú čokoládové a majú nízku aciditu.';
    if(t.includes('capp')||t.includes('mlie')) return 'Do cappuccina odporúčame Puccini alebo Paganini. Majú plnšie telo a v mlieku sa nestratia.';
    if(t.includes('bez')||t.includes('večer')) return 'Bezkofeínová Brazil je jemná, vhodná aj večer a funguje v automate, páke aj moka kanvičke.';
    if(t.includes('mlet')) return 'Mletie vyberte podľa prípravy: jemné na espresso, stredné na moka kanvičku a hrubšie na filter alebo French press.';
    return 'Najpresnejšie odporúčanie získate vo výbere kávy. Zohľadní spôsob prípravy, chuť, mlieko aj kofeín.';
  }
  function sendChat(text){
    const clean=text.trim(); if(!clean) return;
    addMessage(clean,true); $('#chatInput').value=''; showTyping();
    setTimeout(()=>{hideTyping();addMessage(answerFor(clean));},520);
  }
  function resetChat(){
    chatMessages.innerHTML='';
    addMessage('Dobrý deň. Pomôžeme vám vybrať kávu podľa chuti, kávovaru alebo spôsobu prípravy.');
    renderQuickChips();
  }

  function updateProgress(){
    $('#stepLabel').textContent=state.stage==='questions'?`Krok ${state.step+1} zo 4`:(state.stage==='results'?'Odporúčanie':state.stage==='weight'?'Balenie':'Rekapitulácia');
    $('#stepName').textContent=state.stage==='questions'?questions[state.step].name:(state.stage==='results'?'Výsledok':state.stage==='weight'?'Hmotnosť':'Objednávka');
    $('#progress').innerHTML=Array.from({length:4},(_,i)=>`<i class="${i<state.step?'done active':i===state.step?'active':''}"></i>`).join('');
  }
  function optionCard(value,title,desc,selected){
    return `<button class="option-card ${selected?'selected':''}" type="button" data-value="${value}"><span class="option-photo"><img src="${photos[value]}" alt="" loading="lazy"></span><span class="option-copy"><b>${title}</b><small>${desc}</small></span><span class="option-check">${selected?icons.check:icons.next}</span></button>`;
  }
  function renderQuestion(){
    const q=questions[state.step], selected=state.answers[q.key];
    advisorBody.innerHTML=`<div class="question-intro"><span class="question-kicker">${q.name}</span><h2>${q.title}</h2><p>${q.help}</p></div><div class="options">${q.options.map(o=>optionCard(o[0],o[1],o[2],selected===o[0])).join('')}</div>${selected?`<div class="selection-message"><i>${icons.check}</i> Vybrané. Môžete pokračovať.</div>`:''}`;
    $$('.option-card',advisorBody).forEach(btn=>btn.addEventListener('click',()=>{
      state.answers[q.key]=btn.dataset.value;
      renderQuestion(); updateFooter();
    }));
    updateFooter();
  }
  function scoreProduct(p){
    let score=58;
    if(p.prep.includes(state.answers.prep)) score+=13;
    if(p.taste.includes(state.answers.taste)) score+=13;
    if(p.drink.includes(state.answers.drink)) score+=10;
    if(p.caffeine.includes(state.answers.caffeine)) score+=12;
    return Math.min(98,score);
  }
  function rankedProducts(){return products.map(p=>({...p,match:scoreProduct(p)})).sort((a,b)=>b.match-a.match);}
  function packClass(p){return p.pack==='orange'?'orange':p.pack==='gold'?'gold':'';}
  function packMarkup(p,mini=false){return mini?`<span class="mini-pack ${packClass(p)}">${p.short}</span>`:`<div class="product-pack ${packClass(p)}"><span>PRAŽIARNIČKA</span><b>${p.short}</b><small>${p.origin}</small></div>`;}
  function renderResults(){
    const ranked=rankedProducts(), top=ranked[0], alts=ranked.slice(1,3);
    advisorBody.innerHTML=`<section class="result-hero"><span class="result-eyebrow">Výber je hotový</span><h2>Najlepšie vám sadne ${top.name}.</h2><p>Odporúčanie vychádza zo spôsobu prípravy, chute, mlieka a kofeínu.</p></section><article class="featured-product">${packMarkup(top)}<div class="featured-copy"><span class="match-badge"><i></i>${top.match} % zhoda</span><h3>${top.name}</h3><span>${top.origin}</span><div class="reason-box">${top.reason}</div><div class="taste-tags">${top.tags.map(t=>`<span>${t}</span>`).join('')}</div><button class="select-product-button" type="button" data-product="${top.id}"><span>Vybrať túto kávu</span></button></div></article><h3 class="alternatives-title">Ďalšie vhodné možnosti</h3>${alts.map(p=>`<button class="alternative-card" type="button" data-product="${p.id}">${packMarkup(p,true)}<span><b>${p.name}</b><small>${p.reason}</small></span><span class="alt-match">${p.match} %</span></button>`).join('')}`;
    $$('[data-product]',advisorBody).forEach(btn=>btn.addEventListener('click',()=>{state.selectedProduct=products.find(p=>p.id===btn.dataset.product);state.stage='weight';state.weight=null;renderAdvisor();}));
    updateFooter();
  }
  function renderWeight(){
    const p=state.selectedProduct;
    advisorBody.innerHTML=`<div class="question-intro"><span class="question-kicker">Balenie</span><h2>Akú hmotnosť si želáte?</h2><p>Cena sa prepočíta okamžite podľa zvoleného balenia.</p></div><div class="weight-grid">${[250,500,1000].map(w=>`<button class="weight-card ${state.weight===w?'selected':''}" type="button" data-weight="${w}"><span class="weight-pack"></span><b>${w===1000?'1 kg':`${w} g`}</b><small>${w===250?'Na ochutnanie':w===500?'Najčastejšia voľba':'Najvýhodnejšie'}</small><strong>${money(p.price[w])}</strong></button>`).join('')}</div>`;
    $$('.weight-card',advisorBody).forEach(btn=>btn.addEventListener('click',()=>{state.weight=Number(btn.dataset.weight);renderWeight();updateFooter();}));
    updateFooter();
  }
  function renderReview(){
    const p=state.selectedProduct,w=state.weight;
    advisorBody.innerHTML=`<div class="question-intro"><span class="question-kicker">Rekapitulácia</span><h2>Skontrolujte výber.</h2><p>Produkt môžete vložiť do košíka jedným kliknutím.</p></div><section class="review-card"><div class="review-product">${packMarkup(p)}<div><h3>${p.name}</h3><p>${p.origin}</p></div></div><div class="summary-lines"><div class="summary-line"><span>Balenie</span><b>${w===1000?'1 kg':`${w} g`}</b></div><div class="summary-line"><span>Praženie</span><b>Čerstvo pražená</b></div><div class="summary-line total"><span>Spolu</span><b>${money(p.price[w])}</b></div></div><button class="confirm-button" id="confirmOrder" type="button">Pridať do košíka</button></section>`;
    $('#confirmOrder').addEventListener('click',()=>{state.stage='success';renderAdvisor();});
    updateFooter();
  }
  function renderSuccess(){
    advisorBody.innerHTML=`<section class="success-card"><div><span class="success-icon">${icons.check}</span><h2>Káva je pripravená v košíku.</h2><p>${state.selectedProduct.name}, ${state.weight===1000?'1 kg':`${state.weight} g`}.</p><button id="restartAdvisor" type="button">Vybrať inú kávu</button></div></section>`;
    $('#restartAdvisor').addEventListener('click',resetAdvisor);
    updateFooter();
  }
  function updateFooter(){
    const question=questions[state.step];
    prevBtn.style.visibility=(state.stage==='questions'&&state.step===0)?'hidden':'visible';
    if(state.stage==='questions'){
      nextBtn.style.display='inline-flex'; nextBtn.textContent=state.step===3?'Zobraziť odporúčanie':'Pokračovať';
      nextBtn.insertAdjacentHTML('beforeend',icons.next);
      nextBtn.disabled=!state.answers[question.key]; footerStatus.textContent=nextBtn.disabled?'Vyberte jednu možnosť':'Výber je uložený';
    }else if(state.stage==='results'){
      nextBtn.style.display='none'; footerStatus.textContent='Vyberte odporúčanú kávu';
    }else if(state.stage==='weight'){
      nextBtn.style.display='inline-flex'; nextBtn.innerHTML=`Pokračovať ${icons.next}`;nextBtn.disabled=!state.weight;footerStatus.textContent=state.weight?'Balenie je vybrané':'Vyberte hmotnosť';
    }else if(state.stage==='review'){
      nextBtn.style.display='none';footerStatus.textContent='';
    }else{
      nextBtn.style.display='none';prevBtn.style.visibility='hidden';footerStatus.textContent='';
    }
  }
  function renderAdvisor(){
    updateProgress();
    if(state.stage==='questions')renderQuestion();
    else if(state.stage==='results')renderResults();
    else if(state.stage==='weight')renderWeight();
    else if(state.stage==='review')renderReview();
    else renderSuccess();
    advisorBody.scrollTop=0;
  }
  function nextAdvisor(){
    if(state.stage==='questions'){
      if(!state.answers[questions[state.step].key])return;
      if(state.step<3){state.step++;renderAdvisor();}
      else{state.stage='results';renderAdvisor();}
    }else if(state.stage==='weight'&&state.weight){state.stage='review';renderAdvisor();}
  }
  function prevAdvisor(){
    if(state.stage==='questions'&&state.step>0){state.step--;renderAdvisor();}
    else if(state.stage==='results'){state.step=3;state.stage='questions';renderAdvisor();}
    else if(state.stage==='weight'){state.stage='results';renderAdvisor();}
    else if(state.stage==='review'){state.stage='weight';renderAdvisor();}
  }
  function resetAdvisor(){state.step=0;state.answers={};state.selectedProduct=null;state.weight=null;state.stage='questions';renderAdvisor();}
  function resetAll(){resetChat();resetAdvisor();setMode('chat');}

  $('#openWidget').addEventListener('click',openWidget);
  $('#launcherLabel').addEventListener('click',openWidget);
  $('#heroOpen').addEventListener('click',openWidget);
  $('#closeWidget').addEventListener('click',closeWidget);
  $('#resetAll').addEventListener('click',resetAll);
  $('#openAdvisor').addEventListener('click',()=>setMode('advisor'));
  $$('.mode-button').forEach(btn=>btn.addEventListener('click',()=>setMode(btn.dataset.mode)));
  $('#chatForm').addEventListener('submit',(e)=>{e.preventDefault();sendChat($('#chatInput').value);});
  nextBtn.addEventListener('click',nextAdvisor);
  prevBtn.addEventListener('click',prevAdvisor);

  resetChat();
  renderAdvisor();
})();
