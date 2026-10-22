/* Optional follow-up questions use only differences explicitly present in the
   remaining coffees. Never infer origin, roast or flavour for an unknown SKU. */
(function(scope){
  'use strict';
  const fold=s=>String(s||'').normalize('NFD').replace(/\p{Diacritic}/gu,'').toLowerCase();
  const notes=p=>Array.isArray(p.notes)&&p.notes.length?[...new Set(p.notes.map(fold))].sort().join('|'):null;
  function composition(p){
    if(Number.isFinite(p.robustaPercent)&&p.robustaPercent>=0&&p.robustaPercent<=100)return String(p.robustaPercent);
    const name=fold(p.name);
    if(/100\s*%\s*arabi/.test(name))return '0';
    if(/100\s*%\s*robust/.test(name))return '100';
    const r=name.match(/(\d+(?:[.,]\d+)?)\s*%\s*robust/);if(r&&Number(r[1].replace(',','.'))<=100)return String(Number(r[1].replace(',','.')));
    return null;
  }
  const value=(p,key)=>key==='detailNotes'?notes(p):key==='detailComposition'?composition(p):null;
  const matches=(p,answers)=>['detailNotes','detailComposition'].every(k=>!answers[k]||value(p,k)===answers[k]);
  function next(products,answers={},cs=false){
    const t=(sk,cz)=>cs?cz:sk,pool=products.filter(p=>p.available!==false&&matches(p,answers));
    if(pool.length<2)return null;
    for(const key of ['detailNotes','detailComposition']){
      if(answers[key])continue;
      if(pool.some(p=>value(p,key)===null))continue;
      const groups=new Map();for(const p of pool){const v=value(p,key);if(!groups.has(v))groups.set(v,[]);groups.get(v).push(p);}
      if(groups.size<2||groups.size>4)continue;
      const options=[...groups].map(([v,items])=>{
        const title=key==='detailNotes'?items[0].notes.join(' · '):v==='0'?t('Arabica bez robusty','Arabika bez robusty'):v==='100'?'100 % robusta':t('Arabica s ','Arabika s ')+v+' % robusty';
        const detail=key==='detailNotes'?(items.length===1?items[0].name:items.length+t(' kávy s týmto profilom',' kávy s tímto profilem')):v==='0'?t('100 % arabica','100 % arabika'):v==='100'?t('Káva označená ako čistá robusta','Káva označená jako čistá robusta'):(100-Number(v))+' % '+t('arabica','arabika')+' · '+v+' % robusta';
        return {value:v,title,detail,textOnly:true};
      });
      return {key,name:key==='detailNotes'?t('Chuťové tóny','Chuťové tóny'):t('Zloženie','Složení'),title:key==='detailNotes'?t('Ktoré konkrétne chute vám viac sedia?','Které konkrétní chutě vám více sedí?'):t('Aké zloženie uprednostníte?','Jaké složení upřednostníte?'),options};
    }
    return null;
  }
  scope.CXCoffeeDifferenceCore={next,matches,value};
})(typeof globalThis!=='undefined'?globalThis:window);
