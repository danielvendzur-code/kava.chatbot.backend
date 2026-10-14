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
      const amount = Number.isFinite(p.priceAmount) ? p.priceAmount : Number(String(p.price || '').replace(/\s/g, '').replace(',', '.').match(/\d+(?:\.\d+)?/)?.[0]);
      return {...p, id:String(p.id ?? index), category, kind, tags, features:features({...p,category}),signals:[...signals], priceAmount:Number.isFinite(amount)?amount:null, currency:p.currency || (/Kč|CZK/.test(p.price || '') ? 'CZK' : 'EUR'), photo:p.photo || p.image};
    });
  }
  function create(source) {
    const products = prepare(source);
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
      for(const key of ['area','time','ingredient','size'])if(answers[key]&&answers[key]!=='any')list=list.filter(p=>p.features[key]===answers[key]);
      const rank = p => (p.signals.includes(answers.profile) ? 8 : 0) + (p.signals.includes(answers.goal) ? 12 : 0);
      const cost=p=>Number.isFinite(p.priceAmount)?p.priceAmount:Infinity;
      list.sort((a, b) => rank(b) - rank(a) || (Number(answers.budget)>0?cost(b)-cost(a):cost(a)-cost(b)) || a.name.localeCompare(b.name, 'sk') || a.id.localeCompare(b.id));
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
      const priced = recommend({...answers, category, budget:''}).matches;
      // Ask about a verifiable difference before revealing products. Never ask customers to rank SKUs.
      const baseAnswered=result.every(s=>answers[s.key]!==undefined);
      const facetPool=recommend({...answers,category,budget:'',area:'',time:'',ingredient:'',size:''}).matches;
      if(baseAnswered&&result.length<5){for(const key of ['area','time','ingredient','size']){
        const values=[...new Set(facetPool.map(p=>p.features[key]).filter(Boolean))];
        if(key==='size')values.sort((a,b)=>parseFloat(a)-parseFloat(b));
        /* Pack size is a real choice only between sizes of one and the same product. */
        if(key==='size'&&(new Set(values.map(v=>v.split(' ')[1])).size>1||new Set(facetPool.map(p=>norm(p.name).replace(/\s*[–-]?\s*\d+(?:[.,]\d+)?\s*(ml|g|kg|l)\b.*$/,''))).size>1))continue;
        if(values.length<2||values.length>4)continue;
        result.push({key,options:[...values,'any']});break;
      }}
      const limits=(priced[0]?.currency === 'CZK' ? [300,600,1000] : [10,25,50]).filter(n=>{const c=priced.filter(p=>withinBudget(p,n)).length;return c&&c<priced.length;});
      if(priced.length>4&&limits.length&&result.length<5&&!result.some(s=>['area','time','ingredient','size'].includes(s.key)))result.push({key:'budget',options:limits});
      return result;
    }
    return {products, categoryPool, recommend, steps};
  }
  scope.CXAdvisorCore = {create, prepare, norm, detailLabels};
  if (typeof module !== 'undefined' && module.exports) module.exports = scope.CXAdvisorCore;
})(typeof globalThis !== 'undefined' ? globalThis : window);
