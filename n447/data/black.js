/* BLACK. (pražiareň black., Bratislava) – overený katalóg novej dávky (447 € + 10 €/mes., bez trialu).
   Zdroj: https://www.black.sk/sk/e-shop/kava, každý detail produktu prečítaný 2026-10-22; výpis znova 2026-10-27 (akcie, nová káva diego bermudez).
   CENY: detail kávy ukazuje iba rozsah „od – do“; cena konkrétnej kombinácie (praženie × gramáž × mletie)
   sa zobrazí až po výbere v e-shope. `variants` obsahuje IBA kombinácie overené v živom UI e-shopu.
   priceFrom je informatívna dolná hranica rozsahu a nikdy nesplní rozpočet.
   Stav overenia variantov (27. 10.): žiadna kombinácia nie je dnes doložená → všetky kávy ukazujú iba „od X €“,
   cena sa neviaže na balenie a nepočíta sa súčet. brazil • doce citrus (kontrola Codex 22. 10.) je v heldVariants
   ako HOLD; e-shop blokuje automatické čítanie (WAF/429), rozpočtová otázka sa nezobrazí. */
(function (g) {
  'use strict';
  const CHECKED = '2026-10-22';
  const P = 'https://www.black.sk/sk/';
  const A = '/assets/black/';
  const GRINDS = ['Zrnková', 'Mletá espresso', 'Mletá moka konvička', 'Mletá aeropress', 'Mletá drip', 'Mletá french press', 'Mletá cold brew'];
  const coffee = (o) => Object.assign({kind: 'coffee', currency: 'EUR', weights: [200, 500, 1000], grinds: GRINDS, decaf: false,
    available: true, stockStated: false, checkedAt: CHECKED, variants: []}, o, {photo: A + o.photo, url: P + o.slug});
  const codex = (roast, grams, price) => ({roast, grams, grind: 'Zrnková', price, verifiedAt: CHECKED, source: 'živé UI e-shopu, výber gramáže (kontrola Codex)'});

  const BLACK = {
    slug: 'black', lang: 'sk', checkedAt: CHECKED,
    demo: {heroProductId: 'doce-citrus', logoMono: true, logoWide: true},
    brand: {
      name: 'black.', legal: 'pražiareň black.', place: 'Pražiareň black. · Bratislava',
      shopUrl: 'https://www.black.sk/sk/e-shop/kava', web: 'https://www.black.sk/sk',
      logo: A + 'logo.png', hero: A + 'hero.jpg', contact: 'ahoj@black.sk', contactSource: 'https://www.black.sk/sk/kontakt',
      theme: {ink: '#141414', brand: '#141414', accent: '#141414', soft: '#f3f1ee', paper: '#ffffff'}
    },
    scope: 'Všetkých 16 zrnkových/mletých káv z kategórie káva a drip vrecúška drippin. Kapsule, cascara, doplnky a merch nie sú vo výbere.',
    excluded: [
      {name: 'cascara • costa rica las lajas', url: P + 'cascara', reason: 'Čaj zo sušenej kávovej čerešne, nie káva.'},
      {name: 'kapsule • black sheep', url: P + 'kapsule-black-sheep', reason: 'Kapsule.'},
      {name: 'kapsule • colombia aponte', url: P + 'kapsule-colombia-aponte', reason: 'Kapsule.'},
      {name: 'kapsule • colombia popayán decaf', url: P + 'kapsule-decaf', reason: 'Kapsule.'}
    ],
    shop: {freeShipping: 'Doprava zdarma pri nákupe nad 40 € na Slovensko a do Česka.', freeShippingSource: 'https://www.black.sk/sk/brazil-doce-citrus'},
    guides: {v60: {title: 'Recept na HARIO V60 od black.', url: P + 'hario-v60',
      steps: ['20 g kávy a približne 300 g vody s teplotou okolo 95 °C.', 'Papierový filter prepláchnite horúcou vodou a vodu vylejte.', 'Najprv 60–80 g vody na 20–40 sekúnd, potom zvyšok pomaly v krúžkoch.', 'Celé lúhovanie najviac približne 2,5 minúty.']}},
    products: [
      coffee({id: 'black-sheep', slug: 'blend-black-sheep', name: 'blend • black sheep', photo: 'blend-black-sheep.jpg', priceFrom: 10.5, priceTo: 90,
        promoNote: 'Akcia v e-shope 27. 10.: od 10,00 € (pôvodne od 10,50 €), bez dátumu konca; ukážka počíta s bežnou cenou.',
        weights: [200, 500, 1000, 2500], roasts: ['espresso'], taste: 'choco', notes: ['horká čokoláda', 'lesné ovocie', 'sušené kôstkové ovocie'],
        origin: 'Brazília (Cerrado Mineiro) & Etiópia (Guji)', variety: 'Yellow Bourbon & heirloom', process: 'pulped natural & natural', altitude: '1150–1950 m n. m.',
        summary: 'Sladký a plný blend pre tých, ktorí sú zvyknutí skôr na tmavšie kávy; spája sladkosť brazílskej kávy s ovocnosťou etiópskej natural.'}),
      coffee({id: 'doce-citrus', region: 'americas', slug: 'brazil-doce-citrus', name: 'brazil • doce citrus', photo: 'brazil-doce-citrus.jpg', priceFrom: 10.5, priceTo: 39,
        roasts: ['espresso'], taste: 'choco', notes: ['marhuľa', 'hrozienka', 'karamel', 'horká čokoláda', 'lieskový oriešok'],
        origin: 'Brazília · Monte Carmelo', farm: 'Cosme e Damião', variety: 'Obatã, Acaiá, Arara', process: 'natural', altitude: '835 m n. m.',
        summary: 'Sladká a krémová káva, ktorú pražiareň predstavuje ako klasickú voľbu do kávovaru aj na domácu prípravu.',
        /* HOLD 27. 10.: kombinácie z kontroly Codex 22. 10. sa dnes nedali znova doložiť bežným prístupom
           (oficiálny web nie je z tejto relácie dostupný) → výsledok ukazuje iba „od 10,50 €“, bez balenia a súčtu. */
        heldVariants: [codex('espresso', 200, 10.5), codex('espresso', 500, 22.5), codex('espresso', 1000, 39)]}),
      coffee({id: 'los-hibiscos', region: 'americas', slug: 'colombia-los-hibiscos', name: 'colombia • los hibiscos', photo: 'colombia-los-hibiscos.jpg', priceFrom: 11, priceTo: 42,
        roasts: ['espresso'], taste: 'choco', notes: ['toffee', 'lesné ovocie', 'červené jablko', 'mliečna čokoláda'],
        origin: 'Kolumbia · Huila', variety: 'Caturra', process: 'washed', altitude: '1300–1900 m n. m.',
        summary: 'Sladká, sirupová káva z kolumbijskej Huily; pražiareň ju uvádza ako dobrý pomer ceny a chuti do domáceho kávovaru.'}),
      coffee({id: 'gundikhan', region: 'asia', slug: 'india-gundikhan', name: 'india • gundikhan', photo: 'india-gundikhan.jpg', priceFrom: 15, priceTo: 58,
        promoNote: 'Akcia v e-shope 27. 10.: od 13,50 € (pôvodne od 15,00 €), bez dátumu konca; ukážka počíta s bežnou cenou.',
        roasts: ['espresso'], taste: 'fruitFull', notes: ['višne', 'purpurové hrozno', 'biela broskyňa', 'mliečna čokoláda'],
        origin: 'India · Karnataka (Chikkamagalur)', variety: 'Chandragiri', process: 'washed', altitude: '1400 m n. m.',
        summary: 'Sladká a plná washed káva z rodinnej farmy, ktorá pestuje v tieni pôvodných stromov pri rezervácii Bhadra.'}),
      coffee({id: 'hospura', region: 'asia', slug: 'india-hospura', name: 'india • hospura', photo: 'india-hospura.jpg', priceFrom: 15, priceTo: 58,
        roasts: ['filter', 'espresso'], taste: 'fruitFull', notes: ['višne', 'datle', 'brusnice', 'čučoriedky', 'kakao'],
        origin: 'India · Karnataka (Baba Budan Giri)', farm: 'Hospura Estate', variety: 'Chandragiri', process: 'natural', altitude: '1300 m n. m.',
        summary: 'Sladká a krémová natural káva z farmy Hospura pestovanej v tieni stromov; v závere kakao.'}),
      coffee({id: 'esayas-beriso', region: 'africa', slug: 'ethiopia-esayas-beriso', name: 'ethiopia • esayas beriso', photo: 'ethiopia-esayas-beriso.jpg', priceFrom: 16, priceTo: 58,
        roasts: ['filter', 'espresso'], taste: 'fruitFull', notes: ['maliny', 'čučoriedky', 'ananás', 'bergamot'],
        origin: 'Etiópia · Hambela Wamena', farm: 'farma Esayasa Berisa', variety: '74158', process: 'natural', altitude: '2350 m n. m.',
        summary: 'Krémová a tropická natural káva z vysoko položenej farmy; bobule sa sušia na vyvýšených lôžkach.'}),
      coffee({id: 'el-paraiso', region: 'americas', slug: 'honduras-el-paraiso', name: 'honduras • el paraíso', photo: 'honduras-el-paraiso.jpg', priceFrom: 14, priceTo: 49,
        promoNote: 'Akcia v e-shope 27. 10.: od 12,60 € (pôvodne od 14,00 €), bez dátumu konca; ukážka počíta s bežnou cenou.',
        roasts: ['filter', 'espresso'], taste: 'fruitFull', notes: ['ibištek', 'ostružiny', 'papája', 'červené ríbezle', 'slivka'],
        origin: 'Honduras · Santa Rosa de Copán', farm: 'El Paraíso', variety: 'Parainema', process: 'natural anaerobic', altitude: 'približne 1600 m n. m.',
        summary: 'Sladká a sirupová káva s krémovým telom; anaeróbne natural spracovanie z farmy El Paraíso.'}),
      coffee({id: 'sophie-wafula', region: 'africa', slug: 'kenya-sophie-wafula', name: 'kenya • sophie wafula', photo: 'kenya-sophie-wafula.jpg', priceFrom: 15, priceTo: 54,
        roasts: ['filter', 'espresso'], taste: 'fruitFull', notes: ['granátové jablko', 'liči', 'čierne ríbezle', 'javorový sirup'],
        origin: 'Keňa · Nairobi', farm: 'rodinná farma Davida a Sophie Wafulových', variety: 'Ruiru 11, Batian', process: 'natural', altitude: '1500 m n. m.',
        summary: 'Ovocná natural káva z Kene; bobule fermentujú 72 hodín pred sušením, v závere javorový sirup.'}),
      coffee({id: 'jukia', region: 'africa', slug: 'uganda-jukia', name: 'uganda • jukia', photo: 'uganda-jukia.jpg', priceFrom: 15, priceTo: 54,
        roasts: ['filter', 'espresso'], taste: 'fruitFull', notes: ['papája', 'višne', 'hrozno', 'maliny', 'kakao'],
        origin: 'Uganda · Zombo (Alur Highlands)', farm: 'spracovateľská stanica Jukia', variety: 'SL14 & Bourbon', process: 'natural', altitude: '1250 m n. m.',
        summary: 'Sladká a krémová natural káva so 48-hodinovou fermentáciou; v závere kakao.'}),
      coffee({id: 'gicherori', region: 'africa', slug: 'kenya-gicherori-aa', name: 'kenya • gicherori aa', photo: 'kenya-gicherori-aa.jpg', priceFrom: 15, priceTo: 56,
        roasts: ['filter', 'espresso'], taste: 'fresh', notes: ['cherry cola', 'čierne ríbezle', 'granátové jablko', 'ostružiny', 'baza'],
        origin: 'Keňa · Embu (Mount Kenya)', farm: 'stanica Gicherori, družstvo Kibugu', variety: 'SL28 & SL34', process: 'washed', altitude: '1600–1800 m n. m.',
        summary: 'Sirupová a šťavnatá washed káva z družstva na svahoch Mount Kenya; v závere baza.'}),
      coffee({id: 'kiangoi', region: 'africa', slug: 'kenya-kiangoi-ab', name: 'kenya • kiangoi ab', photo: 'kenya-kiangoi-ab.jpg', priceFrom: 15, priceTo: 54,
        roasts: ['filter', 'espresso'], taste: 'fresh', notes: ['čierne ríbezle', 'maliny', 'limetka', 'šípkový čaj'],
        origin: 'Keňa · Embu', farm: 'stanica Kiangoi, družstvo Rungeto', variety: 'SL28 & SL34', process: 'washed', altitude: '1100–1650 m n. m.',
        summary: 'Šťavnatá a hravá washed káva s limetkovou kyslosťou a záverom pripomínajúcim šípkový čaj.'}),
      coffee({id: 'gitega', region: 'africa', slug: 'rwanda-gitega', name: 'rwanda • gitega', photo: 'rwanda-gitega.jpg', priceFrom: 14, priceTo: 54,
        roasts: ['filter', 'espresso'], taste: 'fresh', notes: ['červené ríbezle', 'čierny čaj', 'maliny', 'limetka', 'ibištek'],
        origin: 'Rwanda · Nyamagabe', farm: 'stanica Gitega Hills', variety: 'Red Bourbon, Mbirizi', process: 'washed', altitude: '1700–1900 m n. m.',
        summary: 'Washed káva z vysoko položenej stanice v južnej Rwande; čistý, ovocný a svieži šálok s ibištekom v závere.'}),
      coffee({id: 'gotiti', region: 'africa', slug: 'ethiopia-gotiti', name: 'ethiopia • gotiti', photo: 'ethiopia-gotiti.jpg', priceFrom: 14.5, priceTo: 54,
        roasts: ['filter', 'espresso'], taste: 'fresh', notes: ['jahody', 'bergamot', 'broskyňový ľadový čaj', 'biely čaj'],
        origin: 'Etiópia · Gedeb (Gedeo)', farm: 'stanica Eva Gotiti', variety: '74110, 74112', process: 'washed', altitude: '2000–2100 m n. m.',
        summary: 'Ľahká, ale zložitá washed káva od malých pestovateľov; v závere biely čaj.'}),
      coffee({id: 'juicy-pussy', region: 'blend', slug: 'juicy-pussy', name: 'blend • juicy pussy', photo: 'blend-juicy-pussy.jpg', priceFrom: 13.5, priceTo: 55,
        roasts: ['filter'], taste: 'fresh', notes: [], profile: 'šťavnatá, sladká a svieža',
        origin: 'sezónny blend (zložky sa menia podľa sezóny)', process: 'washed kávy s malým podielom natural',
        summary: 'Sezónny filtrový blend na každý deň: ovocné washed kávy doplnené natural zložkou pre telo a sladkosť.'}),
      coffee({id: 'popayan-decaf', region: 'americas', slug: 'colombia-popayan-decaf', name: 'colombia • popayán decaf', photo: 'black-decaf.jpg', priceFrom: 13.5, priceTo: 52,
        roasts: ['omni'], taste: 'fresh', decaf: true, decafNote: 'Kofeín sa odstraňuje šetrne, etylacetátom z cukrovej trstiny.', notes: ['pomarančový džús', 'broskyňa', 'žlté kôstkové ovocie', 'červené jablko', 'mandle'],
        origin: 'Kolumbia · Popayán (Cauca)', farm: 'Cofinet, približne 65 pestovateľov', variety: 'Colombia, Castillo, Caturra', process: 'washed, bez kofeínu metódou z cukrovej trstiny', altitude: '1500–2070 m n. m.',
        summary: 'Bezkofeínová káva; kofeín sa odstraňuje etylacetátom z cukrovej trstiny. Sladká a sirupová s mandľovým záverom.'}),
      coffee({id: 'diego-bermudez', region: 'americas', slug: 'colombia-diego-bermudez', name: 'colombia • diego bermudez', photo: 'colombia-diego-bermudez.jpg', priceFrom: 18, priceTo: 48,
        checkedAt: '2026-10-27', weights: [150, 500, 1000], roasts: ['filter'], taste: 'fresh', notes: ['kardamóm', 'jablkové crumble', 'vanilka', 'pistácie'],
        origin: 'Kolumbia · Cauca (Piendamó)', farm: 'Finca El Paraíso', variety: 'Castillo', process: 'double anaerobic washed', altitude: '1960 m n. m.',
        summary: 'Sladká a dezertná káva s tónmi kardamómu, jablkového crumble a vanilky, citrusovou aciditou a dochuťou pistácií (novinka, prečítané 27. 10.).'}),
    ],
    drip: {
      id: 'drippin', kind: 'drip', name: 'drippin.', url: P + 'drippin', photo: A + 'drippin-hlavna-foto.jpg',
      price: 12, currency: 'EUR', priceVerified: true, pack: '8 drip vrecúšok × 13 g', available: true, stockStated: false, checkedAt: CHECKED,
      summary: 'Drip vrecúška s výberovou kávou black.: stačí šálka a horúca voda.',
      options: [
        {id: 'juicy', title: 'blend juicy pussy (Kolumbia)', detail: 'šťavnatá, sladká a svieža'},
        {id: 'burundi', title: 'Burundi rumbagabanga', detail: 'čierny čaj · ibištek · červené jablko · čerešňa · pomarančový kvet'}
      ],
      brew: ['Vrecúško otvorte a filter pevne zaveste na šálku.', 'Prelievajte filtrovanou vodou s teplotou okolo 96 °C po dávkach približne 60 ml; každú nechajte pretiecť.', 'Spolu približne 200 ml, celé to trvá okolo 2 minút. Potom filter vyberte.']
    }
  };
  (g.N447_DATA = g.N447_DATA || {}).black = BLACK;
  if (typeof module !== 'undefined' && module.exports) module.exports = BLACK;
})(typeof globalThis !== 'undefined' ? globalThis : window);
