(() => {
  'use strict';
  const app = window.DIAMONDS_APP;
  if (!app) return;
  const {config,$,$$,esc,icon,advisorMark,productImage,questions,state,products,findProduct} = app;
  const widget=$('#widget'), launcher=$('#launcher'), teaser=$('#teaser'), chatMessages=$('#chatMessages'), quickChips=$('#quickChips'), chatInput=$('#chatInput'), advisorContent=$('#advisorContent'), progressFill=$('#progressFill'), progressText=$('#progressText'), backButton=$('#backButton');

  function renderChat(){ chatMessages.innerHTML=state.chat.map(m=>`<div class="chat-line chat-line--${m.role}">${m.role==='assistant'?`<span class="chat-avatar">${advisorMark()}</span>`:''}<div class="chat-bubble">${esc(m.content)}</div></div>`).join(''); chatMessages.scrollTop=chatMessages.scrollHeight; }
  function renderQuick(){ quickChips.innerHTML=config.quick.map(q=>`<button type="button" data-prompt="${esc(q)}">${esc(q)}</button>`).join(''); }

  function lockPage(){ if(innerWidth>680){document.documentElement.classList.add('widget-open');return;} state.scrollY=scrollY; Object.assign(document.body.style,{position:'fixed',top:`-${state.scrollY}px`,left:'0',right:'0',width:'100%'}); }
  function unlockPage(){ document.documentElement.classList.remove('widget-open'); if(document.body.style.position==='fixed'){document.body.removeAttribute('style'); scrollTo(0,state.scrollY);} }

  function syncVisualViewport(){
    if(innerWidth>680 || !window.visualViewport){widget.style.removeProperty('height');widget.style.removeProperty('top');return;}
    widget.style.height=`${Math.round(window.visualViewport.height)}px`;
    widget.style.top=`${Math.round(window.visualViewport.offsetTop)}px`;
  }

  function openWidget(mode=state.mode){ state.open=true; widget.classList.add('is-open'); widget.setAttribute('aria-hidden','false'); $('#launcherButton').setAttribute('aria-expanded','true'); launcher.classList.add('is-hidden'); teaser.classList.add('is-hidden'); lockPage(); syncVisualViewport(); switchMode(mode); }
  function closeWidget(){ state.open=false; widget.classList.remove('is-open'); widget.setAttribute('aria-hidden','true'); $('#launcherButton').setAttribute('aria-expanded','false'); launcher.classList.remove('is-hidden'); widget.classList.remove('keyboard-open'); unlockPage(); widget.style.removeProperty('height'); widget.style.removeProperty('top'); }
  function switchMode(mode){ state.mode=mode; $$('.mode-switch button').forEach(b=>b.classList.toggle('is-active',b.dataset.mode===mode)); $('.mode-switch').dataset.mode=mode; $('#chatScreen').classList.toggle('is-active',mode==='chat'); $('#advisorScreen').classList.toggle('is-active',mode==='advisor'); if(mode==='advisor')renderAdvisor(); }

  function scoreProduct(product){
    let score=0; const weights={prep:5,taste:4,drink:2,direction:7};
    for(const [key,answer] of Object.entries(state.answers)){ if((product[key]||[]).includes(answer)) score+=weights[key]||1; }
    return score;
  }
  function calculateResult(){ const ranked=products.map((product,index)=>({product,index,score:scoreProduct(product)})).sort((a,b)=>b.score-a.score||a.index-b.index); state.result=ranked[0]?.product||products[0]; state.alternative=ranked.find(x=>x.product.id!==state.result.id)?.product||products[1]; }

  function optionCard(option,questionId){ const selected=state.answers[questionId]===option.value; const photo=option.productId?productImage(findProduct(option.productId),'option-photo'):''; return `<button type="button" class="answer-card${selected?' is-selected':''}${photo?' has-photo':''}" data-answer="${esc(option.value)}"><span class="answer-icon">${icon(option.icon)}</span><span class="answer-copy"><b>${esc(option.title)}</b><small>${esc(option.description)}</small></span>${photo}<span class="answer-radio"></span></button>`; }
  function renderQuestion(){ const q=questions[state.step]; progressText.textContent=`${state.step+1} / 4`; progressFill.style.width=`${(state.step+1)*25}%`; backButton.disabled=state.step===0; advisorContent.innerHTML=`<div class="question-view"><span class="question-kicker">${esc(q.eyebrow)}</span><h2>${esc(q.title)}</h2><p>${esc(q.help)}</p><div class="answers">${q.options.map(o=>optionCard(o,q.id)).join('')}</div></div>`; $$('.answer-card',advisorContent).forEach(button=>button.addEventListener('click',()=>{state.answers[q.id]=button.dataset.answer; $$('.answer-card',advisorContent).forEach(item=>item.classList.toggle('is-selected',item===button)); setTimeout(()=>{if(state.step<3){state.step++;renderQuestion();}else{calculateResult();renderResult();}},matchMedia('(prefers-reduced-motion: reduce)').matches?0:150);})); }

  function prepLabel(values){const labels={filter:'Filter',lever:'Espresso',automatic:'Automat',moka:'Moka'};return values.map(v=>labels[v]||v).join(' · ');}
  function renderResult(){ const p=state.result,a=state.alternative; progressText.textContent='Výsledok'; progressFill.style.width='100%'; backButton.disabled=false; advisorContent.innerHTML=`<div class="result-view"><span class="question-kicker">Odporúčanie pripravené</span><article class="result-editorial">${productImage(p,'result-photo')}<div class="result-copy"><div class="result-meta"><span>${esc(p.origin)}</span>${p.process?`<span>${esc(p.process)}</span>`:''}</div><h2>${esc(p.name)}</h2><div class="taste-tags">${p.tags.slice(0,3).map(t=>`<span>${esc(t)}</span>`).join('')}</div><div class="result-reason"><b>Prečo práve táto</b><p>${esc(p.reason)}</p></div><dl><div><dt>Príprava</dt><dd>${esc(prepLabel(p.prep))}</dd></div><div><dt>Cena na e-shope</dt><dd>${esc(p.price)}</dd></div></dl><a class="result-cta" href="${esc(p.url)}" target="_blank" rel="noreferrer">Pozrieť produkt ${icon('shop')}</a></div></article><article class="alternative"><div class="alternative-media">${productImage(a,'alt-photo')}</div><div><small>Jedna relevantná alternatíva</small><b>${esc(a.name)}</b><span>${a.tags.slice(0,3).map(esc).join(' · ')}</span></div><a href="${esc(a.url)}" target="_blank" rel="noreferrer" aria-label="Otvoriť ${esc(a.name)}">${icon('arrow')}</a></article><button id="restartAdvisor" class="restart" type="button">Začať výber odznova</button></div>`; $('#restartAdvisor').addEventListener('click',resetAdvisor); }
  function renderAdvisor(){ state.result?renderResult():renderQuestion(); }
  function resetAdvisor(){state.step=0;state.answers={};state.result=null;state.alternative=null;renderQuestion();}
  function resetAll(){resetAdvisor();state.chat=[{role:'assistant',content:config.welcome}];renderChat();switchMode('chat');}

  async function sendChat(message){ const clean=message.trim().slice(0,700);if(!clean)return;state.chat.push({role:'user',content:clean});renderChat();chatInput.value='';chatInput.disabled=true;$('.composer button').disabled=true;const pending={role:'assistant',content:'Premýšľam…',pending:true};state.chat.push(pending);renderChat();try{const response=await fetch('/api/chat',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({demoId:'diamonds',messages:state.chat.filter(x=>!x.pending).map(({role,content})=>({role,content}))})});if(!response.ok)throw new Error(String(response.status));const data=await response.json();pending.content=String(data.reply||'').trim()||'Najpresnejšie odporúčanie získate cez krátky výber kávy.';}catch{pending.content='Chat sa teraz nepodarilo načítať. Výber kávy funguje ďalej a odporučí produkt podľa štyroch odpovedí.';}finally{delete pending.pending;chatInput.disabled=false;$('.composer button').disabled=false;renderChat();}}

  $('#heroOpen').addEventListener('click',()=>openWidget('chat')); $('#heroAdvisor').addEventListener('click',()=>openWidget('advisor')); $('#launcherButton').addEventListener('click',()=>openWidget(state.mode)); $('#teaserClose').addEventListener('click',()=>teaser.classList.add('is-hidden')); $('#closeWidget').addEventListener('click',closeWidget); $('#resetAll').addEventListener('click',resetAll); $('#openAdvisor').addEventListener('click',()=>switchMode('advisor')); $$('.mode-switch button').forEach(b=>b.addEventListener('click',()=>switchMode(b.dataset.mode))); backButton.addEventListener('click',()=>{if(state.result){state.result=null;state.alternative=null;state.step=3;renderQuestion();}else if(state.step>0){state.step--;renderQuestion();}}); $('#chatForm').addEventListener('submit',e=>{e.preventDefault();sendChat(chatInput.value);}); quickChips.addEventListener('click',e=>{const b=e.target.closest('[data-prompt]');if(b)sendChat(b.dataset.prompt);}); document.addEventListener('keydown',e=>{if(e.key==='Escape'&&state.open)closeWidget();});

  chatInput.addEventListener('focus',()=>{widget.classList.add('keyboard-open');syncVisualViewport();});
  chatInput.addEventListener('blur',()=>setTimeout(()=>widget.classList.remove('keyboard-open'),120));
  if(window.visualViewport){window.visualViewport.addEventListener('resize',syncVisualViewport,{passive:true});window.visualViewport.addEventListener('scroll',syncVisualViewport,{passive:true});}

  renderQuick(); renderChat(); renderQuestion();
})();
