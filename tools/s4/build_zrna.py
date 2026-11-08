"""Séria 4 – ZRNA (prazirnazrna.cz, Shoptet; prevádzka Pražírna Kyjov s.r.o., fakturácia Vysněno s.r.o., IČO 09270850).
Zdroj: kategória Zrnková káva, z karty produktu parametre Pražení (na espresso / na filtrovanou kávu), Acidita (nízká / střední / vyšší –
slovná hodnota pražírne, zobrazuje sa slovom), Chuťový profil, Země původu, Zpracování, Odrůda, Stupeň pražení; ceny a sklad balení
250 g / 500 g / 1000 g (Luisa 150 g) zo Shoptet dát, gramáž podľa kódu varianty (napr. EDNK/250/FK).
python3 -I tools/s4/build_zrna.py DIR_S_products.json"""
import sys, os, re, json
sys.path.insert(0, os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 's3a'))
from common import sentences, photo, write_coffee
DIR = sys.argv[1]; CHECKED = '2026-11-07'; SLUG = 'zrna'; WEB = 'https://www.prazirnazrna.cz'
P = json.load(open(f'{DIR}/products.json'))
REG = {'Kolumbie': 'americas', 'Kostarika': 'americas', 'Papua Nová Guinea': 'asia', 'Bolívie': 'americas', 'Brazílie': 'americas', 'Keňa': 'africa', 'Nicaragua': 'americas'}
CO = {'Papua Nová Guinea': 'Papua-Nová Guinea', 'Nicaragua': 'Nikaragua'}
def nice(n):
    n = re.sub(r'\s*\|\s*zrnková káva\s*$', '', n.strip())
    w = [x.capitalize() if x.isupper() and len(x) >= 2 and x not in ('AB',) else x for x in n.split()]
    return ' '.join(w).replace(' - ', ' – ')
products = []
for p in P:
    pr = {k.strip().lstrip('? ').strip(): v.strip() for k, v in p['params'].items()}
    roast = pr.get('Pražení', '') + ' ' + pr.get('Způsob přípravy', '')
    preps = sorted({x for x, rx in (('espresso', r'espresso'), ('filter', r'filtr')) if re.search(rx, roast)})
    if not preps: print('VYRADENÉ (príprava neuvedená)', p['name']); continue
    by = {}
    for v in p['variants']:
        m = re.search(r'/(\d+)/', v.get('sku') or '')
        if not m or v.get('soldOut') or v['avail'] != 'Skladem': continue
        g = int(m.group(1))
        if g in by and by[g]['price'] != float(v['price']): print('POZOR: rôzna cena pre', g, p['name'])
        by.setdefault(g, {'grams': g, 'grind': 'zrnková', 'price': float(v['price']), 'url': p['url'], 'available': True, 'verifiedAt': CHECKED,
                          'source': f"Shoptet varianta {v.get('sku')} (prazirnazrna.cz, {CHECKED}): {g} g, {v['avail']}"})
    vs = sorted(by.values(), key=lambda v: v['grams'])
    if not vs: print('VYRADENÉ (žiadne dostupné balenie)', p['name']); continue
    tones = re.sub(r'\s*,\s*', ', ', pr.get('Chuťový profil', ''))
    notes = [n.strip() for n in tones.split(',') if n.strip() and n.strip() not in ('ovocná', 'medová')][:4]
    ac = pr.get('Acidita', '').lower()
    taste = {'nízká': 'choco', 'střední': 'fruitFull', 'vyšší': 'fresh'}.get(ac, 'fruitFull')
    co = pr.get('Země původu', '')
    profile = [{'name': 'Acidita', 'text': ac}] if ac else []
    if pr.get('Stupeň pražení'): profile.append({'name': 'Pražení', 'text': pr['Stupeň pražení'].lower()})
    if pr.get('Zpracování'): profile.append({'name': 'Zpracování', 'text': re.sub(r'\s*,\s*', ', ', pr['Zpracování'])})
    pid = p['url'].rstrip('/').split('/')[-1]
    products.append({'id': pid, 'kind': 'coffee', 'name': nice(p['name']), 'url': p['url'], 'photo': photo(SLUG, p['img'].replace('&amp;', '&'), pid), 'photoRemote': False,
        'currency': 'CZK', 'available': True, 'decaf': False, 'preps': preps, 'roastLabel': pr.get('Stupeň pražení', '').lower() or None, 'prepText': pr.get('Způsob přípravy'),
        'taste': taste, 'tastes': [taste], 'tasteSource': 'parametry e-shopu: acidita ' + (ac or 'neuvedena') + '; chuťový profil ' + (tones or 'neuveden'),
        'tasteProfile': profile, 'notes': notes, 'origin': CO.get(co, co), 'region': REG.get(co), 'process': re.sub(r'\s*,\s*', ', ', pr.get('Zpracování', '')) or None, 'variety': pr.get('Odrůda'),
        'summary': sentences(p['short'], 2), 'priceFrom': vs[0]['price'], 'priceTo': max(v['price'] for v in vs), 'weights': [v['grams'] for v in vs], 'variants': vs, 'checkedAt': CHECKED,
        'source': {'url': p['url'], 'verifiedAt': CHECKED, 'facts': 'parametry produktu (pražení, acidita, chuťový profil, země původu, zpracování, odrůda, stupeň pražení), krátký popis; ceny a sklad balení'}})
products = [p for p in products if p['photo']][:25]
ADD = {'v60': {'price': 140.0, 'note': 'Papírové filtry pro dripper V60-02 (bělené).', 'product': {'id': 'papirove-filtry-hario-v60-02-belene', 'name': 'Papírové filtry Hario V60-02 bělené',
       'url': WEB + '/zbozi/papirove-filtry-hario-v60-02-belene/', 'photo': '/assets/s3/zrna/filtry-v60-02.jpg'}}}  # cena a sklad overené 2026-11-07
DATA = {'slug': SLUG, 'price100': 'cents', 'lang': 'cs', 'checkedAt': CHECKED, 'beansOnly': True, 'altFallback': True, 'demo': {'heroProductId': products[0]['id']},
  'brand': {'name': 'ZRNA', 'legal': 'Vysněno s.r.o. (Pražírna Kyjov)', 'place': 'ZRNA · pražírna výběrové kávy v Kyjově', 'shopUrl': WEB + '/kategorie/zrnkova-kava/', 'web': WEB + '/',
            'logo': '/assets/s3/zrna/logo.png', 'hero': products[0]['photo'], 'contact': 'info@prazirnazrna.cz', 'contactSource': WEB + '/kontakty/',
            'theme': {'ink': '#1d1d1b', 'brand': '#1d1d1b', 'accent': '#a8794a', 'soft': '#f5f1eb', 'paper': '#ffffff'}},
  'tasteLabels': {'choco': ['Nízká acidita', 'Čokoláda, marcipán, oříšky'], 'fruitFull': ['Střední acidita', 'Ovoce s karamelem či čokoládou'],
                  'fresh': ['Vyšší acidita', 'Květy, citrus, červené ovoce'], 'decaf': ['Bez kofeinu', 'Káva i na večer']},
  'scope': f'{len(products)} zrnkových káv z e-shopu prazirnazrna.cz ({CHECKED}), ceny a sklad přesných balení.',
  'excluded': ['kávy, které nejsou skladem', 'příslušenství mimo filtry k V60'],
  'addons': ADD, 'shop': {'freeShipping': 'Doprava zdarma při objednávce nad 2 000 Kč.', 'shippingNote': '', 'freeShippingSource': WEB + '/doprava-a-platby/'},
  'chips': ['Káva na espresso', 'Káva na filtr', 'Porovnat 2 kávy', 'Káva s nízkou aciditou'], 'commercialNote': '', 'products': products, 'sets': [], 'held': []}
write_coffee(SLUG, DATA, 'ZRNA – séria 4 (447 € + 10 €/měs.): katalog z e-shopu prazirnazrna.cz (' + CHECKED + '). Vygenerováno: tools/s4/build_zrna.py.')
for p in products: print(p['name'], p['preps'], p['taste'], p['notes'], p['roastLabel'], [(v['grams'], v['price']) for v in p['variants']])
