(() => {
  'use strict';

  const root = document.querySelector('#cosmetics-root');
  const data = window.COSMETICS_DEMOS;
  if (!root || !data) return;

  const match = location.pathname.match(/\/kozmetika\/([a-z0-9-]+)/i);
  const slug = (match?.[1] || new URLSearchParams(location.search).get('demo') || 'mylo').toLowerCase();
  const brand = data.brands[slug] || data.brands.mylo;
  const questions = data.questions;

  document.body.dataset.cosmeticsDemo = slug;
  document.title = `${brand.name} – výber starostlivosti`;
  for (const [key,value] of Object.entries(brand.theme)) document.documentElement.style.setProperty(`--cx-${key}`, value);

  const esc = (value='') => String(value).replace(/[&<>"']/g, (ch) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const svg = (body) => `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">${body}</svg>`;
  const path = (d) => `<path d="${d}" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>`;
  const icons = {
    arrow:svg(path('M5 12h13m-5-6 6 6-6 6')),
    close:svg(path('m6 6 12 12M18 6 6 18')),
    reset:svg(path('M20 11a8 8 0 1 0-2.3 5.7M20 5v6h-6')),
    back:svg(path('m15 18-6-6 6-6')),
    chat:svg(path('M5 5h14v10H9l-4 4V5Z')),
    spark:svg(path('M12 3l1.4 5.4L19 10l-5.6 1.6L12 17l-1.4-5.4L5 10l5.6-1.6L12 3Z')),
    check:svg(path('m5 12 4 4L19 6')),
    send:svg(path('m4 4 16 8-16 8 3-8-3-8Zm3 8h13')),
    bag:svg(path('M6 8h12l-1 12H7L6 8Zm3 0V6a3 3 0 0 1 6 0v2')),
    leaf:svg(path('M19 4C11 4 5 8 5 14c0 3 2 5 5 5 6 0 9-7 9-15ZM8 17c2-4 5-7 9-9'))
  };

  const state = {
    open:false, mode:'chat', step:0, answers:{}, result:null, alternative:null,
    interacted:false, busy:false, transitioning:false,
    messages:[{role:'assistant',text:'Dobrý deň. Napíšte, čo od starostlivosti očakávate alebo ako sa vaša pleť správa. Pomôžem vám zúžiť výber.'}]
  };

  const ownerPath = `
    <div class="cx-owner-path">
      <div><span>${icons.chat}</span><b>Chat</b><small>odpovie na otázku</small></div>
      <i>${icons.arrow}</i>
      <div><span>${icons.spark}</span><b>Výber</b><small>4 jednoduché kroky</small></div>
      <i>${icons.arrow}</i>
      <div><span>${icons.bag}</span><b>Produkt</b><small>konkrétny preklik</small></div>
    </div>`;

  root.innerHTML = `
    <main class="cx-owner">
      <header class="cx-owner-head">
        <a class="cx-owner-brand" href="${brand.website}" target="_blank" rel="noreferrer">${brand.wordmark}</a>
        <a class="cx-owner-contact" href="https://mojchatbot.sk/kontakt" target="_blank" rel="noreferrer">Chcem to na svoj web ${icons.arrow}</a>
      </header>
      <section class="cx-owner-hero">
        <div class="cx-owner-copy">
          <span class="cx-owner-kicker">CHAT + VÝBER STAROSTLIVOSTI</span>
          <h1>${esc(brand.ownerTitle)}</h1>
          <p>${esc(brand.ownerText)}</p>
          <div class="cx-owner-actions">
            <button type="button" data-open="advisor">Vyskúšať výber ${icons.arrow}</button>
            <button type="button" data-open="chat" class="is-secondary">Skúsiť chat ${icons.chat}</button>
          </div>
          ${ownerPath}
        </div>
        <div class="cx-owner-visual">
          <img src="${brand.hero}" alt="${esc(brand.name)} – produktová prezentácia" referrerpolicy="no-referrer" onerror="this.closest('[class*=visual],[class*=photo]')?.setAttribute('data-image-failed','true')">
          <div class="cx-owner-visual-card"><span>${icons.spark}</span><div><small>4 krátke otázky</small><b>Od potreby ku konkrétnemu produktu.</b></div></div>
        </div>
      </section>
      <section class="cx-owner-benefits">
        ${brand.benefit.map((item) => `<div>${icons.check}<b>${esc(item)}</b></div>`).join('')}
      </section>
      <footer class="cx-owner-foot"><a href="https://mojchatbot.sk" target="_blank" rel="noreferrer">mojchatbot.sk</a><span>Ukážka riešenia pre ${esc(brand.name)}</span></footer>
    </main>

    <div class="cx-launcher" id="cx-launcher">
      <button class="cx-teaser" id="cx-teaser" type="button"><b>Pomôcť s výberom?</b><span>4 otázky · konkrétny produkt</span></button>
      <button class="cx-launcher-button" id="cx-open" type="button" aria-label="Otvoriť poradcu" aria-expanded="false">${icons.spark}</button>
    </div>
    <div class="cx-backdrop" id="cx-backdrop" hidden></div>
    <section class="cx-widget" id="cx-widget" role="dialog" aria-modal="true" aria-label="Poradca starostlivosti ${esc(brand.name)}" aria-hidden="true">
      <header class="cx-widget-head">
        <div class="cx-widget-brand">${brand.wordmark}<span><i></i> online</span></div>
        <div class="cx-widget-actions"><button id="cx-reset" type="button" aria-label="Začať odznova">${icons.reset}</button><button id="cx-close" type="button" aria-label="Zavrieť">${icons.close}</button></div>
      </header>
      <nav class="cx-mode" aria-label="Režim poradcu">
        <span class="cx-mode-thumb"></span>
        <button type="button" data-mode="chat" class="is-active" aria-pressed="true">${icons.chat}<b>Chat</b></button>
        <button type="button" data-mode="advisor" aria-pressed="false">${icons.spark}<b>Výber</b></button>
      </nav>
      <div class="cx-stage" id="cx-stage"></div>
    </section>`;

  const widget = root.querySelector('#cx-widget');
  const stage = root.querySelector('#cx-stage');
  const launcher = root.querySelector('#cx-launcher');
  const backdrop = root.querySelector('#cx-backdrop');
  const mode = root.querySelector('.cx-mode');
  const modeButtons = [...root.querySelectorAll('.cx-mode button')];

  function openWidget(next='chat') {
    state.open = true;
    widget.classList.add('is-open');
    widget.setAttribute('aria-hidden','false');
    launcher.classList.add('is-hidden');
    backdrop.hidden = false;
    requestAnimationFrame(() => backdrop.classList.add('is-visible'));
    document.documentElement.classList.add('cx-lock');
    setMode(next);
    requestAnimationFrame(() => root.querySelector('#cx-close')?.focus());
  }

  function closeWidget() {
    state.open = false;
    widget.classList.remove('is-open');
    widget.setAttribute('aria-hidden','true');
    launcher.classList.remove('is-hidden');
    backdrop.classList.remove('is-visible');
    setTimeout(() => { backdrop.hidden = true; }, 160);
    document.documentElement.classList.remove('cx-lock');
  }

  function setMode(next) {
    state.mode = next;
    mode.classList.toggle('is-advisor', next === 'advisor');
    modeButtons.forEach((button) => {
      const active = button.dataset.mode === next;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    if (next === 'advisor') renderAdvisor(); else renderChat();
  }

  function messageMarkup(message) {
    return `<div class="cx-message cx-message--${message.role}"><div class="cx-bubble">${esc(message.text)}</div></div>`;
  }

  function renderChat() {
    const chips = ['Mám suchú pleť','Pleť sa mi mastí','Chcem jednoduchú rutinu','Niečo na citlivú pleť'];
    stage.innerHTML = `
      <section class="cx-chat">
        <div class="cx-chat-messages" id="cx-messages">
          ${!state.interacted ? `<button class="cx-advisor-entry" id="cx-advisor-entry" type="button"><span>${icons.spark}</span><div><b>Nájsť starostlivosť za 4 kroky</b><small>Pleť · priorita · rutina · textúra</small></div>${icons.arrow}</button>` : ''}
          ${state.messages.map(messageMarkup).join('')}
        </div>
        <div class="cx-chat-bottom">
          ${!state.interacted ? `<div class="cx-chips">${chips.map((chip) => `<button class="cx-chip" type="button">${esc(chip)}</button>`).join('')}</div>` : ''}
          <form class="cx-composer" id="cx-form"><input id="cx-input" maxlength="500" autocomplete="off" placeholder="Opýtajte sa na starostlivosť…" aria-label="Otázka"><button type="submit" aria-label="Odoslať" ${state.busy?'disabled':''}>${icons.send}</button></form>
        </div>
      </section>`;
    stage.querySelector('#cx-advisor-entry')?.addEventListener('click', () => setMode('advisor'));
    stage.querySelectorAll('.cx-chip').forEach((button) => button.addEventListener('click', () => send(button.textContent)));
    stage.querySelector('#cx-form').addEventListener('submit', (event) => { event.preventDefault(); const input=stage.querySelector('#cx-input'); const value=input.value; input.value=''; send(value); });
    requestAnimationFrame(() => { const messages=stage.querySelector('#cx-messages'); if(messages) messages.scrollTop=messages.scrollHeight; });
  }

  function localReply(text) {
    const q = String(text||'').toLocaleLowerCase('sk');
    if (/such|pnut|dehyd/.test(q)) return `Pri suchej alebo napnutej pleti by som začal produktom ${brand.products.find(p=>p.tags.includes('dry'))?.name || brand.products[0].name}. Cez Výber starostlivosti ešte zohľadníme, či chcete krém, sérum alebo olej.`;
    if (/mast|lesk|nedokonal|akné/.test(q)) return `Pri vyššej tvorbe mazu sa oplatí pozrieť na ${brand.products.find(p=>p.tags.includes('oily'))?.name || brand.products[0].name}. Výber starostlivosti vám pomôže zúžiť výsledok bez skúšania naslepo.`;
    if (/citliv|reakt|štíp|podráž/.test(q)) return `Pri citlivejšej pleti by som volil jednoduchšiu starostlivosť a začal produktom ${brand.products.find(p=>p.tags.includes('sensitive'))?.name || brand.products[0].name}. Ak pokožka výrazne reaguje, vhodnosť produktu je lepšie konzultovať s odborníkom.`;
    if (/zrel|vrásk|pruž/.test(q)) return `Pre zrelšiu pleť je z ponuky vhodný smer ${brand.products.find(p=>p.tags.includes('mature'))?.name || brand.products[0].name}. Krátky výber ešte zohľadní, ako komplexnú rutinu chcete.`;
    return `Pomôžem vám zúžiť ponuku ${brand.name}. Napíšte, ako sa pleť správa a čo chcete riešiť, alebo prejdite štyri krátke kroky vo Výbere.`;
  }

  async function send(text) {
    const clean = String(text||'').trim().slice(0,500);
    if (!clean || state.busy) return;
    state.interacted = true;
    state.busy = true;
    state.messages.push({role:'user',text:clean});
    const answer = {role:'assistant',text:localReply(clean)};
    state.messages.push(answer);
    renderChat();
    try {
      const response = await fetch('/api/cosmetics-chat',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({demoId:slug,messages:state.messages.slice(-8).map((m)=>({role:m.role,content:m.text}))})});
      if (response.ok) { const payload=await response.json(); if(String(payload.reply||'').trim()) answer.text=String(payload.reply).trim(); }
    } catch (_) {}
    state.busy = false;
    renderChat();
  }

  function score(product) {
    const weights={skin:9,goal:11,routine:5,texture:6};
    return questions.reduce((total,q) => {
      const answer=state.answers[q.key];
      if(!answer || answer==='any') return total;
      return total + (product.tags.includes(answer) ? weights[q.key] : -1);
    },0);
  }

  function chooseResult() {
    const ranked=brand.products.map((product,index)=>({product,index,score:score(product)})).sort((a,b)=>b.score-a.score || a.index-b.index);
    state.result=ranked[0].product;
    state.alternative=(ranked.find((item)=>item.product.id!==state.result.id)||ranked[1]||ranked[0]).product;
  }

  function renderAdvisor() {
    if (state.result) return renderResult();
    const question=questions[state.step];
    const selected=state.answers[question.key];
    stage.innerHTML = `
      <section class="cx-advisor">
        <header class="cx-progress"><button id="cx-back" type="button" ${state.step===0?'disabled':''}>${icons.back}<span>Späť</span></button><div>${questions.map((_,index)=>`<i class="${index<=state.step?'is-on':''}"></i>`).join('')}</div><b>${state.step+1}/4</b></header>
        <div class="cx-advisor-body">
          <span class="cx-kicker">${esc(question.kicker)}</span><h2>${esc(question.title)}</h2>
          <div class="cx-options">${question.options.map((option)=>`<button class="cx-option ${selected===option.value?'is-selected':''}" data-value="${option.value}" type="button" aria-pressed="${selected===option.value}"><span class="cx-option-photo"><img src="${option.image}" alt="" referrerpolicy="no-referrer" loading="lazy" onerror="this.closest('.cx-option-photo')?.setAttribute('data-image-failed','true')"></span><span class="cx-option-copy"><b>${esc(option.title)}</b><small>${esc(option.text)}</small></span><i>${selected===option.value?icons.check:''}</i></button>`).join('')}</div>
        </div>
      </section>`;
    stage.querySelector('#cx-back')?.addEventListener('click',()=>{ if(state.step>0&&!state.transitioning){state.step-=1;renderAdvisor();} });
    stage.querySelectorAll('.cx-option').forEach((button)=>button.addEventListener('click',()=>{
      if(state.transitioning) return;
      state.transitioning=true;
      state.answers[question.key]=button.dataset.value;
      stage.querySelectorAll('.cx-option').forEach((item)=>{const on=item===button;item.classList.toggle('is-selected',on);item.setAttribute('aria-pressed',String(on));item.disabled=true;});
      setTimeout(()=>{ if(state.step<questions.length-1){state.step+=1;state.transitioning=false;renderAdvisor();} else {chooseResult();state.transitioning=false;renderResult();} },220);
    }));
  }

  function renderResult() {
    const product=state.result;
    const alt=state.alternative;
    stage.innerHTML=`
      <section class="cx-result">
        <header class="cx-progress"><button id="cx-result-back" type="button">${icons.back}<span>Späť</span></button><div>${questions.map(()=>'<i class="is-on"></i>').join('')}</div><b>Výsledok</b></header>
        <div class="cx-result-body">
          <span class="cx-kicker">Váš smer</span>
          <article class="cx-product"><div class="cx-product-photo"><img src="${brand.hero}" alt="${esc(product.name)}" referrerpolicy="no-referrer" onerror="this.closest('.cx-product-photo')?.setAttribute('data-image-failed','true')"></div><div class="cx-product-copy"><small>${esc(brand.name)}</small><h2>${esc(product.name)}</h2><p>${esc(product.reason)}</p><div class="cx-product-price"><strong>${esc(product.price)}</strong><a href="${product.url}" target="_blank" rel="noreferrer">Pozrieť produkt ${icons.arrow}</a></div></div></article>
          ${alt && alt.id!==product.id ? `<article class="cx-alt"><span>${icons.leaf}</span><div><small>Alternatíva</small><b>${esc(alt.name)}</b></div><a href="${alt.url}" target="_blank" rel="noreferrer" aria-label="Pozrieť alternatívu">${icons.arrow}</a></article>`:''}
          <p class="cx-result-note">Výber je orientačný podľa preferencií, nie zdravotná diagnóza.</p>
          <button class="cx-restart" id="cx-restart" type="button">Vybrať znova</button>
        </div>
      </section>`;
    stage.querySelector('#cx-result-back').addEventListener('click',()=>{state.result=null;state.alternative=null;state.step=3;renderAdvisor();});
    stage.querySelector('#cx-restart').addEventListener('click',resetAdvisor);
  }

  function resetAdvisor(){state.step=0;state.answers={};state.result=null;state.alternative=null;state.transitioning=false;renderAdvisor();}
  function resetAll(){state.step=0;state.answers={};state.result=null;state.alternative=null;state.interacted=false;state.busy=false;state.transitioning=false;state.messages=[{role:'assistant',text:'Dobrý deň. Napíšte, čo od starostlivosti očakávate alebo ako sa vaša pleť správa. Pomôžem vám zúžiť výber.'}];setMode('chat');}

  root.querySelectorAll('[data-open]').forEach((button)=>button.addEventListener('click',()=>openWidget(button.dataset.open)));
  root.querySelector('#cx-open').addEventListener('click',()=>openWidget('chat'));
  root.querySelector('#cx-teaser').addEventListener('click',()=>openWidget('advisor'));
  root.querySelector('#cx-close').addEventListener('click',closeWidget);
  root.querySelector('#cx-reset').addEventListener('click',resetAll);
  backdrop.addEventListener('click',closeWidget);
  modeButtons.forEach((button)=>button.addEventListener('click',()=>setMode(button.dataset.mode)));
  document.addEventListener('keydown',(event)=>{if(event.key==='Escape'&&state.open)closeWidget();});

  document.documentElement.dataset.cosmeticsReady='true';
  renderChat();
})();
