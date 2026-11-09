/* Isolated S5 result component. Recommendation/routine compatibility stays in CXAdvisorCore. */
(() => {
 'use strict';
 if(document.body.dataset.series!=='s5')return;
 const slug=document.body.dataset.cosmeticsDemo,reg=window.S3_REG.demos[slug];
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 window.CX_LOCAL_REPLY=(text,history)=>window.S5CatalogueReply?.reply(slug,window.CX_CATALOGUES[slug],text,history)||null;
 const cs=reg.brand.lang==='cs',t=(a,b)=>cs?b:a,money=(n,c='EUR')=>new Intl.NumberFormat(cs?'cs-CZ':'sk-SK',{style:'currency',currency:c,minimumFractionDigits:c==='CZK'?0:2,maximumFractionDigits:2}).format(n);
 const choice=v=>reg.traitCopy?.[v]?.[cs?2:0]||({face:t('Pleť','Pleť'),eyes:t('Očné okolie','Oční okolí'),body:t('Telo','Tělo'),hair:'Vlasy',lips:t('Pery','Rty'),dry:t('Suchá','Suchá'),oily:t('Mastná alebo zmiešaná','Mastná nebo smíšená'),sensitive:t('Citlivá','Citlivá'),balanced:t('Normálna','Normální')})[v]||v;
 function profile(p){return [[p.category==='hair'?t('Typ vlasov','Typ vlasů'):t('Typ pokožky','Typ pokožky'),[...new Set(p.source?.skinTypesListed||[])].join(', ')],[t('Vôňa','Vůně'),p.source?.scent],[t('Vzhľad','Vzhled'),p.source?.finish]].filter(x=>x[1]).slice(0,4).map(([k,v])=>`<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('');}
 let current=null;
 function ship(sum,p){const f=reg.freeShip;if(!f)return '';const left=Math.max(0,f.from-sum);return `<p class="s5-shipping">${esc(f.strict?f.note:left? t('Do dopravy zdarma chýba ','Do dopravy zdarma chybí ')+money(left,p.currency):f.note)}<small>${esc(f.context||'')}</small></p>`;}
 window.CX_S5={kindNote(v){return reg.kindNotes?.[v] || t('Vyberte si formu starostlivosti.','Vyberte si formu péče.');},progress(engine,steps,step,state){const remaining=(a)=>{const s=engine.steps(a).find(s=>a[s.key]===undefined);if(!s)return 0;return 1+Math.max(...s.options.map(v=>remaining({...a,[s.key]:v})));};const completed=Object.keys(state.answers).length,n=completed+remaining(state.answers),i=step?completed+1:n;return `<div class="cx-quality-progress"><button type="button" data-back ${state.step===0&&!state.page?'disabled':''}>‹ ${t('Späť','Zpět')}</button><div role="progressbar" aria-valuemin="0" aria-valuemax="${n}" aria-valuenow="${i}">${Array.from({length:n},(_,k)=>`<span class="${k<i?'is-on':''}"></span>`).join('')}</div><b>${step?t('Krok ','Krok ')+i+t(' z ',' z ')+n:t('Výsledok','Výsledek')}</b>${step?`<small class="s5-path-note">${t('Najviac '+n+(n===1?' krok':n<5?' kroky':' krokov')+' podľa ďalších odpovedí.','Nejvýše '+n+(n===1?' krok':n<5?' kroky':' kroků')+' podle dalších odpovědí.')}</small>`:''}</div>`;},
 result(engine,p,state,steps){
  let add=window.CXAdvisorCore.complementFor(engine.products,state.answers,p);
  // Fragrance-free preference is a compatibility constraint even if the core asked it under another feature.
  if(state.answers.careVariant==='withoutFragrance'&&add?.source?.scent!=='Bez vône')add=null;
  const tags=Object.entries(state.answers).map(([key,v])=>key==='budget'?money(Number(v),p.currency):choice(v)).filter(Boolean);
  current={p,add,selected:false};
  const variants=(p.source?.variants||[]).filter(v=>v.available&&v.label!==p.source.variantLabel&&v.label!=='Default Title');
  return `<article class="cx-quality-product is-primary s5-product" style="grid-template-columns:88px minmax(0,1fr)!important" data-product-id="${esc(p.id)}"><div class="cx-quality-product-photo" style="width:88px!important;height:105px!important;min-height:0!important;aspect-ratio:auto!important"><img src="${esc(p.photo)}" alt="${esc(p.name)}"></div><div class="s5-product-copy"><small>${t('Váš výber','Váš výběr')}</small><h2>${esc(p.name)}</h2><p>${esc(p.volume)}${p.variantLabel?' · '+esc(p.variantLabel):''}</p><strong>${esc(p.price)}</strong></div><p class="s5-description">${esc(p.description)}</p><a class="s5-cta" href="${esc(p.url)}">${t('Pozrieť produkt','Zobrazit produkt')}</a></article>
  <div class="s5-answers" aria-label="${t('Zvolené odpovede','Zvolené odpovědi')}">${tags.map(s=>`<span>${esc(s)}</span>`).join('')}</div>
  ${profile(p)?`<dl class="s5-profile">${profile(p)}</dl>`:''}
  ${add?`<section class="s5-addon"><h3>${t('Voliteľne k tomu','Volitelně k tomu')}</h3><label><input type="checkbox" data-s5-addon><span><b>${esc(add.name)}</b><small>${t('Umývanie a následná starostlivosť o pokožku.','Mytí a následná péče o pokožku.')}</small><strong>+ ${esc(add.price)}</strong></span></label><a href="${esc(add.url)}">${t('Pozrieť doplnok','Zobrazit doplněk')}</a></section>`:''}
  <div class="s5-total" aria-live="polite"><span>${t('Spolu za zvolené produkty','Celkem za zvolené produkty')}</span><strong data-s5-total>${esc(p.price)}</strong></div><div data-s5-shipping>${ship(p.priceAmount,p)}</div>
  ${variants.length?`<details class="s5-details"><summary>${t('Ďalšie varianty','Další varianty')}</summary>${variants.map(v=>`<p>${esc(v.label)} · ${money(v.price,p.currency)}</p>`).join('')}</details>`:''}
  <button type="button" class="cx-quality-more" data-result-chat>${t('Spýtať sa poradcu','Zeptat se poradce')}</button>`;
 }};
 document.addEventListener('change',e=>{if(!e.target.matches('[data-s5-addon]')||!current)return;current.selected=e.target.checked;const {p,add}=current;const sum=Math.round((p.priceAmount+(current.selected?add.priceAmount:0))*100)/100;document.querySelector('[data-s5-total]').textContent=money(sum,p.currency);document.querySelector('[data-s5-shipping]').innerHTML=ship(sum,p);});
})();
