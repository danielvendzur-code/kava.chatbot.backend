"""Séria 3 – MLSNACAVA (mlsnacava.sk, WooCommerce): ceny variantov zo Store API, údaje o káve z produktovej stránky
(Krajina pôvodu, Odroda, Spracovanie, Praženie, Chuťový profil). python3 -I tools/s3/build_mlsnacava.py RAWDIR"""
import sys, json, re, os, html as H
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import txt, sentences, photo, write_coffee, region_of, process_label, taste_from_notes
RAW = sys.argv[1]; CHECKED = '2026-11-05'; SLUG = 'mlsnacava'
ps = json.load(open(f'{RAW}/list.json')); var = json.load(open(f'{RAW}/variations.json'))
def flat(h):
    t = re.sub(r'<script.*?</script>|<style.*?</style>', '', h, flags=re.S); t = re.sub('<[^>]+>', '|', t)
    return re.sub(r'(\|\s*)+', '|', re.sub(r'\s+', ' ', H.unescape(t)))
COUNTRY = {'etiópia': 'Etiópia', 'rwanda': 'Rwanda', 'kolumbia': 'Kolumbia', 'colombia': 'Kolumbia', 'peru': 'Peru', 'brazília': 'Brazília', 'brazil': 'Brazília', 'guatemala': 'Guatemala', 'uganda': 'Uganda'}
REG = {'Etiópia': 'africa', 'Rwanda': 'africa', 'Uganda': 'africa', 'Kolumbia': 'americas', 'Peru': 'americas', 'Brazília': 'americas', 'Guatemala': 'americas'}
products = []
for p in ps:
    if '/en/' in p['permalink'] or 'set' in p['permalink']: continue
    t = flat(open(f"{RAW}/pages/{p['id']}.html").read())
    main = t.split('|Odporúčané produkty|')[0]
    f = lambda k: (re.search(r'\|' + k + r'\|([^|]+)\|', main) or [None, ''])[1].strip()
    cats = {c['name'] for c in p['categories']}
    notes = [n.strip().lower() for n in f('Chuťový profil').split(',') if n.strip()]
    vs = []
    for v in p['variations']:
        x = var.get(str(v['id']))
        if not x or not x['is_in_stock']: continue
        g = re.search(r'(\d+)', v['attributes'][0]['value']).group(1)
        vs.append({'grams': int(g), 'grind': 'zrnková', 'price': int(x['prices']['price']) / 100, 'url': x['permalink'], 'available': True, 'verifiedAt': CHECKED,
                   'source': 'WooCommerce Store API e-shopu mlsnacava.sk (' + CHECKED + ')'})
    vs.sort(key=lambda v: v['grams'])
    name = H.unescape(p['name'])
    decaf = 'Decaff' in cats or 'bezkofeín' in name.lower()
    preps = []
    if cats & {'Moderné espresso', 'Tradičné zmesi'}: preps.append('espresso')
    if 'Filtrovaná káva' in cats: preps.append('filter')
    if not vs or not notes or not preps: print('VYRADENÉ', name, len(vs), notes, preps); continue
    origin = f('Krajina pôvodu'); country = next((COUNTRY[w] for w in re.findall(r'\w+', origin.lower()) if w in COUNTRY), None)
    blend = not country or 'zmes' in name.lower() or 'Tradičné zmesi' in cats
    taste = taste_from_notes(notes)
    img = (p['images'] or [{}])[0].get('src')
    products.append({'id': p['permalink'].rstrip('/').split('/')[-1], 'kind': 'coffee', 'name': re.sub(r'\s*–\s*bezkofeínová káva', '', name), 'url': p['permalink'],
        'photo': photo(SLUG, img, str(p['id'])) or img, 'photoRemote': False, 'currency': 'EUR', 'available': True, 'decaf': decaf, 'preps': preps,
        'roastLabel': {'moderné espresso': 'moderné espresso praženie', 'tradičné espresso': 'tradičné espresso praženie', 'espresso': 'espresso praženie', 'filter': 'filtrové praženie', 'filtrovaná káva': 'filtrové praženie', 'omniroast': 'omni praženie (espresso aj filter)'}.get(f('Praženie').lower(), 'espresso praženie' if preps == ['espresso'] else 'filtrové praženie'),
        'prepText': ', '.join(sorted(cats & {'Moderné espresso', 'Tradičné zmesi', 'Filtrovaná káva'})), 'taste': taste, 'tastes': [taste],
        'tasteSource': 'odvodené z chuťového profilu e-shopu', 'notes': notes, 'origin': origin, 'region': 'blend' if blend else REG.get(country),
        'process': process_label(' / '.join(dict.fromkeys(x.strip() for x in f('Spracovanie').split('/')))), 'variety': f('Odroda') or None,
        'summary': sentences(txt(p['short_description'] or p['description']), 2) or ' '.join(x for x in [
            (f('Krajina pôvodu') + '.') if f('Krajina pôvodu') else '', ('Odroda ' + f('Odroda') + '.') if f('Odroda') else '',
            ('Spracovanie: ' + f('Spracovanie').lower() + '.') if f('Spracovanie') else '', ('Cupping skóre ' + f('Cupping skóre') + '.') if f('Cupping skóre') else ''] if x), 'priceFrom': vs[0]['price'], 'priceTo': vs[-1]['price'],
        'weights': [v['grams'] for v in vs], 'variants': vs, 'checkedAt': CHECKED,
        'source': {'url': p['permalink'], 'verifiedAt': CHECKED, 'facts': 'Krajina pôvodu, Odroda, Spracovanie, Praženie, Chuťový profil (produktová stránka); kategórie e-shopu'}})
    if decaf: products[-1]['decafNote'] = 'Bezkofeínová káva podľa pražiarne.'
DATA = {'slug': SLUG, 'lang': 'sk', 'checkedAt': CHECKED, 'beansOnly': True, 'altFallback': True, 'demo': {'heroProductId': products[0]['id']},
  'brand': {'name': 'MLSNACAVA', 'legal': 'STACOMB, s.r.o.', 'place': 'MLSNACAVA · pražiareň výberovej kávy, Banská Bystrica', 'shopUrl': 'https://mlsnacava.sk/obchod/',
            'web': 'https://mlsnacava.sk/', 'logo': '/assets/s3/mlsnacava/logo.png', 'hero': products[0]['photo'], 'contact': 'support@stacomb.sk', 'contactSource': 'https://mlsnacava.sk/kontakt/',
            'theme': {'ink': '#1b1b1b', 'brand': '#1b1b1b', 'accent': '#f26357', 'soft': '#f6f1ec', 'paper': '#ffffff'}},
  'tasteLabels': {'choco': ['Čokoládová a oriešková', 'Podľa chuťového profilu e-shopu'], 'fruitFull': ['Plná a ovocná', 'Bobule, sušené ovocie'],
                  'fresh': ['Svieža a šťavnatá', 'Citrusy, marhuľa, kvety'], 'decaf': ['Bez kofeínu', 'Káva aj na večer']},
  'scope': f'{len(products)} zrnkových káv z e-shopu mlsnacava.sk ({CHECKED}): balenia 250 g a 1000 g so stavom „na sklade“. Degustačná krabička a technológia nie sú vo výbere.',
  'excluded': ['degustačná krabička (balenie 1000 g bez overených variantov)', 'kávovary, mlynčeky a B2B ponuka'],
  'shop': {'freeShipping': '', 'shippingNote': '', 'freeShippingSource': 'https://mlsnacava.sk/'},
  'chips': ['Káva do automatu', 'Káva na filter', 'Máte kávu bez kofeínu?', 'Čo je menej kyslé?'], 'commercialNote': '', 'products': products, 'sets': [], 'held': []}
write_coffee(SLUG, DATA, 'MLSNACAVA – séria 3 (447 € + 10 €/mes.): katalóg z WooCommerce Store API a produktových stránok mlsnacava.sk (' + CHECKED + '). Vygenerované: tools/s3/build_mlsnacava.py.')
for p in products: print(p['name'], p['preps'], p['taste'], p['notes'], [(v['grams'], v['price']) for v in p['variants']], p['process'], p['region'], p['roastLabel'])
