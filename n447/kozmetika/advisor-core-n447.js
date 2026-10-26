/* n447 – kópia schváleného advisor-core.js pre novú dávku; jediná zmena: rozpočtová hranica sa ponúkne iba ak mení výber produktov. */
/* Shared recommendation rules. Uses the complete supplied catalogue, never a top-N subset. */
(function (scope) {
  'use strict';
  const norm = v => String(v || '').normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
  const kinds = [['mask', 'Masky'], ['serum', 'Séra'], ['oil', 'Oleje'], ['gel', 'Gély'], ['cream', 'Krémy']];
  const profiles = ['dry', 'oily', 'sensitive', 'balanced'];
  const goals = ['hydrate', 'calm', 'balance', 'mature', 'clean', 'daily'];
  const detailLabels={
    day:['Na deň','Denná starostlivosť podľa označenia produktu.'],night:['Na večer','Produkt označený na nočnú starostlivosť.'],spf:['S ochranným faktorom SPF','Uprednostním produkt s uvedeným SPF.'],
    hyaluron:['S kyselinou hyalurónovou','Vyberiem hyalurónový produkt z tejto ponuky.'],vitaminC:['S vitamínom C','Uprednostním produkt s vitamínom C.'],bakuchiol:['S bakuchiolom','Vyberiem produkt označený s bakuchiolom.'],retinol:['S retinolom','Uprednostním produkt s uvedeným retinolom.'],ceramides:['S ceramidmi','Vyberiem ceramidovú starostlivosť.'],rose:['S ružovým základom','Vyberiem produkt označený s ružou.'],almond:['S mandľovým olejom','Uprednostním mandľový olej.'],argan:['S arganovým olejom','Uprednostním arganový olej.'],shea:['S bambuckým maslom','Vyberiem produkt s bambuckým maslom.'],
    hands:['Na ruky','Cielená starostlivosť o ruky.'],feet:['Na nohy','Starostlivosť o chodidlá a nohy.'],shower:['Na umývanie','Sprcha alebo umývanie pokožky.'],deodorant:['Proti telesnému pachu','Dezodorant z ponuky značky.'],bath:['Do kúpeľa','Produkt určený do kúpeľa.']
  };
  function features(p){
    const text=norm(p.name),f={};
    if(/\bspf\s*\d/.test(text))f.time='spf';else if(/\bnocn|night/.test(text))f.time='night';else if(/\bdenn|day cream/.test(text))f.time='day';
    for(const [key,rx]of [['hyaluron',/hyaluron/],['vitaminC',/vitamin\s*c\b|vitaminu\s*c\b/],['bakuchiol',/bakuchiol/],['retinol',/retin[oa]l/],['ceramides',/ceramid/],['rose',/ruzov|ruze|rose oil/],['almond',/mandl|almond/],['argan',/argan/],['shea',/bambuc|shea/]])if(rx.test(text)){f.ingredient=key;break;}
    if(p.category==='body'){for(const [key,rx]of [['hands',/\bru(?:ce|ky|k)\b|\bhand\b/],['feet',/chodidl|\bnohy\b|\bfoot\b|\bfeet\b/],['deodorant',/de[sz]odor/],['bath',/kupel|koupel|bath salt/],['shower',/sprch|\bmydl|\bsoap\b|shower/]])if(rx.test(text)){f.area=key;break;}}
    // These differences come from product names and supplied product descriptions.
    const description=norm(p.description||'');
    if(p.category==='face'&&/krem|cream/.test(text)){
      if(/akne|acne|problematick/.test(text))f.skinFocus='blemishCare';
      else if(/hydrat/.test(description))f.skinFocus='hydrationCare';
    }
    if(p.category==='hair'&&/sampon|sampuk|shampoo/.test(text)){
      if(/mastici|mastiace|mastne vlasy/.test(text))f.hairFocus='oilControl';
      else if(/jemne myti|jemne umyvanie/.test(text))f.hairFocus='gentleWash';
      f.packType=/(?:balzam|kondicion|conditioner)/.test(text)&&/(?:\s+a\s+|\+|sada|\bset\b|duo)/.test(text)?'shampooDuo':'shampooOnly';
    }
    if(p.category==='body'&&/balzam/.test(text)&&/\bru(?:ce|ky|k)\b|\bhand\b/.test(text)){
      if(/bez vun|bez von|without fragrance|unscented/.test(description))f.careVariant='withoutFragrance';
      else if(/levandul|lavender/.test(text))f.careVariant='lavenderVersion';
      else if(/grapefruit/.test(text))f.careVariant='grapefruitVersion';
    }
    if(!f.ingredient&&/olej|oil/.test(text)){
      if(/merunk|marhul|apricot/.test(text))f.ingredient='apricot';
      else if(/hroznov|grape.?seed/.test(text))f.ingredient='grapeseed';
    }
    const size=!p.source?.priceFrom&&String(p.volume||p.variantLabel||p.name).match(/\b(\d+(?:[.,]\d+)?)\s*(ml|g|kg|l)\b/i);if(size)f.size=size[1].replace(',','.')+' '+size[2].toLowerCase();
    return f;
  }
  function prepare(source) {
    source=source.flatMap(p=>{
      if(!p.variants?.length)return [p];
      const sizes=p.variants.map(v=>Number(String(v.volume).match(/\d+(?:[.,]\d+)?/)?.[0])).filter(Number.isFinite);
      return p.variants.map(v=>{
        const isSample=/\bml\b/i.test(v.volume)&&Number(String(v.volume).match(/\d+(?:[.,]\d+)?/)?.[0])<=5&&Math.max(...sizes)>5;
        return {...p,...v,id:p.id+'-variant-'+v.id,productUrl:p.url,variants:undefined,isSample,
          kind:isSample?'Vzorky — '+p.kind:p.kind,source:{...p.source,priceFrom:false,variantId:v.id}};
      });
    });
    return source.map((p, index) => {
      const tags = [...(p.tags || [])];
      const text = norm([p.name, p.kind, p.reason].join(' '));
      const category = p.category || 'face';
      const kind = p.kind || kinds.find(([tag]) => tags.includes(tag))?.[1] || 'Starostlivosť';
      const signals = new Set(tags.filter(t => profiles.includes(t) || goals.includes(t)));
      if (!p.source?.suitabilityEvidence) {
      if (/hydrat|hyaluron|such[aeuoy]|vyziv|zvlacn/.test(text)) signals.add('hydrate');
      if (/citliv|upokoj|zklid|jemne myti/.test(text)) signals.add('calm');
      if (/mastn|mastici|sebum|nedokonal|akne/.test(text)) signals.add('balance');
      if (/vrask|aging|lifting|zrel|spevn/.test(text)) signals.add('mature');
      }
      if (['face','body','hair'].includes(category) && kind!=='Doplnky' && /cist|odlic|mydl|myci|umyv|sprch|sampon|sampuk|cleanser|cleansing|shampoo|soap|wash/.test(text)) signals.add('clean');
      /* Anti-wrinkle care is a face matter; a shower cream is not "for mature skin". */
      if (!['face', 'eyes'].includes(category)) signals.delete('mature');
      if (!signals.has('mature') && !signals.has('clean')) signals.add('daily');
      // A dry shampoo absorbs oil; its form is not evidence of dry-hair care.
      const dryShampoo=category==='hair'&&/(?:such[yae]\s+samp|dry\s+(?:shampoo|powder))/.test(norm(p.name));
      if(dryShampoo){for(const signal of ['dry','hydrate','mature','clean','daily'])signals.delete(signal);signals.add('oily');signals.add('balance');}
      const amount = Number.isFinite(p.priceAmount) ? p.priceAmount : Number(String(p.price || '').replace(/\s/g, '').replace(',', '.').match(/\d+(?:\.\d+)?/)?.[0]);
      return {...p, id:String(p.id ?? index), category, kind:dryShampoo?'Suché šampóny':kind, tags:dryShampoo?tags.filter(t=>!['dry','hydrate','mature','clean','daily'].includes(t)):tags, features:features({...p,category}),signals:[...signals], priceAmount:Number.isFinite(amount)?amount:null, currency:p.currency || (/Kč|CZK/.test(p.price || '') ? 'CZK' : 'EUR'), photo:p.photo || p.image};
    });
  }
  function create(source) {
    const products = prepare(source);
    const routineRole=p=>{if(p.features?.packType==='shampooDuo')return 'set';const s=norm(p.kind+' '+p.name);if(/suchy sampon|dry shampoo/.test(s))return 'dryShampoo';if(/sampon|sampuk|shampoo/.test(s))return 'shampoo';if(/kondicion|conditioner|vlasov.*balzam/.test(s))return 'conditioner';if(/cisten|odlic|mydl|myci|umyv|cleanser|cleansing|soap/.test(s))return 'cleanser';if(/ser[au]|serum/.test(s))return 'serum';if(/krem|cream/.test(s))return 'cream';if(/olej|oil/.test(s))return 'oil';return 'other';};
    const routineCost=p=>p.source?.priceFrom?(Number.isFinite(p.source.priceMax)?p.source.priceMax:Infinity):(Number.isFinite(p.priceAmount)?p.priceAmount:Infinity);
    const complementary={cleanser:['cream'],cream:['cleanser'],serum:['cream'],shampoo:['conditioner'],conditioner:['shampoo']};
    const withinBudget=(p,n)=>Number.isFinite(p.priceAmount)&&p.priceAmount<=Number(n)&&(!p.source?.priceFrom||(Number.isFinite(p.source.priceMax)&&p.source.priceMax<=Number(n)));
    function categoryPool(answers = {}) {
      return products.filter(p => (!answers.category || p.category === answers.category) && (!answers.kind || answers.kind === 'any' || p.kind === answers.kind));
    }
    function recommend(answers = {}) {
      let list = categoryPool(answers).filter(p => p.available !== false);
      // Samples belong to their explicit form; never silently replace the normal product.
      if (!/vzork|sample/i.test(answers.kind || '') && !answers.size && list.some(p => !p.isSample)) list = list.filter(p => !p.isSample);
      if (answers.budget) list = list.filter(p => withinBudget(p,answers.budget));
      if (answers.profile === 'sensitive') list = list.filter(p => p.signals.includes('sensitive') || p.signals.includes('calm') || !/retinol|retinal|aha|bha|peeling|kyselin/.test(norm(p.name + ' ' + p.kind)));
      if (answers.goal && answers.goal !== 'any') list = list.filter(p => p.signals.includes(answers.goal));
      if (answers.profile && answers.profile !== 'any') list = list.filter(p => p.signals.includes(answers.profile)||p.source?.allSkinTypes===true);
      for(const key of ['hairNeed','hairUse','area','hairFocus','packType','careVariant','skinFocus','time','ingredient','size'])if(answers[key]&&answers[key]!=='any')list=list.filter(p=>p.features[key]===answers[key]);
      const rank = p => (p.signals.includes(answers.profile) ? 8 : 0) + (p.signals.includes(answers.goal) ? 12 : 0);
      const cost=p=>Number.isFinite(p.priceAmount)?p.priceAmount:Infinity;
      list.sort((a, b) => rank(b) - rank(a) || (cost(a)-cost(b)) || a.name.localeCompare(b.name, 'sk') || a.id.localeCompare(b.id));
      const winner = list[0] || null;
      // An alternative must be a different real product, not a size variant of the winner.
      const alternative = winner ? list.find(p => p.url !== winner.url && norm(p.name) !== norm(winner.name)) || null : null;
      return {winner, alternative, matches:list, profileVerified:!!winner && (answers.profile === 'any' || !answers.profile || winner.signals.includes(answers.profile)), goalVerified:!!winner && (answers.goal === 'any' || !answers.goal || winner.signals.includes(answers.goal))};
    }
    function steps(answers = {}) {
      const categories = [...new Set(products.map(p => p.category))];
      const result = [{key:'category', options:categories}];
      const category = answers.category || categories[0];
      const pool = products.filter(p => p.category === category && p.available !== false);
      const supportedProfiles = profiles.filter(v => pool.some(p => p.signals.includes(v)) && pool.some(p => !p.signals.includes(v)));
      /* A question needs at least two real answers; one answer plus "nechám si poradiť" asks nothing. */
      if (['face', 'hair', 'body'].includes(category) && supportedProfiles.length > 1) result.push({key:'profile', options:[...supportedProfiles, 'any']});
      const profilePool = pool.filter(p => !answers.profile || answers.profile === 'any' || p.signals.includes(answers.profile)||p.source?.allSkinTypes===true);
      const relevant = goals.filter(v => profilePool.some(p => p.signals.includes(v)) && profilePool.some(p => !p.signals.includes(v)));
      if (relevant.length > 1) result.push({key:'goal', options:[...relevant, 'any']});
      const formPool = pool.filter(p => (!answers.goal || answers.goal === 'any' || p.signals.includes(answers.goal)) && (!answers.profile || answers.profile === 'any' || p.signals.includes(answers.profile)||p.source?.allSkinTypes===true));
      const forms = [...new Set(formPool.map(p => p.kind))];
      if (forms.length > 1) result.push({key:'kind', options:[...forms, 'any']});
      const facetKeys=['hairNeed','hairUse','area','hairFocus','packType','careVariant','skinFocus','time','ingredient','size'];
      const baseAnswers={...answers,category,budget:''};for(const key of facetKeys)delete baseAnswers[key];
      const priced=recommend(baseAnswers).matches;
      const buckets=new Map(),photoKey=p=>String(p.photo).split('?')[0],eligibleComplements=[],seenIds=new Set(),repeatedIds=new Set();
      for(const p of products){if(seenIds.has(p.id))repeatedIds.add(p.id);seenIds.add(p.id);}
      for(const x of products){
        if(x.available===false||x.isSample||!x.photo||!Number.isFinite(routineCost(x))||/(?:retin[oa]l|\baha\b|\bbha\b|peeling|kyselin|esencial|eterick)/.test(norm(x.name+' '+x.kind))||answers.profile&&answers.profile!=='any'&&!x.signals.includes(answers.profile)&&x.source?.allSkinTypes!==true)continue;
        eligibleComplements.push(x);
        const key=JSON.stringify([x.category,x.currency,routineRole(x)]),photos=buckets.get(key)||new Map(),photo=photoKey(x),cost=routineCost(x);
        if(!photos.has(photo)||photos.get(photo)<cost)photos.set(photo,cost);buckets.set(key,photos);
      }
      const tops=new Map([...buckets].map(([key,photos])=>[key,[...photos].sort((a,b)=>b[1]-a[1]).slice(0,2)]));
      let maximumBundlePrice=-Infinity;
      for(const p of priced){
        if(!Number.isFinite(routineCost(p)))continue;
        if(repeatedIds.has(p.id)){for(const x of eligibleComplements){if(x.id===p.id||x.category!==p.category||x.currency!==p.currency||photoKey(x)===photoKey(p)||!(complementary[routineRole(p)]||[]).includes(routineRole(x)))continue;const total=routineCost(p)+routineCost(x);if(Number.isFinite(total))maximumBundlePrice=Math.max(maximumBundlePrice,total);}continue;}
        for(const role of complementary[routineRole(p)]||[]){const candidates=tops.get(JSON.stringify([p.category,p.currency,role]))||[];const extra=candidates.find(([photo])=>photo!==photoKey(p));if(extra){const total=routineCost(p)+extra[1];if(Number.isFinite(total))maximumBundlePrice=Math.max(maximumBundlePrice,total);}}
      }
      const limits=(priced[0]?.currency==='CZK'?[300,600,1000]:[10,25,50]).filter(n=>{const count=priced.filter(p=>withinBudget(p,n)).length;if(!count||count>=priced.length)return false;const free=recommend({...answers,category,budget:''}).winner,capped=recommend({...answers,category,budget:n}).winner;return !!capped&&capped.id!==free?.id;});/* n447: hranica iba keď naozaj vyradí produkt – inak by každá odpoveď viedla k tomu istému výsledku */
      const baseAnswered=result.every(step=>answers[step.key]!==undefined);
      if(limits.length)result.push({key:'budget',options:limits});
      if(!baseAnswered||(limits.length&&answers.budget===undefined))return result;
      // Ask about actual remaining differences, one decision at a time. No neutral body area.
      const comparison={...answers,category};for(const key of facetKeys)delete comparison[key];
      let remaining=recommend(comparison).matches;
      for(const key of facetKeys){
        if(remaining.length<2||result.length>=8)break;
        if(remaining.some(p=>!p.features[key]))continue;
        const values=[...new Set(remaining.map(p=>p.features[key]))];
        if(values.length<2||values.length>4)continue;
        if(key==='size'){
          if(new Set(values.map(v=>v.split(' ')[1])).size>1)continue;
          const canonical=p=>norm(p.name).replace(/\s*[–-]?\s*\d+(?:[.,]\d+)?\s*(ml|g|kg|l)\b.*$/,'');
          if(new Set(remaining.map(canonical)).size>1)continue;
          values.sort((a,b)=>parseFloat(a)-parseFloat(b));
        }
        result.push({key,options:values});
        if(answers[key]===undefined)break;
        comparison[key]=answers[key];remaining=recommend(comparison).matches;
      }

      return result;
    }
    return {products, categoryPool, recommend, steps};
  }
  scope.CXAdvisorCore = {create, prepare, norm, detailLabels};
  if (typeof module !== 'undefined' && module.exports) module.exports = scope.CXAdvisorCore;
})(typeof globalThis !== 'undefined' ? globalThis : window);
