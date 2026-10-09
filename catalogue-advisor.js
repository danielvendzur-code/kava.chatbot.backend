/* Same vanilla-JS widget and brand theme; catalogue facts come from shop evidence. */
(() => {
  'use strict';
  const slug = document.body.dataset.cosmeticsDemo;
  const brand = window.COSMETICS_DEMOS?.brands?.[slug];
  const products = brand?.catalogue;
  const widget = document.querySelector('#cx-widget');
  if (!widget || !products?.length) return;
  const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const labels = {face:'Pleť',body:'Telo',hair:'Vlasy',sets:'Sady',tea:'Čaje',home:'Vône do domácnosti',beard:'Brada',baby:'Deti a mamy',eyes:'Okolie očí',lips:'Pery',white:'Biele',red:'Červené',rose:'Ružové',orange:'Oranžové',wine:'Víno'};
  const isWine=brand.catalogueContext==='wine';
  const norm = v => String(v).normalize('NFD').replace(/\p{Diacritic}/gu,'').toLowerCase();
  const nav = widget.querySelector('.cx-mode');
  const panel = document.createElement('section');
  panel.className = 'cx-catalogue-stage'; panel.hidden = true;
  panel.setAttribute('aria-label','Výber z ponuky');
  widget.querySelector('#cx-stage').after(panel);
  const browse = document.createElement('button');
  browse.type='button'; browse.dataset.catalogueMode='browse';
  browse.innerHTML=`<b>Ponuka <span>${products.length}</span></b>`;browse.setAttribute('aria-pressed','false');nav.append(browse);
  widget.classList.add('cx-has-catalogue');
  const state={mode:'guide',step:0,answers:{},query:'',category:'all'};
  const groups=Object.entries(labels).filter(([key])=>products.filter(p=>p.category===key).length>=4);
  // Small secondary categories remain browsable, without a forced separate flow.
  const allGroups=Object.entries(labels).filter(([key])=>products.some(p=>p.category===key));
  const sizeLabel=p=>[p.volume,p.variantLabel&&!p.variantLabel.includes(p.volume)?p.variantLabel:''].filter(Boolean).join(' · ')||'Balenie podľa e-shopu';
  const card=p=>`<article class="cx-catalogue-card" data-product-id="${esc(p.id)}"><img src="${esc(p.photo)}" alt="${esc(p.name)}" loading="lazy" width="900" height="1000"><div><small>${esc(labels[p.category])} · ${esc(p.kind)}</small><h3>${esc(p.name)}</h3><p class="cx-catalogue-size">${esc(sizeLabel(p))}</p><strong>${esc(p.price)}</strong>${p.availabilityNote?`<p class="cx-catalogue-size">${esc(p.availabilityNote)}</p>`:''}<a href="${esc(p.url)}" target="_blank" rel="noopener noreferrer">Pozrieť v e-shope <span aria-hidden="true">↗</span></a></div></article>`;
  const selected=()=>products.filter(p=>(!state.answers.category||p.category===state.answers.category)&&(!state.answers.kind||state.answers.kind==='any'||p.kind===state.answers.kind)&&(!state.answers.budget||p.priceAmount<=Number(state.answers.budget)));
  const sorted=()=>{
    const list=selected().slice();
    if(state.answers.order==='price')list.sort((a,b)=>a.priceAmount-b.priceAmount);
    if(state.answers.order==='name')list.sort((a,b)=>a.name.localeCompare(b.name,'sk'));
    if(state.answers.order==='small'||state.answers.order==='large') {
      const size=p=>{const m=p.volume.match(/(\d+(?:[.,]\d+)?)\s*(ml|g|kg)/);return m?Number(m[1].replace(',','.'))*(m[2]==='kg'?1000:1):null;};
      const units=new Set(list.map(p=>p.volume.match(/ml|g|kg/)?.[0]).filter(Boolean));
      if(units.size===1)list.sort((a,b)=>(size(a)??Infinity)-(size(b)??Infinity));
      if(units.size===1&&state.answers.order==='large')list.reverse();
    }
    return list;
  };
  function mode(next) {
    state.mode=next; panel.hidden=false;widget.classList.add('cx-catalogue-active');
    nav.querySelectorAll('button').forEach(b=>{const active=next==='browse'?b===browse:b.dataset.mode==='advisor';b.classList.toggle('is-active',active);b.setAttribute('aria-pressed',String(active));});
    render();
  }
  function legacy() {panel.hidden=true;widget.classList.remove('cx-catalogue-active');browse.classList.remove('is-active');browse.setAttribute('aria-pressed','false');}
  const representative=(category,kind)=>products.find(p=>(!category||p.category===category)&&(!kind||p.kind===kind))||products[0];
  const option=(value,title,photo,note='')=>`<button type="button" class="cx-catalogue-option" data-choice="${esc(value)}"><img src="${esc(photo)}" alt="" width="900" height="1000"><span><b>${esc(title)}</b>${note?`<small>${esc(note)}</small>`:''}</span><i aria-hidden="true">↗</i></button>`;
  function guide() {
    let title,options;
    if(state.step===0){title='Čo si chcete vybrať?';options=groups.map(([g,l])=>option(g,l,representative(g).photo,`${products.filter(p=>p.category===g).length} produktov`));}
    if(state.step===1){title='Aký produkt hľadáte?';const kinds=[...new Set(selected().map(p=>p.kind))];options=kinds.map(k=>option(k,k,representative(state.answers.category,k).photo));options.push(option('any','Nechajte mi širší výber',representative(state.answers.category).photo));}
    if(state.step===2){title='Aký rozpočet vám vyhovuje?';const list=selected();const currency=list[0]?.currency||'EUR';const thresholds=currency==='CZK'?[300,600,1000]:[10,20,35];const viable=thresholds.filter(n=>list.some(p=>p.priceAmount<=n));options=viable.map(n=>option(String(n),`Do ${n} ${currency==='CZK'?'Kč':'€'}`,list.find(p=>p.priceAmount<=n).photo));options.push(option('','Bez obmedzenia',list[0].photo));}
    if(state.step===3){title='Ako chcete ponuku zoradiť?';const list=selected();options=[option('price','Od najnižšej ceny',list[0].photo),option('name','Podľa názvu',list[Math.min(1,list.length-1)].photo)];const units=new Set(list.map(p=>p.volume.match(/ml|g|kg/)?.[0]).filter(Boolean));if(units.size===1&&list.filter(p=>p.volume).length>1){options.push(option('small','Od menšieho balenia',list[0].photo),option('large','Od väčšieho balenia',list.at(-1).photo));}}
    if(state.step>=4){const list=sorted();return `<div class="cx-catalogue-heading"><small>Váš výber · ${esc(labels[state.answers.category])}</small><h2>${list.length===1?'Tento produkt zodpovedá výberu':`${list.length} produktov podľa výberu`}</h2><p>Presné balenie, fotografia a cena z ponuky ${esc(brand.name)}.</p></div><div class="cx-catalogue-grid">${list.slice(0,6).map(card).join('')}</div>${list.length>6?`<button class="cx-catalogue-more" data-show-matches>Ukázať všetkých ${list.length} výsledkov</button>`:''}<button class="cx-catalogue-more" data-restart>Vybrať odznova</button>`;}
    return `<div class="cx-catalogue-heading"><div class="cx-catalogue-progress">${[0,1,2,3].map(i=>`<span class="${i<=state.step?'is-on':''}"></span>`).join('')}<small>${state.step+1}/4</small></div><h2 tabindex="-1">${esc(title)}</h2><p>${state.step===0?'Vyberte oblasť, ktorá vás zaujíma.':'Vyberajte z konkrétnych produktov tejto značky.'}</p></div><div class="cx-catalogue-options">${options.join('')}</div><div class="cx-catalogue-footer">${state.step>0?'<button type="button" data-back>← Späť</button>':''}${state.step===1&&state.answers.category==='face'?'<button type="button" data-face-advisor>Vybrať podľa typu pleti →</button>':''}<button type="button" data-browse>Prejsť ponuku</button></div>`;
  }
  function renderCards(){
    const list=products.filter(p=>(state.category==='all'||p.category===state.category)&&(!state.query||norm(p.name+' '+p.kind+' '+p.volume).includes(norm(state.query))));
    panel.querySelector('[data-catalogue-count]').textContent=`${list.length} z ${products.length} produktov`;
    panel.querySelector('.cx-catalogue-grid').innerHTML=list.length?list.map(card).join(''):'<p class="cx-catalogue-empty">Taký produkt sa v overenej ponuke nenachádza. Skúste iný názov alebo kategóriu.</p>';
  }
  function render(){
    if(state.mode==='guide'){panel.innerHTML=guide();panel.scrollTop=0;panel.querySelector('h2')?.focus({preventScroll:true});return;}
    panel.innerHTML=`<div class="cx-catalogue-heading"><small>Ponuka ${esc(brand.name)}</small><h2>Vyberte si z katalógu</h2><p>${brand.catalogueVerifiedAt?'Produkty overené '+new Date(brand.catalogueVerifiedAt).toLocaleDateString('sk')+'.':'Vybrané produkty z podkladov ukážky.'} Dostupnosť a cenu potvrďte v e-shope.</p><label class="cx-catalogue-search">Hľadať produkt<input type="search" placeholder="Názov, typ alebo balenie" value="${esc(state.query)}" autocomplete="off"></label><div class="cx-catalogue-filters" role="group" aria-label="Kategórie">${[['all','Všetko'],...allGroups].map(([g,l])=>`<button type="button" data-filter="${g}" aria-pressed="${g===state.category}">${l}</button>`).join('')}</div><p data-catalogue-count aria-live="polite"></p></div><div class="cx-catalogue-grid"></div>`;renderCards();
  }
  // Capture only our extra flows. Core chat, opening/closing and history stay intact.
  let allowLegacyOnce=false;
  document.addEventListener('click',event=>{
    const b=event.target.closest('button');if(!b)return;
    if(b.dataset.open==='chat'||b.id==='cx-open')legacy();
    if(!isWine&&(b.dataset.open==='advisor'||b.id==='cx-teaser'))queueMicrotask(()=>mode('guide'));
    if(b.dataset.mode==='chat'){legacy();return;}
    if(b.dataset.mode==='advisor'&&isWine){legacy();return;}
    if((b.dataset.mode==='advisor'&&!allowLegacyOnce)||b===browse){event.preventDefault();event.stopImmediatePropagation();mode(b===browse?'browse':'guide');return;}
    if(b.id==='cx-reset'&&widget.classList.contains('cx-catalogue-active')){event.preventDefault();event.stopImmediatePropagation();state.step=0;state.answers={};state.query='';state.category='all';render();return;}
    if(b.closest('.cx-catalogue-stage')){
      if(b.hasAttribute('data-choice')){const keys=['category','kind','budget','order'];state.answers[keys[state.step]]=b.dataset.choice;state.step++;render();}
      if(b.hasAttribute('data-back')){state.step--;const keys=['category','kind','budget','order'];keys.slice(state.step).forEach(k=>delete state.answers[k]);render();}
      if(b.hasAttribute('data-restart')){state.step=0;state.answers={};mode('guide');}
      if(b.hasAttribute('data-browse'))mode('browse');
      if(b.hasAttribute('data-show-matches')){panel.querySelector('.cx-catalogue-grid').innerHTML=sorted().map(card).join('');b.remove();}
      if(b.hasAttribute('data-filter')){state.category=b.dataset.filter;panel.querySelectorAll('[data-filter]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));renderCards();}
      if(b.hasAttribute('data-face-advisor')){legacy();allowLegacyOnce=true;nav.querySelector('[data-mode="advisor"]').click();allowLegacyOnce=false;}
    }
  },true);
  panel.addEventListener('input',e=>{if(e.target.matches('input[type="search"]')){state.query=e.target.value;renderCards();}});
  // The original advisor button switches to the broader guide; the initial chat remains.
  const observer=new MutationObserver(()=>{
    const oldEntry=document.querySelector('#cx-advisor-entry');
    if(!isWine&&oldEntry&&!oldEntry.dataset.catalogueBound){oldEntry.dataset.catalogueBound='true';oldEntry.addEventListener('click',()=>mode('guide'));}
  });observer.observe(widget.querySelector('#cx-stage'),{childList:true,subtree:true});
  window.CX_CATALOGUE_QA={products,groups,selected,sorted,state,mode};
})();
