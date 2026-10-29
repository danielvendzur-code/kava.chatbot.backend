/* n447 dávka 2 (kozmetika2) – kópia care-result-guide.js. Navyše: doplnok firmy do vlastnej zostavy podľa brand.addons
   (započíta sa do súčtu), CTA pri sade. Overené texty pôvodného súboru (VERIFIED_DETAILS) sa tu nepoužívajú. */
(function(scope){
 'use strict';
  const details={};
 const norm=v=>String(v||'').normalize('NFD').replace(/\p{Diacritic}/gu,'').toLowerCase();
 function create(products,answers,opts={}){
  const cs=products.some(p=>p.currency==='CZK')||products.some(p=>/^https?:\/\/[^/]*\.cz(?:\/|$)/.test(p.url)),t=(sk,cz)=>cs?cz:sk;
  const role=p=>{if(p.features?.packType==='shampooDuo')return 'set';const s=norm(p.kind+' '+p.name);if(/suchy sampon|dry shampoo/.test(s))return 'dryShampoo';if(/sampon|sampuk|shampoo/.test(s))return 'shampoo';if(/kondicion|conditioner|vlasov.*balzam/.test(s))return 'conditioner';if(/cisten|odlic|mydl|myci|umyv|cleanser|cleansing|soap/.test(s))return 'cleanser';if(/ser[au]|serum/.test(s))return 'serum';if(/krem|cream/.test(s))return 'cream';if(/olej|oil/.test(s))return 'oil';return 'other';};
  function description(p){const d=details[p.id];if(d?.url===p.url)return d.text;
   // Only reuse text collected from this exact official product page, never inferred category copy.
   const verified=p.source?.url===p.url&&p.source?.verifiedAt&&/^official .*description$/.test(p.source?.suitabilitySource||'');
   const text=String(p.description||'').replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim();
   if(verified&&text&&!/\/(?:de|pl|en)\//.test(new URL(p.url).pathname)){
     const first=text.match(/^.*?[.!?](?=\s|$)/)?.[0]||text;
     return first.length<=260?first:first.slice(0,257).replace(/\s+\S*$/,'')+'…';
   }
   const r=role(p),care=['face','body','eyes','lips','hair','beard'].includes(p.category);if(!care)return '';
   return ({cleanser:t('Čistiaci krok vašej starostlivosti.','Čisticí krok vaší péče.'),serum:t('Sérum ako cielený krok starostlivosti.','Sérum jako cílený krok péče.'),cream:t('Krémový krok starostlivosti.','Krémový krok péče.'),oil:t('Starostlivosť s olejovým základom.','Péče s olejovým základem.'),shampoo:t('Na umývanie vlasov a pokožky hlavy.','Pro mytí vlasů a pokožky hlavy.'),conditioner:t('Starostlivosť o vlasy po umytí.','Péče o vlasy po umytí.'),dryShampoo:t('Suchý šampón na osvieženie vlasov medzi umytiami.','Suchý šampon pro osvěžení vlasů mezi mytím.')})[r]||'';
  }
  function routine(p){const r=role(p);if(!['face','body','hair','eyes','lips','beard'].includes(p.category))return '';
   if(r==='shampoo')return t('Po umytí môžete starostlivosť doplniť kondicionérom podľa potrieb vlasov.','Po umytí můžete péči doplnit kondicionérem podle potřeb vlasů.');
   if(r==='conditioner')return t('Kondicionér patrí do starostlivosti po umytí vlasov. Rozsah použitia a oplachovanie sa riaďte návodom konkrétneho produktu.','Kondicionér patří do péče po umytí vlasů. Rozsah použití a oplachování se řídí návodem konkrétního produktu.');
   if(r==='dryShampoo')return t('Používajte ho medzi umytiami podľa návodu. Suchý šampón nenahrádza bežné umývanie.','Používejte ho mezi mytím podle návodu. Suchý šampon nenahrazuje běžné mytí.');
   if(r==='cleanser'&&p.category==='face')return t('Čistenie tvorí prvý krok rutiny; potom môžete pokračovať vhodnou pleťovou starostlivosťou.','Čištění tvoří první krok rutiny; potom můžete pokračovat vhodnou pleťovou péčí.');
   if(['serum','cream'].includes(r)&&p.category==='face')return t('Zaraďte ho do rutiny po čistení. Pri kombinovaní viacerých aktívnych produktov sa riaďte ich návodmi.','Zařaďte ho do rutiny po čištění. Při kombinování více aktivních produktů se řiďte jejich návody.');
   return '';
  }
  const cost=p=>p.source?.priceFrom?(Number.isFinite(p.source.priceMax)?p.source.priceMax:Infinity):(Number.isFinite(p.priceAmount)?p.priceAmount:Infinity);
  function total(p,items){
   const bundle=[p,...items.filter(x=>x.type==='complement').map(x=>x.product)],amount=bundle.reduce((sum,x)=>sum+cost(x),0);
   return Number.isFinite(amount)?{amount:Math.round(amount*100)/100,upperBound:bundle.some(x=>x.source?.priceFrom),currency:p.currency}:null;
  }
  function next(p,matches){const seen=new Set([p.id]),photos=new Set([String(p.photo).split('?')[0]]),limit=Number(answers.budget)||Infinity,eligible=x=>x.available!==false&&!x.isSample&&x.currency===p.currency&&x.photo&&!seen.has(x.id)&&!photos.has(String(x.photo).split('?')[0])&&cost(x)<=limit;
   const complementary={cleanser:['cream'],cream:['cleanser'],serum:['cream'],shampoo:['conditioner'],conditioner:['shampoo']},roles=complementary[role(p)]||[];
   const facetOk=x=>(opts.facetKeys||[]).every(k=>!answers[k]||answers[k]==='any'||['scope','focus'].includes(k)||x.features?.[k]==null||(Array.isArray(x.features?.[k])?x.features[k].includes(answers[k]):x.features?.[k]===answers[k]));
   const safe=x=>facetOk(x)&&!/(?:retin[oa]l|\baha\b|\bbha\b|peeling|kyselin|esencial|eterick)/.test(norm(x.name+' '+x.kind))&&(!answers.profile||answers.profile==='any'||x.signals?.includes(answers.profile)||x.source?.allSkinTypes===true)&&(answers.careVariant!=='withoutFragrance'||/bez vun|bez von|without fragrance|unscented/.test(norm(x.name+' '+(x.description||''))));
   const extra=products.filter(x=>eligible(x)&&x.category===p.category&&roles.includes(role(x))&&safe(x)&&(!answers.budget||cost(p)+cost(x)<=limit)).sort((a,b)=>cost(a)-cost(b))[0],items=[];
   /* k2: doplnok firmy do zostavy (mydelnička, hrebeň, konjac…) podľa pravidiel značky */
   const rule=(opts.addons||[]).find(r=>(!r.categories||r.categories.includes(p.category))&&(!r.kinds||r.kinds.includes(p.kind)));
   const addon=rule&&(opts.all||[]).filter(x=>rule.ids.includes(x.id)&&x.available!==false&&x.currency===p.currency&&Number.isFinite(x.priceAmount)&&(!answers.budget||cost(p)+(extra?cost(extra):0)+x.priceAmount<=limit)).sort((a,b)=>rule.ids.indexOf(a.id)-rule.ids.indexOf(b.id))[0];
   if(extra){items.push({type:'complement',product:extra,label:t('Doplňte svoju rutinu','Doplňte svou rutinu'),note:role(extra)==='cleanser'?t('Ako prvý krok: čistenie.','Jako první krok: čištění.'):role(extra)==='conditioner'?t('Po umytí: kondicionér.','Po umytí: kondicionér.'):role(extra)==='shampoo'?t('Na umývanie: šampón.','Pro mytí: šampon.'):t('Ako ďalší krok: krémová starostlivosť.','Jako další krok: krémová péče.')});seen.add(extra.id);photos.add(String(extra.photo).split('?')[0]);}
   if(addon){items.push({type:'complement',product:addon,label:t('Doplnok do zostavy','Doplněk do sestavy'),note:t(rule.sk,rule.cs||rule.sk)});seen.add(addon.id);photos.add(String(addon.photo).split('?')[0]);}
   const alternative=matches.find(x=>eligible(x)&&(!answers.budget||cost(x)+(extra?cost(extra):0)<=limit));
   if(alternative)items.push({type:'alternative',product:alternative,label:t('Alternatíva k hlavnému produktu','Alternativa k hlavnímu produktu'),note:t('Môžete ho zvoliť namiesto hlavného odporúčania.','Můžete ho zvolit místo hlavního doporučení.')});
   return items;
  }

  function budgetNote(p,items){
   if(!answers.budget||items.some(x=>x.type==='complement'))return '';
   const extra=create(products,{...answers,budget:''}).next(p,[]).find(x=>x.type==='complement');
   if(!extra||!Number.isFinite(cost(p)+cost(extra.product))||cost(p)+cost(extra.product)<=Number(answers.budget))return '';
   return t('Vhodný doplnok by prekročil váš rozpočet, preto odporúčam tento produkt samostatne.','Vhodný doplněk by překročil váš rozpočet, proto doporučuji tento produkt samostatně.');
  }
  return {description,routine,next,total,budgetNote,t};
 }
 scope.CXCareResultGuide={create};
})(globalThis);
