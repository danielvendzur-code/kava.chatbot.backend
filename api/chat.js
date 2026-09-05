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
  },
  goriffee: {
    brand: "Goriffee roastery", web: "https://www.goriffee.com/shop/kava/",
    products: [
      "Jednoducho káva espresso blend – kávová, horká, silná; Automat, páka a moka",
      "Brazil Morada da Prata Natural – orechová, ovocná, sladká; Espresso, moka a automat",
      "Ethiopia Aricha Washed – florálna, ovocná, sladká; Filter — V60, Chemex, Aeropress",
      "Guatemala Finca La Senda Champagne Yeast – citrusová, fermentovaná, sladká; Filter a Aeropress",
      "Marshmallow brewing blend – jahoda, malina, vanilka; Filter a Cold Brew",
      "Colombia Tumbaga decaf na espresso – telo, sladkosť, karamel; Espresso aj mliečne nápoje; bez kofeínu"
    ],
    fallback: {
      automatic: "Do automatu je dobrý východiskový bod Jednoducho káva espresso blend. Klasický kávový profil bez ovocnej kyslosti.",
      milk: "Do mlieka sa hodí Jednoducho káva espresso blend. Bez ovocných experimentov — poriadne silná káva s klasickým profilom pre každodenné espresso aj mliečne nápoje.",
      filter: "Na filter siahnite po Ethiopia Aricha Washed. Svieža praná Etiópia s výraznou ovocnou aciditou.",
      decaf: "Bez kofeínu je v ponuke Colombia Tumbaga decaf na espresso. Decaf vyladený na espresso, v ktorom naplno vynikne mohutné telo a intenzívna sladkosť.",
      default: "Ak chcete začať istotou, dobrým smerom je Jednoducho káva espresso blend. Výber kávy potom zohľadní prípravu aj chuť, ktorú preferujete."
    }
  },
  readyafter: {
    brand: "Ready After", web: "https://www.readyafter.sk/zrnkova-kava/",
    products: [
      "Espresso MAT zmes – horká čokoláda, karamel, vyšší kofeín; Automat, páka a moka",
      "Brasil Santos Cerrado 17/18 Natural – horkosť, ovocná chuť, krása krémy; Espresso a moka",
      "Colombia Supremo Medelin Wash – čokoláda, sladkosť, plné telo; Espresso a mliečne nápoje",
      "Ethiopia Yirgacheffe Gr.2 YCFCU – jazmínový čaj, citrónová tráva, ružový grapefruit; Espresso aj filter",
      "Burundi Rumanda Muraho Natural Anaerobic – ananás, červené jablko, mandarinka; Filter a alternatívna príprava",
      "Bezkofeínová Colombia Supremo Sugar Cane – med, karamel, marhuľa; Espresso aj filter; bez kofeínu"
    ],
    fallback: {
      automatic: "Do automatu je dobrý východiskový bod Espresso MAT zmes. Plná zmes bez ovocnej kyslosti.",
      milk: "Do mlieka sa hodí Espresso MAT zmes. Pre toho, kto chce vyšší podiel kofeínu.",
      filter: "Na filter siahnite po Ethiopia Yirgacheffe Gr.2 YCFCU. Sladko-ovocná káva s výraznou sviežosťou.",
      decaf: "Bez kofeínu je v ponuke Bezkofeínová Colombia Supremo Sugar Cane. Ich prvá bezkofeínová káva s profilom med, karamel a sladká chuť s marhuľovou aciditou.",
      default: "Ak chcete začať istotou, dobrým smerom je Espresso MAT zmes. Výber kávy potom zohľadní prípravu aj chuť, ktorú preferujete."
    }
  },
  coffeesheep: {
    brand: "Coffee Sheep", web: "https://www.coffeesheep.sk/kava/",
    products: [
      "Sheepresso – intenzívna, vyvážená, plné telo; Espresso, automat a moka",
      "Belmondo Espresso Blend – čokoláda, kakao, jemné korenie; Espresso a mliečne nápoje",
      "Colombia Supremo – čokoláda, kakao, zamatová dochuť; Všetky spôsoby prípravy",
      "Kenya Kiambu – ovocná dochuť, aromatická, stredné telo; Filter, french press a moka",
      "Indonesia Aceh Gayo – zemitá, korenistá, plné telo; Filter, moka a french press",
      "Brazil Santos Carbonic Natural Decaf – tmavá čokoláda, kakao, oriešky; Espresso aj filter; bez kofeínu"
    ],
    fallback: {
      automatic: "Do automatu je dobrý východiskový bod Sheepresso. Intenzívna zmes bez ovocnej kyslosti.",
      milk: "Do mlieka sa hodí Sheepresso. Ich najobľúbenejšia espresso zmes — káva s intenzívnou a vyváženou chuťou, stavaná na top espresso.",
      filter: "Na filter siahnite po Kenya Kiambu. Výrazná, ale neagresívna acidita.",
      decaf: "Bez kofeínu je v ponuke Brazil Santos Carbonic Natural Decaf. Chute tmavej čokolády a kakaa s orieškovými tónmi.",
      default: "Ak chcete začať istotou, dobrým smerom je Sheepresso. Výber kávy potom zohľadní prípravu aj chuť, ktorú preferujete."
    }
  },
  zlatezrnko: {
    brand: "Zlaté Zrnko", web: "https://zlatezrnko.sk/obchod/",
    products: [
      "Emília – „JEMNÁ“ – oriešky, pečený chlieb, vyvážená; Automat, espresso aj mlieko",
      "India – „ČOKOLÁDOVÁ“ – horká čokoláda, pražené lieskové oriešky, vlašský orech; Espresso a moka",
      "Etiópia – „OVOCNÁ“ – zrelé ovocie, kvetinová dochuť, sviežosť; Filter aj espresso",
      "Káva na filter – Tanzánia – mandarinka, biely čaj, limetka; Filter a alternatívna príprava",
      "Smrťák – „SILNÝ“ – horká čokoláda, intenzita, vyšší kofeín; Espresso a moka",
      "Decaf Kolumbia – plná chuť, sladkosť, večerná káva; Espresso aj filter; bez kofeínu"
    ],
    fallback: {
      automatic: "Do automatu je dobrý východiskový bod Emília – „JEMNÁ“. Vyvážená chuť s jemnou aciditou.",
      milk: "Do mlieka sa hodí Emília – „JEMNÁ“. Ich najpredávanejšia káva — zmes arabík vyváženej chuti, ktorú ocení najširšie spektrum ľudí.",
      filter: "Na filter siahnite po Káva na filter – Tanzánia. Svetlo pražená výberovka s výraznou sviežosťou.",
      decaf: "Bez kofeínu je v ponuke Decaf Kolumbia. Bezkofeínová káva z fariem, ktoré vlastnia a vedú výhradne ženy.",
      default: "Ak chcete začať istotou, dobrým smerom je Emília – „JEMNÁ“. Výber kávy potom zohľadní prípravu aj chuť, ktorú preferujete."
    }
  },
  becafe: {
    brand: "Be:Café", web: "https://becafe.sk/kategoria-produktu/kava/",
    products: [
      "Crema Blend 70/30 – horká čokoláda, kakao, hustá créma; Automat aj pákový kávovar",
      "Guatemala Finca El Cascajal – mliečna čokoláda, mandle, kôstkové ovocie; Espresso a mliečne nápoje",
      "Copabanana Espresso – banán v čokoláde, tropické ovocie, sladké plné telo; Espresso na páke",
      "Ethiopia Sidamo Bombe Natural – ovocno-kvetinová, jahoda, natural sladkosť; Espresso aj filter",
      "Kenya Baragwi Guama filter – čierne ríbezle, červený grep, čierny čaj a med; V60, Chemex a Aeropress",
      "Colombia Ombligon Decaf filter – mandarínka, zrelé maliny, vanilkový kvet; Filter kedykoľvek počas dňa; bez kofeínu"
    ],
    fallback: {
      automatic: "Do automatu je dobrý východiskový bod Crema Blend 70/30. Takmer nulová kyslosť.",
      milk: "Do mlieka sa hodí Crema Blend 70/30. Zmes pre konzervatívnych kávičkárov — horká čokoláda a kakao, tridsať percent vietnamskej robusty pridáva kofeín aj hustú krému.",
      filter: "Na filter siahnite po Kenya Baragwi Guama filter. Iskrivá, šťavnatá acidita.",
      decaf: "Bez kofeínu je v ponuke Colombia Ombligon Decaf filter. Raritná odroda Ombligon od Nestora Lassa v sugar cane decaf spracovaní.",
      default: "Ak chcete začať istotou, dobrým smerom je Crema Blend 70/30. Výber kávy potom zohľadní prípravu aj chuť, ktorú preferujete."
    }
  },
  simplecoffee: {
    brand: "Simple Coffee", web: "https://simplecoffee.sk/kategorie/zrnkova-kava/",
    products: [
      "Oro Nero – čokoláda a oriešky, hustá créma, vysoký kofeín; Automat a pákový kávovar",
      "Tá pravá káva – mliečna čokoláda, oriešky, krémové telo; Každodenná káva do kávovaru",
      "Mexiko SHG EP – čokoláda, oriešky, ľahký ovocný tón; Espresso aj mlieko",
      "RUNNING HIGH – kvetinová Etiópia, jasná kyslosť, šťavnatá a ľahká; Filter, V60 a Chemex",
      "Keňa Nyeri – citrusy, sladká čerešňa, vínny nádych; Filter a alternatívne prípravy",
      "Peru Decaf – Swiss Water – sladkosť, telo, príjemná chuť; Večer aj po obede; bez kofeínu"
    ],
    fallback: {
      automatic: "Do automatu je dobrý východiskový bod Oro Nero. Nízka kyslosť, plné telo.",
      milk: "Do mlieka sa hodí Tá pravá káva. Káva o rovnováhe, nie o extrémoch.",
      filter: "Na filter siahnite po Keňa Nyeri. Živšia acidita, čistý profil.",
      decaf: "Bez kofeínu je v ponuke Peru Decaf – Swiss Water. Bezkofeínová káva, ktorá nie je kompromis.",
      default: "Ak chcete začať istotou, dobrým smerom je Oro Nero. Výber kávy potom zohľadní prípravu aj chuť, ktorú preferujete."
    }
  },
  ebenica: {
    brand: "EBENICA Coffee", web: "https://ebenica.sk/kategoria-produktu/kava/",
    products: [
      "Impulso – čokoláda, oriešky, hustá créma; Automatické kávovary",
      "Harmonelle – kvetinová aróma, čokoláda, krémová chuť; Espresso a mliečne nápoje",
      "Brasil Santos – sladká čokoláda, oriešky, harmonická; Espresso a cappuccino",
      "Ethiopia Guji Habesha – jazmínový čaj, kvetinové tóny, jemná kyselinka; Filter aj moderné espresso",
      "Kenya Tekangu Tegu – grep, kvety, maliny; Filter aj espresso",
      "EBENICA Zero – plná chuť, jemné ovocné tóny, bez kofeínu; Moderné espresso aj alternatívy; bez kofeínu"
    ],
    fallback: {
      automatic: "Do automatu je dobrý východiskový bod Impulso. Bez kyslosti, plné telo.",
      milk: "Do mlieka sa hodí Harmonelle. Výborne vyvážená espresso káva so sviežou kvetinovou arómou a tónmi čokolády.",
      filter: "Na filter siahnite po Kenya Tekangu Tegu. Jasná ovocná chuť.",
      decaf: "Bez kofeínu je v ponuke EBENICA Zero. Kolumbijská arabika zbavená kofeínu šetrnou metódou.",
      default: "Ak chcete začať istotou, dobrým smerom je Impulso. Výber kávy potom zohľadní prípravu aj chuť, ktorú preferujete."
    }
  },
  casadelcaffe: {
    brand: "Casa del Caffé", web: "https://casadelcaffe.sk/kategoria-produktu/kava/",
    products: [
      "Bella Italia – horká čokoláda, kakao, hustá oriešková kréma; Automat a pákový kávovar",
      "Toscana – kakao, pražené lieskové oriešky, tmavá čokoláda; Espresso a moka",
      "Markom – mliečna čokoláda, oriešky, jemnosť; Cappuccino a mliečne nápoje",
      "Colombia Supremo – jemne sladká, zamatová čokoláda, stredne plné telo; Filter aj espresso",
      "Honduras Marcala BIO – čerešne, mliečna čokoláda, smotanový záver; Filter a alternatívne prípravy",
      "Bezkofeínová káva BIO – mliečna čokoláda, sladký karamel, orechový záver; Neskoré popoludnie a večer; bez kofeínu"
    ],
    fallback: {
      automatic: "Do automatu je dobrý východiskový bod Bella Italia. Nulová kyslosť, plné zemité telo.",
      milk: "Do mlieka sa hodí Markom. Stredne silná káva z Južnej a Strednej Ameriky s jemnou chuťou mliečnej čokolády a orieškov.",
      filter: "Na filter siahnite po Colombia Supremo. Dokonalá rovnováha sladkosti a acidity.",
      decaf: "Bez kofeínu je v ponuke Bezkofeínová káva BIO. Šetrný proces dekofeinizácie bez použitia chémie zachová chuť — mliečna čokoláda, sladký karamel a orechový záver.",
      default: "Ak chcete začať istotou, dobrým smerom je Bella Italia. Výber kávy potom zohľadní prípravu aj chuť, ktorú preferujete."
    }
  },
  coffeeveronia: {
    brand: "Coffee Veronia", web: "https://www.coffeeveronia.sk/arabika/",
    products: [
      "Brazil Signature Espresso 200 g – čokoláda, oriešky, hustá créma; Automat a pákový kávovar",
      "Brazil Santos Exclusive 200 g – sladká čokoláda, oriešky, jemnosť; Espresso a mliečne nápoje",
      "Etiópia 250 g – kvetinová aróma, ovocie, sviežosť; Filter aj espresso",
      "Costa Rica Yellow Honey 200 g – medová sladkosť, čistý profil, ovocie; V60, Chemex a Aeropress",
      "Rwanda – limitovaná edícia 200 g – červené ovocie, výrazný profil, africký charakter; Filter a alternatívne prípravy",
      "Mexiko bezkofeínová 250 g – jemná sladkosť, orech, plná chuť; Popoludnie a večer; bez kofeínu"
    ],
    fallback: {
      automatic: "Do automatu je dobrý východiskový bod Brazil Signature Espresso 200 g. Bez výraznej kyslosti.",
      milk: "Do mlieka sa hodí Brazil Santos Exclusive 200 g. Klasika z brazílskeho Santosu — sladká čokoládová chuť s orieškami, ktorá sa v mlieku nestratí.",
      filter: "Na filter siahnite po Costa Rica Yellow Honey 200 g. Šťavnatá, s medovou sladkosťou.",
      decaf: "Bez kofeínu je v ponuke Mexiko bezkofeínová 250 g. Mexická arabika zbavená kofeínu metódou Mountain Water — bez chemických rozpúšťadiel a s plnou chuťou.",
      default: "Ak chcete začať istotou, dobrým smerom je Brazil Signature Espresso 200 g. Výber kávy potom zohľadní prípravu aj chuť, ktorú preferujete."
    }
  },
  grandroastery: {
    brand: "Grand Roastery", web: "https://www.grandroastery.sk/cerstvo-prazena-kava-1",
    products: [
      "Créma Blend – hustá créma, plné telo, bez kyslosti; Automatické kávovary",
      "Espresso Blend – čokoláda, karamel, vyvážená; Pákový kávovar",
      "Brazília Cemorrado Choco – čokoláda, oriešky, sladkosť; Espresso a moka",
      "Ethiopia Berhanu Kurse – kvetinová aróma, ovocie, sviežosť; Filter aj moderné espresso",
      "Colombia El Diviso Natural – tropické ovocie, výrazná sladkosť, experimentálne spracovanie; V60, Chemex a Aeropress",
      "Colombia Supremo Sugar Cane DECAF – karamel, sladkosť, plná chuť; Popoludnie a večer; bez kofeínu"
    ],
    fallback: {
      automatic: "Do automatu je dobrý východiskový bod Créma Blend. Bez výraznej kyslosti.",
      milk: "Do mlieka sa hodí Créma Blend. Zmes postavená na hustú krému a plné telo.",
      filter: "Na filter siahnite po Colombia El Diviso Natural. Intenzívna, ovocná.",
      decaf: "Bez kofeínu je v ponuke Colombia Supremo Sugar Cane DECAF. Kolumbijská arabika zbavená kofeínu prírodnou metódou z cukrovej trstiny — sladká a plná aj bez kofeínu.",
      default: "Ak chcete začať istotou, dobrým smerom je Créma Blend. Výber kávy potom zohľadní prípravu aj chuť, ktorú preferujete."
    }
  },
  coffeein: {
    brand: "COFFEEIN", web: "https://www.coffeein.sk/kategoria/2/cerstvo-prazena-zrnkova-kava/1/",
    products: [
      "Brutálne silná káva – horká čokoláda, kakao, karamel; Automat a pákový kávovar",
      "COFFEEIN Elite espresso zmes – čokoláda, orechy, karamel; Espresso a mliečne nápoje",
      "Ethiopia Adorsi – sušené ovocie, karamel, korenisté tóny; Filter aj espresso",
      "Kenya Mutitu NATURAL – bobuľové ovocie, zelené jablko, tropické ovocie; V60, Chemex a Aeropress",
      "Vietnam Lang Biang NATURAL – sušené ovocie, trstinový cukor, mandarínky; Espresso a filter",
      "Colombia Nogales DECAF – bobuľové ovocie, slivky, karamel; Popoludnie a večer; bez kofeínu"
    ],
    fallback: {
      automatic: "Do automatu je dobrý východiskový bod Brutálne silná káva. Bez štipky acidity a kyslosti.",
      milk: "Do mlieka sa hodí COFFEEIN Elite espresso zmes. Mohutné telo s orechovými tónmi a veľmi jemnou aciditou.",
      filter: "Na filter siahnite po Kenya Mutitu NATURAL. Živá, ovocná.",
      decaf: "Bez kofeínu je v ponuke Colombia Nogales DECAF. Stredne silné čajové telo, sladkosť bobuľového ovocia a sliviek, dochuť v tóne jemnej karamelizácie — a bez kofeínu.",
      default: "Ak chcete začať istotou, dobrým smerom je Brutálne silná káva. Výber kávy potom zohľadní prípravu aj chuť, ktorú preferujete."
    }
  },
  kavoholik: {
    brand: "Kávoholik", web: "https://kavoholik.sk/12-e-shop",
    products: [
      "Espresso káva Jánošík 90/10 – čokoláda, oriešky, plná chuť; Automat a pákový kávovar",
      "Espresso káva Štúr 80/20 – horká čokoláda, hustá créma, vyšší kofeín; Pákový kávovar a moka",
      "Káva Štefánik – Brazília YB – sladká čokoláda, oriešky, jemnosť; Espresso a mliečne nápoje",
      "Etiópia Dimtu Guji washed – broskyňa, čierny čaj, ovocnosť; Filter aj espresso",
      "Kolumbia Edwin Noreňa – Caturra Chiroso – kvety a jazmín, zelené jablko, zelený čaj; V60, Chemex a Aeropress",
      "Decaf na filter – Kolumbia Popayán – sladkosť, plná chuť, bez kofeínu; Filter kedykoľvek počas dňa; bez kofeínu"
    ],
    fallback: {
      automatic: "Do automatu je dobrý východiskový bod Espresso káva Jánošík 90/10. Nízka, vyvážená.",
      milk: "Do mlieka sa hodí Espresso káva Jánošík 90/10. Desatina robusty pridá telo aj krému.",
      filter: "Na filter siahnite po Kolumbia Edwin Noreňa – Caturra Chiroso. Jasná, čajová.",
      decaf: "Bez kofeínu je v ponuke Decaf na filter – Kolumbia Popayán. Bezkofeínová Kolumbia z oblasti Popayán, pražená na filter — bez kofeínu a bez toho, aby chuť ostala niekde vzadu.",
      default: "Ak chcete začať istotou, dobrým smerom je Espresso káva Jánošík 90/10. Výber kávy potom zohľadní prípravu aj chuť, ktorú preferujete."
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
