/* Shared recommendation rules. Uses the complete supplied catalogue, never a top-N subset. */
(function (scope) {
  'use strict';
  const norm = v => String(v || '').normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
  const productFamily=p=>norm(p.name).replace(/\s*[–-]?\s*\d+(?:[.,]\d+)?\s*(ml|g|kg|l|gr)\b.*$/,'').trim();
  const kinds = [['mask', 'Masky'], ['serum', 'Séra'], ['oil', 'Oleje'], ['gel', 'Gély'], ['cream', 'Krémy']];
  const profiles = ['dry', 'oily', 'sensitive', 'balanced', 'damaged'];
  const goals = ['hydrate', 'calm', 'balance', 'mature', 'clean', 'daily'];
  // A broad shop category is not evidence of how a product is used.
  // In particular, blemish correctors were imported under face cleansing.
  function routineRole(p) {
    if(p.category==='other')return 'other';
    // New S5 source-verified role overrides are explicit and opt-in; old catalogues are unchanged.
    if(p.source?.series==='s5'&&p.source?.routineRoleVerified===true&&p.source?.kindLocked&&p.source?.categoryLocked&&['cleanser','cream','serum','oil','toner','shampoo','conditioner'].includes(p.source.routineRole))return p.source.routineRole;
    if(['conditioner','leaveInCare','styling'].includes(p.source?.routineRole))return p.source.routineRole;
    if(/predsampon|predumyvac/.test(norm(p.name+' '+p.kind)))return 'preWash';
    if (p.features?.packType === 'shampooDuo') return 'set';
    const name = norm(p.name), kind = norm(p.kind);
    if(p.category==='makeup'&&!/odlic|dlicov/.test(name))return 'makeup';
    if (/korektor|concealer|corrector|correcteur|akne.*hydrogel/.test(name)) return 'targeted';
    if (/such[yae] sampon|dry shampoo/.test(name)) return 'dryShampoo';
    if (/sampon|sampuk|shampoo/.test(name)) return 'shampoo';
    if (/kondicion|conditioner|vlasov.*balzam|balzam.*vlas/.test(name)) return 'conditioner';
    if (/ser[au]|serum/.test(name)) return 'serum';
    if (/cistic|cistiac|odlic|mydl|myci|umyv|cleanser|cleansing|soap|wash/.test(name)) return 'cleanser';
    if (/krem|cream|maslo|balzam|\bluj\b/.test(name)) return 'cream';
    if (/olej|oil/.test(name)) return 'oil';
    if (/tonik|hydrolat|mlha|kvetinova voda/.test(name)) return 'toner';
    if (/^sera?$/.test(kind)) return 'serum';
    if (/^oleje$/.test(kind)) return 'oil';
    if (/^tonika a vody$/.test(kind)) return 'toner';
    if (/^cistenie a umyvanie$/.test(kind)) return 'cleanser';
    return 'other';
  }
  const detailLabels={
    day:['Na deň','Denná starostlivosť podľa označenia produktu.'],night:['Na večer','Produkt označený na nočnú starostlivosť.'],spf:['S ochranným faktorom SPF','Uprednostním produkt s uvedeným SPF.'],
    hyaluron:['S kyselinou hyalurónovou','Vyberiem hyalurónový produkt z tejto ponuky.'],vitaminC:['S vitamínom C','Uprednostním produkt s vitamínom C.'],bakuchiol:['S bakuchiolom','Vyberiem produkt označený s bakuchiolom.'],retinol:['S retinolom','Uprednostním produkt s uvedeným retinolom.'],ceramides:['S ceramidmi','Vyberiem ceramidovú starostlivosť.'],rose:['S ružovým základom','Vyberiem produkt označený s ružou.'],almond:['S mandľovým olejom','Uprednostním mandľový olej.'],argan:['S arganovým olejom','Uprednostním arganový olej.'],shea:['S bambuckým maslom','Vyberiem produkt s bambuckým maslom.'],
    hands:['Na ruky','Cielená starostlivosť o ruky.'],feet:['Na nohy','Starostlivosť o chodidlá a nohy.'],shower:['Na umývanie','Sprcha alebo umývanie pokožky.'],deodorant:['Proti telesnému pachu','Dezodorant z ponuky značky.'],bath:['Do kúpeľa','Produkt určený do kúpeľa.']
  };
  function features(p){
    const text=norm(p.name),f={};
    const role=routineRole(p),descriptionText=norm(p.description||'');
    if(role==='makeup'){
      f.purpose=/tvarenk/.test(text)?'cheekColour':/korektor/.test(text)?'spotCoverage':'evenComplexion';
      const shade=text.match(/-\s*(medium dark|medium light|dark|medium|light|ostruzina|broskyna|malina|lici)\s*$/)?.[1];
      if(shade)f.careVariant='shade-'+shade.replace(/ /g,'-');
      return f;
    }
    if(role==='cream'&&/balzam/.test(text))f.texture='balmTexture';
    else if(role==='cream'&&/maslo/.test(text))f.texture='butterTexture';
    else if(role==='cream')f.texture='creamTexture';
    else if(role==='serum')f.texture='serumTexture';
    else if(role==='oil')f.texture='oilTexture';
    else if(role==='toner')f.texture='waterTexture';
    else if(role==='cleanser')f.texture=/mydlo/.test(text)?'solidSoap':/balzam/.test(text)?'balmTexture':/gel/.test(text)?'gelTexture':/mleko|mlieko/.test(text)?'milkTexture':/olej|oil/.test(text)?'oilTexture':/pudr/.test(text)?'powderTexture':undefined;
    else if(/maslo/.test(text))f.texture='butterTexture';
    else if(/balzam/.test(text))f.texture='balmTexture';
    if(/po opalovani|after.?sun/.test(text))f.purpose='afterSun';
    else if(/\bspf\s*\d|opalovaci/.test(text))f.purpose='sunProtection';
    else if(/ekzem|atopik|atopick/.test(text))f.purpose='dryIrritated';
    else if(/intim|\bkoule\b|prsa a stehna/.test(text))f.purpose='intimateCare';
    else if(/celulit/.test(text))f.purpose='bodyFirmness';
    else if(/\bruce\b|\bruky\b|\bhand\b/.test(text))f.purpose='handCare';
    else if(/paty|chodidl|\bnohy\b|foot/.test(text))f.purpose='footCare';
    else if(/odlic|dlicov|make.?up remov/.test(text))f.purpose='makeupRemoval';
    else if(/mask/.test(text))f.purpose='maskCare';
    else if(role==='cleanser')f.purpose='washing';
    else if(/korektor|concealer|problematick|\bakne\b|\bacne\b/.test(text))f.purpose='blemishCare';
    else if(/rhassoul|marocky jil/.test(text)&&/cisteni pleti/.test(descriptionText))f.purpose='clayCleansing';
    else if(/de[sz]?odor/.test(text))f.purpose='deodorantCare';
    else if(/dezinfek/.test(text))f.purpose='handHygiene';
    else if(/holeni|holenie|shav/.test(text))f.purpose='shavingCare';
    else if(role==='shampoo')f.purpose=/mastne|mastici/.test(text)?'oilyHair':/suche|poskozene/.test(text)?'dryHair':/lup/.test(text)?'dandruffCare':/rust|rastu/.test(text)?'hairGrowth':'hairWashing';
    else if(role==='conditioner')f.purpose='afterHairWash';
    else if(role==='preWash')f.purpose='preWashCare';
    else if(role==='leaveInCare')f.purpose='leaveInCare';
    else if(role==='styling')f.purpose='stylingCare';
    else if(role==='toner')f.purpose=p.category==='hair'?'scalpTonic':'toning';
    else if(/exfolia|peeling|scrub/.test(text))f.purpose='exfoliation';
    else if(/mask/.test(text)||/rhassoul|marocky jil/.test(text)&&/mask/.test(descriptionText))f.purpose='maskCare';
    else if(p.category==='hair'&&/rast vlas|rust vlas/.test(text))f.purpose='hairGrowth';
    else if(/anti.?ag(?:e|ing)|vrask|starnut|kmenov|lifting|omlaz/.test(text))f.purpose='firmnessCare';
    else if(/rozjasn/.test(text))f.purpose='radianceCare';
    else if(/antioxid/.test(text))f.purpose='antioxidantCare';
    else if(/vyrovnavac|vyrovnavaci/.test(text)||/kalibracni/.test(text)&&/mastnejsi plet/.test(descriptionText))f.purpose='oilBalance';
    else if(/zklid|upokoj/.test(text))f.purpose='calmingCare';
    else if(/hydrat/.test(text))f.purpose='hydrationCare';
    else if(/regenerac/.test(text))f.purpose='regenerationCare';
    else if(['cream','oil','serum'].includes(role)||/maslo|balzam|mleko|mlieko|nektar/.test(text))f.purpose='nourishingCare';
    if(p.category==='face'&&f.purpose==='nourishingCare'){
      if(/hyaluron|niacinamid/.test(text)&&/hydrat/.test(descriptionText))f.purpose='hydrationCare';
      else if(/bakuchiol|coenzyme|peptid|q10/.test(text)&&/pevnos|vrask|pruzn|aging/.test(descriptionText))f.purpose='firmnessCare';
      else if(/vitamin/.test(text)&&/rozjasn/.test(descriptionText))f.purpose='radianceCare';
      else if(/rosacea|kuperoza/.test(text))f.purpose='calmingCare';
    }
    if(!f.ingredient){for(const [value,rx]of [['peptides',/peptid/],['q10',/coenzyme|q10/],['niacinamide',/niacinamid/]])if(rx.test(text)){f.ingredient=value;break;}}
    if(f.purpose)f.careUse=['sunProtection','afterSun'].includes(f.purpose)?'sunCare':['handCare','footCare','intimateCare','handHygiene','shavingCare'].includes(f.purpose)?'specificArea':['washing','makeupRemoval','toning','clayCleansing'].includes(f.purpose)?'cleansingCare':['maskCare','exfoliation'].includes(f.purpose)?'occasionalCare':['blemishCare','dryIrritated','bodyFirmness'].includes(f.purpose)?'targetedCare':f.purpose==='deodorantCare'?'deodorantCare':'dailyCare';
    if(/\bspf\s*\d/.test(text))f.time='spf';else if(/\bnocn|night/.test(text))f.time='night';else if(/\bdenn|day cream/.test(text))f.time='day';
    for(const [key,rx]of [['hyaluron',/hyaluron/],['vitaminC',/vitamin\s*c\b|vitaminu\s*c\b/],['bakuchiol',/bakuchiol/],['retinol',/retin[oa]l/],['ceramides',/ceramid/],['rose',/ruzov|ruze|rose oil/],['almond',/mandl|almond/],['argan',/argan/],['shea',/bambuc|shea/]])if(rx.test(text)){f.ingredient=key;break;}
    if(p.category==='body'){for(const [key,rx]of [['hands',/\bru(?:ce|ky|k)\b|\bhand\b/],['feet',/chodidl|\bnohy\b|\bfoot\b|\bfeet\b/],['deodorant',/de[sz]odor/],['bath',/kupel|koupel|bath salt/],['shower',/sprch|\bmydl|\bsoap\b|shower/]])if(rx.test(text)){f.area=key;break;}}
    // These differences come from product names and supplied product descriptions.
    const description=norm(p.description||'');
    if(p.category==='face'&&['oil','cream','serum'].includes(role)){
      if(/pro suchou plet|pre suchu plet/.test(descriptionText))f.skinFocus='dryCare';
      else if(/sklon.*(?:akne|pupink)|plet.*sklon.*nedokonal/.test(descriptionText))f.skinFocus='blemishCare';
    }
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
    if(!f.ingredient&&/levandul|lavender/.test(text))f.ingredient='lavender';
    if(!f.ingredient&&/ruz(?:e|i|ov)|rose/.test(text)&&['cream','oil','toner'].includes(role))f.ingredient='rose';
    if(!f.ingredient&&/herman|harmancek|chamomile/.test(text)&&['cream','oil','toner'].includes(role))f.ingredient='chamomile';
    if(!f.ingredient&&/pomeranc/.test(text)&&/ylang/.test(text))f.ingredient='orangeYlang';
    if(role==='cleanser'&&/mydlo/.test(text)){
      if(/\bciste\b/.test(text)&&/bez pridanych vun/.test(descriptionText))f.careVariant='withoutFragrance';
      else if(/levandul/.test(text)&&/rozmar/.test(text))f.careVariant='lavenderRosemary';
    }
    if(role==='toner'&&!f.ingredient){for(const [key,rx]of [['chamomile',/herman|harmancek|chamomile/],['rosemary',/rozmar|rosemary/],['rooibos',/rooibos/],['orangeBlossom',/pomerancov.*kvet/]])if(rx.test(text)){f.ingredient=key;break;}}
    if(p.category==='hair'&&role==='shampoo'&&!p.source?.kindLocked){/* séria 4: kindLocked = druh a zameranie z e-shopu, bez odvodzovania z názvu */
      f.hairNeed=/silver/.test(text)?'silverCare':/vlnite|kucerave|kudrnate/.test(text)?'curlCare':/caste umyv|kazdodenni/.test(text)?'frequentWash':/normalizacni|normalizacny/.test(text)?'normalisingWash':/lup|dandruff/.test(text)?'dandruffCare':/citliv|zklid|upokoj/.test(text)?'scalpComfort':/mastn/.test(text)?'oilyHair':/objem|jemne vlasy/.test(text)?'volumeCare':/suche/.test(text)?'dryHair':/lamave|poskoz|poskod|krepat|uhlaz/.test(text)?'damagedHair':/barvene|farbene|color/.test(text)?'colouredHair':/vypad|rust vlas|rast vlas/.test(text)?'hairGrowth':'hairWashing';
    }
    if(p.category==='hair'&&role==='conditioner'){
      if(/bezoplach|leave.?in/.test(text))f.hairUse='leaveIn';
      else if(/oplachnete|oplachnite|oplachujte|rinse/.test(descriptionText))f.hairUse='rinseOut';
    }
    const size=!p.source?.priceFrom&&String(p.volume||p.variantLabel||p.name).match(/\b(\d+(?:[.,]\d+)?)\s*(ml|g|kg|l)\b/i);if(size)f.size=size[1].replace(',','.')+' '+size[2].toLowerCase();
    if(p.source?.selectionTraitsEvidence&&p.source?.selectionTraits)Object.assign(f,p.source.selectionTraits);
    // Reconcile the use after explicit source-backed traits.
    if(p.source?.selectionTraits?.purpose)f.careUse=p.source.selectionTraits.careUse||(purpose=>['sunProtection','afterSun'].includes(purpose)?'sunCare':['handCare','footCare','intimateCare','handHygiene','shavingCare'].includes(purpose)?'specificArea':['washing','makeupRemoval','toning','clayCleansing','hairWashing'].includes(purpose)?'cleansingCare':['maskCare','exfoliation'].includes(purpose)?'occasionalCare':['blemishCare','dryIrritated','bodyFirmness'].includes(purpose)?'targetedCare':purpose==='deodorantCare'?'deodorantCare':'dailyCare')(f.purpose);
    if(p.carePack)f.packType=p.carePack;
    return f;
  }
  function prepare(source) {
    source=source.flatMap(p=>{
      if(!p.variants?.length)return [p];
      const sizes=p.variants.map(v=>Number(String(v.volume).match(/\d+(?:[.,]\d+)?/)?.[0])).filter(Number.isFinite);
      return p.variants.map(v=>{
        const isSample=/vzorek|vzorka|sample/i.test(v.volume)||/ml\b/i.test(v.volume)&&Number(String(v.volume).match(/\d+(?:[.,]\d+)?/)?.[0])<=5&&Math.max(...sizes)>5;
        return {...p,...v,id:p.id+'-variant-'+v.id,productUrl:p.url,variants:undefined,isSample,
          available:!p.source?.recommendationHold&&v.available!==false,kind:isSample?'Vzorky — '+p.kind:p.kind,source:{...p.source,priceFrom:false,variantId:v.id}};
      });
    });
    const prepared=source.map((p, index) => {
      const tags = [...(p.tags || [])];
      const text = norm([p.name, p.kind, p.reason].join(' '));
      let category = p.category || 'face';
      const productName=norm(p.name);
      if(p.source?.categoryLocked);/* séria 4: kategória overená z e-shopu sa neprepisuje podľa názvu (napr. „Bez parfemace“ nie je parfum) */
      else if(/tvarenk|kremovy korektor/.test(productName))category='makeup';
      else if(category==='makeup'&&/odlic|dlicov/.test(productName))category='face';
      else if(/\bpro psy\b|\bpro psa\b|\bpsa\b|tlapky|pro psy a kocky/.test(productName))category='pets';
      else if(/betonov|doza|podtacek|\bmiska\b|\bvaza\b|\bpemza\b/.test(productName))category='other';
      else if(p.kind==='Darčekové sady'||/\bsystem$|^rutina pre /.test(productName))category='sets';
      else if(/parfem/.test(productName))category='fragrance';
      else if(/zubni pasta/.test(productName))category=/detsk/.test(productName)?'baby':'oral';
      else if(/kojeneck|detsky|detska|pro deti/.test(productName)&&category!=='sets')category='baby';
      else if(/sprchovy gel|telov|mydlo|myci olej/.test(productName)&&category==='tea')category='body';
      else if(/cistici pudr.*maska/.test(productName))category='face';
      const explicitSample = p.isSample === true || /\b(?:vzorek|vzorka|vzorky|sample)\b/.test(norm(p.name));
      if (explicitSample) category = 'samples';
      let kind = p.kind || kinds.find(([tag]) => tags.includes(tag))?.[1] || 'Starostlivosť';
      if(category==='makeup')kind='Líčenie';
      if (['face','body','hair','eyes','lips','beard'].includes(category) && ['Ďalšia ponuka','Doplnky','Starostlivosť'].includes(kind)) {
        kind = {serum:'Séra',cream:'Krémy a balzamy',oil:'Oleje',cleanser:'Čistenie a umývanie',shampoo:'Šampóny',conditioner:'Kondicionéry'}[routineRole({...p,kind})] || kind;
      }
      if (['face','body','hair','eyes','lips','beard','baby','samples'].includes(category) && !p.source?.kindLocked) {
        const actualRole=routineRole({...p,kind});
        if(actualRole==='targeted')kind='Cielená starostlivosť';
        else if(actualRole==='cleanser')kind='Čistenie a umývanie';
        else if(actualRole==='toner')kind='Toniká a vody';
        else if(/de[sz]?odor/.test(productName))kind='Dezodoranty';
      }
      if (explicitSample && !/^Vzorky/.test(kind)) kind = 'Vzorky — ' + kind;
      const signals = new Set(tags.filter(t => profiles.includes(t) || goals.includes(t)));
      if (!p.source?.suitabilityEvidence) {
      if (/hydrat|hyaluron|such[aeuoy]|vyziv|zvlacn/.test(text)) signals.add('hydrate');
      if (/citliv|upokoj|zklid|jemne myti/.test(text)) signals.add('calm');
      if (/mastn|mastici|sebum|nedokonal|akne/.test(text)) signals.add('balance');
      if (/vrask|aging|lifting|zrel|spevn/.test(text)) signals.add('mature');
      }
      if (['face','body','hair'].includes(category) && ['cleanser','shampoo'].includes(routineRole({...p,kind}))) signals.add('clean');
      if (routineRole({...p,kind}) === 'targeted') signals.delete('clean');
      if(category==='hair'){
        if(/normalni vlasy|normalne vlasy/.test(productName)){signals.delete('oily');signals.delete('dry');signals.add('balanced');}
        if(/poskozene vlasy|poskodene vlasy/.test(productName))signals.add('damaged');
      }
      /* Anti-wrinkle care is a face matter; a shower cream is not "for mature skin". */
      if (!['face', 'eyes'].includes(category)) signals.delete('mature');
      if (!signals.has('mature') && !signals.has('clean')) signals.add('daily');
      // A dry shampoo absorbs oil; its form is not evidence of dry-hair care.
      const dryShampoo=category==='hair'&&/(?:such[yae]\s+samp|dry\s+(?:shampoo|powder))/.test(norm(p.name));
      if(dryShampoo){for(const signal of ['dry','hydrate','mature','clean','daily'])signals.delete(signal);signals.add('oily');signals.add('balance');}
      const amount = Number.isFinite(p.priceAmount) ? p.priceAmount : Number(String(p.price || '').replace(/\s/g, '').replace(',', '.').match(/\d+(?:\.\d+)?/)?.[0]);
      return {...p, catalogueOrder:index, isSample:explicitSample, id:String(p.id ?? index), category, kind:dryShampoo?'Suché šampóny':kind, tags:dryShampoo?tags.filter(t=>!['dry','hydrate','mature','clean','daily'].includes(t)):tags, features:features({...p,category}),signals:[...signals], priceAmount:Number.isFinite(amount)?amount:null, currency:p.currency || (/Kč|CZK/.test(p.price || '') ? 'CZK' : 'EUR'), photo:p.photo || p.image};
    });
    // A named MINI pack is the same formula only when exactly one full-size
    // product has that name as its prefix. Never infer across ambiguous names.
    const familyName=p=>norm(p.name).replace(/^mini\s*[-–]?\s*/,'').replace(/\bpletovy\b/g,'').replace(/\s*-\s*/g,' ').replace(/\s+/g,' ').trim();
    for(const p of prepared.filter(p=>/^mini\b/.test(norm(p.name)))){
      const key=familyName(p),parents=prepared.filter(x=>!/^mini\b/.test(norm(x.name))&&x.category===p.category&&familyName(x).startsWith(key));
      if(key.length<10||parents.length!==1)continue;
      const parent=parents[0];p.features={...parent.features,...p.features,packType:'travelPack'};p.kind=parent.kind;parent.features.packType='standardPack';
    }
    return prepared;
  }
  const routineCost=p=>p.source?.priceFrom?(Number.isFinite(p.source.priceMax)?p.source.priceMax:Infinity):(Number.isFinite(p.priceAmount)?p.priceAmount:Infinity);
  function complementFor(products,answers,p,budget=answers.budget) {
    const limit=Number(budget)||Infinity, photo=String(p.photo).split('?')[0];
    const roles=({cleanser:['cream'],cream:['cleanser'],serum:['cream'],toner:['cream'],shampoo:['conditioner'],conditioner:['shampoo']})[routineRole(p)]||[];
    return products.filter(x=>x.available!==false&&!x.isSample&&x.currency===p.currency&&x.photo&&x.id!==p.id&&String(x.photo).split('?')[0]!==photo&&x.category===p.category&&roles.includes(routineRole(x))&&(!x.source?.complementForProductUrls||x.source.complementForProductUrls.includes(p.productUrl||p.url))&&Number.isFinite(routineCost(x))&&routineCost(p)+routineCost(x)<=limit&&!(x.category==='body'&&/intim|koule|genital|bradav|tetov|hemoro/.test(norm(x.name)))&&!/(?:retin[oa]l|\baha\b|\bbha\b|peeling|kyselin|esencial|eterick)/.test(norm(x.name+' '+x.kind))&&(!answers.profile||answers.profile==='any'||x.signals?.includes(answers.profile)||x.source?.allSkinTypes===true)&&(answers.careVariant!=='withoutFragrance'||/bez vun|bez von|without fragrance|unscented/.test(norm(x.name+' '+(x.description||''))))).sort((a,b)=>routineCost(a)-routineCost(b))[0]||null;
  }
  function create(source) {
    const products = prepare(source.filter(p=>!p.source?.advisorExcludedReason));
    const withinBudget=(p,n)=>Number.isFinite(p.priceAmount)&&p.priceAmount<=Number(n)&&(!p.source?.priceFrom||(Number.isFinite(p.source.priceMax)&&p.source.priceMax<=Number(n)));
    function categoryPool(answers = {}) {
      return products.filter(p => (!answers.category || p.category === answers.category) && (!answers.kind || answers.kind === 'any' || p.kind === answers.kind));
    }
    function recommend(answers = {}) {
      const only=[...new Set(products.filter(p=>p.available!==false).map(p=>p.category))];if(!answers.category&&only.length===1)answers={...answers,category:only[0]};
      let list = categoryPool(answers).filter(p => p.available !== false);
      // Samples belong to their explicit form; never silently replace the normal product.
      if (answers.category !== 'samples' && !/vzork|sample/i.test(answers.kind || '') && !answers.size) list = list.filter(p => !p.isSample);
      if (answers.budget) list = list.filter(p => withinBudget(p,answers.budget));
      if (answers.profile === 'sensitive') list = list.filter(p => p.signals.includes('sensitive') || p.signals.includes('calm') || !/retinol|retinal|aha|bha|peeling|kyselin/.test(norm(p.name + ' ' + p.kind)));
      if (answers.goal && answers.goal !== 'any') list = list.filter(p => p.signals.includes(answers.goal));
      if (answers.profile && answers.profile !== 'any') list = list.filter(p => p.signals.includes(answers.profile)||p.source?.allSkinTypes===true);
      if (answers.product) list = list.filter(p => p.id === answers.product);
      for(const key of ['careUse','purpose','texture','hairNeed','hairUse','area','hairFocus','packType','careVariant','skinFocus','time','ingredient','size'])if(answers[key]&&answers[key]!=='any')list=list.filter(p=>p.features[key]===answers[key]);
      const rank = p => (p.signals.includes(answers.profile) ? 8 : 0) + (p.signals.includes(answers.goal) ? 12 : 0);
      list.sort((a, b) => rank(b) - rank(a) || a.catalogueOrder-b.catalogueOrder);
      const winner = list[0] || null;
      // An alternative must be a different real product, not a size variant of the winner.
      const alternative = winner ? list.find(p => p.url !== winner.url && norm(p.name) !== norm(winner.name)) || null : null;
      return {winner, alternative, matches:list, profileVerified:!!winner && (answers.profile === 'any' || !answers.profile || winner.signals.includes(answers.profile)), goalVerified:!!winner && (answers.goal === 'any' || !answers.goal || winner.signals.includes(answers.goal))};
    }
    function steps(answers = {}) {
      const categories=[...new Set(products.filter(p=>p.available!==false).map(p=>p.category))];
      const result=categories.length>1?[{key:'category',options:categories}]:[],category=answers.category||categories[0];
      const working={category};
      let remaining=recommend(working).matches;
      const signature=list=>list.map(p=>p.id).sort().join('|');
      // Build each question from the products left by previous answers.
      // Never offer a catalogue of product names as a question.
      function ask(key,values,{neutral=false,distinctWinner=false}={}) {
        if(key==='profile'&&remaining.some(p=>!p.source?.allSkinTypes&&!values.some(value=>p.signals.includes(value))))return false;
        const seen=new Set(),options=[];
        for(const value of values){
          const r=recommend({...working,[key]:value});if(!r.winner)continue;
          const valueSignature=distinctWinner&&key!=='profile'?productFamily(r.winner):signature(r.matches);
          if(seen.has(valueSignature))continue;seen.add(valueSignature);options.push(value);
        }
        if(options.length<2)return false;
        // A neutral answer is useful only if it produces a genuinely different
        // general recommendation, not a duplicate of an existing answer.
        if(neutral){const fallback=recommend(working).winner;if(fallback&&!options.some(value=>recommend({...working,[key]:value}).winner?.id===fallback.id))options.push('any');}
        result.push({key,options});
        if(answers[key]!==undefined){working[key]=answers[key];remaining=recommend(working).matches;}
        return true;
      }
      function feature(key){
        if(remaining.length<2||remaining.some(p=>!p.features[key]))return;
        const values=[...new Set(remaining.map(p=>p.features[key]))];
        if(values.length>1)ask(key,values);
      }
      // Purpose first: distinguish sun care, washing and targeted needs before price.
      feature('careUse');feature('purpose');
      const supported=profiles.filter(value=>remaining.some(p=>p.signals.includes(value)));
      if(['face','body','hair'].includes(category))ask('profile',supported,{neutral:true,distinctWinner:true});
      ask('kind',[...new Set(remaining.map(p=>p.kind))],{neutral:true});
      for(const key of ['hairNeed','hairUse','texture','area','hairFocus','careVariant','skinFocus','time','ingredient','packType'])feature(key);
      // Choose an actual pack before asking about price, not the other way round.
      if(remaining.length>1&&remaining.every(p=>p.features.size)&&new Set(remaining.map(productFamily)).size===1){
        const sizes=[...new Set(remaining.map(p=>p.features.size))];
        if(new Set(sizes.map(v=>v.split(' ')[1])).size===1)ask('size',sizes.sort((a,b)=>parseFloat(a)-parseFloat(b)));
      }
      // A price choice must change the actual primary recommendation.
      // Add-ons still respect the whole selected budget, but an optional add-on
      // alone must not create several price answers for the same product.
      const budgetBase={...working},outcome=n=>{
        const r=recommend({...budgetBase,budget:n}),p=r.winner;
        return p?JSON.stringify([p.id,p.volume||'',p.priceAmount]):null;
      };
      const seenOutcomes=new Set([outcome('')]),limits=[];
      for(const value of (remaining[0]?.currency==='CZK'?[300,600,1000]:[10,25,50])){
        const outcomeKey=outcome(value);if(!outcomeKey||seenOutcomes.has(outcomeKey))continue;
        seenOutcomes.add(outcomeKey);limits.push(value);
      }
      if(limits.length){result.push({key:'budget',options:limits});if(answers.budget!==undefined){working.budget=answers.budget;remaining=recommend(working).matches;}}
      return result;
    }
    return {products, categoryPool, recommend, steps};
  }
  scope.CXAdvisorCore = {create, prepare, norm, detailLabels, routineRole, complementFor};
  if (typeof module !== 'undefined' && module.exports) module.exports = scope.CXAdvisorCore;
})(typeof globalThis !== 'undefined' ? globalThis : window);
