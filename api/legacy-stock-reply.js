import '../catalogue-reply-core.js';
const stock={modrapupava:{products:[
  {
    "id": "antiage",
    "name": "Inspiral Anti-age",
    "url": "https://www.modrapupava.sk/products/krem-na-spevnenie-pleti-inspiral-anti-age?variant=52841044181331",
    "price": "51,35 €",
    "volume": "50 ml",
    "priceAmount": 51.35,
    "currency": "EUR",
    "category": "face",
    "kind": "Pleťové krémy",
    "tags": [
      "mature",
      "dry",
      "hydrate",
      "cream"
    ]
  },
  {
    "id": "problem",
    "name": "Problematická pleť",
    "url": "https://www.modrapupava.sk/products/pletovy-a-telovy-olej-problematicka-plet?variant=52121006080339",
    "price": "26,11 €",
    "volume": "100 ml",
    "priceAmount": 26.11,
    "currency": "EUR",
    "category": "face",
    "kind": "Pleťové oleje",
    "tags": [
      "oily",
      "clarity",
      "oil"
    ]
  },
  {
    "id": "fialka",
    "name": "Fialka",
    "url": "https://www.modrapupava.sk/products/pletova-kura-fialka?variant=52841004368211",
    "price": "22,48 €",
    "volume": "30 ml",
    "priceAmount": 22.48,
    "currency": "EUR",
    "category": "face",
    "kind": "Pleťové oleje",
    "tags": [
      "sensitive",
      "calm",
      "oil"
    ]
  }
]}};
export const legacyStockReply=(slug,text)=>{
 if(slug!=='modrapupava')return null;
 const q=String(text).normalize('NFD').replace(/\p{Diacritic}/gu,'').toLowerCase();
 const reply=globalThis.CXCatalogueReplyCore(stock,slug,text).replace('Ďalšie produkty sú vo Výbere a v Ponuke.','Overené produkty nájdete vo Výbere starostlivosti.');
 if(/serum/.test(q)&&!/liec|chorob|ekzem|rosacea|dermatit/.test(q))return 'Medzi tromi overenými produktmi v tejto ukážke teraz nie je skladové pleťové sérum. Môžem ukázať dostupný krém a oleje.\n\n'+reply;
 return reply;
};
