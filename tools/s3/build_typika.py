"""Séria 3 – TYPIKA (typika.coffee, Shopify products.json; popis produktu: CHUŤOVÝ PROFIL, ZPRACOVÁNÍ, REGION).
python3 -I tools/s3/build_typika.py PRODUCTS.json"""
import sys, json, re, os, html as H
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import sentences, photo, write_coffee, region_of, process_label, taste_from_notes
RAW = sys.argv[1]; CHECKED = '2026-11-05'; SLUG = 'typika'; WEB = 'https://typika.coffee'
ps = json.load(open(RAW))['products']
COUNTRY = {'colombia': 'Kolumbie', 'uganda': 'Uganda', 'tanzania': 'Tanzánie', 'kenya': 'Keňa', 'ethiopia': 'Etiopie', 'venezuela': 'Venezuela', 'myanmar': 'Myanmar', 'rwanda': 'Rwanda'}
REG = {'Venezuela': 'americas', 'Myanmar': 'asia', 'Tanzánie': 'africa'}
products = []
for p in ps:
    if p['product_type'] != 'Káva': continue
    b = re.sub(r'(\|\s*)+', '|', re.sub(r'\s+', ' ', H.unescape(re.sub('<[^>]+>', '|', p['body_html'] or ''))))
    f = lambda k: (re.search(k + r'\s*:?\|([^|]+)\|', b, re.I) or [None, ''])[1].strip()
    notes = [n.strip().lower() for n in f('Chuťový profil').split(',') if n.strip()]
    title = p['title']; espresso = bool(re.search(r'ESPRESSO', title)); filt = bool(re.search(r'FILTER', title))
    preps = ['espresso'] if espresso else ['filter'] if filt else []
    country = COUNTRY.get(title.split()[0].lower())
    blend = 'blend' in title.lower()
    if blend: preps, country = ['espresso'], None
    vs = [{'grams': int(re.search(r'(\d+)', v['title']).group(1)), 'grind': 'zrnková', 'price': int(float(v['price'])), 'url': f"{WEB}/products/{p['handle']}?variant={v['id']}",
           'available': True, 'verifiedAt': CHECKED, 'source': 'Shopify products.json e-shopu typika.coffee (' + CHECKED + ')'} for v in p['variants'] if v['available']]
    if not vs or not notes or not preps: print('VYRADENÉ', title); continue
    name = re.sub(r'\s*-\s*(FILTER|ESPRESSO) Roast\s*$', '', title).replace(' – ', ' – ')
    taste = taste_from_notes(notes)
    img = (p['images'] or [{}])[0].get('src')
    desc = b.split('|CHUŤOVÝ PROFIL', 1)[0].split('|Chuťový profil', 1)[0].strip('|')
    products.append({'id': p['handle'], 'kind': 'coffee', 'name': name, 'url': f"{WEB}/products/{p['handle']}", 'photo': photo(SLUG, img, p['handle']) or img, 'photoRemote': False,
        'currency': 'CZK', 'available': True, 'decaf': False, 'preps': preps, 'roastLabel': 'pražení na espresso' if preps == ['espresso'] else 'pražení na filtr',
        'prepText': 'Espresso Roast' if espresso or blend else 'Filter Roast', 'taste': taste, 'tastes': [taste], 'tasteSource': 'odvozeno z chuťového profilu e-shopu',
        'notes': notes, 'origin': ' · '.join(x for x in [country or 'Brazílie, Guatemala (blend)', f('REGION')] if x),
        'region': 'blend' if blend else REG.get(country) or region_of([country] if country else []),
        'process': process_label(f('ZPRACOVÁNÍ')) if not blend else 'Brazílie suché zpracování, Guatemala promyté (natural / washed)', 'variety': f('ODRŮDA') or None,
        'summary': sentences(desc, 2), 'priceFrom': min(v['price'] for v in vs), 'priceTo': max(v['price'] for v in vs), 'weights': [v['grams'] for v in vs], 'variants': vs, 'checkedAt': CHECKED,
        'source': {'url': f"{WEB}/products/{p['handle']}", 'verifiedAt': CHECKED, 'facts': 'Chuťový profil, zpracování, region, odrůda (popis produktu); pražení podle názvu (FILTER / ESPRESSO Roast)'}})
DATA = {'slug': SLUG, 'lang': 'cs', 'checkedAt': CHECKED, 'beansOnly': True, 'altFallback': True, 'demo': {'heroProductId': 'baseline-coffee'},
  'brand': {'name': 'TYPIKA', 'legal': 'TYPIKA', 'place': 'TYPIKA · výběrová káva Praha', 'shopUrl': 'https://typika.coffee/collections/all', 'web': 'https://typika.coffee/',
            'logo': '/assets/s3/typika/logo.png', 'hero': '/assets/s3/typika/baseline-coffee.jpg', 'contact': 'info@typika.coffee', 'contactSource': 'https://typika.coffee/pages/kontakt',
            'theme': {'ink': '#1a1a1a', 'brand': '#1a1a1a', 'accent': '#1a1a1a', 'soft': '#f3f0ea', 'paper': '#ffffff'}},
  'tasteLabels': {'choco': ['Čokoládová a oříšková', 'Podle chuťového profilu e-shopu'], 'fruitFull': ['Plná a ovocná', 'Třešně, sušené ovoce, víno'],
                  'fresh': ['Svěží a šťavnatá', 'Citrusy, rybíz, květy'], 'decaf': ['Bez kofeinu', 'Káva i na večer']},
  'scope': f'{len(products)} zrnkových káv z e-shopu typika.coffee ({CHECKED}), ceny přesných variant. Kávovary, láhve, čaje a předplatné nejsou ve výběru.',
  'excluded': ['kávovary a příslušenství', 'čaje, láhve, termosky, tašky, poukazy', 'předplatné Baseline'],
  'shop': {'freeShipping': '', 'shippingNote': '', 'freeShippingSource': WEB + '/'},
  'chips': ['Káva do automatu', 'Káva na filtr', 'Co je méně kyselé?', 'Máte něco ovocného?'], 'commercialNote': '', 'products': products, 'sets': [], 'held': []}
write_coffee(SLUG, DATA, 'TYPIKA – séria 3 (447 € + 10 €/měs.): katalog z Shopify products.json e-shopu typika.coffee (' + CHECKED + '). Vygenerováno: tools/s3/build_typika.py.')
for p in products: print(p['name'], p['preps'], p['taste'], p['notes'], [(v['grams'], v['price']) for v in p['variants']], p['process'], p['region'])
