"""Séria 3 (Andreine) – DOS MUNDOS (dos-mundos.cz, Shoptet). Zdroj: kategória /kava/ a produktové stránky:
varianty a ceny zo shoptet.variantsSplit.necessaryVariantData (iba „Skladem“, bez vratného obalu so zálohou),
chuťový profil a škály pražírne (ovocnost / sladkost / tělo z 5), príprava, krajina a spracovanie z popisu produktu.
python3 -I tools/s3a/build_dosmundos.py DIR_S_HTML"""
import sys, os, re, json, glob, html as H
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import sentences, photo, write_coffee, process_label
DIR = sys.argv[1]; CHECKED = '2026-11-05'; SLUG = 'dosmundos'; WEB = 'https://www.dos-mundos.cz'
REG = {'Etiopie': 'africa', 'Keňa': 'africa', 'Rwanda': 'africa', 'Burundi': 'africa', 'Uganda': 'africa', 'Tanzanie': 'africa', 'Kolumbie': 'americas', 'Brazílie': 'americas', 'Kostarika': 'americas',
       'Honduras': 'americas', 'Guatemala': 'americas', 'Peru': 'americas', 'Salvador': 'americas', 'El Salvador': 'americas', 'Nikaragua': 'americas', 'Mexiko': 'americas', 'Ekvádor': 'americas', 'Panama': 'americas',
       'Indie': 'asia', 'Indonésie': 'asia', 'Jemen': 'asia', 'Čína': 'asia', 'Vietnam': 'asia'}
txt = lambda h: re.sub(r'\s+', ' ', H.unescape(re.sub(r'<[^>]+>', ' ', h or ''))).strip()
products = []
for f in sorted(glob.glob(DIR + '/*.html')):
    if os.path.basename(f).startswith('l-'): continue
    h = open(f, encoding='utf-8', errors='replace').read()
    slug = os.path.basename(f)[:-5]
    params = {txt(k).rstrip(':').strip(): txt(v) for k, v in re.findall(r'<th[^>]*>(.*?)</th>\s*<td[^>]*>(.*?)</td>', h, re.S)}
    if params.get('Kategorie') != 'Káva': continue
    name = txt((re.search(r'<h1[^>]*>(.*?)</h1>', h, re.S) or [None, ''])[1])
    if re.search(r'drip|cascara|degusta|box|set\b|předplat|kapsl', name + slug, re.I): print('MIMO', name); continue
    dm = re.search(r'id="description"(.*?)(?:id="productDiscussion"|class="tab-pane fade" id=)', h, re.S)
    toks = [t for t in (re.sub(r'\s+', ' ', H.unescape(x)).strip() for x in re.split(r'<[^>]+>', dm.group(1) if dm else '')) if t and t not in ('“', '”', ',')]
    j = []
    for t in toks:
        if j and len(j[-1]) == 1 and j[-1].isalpha() and re.match(r'^[a-zá-ž]', t): j[-1] += t
        else: j.append(t)
    toks = j
    def after(label):
        for i, t in enumerate(toks):
            if re.match(r'^' + label + r'\s*:?$', t, re.I) and i + 1 < len(toks): return toks[i + 1].strip(' ,:')
            m = re.match(r'^' + label + r'\s*:\s*(.+)$', t, re.I)
            if m: return m.group(1).strip(' ,')
        return ''
    profile = after('Chuťový profil')
    notes = [n.strip(' .').lower() for n in profile.split(',') if n.strip(' .')][:4]
    scale = {k: int(v) for k, v in re.findall(r'(ovocnost|sladkost|tělo)\s*\|?\s*(\d)/5', ' | '.join(toks), re.I)}
    scale = {k.lower(): v for k, v in scale.items()}
    country = after('Země původu') or after('Země') or params.get('Země původu', '')
    proc = after('Způsob zpracování') or after('Zpracování')
    prep = (after('Příprava') + ' ' + params.get('Typ přípravy', '')).lower()
    preps = [x for x, rx in [('espresso', r'espresso|omni'), ('filter', r'filtr|omni')] if re.search(rx, prep)]
    try: vd = json.loads(re.search(r'necessaryVariantData = (\{.*?\});', h).group(1))
    except Exception: print('VYRADENÉ (bez variant)', name); continue
    labels = dict(re.findall(r'<option value="(\d+)" data-index="\d+">\s*([^<]+?)\s*<', h))
    vs = []
    for k, v in vd.items():
        lab = labels.get(k.split('-')[-1], '')
        if not lab or 'vratn' in lab or v.get('availabilityName') != 'Skladem' or not v.get('isNotSoldOut'): continue
        g = re.match(r'(\d+)\s*(g|kg)', lab)
        if not g: continue
        grams = int(g.group(1)) * (1000 if g.group(2) == 'kg' else 1)
        vs.append({'grams': grams, 'grind': 'zrnková', 'price': float(v['priceUnformatted']), 'url': f"{WEB}/{slug}/?variantId={v['id']}", 'available': True, 'verifiedAt': CHECKED,
                   'source': 'necessaryVariantData na stránke produktu dos-mundos.cz (' + CHECKED + '), dostupnosť „Skladem“'})
    if not vs: print('VYRADENÉ (nie skladom)', name); continue
    pm = re.search(r'Chuťová preference.{0,200}?</t[dh]>\s*<td[^>]*>(.*?)</td>', h, re.S) or re.search(r'Chuťová preference\s*</span>.{0,300}', h, re.S)
    pref = txt(pm.group(1) if pm and pm.lastindex else (pm.group(0) if pm else ''))
    tastes = [t for t, rx in [('choco', r'plnější'), ('fresh', r'Ovocnější')] if re.search(rx, pref)]
    if not tastes and 'ovocnost' in scale: tastes = ['fresh' if scale['ovocnost'] >= 4 else 'choco' if scale['ovocnost'] <= 2 else 'fresh' if scale['ovocnost'] >= scale.get('tělo', 0) else 'choco']
    if not notes or not tastes: print('VYRADENÉ (bez chuťového profilu alebo preferencie)', name, pref[:40]); continue
    if not preps: print('VYRADENÉ (bez prípravy)', name, prep); continue
    taste = tastes[0]
    blend = bool(re.search(r'směs|blend', name, re.I)) or ',' in country
    decaf = bool(re.search(r'decaf|bezkofein|bez kofein', name + ' ' + proc, re.I))
    img = (re.search(r'og:image" content="([^"]+)"', h) or [None, None])[1]
    quote = next((t for t in toks if len(t) > 80), '')
    products.append({'id': slug, 'kind': 'coffee', 'name': name, 'url': f'{WEB}/{slug}/', 'photo': photo(SLUG, H.unescape(img) if img else None, slug), 'photoRemote': False,
        'currency': 'CZK', 'available': True, 'decaf': decaf, 'preps': preps, 'roastLabel': after('Příprava') or params.get('Typ přípravy', ''), 'prepText': after('Příprava') or None,
        'taste': taste, 'tastes': tastes, 'tasteSource': 'chuťová preference e-shopu: ' + ', '.join({'choco': 'chuťově plnější', 'fresh': 'ovocnější'}[t] for t in tastes) + ('; škály pražírny ' + ', '.join(f'{k} {v}/5' for k, v in scale.items()) if scale else ''),
        'notes': notes, 'origin': ' · '.join(x for x in [country, after('Region / Zóna') or after('Region')] if x)[:90], 'region': 'blend' if blend else REG.get(country.split(',')[0].strip()),
        'process': process_label(proc) if proc else None, 'variety': after('Odrůda') or None, 'summary': sentences(quote.strip('“” '), 2),
        'priceFrom': min(v['price'] for v in vs), 'priceTo': max(v['price'] for v in vs), 'weights': sorted({v['grams'] for v in vs}), 'variants': vs, 'checkedAt': CHECKED,
        'source': {'url': f'{WEB}/{slug}/', 'verifiedAt': CHECKED, 'facts': 'chuťový profil, škály ovocnost/sladkost/tělo, příprava, země původu, zpracování (popis produktu); ceny a sklad variant (Shoptet)'}})
print(len(products), 'vhodných pred obmedzením')
# najviac 25: rovnomerne podľa chuti a prípravy (poradie e-shopu)
pick, by = [], {}
for p in products: by.setdefault((p['taste'], tuple(p['preps']), p['decaf']), []).append(p)
while len(pick) < 25 and any(by.values()):
    for k in list(by):
        if by[k] and len(pick) < 25: pick.append(by[k].pop(0))
products = [p for p in pick if p['photo']]
# doplnky podľa pomôcky (filtre z e-shopu, skladom)
def addon(fname, tool, label):
    f = os.path.join(DIR, fname + '.html')
    if not os.path.exists(f): return None
    h = open(f, encoding='utf-8', errors='replace').read()
    m = re.search(r'"priceUnformatted":(\d+(?:\.\d+)?)', h) or re.search(r'itemprop="price" content="([\d.]+)"', h)
    if not m or not re.search(r'Skladem', h): return None
    img = (re.search(r'og:image" content="([^"]+)"', h) or [None, None])[1]
    return {'price': float(m.group(1)), 'note': label, 'product': {'id': fname, 'name': txt(re.search(r'<h1[^>]*>(.*?)</h1>', h, re.S).group(1)), 'url': f'{WEB}/{fname}/', 'photo': photo(SLUG, H.unescape(img) if img else None, fname)}}
ADD = {k: v for k, v in {'v60': addon('filtry-hario-na-drip-v60-velikost-02--40ks--filters-for-v60-dripper-size-02--40-pcs', 'v60', 'Papírové filtry pro V60 velikost 02.'),
                         'aeropress': addon('filtry-aeropress-350-ks', 'aeropress', 'Náhradní papírové filtry pro AeroPress.')}.items() if v}
DATA = {'slug': SLUG, 'lang': 'cs', 'checkedAt': CHECKED, 'beansOnly': True, 'altFallback': True, 'demo': {'heroProductId': products[0]['id']},
  'brand': {'name': 'DOS MUNDOS', 'legal': 'DOS MUNDOS', 'place': 'DOS MUNDOS · pražírna výběrové kávy', 'shopUrl': WEB + '/kava/', 'web': WEB + '/',
            'logo': '/assets/s3/dosmundos/logo.png', 'hero': products[0]['photo'], 'contact': '', 'contactSource': WEB + '/kontakty/',
            'theme': {'ink': '#1b1b1b', 'brand': '#1b1b1b', 'accent': '#c8102e', 'soft': '#f5f1ec', 'paper': '#ffffff'}},
  'tasteLabels': {'choco': ['Chuťově plnější', 'Čokoláda, sladkost, tělo'], 'fruitFull': ['Vyvážená', ''], 'fresh': ['Ovocnější', 'Ovoce, svěžest, květy'], 'decaf': ['Bez kofeinu', 'Káva i na večer']},
  'scope': f'{len(products)} zrnkových káv z kategorie Káva e-shopu dos-mundos.cz ({CHECKED}), ceny a sklad přesných variant (bez vratného obalu).',
  'excluded': ['vratné obaly se zálohou', 'drip, cascara, degustační sady', 'kávovary, mlýnky, příslušenství (kromě filtrů jako doplňku)', 'kurzy'],
  'addons': ADD, 'shop': {'freeShipping': '', 'shippingNote': '', 'freeShippingSource': WEB + '/dopravaaplatba/'},
  'chips': ['Káva do automatu', 'Káva na filtr', 'Co je méně kyselé?', 'Něco výrazně ovocného'], 'commercialNote': '', 'products': products, 'sets': [], 'held': []}
write_coffee(SLUG, DATA, 'DOS MUNDOS – séria 3 (447 € + 10 €/měs.): katalog z e-shopu dos-mundos.cz (' + CHECKED + '). Vygenerováno: tools/s3a/build_dosmundos.py.')
for p in products: print(p['name'], p['preps'], p['taste'], p['tasteSource'], p['notes'][:3], [(v['grams'], v['price']) for v in p['variants']], p['process'], p['region'])
print('doplnky', {k: (v['product']['name'], v['price']) for k, v in ADD.items()})
