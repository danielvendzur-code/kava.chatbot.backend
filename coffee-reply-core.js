/* One deterministic reply core for the coffee chat, shared by the API and the browser fallback.
   Product answers come only from the shop catalogue (name, price, link, stock). General coffee
   questions get a short factual answer instead of a product list; health questions are declined. */
(()=>{const norm=v=>String(v||'').normalize('NFD').replace(/\p{Diacritic}/gu,'').toLowerCase();
const HEALTH=/liec|vyliec|lecb|lecit|tehot|dojc|kojen|chorob|nemoc|zdrav|\bliek|\blek[uy]?\b|reflux|zalud|zalou?d|paleni zahy|palenie zahy|srdc|hypertenz|(?:vysok|nizk|krvn)\w*\s+tlak|tlak\w*\s+krv|cukrovk|diabet|\bdet(?:i|om|em|sk)|\bdieta\b|\bdite\b|alerg|migren|nespav|uzkos|chudn|hubnu|diet[ae]\b/;
const SERVICE=/doprav|platb|doruc|reklam|vraten|vracen|postovn|otvarac|oteviraci|kontakt|predajn|prodejn|osobn\w* odber|faktur/;
const ASK=/\brozdiel|\brozdil|\bco je\b|\bco su\b|\bco jsou\b|\bco znamena|\bako (?:sa )?(?:priprav|uvar|varit|robi|urob|sklad|uchov|mlie|pomlie|namlie|dlho)|\bjak (?:se )?(?:priprav|uvar|varit|dela|udela|sklad|uchov|mlit|namlit|dlouho)|teplot|kolko gramov|kolik gramu|\bpomer\b|hrubost|\bpreco\b|\bproc\b|recept|navod|\bpostup|kolko kofein|kolik kofein|obsah kofein/;
const TOPICS=[
 ['caffeine',q=>/kolko kofein|kolik kofein|obsah kofein|viac kofein|vic kofein/.test(q)],
 ['species',q=>/arabi/.test(q)&&/robust/.test(q)],
 ['frenchpress',q=>/french|frenc|\bpress/.test(q)],
 ['aeropress',q=>/aeropress/.test(q)],
 ['coldbrew',q=>/cold brew|coldbrew|studen\w* (?:kav|luh)/.test(q)],
 ['moka',q=>/\bmok[ae]|bialet/.test(q)],
 ['espresso',q=>/espress|pakov/.test(q)&&!/rozdiel|rozdil/.test(q)],
 ['filter',q=>/filt|v60|chemex|prekap|prekvap/.test(q)],
 ['grind',q=>/mlet|mlit|hrubost|mlyn/.test(q)],
 ['storage',q=>/skladov|uchov|cerstv|trvanliv|vydrzi/.test(q)],
 ['decaf',q=>/bez\s*kof|bezkof|decaf/.test(q)],
 ['acidity',q=>/acidit|kysl/.test(q)],
 ['processing',q=>/\bpran|washed|natural|spracovan|zpracovan/.test(q)],
 ['blend',q=>/single|jednodruh|\bzmes|\bsmes|blend/.test(q)],
 ['roast',q=>/prazen|svetl|tmav/.test(q)],
 ['temperature',q=>/teplot/.test(q)]
];
const KNOW={sk:{
 species:'Arabika má jemnejšiu, sladšiu a aromatickejšiu chuť s vyššou aciditou a menej kofeínu. Robusta je výraznejšia a horkejšia, má približne dvojnásobok kofeínu a v espresse dáva hustejšiu crému.',
 frenchpress:'Do french pressu použite hrubo mletú kávu, približne 30 g na 500 ml vody. Zalejte vodou tesne pod bodom varu (okolo 93–96 °C), nechajte 4 minúty lúhovať a pomaly stlačte piest.',
 aeropress:'V AeroPresse skúste 15 g stredne jemne mletej kávy na 220–250 ml vody s teplotou 85–95 °C. Premiešajte, nechajte 1,5–2 minúty a pomaly pretlačte.',
 coldbrew:'Cold brew sa pripravuje z hrubo mletej kávy a studenej vody v pomere približne 1:8 až 1:10 a lúhuje sa 12–18 hodín v chladničke. Potom ho prefiltrujte; v chladničke vydrží niekoľko dní.',
 moka:'Do moka kanvičky dajte stredne jemne mletú kávu, o niečo hrubšiu než na espresso, a sitko naplňte bez utláčania. Do spodnej časti nalejte horúcu vodu po ventil, varte na miernom ohni a odstavte, keď káva začne prskať.',
 espresso:'Na espresso sa melie najemno: zhruba 18 g kávy na dvojitú dávku a 36–40 g nápoja za 25–30 sekúnd. Ak tečie prirýchlo a chutí kyslo, meľte jemnejšie; ak tečie pomaly a chutí horko, meľte hrubšie.',
 filter:'Na filter (V60, prekvapkávač) sa bežne používa voda s teplotou 92–96 °C a približne 15 g kávy na 250 ml vody. Mletie je stredné a celá príprava trvá zvyčajne 2,5–3,5 minúty; svetlejšie praženia znesú teplejšiu vodu.',
 grind:'Hrubosť mletia sa riadi prípravou: espresso najemno, moka o niečo hrubšie, filter a AeroPress stredne, french press a cold brew nahrubo. Najlepšiu chuť dá káva pomletá tesne pred prípravou.',
 storage:'Kávu skladujte vo vzduchotesnom obale v suchu, v tme a pri izbovej teplote, nie v chladničke. Zrnková káva chutí najlepšie približne do 1–3 mesiacov od praženia, mletá stráca arómu výrazne rýchlejšie.',
 caffeine:'Obsah kofeínu závisí najmä od druhu kávy a veľkosti porcie: robusta ho má približne dvakrát viac než arabika. Šálka filtrovanej kávy má zvyčajne viac kofeínu než jedno espresso, pretože je väčšia.',
 decaf:'Bezkofeínová káva je bežná káva, z ktorej bola pred pražením odstránená väčšina kofeínu; zostáva v nej len malé zvyškové množstvo. Chuťou býva o niečo jemnejšia.',
 acidity:'Acidita v káve znamená sviežu, ovocnú alebo citrusovú chuť, nie pokazenú kyslosť. Výraznejšia býva pri svetlejšie pražených arabikách, nižšia pri tmavších praženiach a zmesiach s robustou.',
 processing:'Pri praní (washed) sa dužina pred sušením odstráni, káva býva čistejšia a sviežejšia. Pri suchom spracovaní (natural) schne zrno v celej čerešni, čo dáva sladšiu a ovocnejšiu chuť.',
 blend:'Jednodruhová káva (single origin) pochádza z jednej krajiny alebo farmy a ukazuje jej typickú chuť. Zmes (blend) kombinuje viac káv pre vyváženú a stabilnú chuť, často na espresso.',
 roast:'Svetlé praženie zachováva ovocnosť a aciditu zrna a hodí sa najmä na filter. Tmavšie praženie je horkejšie, plnšie a čokoládovejšie a používa sa hlavne na espresso a do mlieka.',
 temperature:'Kávu zalievajte vodou s teplotou približne 90–96 °C, nie vriacou. Svetlejšie praženia znesú teplejšiu vodu, tmavšie chutia lepšie pri nižšej teplote.',
 unknown:'Na túto otázku nemám overenú odpoveď. Rád pomôžem s výberom kávy podľa prípravy, chuti alebo rozpočtu; ostatné informácie nájdete v oficiálnom obchode: ',
 health:'Zdravotnú vhodnosť neposudzujem, to patrí lekárovi. Kávu vám rád vyberiem podľa chuti a prípravy.',
 service:'Aktuálne podmienky nájdete v oficiálnom obchode: ',
 currency:'Táto ponuka má ceny v inej mene. Zadajte prosím rozpočet v mene e-shopu.',
 none:'Pre túto kombináciu nemám v ponuke overenú kávu. Skúste upraviť jednu podmienku alebo pozrite celú ponuku: ',
 clarify:'Rád pomôžem s výberom. Napíšte, ako kávu pripravujete (espresso, filter, automat), akú chuť máte radi alebo aký máte rozpočet.',
 fits:'Z ponuky sa na túto prípravu hodí: ',lead:'Z ponuky vyberám',start:'Na začiatok z ponuky:',unusual:'Z menej tradičných káv v ponuke:',gear:'V ďalšej ponuke obchodu som našiel:',noGear:'Takýto produkt v overenej ponuke nevidím. Celú ponuku nájdete v obchode: ',
 size:s=>'Pre balenie '+s+' nemám overenú cenu dostupnej kávy spĺňajúcej vaše podmienky. Veľkosti a ceny overte na stránke produktu: ',
 from:'Ceny „od“ platia pre najmenšie balenie; ostatné veľkosti sú na stránke produktu.',
 labels:{filter:'filter',automat:'automat',moka:'moka',lever:'espresso',decaf:'bez kofeínu',fruity:'ovocná chuť',chocolate:'čokoládová chuť',lowAcid:'nízka acidita',milk:'do mlieka',budget:'do '}
},cs:{
 species:'Arabika má jemnější, sladší a aromatičtější chuť s vyšší aciditou a méně kofeinu. Robusta je výraznější a hořčí, má přibližně dvojnásobek kofeinu a v espressu dává hustší cremu.',
 frenchpress:'Do french pressu použijte hrubě mletou kávu, přibližně 30 g na 500 ml vody. Zalijte vodou těsně pod bodem varu (kolem 93–96 °C), nechte 4 minuty louhovat a pomalu stlačte píst.',
 aeropress:'V AeroPressu zkuste 15 g středně jemně mleté kávy na 220–250 ml vody o teplotě 85–95 °C. Promíchejte, nechte 1,5–2 minuty a pomalu protlačte.',
 coldbrew:'Cold brew se připravuje z hrubě mleté kávy a studené vody v poměru přibližně 1:8 až 1:10 a louhuje se 12–18 hodin v lednici. Potom ho přefiltrujte; v lednici vydrží několik dní.',
 moka:'Do moka konvičky dejte středně jemně mletou kávu, o něco hrubší než na espresso, a sítko naplňte bez utlačování. Do spodní části nalijte horkou vodu po ventil, vařte na mírném ohni a odstavte, když káva začne prskat.',
 espresso:'Na espresso se mele najemno: zhruba 18 g kávy na dvojitou dávku a 36–40 g nápoje za 25–30 sekund. Pokud teče příliš rychle a chutná kysele, melte jemněji; pokud teče pomalu a chutná hořce, melte hruběji.',
 filter:'Na filtr (V60, překapávač) se běžně používá voda o teplotě 92–96 °C a přibližně 15 g kávy na 250 ml vody. Mletí je střední a celá příprava trvá obvykle 2,5–3,5 minuty; světlejší pražení snesou teplejší vodu.',
 grind:'Hrubost mletí se řídí přípravou: espresso najemno, moka o něco hrubší, filtr a AeroPress středně, french press a cold brew nahrubo. Nejlepší chuť dá káva namletá těsně před přípravou.',
 storage:'Kávu skladujte ve vzduchotěsném obalu v suchu, ve tmě a při pokojové teplotě, ne v lednici. Zrnková káva chutná nejlépe přibližně do 1–3 měsíců od pražení, mletá ztrácí aroma výrazně rychleji.',
 caffeine:'Obsah kofeinu závisí hlavně na druhu kávy a velikosti porce: robusta ho má přibližně dvakrát více než arabika. Šálek filtrované kávy má obvykle více kofeinu než jedno espresso, protože je větší.',
 decaf:'Bezkofeinová káva je běžná káva, ze které byla před pražením odstraněna většina kofeinu; zůstává v ní jen malé zbytkové množství. Chutí bývá o něco jemnější.',
 acidity:'Acidita v kávě znamená svěží, ovocnou nebo citrusovou chuť, ne zkaženou kyselost. Výraznější bývá u světleji pražených arabik, nižší u tmavších pražení a směsí s robustou.',
 processing:'Při praní (washed) se dužina před sušením odstraní, káva bývá čistší a svěžejší. Při suchém zpracování (natural) schne zrno v celé třešni, což dává sladší a ovocnější chuť.',
 blend:'Jednodruhová káva (single origin) pochází z jedné země nebo farmy a ukazuje její typickou chuť. Směs (blend) kombinuje více káv pro vyváženou a stabilní chuť, často na espresso.',
 roast:'Světlé pražení zachovává ovocnost a aciditu zrna a hodí se hlavně na filtr. Tmavší pražení je hořčí, plnější a čokoládovější a používá se hlavně na espresso a do mléka.',
 temperature:'Kávu zalévejte vodou o teplotě přibližně 90–96 °C, ne vroucí. Světlejší pražení snesou teplejší vodu, tmavší chutnají lépe při nižší teplotě.',
 unknown:'Na tuto otázku nemám ověřenou odpověď. Rád pomohu s výběrem kávy podle přípravy, chuti nebo rozpočtu; ostatní informace najdete v oficiálním obchodě: ',
 health:'Zdravotní vhodnost neposuzuji, to patří lékaři. Kávu vám rád vyberu podle chuti a přípravy.',
 service:'Aktuální podmínky najdete v oficiálním obchodě: ',
 currency:'Tato nabídka má ceny v jiné měně. Zadejte prosím rozpočet v měně e-shopu.',
 none:'Pro tuto kombinaci nemám v nabídce ověřenou kávu. Zkuste upravit jednu podmínku nebo se podívejte na celou nabídku: ',
 clarify:'Rád pomohu s výběrem. Napište, jak kávu připravujete (espresso, filtr, automat), jakou chuť máte rádi nebo jaký máte rozpočet.',
 fits:'Z nabídky se na tuto přípravu hodí: ',lead:'Z nabídky vybírám',start:'Na začátek z nabídky:',unusual:'Z méně tradičních káv v nabídce:',gear:'V další nabídce obchodu jsem našel:',noGear:'Takový produkt v ověřené nabídce nevidím. Celou nabídku najdete v obchodě: ',
 size:s=>'Pro balení '+s+' nemám ověřenou cenu dostupné kávy splňující vaše podmínky. Velikosti a ceny ověřte na stránce produktu: ',
 from:'Ceny „od“ platí pro nejmenší balení; ostatní velikosti jsou na stránce produktu.',
 labels:{filter:'filtr',automat:'automat',moka:'moka',lever:'espresso',decaf:'bez kofeinu',fruity:'ovocná chuť',chocolate:'čokoládová chuť',lowAcid:'nízká acidita',milk:'do mléka',budget:'do '}
}};
const TOPIC_PREP={frenchpress:'filter',aeropress:'filter',filter:'filter',espresso:'lever',moka:'moka'};
const classify=text=>{const q=norm(text);if(HEALTH.test(q))return{kind:'health'};if(SERVICE.test(q))return{kind:'service'};
 const species=/arabi/.test(q)&&/robust/.test(q)&&!/\b(?:do|max)\s*\d/.test(q)&&/\?|rozdiel|rozdil|alebo|nebo|\bvs\b|versus/.test(q);
 if(ASK.test(q)||species){const topic=TOPICS.find(([,test])=>test(q))?.[0];return{kind:'general',topic:topic||null};}
 return{kind:'product'};};
const money=v=>String(v||'').replace(/(\d),(\d)(?!\d)/g,'$1,$20');
const line=p=>p.name+(p.priceUnit&&!/^balenie$|podla e-shopu|podle e-shopu|viac baleni|vice baleni/.test(norm(p.priceUnit))?' ('+p.priceUnit+')':'')+' — '+money(p.price)+'. '+p.url;
globalThis.CXCoffeeReplyKind=text=>classify(text);
globalThis.CXCoffeeReplyCore=(c,text,history=[])=>{
 const q=norm(text),cs=/\.cz(?:\/|$)/.test(c.source||''),T=KNOW[cs?'cs':'sk'],kind=classify(text);
 const beans=c.products.filter(p=>p.available!==false&&(!p.kind||p.kind==='Káva'));
 const requestedName=q.match(/(?:mate|predavate|prodavate)\s+produkt\s+(.+?)\??$/)?.[1];if(requestedName&&!/^(?:na|pre|pro)\b/.test(requestedName)&&!c.products.some(p=>norm(p.name).includes(requestedName.replace(/\?$/,''))))return 'Takýto produkt v overenej ponuke nemám. Upresnite prosím jeho názov.';

 if(kind.kind==='health')return T.health;
 if(kind.kind==='service'){
  if(/doprav|doruc|dorucen|postovn|zasiel|zasil|dobier|dobirk/.test(q)&&Array.isArray(c.shipping?.lines)&&c.shipping.lines.length)
   return c.shipping.lines.join('\n\n');
  return T.service+c.source;
 }
 if(kind.kind==='general'){if(!kind.topic)return T.unknown+c.source;const prep=TOPIC_PREP[kind.topic],fit=prep?beans.filter(p=>(p.prep?.[prep]||0)>=.6).sort((a,b)=>(b.prep[prep]-a.prep[prep])||(a.priceAmount??Infinity)-(b.priceAmount??Infinity))[0]:null;return T[kind.topic]+(fit?'\n\n'+T.fits+line(fit):'');}
 /* Earlier general or health questions are not product conditions. */
 const texts=[...history.filter(m=>m?.role==='user').map(m=>m.content).filter(t=>classify(t).kind==='product').map(norm),q],recent=rx=>texts.slice().reverse().find(t=>rx.test(t))||q;
 const cafQ=recent(/kof|decaf/),prepQ=recent(/filtr|filter|v60|chemex|aeropress|french|frenc|automat|moka|espresso|pakov/),tasteQ=recent(/ovoc|fruity|cokol|chocol/),acidQ=recent(/kys|acid/),milkQ=recent(/mliek|mlie|mlek|cierna|cernou|cappucc|latte/),budgetQ=recent(/(?:do|max|rozpocet)\s*\d|bez limit|bez rozpo/);
 const tokens=q.split(/[^a-z0-9]+/).filter(t=>t.length>2&&!['chcem','chci','hladam','hledam','prosim','kavu','kava','kavy','coffee','produkt','produkty','mate','ponuke','nabidce','nieco','neco','eur','czk','max','automatu','automat','filter','filtr','espresso','bez','kofeinu','odporucte','doporucte','poradte'].includes(t)&&!/^\d+(?:kg|g)?$/.test(t));
 const wantsDecaf=/bez\s*kof|bezkof|decaf/.test(cafQ),prep=/filtr|filter|v60|chemex|aeropress|french|frenc/.test(prepQ)?'filter':/automat/.test(prepQ)?'automat':/\bmoka\b/.test(prepQ)?'moka':/espresso|pakov|pakovy/.test(prepQ)?'lever':null;
 const taste=/ovoc|fruity/.test(tasteQ)&&!/bez\s*ovoc/.test(tasteQ)?'fruity':/cokol|chocol/.test(tasteQ)?'chocolate':null;
 const lowAcid=/bez\s*kys|nekys|nizk.*(?:kys|acid)|jemn.*acid/.test(acidQ),milk=/s mlie|do mlie|s mlek|do mlek|cappucc|latte/.test(milkQ);
 const budget=/bez limit|bez rozpo/.test(budgetQ)?null:budgetQ.match(/(?:do|max|rozpocet)\s*(\d+(?:[.,]\d+)?)\s*(€|eur|kc|czk)?/),amount=budget?Number(budget[1].replace(',','.')):null;
 const currency=budget?(/kc|czk/.test(budget[2]||'')?'CZK':/€|eur/.test(budget[2]||'')?'EUR':c.products[0]?.currency):null;
 if(currency&&c.products.some(p=>p.currency!==currency))return T.currency;
 const packQ=recent(/\d+(?:[.,]\d+)?\s*(?:kg|kilo|g\b|gram)|\bkilo|balenie nerozhoduje|baleni nerozhoduje|ak[eé]ko[lľ]vek balenie|libovolne baleni/);
 const sizeMatch=packQ.match(/(\d+(?:[.,]\d+)?)\s*(kg|kilo|g\b|gram)/),grams=sizeMatch?Math.round(Number(sizeMatch[1].replace(',','.'))*(/k/.test(sizeMatch[2])?1000:1)):/\bkilo(?:gram|vk|ve|ove)?\w*/.test(packQ)?1000:null;
 const sizeLabel=grams?(grams>=1000&&grams%1000===0?grams/1000+' kg':grams+' g'):'',sizeRx=grams?(grams%1000===0?new RegExp('(?:^|\\D)(?:'+grams/1000+'\\s*kg|'+grams+'\\s*g)'):new RegExp('(?:^|\\D)'+grams+'\\s*g')):null;
 const hasSize=p=>sizeRx.test(norm([p.name,p.priceUnit,p.weights].join(' ')));
 const priced=p=>amount===null||(Number.isFinite(p.priceAmount)&&p.priceAmount<=amount);
 const eligible=p=>(!wantsDecaf||p.decaf)&&(!prep||(p.prep?.[prep]||0)>=.6)&&(!taste||(p.taste?.[taste]||0)>=.6)&&(!lowAcid||(Number.isFinite(p.acidity)&&p.acidity<=1))&&(!milk||(p.drink?.milk||0)>=.6)&&priced(p);
 const score=p=>tokens.filter(t=>norm(p.name+' '+(p.notes||[]).join(' ')).includes(t)).length;
 const beansForBrewer=/kav[auy]\b.*(?:do|na|pre|pro)\s+(?:french|aeropress|chemex|hario|moka|konvic|kanvic)/.test(q);
 const gearIntent=!beansForBrewer&&(/mlynce|mlyne|mlynk|filtre|papierov.*filter|papirov.*filtr|hario|chemex|french press|aeropress|tamper|konvic|kanvic|doza|hrnce|hrnek|salk|odmerk|cascara|\bknih|cisti|poukaz|doplnk|prislusenstv|degusta|balicek|predplat|\bpohar|\btask|\bkurz|\bflas|sitko|lievik|vzork/.test(q)||/kavovar/.test(q)&&!/(?:do|pre|pro)\s+kavovar/.test(q));
 if(gearIntent){const gear=(c.offer||[]).filter(p=>p.kind!=='Káva'&&p.available!==false&&priced(p)&&(score(p)>0||/doplnk|prislusenstv/.test(q))).sort((a,b)=>score(b)-score(a)||(amount>0&&!/lacn|levn/.test(q)?(b.priceAmount??-Infinity)-(a.priceAmount??-Infinity):(a.priceAmount??Infinity)-(b.priceAmount??Infinity)));if(gear.length)return T.gear+'\n\n'+gear.slice(0,3).map(line).join('\n\n');return T.noGear+c.source;}
 const conditions=[prep&&T.labels[prep],taste&&T.labels[taste],wantsDecaf&&T.labels.decaf,lowAcid&&T.labels.lowAcid,milk&&T.labels.milk,amount!==null&&T.labels.budget+budget[1]+' '+(currency==='CZK'?'Kč':'€'),grams&&sizeLabel].filter(Boolean);
 let list=beans.filter(eligible);
 const namedCandidates=beans.filter(p=>tokens.length&&tokens.every(t=>norm(p.name).includes(t)));
 const named=namedCandidates.filter(eligible);
 if(namedCandidates.length){if(!named.length)return T.none+c.source;list=named;}
 const adventurous=/netradic|zaujimav|zajimav|nezvycajn|neobvykl|special|experiment|vyberov/.test(q),asksAdvice=/odporuc|doporuc|porad|nieco|neco|\btip|najlep|nejlep|oblub|oblib|predavan|prodavan|ponuk|nabid|sortiment|ake mate|jake mate/.test(q);
 if(!conditions.length&&!named.length&&!adventurous&&!asksAdvice&&!list.some(p=>score(p)>0))return T.clarify;
 if(!list.length)return T.none+c.source;
 list.sort((a,b)=>score(b)-score(a)||(adventurous?(b.explore||0)-(a.explore||0):0)||((b.notes||[]).length>0)-((a.notes||[]).length>0)||(amount>0&&!/lacn|levn/.test(q)?(b.priceAmount??-Infinity)-(a.priceAmount??-Infinity):(a.priceAmount??Infinity)-(b.priceAmount??Infinity)));
 // A parent “from” price is not the verified price of the requested pack.
 // Never label a cheap small-pack offer as a matching kilogram recommendation.
 let sizeNote='';if(grams){const sized=list.filter(p=>hasSize(p)&&!/^od /i.test(p.price||'')&&!p.source?.priceFrom);if(!sized.length)return T.size(sizeLabel)+c.source;list=sized;}
 const shown=list.slice(0,3),fromNote=(amount!==null||grams)&&!sizeNote&&shown.some(p=>/^od /i.test(p.price||'')||p.source?.priceFrom)?T.from:'';
 return (conditions.length?T.lead+' ('+conditions.join(', ')+'):':named.length?'':adventurous?T.unusual:T.start)+(conditions.length||!named.length?'\n\n':'')+shown.map(line).join('\n\n')+(sizeNote||fromNote?'\n\n'+(sizeNote||fromNote):'');
};})();
