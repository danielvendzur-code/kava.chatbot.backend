const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const MODEL = process.env.CHAT_MODEL || 'claude-haiku-4-5';

const DEMOS = {
  praziarnicka: {
    brand: 'Pražiarnička by Caffè Vita', web: 'https://praziarnicka.sk/eshop',
    products: [
      'Paganini blend – vyvážený espresso blend, vhodný aj do mlieka',
      'Brazil Santos – jemná 100 % arabica, čokoládová, nízka acidita',
      'Puccini blend – výraznejší blend s hustou krémou',
      'Cuba Serrano Lavado – sladká arabica s kakaom a orechmi',
      'Bezkofeínová Brazil – jemná káva bez kofeínu'
    ],
    fallback: {
      automatic:'Do automatu by som začal Paganini blendom. Je plný, čokoládovo-orieškový a dobre funguje ako každodenná káva.',
      milk:'Do cappuccina alebo latte sa hodí Paganini blend. Jeho plnšia chuť sa v mlieku nestratí.',
      filter:'Na filter skúste Brazil Santos alebo Cuba Serrano Lavado podľa toho, či chcete jemnejší alebo plnší profil. Krátky výber kávy vám ich zúži podľa chuti.',
      decaf:'Ak chcete kávu bez kofeínu, vyberte Bezkofeínovú Brazil. Je jemná a vhodná aj na večer.',
      default:'Ak chcete pokojnejšiu čokoládovú chuť, dobrým začiatkom je Brazil Santos. Cez Výber kávy ju vieme zúžiť podľa prípravy a toho, či pijete kávu s mliekom.'
    }
  },
  diamonds: {
    brand:'Diamonds Roastery', web:'https://diroastery.sk/kategoria-produktu/kava/',
    products:[
      'Peru Valley Coffee – vyvážená káva s nižšou aciditou, vhodná do automatu a na espresso',
      'Brazília Fazenda Pereira – sladká káva s čokoládovým a orieškovým smerom',
      'Keňa Mugaya AB – čistá a šťavnatá filtrovaná káva s egrešmi, černicami a jablkom',
      'Kolumbia Kumanday Reserve – menej ovocná káva s karamelom, kakaom a sladkým citrusom; espresso a automat',
      'Kolumbia El Buho Decaf – bezkofeínová omni káva s javorovým sirupom, karamelom a orieškami'
    ],
    fallback:{
      automatic:'Do automatu je dobrý východiskový bod Peru Valley Coffee. Má vyváženejší profil a nižšiu aciditu.',
      milk:'K mliečnym nápojom by som volil Brazíliu Fazenda Pereira. Sladký čokoládovo-orieškový smer zostane čitateľný aj v mlieku.',
      filter:'Na filter siahnite skôr po Keňa Mugaya AB. Je čistejšia, šťavnatejšia a ovocnejšia než espresso profily.',
      decaf:'Bez kofeínu je v ponuke Kolumbia El Buho Decaf. Má sladký karamelovo-orieškový charakter.',
      default:'Ak chcete sladšiu a menej ovocnú kávu, začnite Brazíliou Fazenda Pereira. Výber kávy potom zohľadní prípravu aj chuť, ktorú preferujete.'
    }
  },
  kaffa: {
    brand:'Kaffa Roastery', web:'https://kaffaroastery.sk/',
    products:[
      'Mokka Espresso Blend – 80 % Arabica / 20 % Robusta, kakao, mandle a lieskovce',
      'Kenya Kamundu Estate AA – filter, čierne ríbezle, malina, slivka a vanilka',
      'Colombia Finca El Diviso Decaf – Sugar Cane Decaf, vanilka, mandarínka a jazmín',
      'Mexico Finca La Esperanza – moderné espresso, marakuja, mandarínka, čokoláda a toffee',
      'Geisha Ninety Plus Stellar Origin – V60/Origami/Kalita, mango, marakuja, med a pomarančový kvet'
    ],
    guidance:['Pri Kaffa vysvetlite, že príjemná ovocnosť je šťavnatá a vyvážená, kým nepríjemná kyslosť je ostrá a rušivá.'],
    fallback:{
      automatic:'Do automatu alebo na klasické espresso je najjednoduchší štart Mokka Espresso Blend. Má sladší profil s kakaom, mandľami a lieskovcami.',
      milk:'Do mlieka sa dobre hodí Mokka Espresso Blend. Jeho kakaovo-orieškový charakter zostáva výrazný aj v cappuccine.',
      filter:'Na filter skúste Kenya Kamundu Estate AA, ak máte radi sviežejšiu ovocnosť. Má profil čiernych ríbezlí, maliny, slivky a vanilky.',
      decaf:'Bez kofeínu je Colombia Finca El Diviso Decaf. Má sladký profil s vanilkou, mandarínkou a jazmínom.',
      default:'Ak nechcete výraznú ovocnosť, začnite Mokka Espresso Blendom. Výber kávy potom rozlíši prípravu aj chuťový smer presnejšie.'
    }
  },
  vitazov: {
    brand:'Káva Víťazov', web:'https://kavavitazov.sk/obchod/',
    products:[
      'Office Blend – silná, menej kyslá káva s vyšším kofeínom',
      'Victory Blend – 100 % arabica signature blend',
      'Brazília – sladká čokoládová arabica',
      'Etiópia – svieža výberová arabica na filter',
      'Bezkofeínová – 100 % arabica bez kofeínu'
    ],
    fallback:{
      automatic:'Do automatu alebo kancelárie by som začal Office Blendom. Je silnejší, menej kyslý a navrhnutý na každodenné pitie.',
      milk:'Do mlieka sa hodí plnšia káva, ktorá sa v cappuccine nestratí. Office Blend je dobrý východiskový bod, ak chcete menej kyslosti a výraznejšie telo.',
      filter:'Na filter skúste Etiópiu. Je sviežejšia a vhodnejšia na ľahší výberový profil.',
      decaf:'Ak chcete kávu bez kofeínu, vyberte Bezkofeínovú. Výber kávy potom ešte zohľadní spôsob prípravy.',
      default:'Ak hľadáte univerzálnu kávu domov, začnite Victory Blendom. Pri kancelárii alebo automate dáva väčší zmysel Office Blend.'
    }
  },
  concept: {
    brand:'Concept Coffee Roasters', web:'https://www.conceptcoffee.sk/',
    products:[
      'Weithaga AA – Kenya – svieža káva na filter',
      'Nemba – Burundi – sladká a ovocná',
      'Gedicho – Ethiopia – kvetinová a ľahká',
      'Berry Blast – Colombia – výrazný bobuľový profil',
      'Summerjam – Colombia – sladká sezónna káva'
    ],
    fallback:{
      automatic:'Ak chcete espresso, nechajte si výber zúžiť podľa aktuálnej sezónnej ponuky a chuťového smeru. Concept pracuje so sezónnymi kávami, preto je spôsob prípravy dôležitý.',
      milk:'K mlieku vyberajte plnší a sladší profil namiesto najľahšieho filtra. Výber kávy ho zúži podľa aktuálnej sezónnej ponuky.',
      filter:'Na filter je dobrým smerom Weithaga AA – Kenya, ak máte radi sviežejšiu kávu. Pri ovocnejšom profile sa oplatí porovnať aj ďalšie sezónne loty.',
      decaf:'Pri bezkofeínovej voľbe odporúčam overiť aktuálnu sezónnu ponuku Conceptu. Poradca vás nasmeruje bez vymýšľania nedostupného produktu.',
      default:'Ak máte radi ovocnejšiu a sviežu kávu, začnite Weithaga AA – Kenya. Cez Výber kávy sa dá výsledok spresniť podľa prípravy.'
    }
  },
  jolka: {
    brand:'Pražiareň Jolka', web:'https://www.praziarenjolka.sk/eshop-kava/',
    products:[
      'Zmes Jolka – house blend s 20 % robusty, čokoláda a orechy, minimálna acidita, vhodná do mlieka aj ako espresso',
      'Zmes Čokoláda – house blend s 30 % robusty, čokoláda, orechy a hustá kréma, takmer žiadna acidita',
      '9-to-Fine – office blend s vyšším podielom robusty, krémová čokoládovo-oriešková chuť, minimálna acidita, ideálny do automatu',
      'Horké zlato – plná horkosladká chuť a bohatá pena bez ovocnej kyslosti',
      'Brazil Cerrado Doce Diamantina – 100 % arabica, veľmi nízka acidita, čokoláda, karamel a lieskové oriešky',
      'Ethiopia SIDAMO GR.2 – 100 % arabica, citrusová acidita, jazmín a bergamot, na filter',
      'Vietnam Lang Biang Anaerobic Natural – tropické ovocie a vínna dochuť, na V60 a Chemex',
      'DECAF Etiópia – bezkofeínová 100 % arabica, nízka acidita, jahody, čučoriedky a mliečna čokoláda'
    ],
    notes:['El Salvador SHG EP je momentálne vypredaný, neodporúčajte ho.'],
    fallback:{
      automatic:'Do automatu sa hodí 9-to-Fine, ak chcete plnšiu čokoládovo-orieškovú kávu s minimálnou aciditou. Pri jemnejšom profile je dobrý smer Zmes Jolka.',
      milk:'Do mlieka sa dobre hodí Zmes Jolka. Čokoládovo-orieškový profil zostáva čitateľný aj v cappuccine alebo latte.',
      filter:'Na filter je vhodná Ethiopia SIDAMO GR.2, ak chcete citrusovejšiu a kvetinovú kávu. Pri tropickejšom profile skúste Vietnam Lang Biang Anaerobic Natural.',
      decaf:'Bez kofeínu je DECAF Etiópia. Má nízku aciditu a sladší profil s jahodami, čučoriedkami a mliečnou čokoládou.',
      default:'Ak chcete minimum acidity a klasickú sladšiu chuť, začnite Zmesou Jolka. Výber kávy potom zohľadní prípravu aj to, či ju pijete s mliekom.'
    }
  }
};

function setCors(req,res){
  const origin=req.headers.origin||'';
  const allowed=origin===''||/(^https:\/\/([a-z0-9-]+\.)?mojchatbot\.sk$)|(^https:\/\/.*\.vercel\.app$)|(^http:\/\/localhost:\d+$)|(^http:\/\/127\.0\.0\.1:\d+$)/i.test(origin);
  res.setHeader('Access-Control-Allow-Origin',allowed&&origin?origin:'https://mojchatbot.sk');
  res.setHeader('Vary','Origin');
  res.setHeader('Access-Control-Allow-Methods','POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers','Content-Type');
}

function deterministicReply(demo,latest){
  const q=String(latest||'').toLocaleLowerCase('sk');
  if(/bez\s*kofe|decaf|večer/.test(q)) return demo.fallback.decaf;
  if(/filter|v60|chemex|french|aeropress|ovoc|sviež/.test(q)) return demo.fallback.filter;
  if(/mliek|capp|latte|flat\s*white/.test(q)) return demo.fallback.milk;
  if(/automat|kancel|office|firma/.test(q)) return demo.fallback.automatic;
  return demo.fallback.default;
}

export default async function handler(req,res){
  setCors(req,res);
  res.setHeader('Cache-Control','no-store');
  if(req.method==='OPTIONS') return res.status(204).end();
  if(req.method!=='POST') return res.status(405).json({error:'Method not allowed'});

  let body={};
  try{body=typeof req.body==='string'?JSON.parse(req.body):(req.body||{});}catch{return res.status(400).json({error:'Invalid body'});}
  const demo=DEMOS[String(body.demoId||'')];
  if(!demo) return res.status(400).json({error:'Unknown demo'});
  const messages=Array.isArray(body.messages)?body.messages
    .filter((m)=>m&&(m.role==='user'||m.role==='assistant'))
    .slice(-10)
    .map((m)=>({role:m.role,content:String(m.content||'').slice(0,700)}))
    .filter((m)=>m.content.trim()):[];
  const latest=messages.filter((m)=>m.role==='user').at(-1)?.content||'';
  if(!latest) return res.status(400).json({error:'Missing user message'});
  const fallback=()=>res.status(200).json({reply:deterministicReply(demo,latest),fallback:true});

  if(!ANTHROPIC_API_KEY) return fallback();

  const system=[
    `Ste stručný online kávový poradca pre ${demo.brand}.`,
    'Odpovedajte jednoduchou a gramaticky správnou slovenčinou. Napíšte presne dve krátke vety.',
    'Používajte vykanie bez rodových tvarov. Odpoveď neukončujte otázkou ani výzvou na ďalšiu konverzáciu.',
    'Odporučiť môžete iba presný názov produktu zo zoznamu Overené produkty. Nikdy nevymýšľajte názvy, fakty, ceny ani kontakty.',
    'Vhodnosť na automat, espresso, filter, mlieko alebo bezkofeínovú voľbu spomeňte iba vtedy, keď je priamo uvedená pri produkte.',
    'Ak otázku nemožno zodpovedať z údajov nižšie, povedzte to a odporučte chuťový výber alebo oficiálny e-shop.',
    ...(demo.guidance||[]),
    `Oficiálny e-shop: ${demo.web}`,
    `Overené produkty:\n- ${demo.products.join('\n- ')}`,
    ...(demo.notes?.length?[`Ďalšie overené informácie:\n- ${demo.notes.join('\n- ')}`]:[])
  ].join('\n\n');

  try{
    const apiResponse=await fetch('https://api.anthropic.com/v1/messages',{
      method:'POST',
      headers:{'content-type':'application/json','x-api-key':ANTHROPIC_API_KEY,'anthropic-version':'2023-06-01'},
      body:JSON.stringify({model:MODEL,max_tokens:170,temperature:0,system,messages})
    });
    if(!apiResponse.ok){console.error('Anthropic API error',apiResponse.status,await apiResponse.text());return fallback();}
    const data=await apiResponse.json();
    const reply=Array.isArray(data.content)?data.content.filter((b)=>b.type==='text').map((b)=>b.text).join('').trim():'';
    const clean=reply.replace(/[\u002a_\u0060#]/g,'').replace(/\s+/g,' ').trim();
    if(!clean) return fallback();
    return res.status(200).json({reply:clean});
  }catch(error){
    console.error('coffee chat provider error',error);
    return fallback();
  }
}
