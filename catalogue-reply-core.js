/* Browser and API use the same catalogue and category boundaries. */
globalThis.CXCatalogueReplyCore = (catalogues,slug,text) => {
  const catalogue=catalogues[slug];if(!catalogue)return null;
  const norm=v=>String(v).normalize('NFD').replace(/\p{Diacritic}/gu,'').toLowerCase();const q=norm(text);
  if(/\bliec|vyliec|chorob|ekzem|rosacea|dermatit|\bliek\b/.test(q))return 'Otázku liečby kožného ochorenia riešte s lekárom. Môžem vám ukázať kozmetické produkty a odkazy na ich úplné zloženie.';
  const category=/brad(?:u|a|y)\b|vous/.test(q)?'beard':/detsk|deti|dieta|babat|baby|bradavk/.test(q)?'baby':/\bocny\b|\bocne\b|okolie oci/.test(q)?'eyes':/pery|rty|balzam na per/.test(q)?'lips':/svieck|svick|bytov|vone do dom/.test(q)?'home':/caj/.test(q)?'tea':/vlas|samp|kondicion/.test(q)?'hair':/telov|telo|mydl|deodor|sprch|kupel|nohy|ruky|masaz/.test(q)?'body':/sad[auy]|balicek|balick/.test(q)?'sets':'face';
  const terms=q.split(/\W+/).filter(w=>w.length>3);const desired=[];
  for(const [tag,pattern] of Object.entries({dry:/such|pnut|dehyd/,oily:/mast|lesk|maz|akne/,sensitive:/citliv|reakt/,mature:/zrel|vrask/,hydrate:/hydrat/,cream:/krem/,serum:/serum/,oil:/olej/,mask:/mask/}))if(pattern.test(q))desired.push(tag);
  const rank=p=>terms.reduce((s,w)=>s+Number(norm(p.name+' '+p.kind).includes(w)),0)+desired.reduce((s,t)=>s+Number(p.tags.includes(t))*5,0);
  const rows=catalogue.products.filter(p=>p.category===category&&(!p.isSample||/vzork|sample|mini/.test(q))).sort((a,b)=>rank(b)-rank(a));
  if(!rows.length)return 'V tejto kategórii ukážka nemá overený širší sortiment. Aktuálnu ponuku nájdete v oficiálnom e-shope značky.';
  if(/zlozen|ingredien|obsahuj/.test(q))return `Úplné zloženie nájdete pri ${rows[0].name}: ${rows[0].url}.`;
  return rows.slice(0,2).map(p=>`${p.name}${p.volume?' ('+p.volume+')':''} — ${p.price}. ${p.url}`).join('\n\n')+'\n\nĎalšie produkty sú vo Výbere a v Ponuke. Aktuálnu dostupnosť potvrďte v e-shope.';
};
