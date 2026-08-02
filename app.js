(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  const lineIcon = (paths, size = 20) => `
    <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      ${paths}
    </svg>`;
  const path = (d, extra = '') => `<path d="${d}" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`;

  const controlIcons = {
    close: lineIcon(path('M6 6 18 18M18 6 6 18'), 18),
    refresh: lineIcon(path('M20 11a8 8 0 1 0-2.35 5.66') + path('M20 5v6h-6'), 17),
    chat: lineIcon(path('M5 18.5 3.5 21v-5A8.5 8.5 0 1 1 12 20.5c-2.7 0-5.1-.7-7-2Z') + path('M8 12h.01M12 12h.01M16 12h.01'), 17),
    spark: lineIcon(path('m12 3 1.4 4.1L17.5 8.5l-4.1 1.4L12 14l-1.4-4.1-4.1-1.4 4.1-1.4L12 3Z') + path('m18.5 14 .8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2Z'), 18),
    back: lineIcon(path('m15 18-6-6 6-6'), 16),
    arrow: lineIcon(path('m9 18 6-6-6-6'), 17),
    send: lineIcon(path('m4 4 16 8-16 8 3-8-3-8Z') + path('M7 12h13'), 17),
    check: lineIcon(path('m5 12 4 4L19 6'), 20),
    cart: lineIcon(path('M4 5h2l2.2 9.2h8.9L20 8H7') + '<circle cx="10" cy="19" r="1.3" fill="currentColor"/><circle cx="17" cy="19" r="1.3" fill="currentColor"/>', 18)
  };

  const logoSvg = `
    <svg class="brand-logo" viewBox="0 0 52 52" aria-hidden="true">
      <path class="logo-bubble" d="M8 24.5C8 14.8 15.8 7 25.6 7h1.3C36.4 7 44 14.4 44 23.8c0 8-5.6 14.7-13.1 16.4L23 46v-5.2C14.5 39.5 8 32.9 8 24.5Z"/>
      <path class="logo-bean" d="M18.2 25.3c0-6.4 4.2-11.2 9.8-11.2 4.4 0 7.8 3.2 7.8 7.7 0 6.5-5 12-10.8 12.8-3.9.5-6.8-3.1-6.8-9.3Z"/>
      <path class="logo-seam" d="M23 31.4c5.5-4.2 7.7-9.6 7.4-15.3"/>
      <circle class="logo-dot" cx="18" cy="18" r="1.4"/><circle class="logo-dot" cx="22" cy="15" r="1.2"/>
    </svg>`;

  const mascotSvg = (size = 'regular') => {
    const dims = size === 'launcher' ? '92' : size === 'head' ? '60' : size === 'avatar' ? '38' : '78';
    return `
      <svg class="mascot" data-pose="idle" width="${dims}" height="${dims}" viewBox="0 0 110 118" aria-hidden="true">
        <path class="steam-one" d="M48 18c-5-5 4-8 0-14" fill="none" stroke="#f4c75f" stroke-width="4" stroke-linecap="round" opacity=".8"/>
        <path class="steam-two" d="M65 18c5-5-3-8 1-14" fill="none" stroke="#f4c75f" stroke-width="4" stroke-linecap="round" opacity=".55"/>
        <g class="arm-left">
          <path d="M28 63C17 62 13 71 16 81" fill="none" stroke="#74432d" stroke-width="9" stroke-linecap="round"/>
          <circle cx="17" cy="83" r="5" fill="#f0b27b"/>
        </g>
        <g class="arm-right">
          <path d="M81 60c12-8 19-3 19 6" fill="none" stroke="#74432d" stroke-width="9" stroke-linecap="round"/>
          <circle cx="99" cy="67" r="5" fill="#f0b27b"/>
        </g>
        <path d="M31 103c-2 6-2 9-1 12M74 103c2 6 2 9 1 12" fill="none" stroke="#4d2b20" stroke-width="8" stroke-linecap="round"/>
        <path d="M22 56c0-25 14-40 36-40 20 0 34 15 34 38 0 31-20 51-42 51-17 0-28-18-28-49Z" fill="#74432d"/>
        <path d="M29 53c1-20 12-31 29-31 14 0 24 9 27 24-9-8-19-8-27-3-11 7-14 22-10 38-12-6-20-16-19-28Z" fill="#925839" opacity=".78"/>
        <path d="M51 93c15-14 22-35 18-62" fill="none" stroke="#4c281e" stroke-width="5" stroke-linecap="round" opacity=".8"/>
        <path d="M30 78c11 6 34 7 50-2l-3 23c-13 9-31 10-43 2l-4-23Z" fill="#ed7546"/>
        <path d="M36 82c10 4 27 4 38-1" fill="none" stroke="#ffb077" stroke-width="3" stroke-linecap="round" opacity=".8"/>
        <g class="eye"><ellipse cx="43" cy="54" rx="4" ry="5" fill="#fff"/><circle cx="44" cy="55" r="2" fill="#1f2925"/></g>
        <g class="eye"><ellipse cx="69" cy="51" rx="4" ry="5" fill="#fff"/><circle cx="68" cy="52" r="2" fill="#1f2925"/></g>
        <path d="M51 66c5 4 11 3 15-1" fill="none" stroke="#2d1914" stroke-width="3" stroke-linecap="round"/>
        <circle cx="36" cy="65" r="4" fill="#e98d6d" opacity=".45"/><circle cx="75" cy="62" r="4" fill="#e98d6d" opacity=".45"/>
        <path d="M37 115h-12M82 115H70" fill="none" stroke="#2b352f" stroke-width="6" stroke-linecap="round"/>
      </svg>`;
  };

  const ill = (body) => `<svg class="icon-ill" viewBox="0 0 48 48" aria-hidden="true">${body}</svg>`;
  const optionIcons = {
    automatic: ill('<rect x="8" y="7" width="32" height="29" rx="7" class="icon-fill"/><rect x="9" y="8" width="30" height="27" rx="6" class="icon-stroke"/><path d="M14 15h20M14 21h12v8H14zM30 21h4v11M15 40h18" class="icon-stroke"/><circle cx="31" cy="15" r="2" fill="currentColor"/>'),
    lever: ill('<path d="M12 40h24M15 40V17h18v23M19 17v-7h10v7M30 23h11M41 23v11" class="icon-stroke"/><rect x="19" y="24" width="10" height="8" rx="2" class="icon-fill"/><path d="M19 24h10v8H19z" class="icon-stroke"/>'),
    moka: ill('<path d="m16 7 16 2 4 12-4 21H16l-4-21 4-14Z" class="icon-fill"/><path d="m17 7 14 2 4 12-4 20H17l-4-20 4-14ZM14 21h20M19 11h10M35 18h6v12h-6" class="icon-stroke"/>'),
    filter: ill('<path d="M12 8h24l-4 20H16L12 8Z" class="icon-fill"/><path d="M12 8h24l-4 20H16L12 8ZM18 36h12M24 28v8M16 8l8 20 8-20" class="icon-stroke"/>'),
    gentle: ill('<path d="M10 31c7-2 8-14 16-16 7-2 8 9 14 6" class="icon-stroke"/><path d="M10 36h28" class="icon-stroke"/><circle cx="16" cy="18" r="5" class="icon-fill"/>'),
    balanced: ill('<path d="M24 7v34M11 15h26M13 15 7 29h12L13 15Zm22 0-6 14h12l-6-14Z" class="icon-stroke"/><circle cx="24" cy="10" r="4" class="icon-fill"/>'),
    strong: ill('<path d="M16 41c-5-8 2-12 5-19 2-5 0-10 4-17 8 8 10 14 8 20 6-2 8-5 8-9 5 12-1 25-14 25H16Z" class="icon-fill"/><path d="M16 41c-5-8 2-12 5-19 2-5 0-10 4-17 8 8 10 14 8 20 6-2 8-5 8-9 5 12-1 25-14 25H16Z" class="icon-stroke"/>'),
    unsure: ill('<circle cx="24" cy="24" r="18" class="icon-fill"/><circle cx="24" cy="24" r="17" class="icon-stroke"/><path d="M19 19a5 5 0 1 1 8 4c-2 1-3 2-3 5M24 34h.01" class="icon-stroke"/>'),
    black: ill('<path d="M11 17h24v13a10 10 0 0 1-10 10h-4a10 10 0 0 1-10-10V17Z" class="icon-fill"/><path d="M11 17h24v13a10 10 0 0 1-10 10h-4a10 10 0 0 1-10-10V17ZM35 21h4a4 4 0 0 1 0 8h-4M17 8c0 2 2 2 2 5M25 8c0 2 2 2 2 5" class="icon-stroke"/>'),
    milk: ill('<path d="M16 7h16l3 8v27H13V15l3-8Z" class="icon-fill"/><path d="M16 7h16l3 8v27H13V15l3-8ZM13 17h22M19 25c4 4 7 4 11 0" class="icon-stroke"/>'),
    both: ill('<path d="M7 12h15v25H7zM26 12h15v25H26z" class="icon-fill"/><path d="M7 12h15v25H7zM26 12h15v25H26zM11 19h7M30 19h7M11 27h7M30 27h7" class="icon-stroke"/>'),
    classic: ill('<path d="m27 4-15 23h12l-2 17 15-25H25l2-15Z" class="icon-fill"/><path d="m27 4-15 23h12l-2 17 15-25H25l2-15Z" class="icon-stroke"/>'),
    decaf: ill('<path d="M40 31A17 17 0 1 1 17 8a15 15 0 0 0 23 23Z" class="icon-fill"/><path d="M40 31A17 17 0 1 1 17 8a15 15 0 0 0 23 23ZM31 10h.01M37 16h.01" class="icon-stroke"/>'),
    either: ill('<path d="M9 16h30M9 32h30M32 10l7 6-7 6M16 26l-7 6 7 6" class="icon-stroke"/>')
  };

  $$('.logo-slot').forEach((el) => { el.innerHTML = logoSvg; });
  $$('.mascot-slot').forEach((el) => { el.innerHTML = mascotSvg(el.dataset.mascotSize || 'regular'); });
  $$('[data-icon]').forEach((el) => { el.innerHTML = controlIcons[el.dataset.icon] || ''; });

  const products = [
    {
      id:'paganini', name:'Paganini blend', label:'PAGANINI', origin:'75 % Arabica · 25 % Robusta', matchBase:96,
      colors:['#2f7a63','#163f35'], price:{250:11.90,500:21.50,1000:39.90}, prep:['automatic','lever','moka'], drink:['milk','black','both'], caffeine:['classic','either'], taste:['balanced','unsure'],
      tags:['čokoláda','mandle','oriešky'], reason:'Vyvážená, krémová a univerzálna. Dobre funguje ako espresso aj v mliečnom nápoji.'
    },
    {
      id:'brazil', name:'Brazil Santos', label:'BRAZIL', origin:'100 % Arabica', matchBase:93,
      colors:['#d99754','#9b5c38'], price:{250:9.90,500:18.50,1000:34.90}, prep:['automatic','lever','moka','filter'], drink:['black','both'], caffeine:['classic','either'], taste:['gentle','unsure'],
      tags:['čokoláda','kakao','nízka acidita'], reason:'Jemná a prirodzene sladšia káva s minimálnou kyslosťou. Bezpečná voľba na každý deň.'
    },
    {
      id:'puccini', name:'Puccini blend', label:'PUCCINI', origin:'60 % Arabica · 40 % Robusta', matchBase:91,
      colors:['#ed7546','#a94a2e'], price:{250:11.50,500:20.90,1000:38.90}, prep:['automatic','lever','moka'], drink:['milk','both'], caffeine:['classic','either'], taste:['strong','balanced'],
      tags:['tmavá čokoláda','hustá kréma','výrazná'], reason:'Výraznejšia káva s hustou krémou. Chuť sa nestratí ani v cappuccine alebo latte.'
    },
    {
      id:'cuba', name:'Cuba Serrano Lavado', label:'CUBA', origin:'100 % Arabica', matchBase:89,
      colors:['#6b3f2b','#3e241b'], price:{250:12.90,500:23.50,1000:43.90}, prep:['lever','moka','filter'], drink:['black'], caffeine:['classic','either'], taste:['gentle','balanced'],
      tags:['kakao','vlašský orech','bez acidity'], reason:'Plná arabica s kakaovým charakterom a bez výraznej acidity. Najlepšia najmä čierna.'
    },
    {
      id:'decaf', name:'Bezkofeínová Brazil', label:'DECAF', origin:'100 % Arabica · bez kofeínu', matchBase:98,
      colors:['#7b6cb4','#4e467d'], price:{250:12.90,500:23.90,1000:44.90}, prep:['automatic','lever','moka','filter'], drink:['black','milk','both'], caffeine:['decaf'], taste:['gentle','balanced','unsure'],
      tags:['bez kofeínu','jemná','na večer'], reason:'Plná chuť kávy bez povzbudivého účinku. Vhodná na večer aj pre citlivejších zákazníkov.'
    }
  ];

  const questions = [
    {
      key:'prep', label:'Spôsob prípravy', title:'Ako kávu najčastejšie pripravujete?', help:'Vyberte zariadenie, ktoré používate najviac.',
      intro:'Začnime tým najdôležitejším. Spôsob prípravy rozhodne, ktorá káva sa otvorí najlepšie.',
      reply:'Výborne. Už viem, ako sa bude káva pripravovať.',
      options:[
        ['automatic','Automatický kávovar','Stlačím tlačidlo a káva je hotová'],
        ['lever','Pákový kávovar','Espresso pripravujem ručne'],
        ['moka','Moka kanvička','Výrazná domáca káva na sporáku'],
        ['filter','Filter alebo zalievanie','V60, French press alebo klasické zalievanie']
      ]
    },
    {
      key:'taste', label:'Chuť kávy', title:'Aká chuť vám sedí najviac?', help:'Nemusíte poznať odborné názvy. Stačí pocit.',
      intro:'Teraz doladíme charakter. Neexistuje zlá odpoveď, ide iba o to, čo chutí vám.',
      reply:'Dobre. Chuťový profil sa už pekne črtá.',
      options:[
        ['gentle','Jemná a sladšia','Čokoláda, kakao, minimum horkosti'],
        ['balanced','Vyvážená','Plná chuť bez extrémov'],
        ['strong','Silná a výrazná','Hustá kréma a intenzívnejší dojem'],
        ['unsure','Neviem to pomenovať','Vyberte mi bezpečnú univerzálnu voľbu']
      ]
    },
    {
      key:'drink', label:'Spôsob pitia', title:'Ako ju pijete najčastejšie?', help:'Mlieko dokáže prekryť jemnejšie chuťové tóny.',
      intro:'Ešte jedna praktická vec. To, či pijete kávu s mliekom, dokáže odporúčanie výrazne zmeniť.',
      reply:'Super. Už viem, či má káva vyniknúť sama alebo v mlieku.',
      options:[
        ['black','Čiernu','Espresso, lungo alebo filtrovanú kávu'],
        ['milk','S mliekom','Cappuccino, flat white alebo latte'],
        ['both','Striedam oboje','Potrebujem univerzálnu kávu']
      ]
    },
    {
      key:'caffeine', label:'Kofeín', title:'Klasickú alebo bezkofeínovú?', help:'Posledná odpoveď a Beano pripraví výsledok.',
      intro:'Sme takmer hotoví. Už len posledná drobnosť.',
      reply:'Hotovo. Porovnávam kávy, ktoré vám najviac sedia.',
      options:[
        ['classic','Klasickú','Bežná káva s kofeínom'],
        ['decaf','Bezkofeínovú','Na večer alebo bez povzbudenia'],
        ['either','Je mi to jedno','Rozhodnite hlavne podľa chuti']
      ]
    }
  ];

  const state = {
    step:0,
    answers:{},
    selected:null,
    weight:null,
    completed:false,
    mode:'advisor',
    busy:false,
    chatStarted:false
  };

  const widget = $('#widget');
  const launcher = $('#launcher');
  const advisorScroll = $('#advisorScroll');
  const chatMessages = $('#chatMessages');
  const progress = $('#progress');
  const backBtn = $('#backBtn');

  const timeNow = () => new Intl.DateTimeFormat('sk-SK',{hour:'2-digit',minute:'2-digit'}).format(new Date());
  const scrollBottom = (element) => requestAnimationFrame(() => { element.scrollTop = element.scrollHeight; });
  const money = (value) => `${value.toFixed(2).replace('.', ',')} €`;
  const setPose = (pose) => $$('.mascot').forEach((el) => { el.dataset.pose = pose; });

  const avatarHtml = () => `<span class="avatar"><span class="mascot-slot">${mascotSvg('avatar')}</span></span>`;
  const botMessage = (text, id = '') => `<div class="message" ${id ? `id="${id}"` : ''}>${avatarHtml()}<div class="message-stack"><div class="bubble">${text}</div><span class="message-time">${timeNow()}</span></div></div>`;
  const userMessage = (text) => `<div class="message me"><div class="message-stack"><div class="bubble">${text}</div><span class="message-time">${timeNow()}</span></div></div>`;
  const typingMessage = (id = 'typing') => `<div class="message" id="${id}">${avatarHtml()}<div class="message-stack"><div class="bubble typing"><i></i><i></i><i></i></div></div></div>`;

  function openWidget(){
    widget.classList.add('open');
    widget.setAttribute('aria-hidden','false');
    launcher.classList.add('hidden');
    setPose('wave');
    setTimeout(() => setPose('idle'), 1250);
    if (!advisorScroll.children.length) rebuildAdvisor();
  }

  function closeWidget(){
    widget.classList.remove('open');
    widget.setAttribute('aria-hidden','true');
    launcher.classList.remove('hidden');
    setPose('idle');
  }

  $('#openWidget').addEventListener('click',openWidget);
  $('#launcherTeaser').addEventListener('click',openWidget);
  $('#closeWidget').addEventListener('click',closeWidget);

  function updateModeUi(){
    $$('.mode-btn').forEach((button) => {
      const active = button.dataset.mode === state.mode;
      button.classList.toggle('active',active);
      button.setAttribute('aria-selected',String(active));
    });
    $('.mode-switch').classList.toggle('chat-active',state.mode === 'chat');
    $('#advisorView').classList.toggle('active',state.mode === 'advisor');
    $('#chatView').classList.toggle('active',state.mode === 'chat');
    if(state.mode === 'chat'){
      startChat();
      updateResumeCard();
      setTimeout(() => $('#chatInput').focus(),80);
    }
  }

  function setMode(mode){
    state.mode = mode;
    updateModeUi();
  }
  $$('.mode-btn').forEach((button) => button.addEventListener('click',() => setMode(button.dataset.mode)));
  $('#resumeAdvisor').addEventListener('click',() => setMode('advisor'));

  function updateProgress(){
    progress.innerHTML = Array.from({length:4},(_,index) => `<span class="progress-bean ${index < state.step || (index === state.step && state.answers[questions[index]?.key]) || state.step >= 4 ? 'on' : ''}"></span>`).join('');
    if(state.step < 4){
      $('#stepLabel').textContent = `Krok ${state.step + 1} zo 4`;
      $('#stepHint').textContent = questions[state.step].label;
      $('#advisorModeHint').textContent = `Krok ${state.step + 1} zo 4`;
    }else if(state.completed){
      $('#stepLabel').textContent = 'Výber dokončený';
      $('#stepHint').textContent = 'Káva je pripravená';
      $('#advisorModeHint').textContent = 'Výber dokončený';
    }else if(state.selected){
      $('#stepLabel').textContent = 'Posledný krok';
      $('#stepHint').textContent = 'Vyberte balenie';
      $('#advisorModeHint').textContent = 'Vyberte balenie';
    }else{
      $('#stepLabel').textContent = 'Odporúčanie';
      $('#stepHint').textContent = 'Najlepšie zhody';
      $('#advisorModeHint').textContent = 'Pozrite výsledok';
    }
    backBtn.disabled = state.step === 0 || state.busy;
    updateResumeCard();
  }

  function questionHtml(question,index){
    return `
      <div class="question-block" data-question="${index}">
        <h3 class="question-title">${question.title}</h3>
        <p class="question-help">${question.help}</p>
        <div class="options">
          ${question.options.map((option,optionIndex) => `
            <button class="option" type="button" data-value="${option[0]}" style="animation-delay:${optionIndex * 65}ms">
              <span class="option-icon">${optionIcons[option[0]]}</span>
              <span class="option-copy"><b>${option[1]}</b><small>${option[2]}</small></span>
              <span class="option-arrow">${controlIcons.arrow}</span>
            </button>`).join('')}
        </div>
      </div>`;
  }

  function appendQuestion(index){
    const q = questions[index];
    advisorScroll.insertAdjacentHTML('beforeend',botMessage(q.intro));
    advisorScroll.insertAdjacentHTML('beforeend',questionHtml(q,index));
    bindCurrentOptions();
    scrollBottom(advisorScroll);
  }

  function bindCurrentOptions(){
    $$('.option',advisorScroll).filter((button) => !button.dataset.bound).forEach((button) => {
      button.dataset.bound = 'true';
      button.addEventListener('click',() => selectAnswer(button));
    });
  }

  function getOptionLabel(question,value){
    return question.options.find((option) => option[0] === value)?.[1] || value;
  }

  function selectAnswer(button){
    if(state.busy) return;
    const question = questions[state.step];
    const value = button.dataset.value;
    state.answers[question.key] = value;
    state.busy = true;
    $$('.option',button.closest('.options')).forEach((item) => {
      item.classList.add('locked');
      item.classList.toggle('selected',item === button);
    });
    advisorScroll.insertAdjacentHTML('beforeend',userMessage(getOptionLabel(question,value)));
    advisorScroll.insertAdjacentHTML('beforeend',typingMessage());
    setPose('think');
    scrollBottom(advisorScroll);

    setTimeout(() => {
      $('#typing',advisorScroll)?.remove();
      advisorScroll.insertAdjacentHTML('beforeend',botMessage(question.reply));
      setPose('happy');
      if(state.step < questions.length - 1){
        state.step += 1;
        updateProgress();
        setTimeout(() => {
          appendQuestion(state.step);
          state.busy = false;
          setPose('idle');
          updateProgress();
        },260);
      }else{
        state.step = 4;
        updateProgress();
        setTimeout(() => {
          renderResults(true);
          state.busy = false;
          setPose('idle');
          updateProgress();
        },360);
      }
    },620);
  }

  function rankProducts(){
    return products.map((product) => {
      let score = product.matchBase;
      if(product.prep.includes(state.answers.prep)) score += 6; else score -= 12;
      if(product.taste.includes(state.answers.taste)) score += 6; else score -= 7;
      if(product.drink.includes(state.answers.drink)) score += 5; else score -= 6;
      if(product.caffeine.includes(state.answers.caffeine)) score += 12; else score -= 28;
      if(state.answers.caffeine === 'decaf' && product.id !== 'decaf') score -= 55;
      if(state.answers.caffeine === 'classic' && product.id === 'decaf') score -= 35;
      return {...product,score:Math.max(61,Math.min(99,score))};
    }).sort((a,b) => b.score-a.score);
  }

  function productHtml(product,index){
    return `
      <article class="product-card ${index === 0 ? 'top' : ''}" style="animation-delay:${index * 95}ms;--bag-a:${product.colors[0]};--bag-b:${product.colors[1]}">
        ${index === 0 ? '<span class="best-ribbon">Najlepšia zhoda</span>' : ''}
        <div class="product-main">
          <div class="product-bag"><span class="product-bag-label">${product.label}</span></div>
          <div class="product-copy">
            <h4>${product.name}</h4><span class="origin">${product.origin}</span>
            <p>${product.reason}</p>
          </div>
          <div class="match-ring" style="--match:${product.score}"><b>${product.score}%</b></div>
        </div>
        <div class="taste-tags">${product.tags.map((tag) => `<span class="taste-tag">${tag}</span>`).join('')}</div>
        <button class="pick-product" type="button" data-product="${product.id}">${controlIcons.check} Vybrať túto kávu</button>
      </article>`;
  }

  function renderResults(append = false){
    const ranked = rankProducts().slice(0,3);
    const html = `
      <div class="result-hero">
        <span class="result-mascot">${mascotSvg('regular')}</span>
        <b>Mám pre vás tri dobré zhody.</b>
        <span>Prvú by som zvolil ja. Ďalšie dve sú bezpečné alternatívy, ak chcete trochu iný charakter.</span>
      </div>
      ${ranked.map(productHtml).join('')}`;
    if(append) advisorScroll.insertAdjacentHTML('beforeend',html); else advisorScroll.innerHTML += html;
    $$('.pick-product',advisorScroll).forEach((button) => {
      if(!button.dataset.bound){
        button.dataset.bound = 'true';
        button.addEventListener('click',() => chooseProduct(button.dataset.product));
      }
    });
    scrollBottom(advisorScroll);
  }

  function chooseProduct(id){
    state.selected = products.find((product) => product.id === id);
    state.weight = null;
    state.completed = false;
    $$('.product-card',advisorScroll).forEach((card) => card.remove());
    $('.result-hero',advisorScroll)?.remove();
    advisorScroll.insertAdjacentHTML('beforeend',userMessage(state.selected.name));
    advisorScroll.insertAdjacentHTML('beforeend',typingMessage('weightTyping'));
    setPose('think');
    scrollBottom(advisorScroll);
    setTimeout(() => {
      $('#weightTyping',advisorScroll)?.remove();
      advisorScroll.insertAdjacentHTML('beforeend',botMessage(`<b>Dobrá voľba.</b> ${state.selected.name} vám bude sedieť. Teraz už iba vyberte veľkosť balenia.`));
      advisorScroll.insertAdjacentHTML('beforeend',weightPanelHtml());
      bindWeights();
      setPose('happy');
      setTimeout(() => setPose('idle'),800);
      updateProgress();
      scrollBottom(advisorScroll);
    },580);
  }

  function weightPanelHtml(){
    return `
      <div class="weight-panel" id="weightPanel">
        <h3>Koľko kávy chcete?</h3>
        <p>Pre bežnú domácnosť je 500 g najpraktickejšia voľba. Cena sa aktualizuje okamžite.</p>
        <div class="weight-grid">
          <button class="weight-option" type="button" data-weight="250"><span class="weight-bag"></span><b>250 g</b><small>na ochutnanie</small></button>
          <button class="weight-option" type="button" data-weight="500"><span class="weight-badge">Najčastejšie</span><span class="weight-bag"></span><b>500 g</b><small>na bežné pitie</small></button>
          <button class="weight-option" type="button" data-weight="1000"><span class="weight-bag"></span><b>1 kg</b><small>najlepšia cena</small></button>
        </div>
        <div class="order-summary" id="orderSummary">
          <div class="order-row"><span>Vybraná káva</span><strong>${state.selected.name}</strong></div>
          <div class="order-row"><span>Balenie</span><strong id="summaryWeight">Vyberte veľkosť</strong></div>
          <div class="order-row"><span>Cena</span><strong id="summaryPrice">—</strong></div>
        </div>
        <button class="add-cart" id="addCart" type="button" disabled>${controlIcons.cart} Pridať do košíka</button>
      </div>`;
  }

  function bindWeights(){
    $$('.weight-option',advisorScroll).forEach((button) => button.addEventListener('click',() => {
      state.weight = Number(button.dataset.weight);
      $$('.weight-option',advisorScroll).forEach((item) => item.classList.toggle('selected',item === button));
      $('#summaryWeight').textContent = state.weight === 1000 ? '1 kg' : `${state.weight} g`;
      $('#summaryPrice').textContent = money(state.selected.price[state.weight]);
      $('#addCart').disabled = false;
    }));
    $('#addCart').addEventListener('click',completeSelection);
  }

  function completeSelection(){
    if(!state.weight) return;
    state.completed = true;
    $('#weightPanel')?.remove();
    advisorScroll.insertAdjacentHTML('beforeend',userMessage(`${state.weight === 1000 ? '1 kg' : `${state.weight} g`} · ${money(state.selected.price[state.weight])}`));
    advisorScroll.insertAdjacentHTML('beforeend',`
      <div class="success-card">
        <span class="confetti c1"></span><span class="confetti c2"></span><span class="confetti c3"></span>
        <span class="success-icon">${controlIcons.check}</span>
        <h3>Výber je pripravený.</h3>
        <p><b>${state.selected.name}</b>, balenie ${state.weight === 1000 ? '1 kg' : `${state.weight} g`} za ${money(state.selected.price[state.weight])}. V ostrom e-shope by sa produkt teraz vložil priamo do košíka.</p>
        <div class="success-actions"><button class="again" type="button" id="againBtn">Vybrať inú</button><button class="ask" type="button" id="askBtn">Opýtať sa Beana</button></div>
      </div>`);
    $('#againBtn').addEventListener('click',resetAdvisor);
    $('#askBtn').addEventListener('click',() => setMode('chat'));
    setPose('happy');
    setTimeout(() => setPose('idle'),1300);
    updateProgress();
    scrollBottom(advisorScroll);
  }

  function rebuildAdvisor(){
    advisorScroll.innerHTML = botMessage('<b>Dobrý deň, som Beano.</b> Pomôžem vám vybrať kávu bez zložitých výrazov. Stačia štyri krátke odpovede.');
    for(let index = 0; index < Math.min(state.step,4); index += 1){
      const question = questions[index];
      const answer = state.answers[question.key];
      advisorScroll.insertAdjacentHTML('beforeend',botMessage(question.intro));
      if(answer){
        advisorScroll.insertAdjacentHTML('beforeend',userMessage(getOptionLabel(question,answer)));
        advisorScroll.insertAdjacentHTML('beforeend',botMessage(question.reply));
      }
    }
    if(state.step < 4){
      appendQuestion(state.step);
    }else if(state.completed){
      advisorScroll.insertAdjacentHTML('beforeend',`
        <div class="success-card">
          <span class="success-icon">${controlIcons.check}</span>
          <h3>Výber je pripravený.</h3>
          <p><b>${state.selected.name}</b>, balenie ${state.weight === 1000 ? '1 kg' : `${state.weight} g`} za ${money(state.selected.price[state.weight])}.</p>
          <div class="success-actions"><button class="again" type="button" id="againBtn">Vybrať inú</button><button class="ask" type="button" id="askBtn">Opýtať sa Beana</button></div>
        </div>`);
      $('#againBtn').addEventListener('click',resetAdvisor);
      $('#askBtn').addEventListener('click',() => setMode('chat'));
    }else if(state.selected){
      advisorScroll.insertAdjacentHTML('beforeend',botMessage(`<b>Dobrá voľba.</b> ${state.selected.name} vám bude sedieť. Teraz už iba vyberte veľkosť balenia.`));
      advisorScroll.insertAdjacentHTML('beforeend',weightPanelHtml());
      bindWeights();
    }else{
      renderResults(true);
    }
    updateProgress();
    scrollBottom(advisorScroll);
  }

  backBtn.addEventListener('click',() => {
    if(state.busy || state.step === 0) return;
    if(state.step >= 4){
      state.step = 3;
      delete state.answers[questions[3].key];
      state.selected = null;
      state.weight = null;
      state.completed = false;
    }else{
      state.step -= 1;
      delete state.answers[questions[state.step].key];
    }
    rebuildAdvisor();
  });

  function resetAdvisor(){
    Object.assign(state,{step:0,answers:{},selected:null,weight:null,completed:false,busy:false});
    setMode('advisor');
    rebuildAdvisor();
    setPose('wave');
    setTimeout(() => setPose('idle'),1100);
  }
  $('#resetBtn').addEventListener('click',resetAdvisor);

  function updateResumeCard(){
    if(state.completed){
      $('#resumeTitle').textContent = 'Pozrieť dokončený výber';
      $('#resumeText').textContent = `${state.selected.name} · ${state.weight === 1000 ? '1 kg' : `${state.weight} g`}`;
    }else if(state.step >= 4 && state.selected){
      $('#resumeTitle').textContent = 'Dokončiť výber balenia';
      $('#resumeText').textContent = `Vybraná káva: ${state.selected.name}`;
    }else if(state.step >= 4){
      $('#resumeTitle').textContent = 'Pozrieť odporúčané kávy';
      $('#resumeText').textContent = 'Beano už pripravil výsledok.';
    }else if(state.step > 0){
      $('#resumeTitle').textContent = `Pokračovať – krok ${state.step + 1} zo 4`;
      $('#resumeText').textContent = 'Rozpracovaný výber zostal uložený.';
    }else{
      $('#resumeTitle').textContent = 'Spustiť výber kávy';
      $('#resumeText').textContent = 'Štyri jednoduché otázky bez odborných výrazov.';
    }
  }

  const quickQuestions = ['Káva bez kyslosti','Čo do automatu?','Káva na cappuccino','Ako vybrať mletie?'];

  function startChat(){
    if(state.chatStarted) return;
    state.chatStarted = true;
    chatMessages.innerHTML = botMessage('<b>Pokojne sa opýtajte.</b> Poradím s chuťou, prípravou, mletím aj výberom kávy do konkrétneho kávovaru.');
    $('#quickChips').innerHTML = quickQuestions.map((question) => `<button class="quick-chip" type="button">${question}</button>`).join('');
    $$('.quick-chip').forEach((button) => button.addEventListener('click',() => askChat(button.textContent)));
  }

  function chatReply(input){
    const text = input.toLowerCase();
    if(text.includes('kysl')) return 'Ak nechcete kyslosť, najbezpečnejšie sú <b>Brazil Santos</b>, <b>Paganini</b> alebo <b>Cuba Serrano</b>. Majú čokoládový až orieškový charakter a pôsobia sladšie.';
    if(text.includes('automat')) return 'Do automatu je veľmi bezpečný <b>Paganini blend</b>. Má dobrú krému, nízku aciditu a zvládne espresso aj cappuccino bez toho, aby sa chuť stratila.';
    if(text.includes('capp') || text.includes('latte') || text.includes('mlie')) return 'Do mlieka odporúčam <b>Puccini</b>, ak chcete silnejšiu chuť, alebo <b>Paganini</b>, ak chcete jemnejšiu a univerzálnejšiu kávu.';
    if(text.includes('mlet')) return 'Najlepšie je objednať zrnkovú kávu a mlieť tesne pred prípravou. Pri pákovom kávovare treba jemnejšie mletie, pri moka kanvičke stredne jemné a pri filtri hrubšie.';
    if(text.includes('bez kof') || text.includes('večer')) return '<b>Bezkofeínová Brazil</b> je vhodná na večer. Zachová si jemný kávový charakter, ale bez povzbudivého účinku.';
    if(text.includes('siln') || text.includes('výraz')) return 'Najvýraznejšia je <b>Puccini</b>. Má vyšší podiel robusty, hustejšiu krému a dobre sa presadí aj v mlieku.';
    if(text.includes('jemn') || text.includes('slad')) return '<b>Brazil Santos</b> je jemná, sladšia a čokoládová. Je to dobrá voľba pre človeka, ktorý nechce výraznú horkosť ani kyslosť.';
    return 'Podľa toho, čo opisujete, by som začal vyváženou kávou s nízkou aciditou. Pre presnejší výsledok použite režim <b>Vybrať kávu</b> – tam zohľadním prípravu, chuť, mlieko aj kofeín.';
  }

  function askChat(text){
    if(!text.trim()) return;
    chatMessages.insertAdjacentHTML('beforeend',userMessage(text));
    chatMessages.insertAdjacentHTML('beforeend',typingMessage('chatTyping'));
    $('#chatInput').value = '';
    setPose('think');
    scrollBottom(chatMessages);
    setTimeout(() => {
      $('#chatTyping',chatMessages)?.remove();
      chatMessages.insertAdjacentHTML('beforeend',botMessage(chatReply(text)));
      setPose('happy');
      setTimeout(() => setPose('idle'),700);
      scrollBottom(chatMessages);
    },650);
  }

  $('#chatForm').addEventListener('submit',(event) => {
    event.preventDefault();
    askChat($('#chatInput').value);
  });

  const teaserMessages = [
    ['Nechcete tipovať naslepo?','Vyberiem kávu podľa vašej chuti.'],
    ['Automat, páka alebo moka?','Každý spôsob potrebuje inú kávu.'],
    ['Čierna alebo s mliekom?','Stačia štyri jednoduché odpovede.']
  ];
  let teaserIndex = 0;
  setInterval(() => {
    teaserIndex = (teaserIndex + 1) % teaserMessages.length;
    $('#teaserTitle').textContent = teaserMessages[teaserIndex][0];
    $('#teaserText').textContent = teaserMessages[teaserIndex][1];
    setPose('wave');
    setTimeout(() => setPose('idle'),900);
  },5200);

  updateProgress();
  updateResumeCard();
})();
