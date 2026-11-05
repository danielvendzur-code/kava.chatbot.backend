/* Catalogue-grounded replies share the advisor's category, availability and budget rules. */
globalThis.CXCatalogueReplyCore=(catalogues,slug,text,history=[])=>{
 const catalogue=catalogues[slug];if(!catalogue?.products?.length||!globalThis.CXAdvisorCore)return null;
 const core=globalThis.CXAdvisorCore, q=core.norm(text);
 const requestedName=q.match(/(?:mate|predavate|prodavate)\s+produkt\s+(.+?)\??$/)?.[1];if(requestedName&&!/^(?:na|pre|pro)\b/.test(requestedName)&&!catalogue.products.some(p=>core.norm(p.name).includes(requestedName.replace(/\?$/,''))))return 'Takýto produkt v overenej ponuke nemám. Upresnite prosím jeho názov.';

 const texts=[...history.filter(m=>m?.role==='user').map(m=>core.norm(m.content)),q],recent=rx=>texts.slice().reverse().find(t=>rx.test(t))||q;
 const categoryQ=recent(/licen|pudr|rten|brad|vous|detsk|deti|dieta|babat|baby|ocn|okolie oci|okoli oci|pery|rty|svieck|svick|difuz|caj|dopln.*vyziv|vitamin|kapsul|vlas|samp|kondicion|telov|telo|mydl|deodor|sprch|kupel|koupel|nohy|ruky|ruce|sada|sady|darcek|darek|plet|tvar/),profileQ=recent(/such|pnut|napjat|dehydrat|mast|maz|akne|citliv|reakt/),goalQ=recent(/vypad|rednut|ridnut|posiln|vrask|zrel|zral|anti.?aging|hydrat|odlic|cisten|cisti/),budgetQ=recent(/\bdo\s*\d|bez limit|bez rozpo/),formQ=recent(/samp|shampoo|kondicion|conditioner|tonik|oplach|\bkrem|\bserum|\bsera\b|\bserom|\bolej|\bmask/);
 if(/\bliec|vyliec|\blec[bi]|vylec|chorob|nemoc|ekzem|rosacea|dermatit|\bliek\b|\blek\b/.test(q))return 'Otázku liečby kožného ochorenia riešte s lekárom. Môžem vám ukázať kozmetické produkty a odkazy na ich úplné zloženie.';
  if(/doprava|dorucen|reklamac|platba|otvarac|oteviraci|kontakt|adresa/.test(q))return catalogue.source?(/\.cz(?:\/|$)|\/cs\//.test(catalogue.source)?'Aktuální dopravu, platby a podmínky nákupu potvrzuje e-shop: ':'Aktuálnu dopravu, platby a podmienky nákupu potvrdzuje e-shop: ')+catalogue.source:null;
 let category=/licen|pudr|rten|ruz\b/.test(categoryQ)?'makeup':/brad|vous/.test(categoryQ)?'beard':/detsk|deti|dieta|babat|baby/.test(categoryQ)?'baby':/\bocn[yei]\b|okolie oci|okoli oci/.test(categoryQ)?'eyes':/pery|rty|balzam na per/.test(categoryQ)?'lips':/svieck|svick|difuz|vone do dom/.test(categoryQ)?'home':/\bcaj\b/.test(categoryQ)?'tea':/dopln.*vyziv|vitamin|kapsul/.test(categoryQ)?'wellness':/vlas|samp|kondicion/.test(categoryQ)?'hair':/telov|telo|mydl|deodor|sprch|kupel|koupel|nohy|ruky|ruce/.test(categoryQ)?'body':/sada|sady|darcek|darek|darkov|balicek/.test(categoryQ)?'sets':'face';
 const engine=core.create(catalogue.products);if(category==='face'&&!engine.products.some(p=>p.category==='face'))category=engine.products.find(p=>p.available!==false&&p.category!=='other')?.category||'other';
 const generic=/^(?:prosim|prosimvas|hladam|chcem|potrebujem|odporucte|odporuc|produkt|produkty|krem|pletovy|plet|pokozku|serum|olej|maska|hydratacny|suchu|mastnu|citlivu|starostlivost)$/;
 const tokens=q.split(/[^\p{L}\p{N}]+/u).filter(t=>t.length>3&&!/^(sampon|sampuk|shampoo|vlas|hair|proti|rast|growth|vypad|rednut|posiln|kondicion|tonik|poko|balzam|mask)/.test(t)&&!generic.test(t)&&!/^(hydratac|regenerac|vyziv|pletov|telov|such|mastn|citliv|vrask)/.test(t));
 const byName=engine.products.filter(p=>p.available!==false).map(p=>({p,score:tokens.filter(t=>core.norm(p.name).includes(t)).length})).sort((a,b)=>b.score-a.score);
 const uniqueToken=tokens.find(t=>t.length>=6&&byName.filter(x=>core.norm(x.p.name).includes(t)).length===1);
 const specific=byName[0]?.score>=2?byName[0].p:uniqueToken?byName.find(x=>core.norm(x.p.name).includes(uniqueToken))?.p:null;
 if(/zlozen|slozen|ingredien|obsahuj/.test(q)&&specific)return 'Úplné zloženie nájdete pri '+specific.name+': '+specific.url+'.';
 const profile=/such|pnut|napjat|dehydrat/.test(profileQ)?'dry':/mast|maz|akne/.test(profileQ)?'oily':/citliv|reakt/.test(profileQ)?'sensitive':'any';
 const goal=/vypad|rednut|ridnut|posiln|podpor.*rast|podpor.*rust/.test(goalQ)&&category==='hair'?'mature':/vrask|zrel|zral|anti.?aging/.test(goalQ)?'mature':/hydrat/.test(goalQ)?'hydrate':/odlic|cisten|cisti/.test(goalQ)?'clean':'any';
 const budget=/bez limit|bez rozpo/.test(budgetQ)?undefined:budgetQ.match(/\bdo\s*(\d+(?:[.,]\d+)?)/)?.[1]?.replace(',','.');
 const currency=engine.products.find(p=>p.priceAmount)?.currency;
 if(budget&&currency==='CZK'&&/eur|€/.test(budgetQ))return 'Táto ponuka má ceny v Kč. Zadajte prosím rozpočet v Kč alebo vyberajte bez cenového limitu.';
 const answers={category:specific?.category||category,profile,goal,budget};if(category==='hair'&&/vypad|rednut|ridnut|podpor.*rast|podpor.*rust/.test(goalQ))answers.hairNeed='growth';if(category==='hair'&&/lupin|lupy/.test(q))answers.hairNeed='dandruff';
 const form=/samp|shampoo/.test(formQ)?/sampon/:/kondicion|conditioner/.test(formQ)?/kondicion/:/tonik|vlasov.*vod|oplach/.test(formQ)?/tonik|vod/:/\bkrem/.test(formQ)?/krem/:/\bserum|\bsera\b|\bserom/.test(formQ)?/ser/:/\bolej/.test(formQ)?/olej/:/\bmask/.test(formQ)?/mask/:null;
 if(form&&!specific&&!engine.categoryPool(answers).some(p=>form.test(core.norm(p.kind))))return 'Takúto formu produktu v tejto oblasti ponuky nemáme. Vyberte inú formu vo Výbere starostlivosti.';
 if(specific){answers.kind=specific.kind;}
 let rows=engine.recommend(answers).matches;if(form&&!specific)rows=rows.filter(p=>form.test(core.norm(p.kind)));
 if(specific&&rows.some(p=>p.id===specific.id))rows=[specific,...rows.filter(p=>p.id!==specific.id)];
 if(!rows.length)return 'V overenej ponuke sa nenašla táto kombinácia potrieb a rozpočtu. Skúste upraviť jednu podmienku vo Výbere starostlivosti.';
 if(/zlozen|slozen|ingredien|obsahuj/.test(q))return 'Úplné zloženie nájdete pri '+rows[0].name+': '+rows[0].url+'.';
 return rows.slice(0,2).map(p=>p.name+(p.volume&&p.volume!=='Balenie podľa e-shopu'?' ('+p.volume+')':'')+' — '+p.price+'. '+p.url).join('\n\n');
};
