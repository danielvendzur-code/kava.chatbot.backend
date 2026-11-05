/* Séria 3: firma tejto adresy v tvare, ktorý číta schválená ukážka Andreine (cosmetics.js a vrstvy).
   Káva: z overených dát pražiarne (N447_DATA, ceny a odkazy z e-shopu). Kozmetika: z katalógu CX_CATALOGUES. */
(() => {
  'use strict';
  const data = window.COSMETICS_DEMOS;
  if (!data) return;
  const host = location.hostname.endsWith('.mojchatbot.sk') ? location.hostname.split('.')[0] : '';
  const slug = host || new URLSearchParams(location.search).get('demo') || '';
  const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));
  const wordmark = (src, name) => `<img class="cx-wordmark cx-logo" src="${esc(src)}" alt="${esc(name)}">`;

  const TEXT = {
    coffee: {
      sk: {titleSuffix: 'výber kávy', greeting: 'Dobrý deň. Napíšte, ako kávu pripravujete a akú chuť máte radi. Pomôžem vám vybrať z našej ponuky.', source: 'kava-demo-',
        includedChat: 'Príprava, chuť, mletie aj porovnanie dvoch káv.', includedAdvisor: 'Príprava, chuť a rozpočet — na konci konkrétna káva.',
        heading: 'Poradí zákazníkovi kávu a odpovie mu na otázky.', lead: 'Chatbot odpovie zákazníkovi na otázky o vašej káve. Cez pár krátkych otázok mu vyberie tú, ktorá sedí jeho príprave a chuti. Predáte aj vtedy, keď pri tom nie ste.',
        keepsAdvisor: 'na konci konkrétna káva', teaserTitle: 'Pomôcť s výberom kávy?', teaserNote: 'Krátky výber · konkrétna káva', advisorName: 'Poradca pri výbere kávy',
        tab: 'Výber kávy', entrySmall: 'VÝBER KÁVY', entryTitle: 'Nájsť vhodnú kávu', entryNote: 'Príprava · chuť · rozpočet', placeholder: 'Opýtajte sa na kávu…'},
      cs: {titleSuffix: 'výběr kávy', greeting: 'Dobrý den. Napište, jak kávu připravujete a jakou chuť máte rádi. Pomůžu vám vybrat z naší nabídky.', source: 'kava-demo-',
        includedChat: 'Příprava, chuť, mletí i porovnání dvou káv.', includedAdvisor: 'Příprava, chuť a rozpočet — na konci konkrétní káva.',
        heading: 'Poradí zákazníkovi kávu a odpoví mu na otázky.', lead: 'Chatbot odpoví zákazníkovi na otázky o vaší kávě. Přes pár krátkých otázek mu vybere tu, která sedí jeho přípravě a chuti. Prodáte i tehdy, když u toho nejste.',
        keepsAdvisor: 'na konci konkrétní káva', teaserTitle: 'Pomoct s výběrem kávy?', teaserNote: 'Krátký výběr · konkrétní káva', advisorName: 'Poradce při výběru kávy',
        tab: 'Výběr kávy', entrySmall: 'VÝBĚR KÁVY', entryTitle: 'Najít vhodnou kávu', entryNote: 'Příprava · chuť · rozpočet', placeholder: 'Zeptejte se na kávu…'}
    }
  };
  /* Nová séria: 447 € jednorazovo + 10 € mesačne, bez skúšobného obdobia (pre všetky segmenty). */
  const OFFER = (cs) => ({price: '447', trial: cs ? 'Bez zkušebního období' : 'Bez skúšobného obdobia', noTrial: true});

  /* Logá: úvod (biely podklad) vo farbách firmy; hlavička a bublina (tmavé) iba priehľadný tvar; kruh správy biely s logom vo farbách. */
  const LOGOS = {
    beansmiths: {landing: '/assets/s3/beansmiths/wordmark.png', header: '/assets/s3/beansmiths/wordmark.png', avatar: '/assets/s3/beansmiths/logo.png'},
    merrybeans: {landing: '/assets/s3/merrybeans/wordmark.png', header: '/assets/s3/merrybeans/wordmark-line.png', avatar: '/assets/s3/merrybeans/logo.png', cover: true},
    typika: {landing: '/assets/s3/typika/logo.png', header: '/assets/s3/typika/logo.png', avatar: '/assets/s3/typika/logo.png'},
    mlsnacava: {landing: '/assets/s3/mlsnacava/logo.png', header: '/assets/s3/mlsnacava/logo-mark.png', avatar: '/assets/s3/mlsnacava/logo.png', cover: true},
    tarani: {avatar: '/assets/s3/tarani/logo.png'}
  };
  if (LOGOS[slug]) window.CX_S3_MARK = {avatar: LOGOS[slug].avatar, cover: !!LOGOS[slug].cover};
  const N = window.N447_DATA && window.N447_DATA[slug];
  if (N) {
    const E = window.N447Engine, b = N.brand, cs = N.lang === 'cs';
    const products = N.products.filter((p) => p.available !== false && p.kind === 'coffee');
    const priceOf = (p) => { const v = E.verifiedPacks(p, {})[0]; return v ? E.grams(v.grams) + ' · ' + E.money(v.price, p.currency) : ''; };
    const catalogue = products.map((p) => ({id: p.id, name: p.name, url: p.url, photo: p.photo, available: true, price: priceOf(p),
      priceAmount: (E.verifiedPacks(p, {})[0] || {}).price, currency: p.currency, kind: cs ? 'Káva' : 'Káva', category: 'coffee', tags: [],
      reason: (p.notes || []).slice(0, 3).join(', '), description: p.summary || ''}));
    const hero = N.products.find((p) => p.id === (N.demo || {}).heroProductId);
    data.brands[slug] = {
      name: b.name, fullName: b.legal || b.name, domain: new URL(b.web).hostname.replace(/^www\./, ''), website: b.web, url: b.web, shopUrl: b.shopUrl,
      theme: Object.assign({line: '#e7e1d8'}, b.theme),
      wordmark: wordmark(LOGOS[slug]?.landing || b.logo, b.name),
      /* hlavička widgetu je tmavá a logo v nej je biele (filter Andreine) – iba priehľadná kresba bez plnej plochy */
      headerLogo: LOGOS[slug]?.header || b.logo,
      launcherMark: wordmark(LOGOS[slug]?.header || b.logo, b.name),
      hero: b.hero || (hero && hero.photo) || products[0].photo,
      products: catalogue, catalogue,
      quickChips: (N.chips || []).slice(0, 4),
      catalogueContext: 'coffee'
    };
    window.CX_SEGMENT = Object.assign({}, TEXT.coffee[cs ? 'cs' : 'sk'], OFFER(cs));
    if (cs) window.CX_FORCE_LANG = 'cs';
    window.N447_COSMETICS_SLUG = slug;
    /* Bez servera (statický hosting, offline test) odpovedá to isté overené jadro ako server. */
    window.CX_LOCAL_REPLY = (text, history) => { try { return window.N447Reply.coffeeReply(N, text, (history || []).map((m) => ({role: m.role, content: m.content}))); } catch (_) { return ''; } };
    return;
  }

  const BRANDS = {
    tarani: {name: 'TARANI', fullName: 'TARANI', domain: 'tarani.cz', website: 'https://www.tarani.cz/', url: 'https://www.tarani.cz/kosmetika-pece-o-plet/',
      theme: {brand: '#2b2622', accent: '#b98a3a', soft: '#f7f2ea', paper: '#ffffff', ink: '#231f1c', line: '#e8dfd1'},
      wordmark: wordmark('/assets/s3/tarani/wordmark.png', 'TARANI'), mark: '/assets/s3/tarani/logo.png',
      hero: '/assets/s3/tarani/24-gold-37-herbs-ultra-elixir-krem.jpg',
      ownerNote: 'Ájurvédská kosmetika z Himálají — výběr podle typu pleti a účinku.',
      quickChips: ['Mám citlivou pleť', 'Mám mastnou pleť', 'Máte něco proti vráskám?', 'Hledám čisticí gel'], lang: 'cs',
      greeting: 'Dobrý den. Napište, jakou máte pleť a co chcete řešit. Pomůžu vám vybrat z nabídky.'}
  };
  /* TARANI: druh starostlivosti (podľa e-shopu) a účinok (kategória „Pleť dle problematiky“) – texty volieb natívneho poradcu. */
  window.CX_TRAIT_COPY = {
    s3Cleanse: ['Čistenie a odlíčenie', 'Umývacie gély, odličovače', 'Čištění a odlíčení', 'Mycí gely, odličovače'],
    s3Tone: ['Tonikum', 'Po umytí, pred sérom alebo krémom', 'Tonikum', 'Po umytí, před sérem nebo krémem'],
    s3Serum: ['Sérum alebo olej', 'Koncentrovaná starostlivosť', 'Sérum nebo olej', 'Koncentrovaná péče'],
    s3Gel: ['Ľahká emulzia alebo gél', 'Ľahká textúra na deň', 'Lehká emulze nebo gel', 'Lehká textura na den'],
    s3Cream: ['Pleťový krém', 'Bohatšia denná alebo nočná starostlivosť', 'Pleťový krém', 'Bohatší denní nebo noční péče'],
    s3Mask: ['Maska alebo peeling', 'Doplnková starostlivosť raz za čas', 'Maska nebo peeling', 'Doplňková péče jednou za čas'],
    s3Calm: ['Upokojenie a začervenanie', 'Citlivá, podráždená pleť', 'Zklidnění a zarudnutí', 'Citlivá, podrážděná pleť'],
    s3Hydrate: ['Hydratácia', 'Suchá, napätá pleť', 'Hydratace', 'Suchá, napjatá pleť'],
    s3Antiage: ['Vrásky a pevnosť', 'Zrelá pleť', 'Vrásky a pevnost', 'Zralá pleť'],
    s3Detox: ['Čistá pleť a póry', 'Mastná, problematická pleť', 'Čistá pleť a póry', 'Mastná, problematická pleť'],
    s3Nourish: ['Výživa', 'Unavená, oslabená pleť', 'Výživa', 'Unavená, oslabená pleť'],
    s3Bright: ['Rozjasnenie a pigmentové škvrny', 'Matná pleť, nerovnomerný tón', 'Rozjasnění a pigmentové skvrny', 'Matná pleť, nerovnoměrný tón']
  };
  const brand = BRANDS[slug];
  const cat = globalThis.CX_CATALOGUES && globalThis.CX_CATALOGUES[slug];
  if (!brand || !cat) return;
  brand.products = cat.products.map((p) => ({...p, tags: p.tags || []}));
  brand.catalogue = cat.products;
  data.brands[slug] = brand;
  window.CX_SEGMENT = Object.assign({greeting: brand.greeting}, OFFER(brand.lang === 'cs'));
  if (brand.lang === 'cs') window.CX_FORCE_LANG = 'cs';
  window.N447_COSMETICS_SLUG = slug;
})();
