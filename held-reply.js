/* Factual fallback for the eight newly finished demos only. No network or model calls. */
(function(scope){'use strict';
const norm=s=>String(s||'').normalize('NFD').replace(/\p{Diacritic}/gu,'').toLowerCase(),living=new Set(['plants','rareplants','cacti','succulents','airplants']);
function reply(catalogue,text,history=[]){
 const all=(catalogue.products||[]).filter(p=>p.available!==false),q=norm(text),cz=/\.cz(?:\/|$)/.test(catalogue.website||catalogue.source||''),t=(sk,cs)=>cz?cs:sk,amount=p=>p.priceAmount??p.priceValue,features=p=>p.source?.selectionTraits||{},role=p=>/sampon|shampoo/.test(norm(p.name))?'shampoo':/kondicion|leave.in/.test(norm(p.name))?'conditioner':/cistenie|cleanser|odlic|cistici|umyvaci/.test(norm(p.name+' '+p.kind))?'cleanser':/krem|cream/.test(norm(p.name))?'cream':p.kind==='Séra'?'serum':p.kind==='Toniká a vody'?'toner':'other';
 const budgetMatch=q.match(/(?:\bdo|\bpod|\bmax(?:imalne)?|limit|rozpocet)\s*(\d[\d\s]*(?:[.,]\d+)?)/),budget=budgetMatch?Number(budgetMatch[1].replace(/\s/g,'').replace(',','.')):Infinity;
 const unique=list=>list.filter((p,i)=>list.findIndex(x=>x.name===p.name)===i),sorted=list=>unique(list).filter(p=>Number.isFinite(amount(p))&&amount(p)<=budget).sort((a,b)=>amount(a)-amount(b));
 const line=p=>p.name+(p.volume?' · '+p.volume:'')+' — '+p.price+'. '+(p.reason||p.facts?.slice(0,2).join(' ')||'')+' '+p.url;
 let list=all,filtered=false,intro='',question='';const setFilter=fn=>{list=list.filter(fn);filtered=true;};
 if(all.some(p=>living.has(p.kind))){
  if(/(?:jak|aka|ake|jaka).*(?:velk|rozmer)|velikost|dodavan/.test(q)){const chosen=sorted(all).slice(0,3);return {text:t('Dodávané veľkosti pri konkrétnych rastlinách:\n\n','Dodávané velikosti u konkrétních rostlin:\n\n')+chosen.map(line).join('\n\n'),products:chosen};}
  if(/kaktus/.test(q))setFilter(p=>p.kind==='cacti');else if(/sukulent/.test(q))setFilter(p=>p.kind==='succulents');
  if(/vzdusn|tillands|tilands/.test(q))setFilter(p=>p.kind==='airplants');
  if(/polick|previs|visic/.test(q))setFilter(p=>p.tags.some(t=>['trailing','habit:trailing','habit:climbing','shape:beads'].includes(t)));
  if(/nenaroc|zacatec|zaciatoc/.test(q))setFilter(p=>p.tags.includes('easy'));
  if(/kulat|okruhl/.test(q))setFilter(p=>p.tags.some(t=>['leaf:round','leaf:tiny-round'].includes(t)));
  if(/mato|matov|mint/.test(q))setFilter(p=>p.tags.includes('leaf:mint'));
  if(/bile|biel/.test(q))setFilter(p=>p.tags.includes('leaf:white'));
  if(/panas|varieg/.test(q))setFilter(p=>p.tags.some(t=>/^leaf:(?:white|cream|mint|splash|gold-heart|warm)$/.test(t)));
  if(/mensi|malej|maly|drobn/.test(q))setFilter(p=>p.tags.includes('span:small')||p.tags.includes('leaf:tiny-round'));
  if(/svetl|slunc|slnk|polostin|polotien/.test(q)){const wanted=/polostin|polotien/.test(q)?'low':/prime slunce|priame slnko/.test(q)?'sun':'bright';setFilter(p=>p.tags.includes(wanted));}
  if(/porovnaj|porovnej|lisi|rozdiel/.test(q))intro=t('Porovnanie podľa uvedených vlastností:\n\n','Porovnání podle uvedených vlastností:\n\n');
 }else if(all.some(p=>p.kind==='Víno')){
  if(/biel|bile/.test(q))setFilter(p=>p.tags.includes('white'));if(/ruzov|rose/.test(q))setFilter(p=>p.tags.includes('rose'));if(/cerven/.test(q))setFilter(p=>p.tags.includes('red'));if(/slads|sladsi|sladke/.test(q))setFilter(p=>['medium-dry','medium-sweet','sweet'].includes(p.wineFacts?.style));else if(/suche/.test(q))setFilter(p=>p.wineFacts?.style==='dry');
 }else{
  if(/rutinu|rutina|zostav|sestav/.test(q)){
   if(all.some(p=>p.category==='hair'))return {text:t('Vlasovú rutinu postavíme na šampóne a kondicionéri. Čo potrebujete riešiť prednostne: objem, suché dĺžky, poškodenie alebo pokožku hlavy? Podľa odpovede vyberiem vhodnú dvojicu a spočítam jej celú cenu.','Vlasovou rutinu postavíme na šamponu a kondicionéru. Co potřebujete řešit přednostně: objem, suché délky, poškození nebo pokožku hlavy? Podle odpovědi vyberu vhodnou dvojici a spočítám její celou cenu.'),products:[]};
   const face=all.filter(p=>p.category==='face'),cleanser=sorted(face.filter(p=>role(p)==='cleanser'))[0],cream=sorted(face.filter(p=>role(p)==='cream'))[0],chosen=[cleanser,cream].filter(Boolean);if(chosen.length===2&&chosen.reduce((n,p)=>n+amount(p),0)<=budget){const sum=chosen.reduce((n,p)=>n+amount(p),0);return{text:t('Jednoduchý základ: čistenie a krémová starostlivosť.\n\n','Jednoduchý základ: čištění a krémová péče.\n\n')+chosen.map(line).join('\n\n')+'\n\n'+t('Spolu za celú zostavu: ','Celkem za celou sestavu: ')+new Intl.NumberFormat(cz?'cs-CZ':'sk-SK',{maximumFractionDigits:2}).format(sum)+(chosen[0].currency==='CZK'?' Kč':' €')+'.',products:chosen};}
  }
  if(/ocn|okol.*oci/.test(q))setFilter(p=>p.category==='eyes');else if(/vlas/.test(q))setFilter(p=>p.category==='hair');else if(/plet/.test(q))setFilter(p=>p.category==='face');
  if(/odlic/.test(q))setFilter(p=>features(p).purpose==='makeupRemoval');else if(/cistic|cistiac|umyv/.test(q))setFilter(p=>role(p)==='cleanser');
  if(/hydr/.test(q))setFilter(p=>features(p).purpose==='hydrationCare');
  if(/problemat|akne|nedokonal/.test(q))setFilter(p=>features(p).purpose==='blemishCare');
  if(/objem/.test(q))setFilter(p=>features(p).hairNeed==='volumeCare');
  if(/sampon|shampoo/.test(q))setFilter(p=>role(p)==='shampoo');if(/kondicion/.test(q))setFilter(p=>role(p)==='conditioner');if(/serum|sera/.test(q))setFilter(p=>p.kind==='Séra');
  if(/suche vlas|suchych vlas/.test(q))setFilter(p=>p.tags.includes('dry')||['dryHair','hydratingLengths','nourishingLengths'].includes(features(p).hairNeed));
 }
 if(all.some(p=>p.kind==='Víno')&&/ochutnav|sestav.*vin/.test(q)){let chosen=[],sum=0;for(const p of sorted(list)){if(chosen.length===3)break;if(sum+amount(p)<=budget){chosen.push(p);sum+=amount(p);}}return {text:chosen.length?t('Ochutnávka z vybraných vín:\n\n','Ochutnávka z vybraných vín:\n\n')+chosen.map(line).join('\n\n')+'\n\n'+t('Spolu za všetky odporúčané fľaše: ','Celkem za všechny doporučené lahve: ')+sum+' Kč.':t('Do tohto rozpočtu sa vybrané vína nezmestia. Upravíme sumu alebo typ vína?','Do tohoto rozpočtu se vybraná vína nevejdou. Upravíme částku nebo typ vína?'),products:chosen};}
 const chosen=sorted(list).slice(0,3);
 if(!chosen.length)return {text:t('V tejto ponuke neviem vybrať produkt spĺňajúci všetky podmienky. Upresníte prosím, ktorá vlastnosť je pre vás najdôležitejšia?','V této nabídce nemohu vybrat produkt splňující všechny podmínky. Upřesníte prosím, která vlastnost je pro vás nejdůležitější?'),products:[]};
 if(!intro)intro=filtered?t('Podľa uvedených vlastností vyberám:\n\n','Podle uvedených vlastností vybírám:\n\n'):t('Z ponuky:\n\n','Z nabídky:\n\n');
 return {text:intro+chosen.map(line).join('\n\n')+(chosen.length>1?'\n\n'+t('Čo z uvedených rozdielov je pre vás najdôležitejšie?','Který z uvedených rozdílů je pro vás nejdůležitější?'):''),products:chosen};
}
scope.CXHeldReply=reply;if(typeof module!=='undefined'&&module.exports)module.exports=reply;
})(globalThis);
