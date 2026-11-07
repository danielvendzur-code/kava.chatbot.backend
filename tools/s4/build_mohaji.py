"""Séria 4 – Mohaji (mohaji.cz, Shoptet; MOHAJI s.r.o., IČO 03924424). Zdroj: kategórie e-shopu Pražení na espresso / Pražení na filtr /
Bez kofeinu / Limitované edice, z karty produktu parametre (Kyselost, Hořkost, Sladkost ●○○○○ = škály pražírny, Stupeň pražení, Země původu,
Charakteristika) a krátky popis (tóny); ceny a sklad variant zo Shoptet dát (250 g / 500 g / 1 kg; multibalenia 3×/6× 1 kg sa nepreberajú).
Darčekové kávy (Babička, Dědeček…), sady a dárkové sety sa nepreberajú – rovnaké kávy v darčekovom balení.
python3 -I tools/s4/build_mohaji.py DIR_S_products.json"""
import sys, os, re, json
sys.path.insert(0, os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 's3a'))
from common import sentences, photo, write_coffee
DIR = sys.argv[1]; CHECKED = '2026-11-07'; SLUG = 'mohaji'; WEB = 'https://www.mohaji.cz'
P = json.load(open(f'{DIR}/products.json'))
CO = {'Colombia': 'Kolumbie', 'Indie': 'Indie', 'Brazílie': 'Brazílie', 'Kenya': 'Keňa', 'Papua Nová Guinea': 'Papua-Nová Guinea', 'Honduras': 'Honduras', 'Brazil': 'Brazílie', 'Nicaragua': 'Nikaragua', 'Brazílie': 'Brazílie'}
REG = {'Kolumbie': 'americas', 'Keňa': 'africa', 'Papua-Nová Guinea': 'asia', 'Honduras': 'americas', 'Brazílie': 'americas', 'Nikaragua': 'americas'}
dots = lambda v: (len(re.match(r'([●○]+)', v.strip()).group(1).replace('○', '')) if re.match(r'[●○]', v.strip()) else None)
GENERIC = {'sladší chuť', 'plná intenzivní chuť', 'ovoce', 'čokoláda', 'květiny'}
# Chuťové tóny prepísané do 1. pádu podľa krátkeho a detailného popisu na karte produktu (2026-11-07).
NOTES = {'Limitka - rum': ['čokoláda', 'rum', 'vaječný likér'], 'Limitka - whisky': ['karamel', 'vanilka', 'whisky'], 'Exclusive Espresso': ['kakaové boby', 'smetana', 'marmeláda'],
         'Italiano': ['hořká čokoláda'], 'Brazil Cerrado': ['čokoláda', 'oříšky'], 'Full Boost': ['hořká čokoláda', 'kouřový nádech'], 'Honduras': ['čokoláda', 'zemité tóny'],
         'Original Espresso': ['lískové ořechy', 'karamel', 'kandované třešně'], 'Papua': ['meruňka', 'červený rybíz', 'čokoláda'], 'Strong Espresso': ['hořká čokoláda', 'oříšky', 'koření'], 'Ranní probuzení': ['hořká čokoláda', 'karamelové sušenky'],
         'Nicaragua': ['maliny', 'ananas', 'čokoláda', 'vanilka'], 'Kenya': ['ostružiny', 'rozinky', 'meruňky'], 'Podzimní': ['čokoláda', 'med', 'sušené ovoce'],
         'Narozeninová': ['lesní ovoce', 'květiny', 'čokoláda']}
products, seen = [], set()
for p in P:
    pr = {k.strip().lstrip('? ').strip(): v for k, v in p['params'].items()}
    cat = pr.get('Kategorie', '')
    if p['url'] in seen: continue
    seen.add(p['url'])
    if re.search(r'Drobné dárky|Dárkov|Degustační', cat) or re.search(r'sada|set ', p['name'], re.I): print('MIMO (darček / sada)', p['name']); continue
    roast = pr.get('Stupeň pražení', '')
    preps = sorted({x for x, rx in (('espresso', r'na espresso'), ('filter', r'na filtr')) if re.search(rx, roast)})
    if not preps: print('VYRADENÉ (pražení neuvedené)', p['name']); continue
    vs = []
    for v in p['variants']:
        m = re.fullmatch(r'(\d+)\s*(g|kg)', (v['name'] or '').strip())
        if not m or v.get('soldOut') or v['avail'] not in ('Skladem', 'InStock'): continue
        g = int(m.group(1)) * (1000 if m.group(2) == 'kg' else 1)
        vs.append({'grams': g, 'grind': 'zrnková', 'price': float(v['price']), 'url': p['url'], 'available': True, 'verifiedAt': CHECKED,
                   'source': f"Shoptet varianta {v.get('sku')} (mohaji.cz, {CHECKED}): {v['name']}, {v['avail']}"})
    if not vs: print('VYRADENÉ (žiadne dostupné balenie)', p['name']); continue
    vs.sort(key=lambda v: v['grams'])
    scales = {k: dots(pr[k]) for k in ('Kyselost', 'Hořkost', 'Sladkost') if k in pr and dots(pr[k]) is not None}
    char = [c.strip() for c in pr.get('Charakteristika', '').split(',') if c.strip()]
    cl = [c.lower() for c in char]
    kys = scales.get('Kyselost', 0)
    taste = 'fresh' if ('květiny' in cl or kys >= 4) else 'fruitFull' if 'ovoce' in cl else 'choco'
    t = p['short']
    nk = next((k for k in NOTES if k.lower() in p['name'].lower()), None)
    notes = NOTES.get(nk, [])
    cs_ = [CO.get(c.strip(), c.strip()).replace('Indie - Robusta', 'Indie (robusta)') for c in pr.get('Země původu', '').split(',') if c.strip()]
    NAME_CO = {'Nicaragua': 'Nikaragua', 'Kenya': 'Keňa', 'Honduras': 'Honduras', 'Brazil': 'Brazílie', 'Colombia': 'Kolumbie', 'Papua': 'Papua-Nová Guinea'}
    nm = next((v for k, v in NAME_CO.items() if re.search(r'\b' + k, p['name'])), None)
    if nm and len(cs_) == 1 and cs_[0] != nm: print('POZOR: země v parametru', cs_, '≠ název', p['name'], '→ podle názvu'); cs_ = [nm]
    blend = len(cs_) > 1 or (bool(re.search(r'blend|směs|probuzení', p['name'], re.I)) and not cs_)
    country = ('směs: ' + ', '.join(cs_) if cs_ else 'směs') if blend else (cs_[0] if cs_ else '')
    decaf = bool(re.search(r'decaf|bez kofeinu', p['name'] + cat, re.I)) or pr.get('Obsah kofeinu (arabica/robusta)', '').startswith('○○○')
    sc = ', '.join(f'{k.lower()} {v}/5' for k, v in scales.items())
    pid = p['url'].rstrip('/').split('/')[-1]
    products.append({'id': pid, 'kind': 'coffee', 'name': re.sub(r'^Káva ', '', p['name']), 'url': p['url'], 'photo': photo(SLUG, p['img'], pid), 'photoRemote': False,
        'currency': 'CZK', 'available': True, 'decaf': decaf, 'preps': preps, 'roastLabel': roast.split(',')[0].split(' - ')[-1].strip(), 'prepText': pr.get('Způsoby přípravy'),
        'taste': taste, 'tastes': [taste], 'tasteSource': 'parametry e-shopu: ' + (sc + '; ' if sc else '') + 'charakteristika ' + (', '.join(char) or 'neuvedena'),
        'notes': notes, 'origin': country, 'region': 'blend' if blend else REG.get(country), 'process': None, 'variety': None, 'summary': sentences(t, 2),
        'priceFrom': vs[0]['price'], 'priceTo': max(v['price'] for v in vs), 'weights': [v['grams'] for v in vs], 'variants': vs, 'checkedAt': CHECKED,
        'source': {'url': p['url'], 'verifiedAt': CHECKED, 'facts': 'parametry produktu (kyselost, hořkost, sladkost, stupeň pražení, země původu, charakteristika), krátký popis; ceny a sklad variant'}})
products = [p for p in products if p['photo']][:25]
ADD = {'v60': {'price': 79.0, 'note': 'Papírové filtry pro dripper V60-02 (40 ks).', 'product': {'id': 'papirove-filtry-hario-v60-02-40-ks', 'name': 'Papírové filtry Hario V60-02 40 ks',
       'url': WEB + '/papirove-filtry-hario-v60-02-40-ks/', 'photo': '/assets/s3/mohaji/filtry-v60-02.jpg'}}}  # cena a sklad overené 2026-11-07
DATA = {'slug': SLUG, 'lang': 'cs', 'checkedAt': CHECKED, 'beansOnly': True, 'altFallback': True, 'demo': {'heroProductId': products[0]['id']},
  'brand': {'name': 'Mohaji', 'legal': 'MOHAJI s.r.o.', 'place': 'Mohaji · pražírna výběrové kávy', 'shopUrl': WEB + '/nase-kavy/', 'web': WEB + '/',
            'logo': '/assets/s3/mohaji/logo.png', 'hero': products[0]['photo'], 'contact': 'kava@mohaji.cz', 'contactSource': WEB + '/kontakty/',
            'theme': {'ink': '#1f1a17', 'brand': '#1f1a17', 'accent': '#b8873b', 'soft': '#f6f1ea', 'paper': '#ffffff'}},
  'tasteLabels': {'choco': ['Čokoládová, nízká kyselost', 'Čokoláda, oříšky, plné tělo'], 'fruitFull': ['Ovocná i čokoládová', 'Ovoce s čokoládou, vyvážená'],
                  'fresh': ['Svěží a ovocná', 'Vyšší kyselost, ovoce, květy'], 'decaf': ['Bez kofeinu', 'Káva i na večer']},
  'scope': f'{len(products)} zrnkových káv z e-shopu mohaji.cz ({CHECKED}), ceny a sklad přesných balení.',
  'excluded': ['kávy v dárkovém balení (Babička, Dědeček…), dárkové a degustační sety', 'multibalení 3× a 6× 1 kg', 'vyprodaná balení'],
  'addons': ADD, 'shop': {'freeShipping': 'Doprava zdarma při nákupu nad 1 200 Kč (Zásilkovna, GLS).', 'shippingNote': '', 'freeShippingSource': WEB + '/doprava-a-platba/'},
  'chips': ['Káva do automatu', 'Káva na filtr', 'Porovnat 2 kávy', 'Máte kávu bez kofeinu?'], 'commercialNote': '', 'products': products, 'sets': [], 'held': []}
write_coffee(SLUG, DATA, 'Mohaji – séria 4 (447 € + 10 €/měs.): katalog z e-shopu mohaji.cz (' + CHECKED + '). Vygenerováno: tools/s4/build_mohaji.py.')
for p in products: print(p['name'], p['preps'], p['taste'], p['notes'], p['tasteSource'][17:70], [(v['grams'], v['price']) for v in p['variants']], p['decaf'])
