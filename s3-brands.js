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
        keepsAdvisor: 'na konci konkrétna káva', teaserTitle: 'Pomôcť s výberom kávy?', teaserAria: 'Otvoriť výber kávy', teaserNote: 'Krátky výber · konkrétna káva', advisorName: 'Poradca pri výbere kávy',
        tab: 'Výber kávy', entrySmall: 'VÝBER KÁVY', entryTitle: 'Nájsť vhodnú kávu', entryNote: 'Príprava · chuť · rozpočet', placeholder: 'Opýtajte sa na kávu…'},
      cs: {titleSuffix: 'výběr kávy', greeting: 'Dobrý den. Napište, jak kávu připravujete a jakou chuť máte rádi. Pomůžu vám vybrat z naší nabídky.', source: 'kava-demo-',
        includedChat: 'Příprava, chuť, mletí i porovnání dvou káv.', includedAdvisor: 'Příprava, chuť a rozpočet — na konci konkrétní káva.',
        heading: 'Poradí zákazníkovi kávu a odpoví mu na otázky.', lead: 'Chatbot odpoví zákazníkovi na otázky o vaší kávě. Přes pár krátkých otázek mu vybere tu, která sedí jeho přípravě a chuti. Prodáte i tehdy, když u toho nejste.',
        keepsAdvisor: 'na konci konkrétní káva', teaserTitle: 'Pomoct s výběrem kávy?', teaserAria: 'Otevřít výběr kávy', teaserNote: 'Krátký výběr · konkrétní káva', advisorName: 'Poradce při výběru kávy',
        tab: 'Výběr kávy', entrySmall: 'VÝBĚR KÁVY', entryTitle: 'Najít vhodnou kávu', entryNote: 'Příprava · chuť · rozpočet', placeholder: 'Zeptejte se na kávu…'}
    }
  };
  /* Nová séria: 447 € jednorazovo + 10 € mesačne, bez skúšobného obdobia (pre všetky segmenty). */
  const OFFER = (cs) => ({price: '447', trial: cs ? 'Bez zkušebního období' : 'Bez skúšobného obdobia', noTrial: true});

  /* Logá: úvod (biely podklad) vo farbách firmy; hlavička a bublina (tmavé) iba priehľadný tvar; kruh správy biely s logom vo farbách. */
  const REG = (window.S3_REG && window.S3_REG.demos) || {};
  const LOGOS = Object.fromEntries(Object.entries(REG).map(([k, v]) => [k, v.logos || {}]));
  if (LOGOS[slug]) window.CX_S3_MARK = {avatar: LOGOS[slug].avatar, cover: !!LOGOS[slug].cover};
  const N = window.N447_DATA && window.N447_DATA[slug];
  if (N) {
    const E = window.N447Engine, b = N.brand, cs = N.lang === 'cs';
    const products = N.products.filter((p) => p.available !== false && p.kind === 'coffee');
    const cheapest = (p) => (p.variants || []).filter((v) => v.verifiedAt && Number.isFinite(v.price) && v.available !== false).sort((m, n) => m.price - n.price || m.grams - n.grams)[0];
    const priceOf = (p) => { const v = cheapest(p); return v ? E.grams(v.grams) + ' · ' + E.money(v.price, p.currency) : ''; };
    const catalogue = products.map((p) => ({id: p.id, name: p.name, url: p.url, photo: p.photo, available: true, price: priceOf(p),
      priceAmount: (cheapest(p) || {}).price, currency: p.currency, kind: cs ? 'Káva' : 'Káva', category: 'coffee', tags: [],
      reason: (p.notes || []).slice(0, 3).join(', '), description: p.summary || '',
      /* s3a: karta v chate (podľa Langr) – pôvod a spracovanie, chuťové tóny */
      chatMeta: [String(p.origin || '').split(/[·(]/)[0].trim(), p.process ? String(p.process).split(/[,(]/)[0].trim() : ''].filter(Boolean).join(' · ') || (cs ? 'Káva' : 'Káva'),
      chatNote: (p.notes || []).length ? (cs ? 'V chuti ' : 'V chuti ') + p.notes.slice(0, 3).join(', ') + '.' : '', chatGo: cs ? 'Zobrazit kávu →' : 'Zobraziť kávu →'}));
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

  const BRANDS = Object.fromEntries(Object.entries(REG).filter(([, v]) => v.type === 'cosmetics').map(([k, v]) => [k, Object.assign({}, v.brand, {wordmark: wordmark(v.brand.logo, v.brand.name)})]));
  if (REG[slug] && REG[slug].traitCopy) window.CX_TRAIT_COPY = REG[slug].traitCopy;
  const brand = BRANDS[slug];
  const cat = globalThis.CX_CATALOGUES && globalThis.CX_CATALOGUES[slug];
  if (!brand || !cat) return;
  brand.products = cat.products.map((p) => ({...p, tags: p.tags || []}));
  brand.catalogue = cat.products;
  data.brands[slug] = brand;
  window.CX_SEGMENT = Object.assign({greeting: brand.greeting}, OFFER(brand.lang === 'cs'), REG[slug].segmentText || {});
  if (REG[slug].stepCopy) window.CX_STEP_COPY = REG[slug].stepCopy;
  if (REG[slug].panelText) window.CX_PANEL_TEXT = REG[slug].panelText;
  if (REG[slug].choicePhotos) window.CX_CHOICE_PHOTOS = REG[slug].choicePhotos;
  if (REG[slug].segment === 'tea' && window.S3TeaReply) window.CX_LOCAL_REPLY = (text, history) => window.S3TeaReply.teaReply(cat, text, (history || []).map((m) => ({role: m.role, content: m.content})));
  if (!brand.hero) brand.hero = (cat.products.find((p) => p.photo) || {}).photo;
  if (brand.lang === 'cs') window.CX_FORCE_LANG = 'cs';
  window.N447_COSMETICS_SLUG = slug;
})();
