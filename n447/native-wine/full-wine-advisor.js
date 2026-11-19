/* Visuals describe an answer, never a candidate SKU. Product photography stays in results. */
(function(scope){'use strict';
 const norm=s=>String(s||'').normalize('NFD').replace(/\p{Diacritic}/gu,'').toLowerCase();
 const photos={face:['face-clean-pad','34% 34%'],body:['hands-cream','50% 65%'],hair:['hair-natural','50% 40%'],beard:['beard-care','50% 40%'],lips:['lip-care','70% 50%'],makeup:['makeup-brush','50% 50%'],sets:['gift-care','50% 55%'],
  'kremy':['cream-texture','50% 50%'],'kremy a balzamy':['cream-texture','50% 50%'],'sera':['serum-drop','50% 45%'],'oleje':['oil-palm','50% 55%'],'masky':['face-cleanse','50% 35%'],'tonika a vody':['face-water','50% 40%'],'cistenie a umyvanie':['face-clean-pad','34% 34%'],'sampony':['hair-shampoo','50% 55%'],'kondicionery':['hair-brush','50% 45%'],
  dailycare:['cream-texture','50% 50%'],cleansingcare:['face-clean-pad','34% 34%'],makeupremoval:['face-clean-pad','34% 34%'],washing:['face-cleanse','50% 40%'],toning:['face-water','50% 40%'],occasionalcare:['face-cleanse','50% 35%'],maskcare:['face-cleanse','50% 35%'],nourishingcare:['cream-texture','50% 50%'],hydrationcare:['serum-drop','50% 45%'],regenerationcare:['oil-palm','50% 55%'],handcare:['hands-cream','50% 65%'],hands:['hands-cream','50% 65%'],
  hairwashing:['hair-shampoo','50% 55%'],afterhairwash:['hair-brush','50% 45%'],dryhair:['hair-brush','50% 45%'],curlyhair:['hair-natural','50% 40%'],curlcare:['hair-natural','50% 40%'],hairhydration:['hair-brush','50% 45%'],leavein:['hair-natural','50% 40%'],rinseout:['hair-wash','50% 40%']};
 const icons={
  face:'<path d="M60 17c-21 0-30 14-27 36 3 24 14 36 27 36s24-12 27-36c3-22-6-36-27-36Z"/><path d="M44 48h5m22 0h5M57 56l-2 11h9M49 76q11 8 22 0"/>',
  eye:'<path d="M16 52Q60 7 104 52Q60 97 16 52Z"/><circle cx="60" cy="52" r="15"/><circle cx="64" cy="48" r="4"/>',
  foot:'<path d="M66 15c9 0 12 10 10 21l-5 25c-1 10 17 13 17 22 0 6-6 10-16 9L35 82c-11-4-9-14-2-23 8-11 5-18 10-25 6-8 15-8 15-14 0-4 3-5 8-5Z"/><path d="m43 71 24 7"/>',
  hand:'<path d="M37 59V28q0-9 8-8 6 0 6 8v20-29q0-8 7-8t7 8v29-24q0-8 7-8t7 8v29-17q0-7 7-7t7 7v29c0 22-10 30-27 30-12 0-17-5-25-14L25 63q-6-8 0-12t12 8Z"/>',
  hair:'<path d="M29 87c7-15-4-23 2-37s-2-31 13-35m4 72c7-15-4-23 2-37s-2-31 13-35m4 72c7-15-4-23 2-37s-2-31 13-35m4 72c7-15-4-23 2-37s-2-31 13-35"/>',
  drop:'<path d="M60 12c-8 15-29 36-29 53a29 29 0 0 0 58 0c0-17-21-38-29-53Z"/><path d="M43 66q0 16 16 17"/>',
  shield:'<path d="M60 12 91 25v28c0 22-14 32-31 41-17-9-31-19-31-41V25Z"/><path d="m45 52 10 11 22-24"/>',
  gentle:'<path d="M59 85C10 54 26 22 45 26q9 0 14 11 5-11 14-11c24 0 34 29-14 59Z"/><path d="m23 15-5-6m84 9 5-6M12 48H5m110 0h-7"/>',
  sun:'<circle cx="60" cy="52" r="20"/><path d="M60 10v13m0 58v13M18 52h13m58 0h13M30 22l9 9m42 42 9 9m0-60-9 9M39 73l-9 9"/>',
  moon:'<path d="M77 15a37 37 0 1 0 24 56A38 38 0 0 1 77 15Z"/><path d="m26 17 2-6 2 6 6 2-6 2-2 6-2-6-6-2Z"/>',
  flower:'<path d="M60 49c-26-37 17-47 8-8 37-26 47 17 8 16 29 32-13 50-18 12-26 34-51 0-16-15-38-3-23-40 8-13"/><circle cx="60" cy="52" r="8"/>',
  leaf:'<path d="M89 15C45 13 19 35 33 66c15 22 52 12 56-51Z"/><path d="m26 90 52-58m-33 30-3-18m17 4 17 1"/>',
  bottle:'<rect x="48" y="12" width="24" height="11" rx="3"/><path d="M50 23v10L38 43v42q0 7 7 7h30q7 0 7-7V43L70 33V23"/><path d="M45 58h30m-30 9h30"/>',
  refill:'<path d="m39 12-10 78h62L81 12Z"/><path d="M39 22h42M49 61a16 16 0 0 1 25-15m0 0V34m0 12H62m10 15a16 16 0 0 1-25 15m0 0v12m0-12h12"/>',
  applicator:'<path d="M45 90V44h30v46Zm5-46V28h20v16m-18-16V15h35v10H69"/><path d="m91 33 8 4m-10 6 7 8m-12-1 3 10"/>',
  glass:'<path d="m35 15 8 72q1 7 8 7h18q7 0 8-7l8-72Z"/><path d="M37 28h46M51 37l4 39"/>',
  weight:'<path d="M42 31h36l15 59H27Z"/><path d="M49 31v-8a11 11 0 0 1 22 0v8"/><path d="M46 62h28m-14-9v18"/>',
  coin:'<circle cx="60" cy="52" r="34"/><path d="M73 31c-20-12-35 3-35 21s15 33 35 21M29 46h33M29 58h30"/>',
  infinity:'<path d="M60 53c-11-17-17-23-29-23-25 0-25 44 0 44 12 0 18-6 29-21s17-23 29-23c25 0 25 44 0 44-12 0-18-6-29-21Z"/>',
  texture:'<path d="M25 72c12-15 11-37 35-45 15 4 6 16 19 21 22 8 20 35 4 40H39q-17-1-14-16Z"/><path d="M36 76c16-18 31-6 46-17"/>',
  sparkle:'<path d="m60 12 9 29 29 9-29 9-9 29-9-29-29-9 29-9Z"/><path d="m94 10 3 10 10 3-10 3-3 10-3-10-10-3 10-3Z"/>',
  wash:'<path d="M37 39c0-23 44-23 44 0v7H37Z"/><path d="M41 55v6m19-6v6m19-6v6M32 75v7m19-7v7m19-7v7m19-7v7"/>',
  razor:'<rect x="30" y="15" width="60" height="23" rx="6"/><path d="M40 23h40M56 38v48q0 9 8 7V38"/>',
  lips:'<path d="M16 52q17-6 32-20 8-5 12 2 4-7 12-2 15 14 32 20-44 57-88 0Z"/><path d="M16 52q44 18 88 0"/>',
  gift:'<rect x="25" y="42" width="70" height="50" rx="4"/><path d="M21 30h78v15H21Zm39 0v62M60 30C20 32 29-4 48 14Zm0 0C100 32 91-4 72 14Z"/>',
  tune:'<path d="M20 26h80M20 52h80M20 78h80"/><circle cx="44" cy="26" r="8"/><circle cx="77" cy="52" r="8"/><circle cx="52" cy="78" r="8"/>',
  target:'<circle cx="60" cy="52" r="31"/><circle cx="60" cy="52" r="17"/><circle cx="60" cy="52" r="4"/><path d="M60 8v13m0 62v13M16 52h13m62 0h13"/>',
  smile:'<circle cx="60" cy="52" r="34"/><path d="M44 41h2m28 0h2M41 62q19 21 38 0"/>',
  brush:'<path d="m43 77-9 16m30-35 21-33q6-12-6-16L51 7 30 41q-6 10 4 16Z"/><path d="m38 35 28 16m-24-24 28 16m-23-24 28 16"/>',
  teeth:'<path d="M33 18c12-8 17 0 27 0s15-8 27 0c18 17 0 36-4 53-7 31-14 26-17 5-3-20-9-20-12 0-3 21-10 26-17-5-4-17-22-36-4-53Z"/>'
 };
 const xml=s=>String(s).replace(/[<>&"']/g,c=>({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;',"'":'&apos;'}[c]));
 function symbol(kind,label,value){const n=norm(value),number=String(value).match(/\d+(?:[.,]\d+)?/)?.[0],unit=String(value).match(/\b(?:ml|kg|g|l)\b/i)?.[0];const caption=kind==='coin'?String(label).slice(0,22):kind==='bottle'&&number&&unit?number+' '+unit:null;const body=icons[kind]||icons.tune;
  return {photo:'data:image/svg+xml;charset=utf-8,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 108"><title>'+xml(label||value)+'</title><rect width="120" height="108" rx="14" fill="#f3f0eb"/><g fill="none" stroke="#53645c" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"'+(caption?' transform="translate(15 0) scale(.75)"':'')+'>'+body+'</g>'+(caption?'<text x="60" y="101" text-anchor="middle" fill="#293c33" font-family="Arial,sans-serif" font-size="15">'+xml(caption)+'</text>':'')+'</svg>'),position:'center',symbol:true,meaning:kind};
 }
 function iconFor(key,v,category){const n=norm(v);if(key==='budget')return 'coin';if(key==='size')return /\b(g|kg)\b/.test(n)?'weight':'bottle';if(/refill|nahrad/.test(n))return 'refill';if(/aplikator|applicator|pump/.test(n))return 'applicator';if(/glass|sklen/.test(n))return 'glass';if(/pack|balen|travel/.test(n))return 'bottle';if(/foot|feet|chod|nohy|paty/.test(n))return 'foot';if(/hand|ruk/.test(n))return 'hand';if(/eye|rias|ocn|obo/.test(n))return 'eye';if(/shav|holeni/.test(n))return 'razor';if(/lips|pery|rty/.test(n))return 'lips';if(/oral|ustna|zub/.test(n))return 'teeth';if(/sun|spf|day|den/.test(n))return 'sun';if(/night|noc/.test(n))return 'moon';if(/sensitiv|calm|citliv|upokoj|gentle|intimate/.test(n))return 'gentle';if(/hydrat|dry|such|water|toning/.test(n))return 'drop';if(/oily|mast|oil|olej/.test(n))return 'drop';if(/cleans|wash|umy|cist|hygien/.test(n))return 'wash';if(/cream|krem|balz|rich|textur|shea/.test(n))return 'texture';if(/radiance|firm|mature|vrask|shine|growth/.test(n))return 'sparkle';if(/hair|vlas|scalp|curl|volume|dandruff|silver|dark|blond/.test(n))return 'hair';if(/rose|ruz|levand|lavend|chamom|harman|flower|orangeblossom/.test(n))return 'flower';if(/almond|argan|grape|marhul|rosemary|rooibos|neem|leaf/.test(n))return 'leaf';if(/gift|set|darcek/.test(n))return 'gift';if(/makeup|licen/.test(n))return 'brush';if(/face|plet|balanced/.test(n))return 'face';if(key==='ingredient')return 'drop';if(key==='profile'||key==='goal')return category==='hair'?'hair':'face';return 'tune';}
 const baseIconFor=iconFor;
 function descriptiveIcon(key,value,category){const n=norm(value);if(key==='budget'&&!value)return 'infinity';if(n==='targetedcare')return 'target';if(n==='specificarea')return 'hand';if(n==='dailycare')return 'smile';if(key==='profile'&&category==='body')return /dry|hydr|oily/.test(n)?'drop':'hand';return baseIconFor(key,value,category);}
 function resolve({key,value,category,title},used=new Set()){
  let n=norm(value),pair=photos[n];if(key==='category')pair=photos[n];
  if(category==='hair'){
   const hairPhotos={dailycare:['hair-natural','50% 40%'],sera:['hair-natural','50% 40%'],'tonika a vody':['hair-natural','50% 40%'],'cistenie a umyvanie':['hair-shampoo','50% 55%']};
   if(hairPhotos[n])pair=hairPhotos[n];
   if(n==='masky'||n==='occasionalcare'||n==='maskcare'||n==='cleansingcare'||n==='hydrationcare')pair=null;
  }
  if(key==='size'||key==='budget'||key==='packType'||key==='ingredient')pair=null;
  if(pair){const src='/assets/scenes/'+pair[0]+'.jpg';if(!used.has(src)){used.add(src);return {photo:src,position:pair[1],symbol:false,meaning:n};}}
  return symbol(descriptiveIcon(key,value,category),title||value,value);
 }
 function descriptive({key,value,title,domain}){
  const n=norm(value),label=title||String(value),kind=key==='budget'?(!value||value==='any'?'infinity':'coin'):/gift|sets|target/.test(n)?'gift':/sun|bright/.test(n)?'sun':/low|shade/.test(n)?'moon':/water|hydro/.test(n)?'drop':/flower|berry|orchard|exotic|warm/.test(n)?'flower':/volume|size|weight|pot|material|form/.test(key)?'bottle':domain==='wine'?'glass':'leaf';
  const art=symbol(kind,label,value),svg=decodeURIComponent(art.photo.split(',').slice(1).join(','));
  art.photo='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg.replace(/<\/svg>$/,'<text x="60" y="103" text-anchor="middle" fill="#293c33" font-family="Arial,sans-serif" font-size="8">'+xml(label.slice(0,28))+'</text></svg>'));return art;
 }
 scope.CXChoiceVisuals={resolve,descriptive};
})(globalThis);

(()=>{'use strict';const slug=document.body.dataset.cosmeticsDemo,brand=window.COSMETICS_DEMOS?.brands?.[slug],widget=document.querySelector('#cx-widget'),catalogue=globalThis.CX_WINE_CATALOGUES?.[slug];if(!widget||!catalogue)return;
 const core=globalThis.CXWineAdvisorCore,engine=core.create(catalogue.products,catalogue),labels={...core.labels,still:'Tiché víno',bubbly:'Perlivé víno',...catalogue.colorLabels},esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const state={step:0,page:0,answers:{},expanded:false,limit:24,other:false},nav=widget.querySelector('.cx-mode'),stage=widget.querySelector('#cx-stage'),panel=document.createElement('section');panel.className='cx-quality-stage cx-catalogue-stage';panel.hidden=true;panel.setAttribute('aria-label','Poradca pri výbere vína');stage.after(panel);widget.classList.add('cx-has-catalogue');
 const descriptions={still:'Biele, ružové alebo červené víno bez bubliniek',bubbly:'Frizzante s jemným perlením',crisp:'Sviežosť a ľahkosť uvedená v opise vína',fruity:'Ovocný charakter podľa opisu vinárstva',bold:'Výraznejšie telo alebo drevo v opise vína',white:'Biele vína z aktuálnej ponuky',red:'Červené vína z aktuálnej ponuky',rose:'Ružové vína z aktuálnej ponuky',orange:'Víno označené ako oranžové',sparkling:'Sekt, perlivé víno alebo pét-nat',mixed:'Rozhodnú ďalšie odpovede',dry:'Najmenej sladký štýl podľa označenia vinárstva','medium-dry':'Jemný zvyškový cukor','medium-sweet':'Výraznejšie sladký štýl',sweet:'Víno označené ako sladké',any:'Rozhodnú ďalšie odpovede',simple:'Jedno víno podľa vašich odpovedí',basic:'Najviac tri rôzne vhodné vína',full:'Najviac štyri rôzne vhodné vína',target:'Jedna fľaša vybraná podľa vášho vkusu',fish:'Ľahšie jedlá a letná kuchyňa',meat:'Steak, divina a výdatné jedlá',cheese:'Syrová misa alebo sladký dezert',noFood:'Bez požiadavky na párovanie'};
 if(slug==='valka'){labels.simple='Jedno balenie vína';descriptions.simple='Jedno víno podľa vašich odpovedí';descriptions.target='Víno vybrané podľa vášho vkusu';}
 const scene=v=>({still:'white',bubbly:'sparkling',dry:'crisp','medium-dry':'fruity','medium-sweet':'sweet',mixed:'any',noFood:'any',orange:'white',any:'any'})[v]||v;
 function answerPhoto(step,value){
  if(step.key==='budget')return '';
  if(step.key==='year'){const years=step.options.filter(v=>v!=='any'&&v!=='mixed'),i=years.indexOf(value),src=i<0?'/assets/vino/choice-full.jpg':(i%2?'/assets/vino/year-cellar.jpg':'/assets/vino/year-harvest.jpg');return '<img src="'+esc(src)+'" alt="" loading="eager">';}
  const photo=window.COSMETICS_DEMOS.semanticPhotos[scene(value)]||'/assets/vino/choice-any.jpg';
  return '<img src="'+esc(photo)+'" alt="" loading="eager">';
 }
 function options(step){
  const real=step.options.filter(v=>v!=='any'&&v!=='mixed'),list=!catalogue.groupByForm&&real.length>3?real:step.options,remaining=list.slice(state.page*3),current=remaining.length>4?remaining.slice(0,3):remaining,next=remaining.length>4;
  const budget=step.key==='budget', textOnly=budget;
  const card=v=>{
   const photo=answerPhoto(step,v);
   const title=budget?v?'Do '+v+' '+(engine.matches({...state.answers,budget:''})[0]?.currency==='CZK'?'Kč':'€'):'Bez limitu':step.key==='year'&&v!=='any'?'Ročník '+v:labels[v];
   return '<button type="button" class="cx-quality-option cx-catalogue-option'+(textOnly?' is-text-answer':'')+'" data-choice="'+esc(v)+'">'+(photo?'<span class="cx-quality-photo is-scene">'+photo+'</span>':'')+'<span class="cx-quality-copy"><b>'+esc(title)+'</b><small>'+esc(budget?'Limit na celú odporúčanú zostavu':step.key==='year'?(v==='any'?'Ročník nechám na odporúčanie':'Konkrétny ročník vína'):descriptions[v])+'</small></span></button>';
  };
  return '<div class="cx-catalogue-options'+(budget?' cx-budget-options':'')+'">'+current.map(card).join('')+(next?'<button class="cx-quality-option cx-catalogue-option" type="button" data-page-next><span class="cx-quality-photo is-scene"><img src="/assets/vino/choice-any.jpg" alt=""></span><span class="cx-quality-copy"><b>Ďalšie možnosti</b><small>Z celej ponuky vinárstva</small></span></button>':'')+'</div>';
 }
 const resultGuide=()=>globalThis.CXWineResultGuide.create(catalogue,state.answers,engine);
 const product=(p,label='Odporúčam vám')=>{const g=resultGuide(),facts=g.facts(p),description=g.description(p);return '<article class="cx-quality-product is-primary" data-product-id="'+esc(p.id)+'"><div class="cx-quality-product-photo"><img src="'+esc(p.photo)+'" alt="'+esc(p.name)+'" loading="eager"></div><div class="cx-quality-product-copy"><small>'+esc(label)+'</small><h2>'+esc(p.name)+'</h2>'+(facts.length?'<div class="cx-quality-tags">'+facts.map(f=>'<span>'+esc(f)+'</span>').join('')+'</div>':'')+'<strong>'+esc(p.price)+'</strong><a href="'+esc(p.url)+'" target="_self">'+esc(g.t('Pozrieť produkt ↗','Zobrazit produkt ↗'))+'</a></div>'+(description?'<p class="cx-product-description">'+esc(description)+'</p>':'')+'</article>';};
 function nextRecommendations(selected){const g=resultGuide(),next=g.next(selected);return '<section class="cx-result-next"><h3>'+esc(g.t('Čo odporúčam ďalej','Co doporučuji dál'))+'</h3>'+next.map(item=>'<p>'+esc(item.note)+'</p>'+product(item.product,item.label)).join('')+'<p>'+esc(g.t('Chcete doladiť víno k jedlu alebo darčeku? Pokračujte v chate.','Chcete doladit víno k jídlu nebo dárku? Pokračujte v chatu.'))+'</p><button type="button" class="cx-quality-more" data-result-chat>'+esc(g.t('Spýtať sa poradcu','Zeptat se poradce'))+'</button></section>';}

 function settle(){const copies=[...panel.querySelectorAll('.cx-quality-copy')];copies.forEach(e=>e.style.minHeight='');const h=Math.max(0,...copies.map(e=>e.offsetHeight));copies.forEach(e=>e.style.minHeight=h+'px');}
 function render(){const steps=engine.steps(state.answers),step=steps[state.step];let heading,content;
 if(state.other){const other=catalogue.products.filter(p=>p.kind!=='Víno'&&p.available!==false);heading='Ďalšie produkty z ponuky';content=other.slice(0,state.limit).map(p=>product(p)).join('')+(other.length>state.limit?'<button class="cx-quality-more" data-next>Načítať ďalšie</button>':'');}
 else if(step){heading=({form:'Má byť víno tiché alebo perlivé?',year:'Máte obľúbený ročník?',color:'Aké víno máte najradšej?',style:'Akú sladkosť uprednostníte?',quantity:'Koľko vín hľadáte?',food:'K čomu bude víno?',budget:'Do akej sumy vyberáme?',character:'Aký charakter má víno mať?'})[step.key];content=options(step);if(state.step===0&&catalogue.products.some(p=>p.kind!=='Víno'&&p.available!==false))content+='<button type="button" class="cx-quality-more" data-other>Iné produkty z ponuky</button>';}
 else {
  const matches=engine.recommend(state.answers),count=({simple:1,target:1,basic:3,full:4})[state.answers.quantity]||1,selected=matches.slice(0,count),g=resultGuide();
  heading=matches.length?'Toto vám odporúčam':'Takúto kombináciu v ponuke nemáme';
  content=matches.length?selected.map(p=>product(p)).join(''):'<p>'+esc(g.t('Žiadne dostupné víno nespĺňa zvolenú farbu, sladkosť a rozpočet naraz. Upravte jednu odpoveď.','Žádné dostupné víno nesplňuje zvolenou barvu, sladkost a rozpočet současně. Upravte jednu odpověď.'))+'</p>';
  if(matches.length){
   content+='<div class="cx-quality-why"><b>'+esc(g.t('Prečo tento výber','Proč tento výběr'))+'</b><p>'+esc(g.why(selected[0]))+'</p></div>'+nextRecommendations(selected);
   const nextIds=new Set(g.next(selected).map(x=>x.product.id)),further=matches.slice(count).filter(p=>!nextIds.has(p.id));
   if(further.length){content+='<button type="button" class="cx-quality-more" data-more>'+esc(state.expanded?g.t('Skryť ďalšie','Skrýt další'):g.t('Ďalšie vhodné vína','Další vhodná vína')+' ('+further.length+')')+'</button>';if(state.expanded)content+=further.slice(0,state.limit).map(p=>product(p)).join('');if(state.expanded&&further.length>state.limit)content+='<button type="button" class="cx-quality-more" data-next>'+esc(g.t('Načítať ďalšie','Načíst další'))+'</button>';}
  }
  content+='<button type="button" class="cx-quality-more" data-restart>'+esc(g.t('Vybrať znova','Vybrat znovu'))+'</button>';
 }

 panel.innerHTML='<div class="cx-quality-progress"><button type="button" data-back '+(state.step===0&&!state.page&&!state.other?'disabled':'')+'>‹ Späť</button><div>'+steps.map((s,i)=>'<span class="'+(i<=state.step?'is-on':'')+'"></span>').join('')+'</div><b>'+(step&&!state.other?(state.step+1)+'. krok':'Výsledok')+'</b></div><div class="cx-quality-body '+(step&&!state.other?'is-question'+(step.key==='budget'?' is-budget':''):'')+'"><h2 tabindex="-1">'+esc(heading)+'</h2>'+content+'</div>';panel.querySelector('.cx-quality-body').scrollTop=0;requestAnimationFrame(settle);panel.querySelector('h2')?.focus({preventScroll:true});}
 function mode(){panel.hidden=false;widget.classList.add('cx-catalogue-active');nav.querySelectorAll('button').forEach(b=>{const active=b.dataset.mode==='advisor';b.setAttribute('aria-pressed',String(active));b.classList.toggle('is-active',active);});render();}
 function chat(){panel.hidden=true;widget.classList.remove('cx-catalogue-active');}
 function restart(){state.step=0;state.page=0;state.answers={};state.expanded=false;state.other=false;render();}
 document.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.mode==='chat'||b.dataset.open==='chat'||b.id==='cx-open'){chat();return;}if(b.dataset.open==='advisor'||b.id==='cx-teaser'||b.closest('.cx-teaser-open'))queueMicrotask(mode);if(b.dataset.mode==='advisor'){e.preventDefault();e.stopImmediatePropagation();mode();return;}if(b.id==='cx-reset'&&!panel.hidden){e.preventDefault();e.stopImmediatePropagation();restart();return;}if(!b.closest('.cx-quality-stage'))return;
 if(b.hasAttribute('data-result-chat')){nav.querySelector('[data-mode="chat"]')?.click();return;}if(b.hasAttribute('data-choice')){state.answers[engine.steps(state.answers)[state.step].key]=b.dataset.choice;state.step++;state.page=0;state.expanded=false;render();}if(b.hasAttribute('data-page-next')){state.page++;render();}if(b.hasAttribute('data-back')){if(state.other){state.other=false;render();return;}if(state.page){state.page--;render();return;}if(state.step){state.step--;engine.steps(state.answers).slice(state.step).forEach(s=>delete state.answers[s.key]);render();}}if(b.hasAttribute('data-restart'))restart();if(b.hasAttribute('data-other')){state.other=true;state.limit=24;render();}if(b.hasAttribute('data-more')){state.expanded=!state.expanded;render();}if(b.hasAttribute('data-next')){state.limit+=24;render();}},true);window.addEventListener('resize',()=>{if(!panel.hidden)requestAnimationFrame(settle);});
 // The landing CTA can open the legacy widget while this deferred module loads.
 // Adopt its current mode immediately and keep both controls in sync.
 const advisorTab=nav.querySelector('[data-mode="advisor"]');
 const follow=()=>{const on=advisorTab?.getAttribute('aria-pressed')==='true';if(on&&panel.hidden)mode();else if(!on&&!panel.hidden)chat();};
 new MutationObserver(follow).observe(nav,{attributes:true,subtree:true,attributeFilter:['aria-pressed','class']});follow();
})();
