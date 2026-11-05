"""Séria 3 (Andreine) – Illimité (illimite.sk, WooCommerce Store API). Krátky popis produktu: tóny chuti, Spracovanie, Príprava, Oblasť, Odroda.
python3 -I tools/s3a/build_illimite.py RAWDIR (list.json + variations.json z woo_fetch.py)"""
import sys, json, re, os, html as H
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import sentences, photo, write_coffee, process_label, taste_from_notes
RAW = sys.argv[1]; CHECKED = '2026-11-05'; SLUG = 'illimite'; WEB = 'https://illimite.sk'
ps = json.load(open(f'{RAW}/list.json')); var = json.load(open(f'{RAW}/variations.json'))
COUNTRY = {'guatemala': ('Guatemala', 'americas'), 'colombia': ('Kolumbia', 'americas'), 'brasil': ('Brazília', 'americas')}
products = []
CH = r'čokol|karamel|orieš|orech|\bmed|javor|arašid|drievk|kakao|sirup|sladk'
FR = r'pomaranč|harman|rumanč|jazm|citr|limet|kvet|florál|malin|černic'
def taste_sk(notes):
    t = ' '.join(notes); c = len(re.findall(CH, t)); f = len(re.findall(FR, t))
    return 'fresh' if f > c else 'choco' if c > f else 'fruitFull'
for p in ps:
    toks = [t for t in (re.sub(r'\s+', ' ', H.unescape(x)).strip() for x in re.split(r'<[^>]+>', p['short_description'] or '')) if t]
    def after(label):
        for i, t in enumerate(toks):
            if re.match(r'^' + label + r'\s*:?$', t, re.I) and i + 1 < len(toks): return toks[i + 1].strip(' .:')
        return ''
    intro = toks[0] if toks else ''
    m = re.search(r'tóny (.+?)(?:\.|$)', intro + ' ' + ' '.join(toks[1:3])) or re.search(r'tvoria tóny (.+?)\.', ' '.join(toks))
    notes = [re.sub(r'^s ', '', n.strip(' .').lower()) for n in re.split(r',| a ', m.group(1)) if n.strip(' .')][:4] if m else []
    prep = after('Príprava').lower() + ' ' + ' '.join(toks).lower()
    preps = []
    if re.search(r'espresso|všetky metódy', prep): preps.append('espresso')
    if re.search(r'filter|batch|alternat|všetky metódy', prep): preps.append('filter')
    name = H.unescape(p['name'])
    vs = []
    for v in p['variations']:
        x = var.get(str(v['id']))
        if not x or not x.get('is_in_stock'): continue
        g = re.search(r'(\d+)\s*g', v['attributes'][0]['value'] if v['attributes'] else '')
        if not g: continue
        vs.append({'grams': int(g.group(1)), 'grind': 'zrnková', 'price': int(x['prices']['price']) / 100, 'url': x['permalink'], 'available': True, 'verifiedAt': CHECKED,
                   'source': 'WooCommerce Store API e-shopu illimite.sk (' + CHECKED + ')'})
    if not vs or not notes or not preps: print('VYRADENÉ', name, len(vs), notes, preps); continue
    blend = 'zmes' in name.lower()
    c = COUNTRY.get(name.split()[0].lower())
    proc = after('Spracovanie')
    products.append({'id': p['permalink'].rstrip('/').split('/')[-1], 'kind': 'coffee', 'name': name, 'url': p['permalink'],
        'photo': photo(SLUG, (p['images'] or [{}])[0].get('src'), p['permalink'].rstrip('/').split('/')[-1]), 'photoRemote': False,
        'currency': 'EUR', 'available': True, 'decaf': bool(re.search(r'decaf', name + proc, re.I)), 'preps': preps, 'roastLabel': after('Príprava'), 'prepText': after('Príprava') or None,
        'taste': taste_sk(notes), 'tastes': [taste_sk(notes)], 'tasteSource': 'odvodené z chuťových tónov v popise e-shopu',
        'notes': notes, 'origin': ' · '.join(x for x in ['zmes' if blend else (c[0] if c else ''), after('Oblasť')] if x), 'region': 'blend' if blend else (c[1] if c else None),
        'process': process_label(proc.split(',')[0]) if proc else None, 'variety': after('Odroda') or None, 'summary': sentences(intro, 2),
        'priceFrom': min(v['price'] for v in vs), 'priceTo': max(v['price'] for v in vs), 'weights': sorted({v['grams'] for v in vs}), 'variants': vs, 'checkedAt': CHECKED,
        'source': {'url': p['permalink'], 'verifiedAt': CHECKED, 'facts': 'tóny chuti, spracovanie, príprava, oblasť a odroda z popisu produktu'}})
DATA = {'slug': SLUG, 'lang': 'sk', 'checkedAt': CHECKED, 'beansOnly': True, 'altFallback': True, 'demo': {'heroProductId': products[-1]['id']},
  'brand': {'name': 'Illimité', 'legal': 'Illimité', 'place': 'Illimité · pražiareň výberovej kávy', 'shopUrl': WEB + '/obchod/', 'web': WEB + '/',
            'logo': '/assets/s3/illimite/logo.svg', 'hero': products[-1]['photo'], 'contact': '', 'contactSource': WEB + '/',
            'theme': {'ink': '#1b1b1b', 'brand': '#1b1b1b', 'accent': '#b07a4a', 'soft': '#f4efe8', 'paper': '#ffffff'}},
  'tasteLabels': {'choco': ['Čokoládová a sladká', 'Karamel, orechy, čokoláda'], 'fruitFull': ['Plná a ovocná', 'Slivky, černice, hrozienka'], 'fresh': ['Svieža a kvetinová', 'Pomaranč, harmanček, jazmín'], 'decaf': ['Bez kofeínu', 'Káva aj na večer']},
  'scope': f'{len(products)} zrnkových káv z e-shopu illimite.sk ({CHECKED}), ceny a sklad presných variantov.', 'excluded': [],
  'shop': {'freeShipping': '', 'shippingNote': '', 'freeShippingSource': WEB + '/'},
  'chips': ['Káva do automatu', 'Káva na filter', 'Čo je menej kyslé?', 'Máte kávu bez kofeínu?'], 'commercialNote': '', 'products': products, 'sets': [], 'held': []}
write_coffee(SLUG, DATA, 'Illimité – séria 3 (447 € + 10 €/mes.): katalóg z WooCommerce Store API e-shopu illimite.sk (' + CHECKED + '). Vygenerované: tools/s3a/build_illimite.py.')
for p in products: print(p['name'], p['preps'], p['taste'], p['notes'], [(v['grams'], v['price']) for v in p['variants']], p['process'], p['region'], p['decaf'])
