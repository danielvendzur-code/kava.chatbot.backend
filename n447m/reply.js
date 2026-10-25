/* Deterministic factual draft. No network, no model call, one brand only. */
(function(g){
 'use strict';
 const E=g.N447Engine||(typeof require==='function'?require('./engine.js'):null);
 const fold=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
 function coffeeReply(d,input,history=[]){
  const q=fold(input), coffees=d.products, link=p=>p.url;
  const named=coffees.filter(p=>fold(p.name).split(/\W+/).filter(w=>w.length>4).some(w=>q.includes(w)));
  let grams=/\b(?:1000|1\s*kg|kilo)\b/.test(q)?1000:/\b250\b/.test(q)?250:/\b100\b/.test(q)?100:null;
  const prices=p=>[100,250,1000].filter(n=>!grams||n===grams).map(n=>{const v=p.variants.find(v=>v.grams===n&&v.grind==='Zrno');return E.grams(n)+' za '+E.money(v.price,'CZK')}).join('; ');
  const line=p=>p.name+': '+p.notes.join(', ')+'. '+prices(p)+'.\n'+link(p);
  if(/zdrav|tehot|kojeni|lek|diagno|chorob|alerg/.test(q))return 'Pomohu s chutí, přípravou a balením kávy. Zdravotní vhodnost pro konkrétního člověka neposuzuji. Dotazy na složení můžete ověřit u mamacoffee: '+d.brand.contact+'.';
  if(/kontakt|email|telefon/.test(q))return 'Dotazy na objednávky a zboží: '+d.brand.contact+'.\n'+d.brand.contactSource;
  if(/doprav|postovn|doruc/.test(q))return 'Zobrazený součet zahrnuje produkty. Dopravu a konečnou částku zjistíte při objednávce v e-shopu.\n'+d.brand.shopUrl;
  if(/kapsl|kapsul|nespresso/.test(q))return 'Tento průvodce zahrnuje 9 káv v balení 100 g, 250 g a 1 kg a samostatný drip sáček. Kapsle v něm nemám ověřené.\n'+d.brand.shopUrl;
  if(/bez\s*kofe|decaf/.test(q))return line(coffees.find(p=>p.decaf))+'\nPražírna ji doporučuje na espresso a moka konvičku. Nejde o posouzení zdravotní vhodnosti.';
  if(/drip.*sac|sac.*drip|na cest|bez kavovar|bez pomuc/.test(q))return d.drip.name+': 1 samostatný sáček za 45 Kč. Kakao, sušené švestky, nízká acidita. '+d.drip.brew.join(' ')+'\n'+d.drip.url;
  if(named.length>1&&/rozd|porov|nebo| vs /.test(q))return named.slice(0,2).map(p=>line(p)+'\n'+p.summary+' Zpracování: '+p.process+'.').join('\n\n');
  if(named.length===1)return line(named[0])+'\n'+named[0].summary+' Balení je zrnkové nebo lze zvolit mletí. Přesnou gramáž a mletí vyberte na produktu.';
  if(/mlet|mlyn|zrno|zrnkov/.test(q))return 'Všech 9 káv je ověřeno jako zrno i v mletí Domácí espresso, Aeropress a moka konvička, Drip - V60 a French press. Ceny těchto mletí jsou u stejné gramáže shodné. Do automatu nebo k vlastnímu mlýnku vyberte Zrno. Jakou přípravu a balení používáte?';
  if(/filtr|v60|aeropress|french/.test(q)){const tool=/french/.test(q)?'frenchpress':/aero/.test(q)?'aeropress':'v60';return coffees.filter(p=>p.preps.includes('filter')&&p.tools.includes(tool)).map(line).join('\n\n')+'\nPro V60-02 jsou volitelné filtry 100 ks za 160 Kč, pro klasický AeroPress 350 ks za 145 Kč. Do limitu započítejte i doplněk.';}
  if(/kolik|kolko|cen|stoji|balen|100|250|kilo|kg/.test(q))return (grams?coffees.map(line).join('\n\n'):'Kávy mají samostatná balení 100 g, 250 g a 1 kg. Kterou kávu a gramáž chcete ocenit?')+'\nCeny ověřeny 25. 10. 2026; doprava se dopočítá v e-shopu.';
  return 'Na espresso a moka konvičku máme čokoládové profily, na filtr ovocné kávy El Progreso, Uganda Muduku a Rwanda Nyabumera. Je tu i Colombia bez kofeinu nebo drip sáček na cesty. Jak kávu připravujete a jaké balení chcete?';
 }
 const api={coffeeReply};g.N447Reply=api;if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:window);
