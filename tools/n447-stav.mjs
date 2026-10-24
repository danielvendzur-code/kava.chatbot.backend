/* n447 – register stavu novej dávky (n447/stav.json + n447/stav.md). Fakty berie z dátových súborov a gitu;
   stavy, testy a otvorené body sú v STATUS nižšie. Interné podklady (vylúčené z nasadenia cez .vercelignore).
   node tools/n447-stav.mjs --preview=<url> --previewSha=<sha> --qa=<path k qa-<sha> priečinku> */
import fs from 'node:fs';
import {execSync} from 'node:child_process';
import {createRequire} from 'node:module';
const require = createRequire(import.meta.url);
const arg = (k) => (process.argv.find((a) => a.startsWith('--' + k + '=')) || '').split('=').slice(1).join('=');
const git = (c) => execSync('git ' + c, {encoding: 'utf8'}).trim();
const lastCommit = (paths) => git(`log -1 --format=%h -- ${paths.join(' ')}`) || null;
const head = git('rev-parse --short HEAD');
const today = new Date().toISOString().slice(0, 10);

const STATUS = {
  black: {name: 'BLACK. (pražiareň black.)', country: 'SK', family: 'coffee', state: 'BLOCKED_PRICES',
    reason: 'E-shop ukazuje pri káve iba rozsah ceny; cenu konkrétneho balenia načíta až interakciou. Overené iba doce citrus (Codex). Priame POST požiadavky blokuje WAF (Access Denied), Playwright dostal 429 – požiadavky zastavené, neobchádzané.',
    open: ['ceny balení 14 z 15 káv neoverené → otázka rozpočtu sa neponúka', 'deduplikácia pošty neoverená (bez prístupu k webmailu)']},
  verticcio: {name: 'Verticcio', country: 'SK', family: 'coffee', state: 'READY_FOR_REVIEW', open: ['kontakt marketing@verticcio.sk zo zadania – kontaktná stránka za WAF (466), znovu neoverovaný']},
  rebelbean: {name: 'Rebelbean', country: 'CZ', family: 'coffee', state: 'READY_FOR_REVIEW', open: []},
  nordbeans: {name: 'Nordbeans', country: 'CZ', family: 'coffee', state: 'READY_FOR_REVIEW_PARTIAL',
    reason: 'Z 5 pôvodne blokovaných stránok 3 doplnené pri pomalom opakovaní 24. 10. (18 káv); cocondo-natural_z10 (connection reset) a vara-blanca-honey_z3964 (403) nie sú vo výbere, ďalšie pokusy sa nerobia.', open: ['2 kávy nezahrnuté (Cocondo Natural, Vara Blanca Honey)', 'chat s AI: zdieľaný ai-chat.js maže „_“ z odkazov, odkazy Nordbeans (…_z123/) preto vždy padnú na overenú odpoveď z katalógu']},
  doubleshot: {name: 'doubleshot', country: 'CZ', family: 'coffee', state: 'READY_FOR_REVIEW', open: ['Farm • Bule Hora vyradená (rozpor gramáže 300 g vs 350 g)']},
  fathers: {name: "Father's Coffee Roastery", country: 'CZ', family: 'coffee', state: 'READY_FOR_REVIEW',
    open: ['ceny 1 kg / 2 kg z dát e-shopu (s DPH pre ČR, zaokrúhlené nahor podľa zobrazených 250 g cien); priamo zobrazená je iba cena 250 g', 'Zebigi a Inzá (espresso) vyradené – kategória Espresso, popis uvádza filter']},
  candycane: {name: 'Candycane coffee', country: 'CZ', family: 'coffee', state: 'READY_FOR_REVIEW', open: ['overená je iba cena predvoleného balenia; ceny 1 kg / 2,5 kg stránka bez práce s košíkom neukazuje']},
  '9gramscoffee': {name: '9 Grams Coffee (e-shop coffeeart.me)', country: 'SK', family: 'coffee', state: 'READY_FOR_REVIEW',
    open: ['jedna obchodná ukážka pre prevádzkovateľa 9 Grams Coffee s.r.o. (CoffeeArt/Costadoro sa neoslovujú zvlášť)', 'e-shop dočasne vrátil 403, stiahnuté po pauze; obrázky z CDN tiež po pauze']},
  renovality: {name: 'Renovality', country: 'CZ', family: 'cosmetics', state: 'READY_FOR_REVIEW', open: ['Shoptet vrátil 403 po 8 požiadavkách; stiahnuté jedným pomalým opakovaním po pauze', 'doprava v ukážke neoverená (stránka dopravy nenájdená) – chat odkáže na e-shop', 'kontakt info@renovality.cz zo zadania']},
  saloos: {name: 'Saloos', country: 'CZ', family: 'cosmetics', state: 'READY_FOR_REVIEW', open: ['overená je cena predvoleného balenia z výpisu; iné veľkosti sa načítajú až po výbere', 'prehliadačová kontrola kozmetiky: tools/n447_cx_browser_check.py']},
  nobilistilia: {name: 'Nobilis Tilia', country: 'CZ', family: 'cosmetics', state: 'READY_FOR_REVIEW', open: ['ceny viacvariantných produktov z vlastných stránok variantov (vzorky 2 ml vynechané, cena „od“ sa nepoužíva)', 'doprava v ukážke neoverená – chat odkáže na e-shop', 'kontakt nobilis@nobilis.cz zo zadania']},
  manufaktura: {name: 'Manufaktura', country: 'CZ', family: 'cosmetics', state: 'READY_FOR_REVIEW', open: ['ohraničený rozsah: iba pleťová rutina a okolie očí (telo, vlasy, vône, líčenie a sady mimo)', 'obrázkový server data.manufaktura.cz raz vrátil 403; logo a fotky overené po pauze', 'chat s AI: zdieľaný ai-chat.js maže „_“ z odkazov (…_z123/), preto chat vždy použije overenú odpoveď katalógu', 'e-shop má vlastný chat – ukážka ho dopĺňa, nenahrádza', 'kontakt info@manufaktura.cz zo zadania']}
};
const qaDir = arg('qa');
const companies = Object.entries(STATUS).map(([slug, s]) => {
  const c = {slug, ...s, page: fs.existsSync(`${slug}.html`) ? `/${slug}.html` : null, customerLink: `https://${slug}.mojchatbot.sk/ (až po schválení produkcie; dnes neexistuje)`};
  if (s.family === 'coffee' && fs.existsSync(`n447/data/${slug}.js`)) {
    const d = require(`../n447/data/${slug}.js`);
    const v = d.products.flatMap((p) => p.variants || []).filter((x) => x.verifiedAt);
    Object.assign(c, {lang: d.lang, currency: d.products[0].currency, shop: d.brand.shopUrl, contact: d.brand.contact, contactSource: d.brand.contactSource,
      checkedAt: d.checkedAt, scope: d.scope || null, products: d.products.length, drip: !!d.drip,
      verifiedPacks: v.length, productsWithVerifiedPack: d.products.filter((p) => (p.variants || []).some((x) => x.verifiedAt)).length,
      excluded: d.excluded || [], commit: lastCommit([`n447/data/${slug}.js`, `${slug}.html`, `assets/${slug}`])});
  }
  if (s.family === 'cosmetics' && fs.existsSync(`n447/kozmetika/catalogues/${slug}.js`)) {
    globalThis.window = globalThis; globalThis.COSMETICS_DEMOS = {brands: {}};
    require(`../n447/kozmetika/catalogues/${slug}.js`); require(`../n447/kozmetika/brands/${slug}.js`);
    const cat = globalThis.CX_CATALOGUES[slug], b = globalThis.COSMETICS_DEMOS.brands[slug];
    Object.assign(c, {lang: /\.cz$/.test(b.domain) ? 'cs' : 'sk', currency: cat.products[0].currency, shop: b.shopUrl || b.website, contact: b.contact, contactSource: b.contactSource,
      checkedAt: cat.verifiedAt.slice(0, 10), products: cat.products.length, categories: [...new Set(cat.products.map((p) => p.category))],
      verifiedPacks: cat.products.length, excluded: cat.excluded || [], commit: lastCommit([`n447/kozmetika/catalogues/${slug}.js`, `n447/kozmetika/brands/${slug}.js`, `${slug}.html`])});
  }
  if (qaDir && fs.existsSync(`${qaDir}/${slug}/browser-report.json`)) {
    const r = JSON.parse(fs.readFileSync(`${qaDir}/${slug}/browser-report.json`, 'utf8'));
    c.browserCheck = {sizes: Object.keys(r.sizes), testedPaths: r.testedPaths, allPaths: r.allPaths, issues: Object.values(r.sizes).reduce((n, v) => n + v.issues.length, 0),
      firstIssues: Object.values(r.sizes).flatMap((v) => v.issues).slice(0, 3), console: r.console.length, storage: r.storage};
  } else if (arg('cxqa') && fs.existsSync(`${arg('cxqa')}/${slug}/cx-browser-report.json`)) {
    const r = JSON.parse(fs.readFileSync(`${arg('cxqa')}/${slug}/cx-browser-report.json`, 'utf8'));
    const v = Object.values(r.sizes);
    c.browserCheck = {sizes: Object.keys(r.sizes), testedPaths: v.reduce((n, x) => n + x.walks, 0), allPaths: 'priechody s rôznymi odpoveďami', budgetChecks: v.reduce((n, x) => n + x.budgetChecks, 0),
      issues: v.reduce((n, x) => n + x.issues.length, 0), firstIssues: v.flatMap((x) => x.issues).slice(0, 3), console: r.console.length};
  } else if (c.page) c.browserCheck = {state: 'NOT_FINISHED', note: 'beh prehliadačovej kontroly neskončil alebo bol ukončený časovým limitom'};
  return c;
});
const engineCommit = lastCommit(['n447/engine.js', 'n447/reply.js', 'n447/coffee-jolka-app-n447.js', 'n447/kozmetika/cosmetics-n447.js', 'api/chat-447.js', 'api/cosmetics-chat-447.js']);
const out = {batch: 'nove-ukazky-447-2026-10-22', engineCommit, price: {setupEUR: 447, monthlyEUR: 10, freeTrial: false}, updatedAt: today, headCommit: head,
  branch: 'claude/n447-black-20261022',
  preview: {url: arg('preview') || null, sha: arg('previewSha') || null, note: 'Interný Preview (Vercel, vetva). Zelený build nie je overená produkcia; produkcia ani zákaznícke subdomény nie sú nasadené.'},
  rules: {
    budget: 'Rozpočet platí pre celý nákup vrátane doplnku. Otázka rozpočtu sa ponúkne iba vtedy, keď má každá vhodná káva overené balenie; hranica sa porovnáva s cenou konkrétneho balenia. Cena „od“ je iba informatívna a rozpočet nikdy nesplní; doplnok sa pridá len keď sa celok zmestí.',
    choices: 'Pri viac než 4 rovnocenných kávach sa jadro pýta na overený rozdiel (spracovanie, pôvod, zloženie, stupeň praženia). Ak už rozdiel neexistuje, výber je stránkovaný v poradí e-shopu („Ďalšie vhodné kávy“); cena ani iné skryté poradie nerozhoduje (oprava regresie d032700 v d853d08).',
    ui: 'Schválené UI Grain/Don Franko (izolovaná kópia coffee-jolka-app-current.js) a pri kozmetike schválený stack cosmetics.html (izolovaná kópia cosmetics.js a advisor-boot.js).',
    tests: 'Node: tools/n447-test.mjs (všetky cesty, rozpočtové hranice, dosiahnuteľnosť každej kávy, regresie Codexu, jazyk CS, chat offline, API mock 0 platených volaní); kozmetika tools/n447-cx-test.mjs; prehliadač tools/n447_browser_check.py (pokrývajúca sada ciest na 320×568, 390×650, 560×600, 1280×800).'},
  companies};
fs.writeFileSync('n447/stav.json', JSON.stringify(out, null, 2) + '\n');
const row = (c) => `| ${c.name} | ${c.state} | ${c.page || '–'} | ${c.products ?? '–'}${c.verifiedPacks != null ? ` / ${c.verifiedPacks} overených balení` : ''} | ${c.browserCheck ? (c.browserCheck.state || (typeof c.browserCheck.allPaths === 'number' ? `${c.browserCheck.testedPaths}/${c.browserCheck.allPaths} ciest (pokrytie), 4 rozmery, nálezy ${c.browserCheck.issues}` : `${c.browserCheck.testedPaths} priechodov, 4 rozmery, kontroly rozpočtu ${c.browserCheck.budgetChecks}, nálezy ${c.browserCheck.issues}`)) : '–'} | ${c.commit || '–'} | ${[c.reason, ...(c.open || [])].filter(Boolean).join('; ') || '–'} |`;
fs.writeFileSync('n447/stav.md', `# Nové ukážky 447 € + 10 €/mes. bez trialu – stav (${today})

Vetva \`${out.branch}\`, HEAD \`${head}\`, spoločné jadro a API naposledy zmenené v \`${engineCommit}\` (stĺpec Commit = posledná zmena vlastných súborov firmy). Interný Preview: ${out.preview.url || '–'} (commit ${out.preview.sha || '–'}). ${out.preview.note}

| Firma | Stav | Stránka (Preview) | Produkty / overené balenia | Prehliadač | Commit | Poznámky |
|---|---|---|---|---|---|---|
${companies.map(row).join('\n')}

Pravidlá: ${out.rules.budget} ${out.rules.choices}

Testy: ${out.rules.tests}

E-maily: iba koncepty \`n447/email-<slug>.md\` (DRAFT), neodoslané a nenaplánované. Zákazník dostane výhradne vlastnú subdoménu mojchatbot.sk až po schválení produkcie.
`);
console.log('ok', companies.map((c) => c.slug + ':' + c.state + ':' + (c.commit || '-')).join(' '));
