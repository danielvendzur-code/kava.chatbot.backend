const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const MODEL = process.env.CHAT_MODEL || 'claude-haiku-4-5';

const DEMOS = {
  mylo:{brand:'mylo',web:'https://www.mylo.sk/',products:['Hydratačný krém RUŽA A KONOPE','Pleťový olej AKO VÁNOK','Ceramidový krém s vitamínmi RADOSŤ','Hydratačné sérum INOVAŤ'],fallback:{dry:'Pri suchej alebo napnutej pleti je dobrý smer Hydratačný krém RUŽA A KONOPE. Krátky výber ešte zohľadní, či chcete krém, sérum alebo olej.',oily:'Pri vyššej tvorbe mazu sa pozrite na Pleťový olej AKO VÁNOK. Výber starostlivosti ešte zohľadní vašu hlavnú prioritu.',sensitive:'Pri citlivejšej pleti by som začal jemnejším smerom Ceramidový krém s vitamínmi RADOSŤ. Ak pleť výrazne alebo dlhodobo reaguje, vhodnosť kozmetiky konzultujte s odborníkom.',mature:'Ak chcete výživnejšiu starostlivosť, Ceramidový krém s vitamínmi RADOSŤ je rozumný smer. Výber potom zohľadní aj preferovanú textúru.',default:'Ak neviete, kde začať, prejdite Výber starostlivosti. Štyri krátke kroky zúžia ponuku mylo na konkrétny produkt.'}},
  ponio:{brand:'ponio',web:'https://ponio.sk/',products:['Vanilka & kokos – pleťový krém','Healthy aging – pleťový krém','Lumina shield – denný ochranný pleťový krém','Ružová voda Hanus 250 ml'],fallback:{dry:'Pri suchej pleti je jednoduchý smer Vanilka & kokos – pleťový krém. Výber ešte zohľadní, či chcete iba jeden produkt alebo viac krokov.',oily:'Pri mastnejšej pleti odporúčam najprv zúžiť výber podľa priority a textúry. Poradca nebude hádať produkt, ktorý nemá pre tento profil dostatok podkladov.',sensitive:'Pri citlivejšej pleti je vhodné držať rutinu jednoduchú; ako doplnkový krok sa dá pozrieť na Ružová voda Hanus 250 ml. Pri výraznej reakcii pokožky je vhodná konzultácia s odborníkom.',mature:'Pre zrelšiu pleť je z ponuky jasný smer Healthy aging – pleťový krém. Výber ešte rozlíši, či chcete jednoduchú alebo kompletnú rutinu.',default:'Ak chcete jeden praktický denný produkt, pozrite Lumina shield – denný ochranný pleťový krém. Výber starostlivosti vie odporúčanie spresniť.'}},
  two:{brand:'two cosmetics',web:'https://www.twocosmetics.sk/',products:['Krém pre citlivú pleť','Krém pre suchú pleť','Krém pre problematickú pleť','Rutina pre zrelú pleť – PRO'],fallback:{dry:'Pri suchej pleti je priamy smer Krém pre suchú pleť. Výber starostlivosti ešte zohľadní, či chcete jeden produkt alebo celú rutinu.',oily:'Pri mastnejšej alebo problematickej pleti sa pozrite na Krém pre problematickú pleť. Výber potom doplní preferovaný rozsah rutiny.',sensitive:'Pri citlivejšej pleti je z ponuky najjasnejší smer Krém pre citlivú pleť. Ak pokožka výrazne alebo dlhodobo reaguje, konzultujte starostlivosť s odborníkom.',mature:'Ak chcete komplexnejšiu starostlivosť o zrelú pleť, smeruje sem Rutina pre zrelú pleť – PRO. Pri jednoduchšom režime poradca zúži výber inak.',default:'two cosmetics má produkty rozdelené podľa potrieb pleti. Štyri krátke kroky vám pomôžu dostať sa ku konkrétnemu produktu bez filtrovania celého katalógu.'}},
  bellcoria:{brand:'Bellcoria',web:'https://bellcoria.sk/',products:['Organický opunciový olej','Elixír proti vráskam s bakuchiolom','Pleťový čistiaci gél','Prírodný ANTI-AGING komplex'],fallback:{dry:'Pri suchej pleti a preferencii oleja je jasný smer Organický opunciový olej. Výber ešte zohľadní, či hľadáte základ rutiny alebo cielený krok.',oily:'Pri mastnejšej pleti by som bez ďalších údajov nezačínal olejom naslepo. Výber starostlivosti najprv zúži prioritu a typ produktu.',sensitive:'Ak chcete jemný základ rutiny, pozrite Pleťový čistiaci gél. Pri výrazne reaktívnej pleti je vhodné zloženie konzultovať s odborníkom.',mature:'Pre zrelšiu pleť je cielený smer Elixír proti vráskam s bakuchiolom alebo Prírodný ANTI-AGING komplex podľa rozsahu rutiny. Výber pomôže rozhodnúť medzi jedným krokom a komplexnejšou starostlivosťou.',default:'Bellcoria má viac typov produktov, preto je najpraktickejší krátky Výber starostlivosti. Zohľadní pleť, prioritu, rozsah rutiny aj textúru.'}},
  biofy:{brand:'BIOFY',web:'https://biofy.sk/',products:['Hydratačný krém – suchá a citlivá pleť','Upokojujúci krém – problematická pleť','Výživný krém – normálna a zmiešaná pleť','Konopný krém – suchá a problematická pleť'],fallback:{dry:'Pri suchej alebo citlivejšej pleti je jasný smer Hydratačný krém – suchá a citlivá pleť. Výber ešte zohľadní vašu hlavnú prioritu.',oily:'Pri problematickej alebo mastnejšej pleti sa pozrite na Upokojujúci krém – problematická pleť. Poradca ešte zohľadní, či chcete jednoduchú alebo širšiu rutinu.',sensitive:'Pri citlivejšej pleti je z ponuky vhodný smer Hydratačný krém – suchá a citlivá pleť. Pri výraznej alebo opakovanej reakcii pokožky je vhodná konzultácia s odborníkom.',mature:'Ak nemáte výraznú citlivosť a hľadáte univerzálny krém, pozrite Výživný krém – normálna a zmiešaná pleť. Výber starostlivosti vie výsledok spresniť podľa vašich potrieb.',default:'BIOFY má krémy rozdelené podľa typu pleti. Výber starostlivosti vás cez štyri jednoduché kroky pošle na najrelevantnejší produkt.'}},
  anemone:{brand:'ANEMONE',web:'https://anemone.sk/',products:['Pleťový olej na zrelú pleť','Pleťový olej na normálnu & suchú pleť','Pleťový olej na mastnú & problematickú pleť','Kvetinová voda Ruža Damascénska'],fallback:{dry:'Pri suchej pleti je jasný smer Pleťový olej na normálnu & suchú pleť. Výber ešte zohľadní, či chcete iba jeden doplnok alebo širšiu rutinu.',oily:'Pri mastnejšej alebo problematickej pleti sa pozrite na Pleťový olej na mastnú & problematickú pleť. Krátky výber ešte spresní prioritu.',sensitive:'Ak chcete rutinu iba jemne doplniť, pozrite Kvetinová voda Ruža Damascénska. Pri výrazne reaktívnej pokožke je vhodné výber kozmetiky konzultovať s odborníkom.',mature:'Pre zrelšiu pleť je priamy smer Pleťový olej na zrelú pleť. Výber starostlivosti ešte zohľadní preferovanú rutinu.',default:'ANEMONE má viac jednoduchých olejových a doplnkových produktov. Výber starostlivosti pomôže rozhodnúť podľa typu pleti a priority.'}},
  modrapupava:{brand:"Modrá púpava",web:"https://www.modrapupava.sk/",products:["Inspiral Anti-age – krém na spevnenie pleti","Inspiral Energy – pleťové sérum","Problematická pleť – pleťový a telový olej","Fialka – pleťová olejová kúra"],fallback:{dry:"Pri suchej alebo napnutej pleti je dobrý smer Inspiral Anti-age – krém na spevnenie pleti. Výber starostlivosti ešte zohľadní, či chcete krém, sérum alebo olej.",oily:"Pri vyššej tvorbe mazu sa pozrite na Problematická pleť – pleťový a telový olej. Výber ešte spresní vašu hlavnú prioritu.",sensitive:"Pri citlivejšej pleti je z ponuky vhodný smer Fialka – pleťová olejová kúra. Ak pokožka výrazne alebo dlhodobo reaguje, konzultujte starostlivosť s odborníkom.",mature:"Pre zrelšiu pleť je priamy smer Inspiral Anti-age – krém na spevnenie pleti. Výber starostlivosti ešte zohľadní, ako komplexnú rutinu chcete.",default:"Ak neviete, kde začať, prejdite Výber starostlivosti. Štyri krátke kroky zúžia ponuku Modrá púpava na konkrétny produkt."}}
};

function cors(req,res){
  const origin=req.headers.origin||'';
  const ok=origin===''||/(^https:\/\/([a-z0-9-]+\.)?mojchatbot\.sk$)|(^https:\/\/.*\.vercel\.app$)|(^http:\/\/(localhost|127\.0\.0\.1):\d+$)/i.test(origin);
  res.setHeader('Access-Control-Allow-Origin',ok&&origin?origin:'https://mojchatbot.sk');
  res.setHeader('Vary','Origin');res.setHeader('Access-Control-Allow-Methods','POST, OPTIONS');res.setHeader('Access-Control-Allow-Headers','Content-Type');
}
function fallbackReply(demo,text){
  const q=String(text||'').toLocaleLowerCase('sk');
  if(/such|pnut|dehyd/.test(q))return demo.fallback.dry;
  if(/mast|lesk|nedokonal|problem|akné/.test(q))return demo.fallback.oily;
  if(/citliv|reakt|podráž|štíp/.test(q))return demo.fallback.sensitive;
  if(/zrel|vrásk|pruž/.test(q))return demo.fallback.mature;
  return demo.fallback.default;
}
export default async function handler(req,res){
  cors(req,res);res.setHeader('Cache-Control','no-store');
  if(req.method==='OPTIONS')return res.status(204).end();
  if(req.method!=='POST')return res.status(405).json({error:'Method not allowed'});
  let body={};try{body=typeof req.body==='string'?JSON.parse(req.body):(req.body||{});}catch{return res.status(400).json({error:'Invalid body'});}
  const demo=DEMOS[String(body.demoId||'')];if(!demo)return res.status(400).json({error:'Unknown demo'});
  const messages=(Array.isArray(body.messages)?body.messages:[]).filter(m=>m&&(m.role==='user'||m.role==='assistant')).slice(-10).map(m=>({role:m.role,content:String(m.content||'').slice(0,700)})).filter(m=>m.content.trim());
  const latest=messages.filter(m=>m.role==='user').at(-1)?.content||'';if(!latest)return res.status(400).json({error:'Missing user message'});
  const fallback=()=>res.status(200).json({reply:fallbackReply(demo,latest),fallback:true});
  if(!ANTHROPIC_API_KEY)return fallback();
  const system=[
    `Ste stručný produktový poradca pre kozmetický e-shop ${demo.brand}.`,
    'Odpovedajte jednoduchou slovenčinou, maximálne dvoma krátkymi vetami.',
    'Pomáhate s orientačným kozmetickým výberom podľa preferencií. Nerobte zdravotnú diagnózu, nesľubujte liečbu a nevymýšľajte medicínske tvrdenia.',
    'Odporučiť môžete iba presný názov produktu zo zoznamu Overené produkty. Nevymýšľajte ceny, zloženie ani účinky, ktoré nie sú uvedené.',
    'Pri výraznom, bolestivom alebo dlhodobom kožnom probléme odporučte konzultáciu s dermatológom alebo iným odborníkom.',
    `Oficiálny e-shop: ${demo.web}`,
    `Overené produkty:\n- ${demo.products.join('\n- ')}`
  ].join('\n\n');
  try{
    const api=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'content-type':'application/json','x-api-key':ANTHROPIC_API_KEY,'anthropic-version':'2023-06-01'},body:JSON.stringify({model:MODEL,max_tokens:160,temperature:0,system,messages})});
    if(!api.ok){console.error('cosmetics Anthropic API error',api.status,await api.text());return fallback();}
    const data=await api.json();const reply=Array.isArray(data.content)?data.content.filter(b=>b.type==='text').map(b=>b.text).join('').trim():'';
    const clean=reply.replace(/[\u002a_\u0060#]/g,'').replace(/\s+/g,' ').trim();if(!clean)return fallback();
    return res.status(200).json({reply:clean});
  }catch(error){console.error('cosmetics chat provider error',error);return fallback();}
}
