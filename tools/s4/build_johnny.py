"""Séria 4 – Johnny Coffee (johnnycoffee.cz, Shoptet; CONSO MED s.r.o., IČO 04543220, Moravský Krumlov).
Zdroj: kategórie Středně pražená / Tmavě pražená / Káva bez kofeinu / Espresso směsi / Espresso 100 % arabica, z karty produktu
parametre Doporučená příprava, Kyselost a Hořkost (slovné hodnoty pražírne – zobrazujú sa slovom), Chuťový profil, Stupeň pražení,
Země původu, Metoda zpracování, Obsah kofeinu; ceny a sklad balení (200 g – 1 kg) zo Shoptet dát.
Ochutnávkové a dárkové sety, dvojbalenia 200 g + 200 g, kávy bez parametrov chuti a nedostupné kávy sa nepreberajú.
python3 -I tools/s4/build_johnny.py DIR_S_products.json"""
import sys, os, re, json
sys.path.insert(0, os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 's3a'))
from common import sentences, photo, write_coffee
DIR = sys.argv[1]; CHECKED = '2026-11-07'; SLUG = 'johnnycoffee'; WEB = 'https://www.johnnycoffee.cz'
P = json.load(open(f'{DIR}/products.json'))
CO = {'Columbia': 'Kolumbie', 'Mexico': 'Mexiko', 'Afrika, Uganda': 'Uganda', 'Salvador, Afrika': 'El Salvador'}
REG = {'Etiopie': 'africa', 'Kolumbie': 'americas', 'Keňa': 'africa', 'Mexiko': 'americas', 'Dominikánská republika': 'americas', 'Brazílie': 'americas',
       'Guatemala': 'americas', 'Uganda': 'africa', 'El Salvador': 'americas', 'Venezuela': 'americas', 'Papua-Nová Guinea': 'asia', 'Peru': 'americas'}
TASTE = {'bez kyselosti': 'choco', 'téměř neznatelná': 'choco', 'jemná svěžest': 'fruitFull', 'příjemně živá': 'fresh'}
products, seen = [], set()
for p in P:
    if p['url'] in seen: continue
    seen.add(p['url'])
    pr = {k.strip(): v.strip() for k, v in p['params'].items()}
    if re.search(r'set|sada|kit', p['name'], re.I): print('MIMO (set)', p['name']); continue
    kys, hor, tones = pr.get('Kyselost', '').lower(), pr.get('Hořkost', '').lower(), pr.get('Chuťový profil', '')
    if not (kys and tones and pr.get('Doporučená příprava')): print('VYRADENÉ (chýbajú parametre chuti/prípravy)', p['name']); continue
    dp = pr['Doporučená příprava']
    preps = sorted({x for x, rx in (('espresso', r'(^|, )espresso|automatick|pákov'), ('filter', r'V60|Chemex|filtr')) if re.search(rx, dp)})
    vs = []
    for v in p['variants']:
        m = re.match(r'^(\d+)\s*g\b', (v['name'] or '').strip())
        if not m or '+' in v['name'] or v.get('soldOut') or v['avail'] != 'Skladem': continue
        vs.append({'grams': int(m.group(1)), 'grind': 'zrnková', 'price': float(v['price']), 'url': p['url'], 'available': True, 'verifiedAt': CHECKED,
                   'source': f"Shoptet varianta {v.get('sku')} (johnnycoffee.cz, {CHECKED}): {v['name']}, Skladem"})
    if not vs: print('VYRADENÉ (žiadne dostupné balenie)', p['name']); continue
    vs.sort(key=lambda v: v['grams'])
    co = pr.get('Země původu', '')
    co = CO.get(co, co)
    if not co and re.match(r'Papua', p['name']): co = 'Papua-Nová Guinea'
    blend = pr.get('Složení kávy', '').endswith('směs') or ',' in co
    base = re.split(r'\s+[–-]\s+', p['name'])[0].strip()
    base = re.sub(r'\s+káva$', '', base)
    if re.search(r'Limitované', pr.get('Kategorie', '')) and co and co not in base: base += ' – ' + co
    if base == 'Kolumbie' and 'tmavě' in p['name']: base = 'Kolumbie Tolima tmavě pražená'
    notes = [n.strip() for n in tones.split(',') if n.strip()][:4]
    profile = [{'name': 'Kyselost', 'text': kys}]
    if hor: profile.append({'name': 'Hořkost', 'text': hor})
    if pr.get('Stupeň pražení'): profile.append({'name': 'Pražení', 'text': pr['Stupeň pražení'].lower()})
    taste = TASTE.get(kys, 'fruitFull')
    pid = p['url'].rstrip('/').split('/')[-1]
    products.append({'id': pid, 'kind': 'coffee', 'name': base, 'url': p['url'], 'photo': photo(SLUG, p['img'].replace('&amp;', '&'), pid), 'photoRemote': False,
        'currency': 'CZK', 'available': True, 'decaf': 'bez kofeinu' in pr.get('Obsah kofeinu', ''), 'preps': preps, 'roastLabel': pr.get('Stupeň pražení', '').lower() or None, 'prepText': dp,
        'taste': taste, 'tastes': [taste], 'tasteSource': f'parametry e-shopu: kyselost {kys}, hořkost {hor or "neuvedena"}; chuťový profil {tones}',
        'tasteProfile': profile, 'notes': notes, 'origin': ('směs: ' + co if co else 'směs') if blend else co, 'region': 'blend' if blend else REG.get(co),
        'process': re.sub(r',\s*Papua New Guinea', '', pr.get('Metoda zpracování', '')) or None, 'variety': None, 'summary': sentences(p['short'], 2),
        'priceFrom': vs[0]['price'], 'priceTo': max(v['price'] for v in vs), 'weights': [v['grams'] for v in vs], 'variants': vs, 'checkedAt': CHECKED,
        'source': {'url': p['url'], 'verifiedAt': CHECKED, 'facts': 'parametry produktu (doporučená příprava, kyselost, hořkost, chuťový profil, stupeň pražení, země původu, zpracování, obsah kofeinu); ceny a sklad balení'}})
products = [p for p in products if p['photo']][:25]
DATA = {'slug': SLUG, 'lang': 'cs', 'checkedAt': CHECKED, 'beansOnly': True, 'altFallback': True, 'demo': {'heroProductId': products[0]['id']},
  'brand': {'name': 'Johnny Coffee', 'legal': 'CONSO MED s.r.o.', 'place': 'Johnny Coffee · pražírna v Moravském Krumlově', 'shopUrl': WEB + '/espresso-100--arabica/', 'web': WEB + '/',
            'logo': '/assets/s3/johnnycoffee/logo.png', 'hero': products[0]['photo'], 'contact': 'info@johnnycoffee.cz', 'contactSource': WEB + '/kontakt/',
            'theme': {'ink': '#231f20', 'brand': '#231f20', 'accent': '#c08a3e', 'soft': '#f6f1ea', 'paper': '#ffffff'}},
  'tasteLabels': {'choco': ['Bez kyselosti', 'Čokoláda, ořechy, kakao'], 'fruitFull': ['Jemná svěžest', 'Ovoce i ořechy, vyvážená'],
                  'fresh': ['Příjemně živá kyselost', 'Ryngle, citrusy, fondán'], 'decaf': ['Bez kofeinu', 'Káva i na večer']},
  'scope': f'{len(products)} zrnkových káv z e-shopu johnnycoffee.cz ({CHECKED}), ceny a sklad přesných balení.',
  'excluded': ['ochutnávkové a dárkové sety', 'dvojbalení 200 g + 200 g', 'kávy bez uvedené chuti a přípravy', 'nedostupné kávy', 'kávovary a příslušenství'],
  'addons': {}, 'shop': {'freeShipping': 'Doprava zdarma při nákupu nad 990 Kč.', 'shippingNote': '', 'freeShippingSource': WEB + '/doprava-zdarma-na-kavu/'},
  'chips': ['Káva bez kyselosti', 'Káva na filtr', 'Porovnat 2 kávy', 'Máte kávu bez kofeinu?'], 'commercialNote': '', 'products': products, 'sets': [], 'held': []}
write_coffee(SLUG, DATA, 'Johnny Coffee – séria 4 (447 € + 10 €/měs.): katalog z e-shopu johnnycoffee.cz (' + CHECKED + '). Vygenerováno: tools/s4/build_johnny.py.')
for p in products: print(p['name'], p['preps'], p['taste'], p['notes'], p['origin'], p['decaf'], [(v['grams'], v['price']) for v in p['variants']])
