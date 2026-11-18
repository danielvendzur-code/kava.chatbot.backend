(() => {
  'use strict';
  const brands=window.COSMETICS_DEMOS?.brands;
  if(!brands)return;
  const verified=new Set(['burian','balaz','zapletal','malik','herzan','dvaduby','velkeer','bukovsky','zeliska','silinek','strapina','antos','brhlovce','langr']);
  for(const [slug,brand]of Object.entries(brands)){
    brand.catalogueContext='wine';
    if(verified.has(slug))brand.catalogueVerifiedAt='2026-10-09';
    brand.catalogue=brand.products.map(p=>{
      const tags=p.tags||[];
      const category=/oranž|orange/i.test(p.name)?'orange':['white','red','rose','orange'].find(x=>tags.includes(x))||(tags.includes('sparkling')?'sparkling':'wine');
      const priceAmount=Number(String(p.price).replace(/[^0-9,.]/g,'').replace(',','.'));
      const volume=p.volume||p.name.match(/\b\d+(?:[.,]\d+)?\s*l\b/i)?.[0]||'';
      return {...p,category,kind:tags.includes('sparkling')?'Šumivé víno':'Víno',priceAmount,currency:/Kč|CZK/.test(p.price)?'CZK':'EUR',volume,availabilityNote:slug==='kosek'?'Objednávateľné; fyzický sklad e-shop nezverejňuje.':''};
    });
  }
})();
