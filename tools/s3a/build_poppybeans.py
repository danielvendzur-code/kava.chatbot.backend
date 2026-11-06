"""Séria 3 (Andreine) – Poppy Beans (poppybeans.cz, Shopify; Poppy Beans s.r.o., IČO 09074112, Brno).
Zdroj: products.json e-shopu (varianty, ceny, dostupnosť, štítky Espresso / Filter / Omniroast, spracovanie) a stránky produktov
(„Chuťový profil“, „Zpracování“, „Charakteristika“). Príprava = pražení uvedené vo variante (Espresso / Filter / Omniroast = obe).
Chuť podľa „Charakteristika“: čokoládová (bez ovocnej) → čokoládová; ovocná + čokoládová alebo sladká/krémová → vyvážená; ovocná/čajová/květinová → ovocná.
Darčekové sklenice 60 g, dip bagy, balíčky, predplatné a veľkoobchodné položky sa nepreberajú. Doplnky: filtre V60-02 a mikrofiltry AeroPress (e-shop).
python3 -I tools/s3a/build_poppybeans.py DIR"""
import sys, os, re, json, html as H
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import sentences, photo, write_coffee, process_label
DIR = sys.argv[1]; CHECKED = '2026-11-06'; SLUG = 'poppybeans'; WEB = 'https://www.poppybeans.cz'
REG = {'guatemala': ('Guatemala', 'americas'), 'ethiopia': ('Etiopie', 'africa'), 'rwanda': ('Rwanda', 'africa'), 'colombia': ('Kolumbie', 'americas'), 'kenya': ('Keňa', 'africa'),
       'costa': ('Kostarika', 'americas'), 'peru': ('Peru', 'americas'), 'indonesia': ('Indonésie', 'asia'), 'bolivia': ('Bolívie', 'americas'), 'brazil': ('Brazílie', 'americas')}
P = json.load(open(f'{DIR}/products.json'))['products']
def pipes(h):
    t = re.sub(r'<(script|style)[^>]*>.*?</\1>', '', h, flags=re.S); t = H.unescape(re.sub(r'<[^>]+>', ' | ', t))
    return re.sub(r'(\s*\|\s*)+', ' | ', re.sub(r'[ \t\r\n\xa0]+', ' ', t))
products = []
for p in P:
    tags = set(p['tags'])
    if not (p['product_type'] == 'Káva' or (p['product_type'] == '' and tags & {'Filter', 'Espresso'})): continue
    if re.search(r'předprodej', p['title'], re.I): print('MIMO (předprodej – zatím nedostupná)', p['handle']); continue
    if tags & {'wholesale-only', 'retail-only', 'Subscription', 'Voucher'} or re.search(r'balicek|dip-bag', p['handle']): print('MIMO', p['handle']); continue
    vs = []
    for v in p['variants']:
        m = re.match(r'(Espresso|Filter|Omniroast)\s+(\d+)\s*(g|kg)\b', v['title'].strip())
        if not v['available'] or not m or re.search(r'sklenič', v['title'], re.I): continue
        grams = int(m.group(2)) * (1000 if m.group(3) == 'kg' else 1)
        vs.append({'grams': grams, 'grind': 'zrnková', 'price': float(v['price']), 'url': f"{WEB}/products/{p['handle']}?variant={v['id']}", 'available': True, 'verifiedAt': CHECKED,
                   'roast': m.group(1), 'source': 'products.json e-shopu poppybeans.cz (' + CHECKED + '): ' + v['title'] + ', dostupné'})
    if not vs: print('VYRADENÉ (žiadne dostupné balenie zrnkovej kávy)', p['handle']); continue
    f = f"{DIR}/p-{p['handle']}.html"
    if not os.path.exists(f): print('VYRADENÉ (stránka produktu nestiahnutá)', p['handle']); continue
    t = pipes(open(f, encoding='utf-8', errors='replace').read())
    g = lambda k: (re.search(k + r': \| ([^|]+)', t) or [None, ''])[1].strip()
    prof, proc, char = g('Chuťový profil'), g('Zpracování'), g('Charakteristika')
    if char.endswith(':'): char = ''
    notes = [{'apple': 'jablko'}.get(n.strip().lower(), n.strip().lower()) for n in re.split(r',| a ', prof) if n.strip()][:4]
    c = char.lower()
    if not c: c = 'čokoládová' if re.search(r'kaka|čokol', prof.lower()) else ''
    taste = ('fruitFull' if 'ovocn' in c else 'choco') if 'čokol' in c else 'fresh' if re.search(r'ovocn|čajov|květin', c) else 'fruitFull' if re.search(r'sladk|krémov', c) else None
    roasts = {v['roast'] for v in vs}
    preps = sorted({'espresso'} if roasts == {'Espresso'} else {'filter'} if roasts == {'Filter'} else {'espresso', 'filter'})
    if not notes or not taste: print('VYRADENÉ (chuťový profil chýba)', p['handle']); continue
    vs.sort(key=lambda v: v['grams'])
    co = REG.get(p['handle'].split('-')[0]); blend = 'Blend' in tags
    lead = (re.search(r'Další informace \| ([^|]{40,})', t) or [None, ''])[1]
    products.append({'id': p['handle'], 'kind': 'coffee', 'name': p['title'], 'url': f"{WEB}/products/{p['handle']}", 'photo': photo(SLUG, (p['images'] or [{}])[0].get('src'), p['handle']), 'photoRemote': False,
        'currency': 'CZK', 'available': True, 'decaf': 'decaf' in p['handle'], 'preps': preps,
        'roastLabel': {'Espresso': 'espresso pražení', 'Filter': 'filtrové pražení', 'Omniroast': 'omniroast (espresso i filtr)'}[sorted(roasts)[0]] if len(roasts) == 1 else 'espresso i filtrové pražení',
        'prepText': None, 'taste': taste, 'tastes': [taste], 'tasteSource': 'charakteristika v e-shopu: ' + (char or 'neuvedena, podle chuťového profilu'),
        'notes': notes, 'origin': 'směs' if blend else (co[0] if co else ''), 'region': 'blend' if blend else (co[1] if co else None),
        'process': process_label(re.split(r' a |/', proc)[0].strip()) if proc and not blend else None, 'variety': g('Odrůda') or None, 'summary': sentences(lead, 2),
        'priceFrom': min(v['price'] for v in vs), 'priceTo': max(v['price'] for v in vs), 'weights': sorted({v['grams'] for v in vs}),
        'variants': [{k: v[k] for k in v if k != 'roast'} for v in vs], 'checkedAt': CHECKED,
        'source': {'url': f"{WEB}/products/{p['handle']}", 'verifiedAt': CHECKED, 'facts': 'chuťový profil, zpracování, charakteristika (stránka produktu); pražení, ceny a dostupnost variant (products.json)'}})
products = [p for p in products if p['photo']][:25]
def addon(handle, title_rx, note):
    p = next((x for x in P if x['handle'] == handle), None)
    if not p: return None
    v = next((v for v in p['variants'] if v['available'] and re.search(title_rx, v['title'])), None)
    if not v: return None
    return {'price': float(v['price']), 'note': note, 'product': {'id': handle, 'name': p['title'] + ('' if v['title'] == 'Default Title' else ' – ' + v['title']),
            'url': f"{WEB}/products/{handle}?variant={v['id']}", 'photo': photo(SLUG, (p['images'] or [{}])[0].get('src'), handle)}}
ADD = {k: v for k, v in {'v60': addon('cafec-abaca-v60-02-100-ks', r'4 Cups', 'Papírové filtry pro dripper V60-02.'),
                         'aeropress': addon('mikrofiltry-na-aeropress-350-ks', r'.', 'Náhradní papírové filtry pro AeroPress.')}.items() if v}
DATA = {'slug': SLUG, 'lang': 'cs', 'checkedAt': CHECKED, 'beansOnly': True, 'altFallback': True, 'demo': {'heroProductId': products[0]['id']},
  'brand': {'name': 'Poppy Beans', 'legal': 'Poppy Beans s.r.o.', 'place': 'Poppy Beans · pražírna a kavárny, Brno', 'shopUrl': WEB + '/collections/all', 'web': WEB + '/',
            'logo': '/assets/s3/poppybeans/logo.png', 'hero': products[0]['photo'], 'contact': '', 'contactSource': WEB + '/',
            'theme': {'ink': '#2a1a20', 'brand': '#2a1a20', 'accent': '#7a2442', 'soft': '#f7eff2', 'paper': '#ffffff'}},
  'tasteLabels': {'choco': ['Čokoládová a sladká', 'Čokoláda, karamel, nugát'], 'fruitFull': ['Ovocná i čokoládová', 'Sladká, vyvážená'], 'fresh': ['Ovocná, čajová, květinová', 'Svěží ovoce, čaj, květy'], 'decaf': ['Bez kofeinu', 'Káva i na večer']},
  'scope': f'{len(products)} zrnkových káv z e-shopu poppybeans.cz ({CHECKED}), ceny a dostupnost přesných variant.',
  'excluded': ['dárkové skleničky 60 g, dip bagy a balíčky', 'předplatné, poukazy a velkoobchodní kávy', 'vyprodané kávy a balení'],
  'addons': ADD, 'shop': {'freeShipping': '', 'shippingNote': '', 'freeShippingSource': WEB + '/'},
  'chips': ['Káva do automatu', 'Káva na filtr', 'Něco čokoládového', 'Máte kávu bez kofeinu?'], 'commercialNote': '', 'products': products, 'sets': [], 'held': []}
write_coffee(SLUG, DATA, 'Poppy Beans – séria 3 (447 € + 10 €/měs.): katalog z e-shopu poppybeans.cz (' + CHECKED + '). Vygenerováno: tools/s3a/build_poppybeans.py.')
for p in products: print(p['name'], p['preps'], p['taste'], p['notes'], [(v['grams'], v['price']) for v in p['variants']], p['process'], p['decaf'])
print('doplnky', {k: (v['product']['name'], v['price']) for k, v in ADD.items()})
