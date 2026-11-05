/* Hair segment. The engine (cosmetics.js and its skincare-* layers) is shared
   with the skincare demos unchanged and writes its fixed sentences about skin;
   this layer, loaded last, puts the same sentences about hair in their place:
   the greeting, the quick questions, the offline chat answers, the result
   tags, the routine line and the contact source. The questions themselves are
   in cosmetics-config.js. */
(() => {
  'use strict';

  const slug = document.body?.dataset?.cosmeticsDemo;
  const brand = window.COSMETICS_DEMOS?.brands?.[slug];
  const root = document.querySelector('#cosmetics-root');
  if (!brand || !root) return;

  const SOURCE_PREFIX = 'vlasy-demo-';

  const GREETING_SKIN = 'Dobrý deň. Napíšte, čo od starostlivosti očakávate alebo ako sa vaša pleť správa. Pomôžem vám zúžiť výber.';
  const GREETING = 'Dobrý deň. Napíšte, aké máte vlasy a čo vás na nich trápi. Pomôžem vám vybrať z ponuky.';

  const CHIPS = {
    'Mám suchú pleť': 'Mám suché vlasy',
    'Pleť sa mi mastí': 'Vlasy sa mi rýchlo mastia',
    'Niečo na citlivú pleť': 'Svrbí ma pokožka hlavy',
    'Chcem jednoduchú rutinu': 'Vypadávajú mi vlasy'
  };

  const TEXTS = [
    ['Zloženie, typ pleti, rutina aj porovnanie dvoch produktov.', 'Zloženie, typ vlasov, rutina aj porovnanie dvoch produktov.'],
    ['Pleť, priorita, rutina a textúra — na konci jeden konkrétny produkt.', 'Vlasy, priorita, rutina a forma — na konci jeden konkrétny produkt.'],
    ['Pleť · priorita · rutina · textúra', 'Vlasy · priorita · rutina · forma'],
    ['podľa typu pleti, priority a preferovanej textúry', 'podľa typu vlasov, priority a preferovanej formy']
  ];

  /* Result tags: the engine's skin words, by the word it writes. */
  const LABELS = {
    'suchá pleť': 'suché vlasy', 'mastenie': 'mastenie', 'citlivá pleť': 'citlivá pokožka', 'zmiešaná pleť': 'normálne vlasy',
    'hydratácia': 'výživa', 'upokojenie': 'upokojenie', 'nedokonalosti': 'objem', 'zrelá pleť': 'posilnenie',
    'celá rutina': 'celá starostlivosť', 'krém': 'šampón', 'sérum': 'sérum a tonikum', 'olej': 'dĺžky'
  };

  /* Offline answers. The engine answers first (and the API may replace it);
     an engine sentence about skin is recognised by its opening and rewritten
     from the customer's own question. */
  const ENGINE_REPLY = /^(Pri suchej alebo napnutej pleti|Pri vyššej tvorbe mazu|Pri citlivejšej pleti|Pre zrelšiu pleť|Zloženie je uvedené pri každom produkte|Ceny sú uvedené pri produktoch|Z ponuky .+ je dobrý začiatok)/;

  /* A brand may name the product it wants for a typical question
     (`chatPicks: {oily:'id'}`); otherwise the best tag match answers. */
  const chosen = (key) => brand.products.find((product) => product.id === brand.chatPicks?.[key])?.name;
  const pick = (...tags) => {
    const ranked = brand.products
      .map((product, index) => ({ product, index, hits: tags.filter((tag) => product.tags.includes(tag)).length, main: product.tags.includes(tags[0]) }))
      .filter((item) => item.main)
      .sort((a, b) => b.hits - a.hits || a.index - b.index);
    return (ranked[0]?.product || brand.products[0]).name;
  };

  const hairReply = (text) => {
    const q = String(text || '').toLocaleLowerCase('sk');
    if (/lup|svrb|citliv|podráž|podraz|šupin|supin|pokož|pokoz|ekzém|štíp|stip/.test(q))
      return `Pri citlivej pokožke hlavy alebo lupinách by som začal produktom ${chosen('sensitive') || pick('sensitive', 'calm')}. Ak ťažkosti trvajú dlhšie alebo sa zhoršujú, poraďte sa s dermatológom.`;
    if (/vypad|padaj|redn|rídn|ridn|slab|rast|hust|posil|lysin/.test(q))
      return `Pri vypadávaní alebo slabých vlasoch je z ponuky značky ${brand.name} vhodný smer ${chosen('mature') || pick('mature', 'balanced')}. Výber starostlivosti ešte zohľadní, či chcete šampón, sérum alebo celú starostlivosť.`;
    if (/mast|maz/.test(q))
      return `Keď sa vlasy rýchlo mastia, oplatí sa pozrieť na ${chosen('oily') || pick('oily', 'cream')}. Výber starostlivosti vám pomôže zúžiť výsledok bez skúšania naslepo.`;
    if (/objem|splasnut|splihl|ploch|jemn|tenk/.test(q))
      return `Pre jemné vlasy bez objemu je z ponuky značky ${brand.name} dobrý smer ${chosen('volume') || pick('clarity', 'balanced')}. Výber starostlivosti ešte zohľadní, či chcete šampón, sérum alebo ľahkú starostlivosť o dĺžky.`;
    if (/such|lámav|lamav|krep|poškod|poskod|konč|konc|farb|zniče|znice|kudrn|vlnit/.test(q))
      return `Pri suchých a lámavých vlasoch by som začal produktom ${chosen('dry') || pick('dry', 'hydrate')}. Vo Výbere starostlivosti ešte zohľadníme, či chcete šampón, sérum alebo starostlivosť o dĺžky.`;
    const first = brand.products[0];
    if (/odkia|zložen|zlozen|obsahuj|ingredien|prísad|prisad/.test(q))
      return `Zloženie je uvedené pri každom produkte na webe ${brand.name}. Napríklad ${first.name}: ${first.reason} Napíšte, aké máte vlasy, a vyberiem jeden konkrétny.`;
    if (/cena|ceny|cenu|koľko|kolko|stoj|draho|lacn/.test(q))
      return `Ceny sú uvedené pri produktoch — ${first.name} je ${first.price}. Cez štyri krátke kroky vo Výbere vyberiem ten, ktorý vám sadne, aj s cenou.`;
    return `Z ponuky značky ${brand.name} je dobrý začiatok ${first.name}. Napíšte, aké máte vlasy a čo chcete riešiť, alebo prejdite štyri krátke kroky vo Výbere — vyberiem jeden konkrétny produkt aj s dôvodom.`;
  };

  const setText = (node, value) => { if (node && node.textContent !== value) node.textContent = value; };

  const patch = () => {
    root.querySelectorAll('.cx-message--assistant .cx-bubble').forEach((bubble) => {
      const text = bubble.textContent.trim();
      if (text === GREETING_SKIN) return setText(bubble, GREETING);
      if (!ENGINE_REPLY.test(text)) return;
      const asked = bubble.closest('.cx-message')?.previousElementSibling?.querySelector('.cx-bubble')?.textContent;
      setText(bubble, hairReply(asked));
    });
    root.querySelectorAll('.cx-chip').forEach((chip) => { const next = CHIPS[chip.textContent.trim()]; if (next) setText(chip, next); });
    root.querySelectorAll('.cx-product-tags span').forEach((tag) => { const next = LABELS[tag.textContent.trim()]; if (next) setText(tag, next); });
    root.querySelectorAll('.cx-offer small, .cx-advisor-entry em, .cx-routine-intro, .cx-why p').forEach((node) => {
      let value = node.textContent;
      for (const [from, to] of TEXTS) value = value.split(from).join(to);
      setText(node, value);
    });
  };

  root.querySelectorAll('a[href*="mojchatbot.sk/kontakt"]').forEach((link) => {
    const url = new URL(link.href);
    url.searchParams.set('source', `${SOURCE_PREFIX}${slug}`);
    link.href = url.toString();
  });
  document.querySelector('.cx-widget')?.setAttribute('aria-label', `Poradca vlasovej starostlivosti ${brand.name}`);

  patch();
  let queued = false;
  new MutationObserver(() => {
    if (queued) return;
    queued = true;
    queueMicrotask(() => { queued = false; patch(); });
  }).observe(root, { childList: true, subtree: true, characterData: true });
})();
