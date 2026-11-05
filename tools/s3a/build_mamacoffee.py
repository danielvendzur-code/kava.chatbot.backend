"""Séria 3 (Andreine) – mamacoffee (mamacoffee.cz, Shoptet). Zdroj: kategória /kava/ a produktové stránky:
„Doporučená příprava“ (espresso / alternativní příprava), „Detailní informace“ (chuť, kyselost, tělo, země, zpracování),
varianty zrnkové kávy a ceny zo shoptet necessaryVariantData (iba „Skladem“). Drip sáčky a degustační sady sa nepreberajú.
python3 -I tools/s3a/build_mamacoffee.py DIR_S_HTML"""
import sys, os, re, json, glob, html as H
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import sentences, photo, write_coffee, process_label
DIR = sys.argv[1]; CHECKED = '2026-11-05'; SLUG = 'mamacoffee'; WEB = 'https://www.mamacoffee.cz'
REG = {'Brazílie': 'americas', 'Peru': 'americas', 'Nikaragua': 'americas', 'Kolumbie': 'americas', 'Uganda': 'africa', 'Etiopie': 'africa', 'Keňa': 'africa', 'Rwanda': 'africa'}
COUNTRY = {'brasil': 'Brazílie', 'peru': 'Peru', 'nicaragua': 'Nikaragua', 'colombia': 'Kolumbie', 'uganda': 'Uganda'}
txt = lambda h: re.sub(r'\s+', ' ', H.unescape(re.sub(r'<[^>]+>', ' ', h or ''))).strip()
products = []
for f in sorted(glob.glob(DIR + '/*.html')):
    slug = os.path.basename(f)[:-5]
    h = open(f, encoding='utf-8', errors='replace').read()
    if '<a href="/kava/">Káva</a>' not in h: continue
    name = txt((re.search(r'<h1[^>]*>(.*?)</h1>', h, re.S) or [None, ''])[1])
    if re.search(r'drip|degusta|set\b', name + slug, re.I): print('MIMO', name); continue
    desc = (re.search(r'id="description"(.*?)id="productsRelat', h, re.S) or re.search(r'id="description"(.*?)Hodnocení produktu', h, re.S) or [None, ''])[1]
    facts = {}
    for li in re.findall(r'<li[^>]*>(.*?)</li>', desc, re.S):
        m = re.match(r'([^:]{2,30}):\s*(.+)$', txt(li))
        if m: facts.setdefault(m.group(1).strip(), m.group(2).strip(' .'))
    prep = (re.search(r'Doporučená příprava (.*?)(?: O kávě | Detailní informace |$)', txt(desc)) or [None, ''])[1].strip()
    preps = [x for x, rx in [('espresso', r'espresso|moka'), ('filter', r'alternativ|V60|AeroPress|filtr|Dalším způsobům')] if re.search(rx, prep, re.I)]
    acid = facts.get('Kyselost', '').lower()
    taste = 'fresh' if re.search(r'živá|ovocn|vysok', acid) else 'choco' if re.search(r'nízk|sladk', acid) else None
    notes = [n.strip(' .').lower() for n in re.split(r',| a (?=[a-zá-ž])', re.sub(r'^intenzivní a komplexní chuť ', '', facts.get('Chuť', ''))) if n.strip(' .')][:4]
    FIX = {'rumu': 'rum', 'nugátu': 'nugát', 'fermentované hrušky': 'fermentovaná hruška', 'tóny badyánu': 'badyán', 'červených jablek': 'červená jablka'}
    notes = [FIX.get(n, n) for n in notes]
    if not taste or not notes or not preps: print('VYRADENÉ (chuť, kyselost alebo príprava chýba)', name, acid, preps); continue
    try: vd = json.loads(re.search(r'necessaryVariantData = (\{.*?\});', h).group(1))
    except Exception: print('VYRADENÉ (bez variant)', name); continue
    labels = dict(re.findall(r'<option value="(\d+)" data-index="\d+">\s*([^<]+?)\s*<', h))
    vs = []
    for k, v in vd.items():
        labs = [labels.get(x, '') for x in k.split('-')]
        if 'Zrno' not in labs or v.get('availabilityName') != 'Skladem' or not v.get('isNotSoldOut'): continue
        g = next((re.match(r'(\d+)\s*(g|kg)$', l) for l in labs if re.match(r'(\d+)\s*(g|kg)$', l)), None)
        if not g: continue
        vs.append({'grams': int(g.group(1)) * (1000 if g.group(2) == 'kg' else 1), 'grind': 'zrnková', 'price': float(v['priceUnformatted']), 'url': f"{WEB}/{slug}/?variantId={v['id']}", 'available': True,
                   'verifiedAt': CHECKED, 'source': 'necessaryVariantData na stránke produktu mamacoffee.cz (' + CHECKED + '), mletí „Zrno“, dostupnosť „Skladem“'})
    if not vs: print('VYRADENÉ (nie skladom)', name); continue
    vs.sort(key=lambda v: v['grams'])
    country = facts.get('Země původu') or COUNTRY.get(slug.split('-')[0]) or COUNTRY.get(slug.split('-')[1] if '-' in slug else '', '')
    blend = bool(re.search(r'směs', name, re.I)) or ' a ' in country
    decaf = bool(re.search(r'bez kofeinu|decaf', name, re.I))
    proc = facts.get('Způsob zpracování') or facts.get('Zpracování') or ''
    img = (re.search(r'og:image" content="([^"]+)"', h) or [None, None])[1]
    about = (re.search(r' O kávě (.*?)(?: Detailní informace |$)', txt(desc)) or [None, ''])[1]
    products.append({'id': slug, 'kind': 'coffee', 'name': name, 'url': f'{WEB}/{slug}/', 'photo': photo(SLUG, H.unescape(img) if img else None, slug), 'photoRemote': False,
        'currency': 'CZK', 'available': True, 'decaf': decaf, 'preps': preps, 'roastLabel': facts.get('Stupeň pražení', ''), 'prepText': prep.rstrip(' .') or None,
        'taste': taste, 'tastes': [taste], 'tasteSource': 'kyselost uvedená v e-shopu: ' + acid,
        'notes': notes, 'origin': ' · '.join(x for x in [country, facts.get('Region', '')] if x)[:90], 'region': 'blend' if blend else REG.get(country),
        'process': process_label(proc.split('/')[0].strip()) if proc else None, 'variety': facts.get('Odrůda') or None, 'body': facts.get('Tělo') or None, 'summary': sentences(about, 2),
        'priceFrom': min(v['price'] for v in vs), 'priceTo': max(v['price'] for v in vs), 'weights': sorted({v['grams'] for v in vs}), 'variants': vs, 'checkedAt': CHECKED,
        'source': {'url': f'{WEB}/{slug}/', 'verifiedAt': CHECKED, 'facts': 'doporučená příprava, chuť, kyselost, tělo, země a zpracování (popis produktu); ceny a sklad variant (Shoptet)'}})
products = [p for p in products if p['photo']][:25]
def addon(fname, label):
    f = os.path.join(DIR, fname + '.html')
    if not os.path.exists(f): return None
    h = open(f, encoding='utf-8', errors='replace').read()
    m = re.search(r'itemprop="price" content="([\d.]+)"', h)
    if not m or 'schema.org/InStock' not in h: return None
    img = (re.search(r'og:image" content="([^"]+)"', h) or [None, None])[1]
    return {'price': float(m.group(1)), 'note': label, 'product': {'id': fname, 'name': txt(re.search(r'<h1[^>]*>(.*?)</h1>', h, re.S).group(1)), 'url': f'{WEB}/{fname}/', 'photo': photo(SLUG, H.unescape(img) if img else None, fname)}}
# doplnok iba tam, kde sedí k pomôcke (filtre V60 e-shop nepredáva – Chemex/Moccamaster filtre by k V60 nesedeli)
ADD = {k: v for k, v in {'aeropress': addon('filtry-do-aeropressu', 'Náhradní papírové filtry pro AeroPress.')}.items() if v}
DATA = {'slug': SLUG, 'lang': 'cs', 'checkedAt': CHECKED, 'beansOnly': True, 'altFallback': True, 'demo': {'heroProductId': products[0]['id']},
  'brand': {'name': 'mamacoffee', 'legal': 'mamacoffee', 'place': 'mamacoffee · pražírna a kavárny', 'shopUrl': WEB + '/kava/', 'web': WEB + '/',
            'logo': '/assets/s3/mamacoffee/logo.png', 'hero': products[0]['photo'], 'contact': '', 'contactSource': WEB + '/',
            'theme': {'ink': '#1d1d1b', 'brand': '#1d1d1b', 'accent': '#c0392b', 'soft': '#f5f0ea', 'paper': '#ffffff'}},
  'tasteLabels': {'choco': ['Čokoládová a sladká', 'Nízká kyselost, plné tělo'], 'fruitFull': ['Vyvážená', ''], 'fresh': ['Ovocná a živá', 'Živá kyselost, ovoce'], 'decaf': ['Bez kofeinu', 'Káva i na večer']},
  'scope': f'{len(products)} zrnkových káv z kategorie Káva e-shopu mamacoffee.cz ({CHECKED}), ceny a sklad přesných variant.',
  'excluded': ['drip sáčky a degustační sady', 'předplatné a poukazy', 'čaje a příslušenství (kromě filtrů jako doplňku)'],
  'addons': ADD, 'shop': {'freeShipping': '', 'shippingNote': '', 'freeShippingSource': WEB + '/doprava-platba/'},
  'chips': ['Káva do automatu', 'Káva na filtr', 'Co je méně kyselé?', 'Máte kávu bez kofeinu?'], 'commercialNote': '', 'products': products, 'sets': [], 'held': []}
write_coffee(SLUG, DATA, 'mamacoffee – séria 3 (447 € + 10 €/měs.): katalog z e-shopu mamacoffee.cz (' + CHECKED + '). Vygenerováno: tools/s3a/build_mamacoffee.py.')
for p in products: print(p['name'], p['preps'], p['taste'], p['notes'], [(v['grams'], v['price']) for v in p['variants']], p['process'], p['region'], p['decaf'])
print('doplnky', {k: (v['product']['name'], v['price']) for k, v in ADD.items()})
