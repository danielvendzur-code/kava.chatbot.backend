/* REVIEW MODULE: explicit S5 fragrance opt-in only. MAIN imports after support.js.
   Extends the result view; recommendation/core/chat/cart logic stays unchanged. */
(() => {
 'use strict';
 const slug=document.body.dataset.cosmeticsDemo,reg=window.S3_REG?.demos?.[slug],opt=reg?.fragranceResultExtras;
 if(document.body.dataset.series!=='s5'||reg?.segment!=='fragrance'||opt?.version!==1||opt.enabled!==true)return;
 if(!window.CX_S5?.result)throw Error('Fragrance extras must load after S5 support');
 if(window.CX_S5.fragranceExtrasInstalled)return;
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const cs=reg.brand.lang==='cs',t=(sk,cz)=>cs?cz:sk;
 const money=(n,c)=>new Intl.NumberFormat(cs?'cs-CZ':'sk-SK',{style:'currency',currency:c,minimumFractionDigits:Number.isInteger(n)?0:2,maximumFractionDigits:2}).format(n);
 const safeUrl=u=>{try{return /^https:$/.test(new URL(u).protocol);}catch{return false;}};
 const eligible=p=>p?.source?.series==='s5'&&p.category==='fragrance'&&p.available!==false&&Number.isFinite(p.priceAmount)&&safeUrl(p.url);
 function exactPackSource(v,p){
  if(!safeUrl(v.url)||new URL(v.url).origin!==new URL(p.url).origin)return false;
  const knownStock=v.evidence?.isNotSoldOut===true||(v.evidence?.scope==='WixProductPublicStructuredOffer'&&/\/InStock$/.test(v.evidence.availabilityUrl||''))||(
   v.evidence?.scope==='WooCommerceProductPublicAvailability'&&v.evidence.stockClass==='instock'&&/\/InStock$/.test(v.evidence.availabilityUrl||''));
  if(!knownStock)return false;
  if(v.url===p.url)return v.variantSelectionRequired===true;
  return v.variantSelectionRequired===false&&v.evidence?.parentProductUrl===p.url&&v.evidence.sourceUrl===v.url&&v.evidence.sameCompositionTitle&&v.evidence.sameCompositionParentTitle===p.name;
 }
 function supplementFor(p,answers){
  const id=opt.addonProductIdsByParent?.[p.id];
  const x=window.CX_CATALOGUES?.[slug]?.products?.find(x=>x.id===id),e=x?.source?.resultSupplementEvidence;
  if(!x||x.id===p.id||x.category!=='body'||x.source?.series!=='s5'||x.source.resultOnlySupplement!==true||!x.source.advisorExcludedReason||x.available!==true||x.currency!==p.currency||!safeUrl(x.url)||new URL(x.url).origin!==new URL(p.url).origin||!Number.isFinite(x.priceAmount)||x.priceAmount<=0)return null;
  if(e?.relationship!=='same-fragrance-line'||e.parentProductId!==p.id||e.parentProductUrl!==p.url||e.sourceUrl!==x.url||!safeUrl(e.merchantRelatedProductUrl)||new URL(e.merchantRelatedProductUrl).origin!==new URL(x.url).origin||new URL(e.merchantRelatedProductUrl).pathname!==new URL(x.url).pathname||!e.fragranceLine||e.parentFragranceLine!==e.fragranceLine||!e.exactVariantId||e.available!==true||!e.sourceSha256||!e.checkedAt||e.scope!=='ShopifyPublicVariant')return null;
  if(!x.photo?.startsWith('/assets/s5/'+slug+'/')||x.source.photoEvidence?.selectedPack!==x.volume||!e.displayLabel)return null;
  if(answers.budget&&p.priceAmount+x.priceAmount>Number(answers.budget))return null;
  return {...x,resultSupplement:true,displayLabel:e.displayLabel,variantSelectionRequired:false,photoEvidence:x.source.photoEvidence};
 }
 function extraFor(p,answers){
  if(!eligible(p))return null;
  const supplement=supplementFor(p,answers);if(supplement)return supplement;
  return (p.source.upsellVariants||[]).find(v=>v.sameFormula===true&&v.parentProductId===p.id&&v.available===true&&v.currency===p.currency&&exactPackSource(v,p)&&v.evidence?.exactVariantId&&v.evidence?.sourceSha256&&['Skladem','Skladom','InStock'].includes(v.evidence?.stock)&&v.volume!==p.volume&&Number.isFinite(v.priceAmount)&&v.priceAmount>0&&(!answers.budget||p.priceAmount+v.priceAmount<=Number(answers.budget)))||null;
 }
 const sourceNotes=p=>{const e=p?.source?.fragrance?.notesEvidence;return e?.displayLanguage===reg.brand.lang&&e?.translatedFrom==='en'&&e.sourceText?e.displayText||e.sourceText:e?.sourceText||'';};
 function pyramid(p){
  const text=sourceNotes(p),m=text.match(/(?:Hlava|Vrchné tóny|Vrchní tóny):\s*(.*?)\s*;?\s*Srdce:\s*(.*?)\s*;?\s*Základ:\s*([\s\S]*)/i);
  if(!m)return '';
  return `<details class="fr-extra-notes"><summary>${t('Ako sa vôňa rozvíja','Jak se vůně rozvíjí')}</summary><dl>${m.slice(1).map((x,i)=>`<div><dt>${['Hlava','Srdce','Základ'][i]}</dt><dd>${esc(x.replace(/;\s*$/,'').trim())}</dd></div>`).join('')}</dl></details>`;
 }
 let current=null;const original=window.CX_S5.result;
 window.CX_S5.result=function(engine,p,state,steps){
  const result=original.call(this,engine,p,state,steps);
  if(!eligible(p))return result;
  const addon=extraFor(p,state.answers),alt=engine.products.find(x=>x.id===opt.alternatives?.[p.id]&&x.id!==p.id&&eligible(x)&&x.currency===p.currency&&x.photo!==p.photo);
  current={id:p.id,p,addon};
  const view=document.createElement('template');view.innerHTML=result;
  view.content.querySelectorAll('.s5-profile').forEach(e=>e.remove());
  const primary=view.content.querySelector('.s5-product');primary?.setAttribute('data-fragrance-result','enhanced');
  const description=primary?.querySelector('.s5-description');if(description&&!p.isSample&&!p.source.identityDisclosure&&!/tester/i.test(p.volume||''))description.textContent=p.reason||p.source.scent||p.description;
  const total=view.content.querySelector('.s5-total');
  if(!primary||!total)return result;
  total.setAttribute('data-fragrance-selection',p.id);
  const extra=document.createElement('section');extra.className='fr-result-extras';extra.setAttribute('aria-label',t('Doplnenie výberu','Doplnění výběru'));
  extra.innerHTML=pyramid(p)+(addon?`<section class="fr-extra-pack"><div class="fr-extra-kicker">${t('Dobrovoľne navyše','Dobrovolně navíc')}</div><label><input type="checkbox" data-fragrance-extra="${esc(p.id)}">${addon.photo?.startsWith("/assets/s5/"+slug+"/")&&addon.photoEvidence?.selectedPack===addon.volume?`<img class="fr-extra-pack-photo" src="${esc(addon.photo)}" alt="${esc(addon.name)} · ${esc(addon.volume)}">`:""}<span><b>${addon.resultSupplement?esc(addon.displayLabel)+' · '+esc(addon.volume):t('Pridať aj','Přidat i')+' '+esc(addon.volume)+' '+t('balenie','balení')}</b><small>${addon.resultSupplement?esc(addon.name)+' · '+t('rovnaká vonná línia','stejná vonná řada'):esc(p.name)+' · '+t('rovnaká vôňa','stejná vůně')}</small><strong>+ ${esc(addon.price)}</strong></span></label><a href="${esc(addon.url)}">${t('Pozrieť','Zobrazit')} ${esc(addon.volume)} ${t('na e-shope','na e-shopu')} →</a><small class="fr-extra-caveat">${addon.variantSelectionRequired?t('Objem vyberte na e-shope. Výber nič nevkladá do košíka.','Objem vyberte na e-shopu. Výběr nic nevkládá do košíku.'):addon.resultSupplement?t('Samostatné telové mlieko z rovnakej vonnej línie. Výber nič nevkladá do košíka.','Samostatné tělové mléko ze stejné vonné řady. Výběr nic nevkládá do košíku.'):t('Odkaz vedie priamo na menšie balenie. Výber nič nevkladá do košíka.','Odkaz vede přímo na menší balení. Výběr nic nevkládá do košíku.')}</small></section>`:'');
  total.before(extra);
  if(alt){
   const related=document.createElement('section');related.className='fr-extra-related';related.innerHTML=`<h3>${t('Ďalšia vôňa na porovnanie','Další vůně na porovnání')}</h3><div class="fr-related-card" data-fragrance-alternative="${esc(alt.id)}"><img src="${esc(alt.photo)}" alt="${esc(alt.name)}"><div><b>${esc(alt.name)}</b><small>${esc(alt.volume)} · <strong>${esc(alt.price)}</strong></small><p>${esc(alt.source.scent||alt.reason)}</p><a href="${esc(alt.url)}">${t('Pozrieť vôňu','Zobrazit vůni')} →</a></div></div><details class="fr-extra-compare"><summary>${t('Porovnať tieto dve vône','Porovnat tyto dvě vůně')}</summary><div class="fr-compare-cols">${[p,alt].map(x=>`<article data-fragrance-compare-id="${esc(x.id)}"><b>${esc(x.name)}</b><small>${esc(x.volume)} · ${esc(x.price)}</small><p>${esc(x.source.scent||x.reason)}</p><a href="${esc(x.url)}">${t('Pozrieť produkt','Zobrazit produkt')} →</a></article>`).join('')}</div></details><small class="fr-extra-caveat">${t('Samostatná alternatíva. Nie je započítaná do výberu.','Samostatná alternativa. Není započítaná do výběru.')}</small>`;
   total.after(related);
  }
  return view.innerHTML;
 };
 window.CX_S5.fragranceExtrasInstalled=true;
 document.addEventListener('change',e=>{
  if(!e.target.matches('[data-fragrance-extra]')||!current||e.target.dataset.fragranceExtra!==current.id||!current.addon)return;
  const box=document.querySelector('[data-fragrance-selection="'+CSS.escape(current.id)+'"] [data-s5-total]');
  if(box)box.textContent=money(Math.round((current.p.priceAmount+(e.target.checked?current.addon.priceAmount:0))*100)/100,current.p.currency);
 });
})();
