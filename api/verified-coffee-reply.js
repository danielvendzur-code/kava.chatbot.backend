import {verifiedCoffee} from './verified-coffee-data.js';
export function verifiedCoffeeReply(slug,text){
 const products=verifiedCoffee[slug];if(!products)return null;
 const q=String(text).normalize('NFD').replace(/\p{Diacritic}/gu,'').toLowerCase();
 if(/liec|vyliec|tehot|dojc|chorob|zdrav|liek/.test(q))return 'Táto ukážka vyberá kávu podľa chuti a prípravy. Úplné informácie o produkte nájdete v oficiálnom e-shope.';
 if(/doprav|platb|doruc|reklam|vraten/.test(q))return 'Aktuálne podmienky dopravy, platby a vrátenia nájdete v oficiálnom e-shope. Ponuka ukážky obsahuje overené kávové balenia a ceny.';
 const rows=/bez\s*kof|bezkof|decaf/.test(q)?products.filter(p=>p.decaf):products.filter(p=>!p.decaf);
 const score=p=>/filte?r|v60|prekvap|prekap/.test(q)?p.prep.filter:/automat/.test(q)?p.prep.automat:/mliek|mlek|cappuc|latte/.test(q)?p.drink.milk:/ovoc|sviez|svez/.test(q)?p.taste.fruity:/coko|orech|slad/.test(q)?p.taste.chocolate:/kysl|acidit/.test(q)?3-p.acidity:1;
 const selected=rows.slice().sort((a,b)=>score(b)-score(a)).slice(0,2);
 return selected.map(p=>`${p.name} (${p.priceUnit}) — ${p.price}. Chuť: ${p.notes.join(', ')}. ${p.url}`).join('\n\n');
}
