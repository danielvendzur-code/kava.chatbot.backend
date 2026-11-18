/* Keep a question only when its answers lead to different final recommendations.
   Pure catalogue logic: no network, AI, storage or invented product properties. */
(function(scope){'use strict';
 function wrap(raw,{signature,unlimited='',rendererAddsUnlimited=true,skip=new Set(['product'])}={}){
  const cache=new Map(),value=o=>o&&typeof o==='object'?o.value:o;
  const key=a=>JSON.stringify(Object.keys(a).sort().map(k=>[k,a[k]]));
  const choices=s=>{let list=[...s.options];if(s.key==='budget'&&!list.some(o=>value(o)===unlimited))list.push(unlimited);const neutral=o=>s.key==='budget'?value(o)===unlimited:['any','mixed'].includes(value(o));list.sort((a,b)=>(neutral(a)?-1:0)-(neutral(b)?-1:0));return list;};
  const next=a=>raw.steps(a).find(s=>a[s.key]===undefined);
  function outcomes(a,depth=0){const k=key(a);if(cache.has(k))return cache.get(k);if(depth>16)throw Error('Question graph is cyclic');const s=next(a);let out;
   if(!s)out=[signature(raw.recommend(a),a)];
   else if(skip.has(s.key))out=outcomes({...a,[s.key]:value(choices(s)[0])},depth+1);
   else out=[...new Set(choices(s).flatMap(o=>outcomes({...a,[s.key]:value(o)},depth+1)))].sort();
   cache.set(k,out);return out;
  }
  function resolve(answers={}){let working={},steps=[];
   for(let i=0;i<20;i++){const s=next(working);if(!s)return {working,steps,done:true};const list=choices(s);if(!list.length)throw Error('Empty question');
    if(skip.has(s.key)){working[s.key]=value(list[0]);continue;}
    const seen=new Set(),options=[];
    for(const o of list){const v=value(o),r=raw.recommend({...working,[s.key]:v});const sig=s.key==='budget'?signature(r,{...working,[s.key]:v}):outcomes({...working,[s.key]:v}).join('\n');if(!sig||seen.has(sig))continue;seen.add(sig);options.push(o);}
    if(options.length<2){working[s.key]=s.key==='budget'?unlimited:s.key==='color'?'mixed':list.some(o=>value(o)==='any')?'any':s.key==='category'||s.key==='kind'?value(list[0]):'any';continue;}
    // Renderers add unlimited themselves. Keep one consistent value in the engine.
    const published=s.key==='budget'&&rendererAddsUnlimited?options.filter(o=>value(o)!==unlimited):options;
    steps.push({...s,options:published});const answer=answers[s.key];
    if(answer===undefined||!options.some(o=>String(value(o))===String(answer)))return {working,steps,done:false};
    working[s.key]=answer;
   }throw Error('Too many questions');
  }
  return {...raw,steps:a=>resolve(a).steps,recommend:a=>{const r=resolve(a);return raw.recommend({...a,...r.working});},resolve};
 }
 scope.CXMeaningfulQuestions={wrap};
})(globalThis);

(function(scope){
 'use strict';
 const norm=v=>String(v||'').normalize('NFD').replace(/\p{Diacritic}/gu,'').toLowerCase();
 const labels={white:'Biele',red:'Červené',rose:'Ružové',orange:'Oranžové',sparkling:'Šumivé',mixed:'Nechám si poradiť',dry:'Suché','medium-dry':'Polosuché','medium-sweet':'Polosladké',sweet:'Sladké',crisp:'Svieže a ľahké',fruity:'Ovocné',bold:'Plné a výrazné',any:'Nechám si poradiť',simple:'Jednu fľašu',basic:'Trio na ochutnanie',full:'Štyri rôzne vína',target:'Na darček',fish:'Ryba, hydina a šaláty',meat:'Mäso a gril',cheese:'Syry a dezerty',noFood:'Len tak, na posedenie'};
 const GRAPES=[["cabernetFranc","cabernet franc","Cabernet Franc"],["cabernetSauvignon","cabernet sauvignon","Cabernet Sauvignon"],["vlassky","(?:rizling|ryzlink) vlassky","Rizling vlašský"],["rynsky","(?:rizling|ryzlink) rynsky","Rizling rýnsky"],["veltlin","veltlinske|veltlinske|veltlín|gruner veltliner","Veltlínske zelené"],["chardonnay","chardonnay","Chardonnay"],["sauvignon","sauvignon(?!.*cabernet)","Sauvignon"],["pinotBlanc","pinot blanc|rulandske bile|rulandske biele","Rulandské biele / Pinot blanc"],["pinotGris","pinot gris|rulandske sede|rulandske sive","Rulandské sivé / Pinot gris"],["pinotNoir","pinot noir|rulandske modre","Rulandské modré / Pinot noir"],["merlot","merlot","Merlot"],["frankovka","frankovka|blaufrankisch","Frankovka modrá"],["svatovavrinecke","svatovavrinecke","Svätovavrinecké"],["zweigelt","zweigelt","Zweigeltrebe"],["tramin","tramin|gewurztraminer","Tramín"],["muller","muller.?thurgau","Müller Thurgau"],["muskat","muskat|muscat|moscato","Muškát"],["palava","palava","Pálava"],["devin","devin","Devín"],["hibernal","hibernal","Hibernal"],["aurelius","aurelius","Aurelius"],["alibernet","alibernet","Alibernet"],["dornfelder","dornfelder","Dornfelder"],["andrea","\\bandre\\b","André"],["dunaj","dunaj","Dunaj"],["sylvan","sylvan|silvan","Silvánske zelené"],["viognier","viognier","Viognier"],["sevar","sevar","Sevar"],["turan","turan","Turán"],["cuvee","cuvee|cuve[eé]","Cuvée"]];
 for(const [key,,label]of GRAPES)labels[key]=label;
 function create(products){
  const wines=products.filter(p=>p.kind==='Víno').map(p=>({...p,wineGrape:GRAPES.find(([,rx])=>new RegExp(rx).test(norm(p.name)))?.[0]||null})),live=p=>p.available!==false;
  function matches(a={}){return wines.filter(live).filter(p=>(!a.grape||a.grape==='any'||p.wineGrape===a.grape)&&(!a.year||a.year==='any'||p.wineFacts.year===a.year)&&(!a.color||a.color==='mixed'||p.tags.includes(a.color))&&(!a.style||a.style==='any'||p.wineFacts.style===a.style)&&(!a.character||a.character==='any'||p.tags.includes(a.character))&&(!a.budget||Number.isFinite(p.priceAmount)&&p.priceAmount<=Number(a.budget)));}
  function score(p,a){const tags=p.tags||[];if(a.food==='noFood'||!a.food)return 0;if(tags.includes(a.food))return 3;
   // General pairing suggestions; never presented as winery-published facts.
   if(a.food==='meat'&&tags.includes('red'))return 1;if(a.food==='fish'&&(tags.includes('white')||tags.includes('rose')))return 1;if(a.food==='cheese'&&(tags.includes('sweet')||tags.includes('bold')))return 1;return 0;
  }
  function recommend(a={}){
   const sorted=matches({...a,budget:''}).sort((x,y)=>score(y,a)-score(x,a)||(x.priceAmount??Infinity)-(y.priceAmount??Infinity)||x.name.localeCompare(y.name,'sk'));
   if(!Number(a.budget))return sorted;const count=({basic:3,full:4})[a.quantity]||1,selected=[];let total=0;
   for(const p of sorted){if(selected.length===count)break;if(Number.isFinite(p.priceAmount)&&total+p.priceAmount<=Number(a.budget)){selected.push(p);total+=p.priceAmount;}}
   return selected;
  }
  function steps(a={}){
   const liveWines=wines.filter(live),colors=['white','red','rose','orange','sparkling'].filter(v=>liveWines.some(p=>p.tags.includes(v)));
   const result=[{key:'color',options:[...colors,'mixed']}];
   const pool=matches({...a,style:'',character:'',budget:''}),styles=['dry','medium-dry','medium-sweet','sweet'].filter(v=>pool.some(p=>p.wineFacts.style===v));
   /* A question needs at least two real answers. */if(styles.length>1)result.push({key:'style',options:[...styles,'any']});
   const quantities=wines.length&&wines.every(p=>Number(p.recommendedOrderQuantity)>1)?['simple']:['simple','basic','full','target'];
   result.push({key:'quantity',options:quantities},{key:'food',options:['fish','meat','cheese','noFood']});
   const properties=matches({...a,budget:''});
   if(properties.length>1&&properties.every(p=>p.wineGrape)&&new Set(properties.map(p=>p.wineGrape)).size>1)result.push({key:'grape',options:[...new Set(properties.map(p=>p.wineGrape)),'any']});
   if(result.every(q=>a[q.key]!==undefined)){const sameVariety=matches({...a,budget:''});if(sameVariety.length>1&&sameVariety.every(p=>p.wineFacts.year)&&new Set(sameVariety.map(p=>p.wineFacts.year)).size>1)result.push({key:'year',options:[...new Set(sameVariety.map(p=>p.wineFacts.year))].sort().concat('any')});}
   const selected=matches({...a,budget:''}),currency=selected[0]?.currency,count=({basic:3,full:4})[a.quantity]||1,thresholds=(currency==='CZK'?[250,400,700,1000,1500,2500]:[10,20,35,50,80,120]).filter(v=>recommend({...a,budget:v}).length===Math.min(count,selected.length));
   const facetPool=matches({...a,character:'',budget:''}),characters=['crisp','fruity','bold'].filter(v=>facetPool.some(p=>p.tags.includes(v))&&facetPool.some(p=>!p.tags.includes(v)));
   if(facetPool.length>1&&characters.length>1&&result.length<5)result.push({key:'character',options:[...characters,'any']});
   if(selected.length>1&&thresholds.length)result.push({key:'budget',options:[...thresholds.map(String),'']});return result;
  }
  return CXMeaningfulQuestions.wrap({wines,matches,recommend,steps},{signature:(r,a)=>JSON.stringify(r.slice(0,({basic:3,full:4})[a.quantity]||1).map(p=>[p.id,p.priceAmount]).sort((a,b)=>String(a[0]).localeCompare(String(b[0]))))});
 }
 scope.CXWineAdvisorCore={create,norm,labels};if(typeof module!=='undefined')module.exports=scope.CXWineAdvisorCore;
})(globalThis);
