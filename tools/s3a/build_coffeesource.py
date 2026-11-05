"""Séria 3 (Andreine) – Coffee Source (coffeesource.eu, Shopify products.json). Vlastné pole produktu: Zpracování, Acidita,
Chuťový profil, Doporučená příprava, Region; praženie podľa varianty (NA ESPRESSO / NA FILTR / OMNI); štítky Na espresso / Na filtr.
python3 -I tools/s3a/build_coffeesource.py PRODUCTS.json [PRODUCTS2.json…]"""
import sys, json, re, os, html as H
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import sentences, photo, write_coffee, process_label, taste_from_notes
CHECKED = '2026-11-05'; SLUG = 'coffeesource'; WEB = 'https://coffeesource.eu'
ps = [p for f in sys.argv[1:] for p in json.load(open(f))['products']]
COUNTRY = {'ethiopia': 'Etiopie', 'indonesia': 'Indonésie', 'colombia': 'Kolumbie', 'rwanda': 'Rwanda', 'kenya': 'Keňa', 'el': 'Salvador', 'brazil': 'Brazílie', 'guatemala': 'Guatemala', 'plachetnicová': 'Kolumbie'}
REG = {'Etiopie': 'africa', 'Rwanda': 'africa', 'Keňa': 'africa', 'Indonésie': 'asia', 'Kolumbie': 'americas', 'Salvador': 'americas', 'Brazílie': 'americas', 'Guatemala': 'americas'}
products, seen = [], set()
ACID = {'nízká': 'choco', 'střední': 'fruitFull', 'vysoká': 'fresh'}
for p in ps:
    if p['product_type'] != 'Káva' or p['id'] in seen: continue
    seen.add(p['id'])
    tags = p['tags'] if isinstance(p['tags'], list) else [t.strip() for t in p['tags'].split(',')]
    title = p['title']
    if 'kapsle' in tags or 'Degustační sady' in tags or 'Nekáva' in tags or 'Káva na cestě' in tags: print('MIMO', title); continue
    toks = [re.sub(r'\s+', ' ', H.unescape(x)).strip() for x in re.split(r'<[^>]+>', p['body_html'] or '')]
    toks = [x for x in toks if x and not re.search(r'DOPLNIT|ZADAT|colletions|vyřešit|BASIC INFORMATION', x)]
    # slovo rozdelené značkou (napr. „V“ + „ysoká“) spojiť
    j = []
    for x in toks:
        if j and re.fullmatch(r'[A-Za-zÁ-ž]', j[-1].split(':')[-1].strip()) and re.match(r'^[a-zá-ž]', x): j[-1] += x
        else: j.append(x)
    toks = j
    LABELS = r'(Region|Farma.*|Farmář.*|Nadmořská výška.*|Odrůda.*|Zpracování.*|Proces.*|Acidita|Chuťový profil.*|Chuť|Doporučená příprava|Stupeň pražení|Aroma|Stát|Okres|Sklizeň.*|Název šarže.*|Hodnocení.*)'
    def field(*keys):
        for i, x in enumerate(toks):
            for k in keys:
                m = re.match(r'^' + k + r'(\s*\([^)]*\))?\s*:?\s*(.*)$', x, re.I)
                if not m: continue
                v = m.group(2).strip(' :')
                if not v and i + 1 < len(toks) and not re.match(r'^' + LABELS + r'\s*:?\s*$', toks[i + 1], re.I): v = toks[i + 1].strip(' :')
                if v and not re.match(r'^' + LABELS + r'\s*:', v, re.I): return v
        return ''
    b = ' '.join(toks)
    acid = field('Acidita').lower().split()[0] if field('Acidita') else ''
    acid = acid if acid in ('vysoká', 'střední', 'nízká') else ''
    notes = [n.strip(' .').lower() for n in re.split(r',', field('Chuťový profil', 'CHUŤOVÝ PROFIL', 'Chuť(?!ový)')) if n.strip(' .')][:5]
    proc = field('Zpracování', 'Proces', 'Processing')
    blend = 'Směsi' in tags or 'blend' in title.lower() or 'směs' in title.lower()
    decaf = 'decaf' in tags or 'Bezkofeinová' in tags or 'decaf' in title.lower()
    roastOf = lambda t: 'espresso' if re.search(r'espresso', t, re.I) else 'filter' if re.search(r'filtr', t, re.I) else 'omni' if re.search(r'omni', t, re.I) else None
    vs = []
    for v in p['variants']:
        if not v['available']: continue
        g = re.search(r'(\d+)\s*g', v['title']); grams = int(g.group(1)) if g else None
        if not grams: continue
        vs.append({'grams': grams, 'grind': 'zrnková', 'roast': roastOf(v['title']), 'price': float(v['price']), 'url': f"{WEB}/products/{p['handle']}?variant={v['id']}",
                   'available': True, 'verifiedAt': CHECKED, 'source': 'Shopify products.json e-shopu coffeesource.eu (' + CHECKED + ')'})
    roasts = sorted({v['roast'] for v in vs if v['roast']})
    preps = [x for x, t in [('espresso', 'Na espresso'), ('filter', 'Na filtr')] if t in tags]
    if roasts:  # varianta praženia rozhoduje: prípravu ponúkneme iba, keď je jej praženie dostupné
        ok = {'espresso': {'espresso', 'omni'}, 'filter': {'filter', 'omni'}}
        preps = [x for x in (preps or ['espresso', 'filter']) if ok[x] & set(roasts)]
    if not vs or not preps: print('VYRADENÉ (bez dostupného balenia / prípravy)', title); continue
    if not notes: print('VYRADENÉ (e-shop neuvádza chuťový profil)', title); continue
    taste = ACID.get(acid) or taste_from_notes(notes)
    country = COUNTRY.get(title.split()[0].lower())
    img = (p['images'] or [{}])[0].get('src')
    noteText = field('Chuťový profil', 'CHUŤOVÝ PROFIL', 'Chuť(?!ový)')
    idx = next((i for i, x in enumerate(toks) if len(x) > 70 and x != noteText and not re.match(r'^' + LABELS, x, re.I)), None)
    desc = ''
    if idx is not None:
        k = idx
        while k > 0 and re.match(r'^[a-zá-ž]', toks[k]) and len(toks[k - 1]) < 40: k -= 1
        desc = sentences(' '.join(toks[k:idx + 1]), 2)
    products.append({'id': p['handle'], 'kind': 'coffee', 'name': title, 'url': f"{WEB}/products/{p['handle']}", 'photo': photo(SLUG, img, p['handle']) or img, 'photoRemote': False,
        'currency': 'CZK', 'available': True, 'decaf': decaf, 'preps': preps, 'roasts': roasts or None,
        'roastLabel': ', '.join({'espresso': 'na espresso', 'filter': 'na filtr', 'omni': 'omni'}[r] for r in roasts) if roasts else ('pražení na espresso' if preps == ['espresso'] else 'pražení na filtr' if preps == ['filter'] else ''),
        'prepText': field('Doporučená příprava', 'DOPORUČENÁ PŘÍPRAVA').split(',')[0][:60] or None,
        'taste': taste, 'tastes': [taste], 'tasteSource': ('acidita podle e-shopu: ' + acid) if acid else 'odvozeno z chuťového profilu e-shopu',
        'notes': notes, 'origin': ' · '.join(x for x in [country if not blend else 'směs', field('Region')] if x),
        'region': 'blend' if blend else REG.get(country), 'process': process_label(proc) if proc else None, 'variety': field('Odrůda') or None,
        'summary': desc[:320], 'priceFrom': min(v['price'] for v in vs), 'priceTo': max(v['price'] for v in vs), 'weights': sorted({v['grams'] for v in vs}), 'variants': vs, 'checkedAt': CHECKED,
        'source': {'url': f"{WEB}/products/{p['handle']}", 'verifiedAt': CHECKED, 'facts': 'Acidita, chuťový profil, zpracování, region, odrůda (popis produktu); praženie podľa varianty; príprava podľa štítkov e-shopu'}})
products = products[:25]
filt = next(p for p in ps if p['title'].startswith('Hario papírový filtr bílý pro V60'))
fv = next(v for v in filt['variants'] if 'V60 02' in v['title'] and v['available'])
ADD = {'v60': {'price': float(fv['price']), 'note': 'Papírové filtry pro dripper V60 02, 100 ks.',
       'product': {'id': 'hario-filtr-v60-02', 'name': 'Hario papírový filtr bílý pro V60 02 (100 ks)', 'url': f"{WEB}/products/{filt['handle']}?variant={fv['id']}",
                   'photo': photo(SLUG, (filt['images'] or [{}])[0].get('src'), 'hario-filtr-v60'), 'price': float(fv['price'])}}}
DATA = {'slug': SLUG, 'lang': 'cs', 'checkedAt': CHECKED, 'beansOnly': True, 'altFallback': True, 'demo': {'heroProductId': 'dark-star-blend'},
  'brand': {'name': 'Coffee Source', 'legal': 'Coffee Source s.r.o. (IČO 28417160)', 'place': 'Coffee Source · pražírna výběrové kávy, Praha', 'shopUrl': WEB + '/collections/kava', 'web': WEB + '/',
            'logo': '/assets/s3/coffeesource/logo.svg', 'hero': '', 'contact': 'info@coffeesource.eu', 'contactSource': WEB + '/pages/kontakt',
            'theme': {'ink': '#171717', 'brand': '#171717', 'accent': '#b8873b', 'soft': '#f3efe8', 'paper': '#ffffff'}},
  'tasteLabels': {'choco': ['Nízká kyselost', 'Čokoláda, ořechy – podle acidity pražírny'], 'fruitFull': ['Střední kyselost', 'Ovoce a sladkost'], 'fresh': ['Vysoká kyselost', 'Svěží, citrusová, květinová'], 'decaf': ['Bez kofeinu', 'Káva i na večer']},
  'scope': f'{len(products)} zrnkových káv vlastní pražírny z e-shopu coffeesource.eu ({CHECKED}), ceny a dostupnost přesných variant. Kapsle, degustační sady, kávovary a příslušenství nejsou ve výběru (kromě filtrů V60 jako doplňku).',
  'excluded': ['kapsle', 'degustační sady', 'kávovary, mlýnky, příslušenství a náhradní díly', 'kurzy', 'čokolády'],
  'addons': ADD, 'shop': {'freeShipping': '', 'shippingNote': '', 'freeShippingSource': WEB + '/'},
  'chips': ['Káva do automatu', 'Káva na filtr', 'Co je méně kyselé?', 'Máte kávu bez kofeinu?'], 'commercialNote': '', 'products': products, 'sets': [], 'held': []}
hero = next((p for p in products if p['id'] == 'dark-star-blend'), products[0]); DATA['brand']['hero'] = hero['photo']; DATA['demo']['heroProductId'] = hero['id']
write_coffee(SLUG, DATA, 'Coffee Source – séria 3 (447 € + 10 €/měs.): katalog z Shopify products.json e-shopu coffeesource.eu (' + CHECKED + '). Vygenerováno: tools/s3a/build_coffeesource.py.')
for p in products: print(p['name'], p['preps'], p['roasts'], p['taste'], p['tasteSource'], p['notes'][:3], [(v['grams'], v['roast'], v['price']) for v in p['variants']][:3], p['process'], p['region'])
