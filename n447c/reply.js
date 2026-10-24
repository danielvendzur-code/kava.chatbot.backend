/* Odpovede len o overených kávach; bez zdravotných tvrdení a bez cudzej značky. */
(function(g){const E=g.N447Engine||(typeof require==='function'?require('./engine.js'):null);
const fold=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
function coffeeReply(d,input){const q=fold(input),p=d.products;const named=/strong|robust/.test(q)?p[1]:/organic|arabik/.test(q)?p[0]:null;
 const requestedGrams=/\b900\b/.test(q)?900:/\b250\b/.test(q)?250:null;
 const line=x=>x.name+': '+x.variants.filter(v=>!requestedGrams||v.grams===requestedGrams).map(v=>E.grams(v.grams)+' '+E.money(v.price,'EUR')+' ('+v.url+')').join('; ')+'.';
 if(/zdrav|tehot|dojc|uzkost|diagno|liek|chorob|mykotox|laborator/.test(q))return 'Táto ukážka pomáha vybrať kávu podľa chuti, prípravy a balenia. Neposudzuje zdravotný stav ani bezpečnú dávku kofeínu pre konkrétneho človeka. O zložení vám poradí aj Powerlogy: '+d.brand.contact+'.';
 if(/bez ?kofe|decaf/.test(q))return 'Obe kávy v tomto výbere obsahujú kofeín. Strong má podľa výrobcu vyšší obsah kofeínu; bezkofeínová káva do tejto ukážky nie je zaradená.';
 if(/kontakt|mail|telef/.test(q))return 'Powerlogy: '+d.brand.contact+' · '+d.brand.contactSource;
 if(/doprav|doruc|postovn/.test(q))return d.shop.freeShipping+' '+d.brand.shopUrl;
 if(/filter|filtr|v60|french|aeropress/.test(q))return 'Na filtrovanú prípravu výrobca uvádza Organic Coffee: 100 % arabika z El Salvadoru, medium praženie, figy a čokoláda. Predáva sa zrnková, treba ju zomlieť podľa pomôcky. '+line(p[0]);
 if(/rozdiel|porov|silnejs|zlozen/.test(q))return p.map(x=>x.name+': '+x.compositionText+', '+x.notes.join(', ')+', '+x.roastLabel+' praženie.').join(' ')+' Strong má vyšší obsah kofeínu. Obe kávy sú zrnkové; vyberte si aj 250 g alebo 900 g balenie.';
 if(/cen|stoji|kolko|900|250|balen|rozpoc/.test(q))return (named?[named]:p).map(line).join(' ')+(requestedGrams===900?'':' Cena Strong 250 g je pri kontrole 24. 10. akciová.')+' Konečnú cenu pred nákupom overte v e-shope. Doprava nie je zahrnutá.';
 if(named)return named.summary+' '+line(named);
 return 'Vyberieme medzi Organic Coffee (100 % arabika, figy a čokoláda) a Organic Coffee Strong (50 % robusta, horká čokoláda a oriešky, viac kofeínu). Obe majú 250 g aj 900 g. Na filter je v tomto výbere Organic Coffee. Akú prípravu a balenie používate?';}
const api={coffeeReply};g.N447Reply=api;if(typeof module!=='undefined'&&module.exports)module.exports=api;})(typeof globalThis!=='undefined'?globalThis:window);