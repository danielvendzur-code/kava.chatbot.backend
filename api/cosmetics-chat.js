import {legacyStockReply} from './legacy-stock-reply.js';
import { catalogueReply } from './catalogue-reply.js';
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const MODEL = process.env.CHAT_MODEL || 'claude-haiku-4-5';

const DEMOS = {
  mylo:{brand:'mylo',web:'https://www.mylo.sk/',products:['Hydratačný krém RUŽA A KONOPE','Pleťový olej AKO VÁNOK','Ceramidový krém s vitamínmi RADOSŤ','Hydratačné sérum INOVAŤ'],fallback:{dry:'Pri suchej alebo napnutej pleti je dobrý smer Hydratačný krém RUŽA A KONOPE. Krátky výber ešte zohľadní, či chcete krém, sérum alebo olej.',oily:'Pri vyššej tvorbe mazu sa pozrite na Pleťový olej AKO VÁNOK. Výber starostlivosti ešte zohľadní vašu hlavnú prioritu.',sensitive:'Pri citlivejšej pleti by som začal jemnejším smerom Ceramidový krém s vitamínmi RADOSŤ. Ak pleť výrazne alebo dlhodobo reaguje, vhodnosť kozmetiky konzultujte s odborníkom.',mature:'Ak chcete výživnejšiu starostlivosť, Ceramidový krém s vitamínmi RADOSŤ je rozumný smer. Výber potom zohľadní aj preferovanú textúru.',default:'Ak neviete, kde začať, prejdite Výber starostlivosti. Štyri krátke kroky zúžia ponuku mylo na konkrétny produkt.'}},
  ponio:{brand:'ponio',web:'https://ponio.sk/',products:['Vanilka & kokos – pleťový krém','Healthy aging – pleťový krém','Lumina shield – denný ochranný pleťový krém','Ružová voda Hanus 250 ml'],fallback:{dry:'Pri suchej pleti je jednoduchý smer Vanilka & kokos – pleťový krém. Výber ešte zohľadní, či chcete iba jeden produkt alebo viac krokov.',oily:'Pri mastnejšej pleti odporúčam najprv zúžiť výber podľa priority a textúry. Poradca nebude hádať produkt, ktorý nemá pre tento profil dostatok podkladov.',sensitive:'Pri citlivejšej pleti je vhodné držať rutinu jednoduchú; ako doplnkový krok sa dá pozrieť na Ružová voda Hanus 250 ml. Pri výraznej reakcii pokožky je vhodná konzultácia s odborníkom.',mature:'Pre zrelšiu pleť je z ponuky jasný smer Healthy aging – pleťový krém. Výber ešte rozlíši, či chcete jednoduchú alebo kompletnú rutinu.',default:'Ak chcete jeden praktický denný produkt, pozrite Lumina shield – denný ochranný pleťový krém. Výber starostlivosti vie odporúčanie spresniť.'}},
  two:{brand:'two cosmetics',web:'https://www.twocosmetics.sk/',products:['Krém pre citlivú pleť','Krém pre suchú pleť','Krém pre problematickú pleť','Rutina pre zrelú pleť – PRO'],fallback:{dry:'Pri suchej pleti je priamy smer Krém pre suchú pleť. Výber starostlivosti ešte zohľadní, či chcete jeden produkt alebo celú rutinu.',oily:'Pri mastnejšej alebo problematickej pleti sa pozrite na Krém pre problematickú pleť. Výber potom doplní preferovaný rozsah rutiny.',sensitive:'Pri citlivejšej pleti je z ponuky najjasnejší smer Krém pre citlivú pleť. Ak pokožka výrazne alebo dlhodobo reaguje, konzultujte starostlivosť s odborníkom.',mature:'Ak chcete komplexnejšiu starostlivosť o zrelú pleť, smeruje sem Rutina pre zrelú pleť – PRO. Pri jednoduchšom režime poradca zúži výber inak.',default:'two cosmetics má produkty rozdelené podľa potrieb pleti. Štyri krátke kroky vám pomôžu dostať sa ku konkrétnemu produktu bez filtrovania celého katalógu.'}},
  bellcoria:{brand:'Bellcoria',web:'https://bellcoria.sk/',products:['Organický opunciový olej','Elixír proti vráskam s bakuchiolom','Pleťový čistiaci gél','Prírodný ANTI-AGING komplex'],fallback:{dry:'Pri suchej pleti a preferencii oleja je jasný smer Organický opunciový olej. Výber ešte zohľadní, či hľadáte základ rutiny alebo cielený krok.',oily:'Pri mastnejšej pleti by som bez ďalších údajov nezačínal olejom naslepo. Výber starostlivosti najprv zúži prioritu a typ produktu.',sensitive:'Ak chcete jemný základ rutiny, pozrite Pleťový čistiaci gél. Pri výrazne reaktívnej pleti je vhodné zloženie konzultovať s odborníkom.',mature:'Pre zrelšiu pleť je cielený smer Elixír proti vráskam s bakuchiolom alebo Prírodný ANTI-AGING komplex podľa rozsahu rutiny. Výber pomôže rozhodnúť medzi jedným krokom a komplexnejšou starostlivosťou.',default:'Bellcoria má viac typov produktov, preto je najpraktickejší krátky Výber starostlivosti. Zohľadní pleť, prioritu, rozsah rutiny aj textúru.'}},
  biofy:{brand:'BIOFY',web:'https://biofy.sk/',products:['Hydratačný krém – suchá a citlivá pleť','Upokojujúci krém – problematická pleť','Výživný krém – normálna a zmiešaná pleť','Konopný krém – suchá a problematická pleť'],fallback:{dry:'Pri suchej alebo citlivejšej pleti je jasný smer Hydratačný krém – suchá a citlivá pleť. Výber ešte zohľadní vašu hlavnú prioritu.',oily:'Pri problematickej alebo mastnejšej pleti sa pozrite na Upokojujúci krém – problematická pleť. Poradca ešte zohľadní, či chcete jednoduchú alebo širšiu rutinu.',sensitive:'Pri citlivejšej pleti je z ponuky vhodný smer Hydratačný krém – suchá a citlivá pleť. Pri výraznej alebo opakovanej reakcii pokožky je vhodná konzultácia s odborníkom.',mature:'Ak nemáte výraznú citlivosť a hľadáte univerzálny krém, pozrite Výživný krém – normálna a zmiešaná pleť. Výber starostlivosti vie výsledok spresniť podľa vašich potrieb.',default:'BIOFY má krémy rozdelené podľa typu pleti. Výber starostlivosti vás cez štyri jednoduché kroky pošle na najrelevantnejší produkt.'}},
  anemone:{brand:'ANEMONE',web:'https://anemone.sk/',products:['Pleťový olej na zrelú pleť','Pleťový olej na normálnu & suchú pleť','Pleťový olej na mastnú & problematickú pleť','Kvetinová voda Ruža Damascénska'],fallback:{dry:'Pri suchej pleti je jasný smer Pleťový olej na normálnu & suchú pleť. Výber ešte zohľadní, či chcete iba jeden doplnok alebo širšiu rutinu.',oily:'Pri mastnejšej alebo problematickej pleti sa pozrite na Pleťový olej na mastnú & problematickú pleť. Krátky výber ešte spresní prioritu.',sensitive:'Ak chcete rutinu iba jemne doplniť, pozrite Kvetinová voda Ruža Damascénska. Pri výrazne reaktívnej pokožke je vhodné výber kozmetiky konzultovať s odborníkom.',mature:'Pre zrelšiu pleť je priamy smer Pleťový olej na zrelú pleť. Výber starostlivosti ešte zohľadní preferovanú rutinu.',default:'ANEMONE má viac jednoduchých olejových a doplnkových produktov. Výber starostlivosti pomôže rozhodnúť podľa typu pleti a priority.'}},
  modrapupava:{brand:"Modrá púpava",web:"https://www.modrapupava.sk/",products:["Inspiral Anti-age – krém na spevnenie pleti","Problematická pleť – pleťový a telový olej","Fialka – pleťová olejová kúra"],fallback:{dry:"Pri suchej alebo napnutej pleti je dobrý smer Inspiral Anti-age – krém na spevnenie pleti. Výber starostlivosti ešte zohľadní, či chcete krém, sérum alebo olej.",oily:"Pri vyššej tvorbe mazu sa pozrite na Problematická pleť – pleťový a telový olej. Výber ešte spresní vašu hlavnú prioritu.",sensitive:"Pri citlivejšej pleti je z ponuky vhodný smer Fialka – pleťová olejová kúra. Ak pokožka výrazne alebo dlhodobo reaguje, konzultujte starostlivosť s odborníkom.",mature:"Pre zrelšiu pleť je priamy smer Inspiral Anti-age – krém na spevnenie pleti. Výber starostlivosti ešte zohľadní, ako komplexnú rutinu chcete.",default:"Ak neviete, kde začať, prejdite Výber starostlivosti. Štyri krátke kroky zúžia ponuku Modrá púpava na konkrétny produkt."}},
  facederma:{brand:"Facederma",web:"https://facederma.sk/",products:["ANTI-AKNÉ krém pre problematickú pleť","Sérum kyseliny hyalurónovej","Liftingový krém na vrásky a kontúry tváre","Pleťový krém s hodvábom a kmeňovými bunkami"],fallback:{dry:"Pri suchej alebo napnutej pleti je dobrý smer Sérum kyseliny hyalurónovej. Výber starostlivosti ešte zohľadní, či chcete krém, sérum alebo olej.",oily:"Pri vyššej tvorbe mazu sa pozrite na ANTI-AKNÉ krém pre problematickú pleť. Výber ešte spresní vašu hlavnú prioritu.",sensitive:"Pri citlivejšej pleti je z ponuky vhodný smer Pleťový krém s hodvábom a kmeňovými bunkami. Ak pokožka výrazne alebo dlhodobo reaguje, konzultujte starostlivosť s odborníkom.",mature:"Pre zrelšiu pleť je priamy smer Liftingový krém na vrásky a kontúry tváre. Výber starostlivosti ešte zohľadní, ako komplexnú rutinu chcete.",default:"Ak neviete, kde začať, prejdite Výber starostlivosti. Štyri krátke kroky zúžia ponuku Facederma na konkrétny produkt."}},
  cyprianus:{brand:"Cyprianus",web:"https://www.cyprianus.sk/",products:["Hydratačný pleťový krém Mandľa a Malina 50 ml","Omladzujúci denný krém proti vráskam Q10 50 ml","Pleťové sérum Jojobový olej a ruža 50 ml","Hydratačný pleťový krém Pižmo a Bergamot 50 ml"],fallback:{dry:"Pri suchej alebo napnutej pleti je dobrý smer Hydratačný pleťový krém Mandľa a Malina 50 ml. Výber starostlivosti ešte zohľadní, či chcete krém, sérum alebo olej.",oily:"Pri vyššej tvorbe mazu sa pozrite na Hydratačný pleťový krém Pižmo a Bergamot 50 ml. Výber ešte spresní vašu hlavnú prioritu.",sensitive:"Pri citlivejšej pleti je z ponuky vhodný smer Pleťové sérum Jojobový olej a ruža 50 ml. Ak pokožka výrazne alebo dlhodobo reaguje, konzultujte starostlivosť s odborníkom.",mature:"Pre zrelšiu pleť je priamy smer Omladzujúci denný krém proti vráskam Q10 50 ml. Výber starostlivosti ešte zohľadní, ako komplexnú rutinu chcete.",default:"Ak neviete, kde začať, prejdite Výber starostlivosti. Štyri krátke kroky zúžia ponuku Cyprianus na konkrétny produkt."}},
  panakeia:{brand:"Panakeia",web:"https://www.panakeia.sk/",products:["BÁTHORYČKA – nočný krém s dračou krvou 30 ml","BOSORKIN LEKTVAR – bakuchiol pleťové sérum 15 ml","Kopaničiarska žehlička s peptidom Argireline 20 ml","BÁTHORYČKA – čistiaca pleťová pena s dračou krvou 100 ml"],fallback:{dry:"Pri suchej alebo napnutej pleti je dobrý smer BÁTHORYČKA – nočný krém s dračou krvou 30 ml. Výber starostlivosti ešte zohľadní, či chcete krém, sérum alebo olej.",oily:"Pri vyššej tvorbe mazu sa pozrite na BÁTHORYČKA – čistiaca pleťová pena s dračou krvou 100 ml. Výber ešte spresní vašu hlavnú prioritu.",sensitive:"Pri citlivejšej pleti je z ponuky vhodný smer BÁTHORYČKA – nočný krém s dračou krvou 30 ml. Ak pokožka výrazne alebo dlhodobo reaguje, konzultujte starostlivosť s odborníkom.",mature:"Pre zrelšiu pleť je priamy smer BOSORKIN LEKTVAR – bakuchiol pleťové sérum 15 ml. Výber starostlivosti ešte zohľadní, ako komplexnú rutinu chcete.",default:"Ak neviete, kde začať, prejdite Výber starostlivosti. Štyri krátke kroky zúžia ponuku Panakeia na konkrétny produkt."}},
  barboralori:{brand:"Barbora Lori",web:"https://www.barboralori.sk/",products:["Denný krém pre suchú a zrelšiu pleť s liftingovým účinkom","Opaľovací krém na tvár SPF 50 s nízkym komedogénnym indexom","Čistiace mlieko na tvár","Upokojujúce a hydratačné tonikum"],fallback:{dry:"Pri suchej alebo napnutej pleti je dobrý smer Denný krém pre suchú a zrelšiu pleť s liftingovým účinkom. Výber starostlivosti ešte zohľadní, či chcete krém, sérum alebo olej.",oily:"Pri vyššej tvorbe mazu sa pozrite na Opaľovací krém na tvár SPF 50 s nízkym komedogénnym indexom. Výber ešte spresní vašu hlavnú prioritu.",sensitive:"Pri citlivejšej pleti je z ponuky vhodný smer Čistiace mlieko na tvár. Ak pokožka výrazne alebo dlhodobo reaguje, konzultujte starostlivosť s odborníkom.",mature:"Pre zrelšiu pleť je priamy smer Denný krém pre suchú a zrelšiu pleť s liftingovým účinkom. Výber starostlivosti ešte zohľadní, ako komplexnú rutinu chcete.",default:"Ak neviete, kde začať, prejdite Výber starostlivosti. Štyri krátke kroky zúžia ponuku Barbora Lori na konkrétny produkt."}},
  bellmedi:{brand:"BellMedi",web:"https://bellmedi.sk/",products:["Kyselina hyalurónová","Ibištekový olej","Kakaové maslo","Cédrová kvetová voda"],fallback:{dry:"Pri suchej alebo napnutej pleti je dobrý smer Kyselina hyalurónová. Výber starostlivosti ešte zohľadní, či chcete krém, sérum alebo olej.",oily:"Pri vyššej tvorbe mazu sa pozrite na Cédrová kvetová voda. Výber ešte spresní vašu hlavnú prioritu.",sensitive:"Pri citlivejšej pleti je z ponuky vhodný smer Kakaové maslo. Ak pokožka výrazne alebo dlhodobo reaguje, konzultujte starostlivosť s odborníkom.",mature:"Pre zrelšiu pleť je priamy smer Ibištekový olej. Výber starostlivosti ešte zohľadní, ako komplexnú rutinu chcete.",default:"Ak neviete, kde začať, prejdite Výber starostlivosti. Štyri krátke kroky zúžia ponuku BellMedi na konkrétny produkt."}},
  lavelin:{brand:"Lavelin",web:"https://www.lavelin.sk/",products:["Vyživujúci pleťový krém so šípkovým olejom","Pleťové sérum s bakuchiolom","Pleťový čistiaci gél s papájou a mangom","Malinové pleťové sérum s kyselinou hyalurónovou"],fallback:{dry:"Pri suchej alebo napnutej pleti je dobrý smer Vyživujúci pleťový krém so šípkovým olejom. Výber starostlivosti ešte zohľadní, či chcete krém, sérum alebo olej.",oily:"Pri vyššej tvorbe mazu sa pozrite na Pleťový čistiaci gél s papájou a mangom. Výber ešte spresní vašu hlavnú prioritu.",sensitive:"Pri citlivejšej pleti je z ponuky vhodný smer Vyživujúci pleťový krém so šípkovým olejom. Ak pokožka výrazne alebo dlhodobo reaguje, konzultujte starostlivosť s odborníkom.",mature:"Pre zrelšiu pleť je priamy smer Pleťové sérum s bakuchiolom. Výber starostlivosti ešte zohľadní, ako komplexnú rutinu chcete.",default:"Ak neviete, kde začať, prejdite Výber starostlivosti. Štyri krátke kroky zúžia ponuku Lavelin na konkrétny produkt."}},
  kvitok:{brand:"Kvitok",web:"https://www.kvitok.sk/",products:["Konopný krém pre mastnú a problematickú pleť","Arganový krém pre zrelú pleť (30+) — denný","Pleťové sérum s kyselinou azelaovou","BB ochranný pleťový krém"],fallback:{dry:"Pri suchej alebo napnutej pleti je dobrý smer Arganový krém pre zrelú pleť (30+) — denný. Výber starostlivosti ešte zohľadní, či chcete krém, sérum alebo olej.",oily:"Pri vyššej tvorbe mazu sa pozrite na Konopný krém pre mastnú a problematickú pleť. Výber ešte spresní vašu hlavnú prioritu.",sensitive:"Pri citlivejšej pleti je z ponuky vhodný smer Pleťové sérum s kyselinou azelaovou. Ak pokožka výrazne alebo dlhodobo reaguje, konzultujte starostlivosť s odborníkom.",mature:"Pre zrelšiu pleť je priamy smer Arganový krém pre zrelú pleť (30+) — denný. Výber starostlivosti ešte zohľadní, ako komplexnú rutinu chcete.",default:"Ak neviete, kde začať, prejdite Výber starostlivosti. Štyri krátke kroky zúžia ponuku Kvitok na konkrétny produkt."}},
  soaphoria:{brand:"Soaphoria",web:"https://www.soaphoria.sk/",products:["Osviežujúci čistiaci mousse na zmiešanú až mastnú pleť","Arganový olej","Levanduľa lekárska — organická kvetová voda","Herbaphoria — organická pleťová maska"],fallback:{dry:"Pri suchej alebo napnutej pleti je dobrý smer Arganový olej. Výber starostlivosti ešte zohľadní, či chcete krém, sérum alebo olej.",oily:"Pri vyššej tvorbe mazu sa pozrite na Osviežujúci čistiaci mousse na zmiešanú až mastnú pleť. Výber ešte spresní vašu hlavnú prioritu.",sensitive:"Pri citlivejšej pleti je z ponuky vhodný smer Levanduľa lekárska — organická kvetová voda. Ak pokožka výrazne alebo dlhodobo reaguje, konzultujte starostlivosť s odborníkom.",mature:"Pre zrelšiu pleť je priamy smer Arganový olej. Výber starostlivosti ešte zohľadní, ako komplexnú rutinu chcete.",default:"Ak neviete, kde začať, prejdite Výber starostlivosti. Štyri krátke kroky zúžia ponuku Soaphoria na konkrétny produkt."}},
  syncare:{brand:"Syncare",web:"https://www.syncare.sk/",products:["GlycoRETINAL+C krém pre pleť so sklonom k akné","CENTELARIA upokojujúca maska pre citlivú pleť","BB NEW AGE omladzujúci denný krém SPF 20","Hydratačný gél s argánovým olejom a skvalánom"],fallback:{dry:"Pri suchej alebo napnutej pleti je dobrý smer BB NEW AGE omladzujúci denný krém SPF 20. Výber starostlivosti ešte zohľadní, či chcete krém, sérum alebo olej.",oily:"Pri vyššej tvorbe mazu sa pozrite na GlycoRETINAL+C krém pre pleť so sklonom k akné. Výber ešte spresní vašu hlavnú prioritu.",sensitive:"Pri citlivejšej pleti je z ponuky vhodný smer CENTELARIA upokojujúca maska pre citlivú pleť. Ak pokožka výrazne alebo dlhodobo reaguje, konzultujte starostlivosť s odborníkom.",mature:"Pre zrelšiu pleť je priamy smer BB NEW AGE omladzujúci denný krém SPF 20. Výber starostlivosti ešte zohľadní, ako komplexnú rutinu chcete.",default:"Ak neviete, kde začať, prejdite Výber starostlivosti. Štyri krátke kroky zúžia ponuku Syncare na konkrétny produkt."}},
  fytopharma:{brand:"Fytopharma",web:"https://www.fytopharma.sk/",products:["Omladzujúci krém s kyselinou hyalurónovou","Pleťová voda s pH 4","Hydratačný krém s obsahom aminokyselín","Mastný krém s kakaovým maslom a vitamínom E"],fallback:{dry:"Pri suchej alebo napnutej pleti je dobrý smer Omladzujúci krém s kyselinou hyalurónovou. Výber starostlivosti ešte zohľadní, či chcete krém, sérum alebo olej.",oily:"Pri vyššej tvorbe mazu sa pozrite na Pleťová voda s pH 4. Výber ešte spresní vašu hlavnú prioritu.",sensitive:"Pri citlivejšej pleti je z ponuky vhodný smer Mastný krém s kakaovým maslom a vitamínom E. Ak pokožka výrazne alebo dlhodobo reaguje, konzultujte starostlivosť s odborníkom.",mature:"Pre zrelšiu pleť je priamy smer Omladzujúci krém s kyselinou hyalurónovou. Výber starostlivosti ešte zohľadní, ako komplexnú rutinu chcete.",default:"Ak neviete, kde začať, prejdite Výber starostlivosti. Štyri krátke kroky zúžia ponuku Fytopharma na konkrétny produkt."}},
  natureal:{brand:"Natureal",web:"https://eshop.natureal.sk/sk/",products:["MEDI-PEEL Bor-Tox Cream — antiage krém","HARUHARU WONDER Black Bamboo Mist — pleťová hmla","OSKIA Universal Hyaluronic Acid Serum","THE ORDINARY AHA 30% + BHA 2% Peeling Solution"],fallback:{dry:"Pri suchej alebo napnutej pleti je dobrý smer MEDI-PEEL Bor-Tox Cream — antiage krém. Výber starostlivosti ešte zohľadní, či chcete krém, sérum alebo olej.",oily:"Pri vyššej tvorbe mazu sa pozrite na THE ORDINARY AHA 30% + BHA 2% Peeling Solution. Výber ešte spresní vašu hlavnú prioritu.",sensitive:"Pri citlivejšej pleti je z ponuky vhodný smer HARUHARU WONDER Black Bamboo Mist — pleťová hmla. Ak pokožka výrazne alebo dlhodobo reaguje, konzultujte starostlivosť s odborníkom.",mature:"Pre zrelšiu pleť je priamy smer MEDI-PEEL Bor-Tox Cream — antiage krém. Výber starostlivosti ešte zohľadní, ako komplexnú rutinu chcete.",default:"Ak neviete, kde začať, prejdite Výber starostlivosti. Štyri krátke kroky zúžia ponuku Natureal na konkrétny produkt."}}
};

// Company catalogues served through the existing AI-enabled backend.
Object.assign(DEMOS, {
  "botanica": {
    "brand": "Botanica Slavica",
    "web": "https://www.botanicaslavica.eu/sk/",
    "products": [
      "Rebalansačné pleťové tonikum 9 divov bylín 100 ml",
      "Čistiaca exfoliačná pena proti nedokonalostiam PREMIUM",
      "Pleťové sérum 9 divov kvetov 30 ml",
      "Upokojujúci čistiaci gél 9 divov kvetov 100 ml",
      "RICH BARRIER výživný a regeneračný krém 50 ml",
      "Fermentovaný slivkový olej – obnova citlivej pleti 50 ml",
      "Fermentovaný arganový olej 50 ml",
      "Fermentovaný avokádový olej 50 ml"
    ],
    "fallback": {
      "dry": "Pri suchej pleti je z ponuky dobrý smer RICH BARRIER krém a fermentovaný avokádový olej. Výber starostlivosti ešte zohľadní, či chcete krém, sérum alebo olej.",
      "oily": "Pri mastnejšej pleti je rada 9 divov bylín — napríklad rebalansačné tonikum — a exfoliačná pena proti nedokonalostiam. Výber ešte spresní vašu hlavnú prioritu.",
      "sensitive": "Pri citlivej pleti je určená rada 9 divov kvetov a fermentovaný slivkový olej. Ak pokožka výrazne alebo dlhodobo reaguje, konzultujte starostlivosť s odborníkom.",
      "mature": "Pre zrelšiu pleť je smer fermentovaný arganový olej a RICH BARRIER krém. Výber starostlivosti ešte zohľadní, ako komplexnú rutinu chcete.",
      "default": "Ak neviete, kde začať, prejdite Výber starostlivosti. Štyri krátke kroky zúžia ponuku Botanica Slavica na konkrétny produkt."
    },
    "kind": "kozmetika"
  },
  "atok": {
    "brand": "Original ATOK",
    "web": "https://www.originalatok.cz/",
    "products": [
      "Hydratačný krém Granátové jablko 50 ml",
      "Omladzujúci krém Ruža 50 ml",
      "Upokojujúci krém Levanduľa 50 ml",
      "Krém na akné 50 ml",
      "Facelifting krém Vanilka – slamienka 30 ml",
      "Rozjasňujúce sérum s vitamínom C",
      "Hyalurónový fluid 30 ml",
      "Pleťová voda Levanduľa 200 ml",
      "Jemný odličovací gél Aloe vera 150 ml"
    ],
    "fallback": {
      "dry": "Pri suchej pleti je z ponuky ATOK dobrý smer hydratačný krém Granátové jablko, pod neho hyalurónový fluid. Výber starostlivosti ešte zohľadní, či chcete jeden krok alebo celú rutinu.",
      "oily": "Pri mastnejšej pleti a pupienkoch je určený Krém na akné, na rozjasnenie sérum s vitamínom C. Výber ešte spresní vašu hlavnú prioritu.",
      "sensitive": "Pri citlivej pleti je dobrý smer upokojujúci krém a pleťová voda Levanduľa. Ak pokožka výrazne alebo dlhodobo reaguje, konzultujte starostlivosť s odborníkom.",
      "mature": "Pre zrelšiu pleť je smer Omladzujúci krém Ruža alebo Facelifting krém Vanilka – slamienka. Výber starostlivosti ešte zohľadní, ako komplexnú rutinu chcete.",
      "default": "Ak neviete, kde začať, prejdite Výber starostlivosti. Štyri krátke kroky zúžia ponuku Original ATOK na konkrétny produkt."
    },
    "kind": "kozmetika"
  },
  "iuvenio": {
    "brand": "IUVENIO",
    "web": "https://www.iuvenio.com/sk/",
    "products": [
      "CALM anti-age krém s betaglukánmi 50 ml",
      "VITAL krém s kolagénovým boosterom 50 ml",
      "MOON nočný anti-age krém s HyRetinom 30 ml",
      "RETOUCH nočný krém proti nedokonalostiam 30 ml",
      "CROSSLINKED očné a pleťové sérum 30 ml",
      "NANO nanovlákenné sérum (7 dávok)",
      "FRESH pleťová esencia 250 ml",
      "RESTART peeling 10 % AHA + 1 % BHA 50 ml",
      "URBAN čistiaci gél 250 ml"
    ],
    "fallback": {
      "dry": "Pri suchej pleti je z IUVENIO dobrý smer VITAL alebo CALM, pod krém sérum CROSSLINKED. Výber starostlivosti to zúži podľa cieľa a rutiny.",
      "oily": "Pri mastnej pleti s nedokonalosťami sa hodí nočný krém RETOUCH, raz-dvakrát týždenne peeling RESTART a na čistenie gél URBAN.",
      "sensitive": "Citlivej pleti najviac sedí CALM s betaglukánmi, jemný čistiaci gél URBAN a ako kúra nanovlákenné sérum NANO bez konzervantov.",
      "mature": "Na vrásky a spevnenie je tu nočný MOON s HyRetinom a sérum CROSSLINKED, ktoré pomáha aj okolo očí.",
      "default": "IUVENIO má krémy, séra, esenciu, peeling aj čistiaci gél. Výber starostlivosti podľa typu pleti a cieľa odporučí konkrétny produkt aj poradie krokov."
    },
    "kind": "kozmetika"
  },
  "drsandra": {
    "brand": "Dr. Sandra",
    "web": "https://doktorkasandra.sk/",
    "products": [
      "Polomastný krém s vitamínmi A, E, C a kyselinou hyalurónovou 40 g",
      "Hydratačný krém s ureou 40 g",
      "Anti-aging sérum s bakuchiolom 30 ml",
      "24-hodinový Ultrafacial krém s ceramidmi 40 g",
      "Výživný krém s vitamínmi A, E, C a kyselinou hyalurónovou 40 g",
      "RevitaNAD anti-age krém s astaxantínom 40 ml",
      "Sérum s vitamínom C 30 ml",
      "Olejové sérum s betakaroténom 20 ml",
      "Kyslá pleťová voda na citlivú pleť bez alkoholu 100 ml",
      "Kyslá pleťová voda s obsahom alkoholu 100 ml"
    ],
    "fallback": {
      "dry": "Pri suchej pleti je od Dr. Sandra dobrý smer Výživný krém alebo RevitaNAD, pod krém sérum s vitamínom C. Výber starostlivosti to zúži podľa cieľa a rutiny.",
      "oily": "Pri mastnej a zmiešanej pleti sa hodí Hydratačný krém s ureou a na čistenie kyslá pleťová voda s obsahom alkoholu.",
      "sensitive": "Citlivej pleti najviac sedí 24-hodinový Ultrafacial krém s ceramidmi, kyslá pleťová voda bez alkoholu a sérum s bakuchiolom.",
      "mature": "Na vrásky a pružnosť je tu RevitaNAD krém, sérum s bakuchiolom a sérum s vitamínom C.",
      "default": "Dr. Sandra má krémy podľa typu pleti, séra a dve kyslé pleťové vody. Výber starostlivosti odporučí konkrétny produkt aj poradie krokov."
    },
    "kind": "kozmetika"
  },
  "savon": {
    "brand": "SAVON",
    "web": "https://www.savon.sk/",
    "products": [
      "HARMONY hydratačný pleťový olej na suchú a citlivú pleť 30 ml",
      "BALANCE ošetrujúci pleťový olej na mastnú pleť 30 ml",
      "FLOW anti-aging pleťový olej s opunciou a Q10 30 ml",
      "LAVITA spevňujúci pleťový krém s opunciou, Q10 a kyselinou hyalurónovou 30 ml",
      "ĽÚBIVÁ vyživujúci pleťový krém s kaviárom a vitamínmi A, C, E 30 ml",
      "RENEW bakuchiolové pleťové sérum s astaxantínom 15 ml",
      "REVITALUXE peptidové pleťové sérum s Matrixylom 3000 15 ml",
      "HYDRABIOTIN hydratačné sérum s biotínom a exozómami 15 ml",
      "Čistiaca pena na normálnu až suchú pleť",
      "Čistiaca pena na zmiešanú až mastnú pleť 150 ml"
    ],
    "fallback": {
      "dry": "Pri suchej pleti je zo SAVON dobrý smer olej HARMONY alebo krém ĽÚBIVÁ, pod krém sérum HYDRABIOTIN. Výber starostlivosti to zúži podľa cieľa a rutiny.",
      "oily": "Pri mastnej pleti sa hodí ľahký olej BALANCE a na čistenie pena na zmiešanú až mastnú pleť so salicylovou kyselinou.",
      "sensitive": "Citlivej pleti sedí olej HARMONY, jemná pena na normálnu až suchú pleť a upokojujúce peptidové sérum REVITALUXE.",
      "mature": "Na vrásky a spevnenie je tu olej FLOW, krém LAVITA a séra RENEW s bakuchiolom či REVITALUXE s peptidmi.",
      "default": "SAVON má pleťové oleje, krémy, séra aj čistiace peny. Výber starostlivosti podľa typu pleti a cieľa odporučí konkrétny produkt aj poradie krokov."
    },
    "kind": "kozmetika"
  },
  "marielli": {
    "brand": "Marielli cosmetics",
    "web": "https://www.mariellicosmetics.cz/",
    "products": [
      "Hyalurónové sérum Zázrak",
      "Pleťové sérum Láska so šípkovým olejom",
      "Odličovací olejček Krásenka",
      "Odličovacie penivé mlieko Pěnilka 60 ml",
      "Pleťová voda pre normálnu pleť Andělka",
      "Pleťová voda pre zrelú pleť Královna",
      "Pleťová maska na aknóznu pleť Hortenzie 60 ml",
      "Pleťová maska na citlivú pleť Pivoňka 60 ml",
      "Pleťová maska na zrelú pleť Pomněnka 60 ml",
      "Pleťová maska pre všetky typy pleti Sněženka 60 ml"
    ],
    "fallback": {
      "dry": "Pri suchej pleti je od Marielli dobrý smer sérum Láska so šípkovým olejom a odličovací olejček Krásenka. Výber starostlivosti to zúži podľa cieľa a rutiny.",
      "oily": "Pri mastnej pleti sa hodí penivé mlieko Pěnilka, hyalurónové sérum Zázrak a raz týždenne maska Hortenzie so zeleným ílom.",
      "sensitive": "Citlivej pleti sedí odličovací olejček Krásenka bez éterických olejov a maska Pivoňka s ružovým ílom.",
      "mature": "Pre zrelú pleť je tu pleťová voda Královna, sérum Láska a maska Pomněnka s modrým ílom.",
      "default": "Marielli má séra, odličovacie produkty, pleťové vody a masky podľa typu pleti. Výber starostlivosti odporučí konkrétny produkt aj poradie krokov."
    },
    "kind": "kozmetika"
  },
  "delibutus": {
    "brand": "Delibutus",
    "web": "https://delibutus.cz/",
    "products": [
      "Olejové sérum Rozjasněnka 30 ml",
      "Olejové sérum Zlatokráska",
      "Olejové sérum Rovnovážka 30 ml",
      "Olejové sérum Čistokráska 30 ml",
      "Šľahané maslo Matcha Karité",
      "Nechtíkové maslo (Měsíčková mastička)"
    ],
    "fallback": {
      "dry": "Pri suchej pleti je od Delibutus dobrý smer sérum Rozjasněnka alebo Zlatokráska a na noc šľahané maslo Matcha Karité.",
      "oily": "Pri mastnej pleti s nedokonalosťami sa hodí ľahké olejové sérum Čistokráska.",
      "sensitive": "Citlivej pleti sedí Rozjasněnka alebo Rovnovážka a jemné nechtíkové maslo.",
      "mature": "Pre zrelú pleť je tu regeneračné sérum Zlatokráska so šípkovým olejom a maslo Matcha Karité.",
      "default": "Delibutus má štyri olejové séra a výživné maslá. Výber starostlivosti podľa typu pleti a cieľa odporučí konkrétny produkt."
    },
    "kind": "kozmetika"
  },
  "almara": {
    "brand": "Almara Soap",
    "web": "https://www.almarasoap.com/cs/",
    "products": [
      "GLOW pleťový olej pre suchú a citlivú pleť 30 ml",
      "SHINE pleťový olej pre mastnú pleť s nedokonalosťami 30 ml",
      "BLOOM pleťový olej pre zrelú pleť 30 ml",
      "PURE FACE odličovací olej pre všetky typy pleti 100 ml",
      "Pleťová maska Ružový íl a ruža (Pink Face) 20 g",
      "Pleťová maska Zelený íl a kurkuma (Clean Face) 20 g",
      "Pleťová maska Kakao a ovos 20 g",
      "Kvetová voda Ruža 100 ml",
      "Kvetová voda Levanduľa 100 ml",
      "Kvetová voda Šalvia 100 ml"
    ],
    "fallback": {
      "dry": "Pri suchej pleti je od Almara Soap dobrý smer olej GLOW s ružovou kvetovou vodou a raz týždenne maska Kakao a ovos.",
      "oily": "Pri mastnej pleti sa hodí olej SHINE, šalviová kvetová voda a maska Clean Face so zeleným ílom.",
      "sensitive": "Citlivej pleti sedí olej GLOW, levanduľová alebo ružová voda a maska Kakao a ovos bez parfumácie.",
      "mature": "Pre zrelú pleť je tu olej BLOOM, ružová kvetová voda a maska Pink Face s ružovým ílom.",
      "default": "Almara Soap má pleťové oleje podľa typu pleti, kvetové vody, odličovací olej a práškové masky. Výber starostlivosti odporučí konkrétny produkt aj poradie krokov."
    },
    "kind": "kozmetika"
  },
  "dulcia": {
    "brand": "Dulcia",
    "web": "https://www.dulcia.sk/",
    "products": [
      "Výživný pleťový krém s lipidmi",
      "Pleťový krém na akné – čistiaci komplex",
      "Nočné mikrobiotické pleťové sérum – Upokojujúce",
      "Sérum proti vráskam s kyselinou hyalurónovou",
      "Ľahký hydratačný krém",
      "Bioaktívne olejové sérum"
    ],
    "fallback": {
      "dry": "Pri suchej alebo napnutej pleti je dobrý smer Výživný pleťový krém s lipidmi. Výber starostlivosti ešte zohľadní, či chcete krém, sérum alebo olej.",
      "oily": "Pri vyššej tvorbe mazu sa pozrite na Pleťový krém na akné – čistiaci komplex. Výber ešte spresní vašu hlavnú prioritu.",
      "sensitive": "Pri citlivejšej pleti je z ponuky vhodný smer Nočné mikrobiotické pleťové sérum – Upokojujúce. Ak pokožka výrazne alebo dlhodobo reaguje, konzultujte starostlivosť s odborníkom.",
      "mature": "Pre zrelšiu pleť je priamy smer Sérum proti vráskam s kyselinou hyalurónovou. Výber starostlivosti ešte zohľadní, ako komplexnú rutinu chcete.",
      "default": "Ak neviete, kde začať, prejdite Výber starostlivosti. Štyri krátke kroky zúžia ponuku Dulcia na konkrétny produkt."
    },
    "kind": "kozmetika"
  },
  "yemna": {
    "brand": "Yemna",
    "web": "https://www.yemna.sk/",
    "products": [
      "Slivka & Ibištek pleťový krém",
      "INTENSE CLARIFYING rozjasňujúca emulzia 30 ml",
      "CICA Micro repair cream 50 ml",
      "AVEQ10 hydratačný pleťový krém proti vráskam 50 ml",
      "Moruša výživný pleťový krém 50 ml",
      "Omladenie s Q10 a bakuchiolom – pleťový olej 30 ml",
      "Obnova pleťové tonikum s niacínom"
    ],
    "fallback": {
      "dry": "Pri suchej alebo napnutej pleti je dobrý smer Slivka & Ibištek pleťový krém. Výber starostlivosti ešte zohľadní, či chcete krém, sérum alebo olej.",
      "oily": "Pri vyššej tvorbe mazu a stopách po nedokonalostiach sa pozrite na INTENSE CLARIFYING rozjasňujúcu emulziu. Výber ešte spresní vašu hlavnú prioritu.",
      "sensitive": "Pri citlivejšej pleti je z ponuky vhodný smer CICA Micro repair cream. Ak pokožka výrazne alebo dlhodobo reaguje, konzultujte starostlivosť s odborníkom.",
      "mature": "Pre zrelšiu pleť je priamy smer Moruša výživný pleťový krém. Výber starostlivosti ešte zohľadní, ako komplexnú rutinu chcete.",
      "default": "Ak neviete, kde začať, prejdite Výber starostlivosti. Štyri krátke kroky zúžia ponuku Yemna na konkrétny produkt."
    },
    "kind": "kozmetika"
  },
  "namy": {
    "brand": "NAMY",
    "web": "https://www.namy.sk/",
    "products": [
      "NI + HA + E pleťový krém s niacínamidom",
      "Akné hydrogel – gélové sérum 30 ml",
      "Dermal Sensitive – krém na citlivú pokožku 50 ml",
      "HYALURON – pleťové sérum s kyselinou hyalurónovou",
      "LIFT + FILL pleťový krém s liftingovým efektom",
      "BAKUCHIOL – olejové pleťové sérum s 1 % bakuchiolom",
      "HYDRA – gélová hydratačná esencia"
    ],
    "fallback": {
      "dry": "Pri suchej alebo napnutej pleti je dobrý smer HYALURON – pleťové sérum s kyselinou hyalurónovou pod krém NI + HA + E. Výber starostlivosti ešte zohľadní, či chcete krém, sérum alebo olej.",
      "oily": "Pri vyššej tvorbe mazu sa pozrite na Akné hydrogel – gélové sérum. Výber ešte spresní vašu hlavnú prioritu.",
      "sensitive": "Pri citlivejšej pleti je z ponuky vhodný smer Dermal Sensitive – krém na citlivú pokožku. Ak pokožka výrazne alebo dlhodobo reaguje, konzultujte starostlivosť s odborníkom.",
      "mature": "Pre zrelšiu pleť je priamy smer LIFT + FILL pleťový krém s liftingovým efektom. Výber starostlivosti ešte zohľadní, ako komplexnú rutinu chcete.",
      "default": "Ak neviete, kde začať, prejdite Výber starostlivosti. Štyri krátke kroky zúžia ponuku NAMY na konkrétny produkt."
    },
    "kind": "kozmetika"
  },
  "mymkech": {
    "brand": "Mymkech",
    "web": "https://www.mymkech.com/",
    "products": [
      "my barrier boost – krém na obnovu kožnej bariéry",
      "my acne control – olejové sérum",
      "my true repair – regeneračné krémové sérum",
      "my skin comfort – upokojujúce krémové sérum",
      "my vital skin – regeneračné olejové sérum",
      "my pure skin – nepenivý čistiaci gél",
      "ROSE – ružový hydrolát"
    ],
    "fallback": {
      "dry": "Pri suchej alebo napnutej pleti je dobrý smer my barrier boost. Výber starostlivosti ešte zohľadní, či chcete krém, sérum alebo olej.",
      "oily": "Pri vyššej tvorbe mazu a nedokonalostiach sa pozrite na my acne control. Výber ešte spresní vašu hlavnú prioritu.",
      "sensitive": "Pri citlivejšej pleti je z ponuky vhodný smer my skin comfort alebo my barrier boost. Ak pokožka výrazne alebo dlhodobo reaguje, konzultujte starostlivosť s odborníkom.",
      "mature": "Pre zrelšiu pleť je priamy smer my true repair. Výber starostlivosti ešte zohľadní, ako komplexnú rutinu chcete.",
      "default": "Ak neviete, kde začať, prejdite Výber starostlivosti. Štyri krátke kroky zúžia ponuku Mymkech na konkrétny produkt."
    },
    "kind": "kozmetika"
  },
  "anela": {
    "brand": "Anela",
    "web": "https://www.anela.cz/",
    "products": [
      "Bezstarostný motýl – olejové sérum pre suchú a citlivú pleť 30 ml",
      "Bezstarostná teenka – olejové sérum s CBD pre mastnú pleť 30 ml",
      "Bezstarostná krása – olejové anti-age sérum s bakuchiolom 30 ml",
      "Růžové z nebe – hydratačné sérum pre všetky typy pleti 30 ml",
      "Půlnoční motýl – upokojujúci nočný balzam 30 ml",
      "Půlnoční krása – anti-age nočný balzam 30 ml",
      "Půlnoční teenka – regeneračný nočný balzam s CBD 30 ml",
      "Očistím tvář – čistiaca pena pre všetky typy pleti 100 ml"
    ],
    "fallback": {
      "dry": "Pri suchej alebo napnutej pleti je dobrý smer Bezstarostný motýl alebo Růžové z nebe. Výber starostlivosti ešte zohľadní, či chcete krém, sérum alebo olej.",
      "oily": "Pri vyššej tvorbe mazu sa pozrite na Bezstarostnú teenku. Výber ešte spresní vašu hlavnú prioritu.",
      "sensitive": "Pri citlivejšej pleti je z ponuky vhodný smer Bezstarostný motýl a na noc Půlnoční motýl. Ak pokožka výrazne alebo dlhodobo reaguje, konzultujte starostlivosť s odborníkom.",
      "mature": "Pre zrelšiu pleť je priamy smer Bezstarostná krása alebo Půlnoční krása. Výber starostlivosti ešte zohľadní, ako komplexnú rutinu chcete.",
      "default": "Ak neviete, kde začať, prejdite Výber starostlivosti. Štyri krátke kroky zúžia ponuku Anela na konkrétny produkt."
    },
    "kind": "kozmetika"
  },
  "klararott": {
    "brand": "Klara Rott",
    "web": "https://www.klararott.sk/",
    "products": [
      "Harmónia – vyživujúce sérum 25 ml",
      "Harmónia – vyrovnávacie sérum 25 ml",
      "Harmónia – anti-aging sérum 25 ml",
      "Nádych – hydratačný liftingový fluid 30 ml",
      "BalanceCream – lipozomálny krém proti starnutiu 50 ml",
      "Aura – denný ochranný krém s SPF 20 50 ml",
      "Kľud – vyrovnávacie bylinné tonikum 100 ml",
      "Sviežosť – hydrolát levanduľa 100 ml"
    ],
    "fallback": {
      "dry": "Pri suchej alebo napnutej pleti je dobrý smer Nádych – hydratačný liftingový fluid. Výber starostlivosti ešte zohľadní, či chcete krém, sérum alebo olej.",
      "oily": "Pri vyššej tvorbe mazu a nedokonalostiach sa pozrite na Harmóniu – vyrovnávacie sérum. Výber ešte spresní vašu hlavnú prioritu.",
      "sensitive": "Pri citlivejšej pleti je z ponuky vhodný smer Aura – denný ochranný krém a hydrolát Sviežosť levanduľa. Ak pokožka výrazne alebo dlhodobo reaguje, konzultujte starostlivosť s odborníkom.",
      "mature": "Pre zrelšiu pleť je priamy smer Harmónia – anti-aging sérum alebo BalanceCream. Výber starostlivosti ešte zohľadní, ako komplexnú rutinu chcete.",
      "default": "Ak neviete, kde začať, prejdite Výber starostlivosti. Štyri krátke kroky zúžia ponuku Klara Rott na konkrétny produkt."
    },
    "kind": "kozmetika"
  },
  "yage": {
    "brand": "YAGE Organics",
    "web": "https://www.yageorganics.cz/",
    "products": [
      "č. 4 AQUA SPLASH – hydratačná esencia s niacínamidom",
      "č. 1 VELVET TOUCH – šetrný umývací gél",
      "č. 6 AU REVOIR WRINKLES – well-aging krém s platinou 30 ml",
      "č. 6 SLEEPING BEAUTY – nočné olejové sérum s retinolom",
      "č. 5 HELLO BEAUTIFUL – liftingové sérum s kolagénom a peptidmi",
      "č. 3 SEA WAVE – upokojujúce Cica tonikum",
      "č. 6 MYSTIC TANSY BLUE – nočný upokojujúci balzam",
      "č. 7 SOS MIRACLE – lokálna starostlivosť na pupienky"
    ],
    "fallback": {
      "dry": "Pri suchej alebo napnutej pleti je dobrý smer č. 4 AQUA SPLASH. Výber starostlivosti ešte zohľadní, či chcete krém, sérum alebo olej.",
      "oily": "Pri nedokonalostiach sa pozrite na č. 7 SOS MIRACLE a na noc č. 6 MYSTIC TANSY BLUE. Výber ešte spresní vašu hlavnú prioritu.",
      "sensitive": "Pri citlivejšej pleti je z ponuky vhodný smer č. 3 SEA WAVE a č. 6 MYSTIC TANSY BLUE. Ak pokožka výrazne alebo dlhodobo reaguje, konzultujte starostlivosť s odborníkom.",
      "mature": "Pre zrelšiu pleť je priamy smer č. 6 AU REVOIR WRINKLES alebo č. 5 HELLO BEAUTIFUL. Výber starostlivosti ešte zohľadní, ako komplexnú rutinu chcete.",
      "default": "Ak neviete, kde začať, prejdite Výber starostlivosti. Štyri krátke kroky zúžia ponuku YAGE na konkrétny produkt."
    },
    "kind": "kozmetika"
  },
  "omorfia": {
    "brand": "OMORFIA",
    "web": "https://www.omorfia.care/",
    "products": [
      "SKIN SUPERFOOD – omladzujúci olej pre suchú pleť 30 ml",
      "DIVINE ELIXIR – omladzujúci olej pre zmiešanú pleť 30 ml",
      "PHOENIX – ľahký liftingový krém 30 ml",
      "BRIGHT STAR – rozjasňujúci pleťový olej 30 ml",
      "ZEN PURE – odličovací a čistiaci balzam 100 ml"
    ],
    "fallback": {
      "dry": "Pri suchej alebo napnutej pleti je dobrý smer SKIN SUPERFOOD. Výber starostlivosti ešte zohľadní, či chcete krém alebo olej.",
      "oily": "Pri vyššej tvorbe mazu a pupienkoch sa pozrite na DIVINE ELIXIR. Výber ešte spresní vašu hlavnú prioritu.",
      "sensitive": "Pri citlivejšej pleti začnite jemným čistením ZEN PURE. Ak pokožka výrazne alebo dlhodobo reaguje, konzultujte starostlivosť s odborníkom.",
      "mature": "Pre zrelšiu pleť je priamy smer PHOENIX – liftingový krém. Výber starostlivosti ešte zohľadní, ako komplexnú rutinu chcete.",
      "default": "Ak neviete, kde začať, prejdite Výber starostlivosti. Štyri krátke kroky zúžia ponuku OMORFIA na konkrétny produkt."
    },
    "kind": "kozmetika"
  },
  "pravaja": {
    "brand": "PraváJá",
    "web": "https://pravaja.cz/",
    "products": [
      "Městský Detox – čistiace pleťové sérum 50 ml",
      "Neroli Rosa – koncentrované hydratačné sérum 50 ml",
      "Obnova Krásy – regeneračné pleťové sérum 50 ml",
      "Krémová Hydratace – pleťový krém 50 ml",
      "Korálový Jas – botanické anti-age sérum 50 ml",
      "Jantarová Rosa – hydratačné anti-age sérum 50 ml",
      "Noční Hyacint – nočné olejové sérum 50 ml",
      "Napravující Koncentrát – pleťové SOS sérum 50 ml"
    ],
    "fallback": {
      "dry": "Pri suchej pleti značka radí dvojicu Obnova Krásy a Krémová Hydratace. Výber starostlivosti ešte zohľadní, či chcete krém, sérum alebo olej.",
      "oily": "Pri mastnej pleti je smer Městský Detox a Neroli Rosa. Výber ešte spresní vašu hlavnú prioritu.",
      "sensitive": "Pri citlivejšej pleti je z ponuky vhodný Napravující Koncentrát. Ak pokožka výrazne alebo dlhodobo reaguje, konzultujte starostlivosť s odborníkom.",
      "mature": "Pre zrelšiu pleť je smer Korálový Jas alebo Jantarová Rosa. Výber starostlivosti ešte zohľadní, ako komplexnú rutinu chcete.",
      "default": "Ak neviete, kde začať, prejdite Výber starostlivosti. Štyri krátke kroky zúžia ponuku PraváJá na konkrétny produkt."
    },
    "kind": "kozmetika"
  },
  "caltha": {
    "brand": "CALTHA",
    "web": "https://www.caltha.cz/",
    "products": [
      "Hydratačný pleťový krém MEDUŇKOVÝ 50 ml",
      "Hydratačný pleťový krém RŮŽOVÝ 50 ml",
      "Krém na problematickú pleť HŘEBÍČKOVÝ 50 ml",
      "Pleťový krém proti vráskam S KYSELINOU HYALURÓNOVOU 50 ml",
      "Pleťový krém RÝŽOVÝ s koenzýmom Q10 50 ml",
      "Anti-age sérum HYDROKOMPLEX s kyselinou hyalurónovou",
      "Čistiace mlieko ALOE VERA gél a LEVANDUĽA 100 ml",
      "Pleťové tonikum BÍLÁ RŮŽE"
    ],
    "fallback": {
      "dry": "Pri suchej pleti je z ponuky CALTHA dobrý smer hydratačný krém MEDUŇKOVÝ alebo RŮŽOVÝ. Výber starostlivosti ešte zohľadní, či chcete jeden krok alebo celú rutinu.",
      "oily": "Pri mastnejšej a problematickej pleti je určený krém HŘEBÍČKOVÝ, ľahký je aj krém s kyselinou hyalurónovou. Výber ešte spresní vašu hlavnú prioritu.",
      "sensitive": "Pri citlivej pleti je dobrý smer meduňkový krém, čistiace mlieko s levanduľou a tonikum z bielej ruže. Ak pokožka výrazne alebo dlhodobo reaguje, konzultujte starostlivosť s odborníkom.",
      "mature": "Pre zrelšiu pleť je smer RÝŽOVÝ krém s Q10, krém s kyselinou hyalurónovou a anti-age sérum HYDROKOMPLEX. Výber starostlivosti ešte zohľadní, ako komplexnú rutinu chcete.",
      "default": "Ak neviete, kde začať, prejdite Výber starostlivosti. Štyri krátke kroky zúžia ponuku CALTHA na konkrétny produkt."
    },
    "kind": "kozmetika"
  },
  "zahir": {
    "brand": "ZAHIR Cosmetics",
    "web": "https://www.zahir.cz/",
    "products": [
      "BIO Arganový olej s kvapkadlom 50 ml",
      "Luxusný BIO opunciový olej 15 ml",
      "Šípkový pleťový olej BIO 30 ml",
      "Višňový pleťový olej BIO 30 ml",
      "Jojobový olej 50 ml",
      "Harmančeková voda 100 ml",
      "Ružová voda s rozprašovačom 100 ml",
      "Odličovací olej na odolný make-up 100 ml"
    ],
    "fallback": {
      "dry": "Pri suchej pleti je z ponuky ZAHIR dobrý smer BIO arganový olej, pod neho ružová voda. Výber starostlivosti ešte zohľadní, či chcete jeden krok alebo celú rutinu.",
      "oily": "Pri mastnejšej pleti je vhodný jojobový olej, ktorý je blízky kožnému mazu, a harmančeková voda ako tonikum. Výber ešte spresní vašu hlavnú prioritu.",
      "sensitive": "Pri citlivej pleti je dobrý smer višňový olej a harmančeková voda. Ak pokožka výrazne alebo dlhodobo reaguje, konzultujte starostlivosť s odborníkom.",
      "mature": "Pre zrelšiu pleť je smer opunciový olej alebo šípkový pleťový olej, s ružovou vodou ako podkladom. Výber starostlivosti ešte zohľadní, ako komplexnú rutinu chcete.",
      "default": "Ak neviete, kde začať, prejdite Výber starostlivosti. Štyri krátke kroky zúžia ponuku ZAHIR na konkrétny olej."
    },
    "kind": "kozmetika"
  },
  "pimpinella": {
    "brand": "Pimpinella",
    "web": "https://www.pimpinella.co/",
    "products": [
      "MILÁČEK pleťový krém s pomarančom a ylang-ylang 30 ml",
      "PURA BELEZA pleťový krém s ružou damascénskou 30 ml",
      "HEŘMÁNKOVÝ pleťový krém s BIO bambuckým maslom 30 ml",
      "MEIA-NOITE výživný pleťový balzam 30 ml",
      "BOŽSKÝ pleťový olej s vitamínom C 30 ml",
      "ZAHRADA DÉVŮ pleťový olej s neroli 30 ml",
      "DEVĚT NOCÍ čistiaci balzam 50 ml",
      "KVĚTOVÁ VODA RŮŽE BIO 100 ml"
    ],
    "fallback": {
      "dry": "Pri suchej pleti je z ponuky Pimpinella dobrý smer výživný balzam MEIA-NOITE alebo krém PURA BELEZA. Výber starostlivosti ešte zohľadní, či chcete krém alebo olej.",
      "oily": "Pri mastnejšej pleti je vhodný olej BOŽSKÝ s vitamínom C, ktorý upravuje tvorbu mazu, alebo ľahký krém MILÁČEK. Výber ešte spresní vašu hlavnú prioritu.",
      "sensitive": "Pri citlivej pleti je dobrý smer HEŘMÁNKOVÝ krém a ružová kvetová voda. Ak pokožka výrazne alebo dlhodobo reaguje, konzultujte starostlivosť s odborníkom.",
      "mature": "Pre zrelšiu pleť je smer krém PURA BELEZA a olej ZAHRADA DÉVŮ s neroli. Výber starostlivosti ešte zohľadní, ako komplexnú rutinu chcete.",
      "default": "Ak neviete, kde začať, prejdite Výber starostlivosti. Štyri krátke kroky zúžia ponuku Pimpinella na konkrétny produkt."
    },
    "kind": "kozmetika"
  },
  "biorythme": {
    "brand": "Biorythme",
    "web": "https://www.biorythme.cz/",
    "products": [
      "Osviežujúci krém na mastnú pleť – citrónová medovka, BIO chia olej 30 ml",
      "Relaxačný krém pre zmiešanú pleť – arganový olej, levanduľa 30 ml",
      "Krém „Anti-pupínek“ – konopný olej, šalvia, materina dúška, tea tree 30 ml",
      "Krém pre citlivú pleť – olej z granátového jablka a melónových semienok 30 ml",
      "Krém pre zrelú pleť – Zmyselná a verná sama sebe 30 ml",
      "Voňavý krém pre suchú pleť – kakaové maslo, vanilka 30 ml",
      "Harmonizujúce tonikum pre zmiešanú a mastnú pleť 100 ml",
      "Upokojujúce tonikum pre zregenerovanú, spokojnú pleť 100 ml"
    ],
    "fallback": {
      "dry": "Pri suchej pleti je z ponuky Biorythme určený voňavý krém s kakaovým maslom a vanilkou. Výber starostlivosti ešte zohľadní, či chcete jeden krok alebo celú rutinu.",
      "oily": "Pri mastnejšej pleti je určený osviežujúci krém s citrónovou medovkou, pri pupienkoch krém Anti-pupínek, k tomu harmonizujúce tonikum. Výber ešte spresní vašu hlavnú prioritu.",
      "sensitive": "Pri citlivej pleti je určený krém s olejom z granátového jablka a upokojujúce probiotické tonikum. Ak pokožka výrazne alebo dlhodobo reaguje, konzultujte starostlivosť s odborníkom.",
      "mature": "Pre zrelšiu pleť je určený krém Zmyselná a verná sama sebe. Výber starostlivosti ešte zohľadní, ako komplexnú rutinu chcete.",
      "default": "Ak neviete, kde začať, prejdite Výber starostlivosti. Štyri krátke kroky zúžia ponuku Biorythme na konkrétny krém a tonikum."
    },
    "kind": "kozmetika"
  },
  "purity": {
    "brand": "Purity Vision",
    "web": "https://www.purityvision.cz/",
    "products": [
      "Bio Hydro2 sérum 30 ml",
      "Bio Niacinamide sérum 30 ml",
      "Bio Retinol sérum 30 ml",
      "Bio Vitamin C sérum 30 ml",
      "Bio Levanduľový krém upokojujúci 40 ml",
      "Bio Ružový krém omladzujúci 40 ml",
      "Bio Hydro2 oil & serum 2in1 30 ml",
      "Bio Ružové tonikum 100 ml",
      "Bio Nechtíková čistiaca pena 90 ml"
    ],
    "fallback": {
      "dry": "Pri suchej pleti je z ponuky Purity Vision dobrý smer Bio Hydro2 sérum alebo Hydro2 oil & serum 2in1. Výber starostlivosti ešte zohľadní, či chcete sérum, olej alebo krém.",
      "oily": "Pri mastnejšej pleti je vhodné Bio Niacinamide sérum a ľahký levanduľový krém. Výber ešte spresní vašu hlavnú prioritu.",
      "sensitive": "Pri citlivej pleti je dobrý smer levanduľový upokojujúci krém a nechtíková čistiaca pena. Ak pokožka výrazne alebo dlhodobo reaguje, konzultujte starostlivosť s odborníkom.",
      "mature": "Pre zrelšiu pleť je smer Bio Retinol sérum a Ružový krém omladzujúci. Výber starostlivosti ešte zohľadní, ako komplexnú rutinu chcete.",
      "default": "Ak neviete, kde začať, prejdite Výber starostlivosti. Štyri krátke kroky zúžia ponuku Purity Vision na konkrétne sérum či krém."
    },
    "kind": "kozmetika"
  },
  "indivo": {
    "brand": "Indívo",
    "web": "https://www.indivo.cz/",
    "products": [
      "Ľahký bambusový krém 50 ml",
      "Upokojujúci šafránový krém 50 ml",
      "Hydratačný nektár Nezábudka 30 ml",
      "Kalibračné pleťové sérum 30 ml",
      "Rozjasňujúce pleťové sérum 30 ml",
      "Regeneračné sérum Ruža Otto 30 ml",
      "Šľahaný balzam Slamienka 30 ml",
      "Pleťový čistiaci olej",
      "Kvetová voda Levanduľa 60 ml"
    ],
    "fallback": {
      "dry": "Pri suchej pleti je z ponuky Indívo dobrý smer hydratačný nektár Nezábudka a šľahaný balzam Slamienka. Výber starostlivosti ešte zohľadní, či chcete sérum, olej alebo krém.",
      "oily": "Pri mastnejšej pleti je určené Kalibračné pleťové sérum a ľahký bambusový krém, k tomu levanduľová kvetová voda. Výber ešte spresní vašu hlavnú prioritu.",
      "sensitive": "Pri citlivej a podráždenej pleti je dobrý smer upokojujúci šafránový krém. Ak pokožka výrazne alebo dlhodobo reaguje, konzultujte starostlivosť s odborníkom.",
      "mature": "Pre zrelšiu pleť je smer regeneračné sérum Ruža Otto a šafránový krém s koenzýmom Q10. Výber starostlivosti ešte zohľadní, ako komplexnú rutinu chcete.",
      "default": "Ak neviete, kde začať, prejdite Výber starostlivosti. Štyri krátke kroky zúžia ponuku Indívo na konkrétne sérum či krém."
    },
    "kind": "kozmetika"
  },
  "smyssly": {
    "brand": "SMYSSLY",
    "web": "https://www.smyssly.com/cs/",
    "products": [
      "Hodvábny hydratačný krém 50 ml",
      "Perlový výživný krém 50 ml",
      "Sérum kyseliny hyalurónovej 1 % 20 ml",
      "Sérum kyseliny hyalurónovej 4 % 20 ml",
      "Sérum s retinolom 20 ml",
      "Perly pre dokonalú pleť 30 ml",
      "Rozjasňujúce sérum so zlatom 20 ml",
      "Revitalizačná odličovacia voda 150 ml",
      "Hydratačná hmla s kyselinou hyalurónovou 120 ml"
    ],
    "fallback": {
      "dry": "Pri suchej pleti je zo SMYSSLY dobrý smer Perlový výživný krém, pod neho hyalurónové sérum. Výber starostlivosti ešte zohľadní, či chcete jeden krok alebo celú rutinu.",
      "oily": "Pri normálnej až mastnej pleti je určený Hodvábny hydratačný krém s hyalurónovým sérom 1 %. Výber ešte spresní vašu hlavnú prioritu.",
      "sensitive": "Pri citlivej pleti je dobrý smer revitalizačná odličovacia voda bez liehu a Perlový výživný krém. Ak pokožka výrazne alebo dlhodobo reaguje, konzultujte starostlivosť s odborníkom.",
      "mature": "Pre zrelšiu pleť je smer hyalurónové sérum 4 %, sérum s retinolom a Perlový výživný krém. Výber starostlivosti ešte zohľadní, ako komplexnú rutinu chcete.",
      "default": "Ak neviete, kde začať, prejdite Výber starostlivosti. Štyri krátke kroky zúžia ponuku SMYSSLY na konkrétne sérum a krém."
    },
    "kind": "kozmetika"
  },
  "liqoil": {
    "brand": "LIQOIL",
    "web": "https://liqoil.sk/",
    "products": [
      "Denný krém s ceramidmi – Ceramide protecting cream 30 ml",
      "Denný krém – Problem solving cream 30 ml",
      "Nočný krém – Rich velvet boost cream 30 ml",
      "Výživný krém – Active boost rich cream 30 ml",
      "Pleťové sérum – Algae-hyaluronic face serum 30 ml",
      "Pleťové sérum – Probio-peptide face serum 30 ml",
      "Pleťové sérum – Recovery face dry oil 30 ml",
      "Jemný exfoliačný toner – Ferment Renew Toner 200 ml",
      "Denný krém – Antioxidant face cream 30 ml"
    ],
    "fallback": {
      "dry": "Pri suchej pleti je z LIQOIL dobrý smer Denný krém s ceramidmi, pod neho hyalurónové sérum Algae-hyaluronic. Výber starostlivosti ešte zohľadní, či chcete jeden krok alebo celú rutinu.",
      "oily": "Pri mastnej a problematickej pleti je určený Problem solving cream, k nemu jemný exfoliačný toner Ferment Renew. Výber ešte spresní vašu hlavnú prioritu.",
      "sensitive": "Pri citlivej pleti je dobrý smer Denný krém s ceramidmi, ktorý podporuje ochrannú vrstvu pokožky. Ak pokožka výrazne alebo dlhodobo reaguje, konzultujte starostlivosť s odborníkom.",
      "mature": "Pre zrelšiu pleť je smer Active boost rich cream s peptidom a suchý olej Recovery. Výber starostlivosti ešte zohľadní, ako komplexnú rutinu chcete.",
      "default": "Ak neviete, kde začať, prejdite Výber starostlivosti. Štyri krátke kroky zúžia ponuku LIQOIL na konkrétny krém alebo sérum."
    },
    "kind": "kozmetika"
  },
  "muzuri": {
    "brand": "MUZURI",
    "web": "https://muzuri.sk/",
    "products": [
      "RE-HY-AN Výživný krém 30 ml",
      "Hydraserum s kyselinou hyalurónovou 2 % 30 ml",
      "Nightserum Bakuchiol 1 % so skvalanom 30 ml",
      "Cleanser s rastlinnou kyselinou salicylovou 100 ml",
      "Očný krém s peptidmi proti opuchom a tmavým kruhom 15 ml",
      "Enzymatický peeling Ananás & Papája",
      "Organická ružová voda 100 ml"
    ],
    "fallback": {
      "dry": "Pri suchej pleti je z MUZURI dobrý smer Hydraserum s kyselinou hyalurónovou a na neho výživný krém RE-HY-AN. Výber starostlivosti ešte zohľadní, či chcete jeden krok alebo celú rutinu.",
      "oily": "Pri mastnejšej pleti so sklonom k nedokonalostiam je určené Nightserum s bakuchiolom, raz týždenne enzymatický peeling. Výber ešte spresní vašu hlavnú prioritu.",
      "sensitive": "Pri citlivej pleti je dobrý smer ružová voda a Hydraserum bez parfumácie. Ak pokožka výrazne alebo dlhodobo reaguje, konzultujte starostlivosť s odborníkom.",
      "mature": "Pre zrelšiu pleť je smer krém RE-HY-AN, na noc Nightserum s bakuchiolom a očný krém s peptidmi. Výber starostlivosti ešte zohľadní, ako komplexnú rutinu chcete.",
      "default": "Ak neviete, kde začať, prejdite Výber starostlivosti. Štyri krátke kroky zúžia ponuku MUZURI na konkrétne sérum alebo krém."
    },
    "kind": "kozmetika"
  },
  "noili": {
    "brand": "Noili",
    "web": "https://noili.sk/",
    "products": [
      "Peptides & Ferments Hydrating Essence 50 ml",
      "My kind of cream – Antiaging jelly 50 ml",
      "Bakuchiol & Squalane Oil Serum 30 ml",
      "Algae³ Hydralast Serum 30 ml",
      "Repairing PeptiFirm Gel Serum 30 ml",
      "10% C+Squalane Radiance Drops 30 ml",
      "Light Beauty Oil 30 ml",
      "Rich Beauty Oil 30 ml",
      "Bare Balm Cleanser 50 ml"
    ],
    "fallback": {
      "dry": "Pri suchej pleti je z Noili dobrý smer krém My kind of cream a pod neho sérum Algae³ Hydralast. Výber starostlivosti ešte zohľadní, či chcete jeden krok alebo celú rutinu.",
      "oily": "Pri mastnejšej pleti je dobrý začiatok hydratačná esencia Peptides & Ferments a ľahký Light Beauty Oil. Výber ešte spresní vašu hlavnú prioritu.",
      "sensitive": "Pri citlivej pleti je dobrý smer hydratačná esencia s betaglukánom a olejové sérum s bakuchiolom. Ak pokožka výrazne alebo dlhodobo reaguje, konzultujte starostlivosť s odborníkom.",
      "mature": "Pre zrelšiu pleť je smer sérum Repairing PeptiFirm, olejové sérum s bakuchiolom a krém My kind of cream. Výber starostlivosti ešte zohľadní, ako komplexnú rutinu chcete.",
      "default": "Ak neviete, kde začať, prejdite Výber starostlivosti. Štyri krátke kroky zúžia ponuku Noili na konkrétnu esenciu, sérum alebo olej."
    },
    "kind": "kozmetika"
  },
  "mujluj": {
    "brand": "Můj Lůj",
    "web": "https://www.mujluj.cz/",
    "products": [
      "Omladzujúci loj 30 ml",
      "Loj pre čistú pleť 30 ml",
      "Šľahaný loj 30 ml",
      "Levanduľový loj 30 ml",
      "Nechtíkový loj s harmančekom 30 ml",
      "Harmančeková hmla 100 ml",
      "Rozmarínová hmla 100 ml"
    ],
    "fallback": {
      "dry": "Pri suchej pleti je z Můj Lůj dobrý smer Levanduľový loj a k nemu Harmančeková hmla. Výber starostlivosti ešte zohľadní, či chcete jeden krok alebo celú rutinu.",
      "oily": "Pri mastnej a zmiešanej pleti so sklonom k akné je určený Loj pre čistú pleť, k nemu Rozmarínová hmla. Výber ešte spresní vašu hlavnú prioritu.",
      "sensitive": "Pri veľmi citlivej pleti je najšetrnejší Šľahaný loj bez pridanej vône. Ak pokožka výrazne alebo dlhodobo reaguje, konzultujte starostlivosť s odborníkom.",
      "mature": "Pre zrelšiu a unavenú pleť je smer Omladzujúci loj so šípkovým olejom. Výber starostlivosti ešte zohľadní, ako komplexnú rutinu chcete.",
      "default": "Ak neviete, kde začať, prejdite Výber starostlivosti. Štyri krátke kroky zúžia ponuku Můj Lůj na konkrétny krém z loja."
    },
    "kind": "kozmetika"
  },
  "humitics": {
    "brand": "Humitics",
    "web": "https://www.humitics.cz/",
    "products": [
      "Ľahký pleťový krém 50 ml",
      "Pleťové sérum 30 ml",
      "Pleťové tonikum 150 ml",
      "Pleťová maska a peeling 2v1 100 ml",
      "Čistiaci gél 150 ml",
      "Dvojfázový odličovač 200 ml",
      "SOS korektor pre zmiešanú pleť 10 ml",
      "Jemný čistiaci púder/maska 100 ml"
    ],
    "fallback": {
      "dry": "Pri suchej pleti je z Humitics dobrý smer Ľahký pleťový krém a pod neho Pleťové tonikum s kyselinou hyalurónovou. Výber starostlivosti ešte zohľadní, či chcete jeden krok alebo celú rutinu.",
      "oily": "Pri mastnej a zmiešanej pleti je určené Pleťové sérum s kyselinou salicylovou a niacínamidom, na lokálne nedokonalosti SOS korektor. Výber ešte spresní vašu hlavnú prioritu.",
      "sensitive": "Pri citlivej pleti je dobrý smer jemný Čistiaci gél a upokojujúce Pleťové tonikum. Ak pokožka výrazne alebo dlhodobo reaguje, konzultujte starostlivosť s odborníkom.",
      "mature": "Pre zrelšiu pleť Humitics nemá samostatný anti-age rad; základ je Ľahký pleťový krém s tonikom. Výber starostlivosti ešte zohľadní, ako komplexnú rutinu chcete.",
      "default": "Ak neviete, kde začať, prejdite Výber starostlivosti. Štyri krátke kroky zúžia ponuku Humitics na konkrétny krém, sérum alebo čistenie."
    },
    "kind": "kozmetika"
  },
  "skinium": {
    "brand": "Skinium",
    "web": "https://skinium.sk/",
    "products": [
      "HYDRADERM ľahký hydratačný krém",
      "REBADERM ľahký protivráskový a hydratačný krém",
      "MIRACLE CREAM spevňujúci a hydratačný krém s vitamínom C",
      "KOENZYDERM regeneračný krém s koenzýmom Q10",
      "SHEABUDERM krém s bambuckým maslom",
      "HYALURODERM sérum s kyselinou hyalurónovou",
      "PROTECTODERM lipozómové sérum",
      "AHA SERUM zlupovacie sérum",
      "ACNECLEANER Zn čistiaci roztok"
    ],
    "fallback": {
      "dry": "Pri suchej pleti je zo Skinium dobrý smer KOENZYDERM alebo SHEABUDERM, pod krém sérum HYALURODERM. Výber starostlivosti ešte zohľadní, či chcete jeden krok alebo celú rutinu.",
      "oily": "Pri mastnej a problematickej pleti je určený čistiaci roztok ACNECLEANER Zn, AHA sérum a ľahký krém HYDRADERM. Výber ešte spresní vašu hlavnú prioritu.",
      "sensitive": "Pri citlivej pleti so sklonom k začervenaniu je dobrý smer sérum PROTECTODERM a ľahký krém HYDRADERM. Ak pokožka výrazne alebo dlhodobo reaguje, konzultujte starostlivosť s dermatológom.",
      "mature": "Pre zrelšiu pleť je smer REBADERM alebo MIRACLE CREAM s vitamínom C. Výber starostlivosti ešte zohľadní, ako komplexnú rutinu chcete.",
      "default": "Ak neviete, kde začať, prejdite Výber starostlivosti. Štyri krátke kroky zúžia ponuku Skinium na konkrétny krém alebo sérum."
    },
    "kind": "kozmetika"
  },
  "dixi": {
    "brand": "DiXi",
    "web": "https://www.dixi.sk/",
    "products": [
      "Žihľava-Kofeín šampón 400 ml",
      "Anti Dandruff šampón 400 ml",
      "Žĺtkovo-pšeničný šampón 400 ml",
      "Pivonkový šampón 400 ml",
      "Color šampón na farbené vlasy 400 ml",
      "Vlasové tonikum ARVIT proti vypadávaniu vlasov 7× 10 ml",
      "Brezová vlasová voda na mastné vlasy 100 ml",
      "Žihľavová maska na vlasy 300 ml",
      "Regeneračný kondicionér s monoi olejom 200 ml"
    ],
    "fallback": {
      "dry": "Na suché a poškodené vlasy je z DiXi dobrý smer Žĺtkovo-pšeničný šampón, pri farbených vlasoch Color šampón, a k nim Žihľavová maska. Výber starostlivosti ešte zohľadní, koľko krokov chcete.",
      "oily": "Keď sa vlasy rýchlo mastia, pomôže Brezová vlasová voda na mastné vlasy priamo na pokožku hlavy. Výber ešte spresní vašu prioritu.",
      "sensitive": "Pri lupinách je určený Anti Dandruff šampón so slezom, pri citlivej pokožke hlavy jemný Pivonkový šampón. Ak ťažkosti trvajú, poraďte sa s dermatológom.",
      "mature": "Pri vypadávaní vlasov je smer Žihľava-Kofeín šampón a vlasové tonikum ARVIT v ampulkách. Pri výraznom vypadávaní sa poraďte s dermatológom.",
      "default": "Ak neviete, kde začať, prejdite Výber starostlivosti. Štyri krátke kroky zúžia ponuku DiXi na konkrétny šampón, tonikum alebo masku."
    },
    "kind": "vlasy"
  },
  "vivaco": {
    "brand": "Vivaco",
    "web": "https://www.vivaco.sk/",
    "products": [
      "Keratínový šampón s kofeínom VIVAPHARM 200 ml",
      "Šampón s Tea Tree Oil VIVAPHARM 200 ml",
      "Šampón s kozím mliekom VIVAPHARM 400 ml",
      "Bylinný šampón Žihľava HERB EXTRACT 500 ml",
      "Šampón s BIO arganovým olejom BODY TIP 250 ml",
      "Aktivačné vlasové tonikum KOFEIN + AMINEXIL 100 ml",
      "Keratínová maska na vlasy s kofeínom 200 ml",
      "Regeneračná maska s BIO arganovým olejom BODY TIP 650 ml",
      "Keratínový balzam na vlasy s kofeínom 200 ml"
    ],
    "fallback": {
      "dry": "Na suché a lámavé vlasy je z Vivaco dobrý smer Šampón s BIO arganovým olejom, k nemu Keratínová maska alebo Regeneračná maska s arganovým olejom. Výber starostlivosti ešte zohľadní, koľko krokov chcete.",
      "oily": "Keď sa vlasy rýchlo mastia, je určený Bylinný šampón Žihľava HERB EXTRACT, ktorý pokožku nevysušuje. Výber ešte spresní vašu prioritu.",
      "sensitive": "Pri lupinách a svrbení je dobrý smer Šampón s Tea Tree Oil, pri podráždenej a citlivej pokožke hlavy Šampón s kozím mliekom. Ak ťažkosti trvajú, poraďte sa s dermatológom.",
      "mature": "Pri oslabených a rednúcich vlasoch je smer Keratínový šampón s kofeínom a Aktivačné vlasové tonikum KOFEIN + AMINEXIL. Pri výraznom vypadávaní sa poraďte s dermatológom.",
      "default": "Ak neviete, kde začať, prejdite Výber starostlivosti. Štyri krátke kroky zúžia ponuku Vivaco na konkrétny šampón, tonikum alebo masku."
    },
    "kind": "vlasy"
  },
  "kapyderm": {
    "brand": "Kapyderm",
    "web": "https://www.kapyderm.sk/",
    "products": [
      "Šampón na mastné vlasy 250 ml",
      "Šampón na suché vlasy 250 ml",
      "Šampón proti lupinám 250 ml",
      "Šampón proti vypadávaniu vlasov 250 ml",
      "Šampón na citlivú pokožku 250 ml",
      "Kolagénová emulzia (kondicionér) 145 ml",
      "Enzymatické sérum 145 ml",
      "Tonikum Fungi Activ 30 ml",
      "Esenciálny olej K2 30 ml"
    ],
    "fallback": {
      "dry": "Na suché vlasy a pokožku je z Kapydermu určený Šampón na suché vlasy a po ňom Kolagénová emulzia. Výber starostlivosti ešte zohľadní, koľko krokov chcete.",
      "oily": "Keď sa vlasy rýchlo mastia, je určený Šampón na mastné vlasy, ktorý reguluje mazové žľazy. Výber ešte spresní vašu prioritu.",
      "sensitive": "Pri lupinách je smer Šampón proti lupinám a tonikum Fungi Activ, pri citlivej pokožke Šampón na citlivú pokožku. Pri výraznom alebo dlhodobom probléme sa poraďte s trichológom alebo dermatológom.",
      "mature": "Pri vypadávaní vlasov je smer Šampón proti vypadávaniu vlasov a Enzymatické sérum. Pri výraznom vypadávaní odporúčame konzultáciu s trichológom.",
      "default": "Ak neviete, kde začať, prejdite Výber starostlivosti. Štyri krátke kroky zúžia ponuku Kapyderm na konkrétny šampón, emulziu alebo sérum."
    },
    "kind": "vlasy"
  },
  "medarek": {
    "brand": "Medarek",
    "web": "https://www.medarek.cz/",
    "products": [
      "Rozmarínový šampuk s kofeínom 45 g",
      "Lví hriva – šampuk s peptidmi a macou 45 g",
      "Bublinkový šampuk so sviežou mätou 45 g",
      "Oreganový šampuk s manukou a čiernou rascou 45 g",
      "Arganový šampuk s pomarančom 45 g",
      "Lieskový šampuk bez esenciálnych olejov 45 g",
      "Vlasové pohladenie Amla a tiaré – tuhý kondicionér 95 g",
      "Brahmi prášok BIO na vlasové masky 100 g",
      "Kaméliový olej BIO 50 ml"
    ],
    "fallback": {
      "dry": "Na suché vlasy je z Medarku dobrý smer Lieskový alebo Arganový šampuk a tuhý kondicionér Vlasové pohladenie. Výber starostlivosti ešte zohľadní, koľko krokov chcete.",
      "oily": "Keď sa vlasy rýchlo mastia, je určený Bublinkový šampuk so sviežou mätou, ktorý redukuje maz. Výber ešte spresní vašu prioritu.",
      "sensitive": "Pri svrbiacej pokožke hlavy je dobrý smer Oreganový šampuk s manukou a čiernou rascou, pri citlivej Lieskový šampuk bez esenciálnych olejov. Ak ťažkosti trvajú, poraďte sa s dermatológom.",
      "mature": "Pri vypadávaní vlasov je smer Rozmarínový šampuk s kofeínom, pri svetlých vlasoch Lví hriva. Pri výraznom vypadávaní sa poraďte s dermatológom.",
      "default": "Ak neviete, kde začať, prejdite Výber starostlivosti. Štyri krátke kroky zúžia ponuku Medarek na konkrétny šampuk alebo kondicionér."
    },
    "kind": "vlasy"
  },
  "andreine": {
    "brand": "Andreine",
    "web": "https://andreine.com/",
    "products": [
      "Šampón na rast vlasov Growth shampoo",
      "Šampón na objem vlasov Volume shampoo",
      "Šampón pre suché a poškodené vlasy Velvet shampoo",
      "Hydratačný šampón Shine shampoo",
      "Tonikum pre rast vlasov Growth tonic",
      "Tonikum pre problematickú pokožku hlavy Infusion tonic",
      "Hydratačná maska na suché vlasy Hydration mask",
      "Proteínová maska na oslabené vlasy Protein mask",
      "Kondicionér pre jemné a elektrizujúce vlasy Leave-in Fruit",
      "Olej na vlasy a pleť Treatment oil"
    ],
    "fallback": {
      "dry": "Na suché a poškodené vlasy je z Andreine určený Velvet shampoo, k nemu Hydration mask alebo Treatment oil. Výber starostlivosti ešte zohľadní, koľko krokov chcete.",
      "oily": "Keď sa vlasy rýchlo mastia a strácajú objem, je dobrý smer Volume shampoo a ľahký Leave-in Fruit. Výber ešte spresní vašu prioritu.",
      "sensitive": "Pri lupinách, svrbení a podráždenej pokožke hlavy je určené Infusion tonic. Ak ťažkosti trvajú, poraďte sa s dermatológom alebo trichológom.",
      "mature": "Pri vypadávaní a rednutí vlasov je smer Growth shampoo a Growth tonic priamo na pokožku hlavy. Pri výraznom vypadávaní sa poraďte s trichológom.",
      "default": "Ak neviete, kde začať, prejdite Výber starostlivosti. Štyri krátke kroky zúžia ponuku Andreine na konkrétny šampón, tonikum alebo masku."
    },
    "kind": "vlasy"
  },
  "voono": {
    "brand": "VOONO",
    "web": "https://www.voono.sk/",
    "products": [
      "Šampón pre objem vlasov s keratínom 390 ml",
      "Šampón pre mastné vlasy ORGANIC LINE",
      "Šampón pre suché, poškodené a vlnité vlasy ORGANIC LINE",
      "VOONO Tricholog – bylinný detox pokožky hlavy",
      "Brezový oplach pre zdravé a lesklé vlasy",
      "Citrusový kondicionér pre mastiace sa a jemné vlasy 370 ml",
      "Keratínový kondicionér pre objem a lesk 390 ml",
      "15-minútová vyživujúca maska ORGANIC LINE",
      "Mango balzam na suché a rozstrapkané končeky"
    ],
    "fallback": {
      "dry": "Na suché a poškodené vlasy je z VOONO dobrý smer Šampón pre suché, poškodené a vlnité vlasy ORGANIC LINE a 15-minútová vyživujúca maska. Výber starostlivosti ešte zohľadní, koľko krokov chcete.",
      "oily": "Keď sa vlasy rýchlo mastia, je určený Šampón pre mastné vlasy ORGANIC LINE a ľahký Citrusový kondicionér. Výber ešte spresní vašu prioritu.",
      "sensitive": "Pri problematickej pokožke hlavy je dobrý smer bylinný VOONO Tricholog alebo Brezový oplach, ktorý upokojí podráždenie. Ak ťažkosti trvajú, poraďte sa s dermatológom.",
      "mature": "Pri slabých vlasoch je smer Brezový oplach, ktorý prekrví pokožku hlavy, a bylinný Tricholog. Pri výraznom vypadávaní sa poraďte s dermatológom.",
      "default": "Ak neviete, kde začať, prejdite Výber starostlivosti. Štyri krátke kroky zúžia ponuku VOONO na konkrétny šampón, kondicionér alebo kúru."
    },
    "kind": "vlasy"
  },
  "navlasil": {
    "brand": "NAVLASIL",
    "web": "https://www.navlasil.sk/",
    "products": [
      "Šampón NAVLASIL pre jemné vlasy 250 ml",
      "Šampón NAVLASIL pre suché a lámavé vlasy 250 ml",
      "Šampón NAVLASIL pre farbené a melírované vlasy 250 ml",
      "Šampón NAVLASIL pre normálne vlasy 250 ml",
      "Sérum NAVLASIL proti vypadávaniu a šediveniu vlasov",
      "Vlasové sérum NAVLASIL s peptidmi medi",
      "Detoxikačné tonikum NAVLASIL pre vlasovú pokožku 50 ml",
      "Vyživujúca proteínová maska NAVLASIL",
      "Predšampónová olejová kúra NAVLASIL s arganovým a tsubaki olejom"
    ],
    "fallback": {
      "dry": "Na suché a lámavé vlasy je z NAVLASIL určený Šampón pre suché a lámavé vlasy a pred umytím Predšampónová olejová kúra. Výber starostlivosti ešte zohľadní, koľko krokov chcete.",
      "oily": "Keď sa vlasy rýchlo mastia, pomôže Detoxikačné tonikum pre vlasovú pokožku a ľahký Šampón pre normálne vlasy. Výber ešte spresní vašu prioritu.",
      "sensitive": "Pri citlivej a svrbiacej pokožke hlavy je dobrý smer Detoxikačné tonikum NAVLASIL, ktoré pokožku vyčistí a upokojí. Ak ťažkosti trvajú, poraďte sa s dermatológom.",
      "mature": "Pri vypadávaní vlasov je smer Sérum NAVLASIL proti vypadávaniu a šediveniu vlasov a Šampón pre jemné vlasy. Pri výraznom vypadávaní sa poraďte s dermatológom alebo trichológom.",
      "default": "Ak neviete, kde začať, prejdite Výber starostlivosti. Štyri krátke kroky zúžia ponuku NAVLASIL na konkrétny šampón, sérum alebo masku."
    },
    "kind": "vlasy"
  },
  "ryor": {
    "brand": "RYOR",
    "web": "https://www.ryor.sk/",
    "products": [
      "RESTART – posilňujúci šampón pre poškodené a farbené vlasy 200 ml",
      "Šampón s ukľudňujúcim efektom 200 ml",
      "Bylinný šampón s panthenolom 200 ml",
      "Pivný šampón s keratínom 250 ml",
      "Urýchľovač rastu vlasov – 3-mesačná kúra 250 ml",
      "RESTART – posilňujúci kondicionér pre poškodené a farbené vlasy 200 ml",
      "RESTART – posilňujúca maska pre poškodené a farbené vlasy 250 ml",
      "Vlasový keratín sprej 250 ml",
      "Regeneračný kondicionér s panthenolom 200 ml"
    ],
    "fallback": {
      "dry": "Na suché a farbené vlasy je z RYOR určená rada RESTART — posilňujúci šampón, kondicionér a maska. Výber starostlivosti ešte zohľadní, koľko krokov chcete.",
      "oily": "Keď vlasy rýchlo splasnú a mastia sa, je dobrý smer Pivný šampón s keratínom, ktorý dodá objem a pevnosť. Výber ešte spresní vašu prioritu.",
      "sensitive": "Pri citlivej, začervenanej alebo svrbiacej pokožke hlavy je určený Šampón s ukľudňujúcim efektom. Ak ťažkosti trvajú, poraďte sa s dermatológom.",
      "mature": "Pri slabých vlasoch je smer Urýchľovač rastu vlasov – 3-mesačná kúra a k nemu Bylinný šampón s panthenolom. Pri výraznom vypadávaní sa poraďte s dermatológom.",
      "default": "Ak neviete, kde začať, prejdite Výber starostlivosti. Štyri krátke kroky zúžia ponuku RYOR na konkrétny šampón, kúru alebo kondicionér."
    },
    "kind": "vlasy"
  },
  "venira": {
    "brand": "Venira",
    "web": "https://www.venira.sk/",
    "products": [
      "Prírodný šampón pre podporu rastu vlasov 300 ml",
      "Prírodný šampón s kolagénom pre podporu rastu vlasov 300 ml",
      "Prírodný šampón pre mastné vlasy 300 ml",
      "Prírodný šampón pre objem vlasov Volume Booster 300 ml",
      "Šampón na kučeravé vlasy 300 ml",
      "Hair Booster – vlasové sérum na podporu rastu 100 ml",
      "Rozmarínová voda / tonikum na vlasy a pokožku 200 ml",
      "Regeneračná maska na vlasy 300 ml",
      "Kondicionér s kolagénom 300 ml"
    ],
    "fallback": {
      "dry": "Na suché a poškodené vlasy je z Veniry dobrý smer Regeneračná maska na vlasy, pri kučerách Šampón na kučeravé vlasy. Výber starostlivosti ešte zohľadní, koľko krokov chcete.",
      "oily": "Keď sa vlasy rýchlo mastia, je určený Prírodný šampón pre mastné vlasy, ktorý reguluje tvorbu mazu. Pri splihnutých vlasoch pomôže šampón Volume Booster.",
      "sensitive": "Pri citlivej a podráždenej pokožke hlavy je dobrý smer Rozmarínová voda a šetrný Prírodný šampón s kolagénom. Ak ťažkosti trvajú, poraďte sa s dermatológom.",
      "mature": "Pri slabých a rednúcich vlasoch je smer Prírodný šampón pre podporu rastu vlasov a sérum Hair Booster. Pri výraznom vypadávaní sa poraďte s dermatológom.",
      "default": "Ak neviete, kde začať, prejdite Výber starostlivosti. Štyri krátke kroky zúžia ponuku Venira na konkrétny šampón, sérum alebo masku."
    },
    "kind": "vlasy"
  },
  "havlikova": {
    "brand": "Havlík Apoteka",
    "web": "https://www.havlikovaapoteka.cz/sk/",
    "products": [
      "Cibuľovo-fazuľový šampón na tmavé vlasy 200 ml",
      "Cibuľovo-fazuľový šampón na svetlé vlasy 200 ml",
      "Havlíkov šampón 13 rastlín 200 ml",
      "Jemný vlasový šampón pre suché vlasy 200 ml",
      "Vlasové tonikum 200 ml",
      "Rozmarínové tonikum na vlasy 200 ml",
      "Cibuľovo-fazuľové vlasové sérum 30 ml",
      "Cibuľovo-fazuľová vlasová maska 100 ml",
      "Vlasové sérum Kyselina hyalurónová 50 ml"
    ],
    "fallback": {
      "dry": "Na suché a poškodené vlasy je z Havlík Apoteka dobrý smer Jemný vlasový šampón pre suché vlasy, na končeky Vlasové sérum Kyselina hyalurónová. Výber starostlivosti ešte zohľadní, koľko krokov chcete.",
      "oily": "Keď sa vlasy rýchlo mastia, pomôže Vlasové tonikum z 10 bylín, ktoré normalizuje maz na pokožke hlavy; k nemu ľahká Cibuľovo-fazuľová maska. Výber ešte spresní vašu prioritu.",
      "sensitive": "Pri svrbiacej a citlivej pokožke hlavy je určené Vlasové tonikum alebo Rozmarínové tonikum, ktoré pokožku upokojí a hydratuje. Ak ťažkosti trvajú, poraďte sa s dermatológom.",
      "mature": "Pri slabých a vypadávajúcich vlasoch je smer rad Vlasový opravář — Cibuľovo-fazuľový šampón na svetlé alebo tmavé vlasy a Cibuľovo-fazuľové vlasové sérum. Pri výraznom vypadávaní sa poraďte s dermatológom.",
      "default": "Ak neviete, kde začať, prejdite Výber starostlivosti. Štyri krátke kroky zúžia ponuku Havlík Apoteka na konkrétny šampón, tonikum alebo sérum."
    },
    "kind": "vlasy"
  },
  "haaro": {
    "brand": "Haaro Naturo",
    "web": "https://www.haaro-naturo.cz/",
    "products": [
      "Postbiotický šampón na jemné vlasy 100 g",
      "Postbiotický šampón na lupiny a mastné vlasy 100 g",
      "Postbiotický šampón na silné a kučeravé vlasy 100 g",
      "Tuhý šampón na mastné vlasy 100 g",
      "Tuhý šampón na uhladenie 100 g",
      "Sérum na suchú pokožku hlavy Lipa-mäta 100 ml",
      "Sérum na mastnú pokožku a lupiny Orech-dub 100 ml",
      "Ľahký kondicionér na jemné vlasy",
      "Suchý vlasový olej 50 ml"
    ],
    "fallback": {
      "dry": "Na suché a krepovaté vlasy je z Haaro Naturo dobrý smer Tuhý šampón na uhladenie, k nemu Suchý vlasový olej na dĺžky. Výber starostlivosti ešte zohľadní, či chcete jeden krok alebo celú starostlivosť.",
      "oily": "Keď sa vlasy rýchlo mastia, siahnite po Tuhom šampóne na mastné vlasy; pri svrbení a lupinách po Postbiotickom šampóne na lupiny a mastné vlasy. Výber ešte spresní vašu prioritu.",
      "sensitive": "Pri citlivej pokožke hlavy a lupinách je určený Postbiotický šampón na lupiny a mastné vlasy a sérum Orech-dub, pri suchej pokožke sérum Lipa-mäta. Ak ťažkosti trvajú, poraďte sa s dermatológom.",
      "mature": "Pri slabších a jemných vlasoch je dobrý začiatok Postbiotický šampón na jemné vlasy s postbiotikami pre zdravé prostredie pokožky hlavy. Pri výraznom vypadávaní sa poraďte s dermatológom.",
      "default": "Ak neviete, kde začať, prejdite Výber starostlivosti. Štyri krátke kroky zúžia ponuku Haaro Naturo na konkrétny šampón, sérum alebo kondicionér."
    },
    "kind": "vlasy"
  },
  "nechory": {
    "brand": "Vinařství Nechory",
    "web": "https://eshop.vinarstvinechory.cz/",
    "products": [
      "Sauvignon Blanc 2025, pozdní sběr, suché",
      "Veltlínské zelené 2024, pozdní sběr, suché",
      "Chardonnay 2024, pozdní sběr, suché",
      "Muškát Ottonel 2024, pozdní sběr, polosladké",
      "Pálava 2024, výběr z hroznů, polosladké",
      "Tramín červený 2023, výběr z hroznů, polosladké",
      "Rulandské modré rosé 2024, pozdní sběr, polosuché",
      "Rulandské modré 2023, výběr z hroznů, suché",
      "Cabernet Sauvignon RESERVE 2021, pozdní sběr, suché",
      "Cuvée Catherine OAK 2023, výběr z hroznů, suché",
      "Riesling Select BRUT 2023, klasická metoda",
      "Euphoria Sparkling 2025, perlivé, polosuché"
    ],
    "fallback": {
      "white": "K rybe a ľahkým jedlám je z Nechor dobrý smer suchý Sauvignon Blanc 2025 alebo Veltlínské zelené 2024, na leto aj Rulandské modré rosé. Vo Výbere vína nájdem aj ďalšie.",
      "red": "K mäsu a zverine odporúčam Cabernet Sauvignon RESERVE 2021, jemnejšie je Rulandské modré 2023. Výber vína ešte zohľadní vašu chuť.",
      "sweet": "Ak máte radi sladšie, skúste polosladkú Pálavu 2024 alebo Tramín červený 2023 k dezertom.",
      "gift": "Na darček sa hodí Cuvée Catherine OAK 2023 alebo sekt Riesling Select BRUT 2023. Vo Výbere vína zohľadníme, čo má obdarovaný rád.",
      "default": "Ak neviete, kde začať, prejdite Výber vína. Štyri krátke otázky zúžia ponuku Vinařství Nechory na konkrétne víno."
    },
    "kind": "vino"
  },
  "volarik": {
    "brand": "Vinařství Volařík",
    "web": "https://www.vinarstvivolarik.cz/cs/eshop/",
    "products": [
      "Veltlínské zelené, pozdní sběr 2024, Věstonsko",
      "Ryzlink vlašský, pozdní sběr 2025, Zimní vrch",
      "Ryzlink rýnský, pozdní sběr 2025, Zimní vrch",
      "Muškát moravský, moravské zemské víno 2025, Refresh",
      "Sauvignon, pozdní sběr 2025, Na Statkách",
      "Pálava, pozdní sběr 2025, U Boží muky",
      "Tramín červený, výběr z hroznů 2024, Plotny",
      "Ryzlink vlašský, výběr z hroznů 2024, terroir Kotelná",
      "Veltlínské zelené, výběr z hroznů 2024, terroir Věstonsko",
      "Pálava, výběr z hroznů 2024, terroir U Venuše",
      "Tramín kořenný, výběr z hroznů 2024, Pod Slunným vrchem",
      "Pálava, výběr z bobulí 2024, Purmice",
      "Ryzlink rýnský, výběr z cibéb 2021, Ořechová hora (0,5 l)",
      "Cabernet Sauvignon, výběr z hroznů 2022, Turold",
      "Frankovka rosé, pozdní sběr 2025, Plotny",
      "Merlot rosé, výběr z hroznů 2025, Pod Valtickou",
      "Perlivée, růžové cuvée 2025, polosladké",
      "Perlivée, bílé cuvée 2025, suché",
      "Sekt Volařík - Ryzlink vlašský 2021, extra brut"
    ],
    "fallback": {
      "white": "K rybe a ľahkým jedlám je od Volaříkovcov dobrý smer Veltlínské zelené 2024 z Věstonska alebo Ryzlink vlašský zo Zimního vrchu; pre výnimočnú chvíľu terroir Kotelná. Vo Výbere vína nájdem aj ďalšie.",
      "red": "Volařík robí hlavne biele vína; z červených má v ponuke Cabernet Sauvignon 2022 z trate Turold, zrelý v barikových sudoch. K mäsu sa hodí aj plnší Tramín červený z Plotien.",
      "sweet": "Ak máte radi sladšie, skúste Pálavu výber z bobulí 2024, Ryzlink rýnský výber z cibéb 2021 alebo polosladký Tramín kořenný 2024.",
      "gift": "Na darček sa hodí Cabernet Sauvignon 2022 Turold, Pálava terroir U Venuše alebo Sekt Volařík. Vo Výbere vína zohľadníme, čo má obdarovaný rád.",
      "default": "Ak neviete, kde začať, prejdite Výber vína. Štyri krátke otázky zúžia ponuku Vinařství Volařík na konkrétne víno."
    },
    "kind": "vino"
  },
  "gotberg": {
    "brand": "Vinařství Gotberg",
    "web": "https://gotberg.cz/cs/eshop/",
    "products": [
      "Ryzlink rýnský pozdní sběr 2024, suché",
      "Chardonnay pozdní sběr 2024, suché",
      "Sauvignon pozdní sběr 2024, suché",
      "Sylvánské zelené kabinet 2025, polosuché",
      "Ryzlink rýnský BIO pozdní sběr 2025, polosuché",
      "Muškát moravský pozdní sběr 2022, polosuché",
      "Pálava pozdní sběr 2025, suché",
      "Rulandské šedé pozdní sběr 2024, suché",
      "Chardonnay barrique pozdní sběr 2024, suché",
      "Tramín červený pozdní sběr 2024, polosuché",
      "Tramín červený BIO pozdní sběr 2023, polosuché",
      "Pálava BIO výběr z hroznů 2024, polosladké",
      "Pálava výběr z hroznů 2022, polosladké",
      "Pálava výběr z cibéb 2022, sladké",
      "Pálava slámové víno 2023, sladké",
      "Frankovka výběr z hroznů 2023, suché",
      "Merlot výběr z hroznů 2024, suché",
      "Pinot Noir výběr z hroznů 2019, suché",
      "Frizzante perlivé víno 2025, suché"
    ],
    "fallback": {
      "white": "K rybe a ľahkým jedlám je od Gotbergu dobrý smer suchý Ryzlink rýnský 2024 alebo Sauvignon 2024; plnšie je Chardonnay barrique. Vo Výbere vína nájdem aj ďalšie.",
      "red": "K mäsu odporúčam Merlot 2024 alebo Pinot Noir 2019, ovocnejšia je Frankovka 2023. Výber vína ešte zohľadní vašu chuť.",
      "sweet": "Ak máte radi sladšie, skúste polosladkú Pálavu výber z hroznů 2022 s medailami, Pálavu výber z cibéb alebo slamové víno.",
      "gift": "Na darček sa hodí Pálava výber z cibéb, slamové víno z Pálavy alebo Pinot Noir 2019. Vo Výbere vína zohľadníme, čo má obdarovaný rád.",
      "default": "Ak neviete, kde začať, prejdite Výber vína. Štyri krátke otázky zúžia ponuku Vinařství Gotberg na konkrétne víno."
    },
    "kind": "vino"
  },
  "karpatskaperla": {
    "brand": "Karpatská perla",
    "web": "https://www.karpatskaperla.sk/produkty",
    "products": [
      "Veltlínske zelené 2025, suché",
      "Sauvignon Blanc, BIO 2025, suché",
      "Rizling rýnsky, BIO 2025, suché",
      "Muškát moravský 2025, suché",
      "Svetové Noviny 2023, suché",
      "Silvánske zelené, BIO 2023, suché",
      "Pinot Gris, BIO 2025, suché",
      "Rizling rýnsky, Kramáre, BIO 2025, suché",
      "Veltlínske zelené, Noviny, BIO 2024, suché",
      "Tramín červený 2022, suché",
      "4 ŽIVLY biele 2022, suché",
      "Devín, BIO 2025, polosuché",
      "Veltlínske zelené, Ingle, BIO 2024, polosuché",
      "Pálava, BIO 2025, polosladké",
      "Rizling rýnsky, Suchý vrch, BIO 2025, polosladké",
      "Devín, BIO 2023, bobuľový výber, sladké",
      "Aurelius 2019, hrozienkový výber, sladké",
      "Veltlínske zelené 2020, ľadové víno, sladké",
      "Frankovka modrá 2022, suché",
      "Dunaj, BIO 2024, suché",
      "Pinot Noir 2021, suché",
      "Alibernet 2019, suché",
      "Cabernet Sauvignon 2022, suché",
      "4 ŽIVLY červené 2021, suché",
      "Cabernet Sauvignon 2011, archívne",
      "4 ŽIVLY červené 2007, archívne víno",
      "Frankovka modrá rosé, BIO 2025, suché",
      "FRIZZANTE Rizling rýnsky 2025, polosuché",
      "PétNat Sauvignon Blanc 2025",
      "Sekt Pinot Noir 2022, extra dry"
    ],
    "fallback": {
      "white": "K rybe a ľahkým jedlám je od Karpatskej perly dobrý smer BIO Sauvignon Blanc 2025 alebo Silvánske zelené zo Starých hôr; plnší je Rizling rýnsky z Kramárov. Vo Výbere vína nájdem aj ďalšie.",
      "red": "K mäsu odporúčam cuvée 4 ŽIVLY červené 2021 alebo Cabernet Sauvignon 2022 z barikov; ľahší je BIO Dunaj či Pinot Noir. Výber vína ešte zohľadní vašu chuť.",
      "sweet": "Ak máte radi sladšie, skúste polosladkú BIO Pálavu 2025, Rizling rýnsky zo Suchého vrchu alebo sladký Aurelius 2019.",
      "gift": "Na darček sa hodí archívne 4 ŽIVLY 2007, Cabernet Sauvignon 2011, ľadové víno 2020 alebo Sekt Pinot Noir. Vo Výbere vína zohľadníme, čo má obdarovaný rád.",
      "default": "Ak neviete, kde začať, prejdite Výber vína. Štyri krátke otázky zúžia ponuku Karpatskej perly na konkrétne víno."
    },
    "kind": "vino"
  },
  "ukaplicky": {
    "brand": "Vinařství U Kapličky",
    "web": "https://eshop.vinarstviukaplicky.cz/",
    "products": [
      "Veltlínské zelené, Fresh Wine 2025, suché",
      "Sauvignon, Fresh Wine 2025, suché",
      "Ryzlink rýnský, Fresh Wine 2025, suché",
      "Hibernal, Fresh Wine 2025, suché",
      "Sylvánské zelené, Selection 2025, suché",
      "Ryzlink vlašský, Selection 2025, suché",
      "Chardonnay, Selection 2025, suché",
      "Rulandské bílé, Dalibor 2025, suché",
      "Ryzlink rýnský, Dalibor 2025, výběr z hroznů, suché",
      "Veltlínské zelené VOC Růžové hory, Dalibor 2024, suché",
      "Kerner, Dalibor 2025, polosuché",
      "Pálava, Fresh Wine 2025, polosladké",
      "Tramín červený, Selection 2025, výběr z hroznů, polosladké",
      "Rulandské šedé, Selection 2025, polosladké",
      "Pálava, Selection 2025, výběr z hroznů, sladké",
      "Pálava, Dalibor 2025, výběr z cibéb, sladké",
      "Pálava, slámové víno 2025",
      "Modrý Portugal, Selection 2024, suché",
      "Zweigeltrebe, Selection 2025, suché",
      "Rulandské modré, Selection 2025, suché",
      "Frankovka, Selection 2024, suché",
      "Cabernet Moravia, Selection 2023, suché",
      "Alibernet, Selection 2025, suché",
      "Cabernet Sauvignon, Selection 2025, suché",
      "Dornfelder, Selection 2025, polosuché",
      "Cabernet Sauvignon, Dalibor 2023, výběr z hroznů, suché",
      "Alibernet, slámové víno 2025",
      "Frankovka rosé, Selection 2025, polosladké",
      "Riesling, Fresh Bubble 2025, suché",
      "Pinot noir rosé, Fresh Bubble 2025, polosladké",
      "Fresh Bubble Rosé 0 %, nealkoholické",
      "Sekt Blanc de Blancs, Dalibor 2023, brut",
      "Sekt Blanc de Noir, Dalibor 2023, sec"
    ],
    "fallback": {
      "white": "K rybe a ľahkým jedlám je od U Kapličky dobrý smer svieži Sauvignon alebo Ryzlink rýnský z línie Fresh Wine; plnší je Veltlín VOC Růžové hory z línie Dalibor. Vo Výbere vína nájdem aj ďalšie.",
      "red": "K mäsu odporúčam Cabernet Sauvignon Dalibor 2023 alebo Frankovku Selection 2024; ľahší je Modrý Portugal. Výber vína ešte zohľadní vašu chuť.",
      "sweet": "Ak máte radi sladšie, skúste polosladkú Pálavu Fresh Wine, Tramín červený Selection alebo slamové víno z Pálavy.",
      "gift": "Na darček sa hodí slamové víno (Pálava alebo Alibernet), Pálava výběr z cibéb či sekt Dalibor. Vo Výbere vína zohľadníme, čo má obdarovaný rád.",
      "default": "Ak neviete, kde začať, prejdite Výber vína. Štyri krátke otázky zúžia ponuku Vinařství U Kapličky na konkrétne víno."
    },
    "kind": "vino"
  },
  "carpatediem": {
    "brand": "Carpate Diem",
    "web": "https://carpatediem.sk/nase-vina/",
    "products": [
      "BIO Müller Thurgau 2025, suché",
      "Rizling vlašský 2025, suché",
      "Viechové víno 2025, suché 1 l",
      "Silvánske zelené 2024, suché",
      "BIO Tramín červený 2025, suché",
      "Cuvée Devín & Pálava 2024, suché",
      "Rizling rýnsky 2024 – LIMITED, suché",
      "Rizling vlašský 2023 – LIMITED, suché",
      "Tramín červený BARIQUE 2020, suché",
      "BIO Devín 2024, polosuché",
      "BIO Pálava 2024, polosladké",
      "BIO Tramín červený 2024, polosladké",
      "Frankovka modrá 2024, suché",
      "BIO Nitria 2024 – LIMITED, suché",
      "BIO Hron rosé 2025, suché",
      "Cabernet Sauvignon rosé 2025, polosuché",
      "Saint Laurent rosé 2024",
      "Frizzante Cabernet Sauvignon 2025, polosuché",
      "Frizzante Muškát moravský 2024, polosuché"
    ],
    "fallback": {
      "white": "K rybe a ľahkým jedlám je od Carpate Diem dobrý smer BIO Müller Thurgau alebo Rizling vlašský 2025; plnší je Tramín červený BARIQUE. Vo Výbere vína nájdem aj ďalšie.",
      "red": "K mäsu odporúčam limitovanú BIO Nitriu 2024 alebo sviežu Frankovku modrú 2024. Výber vína ešte zohľadní vašu chuť.",
      "sweet": "Ak máte radi sladšie, skúste polosladkú BIO Pálavu 2024, BIO Tramín červený 2024 alebo polosuchý BIO Devín.",
      "gift": "Na darček sa hodí limitovaná edícia — Rizling rýnsky, Rizling vlašský alebo Nitria — či Tramín červený BARIQUE 2020. Vo Výbere vína zohľadníme, čo má obdarovaný rád.",
      "default": "Ak neviete, kde začať, prejdite Výber vína. Štyri krátke otázky zúžia ponuku Carpate Diem na konkrétne víno."
    },
    "kind": "vino"
  },
  "vinkor": {
    "brand": "Vinárstvo Vinkor",
    "web": "https://vinkor.sk/obchod/",
    "products": [
      "Pálava 2025, polosuché",
      "Sauvignon 2025, suché",
      "Veltlínske zelené 2025, suché",
      "Rizling rýnsky 2024, suché",
      "Chardonnay 2025, suché",
      "Rulandské šedé 2025, suché",
      "Devín 2025, suché",
      "Pálava 2024, suché",
      "Rulandské šedé 2023, polosladké",
      "Devín 2023, polosladký",
      "Pálava 2024, sladká 0,5 l",
      "Veltlínske zelené 2022, ľadové víno, sladké 0,375 l",
      "Cabernet Sauvignon 2022, suché",
      "Dunaj 2024, suché",
      "Cabernet Sauvignon Rosé 2025, suché",
      "Frizzante Rosé 2024, polosuché",
      "Frizzante 2025, suché",
      "To pravé slovenské — Devín a Dunaj v drevenej kazete",
      "Darček Všetko najlepšie! — 3 suché vína v kazete"
    ],
    "fallback": {
      "white": "K rybe a ľahkým jedlám je od Vinkoru dobrý smer suchý Sauvignon 2025 alebo Rizling rýnsky 2024; plnší je ocenený Devín 2025. Vo Výbere vína nájdem aj ďalšie.",
      "red": "K mäsu odporúčam Cabernet Sauvignon 2022, šampióna Oenofora, alebo Dunaj 2024 so zlatou z AWC Vienna. Výber vína ešte zohľadní vašu chuť.",
      "sweet": "Ak máte radi sladšie, skúste polosuchú Pálavu 2025, polosladký Devín 2023 alebo ľadové Veltlínske zelené 2022.",
      "gift": "Na darček sa hodí kazeta To pravé slovenské, darček Všetko najlepšie! alebo ľadové víno 0,375 l. Vo Výbere vína zohľadníme, čo má obdarovaný rád.",
      "default": "Ak neviete, kde začať, prejdite Výber vína. Štyri krátke otázky zúžia ponuku Vinárstva Vinkor na konkrétne víno."
    },
    "kind": "vino"
  },
  "skrobak": {
    "brand": "Vinařství Škrobák",
    "web": "https://vinoskrobak.cz/internetovy-obchod/",
    "products": [
      "Irsai Oliver 2024, kabinetní, suché",
      "Ryzlink vlašský 2025, pozdní sběr, suché",
      "Ryzlink rýnský 2025, kabinetní, suché",
      "Sylvánské zelené 2024, pozdní sběr, suché",
      "Sauvignon 2023, kabinetní, suché",
      "Hibernal 2025, pozdní sběr, suché",
      "Pálava 2025, pozdní sběr, suché",
      "Rulandské bílé 2023, pozdní sběr, suché",
      "Rulandské šedé 2023, výběr z hroznů, suché",
      "Tramín 2024, pozdní sběr, suché",
      "Tramín 2025, pozdní sběr, polosuché",
      "Aurelius 2022, pozdní sběr, sladké",
      "Solaris 2020, výběr z cibéb, sladké 0,5 l",
      "Ryzlink vlašský / Tramín 2018, ledové, sladké 0,375 l",
      "Frankovka 2018, ledové, sladké 0,375 l",
      "Modrý Portugal 2023, zemské, suché",
      "Frankovka 2021, pozdní sběr, suché",
      "Dornfelder 2025, pozdní sběr, suché",
      "Rulandské modré 2022, pozdní sběr",
      "Alibernet rosé 2025, zemské, polosuché",
      "Frankovka klaret 2023, suché",
      "Frizzante rosé 2023",
      "Muškát moravský Frizzante 2025, polosuché",
      "Blanc de blanc No.1 2022, extra brut"
    ],
    "fallback": {
      "white": "K rybe a ľahkým jedlám je od Škrobáka dobrý smer svieži Irsai Oliver alebo Sauvignon 2023; plnšie je Rulandské šedé zo suda. Vo Výbere vína nájdem aj ďalšie.",
      "red": "K mäsu odporúčam Rulandské modré 2022 alebo Dornfelder 2025, ľahší je Modrý Portugal. Výber vína ešte zohľadní vašu chuť.",
      "sweet": "Ak máte radi sladšie, skúste polosuchý Tramín 2025, sladký Aurelius, Solaris z cibéb alebo ľadové víno.",
      "gift": "Na darček sa hodí ľadové víno, Solaris z cibéb alebo sekt Blanc de blanc No.1. Vo Výbere vína zohľadníme, čo má obdarovaný rád.",
      "default": "Ak neviete, kde začať, prejdite Výber vína. Štyri krátke otázky zúžia ponuku Vinařství Škrobák na konkrétne víno."
    },
    "kind": "vino"
  },
  "skovajsa": {
    "brand": "Víno Skovajsa",
    "web": "https://www.vinoskovajsa.sk/e-shop/",
    "products": [
      "Rizling vlašský FRESH 2025, suché",
      "Silvánske zelené IDENTITY 2024, suché",
      "Pinot blanc IDENTITY 2025, suché",
      "Chardonnay IDENTITY 2025, suché",
      "Devín IDENTITY 2025, suché",
      "Veltlínske zelené TERROIR 2025, suché",
      "Frankovka modrá FRUITY 2023, suché",
      "Neronet IDENTITY 2021, suché",
      "Svätovavrinecké TERROIR 2022, suché",
      "Neronet SELECTION 2022, suché",
      "Chardonnay FRIZZANTE 2025, suché",
      "Cabernet FRIZZANTE 2024, suché (rosé)",
      "SEKT ROSÉ N.V., brut",
      "SEKT BLANC N.V., brut nature"
    ],
    "fallback": {
      "white": "K rybe a ľahkým jedlám je od Skovajsovcov dobrý smer svieži Rizling vlašský FRESH alebo Silvánske zelené IDENTITY; plnšie je Veltlínske zelené TERROIR. Vo Výbere vína nájdem aj ďalšie.",
      "red": "K mäsu odporúčam Neronet SELECTION 2022 alebo Svätovavrinecké TERROIR, ľahšia je Frankovka FRUITY 2023. Výber vína ešte zohľadní vašu chuť.",
      "sweet": "Skovajsa robí suché vína. Najovocnejšie pôsobí Devín IDENTITY a perlivé frizzante.",
      "gift": "Na darček sa hodí SEKT BLANC brut nature, Neronet SELECTION alebo Veltlínske zelené TERROIR. Vo Výbere vína zohľadníme, čo má obdarovaný rád.",
      "default": "Ak neviete, kde začať, prejdite Výber vína. Štyri krátke otázky zúžia ponuku Víno Skovajsa na konkrétne víno."
    },
    "kind": "vino"
  },
  "placek": {
    "brand": "Vinařství Jan Plaček",
    "web": "https://www.vinoplacek.cz/",
    "products": [
      "Hibernal 2025, pozdní sběr, suché",
      "Rulandské šedé 2025, pozdní sběr, suché",
      "Chardonnay 2023, pozdní sběr, Privileg, suché",
      "Rinot 2021, pozdní sběr, suché, zrálo v sudu",
      "Savilon 2025, pozdní sběr, polosuché",
      "Pálava 2025, kabinet, polosuché",
      "Mladé Pokušení 2025, polosladké",
      "Hibernal 2025, pozdní sběr, polosladké",
      "Cabernet Cortis 2025, suché",
      "Zweigeltrebe 2024, pozdní sběr, suché",
      "Cuvée ANAH 2023, pozdní sběr, suché",
      "Frankovka 2023, výběr z hroznů, Oak age, suché",
      "Merlot 2022, výběr z hroznů, Oak age, suché",
      "Cuvée 348 2022, pozdní sběr, Oak age",
      "Rulandské modré rosé 2025, pozdní sběr, polosuché",
      "Cabernet Cortis klaret 2025, výběr z hroznů, polosladké",
      "RosénCO2 2025, perlivé rosé, polosladké",
      "Bublinky 2025, Veltlínské zelené, perlivé",
      "Sekt Plaček brut, Ryzlink rýnský 2022"
    ],
    "fallback": {
      "white": "K rybe a ľahkým jedlám je od Plačeka dobrý smer suchý Hibernal 2025 alebo Rulandské šedé 2025; plnšie je Chardonnay 2023 zo suda. Vo Výbere vína nájdem aj ďalšie.",
      "red": "K mäsu odporúčam Cuvée 348 so zlatou medailou alebo Merlot 2022 z radu Oak age, na každý deň Cabernet Cortis. Výber vína ešte zohľadní vašu chuť.",
      "sweet": "Ak máte radi sladšie, skúste polosladké Mladé Pokušení, polosladký Hibernal 2025 alebo perlivé RosénCO2.",
      "gift": "Na darček sa hodí Cuvée 348, Merlot 2022 Oak age alebo Sekt Plaček brut. Vo Výbere vína zohľadníme, čo má obdarovaný rád.",
      "default": "Ak neviete, kde začať, prejdite Výber vína. Štyri krátke otázky zúžia ponuku Vinařství Jan Plaček na konkrétne víno."
    },
    "kind": "vino"
  },
  "lipa": {
    "brand": "Víno Lípa",
    "web": "https://vinolipa.cz/",
    "products": [
      "Veltlínské zelené 2025, suché",
      "Veltlínské zelené BETON 2025, suché",
      "Sauvignon 2025, suché",
      "Sylvánské zelené 2025, suché",
      "Donauriesling 2024, suché",
      "Hibernal 2025, suché",
      "Ryzlink vlašský 2024, pozdní sběr, suché",
      "Ryzlink vlašský 2024 (beton), suché",
      "Ryzlink vlašský 2024 (sud), suché",
      "Ryzlink vlašský 2024 (keramika), suché",
      "Ryzlink rýnský 2024, pozdní sběr, suché",
      "Ryzlink rýnský 2024, pozdní sběr, suché",
      "Pálava 2025, polosuché",
      "Rulandské šedé 2025, polosuché",
      "Pálava 2024, výběr z hroznů, polosladké",
      "Pálava 2023, výběr z bobulí, sladké",
      "Cabernet Moravia 2023, výběr z hroznů, suché",
      "Lipasecco Zweigeltrebe rosé 2025, polosuché",
      "Lipasecco cuvée 2025, polosuché",
      "Sekt Chardonnay Brut Nature 2023",
      "Sekt Rulandské modré Extra Brut 2023"
    ],
    "fallback": {
      "white": "K rybe a ľahkým jedlám je od Lípy dobrý smer suchý Veltlínské zelené 2025 alebo Sauvignon 2025; zaujímavý je Ryzlink vlašský v betóne, sude alebo keramike. Vo Výbere vína nájdem aj ďalšie.",
      "red": "Z červených má Víno Lípa Cabernet Moravia 2023 vo výbere z hrozna so striebornou medailou AWC Vienna — k mäsu a grilu.",
      "sweet": "Ak máte radi sladšie, skúste polosladkú Pálavu 2024 alebo sladkú Pálavu 2023 vo výbere z bobúľ.",
      "gift": "Na darček sa hodí limitovaný Sekt Chardonnay Brut Nature, sladká Pálava z bobúľ alebo Ryzlink vlašský z keramiky. Vo Výbere vína zohľadníme, čo má obdarovaný rád.",
      "default": "Ak neviete, kde začať, prejdite Výber vína. Štyri krátke otázky zúžia ponuku Víno Lípa na konkrétne víno."
    },
    "kind": "vino"
  },
  "pristal": {
    "brand": "Víno Přistál",
    "web": "https://www.znojmo.wine/",
    "products": [
      "Sauvignon Blanc 2025, suché",
      "Hibernal 2025, polosuché",
      "Coupage PINOT 2025, polosuché",
      "Pálava 2025, polosuché",
      "Veltlínské zelené 2024 BETON, suché",
      "Ryzlink rýnský 2023 BETON, suché",
      "Sauvignon Blanc 2022 BETON, suché",
      "Sauvignon Blanc z Kraví hory 2021, akátový sud",
      "Pinot Gris 2021, dubový sud, suché",
      "RED Dornfelder 2024, suché",
      "Frankovka 18, dubový sud, suché",
      "Zweigeltrebe rosé 2025, polosuché",
      "Frizzante Cuvée 2025, polosuché",
      "Pét-nat Veltlínské zelené 2025",
      "Pét-nat Pinot Blanc 2025",
      "Pét-nat Zweigeltrebe rosé 2025"
    ],
    "fallback": {
      "white": "K rybe a ľahkým jedlám je od Přistála dobrý smer suchý Sauvignon Blanc 2025; pre zážitok Veltlínské zelené alebo Ryzlink rýnský z betónového vajca. Vo Výbere vína nájdem aj ďalšie.",
      "red": "K mäsu odporúčam Frankovku 18 z dubového suda, ovocnejší je RED Dornfelder 2024. Výber vína ešte zohľadní vašu chuť.",
      "sweet": "Víno Přistál robí suché a polosuché vína. Najjemnejšie pôsobí polosuchá Pálava 2025 alebo Coupage PINOT 2025.",
      "gift": "Na darček sa hodí Frankovka 18 z dubového suda alebo víno z betónového vajca. Vo Výbere vína zohľadníme, čo má obdarovaný rád.",
      "default": "Ak neviete, kde začať, prejdite Výber vína. Štyri krátke otázky zúžia ponuku Víno Přistál na konkrétne víno."
    },
    "kind": "vino"
  },
  "buchtovi": {
    "brand": "Vinařství Buchtovi",
    "web": "https://www.vinobuchtovi.cz/e-shop",
    "products": [
      "Sauvignon 2024, suché",
      "Ryzlink rýnský 2024, pozdní sběr",
      "Hibernal 2024, pozdní sběr, suché",
      "Muškát moravský, polosuché",
      "Chardonnay 2024, suché",
      "Pálava 2024, kryomacerace, výběr z hroznů, suché",
      "Tramín červený 2024, VOC, polosuché",
      "Rulandské šedé 2024, pozdní sběr, polosladké",
      "Pálava 2024, výběr z hroznů, polosladké",
      "Kerner 2024, výběr z hroznů, sladké",
      "Merlot 2023, suché",
      "Dunaj 2023, výběr z hroznů, suché",
      "Nadzahrady 2023, pozdní sběr",
      "Dornfelder 2022, pozdní sběr, suché",
      "Rulandské modré 2022, pozdní sběr, suché",
      "Cabernet Moravia 2022, suché",
      "Cabernet Moravia rosé 2023, polosuché",
      "Rosé Frizzante 2024, polosladké",
      "Sekt Demi Sec Chardonnay",
      "Sekt Brut Ryzlink rýnský 2023"
    ],
    "fallback": {
      "white": "K rybe a ľahkým jedlám je od Buchtovcov dobrý smer suchý Sauvignon 2024 alebo Hibernal 2024; plnšie je Chardonnay 2024 so zlatou medailou. Vo Výbere vína nájdem aj ďalšie.",
      "red": "K mäsu odporúčam Merlot 2023 alebo Dunaj 2023, ovocnejší je Dornfelder 2022. Výber vína ešte zohľadní vašu chuť.",
      "sweet": "Ak máte radi sladšie, skúste sladký Kerner 2024, polosladkú Pálavu 2024 alebo Sekt Demi Sec Chardonnay.",
      "gift": "Na darček sa hodí Pálava z kryomacerácie so zlatými medailami, Merlot 2023 alebo Sekt Brut Ryzlink rýnský. Vo Výbere vína zohľadníme, čo má obdarovaný rád.",
      "default": "Ak neviete, kde začať, prejdite Výber vína. Štyri krátke otázky zúžia ponuku Vinařství Buchtovi na konkrétne víno."
    },
    "kind": "vino"
  },
  "vajbar": {
    "brand": "Vinařství Vajbar",
    "web": "https://www.vajbar.cz/e-shop/",
    "products": [
      "Veltlínské zelené 2024, suché",
      "Müller Thurgau 2025, suché",
      "Ryzlink rýnský 2022, suché",
      "Rulandské šedé 2024, suché",
      "Chardonnay 2023, suché",
      "Chardonnay 2021, polosuché",
      "Hibernal 2024, polosuché",
      "Pálava 2024, polosuché",
      "Stařečkovo 2024, suché",
      "Ryzlink vlašský 2010, suché (archivní)",
      "Tramín červený 2023, polosladké",
      "Pálava 2023, polosladké",
      "Frankovka 2020, suché",
      "Svatovavřinecké 2020, suché",
      "Rulandské modré 2020, suché",
      "Cuvée Kamila 2020, rosé, polosuché",
      "Rosé Cuvée 2023, polosladké",
      "Bublinky 2025, perlivé, polosuché",
      "Frizzante Rosé 2025, polosuché",
      "Frizzante Klaret 2025, polosladké"
    ],
    "fallback": {
      "white": "K rybe a ľahkým jedlám je od Vajbarovcov dobrý smer suché Veltlínské zelené 2024 alebo mladý Müller Thurgau 2025; plnšie je Rulandské šedé 2024. Vo Výbere vína nájdem aj ďalšie.",
      "red": "K mäsu odporúčam Svatovavřinecké 2020 alebo Rulandské modré 2020 z dubového suda, ľahšia je Frankovka 2020. Výber vína ešte zohľadní vašu chuť.",
      "sweet": "Ak máte radi sladšie, skúste polosladký Tramín červený 2023, Pálavu 2023 alebo Rosé Cuvée 2023 k dezertom.",
      "gift": "Na darček sa hodí archívny Ryzlink vlašský 2010, cuvée Stařečkovo alebo Rulandské modré z dubového suda. Vo Výbere vína zohľadníme, čo má obdarovaný rád.",
      "default": "Ak neviete, kde začať, prejdite Výber vína. Štyri krátke otázky zúžia ponuku Vinařství Vajbar na konkrétne víno."
    },
    "kind": "vino"
  },
  "rajnic": {
    "brand": "Víno Rajníc",
    "web": "https://www.vinorajnic.sk/",
    "products": [
      "Rizling vlašský 2025, suché",
      "Rizling rýnsky 2025, suché",
      "Sauvignon blanc 2025, suché",
      "Müller Thurgau 2025, suché",
      "Pálava 2025, suché",
      "3 Pinoty cuvée 2021, suché",
      "Cabernet Sauvignon rosé 2025, suché",
      "Frizzante Cabernet Sauvignon rosé, suché",
      "Frankovka modrá 2021, suché",
      "Pinot Noir 2021, suché",
      "Merlot 2021, suché",
      "Dunaj 2024, suché",
      "Pinot Noir 2015, suché"
    ],
    "fallback": {
      "white": "K rybe a ľahkým jedlám je od Rajníca dobrý smer suchý Rizling vlašský alebo Sauvignon blanc 2025; plnšie je cuvée 3 Pinoty. Vo Výbere vína nájdem aj ďalšie.",
      "red": "K mäsu odporúčam Merlot 2021 alebo Dunaj 2024, pre výnimočnú chvíľu vyzretý Pinot Noir 2015. Výber vína ešte zohľadní vašu chuť.",
      "sweet": "Víno Rajníc robí suché vína. Najovocnejšie pôsobí Pálava 2025 a rosé z Cabernetu Sauvignon.",
      "gift": "Na darček sa hodí Pinot Noir 2015 so zlatou medailou z Mondiale des Pinots alebo Merlot 2021. Vo Výbere vína zohľadníme, čo má obdarovaný rád.",
      "default": "Ak neviete, kde začať, prejdite Výber vína. Štyri krátke otázky zúžia ponuku Víno Rajníc na konkrétne víno."
    },
    "kind": "vino"
  },
  "paulus": {
    "brand": "Vinařství Paulus",
    "web": "https://vinarstvipaulus.cz/eshop/",
    "products": [
      "Ryzlink vlašský 2024, výběr z hroznů, suché",
      "Ryzlink rýnský 2024, pozdní sběr, suché",
      "Sauvignon 2024, pozdní sběr, suché",
      "Kerner 2025, výběr z hroznů, suché",
      "Rulandské šedé 2025, výběr z hroznů, suché",
      "Pálava 2025, pozdní sběr, polosuché",
      "Tramín červený 2025, pozdní sběr, polosuché",
      "Hibernal 2025, výběr z hroznů, polosladké",
      "Solaris 2024, výběr z hroznů, polosladké",
      "Chardonnay 2024, výběr z hroznů, polosladké",
      "Pálava 2025, výběr z hroznů, polosladké",
      "Modrý Portugal 2022, pozdní sběr, suché",
      "Frankovka 2021, výběr z hroznů, suché",
      "Cabernet Sauvignon 2023, výběr z hroznů, suché",
      "Merlot 2023, výběr z hroznů, suché",
      "Merlot rosé 2025, pozdní sběr, polosuché",
      "Brut sekt kvašený v lahvi",
      "Brut sekt Charmat",
      "Demi sekt Charmat",
      "Demi sekt rosé Charmat"
    ],
    "fallback": {
      "white": "K rybe a ľahkým jedlám je od Paulusovcov dobrý smer suchý Ryzlink vlašský 2024 alebo Sauvignon 2024; plnšie je Rulandské šedé 2025. Vo Výbere vína nájdem aj ďalšie.",
      "red": "K mäsu odporúčam Cabernet Sauvignon 2023 alebo Merlot 2023, ľahší je Modrý Portugal 2022. Výber vína ešte zohľadní vašu chuť.",
      "sweet": "Ak máte radi sladšie, skúste polosladkú Pálavu 2025, Solaris 2024 alebo Demi sekt Charmat.",
      "gift": "Na darček sa hodí Brut sekt kvašený v lahvi, polosladká Pálava 2025 alebo Cabernet Sauvignon 2023. Vo Výbere vína zohľadníme, čo má obdarovaný rád.",
      "default": "Ak neviete, kde začať, prejdite Výber vína. Štyri krátke otázky zúžia ponuku Vinařství Paulus na konkrétne víno."
    },
    "kind": "vino"
  },
  "mikulica": {
    "brand": "Vinařství Mikulica",
    "web": "https://www.vinarstvimikulica.cz/",
    "products": [
      "Veltlínské zelené 2025, suché",
      "Ryzlink vlašský 2025, suché",
      "Müller Thurgau 2024, suché",
      "Sauvignon 2024, suché",
      "Ryzlink rýnský 2024, suché",
      "Chardonnay 2024, suché",
      "Pálava 2025, polosuché",
      "Rulandské šedé 2025, polosuché",
      "#líbiFka 2025, polosladké",
      "Sauvignon 2023, sladké (0,5 l)",
      "Frankovka rosé 2023, suché",
      "Frankovka 2023, suché",
      "Rulandské modré 2023, suché",
      "Merlot 2024, suché",
      "Cuvée ze starého vinohradu 2022, suché (0,5 l)",
      "Frizz víno rosé 2023, jemně perlivé, polosladké",
      "Frizz víno Blanc 2024, jemně perlivé, polosuché",
      "SEKT Riesling, BRUT"
    ],
    "fallback": {
      "white": "K rybe a ľahkým jedlám je od Mikulicovcov dobrý smer suché Veltlínské zelené 2025 alebo Sauvignon 2024; plnší je Ryzlink rýnský 2024. Vo Výbere vína nájdem aj ďalšie.",
      "red": "K mäsu odporúčam Merlot 2024 alebo Cuvée ze starého vinohradu 2022, ovocnejšia je Frankovka 2023. Výber vína ešte zohľadní vašu chuť.",
      "sweet": "Ak máte radi sladšie, skúste dezertný Sauvignon 2023, polosladkú #líbiFku 2025 alebo perlivé Frizz víno rosé.",
      "gift": "Na darček sa hodí SEKT Riesling BRUT, Cuvée ze starého vinohradu 2022 alebo sladký Sauvignon 2023. Vo Výbere vína zohľadníme, čo má obdarovaný rád.",
      "default": "Ak neviete, kde začať, prejdite Výber vína. Štyri krátke otázky zúžia ponuku Vinařství Mikulica na konkrétne víno."
    },
    "kind": "vino"
  },
  "dubovskygrancic": {
    "brand": "Vinárstvo Dubovský & Grančič",
    "web": "https://dubovskygrancic.sk/",
    "products": [
      "Veltlínske zelené 2025, suché",
      "Riesling 2024, suché",
      "St. George Sylvaner 2024, suché",
      "St. George 3 [O]SUDY 2024, suché",
      "St. George Riesling Reserva 2024, suché",
      "Pálava 2025, polosuché",
      "Pesecká Leánka 2025, polosladké",
      "Tramín červený 2024, sladké (0,5 l)",
      "Veltlínske zelené 2016, hrozienkový výber (0,5 l)",
      "Frankovka modrá 2023, suché",
      "St. George Alibernet 2022, suché",
      "St. George Dunaj 2023, suché",
      "St. George Elisa I. 2023, suché",
      "St. George Pinot Noir Zibich, suché",
      "Nela rosé 2025, suché",
      "St. George Cabernet Sauvignon rosé 2025, polosuché",
      "SAMO SATO. rosé, pét-nat, suché",
      "St. George Riesling Extra Brut sekt 2020"
    ],
    "fallback": {
      "white": "K rybe a ľahkým jedlám je dobrý smer suchý Veltlínske zelené 2025 alebo Riesling 2024; plnší je St. George Riesling Reserva z dubových sudov. Vo Výbere vína nájdem aj ďalšie.",
      "red": "K mäsu odporúčam St. George Alibernet 2022 alebo Dunaj 2023, na každý deň Frankovku modrú 2023. Výber vína ešte zohľadní vašu chuť.",
      "sweet": "Ak máte radi sladšie, skúste sladký Tramín červený 2024, polosladkú Pesecká Leánku 2025 alebo vzácny hrozienkový výber Veltlínskeho zeleného 2016.",
      "gift": "Na darček sa hodí St. George Elisa I. 2023, Pinot Noir Zibich alebo sekt Riesling Extra Brut. Vo Výbere vína zohľadníme, čo má obdarovaný rád.",
      "default": "Ak neviete, kde začať, prejdite Výber vína. Štyri krátke otázky zúžia ponuku Vinárstva Dubovský & Grančič na konkrétne víno."
    },
    "kind": "vino"
  },
  "sabata": {
    "brand": "Vinařství Šabata",
    "web": "https://eshop.vinarstvisabata.cz/",
    "products": [
      "Sauvignon 2025, pozdní sběr - suché",
      "Donauriesling 2025, pozdní sběr - suché",
      "Savilon 2025, pozdní sběr - suché",
      "Muškát moravský 2025, pozdní sběr - suché",
      "Pálava 2025, pozdní sběr - suché",
      "Rulandské šedé 2025, pozdní sběr - polosuché",
      "Rulandské bílé - BATONNAGE 2022, pozdní sběr - suché",
      "Pálava - BARRIQUE 2020, výběr z hroznů - suché",
      "Tramín červený 2025, výběr z hroznů - polosladké",
      "Pálava 2023, výběr z hroznů - sladké",
      "Tramín červený 2013, LEDOVÉ VÍNO - sladké (0,375 l)",
      "Merlot - BARRIQUE 2023, výběr z hroznů - suché",
      "Rulandské modré - BARRIQUE 2018, výběr z hroznů - suché",
      "Merlot ROSÉ 2025, pozdní sběr - polosladké",
      "FRIZZANTE ROSÉ - Cuvée Mé Alibi 2024 - polosladké",
      "SEKT Šabata BLANC 2018 - brut"
    ],
    "fallback": {
      "white": "K rybe a ľahkým jedlám je od Šabatovcov dobrý smer suchý Sauvignon 2025 alebo Donauriesling 2025; plnšie je Rulandské bílé BATONNAGE 2022. Vo Výbere vína nájdem aj ďalšie.",
      "red": "K mäsu odporúčam Merlot BARRIQUE 2023, pre výnimočnú príležitosť Rulandské modré BARRIQUE 2018. Výber vína ešte zohľadní vašu chuť.",
      "sweet": "Ak máte radi sladšie, skúste sladkú Pálavu 2023 so zlatými medailami, polosladký Tramín červený 2025 alebo ľadové víno z Tramínu.",
      "gift": "Na darček sa hodí ľadové víno Tramín červený 2013, Rulandské modré BARRIQUE 2018 alebo SEKT Šabata BLANC. Vo Výbere vína zohľadníme, čo má obdarovaný rád.",
      "default": "Ak neviete, kde začať, prejdite Výber vína. Štyri krátke otázky zúžia ponuku Vinařství Šabata na konkrétne víno."
    },
    "kind": "vino"
  },
  "valka": {
    "brand": "Vinařství Válka",
    "web": "https://vinarstvivalka.cz/",
    "products": [
      "Veltlínské zelené 2023, suché, BIO",
      "Ryzlink vlašský 2023, Terasy, suché, BIO",
      "Chardonnay 2023, suché, BIO",
      "Pálava 2025, suché, BIO",
      "Ryzlink rýnský 2023, suché, BIO",
      "Pálava oranžová 2024, suché, BIO",
      "Bílá Frankovka 2024, polosuché, BIO",
      "Cabernet Moravia rosé 2024, suché, BIO",
      "La Guerre rosé 2022, suché, BIO",
      "Nosislavský ryšák 2022, suché, BIO",
      "Frankovka 2022, suché, BIO",
      "Černý samet 2022, suché, BIO",
      "Pinot Noir 2021/2022, suché, BIO, Family Reserve",
      "Cabernet Sauvignon 2021, suché, BIO",
      "Jantar z Výhonu 2020, polosuché, BIO",
      "MuAu Pet-Nat 2025, brut natur, perlivé, BIO",
      "BLAU Pet-Nat 2025, brut natur, perlivé, BIO"
    ],
    "fallback": {
      "white": "K rybe a ľahkým jedlám je od Válkovcov dobrý smer suché Veltlínské zelené 2023 alebo Ryzlink vlašský Terasy; plnší je Ryzlink rýnský 2023 zo suda. Vo Výbere vína nájdem aj ďalšie.",
      "red": "K mäsu odporúčam Černý samet 2022 alebo Cabernet Sauvignon 2021, ovocnejšia je Frankovka 2022. Výber vína ešte zohľadní vašu chuť.",
      "sweet": "Válkovci robia hlavne suché BIO vína. Sladšie pôsobí dezertný Jantar z Výhonu v štýle sherry alebo polosuchá Bílá Frankovka 2024.",
      "gift": "Na darček sa hodí Jantar z Výhonu, Pálava oranžová 2024 alebo Pinot Noir Family Reserve. Vo Výbere vína zohľadníme, čo má obdarovaný rád.",
      "default": "Ak neviete, kde začať, prejdite Výber vína. Štyri krátke otázky zúžia ponuku Vinařství Válka na konkrétne víno."
    },
    "kind": "vino"
  },
  "vican": {
    "brand": "Vinařství Vican",
    "web": "https://eshop.vican.wine/",
    "products": [
      "Sylvánské zelené 2025, pozdní sběr, suché",
      "Sauvignon 2023, pozdní sběr, suché",
      "Chardonnay 2023 - edice Karel Roden, suché",
      "Ryzlink rýnský 2024, výběr z hroznů, suché",
      "Tramín červený 2024, polosladké",
      "Pálava 2024 - edice Karel Roden, polosladké",
      "Ryzlink vlašský 2017, výběr z cibéb, sladké (0,25 l)",
      "Rulandské modré 2024, suché",
      "Merlot 2023 - Rodinná rezerva, suché",
      "Frankovka 2022, Moravský akát, suché",
      "Cuvée Jupiter 2022, suché",
      "Cuvée Thé rosé 2022, polosuché",
      "Cabernet Sauvignon ROSÉ 2025, polosladké",
      "Frizzanté Muškát žlutý 2025, polosuché",
      "Frizzanté Pálava 2025, polosladké"
    ],
    "fallback": {
      "white": "K rybe a ľahkým jedlám je od Vicana dobrý smer suché Sylvánské zelené 2025 alebo Chardonnay 2023 z edície Karel Roden; plnší je Ryzlink rýnský 2024. Vo Výbere vína nájdem aj ďalšie.",
      "red": "K mäsu odporúčam Frankovku 2022 alebo Cuvée Jupiter 2022, jemnejší je Merlot 2023 Rodinná rezerva. Výber vína ešte zohľadní vašu chuť.",
      "sweet": "Ak máte radi sladšie, skúste polosladkú Pálavu 2024 z edície Karel Roden, Tramín červený 2024 alebo sladký Ryzlink vlašský z cibéb.",
      "gift": "Na darček sa hodí Cuvée Jupiter 2022, Pálava z edície Karel Roden alebo Frizzanté Pálava na prípitok. Vo Výbere vína zohľadníme, čo má obdarovaný rád.",
      "default": "Ak neviete, kde začať, prejdite Výber vína. Štyri krátke otázky zúžia ponuku Vinařství Vican na konkrétne víno."
    },
    "kind": "vino"
  },
  "jurasek": {
    "brand": "Víno Jurášek",
    "web": "https://vinojurasek.sk/",
    "products": [
      "Rizling rýnsky 2025, suché",
      "Veltlínske zelené 2025, suché",
      "Sauvignon blanc 2025, suché",
      "Muškát moravský 2025, polosuché",
      "Pálava 2024, sladké",
      "Frizzante biele 2023, polosuché",
      "Frizzante ružové 2023, polosuché",
      "Cabernet Sauvignon rosé 2024, suché",
      "Dornfelder 2024, suché",
      "Alibernet 2021, suché",
      "Pinot Noir Barrique 2020, suché"
    ],
    "fallback": {
      "white": "K rybe a ľahkým jedlám je od Juráška dobrý smer suchý Rizling rýnsky 2025 alebo Sauvignon blanc 2025; na leto aj Cabernet Sauvignon rosé. Vo Výbere vína nájdem aj ďalšie.",
      "red": "K mäsu odporúčam Pinot Noir Barrique 2020 alebo Alibernet 2021, ovocnejší je Dornfelder 2024. Výber vína ešte zohľadní vašu chuť.",
      "sweet": "Ak máte radi sladšie, skúste sladkú Pálavu 2024 alebo polosuchý Muškát moravský 2025.",
      "gift": "Na darček sa hodí Pinot Noir Barrique 2020 alebo Frizzante ružové na prípitok. Vo Výbere vína zohľadníme, čo má obdarovaný rád.",
      "default": "Ak neviete, kde začať, prejdite Výber vína. Štyri krátke otázky zúžia ponuku Víno Jurášek na konkrétne víno."
    },
    "kind": "vino"
  },
  "magula": {
    "brand": "Vinárstvo Magula",
    "web": "https://www.vinomagula.sk/",
    "products": [
      "Biely vlk 2023",
      "Jungberg Devín 2023",
      "Oranžový vlk 2023, oranžové víno",
      "Ružový vlk 2022",
      "Magula, Gabay, Bernheim: Sen 2020",
      "Lupo! #1, šumivé víno",
      "Carboniq 2023",
      "Teufelstal Pinot noir 2022",
      "Rosenberg Frankovka 2021",
      "Červený vlk 2020",
      "Baccara 2019",
      "Teufelsecke Modrý Portugal 2017"
    ],
    "fallback": {
      "white": "K rybe a ľahkým jedlám je od Magulu dobrý smer svieži Biely vlk 2023 alebo aromatický Jungberg Devín 2023; na leto aj Ružový vlk 2022. Vo Výbere vína nájdem aj ďalšie.",
      "red": "K mäsu odporúčam Rosenberg Frankovku 2021 alebo mohutného Červeného vlka 2020; ľahší a ovocný je Carboniq 2023. Výber vína ešte zohľadní vašu chuť.",
      "sweet": "Magula robí suché vína; najovocnejšie a najjemnejšie sú Carboniq 2023 a Jungberg Devín 2023.",
      "gift": "Na darček sa hodí Teufelsecke Modrý Portugal 2017 alebo rosé Sen 2020 z limitovanej série. Vo Výbere vína zohľadníme, čo má obdarovaný rád.",
      "default": "Ak neviete, kde začať, prejdite Výber vína. Štyri krátke otázky zúžia ponuku Vinárstva Magula na konkrétne víno."
    },
    "kind": "vino"
  },
  "dobravinice": {
    "brand": "Dobrá Vinice",
    "web": "https://www.dobravinice.cz/",
    "products": [
      "Národní park 2021, cuvée, suché",
      "Müller Thurgau 2022, suché",
      "Veltlínské zelené 2021, suché",
      "Májová Milerka 2021, suché",
      "Ryzlink rýnský 2020 VOC, suché",
      "Quatre Cuvée 2022, suché",
      "Vlašský ryzlink Qvevri 2017, oranžové, suché",
      "Pinot Noir Rubín 2018, suché",
      "Frankovka Ibérico 2023, suché",
      "Trois 2022, červené cuvée, suché",
      "Crème de Kambrium 2022, pet-nat, suché",
      "Crème de Riesling 2020, pet-nat, suché"
    ],
    "fallback": {
      "white": "K rybe a ľahkým jedlám je z Dobrej Vinice dobrý smer cuvée Národní park 2021 alebo Veltlínské zelené 2021. Vo Výbere vína nájdem aj ďalšie.",
      "red": "K mäsu odporúčam cuvée Trois 2022, ľahšia a ovocnejšia je Frankovka Ibérico 2023. Výber vína ešte zohľadní vašu chuť.",
      "sweet": "Dobrá Vinice robí suché naturálne vína; ovocnejší a jemnejší je Müller Thurgau 2022 alebo Frankovka Ibérico 2023.",
      "gift": "Na darček sa hodí Ryzlink rýnský 2020 VOC alebo oranžový Vlašský ryzlink Qvevri 2017. Vo Výbere vína zohľadníme, čo má obdarovaný rád.",
      "default": "Ak neviete, kde začať, prejdite Výber vína. Štyri krátke otázky zúžia ponuku Dobrej Vinice na konkrétne víno."
    },
    "kind": "vino"
  },
  "skoupil": {
    "brand": "Vinařství Skoupil",
    "web": "https://eshop.skoupil.com/",
    "products": [
      "Ryzlink rýnský 2024, pozdní sběr, suché",
      "Veltlínské zelené 2025, suché",
      "Sauvignon 2025, polosuché",
      "Pálava 2025, polosuché",
      "Tramín červený 2024 Úlehle, suché",
      "Frankovka 2023 Šmatláky, suché",
      "Pinot Noir 2023 Frejúnky, suché",
      "Merlot 2025, pozdní sběr, suché",
      "ŠUM Sauvignon 2025, extra dry",
      "Tramín Babiččine cibéby 2023 History, sladké, 0,5 l"
    ],
    "fallback": {
      "white": "K rybe, hydine a ľahším jedlám je zo Skoupilu dobrý smer suchý Ryzlink rýnský 2024 alebo Veltlínské zelené 2025. Vo Výbere vína nájdem aj ďalšie.",
      "red": "K mäsu a steaku odporúčam Frankovku 2023 Šmatláky z dubových sudov, jemnejší je Merlot 2025. Výber vína ešte zohľadní vašu chuť.",
      "sweet": "Ak máte radi sladšie, skúste polosuchú Pálavu 2025 alebo sladký Tramín Babiččine cibéby k dezertom.",
      "gift": "Na darček sa hodí Frankovka 2023 Šmatláky alebo šumivý ŠUM Sauvignon 2025. Vo Výbere vína zohľadníme, čo má obdarovaný rád.",
      "default": "Ak neviete, kde začať, prejdite Výber vína. Štyri krátke otázky zúžia ponuku Vinařství Skoupil na konkrétne víno."
    },
    "kind": "vino"
  },
  "plener": {
    "brand": "Plenér",
    "web": "https://eshop.vinarstviplener.cz/",
    "products": [
      "Cuvée Leonard 2023/2024",
      "Sylván 2025",
      "EGGSTRA 2022",
      "Frankovka 2023",
      "PINOT NOIR 2023",
      "Pinot noir 2022/2023",
      "SPIN ON SKIN 2024",
      "Sylván 2023",
      "Riesling 2022 feat. 2023",
      "Ryzlink vlašský 2022 feat. 2023"
    ],
    "fallback": {
      "white": "Zo suchých bielych odporúčam Cuvée Leonard 2023/2024 alebo Sylván 2025. Pre výraznejší zážitok je tu EGGSTRA 2022 z dreveného suda v tvare vajíčka.",
      "red": "Ovocné suché červené sú Frankovka 2023 a PINOT NOIR 2023. Sudovou alternatívou je Pinot noir 2022/2023, zrelý 12 mesiacov vo francúzskom dube.",
      "sweet": "Plenér má v aktuálnej ponuke suché vína. Ovocnejší smer je Frankovka 2023 (305 Kč), ktorá je suchá, nie sladká.",
      "gift": "Na darček sa hodí limitovaná EGGSTRA 2022 alebo Pinot noir 2022/2023. Pre milovníka macerovaných vín je tu SPIN ON SKIN 2024.",
      "default": "Ak neviete, kde začať, skúste Cuvée Leonard 2023/2024. Štyri otázky vo Výbere vína zohľadnia váš štýl, chuť aj príležitosť."
    },
    "replyRules": [
      {
        "pattern": "sladk|sladš|slads|dezert",
        "reply": "Plenér má v aktuálnej ponuke suché vína. Ovocnejší smer je Frankovka 2023 (305 Kč), ktorá je suchá, nie sladká."
      },
      {
        "pattern": "macer|oranž|oranz|šup|slup|skin",
        "reply": "Macerované víno kvasí v kontakte so šupkami hrozna, čo zvýrazní farbu a chuť. SPIN ON SKIN 2024 (405 Kč) je suché oranžové víno; Sylván 2023 (305 Kč) je tiež kvasený na šupkách."
      },
      {
        "pattern": "ružov|ruzov|rosé|rose|šumiv|sumiv|sekt|pét|pet-nat|perliv",
        "reply": "Ružové ani klasické šumivé víno teraz v overenej ponuke Plenéru nemáme. Ryzlink vlašský 2022 feat. 2023 (305 Kč) je suché macerované víno s jemným perlením na jazyku, nie klasický sekt."
      },
      {
        "pattern": "field|blend|cuvée|cuvee|leonard",
        "reply": "Field blend znamená, že rôzne odrody z jedného vinohradu sa zbierajú a spracúvajú spolu. Cuvée Leonard 2023/2024 (305 Kč) spája tento vinohradný mix aj dva ročníky a je suché biele víno."
      }
    ],
    "kind": "vino"
  },
  "berta": {
    "brand": "Vinárstvo Berta",
    "web": "https://www.vinarstvoberta.sk/obchod/",
    "products": [
      "Svätovavrinecké 2024",
      "Muškát Sparkling 2025",
      "Wine Not? Pinot Gris 2024, 0,25 l",
      "Wine Not? Cabernet Franc 2024, 0,25 l",
      "Muškát žltý 2024, sladké, 0,5 l",
      "Dunaj Heritage 2024",
      "Rizling Vlašský Heritage 2023 – suché",
      "Cabernet Franc 2024",
      "Alibernet 2022",
      "Cabernet Sauvignon rosé 2025",
      "Veltlínske zelené 2022",
      "Rulandské šedé 2024",
      "Sauvignon 2025",
      "Rizling vlašský Single Vineyard 2024",
      "Müller Thurgau 2025",
      "Muškát moravský 2025"
    ],
    "fallback": {
      "white": "Pre svieži biely smer skúste Sauvignon 2025 alebo Rizling vlašský Single Vineyard 2024. Plnší Rizling Vlašský Heritage 2023 – suché sa hodí k rybám a krémovým cestovinám.",
      "red": "K mäsu odporúčam Dunaj Heritage 2024 alebo Alibernet 2022. Ovocnejšie a jemnejšie je Svätovavrinecké 2024.",
      "sweet": "Na sladší smer má Berta Muškát žltý 2024, sladké, 0,5 l. Hodí sa k ovocným koláčom či jemným syrom.",
      "gift": "Na darček sa hodí Dunaj Heritage 2024 alebo Rizling Vlašský Heritage 2023 – suché. Vo Výbere vína zohľadníme farbu, chuť aj jedlo.",
      "default": "Ak neviete, kde začať, skúste Rizling vlašský Single Vineyard 2024. Štyri krátke otázky vo Výbere vína potom zohľadnia vašu chuť aj jedlo."
    },
    "kind": "vino"
  },
  "ludvik": {
    "brand": "Víno Ludvik",
    "web": "https://www.vinoludvik.sk/shop",
    "products": [
      "Veltlínske zelené 2025, nízkohistamínové",
      "Rizling vlašský 2024, nízkohistamínové",
      "Pinot Blanc 2025, suché, nízkohistamínové",
      "Cabernet Sauvignon Blanc de Noir 2022",
      "Chardonnay 2024",
      "Pinot Gris 2024, suché",
      "Feteasca Regala 2025, Pesecká leánka",
      "Dievčie hrozno 2023, Leánka, nízkohistamínové",
      "Veltlínske zelené Surlie Oak 2023",
      "Harmónia Cuvée Surlie Oak 2022, biele",
      "Pinot Blanc Surlie Oak 2020",
      "Veltlínske zelené Barrique 2022",
      "Veltlínske zelené Barrique 2021",
      "Veltlínske zelené Barrique 2019",
      "Devín 2025, polosladké, nízkohistamínové",
      "Pinot Gris 2021, sladké",
      "Ľadové víno Veltlínske zelené 2016",
      "Cabernet Sauvignon Rosé 2024",
      "Harmónia Rosé Cuvée 2024",
      "Ľadové víno Cabernet Sauvignon Rosé 2023",
      "Pinot Noir 2018",
      "Svätovavrinecké 2021",
      "Cabernet Sauvignon 2023, nízkohistamínové",
      "Frankovka modrá 2021",
      "Harmónia Red Assemblage 2020",
      "Pinot Noir Reserva 2016",
      "Cabernet Sauvignon Barrique 2023",
      "Feteasca Negra 2017, prírodne sladké",
      "Frizzante Veltlín 2024, suché",
      "Frizzante Rosé, polosuché",
      "Frizzante Muškát 2024, polosladké",
      "Sekt Rizling vlašský Oak, brut",
      "Sekt Cabernet Sauvignon Rosé, brut",
      "Sekt Cabernet Sauvignon Rosé, doux",
      "Sekt Veltlínske zelené brut, magnum 1,5 l"
    ],
    "fallback": {
      "white": "K rybe a ľahkým jedlám je od Ludvika dobrý smer svieže nízkohistamínové Veltlínske zelené 2025 alebo Rizling vlašský 2024; plnší je Veltlínske zelené Surlie Oak 2023. Vo Výbere vína nájdem aj ďalšie.",
      "red": "K mäsu odporúčam Frankovku modrú 2021 alebo Cabernet Sauvignon 2023; na výnimočnú večeru Cabernet Sauvignon Barrique 2023. Výber vína ešte zohľadní vašu chuť.",
      "sweet": "Ak máte radi sladšie, skúste polosladký Devín 2025, prírodne sladký Pinot Gris 2021 alebo Ľadové víno Veltlínske zelené 2016.",
      "gift": "Na darček sa hodí Veltlínske zelené Barrique 2021, Harmónia Red Assemblage 2020 alebo sekt Veltlínske zelené v magnum fľaši. Vo Výbere vína zohľadníme, čo má obdarovaný rád.",
      "default": "Ak neviete, kde začať, prejdite Výber vína. Štyri krátke otázky zúžia ponuku Víno Ludvik na konkrétne víno."
    },
    "kind": "vino"
  }
});

function cors(req,res){
  const origin=req.headers.origin||'';
  const ok=origin===''||/(^https:\/\/([a-z0-9-]+\.)?mojchatbot\.sk$)|(^https:\/\/.*\.vercel\.app$)|(^http:\/\/(localhost|127\.0\.0\.1):\d+$)/i.test(origin);
  res.setHeader('Access-Control-Allow-Origin',ok&&origin?origin:'https://mojchatbot.sk');
  res.setHeader('Vary','Origin');res.setHeader('Access-Control-Allow-Methods','POST, OPTIONS');res.setHeader('Access-Control-Allow-Headers','Content-Type');
}
function fallbackReply(demo,text){
  const q=String(text||'').toLocaleLowerCase('sk');
  if(demo.kind==='vino'){
  if(/darč|darc/.test(q))return demo.fallback.gift;
  if(/sladk|dezert/.test(q))return demo.fallback.sweet;
  if(/červen|cerven|mäs|mas|steak|gril/.test(q))return demo.fallback.red;
  if(/biel|ryb|hydin|šalát|salat|ružov|ruzov|šumiv|sumiv|sekt/.test(q))return demo.fallback.white;
  return demo.fallback.default;
  }
  if(demo.kind==='vlasy'){
  if(/lup|svrb|citliv|podráž|podraz|šupin|supin|pokož|pokoz|ekzém|štíp|stip/.test(q))return demo.fallback.sensitive;
  if(/vypad|padaj|redn|rídn|ridn|slab|rast|hust|posil|lysin/.test(q))return demo.fallback.mature;
  if(/mast|maz|objem|splasnut|ploch|jemn/.test(q))return demo.fallback.oily;
  if(/such|lámav|lamav|krep|poškod|poskod|konč|konc|farb|zniče|znice|kudrn|vlnit/.test(q))return demo.fallback.dry;
  return demo.fallback.default;
  }
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
  // Ignore the greeting and optimistic placeholder; answer the last user question.
  while(messages[0]?.role==='assistant')messages.shift();
  while(messages.at(-1)?.role==='assistant')messages.pop();
  const latest=messages.filter(m=>m.role==='user').at(-1)?.content||'';if(!latest)return res.status(400).json({error:'Missing user message'});
  const expandedReply=catalogueReply(String(body.demoId||''),latest);
  if(expandedReply)return res.status(200).json({reply:expandedReply,fallback:true});
  const stockReply=legacyStockReply(String(body.demoId||''),latest);
  if(stockReply)return res.status(200).json({reply:stockReply,fallback:true});
  if(demo.kind==='vino' && (/tehot|koj[ií]|doj[čc]|som vodi[cč]|budem (?:vies[tť]|[sš]of[eé]rova[tť])|idem (?:vies[tť]|[sš]of[eé]rova[tť])/i.test(latest) || /(?:m[aá]m|som)\s+(?:[1-9]|1[0-7])(?:\s|[-–])*(?:rok|ro[cč]n)/i.test(latest))) return res.status(200).json({reply:'V tejto situácii vám alkoholické víno neodporúčam. Ak hľadáte nealkoholickú alternatívu, overte si jej dostupnosť v oficiálnom e-shope.'});
  const fallback=()=>res.status(200).json({reply:fallbackReply(demo,latest),fallback:true});
  if(!ANTHROPIC_API_KEY)return fallback();
  const system=[
    `Ste stručný produktový poradca pre e-shop ${demo.brand}. Kategória: ${demo.kind || "kozmetika"}.`,
    'Odpovedajte jednoduchou slovenčinou, maximálne dvoma krátkymi vetami.',
    'Pomáhate s výberom iba z ponuky tejto firmy podľa preferencií zákazníka. Nerobte zdravotnú diagnózu, nesľubujte liečbu a nevymýšľajte medicínske tvrdenia.',
    ...(demo.kind === 'vino' ? ['Neodporúčajte alkohol maloletým, tehotným ani vodičom. Nevymýšľajte ročníky, chuťové tóny ani ocenenia.'] : []),
    'Ak otázku nemožno zodpovedať z uvedených údajov, povedzte to a odkážte na oficiálny e-shop. Nevymýšľajte dodacie lehoty, kontakty ani obchodné podmienky.',
    'Odporučiť môžete iba presný názov produktu zo zoznamu Overené produkty. Nevymýšľajte ceny, zloženie ani účinky, ktoré nie sú uvedené.',
    'Pri výraznom, bolestivom alebo dlhodobom kožnom probléme odporučte konzultáciu s dermatológom alebo iným odborníkom.',
    ...(demo.replyRules?.length ? [`Ďalšie overené informácie:\n- ${demo.replyRules.map(rule=>rule.reply).join('\n- ')}`] : []),
    `Oficiálny e-shop: ${demo.web}`,
    `Overené produkty:\n- ${demo.products.join('\n- ')}`
  ].join('\n\n');
  try{
    const api=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'content-type':'application/json','x-api-key':ANTHROPIC_API_KEY,'anthropic-version':'2023-06-01'},body:JSON.stringify({model:MODEL,max_tokens:160,temperature:0,system,messages})});
    if(!api.ok){console.error('cosmetics Anthropic API error',api.status,await api.text());return fallback();}
    const data=await api.json();const reply=Array.isArray(data.content)?data.content.filter(b=>b.type==='text').map(b=>b.text).join('').trim():'';
    const clean=reply.replace(/[\u002a_\u0060]/g,'').replace(/\s+/g,' ').trim();if(!clean)return fallback();
    return res.status(200).json({reply:clean});
  }catch(error){console.error('cosmetics chat provider error',error);return fallback();}
}

