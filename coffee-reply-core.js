(()=>{const norm=v=>String(v||'').normalize('NFD').replace(/\p{Diacritic}/gu,'').toLowerCase();
globalThis.CXCoffeeReplyCore=(c,text,history=[])=>{
 const q=norm(text),texts=[...history.filter(m=>m?.role==='user').map(m=>norm(m.content)),q],recent=rx=>texts.slice().reverse().find(t=>rx.test(t))||q;const cafQ=recent(/kof|decaf/),prepQ=recent(/filtr|filter|v60|chemex|automat|moka|espresso|pakov/),tasteQ=recent(/ovoc|fruity|cokol|chocol/),acidQ=recent(/kys|acid/),milkQ=recent(/mliek|mlie|mlek|cierna|cernou|cappucc|latte/),budgetQ=recent(/(?:do|max|rozpocet)\s*\d|bez limit|bez rozpo/),cs=/\.cz(?:\/|$)/.test(c.source||'');
 if(/liec|vyliec|tehot|dojc|chorob|zdrav|liek/.test(q))return cs?'Kávu vybírám podle chuti a přípravy. Zdravotní vhodnost neposuzuji.':'Kávu vyberám podľa chuti a prípravy. Zdravotnú vhodnosť neposudzujem.';
 if(/doprav|platb|doruc|reklam|vraten|doru[cč]en/.test(q))return(cs?'Aktuální podmínky najdete v oficiálním obchodě: ':'Aktuálne podmienky nájdete v oficiálnom obchode: ')+c.source;
 const tokens=q.split(/\W+/).filter(t=>t.length>2&&!['chcem','hladam','prosim','kavu','kava','coffee','produkt','produkty','mate','ponuke','hledam'].includes(t));
 const wantsDecaf=/bez\s*kof|bezkof|decaf/.test(cafQ),prep=/filtr|filter|v60|chemex/.test(prepQ)?'filter':/automat/.test(prepQ)?'automat':/\bmoka\b/.test(prepQ)?'moka':/espresso|pakov|pakovy/.test(prepQ)?'lever':null;
 const taste=/ovoc|fruity/.test(tasteQ)&&!/bez\s*ovoc/.test(tasteQ)?'fruity':/cokol|chocol/.test(tasteQ)?'chocolate':null;
 const lowAcid=/bez\s*kys|nekys|nizk.*(?:kys|acid)|jemn.*acid/.test(acidQ),milk=/s mlie|do mlie|s mlek|do mlek|cappucc|latte/.test(milkQ);
 const budget=/bez limit|bez rozpo/.test(budgetQ)?null:budgetQ.match(/(?:do|max|rozpocet)\s*(\d+(?:[.,]\d+)?)\s*(€|eur|kc|czk)?/),amount=budget?Number(budget[1].replace(',','.')):null;
 const currency=budget?(/kc|czk/.test(budget[2]||'')?'CZK':/€|eur/.test(budget[2]||'')?'EUR':c.products[0]?.currency):null;
 if(currency&&c.products.some(p=>p.currency!==currency))return cs?'Tato nabídka má ceny v jiné měně. Zadejte prosím rozpočet v měně e-shopu.':'Táto ponuka má ceny v inej mene. Zadajte prosím rozpočet v mene e-shopu.';
 const eligible=p=>p.available!==false&&(!wantsDecaf||p.decaf)&&(!prep||(p.prep?.[prep]||0)>=.6)&&(!taste||(p.taste?.[taste]||0)>=.6)&&(!lowAcid||(Number.isFinite(p.acidity)&&p.acidity<=1))&&(!milk||(p.drink?.milk||0)>=.6)&&(amount===null||(Number.isFinite(p.priceAmount)&&p.priceAmount<=amount));
 let list=c.products.filter(eligible);
 const score=p=>tokens.filter(t=>norm(p.name+' '+(p.notes||[]).join(' ')).includes(t)).length;
 list.sort((a,b)=>score(b)-score(a)||(a.priceAmount??Infinity)-(b.priceAmount??Infinity));
 const gearIntent=/mlynce|mlyne|filtre|papierov.*filter|hario|chemex|french press|aeropress|tamper|konvic|kanvic|doza|hrnce|salk|odmerk|cascara|\bknih|cisti|poukaz/.test(q)||/kavovar/.test(q)&&!/(?:do|pre)\s+kavovar/.test(q);
 if(gearIntent){list=c.offer.filter(p=>p.kind!=='Káva'&&p.available!==false&&(amount===null||Number.isFinite(p.priceAmount)&&p.priceAmount<=amount)&&score(p)>0).sort((a,b)=>score(b)-score(a)||(a.priceAmount??Infinity)-(b.priceAmount??Infinity));}
 const exact=c.offer.filter(p=>eligible(p)&&tokens.length&&tokens.every(t=>norm(p.name).includes(t)));if(exact.length&&!gearIntent)list=exact;
 if(!list.length)return cs?'Taková kombinace v ověřené nabídce není. Zkuste upravit jednu podmínku ve výběru kávy.':'Takáto kombinácia v overenej ponuke nie je. Skúste upraviť jednu podmienku vo výbere kávy.';
 return list.slice(0,3).map(p=>p.name+(p.priceUnit&&p.priceUnit!=='balenie'?' ('+p.priceUnit+')':'')+' — '+p.price+'. '+p.url).join('\n\n');

};})();
