"""Séria 3 (Andreine) – Fiftybeans (fiftybeans.cz/cs/eshop, vlastný e-shop). Zdroj: kategórie Filtrovaná káva a Espresso
a produktové stránky (tabuľka vlastností: Země původu, Zpracování, Senzorická charakteristika, Odrůda, Metody přípravy; „Jak chutná“).
Cena: zobrazená cena predvolenej varianty (prvé balenie) – iné balenie sa neodporúča, jeho cenu e-shop počíta až po výbere.
python3 -I tools/s3a/build_fiftybeans.py DIR_S_HTML"""
import sys, os, re, html as H, glob
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import sentences, photo, write_coffee, process_label
DIR = sys.argv[1]; CHECKED = '2026-11-05'; SLUG = 'fiftybeans'; WEB = 'https://fiftybeans.cz'
REG = {'Kolumbie': 'americas', 'Brazílie': 'americas', 'Kostarika': 'americas', 'Panama': 'americas', 'Bolívie': 'americas', 'Etiopie': 'africa', 'Keňa': 'africa', 'Indie': 'asia'}
txt = lambda h: re.sub(r'\s+', ' ', H.unescape(re.sub(r'<[^>]+>', ' ', h or ''))).strip()
products = []
for f in sorted(glob.glob(DIR + '/*.html')):
    if os.path.basename(f).startswith('l-'): continue
    h = open(f, encoding='utf-8', errors='replace').read()
    slug = os.path.basename(f)[:-5]
    name = txt((re.search(r'<h1>(.*?)</h1>', h, re.S) or [None, ''])[1])
    props = {txt(k): txt(v) for k, v in re.findall(r'<td>\s*<strong>(.*?)</strong>\s*</td>\s*<td>(.*?)</td>', h, re.S)}
    price = (re.search(r'product-detail__price__value">\s*([\d\s ]+)\s*Kč', h) or [None, None])[1]
    variants = re.findall(r'variationId_(\d+)"[^>]*?(checked="checked")?[^>]*/>\s*<label[^>]*>([^<]+)</label>', h)
    first = next((v for v in variants if v[1]), variants[0] if variants else None)
    sold = re.search(r'Vyprodáno|Není skladem|nedostupn', txt(re.search(r'product-detail__content(.*?)product-detail__properties', h, re.S).group(1)) if re.search(r'product-detail__content(.*?)product-detail__properties', h, re.S) else '', re.I)
    kind = txt((re.search(r'Všechny produkty\s*</a>.*?<a[^>]*>(.*?)</a>', h, re.S) or [None, ''])[1])
    body = re.sub(r'(\s*\|\s*)+', ' | ', txt(re.sub(r'<(p|br|strong|li|h\d)[^>]*>', ' | ', (re.search(r'product-detail__properties(.*?)Související zboží', h, re.S) or [None, ''])[1])))
    def sec(label):
        m = re.search(re.escape(label) + r'\s*:?\s*\|\s*([^|]+)', body)
        return m.group(1).strip() if m else ''
    m = re.search(r'Jak (?:\w+ )?chutná\s*:?\s*\|\s*([^|]+)', body)
    taste_txt = m.group(1).strip() if m else ''
    if not taste_txt:
        m = re.search(r's chutí ([^.|]+)', body) or re.search(r'chutná (?:jako|po) ([^.|]+)', body, re.I)
        taste_txt = m.group(1).strip() if m else ''
    notes = [n.strip(' .').lower() for n in re.split(r',|\ba\b', re.sub(r'^(jako|po)\s+', '', taste_txt, flags=re.I)) if n.strip(' .')][:4]
    sens = props.get('Senzorická charakteristika', '')
    methods = props.get('Metody přípravy', '')
    if not price or not first or sold: print('VYRADENÉ (bez dostupnej ceny)', name); continue
    if re.search(r'set|box|kapsle|instant|kávovar|poukaz', name + ' ' + slug, re.I): print('MIMO', name); continue
    if not sens or not notes: print('VYRADENÉ (bez chuti)', name, sens, taste_txt[:40]); continue
    preps = []
    if re.search(r'espresso|automat', methods, re.I): preps.append('espresso')
    if re.search(r'filtr|překap|aeropress|french', methods, re.I): preps.append('filter')
    if not preps: print('VYRADENÉ (bez prípravy)', name, methods); continue
    grams = int(re.search(r'(\d+)', first[2]).group(1))
    vprice = float(re.sub(r'\D', '', price))
    img = (re.search(r'<img src="(/files/[^"?]+)[^"]*" alt="' + re.escape(H.escape(name, quote=False)) , h) or re.search(r'<img src="(/files/[^"?]+)', h) or [None, None])[1]
    country = props.get('Země původu', '')
    decaf = bool(re.search(r'decaf|bez kofeinu', name + ' ' + props.get('Zpracování', ''), re.I))
    taste = 'fresh' if re.search(r'Šťavnat', sens) else 'choco' if re.search(r'Sladk', sens) else None
    if not taste: print('VYRADENÉ (chuť mimo škálu)', name, sens); continue
    intro = next((x.strip() for x in body.split('|') if len(x.strip()) > 50 and not re.search(r'Jak chutná|Zpracování:|Na co se hodí|Doporučení|Dobré vědět|Obsah balení', x)), '')
    products.append({'id': slug, 'kind': 'coffee', 'name': name, 'url': f'{WEB}/cs/produkty/{slug}', 'photo': photo(SLUG, WEB + img if img else None, slug) or None, 'photoRemote': False,
        'currency': 'CZK', 'available': True, 'decaf': decaf, 'preps': preps, 'roastLabel': 'espresso' if kind == 'Espresso' else 'filtr' if kind else '',
        'prepText': methods, 'taste': taste, 'tastes': [taste], 'tasteSource': 'senzorická charakteristika e-shopu: ' + sens,
        'notes': notes, 'origin': ' · '.join(x for x in [country, ('farmář ' + props['Farmář']) if props.get('Farmář') else ''] if x), 'region': 'blend' if ',' in country else REG.get(country),
        'process': process_label(props.get('Zpracování')), 'variety': props.get('Odrůda') or None, 'summary': sentences(intro, 2),
        'priceFrom': vprice, 'priceTo': vprice, 'weights': [grams],
        'variants': [{'grams': grams, 'grind': 'zrnková', 'price': vprice, 'url': f'{WEB}/cs/produkty/{slug}', 'available': True, 'verifiedAt': CHECKED, 'source': 'zobrazená cena predvolenej varianty ' + first[2].strip() + ' na stránke produktu (' + CHECKED + ')'}],
        'checkedAt': CHECKED, 'source': {'url': f'{WEB}/cs/produkty/{slug}', 'verifiedAt': CHECKED, 'facts': 'tabuľka vlastností produktu a sekcia „Jak chutná“ na stránke produktu'}})
products = [p for p in products if p['photo']][:25]
DATA = {'slug': SLUG, 'lang': 'cs', 'checkedAt': CHECKED, 'beansOnly': True, 'altFallback': True, 'demo': {'heroProductId': products[0]['id']},
  'brand': {'name': 'Fiftybeans', 'legal': 'DLY trading s.r.o. (pražírna Fiftybeans, Brno)', 'place': 'Fiftybeans · pražírna výběrové kávy, Brno', 'shopUrl': WEB + '/cs/eshop', 'web': WEB + '/cs/',
            'logo': '/assets/s3/fiftybeans/logo.svg', 'hero': products[0]['photo'], 'contact': '', 'contactSource': WEB + '/cs/kontakt',
            'theme': {'ink': '#322521', 'brand': '#322521', 'accent': '#2fbfae', 'soft': '#eef8f6', 'paper': '#ffffff'}},
  'tasteLabels': {'choco': ['Sladká káva', 'Podle senzorické charakteristiky pražírny'], 'fresh': ['Šťavnatá káva', 'Ovocná, svěží – podle pražírny'], 'fruitFull': ['Plná a ovocná', ''], 'decaf': ['Bez kofeinu', 'Káva i na večer']},
  'scope': f'{len(products)} zrnkových káv z kategorií Filtrovaná káva a Espresso e-shopu fiftybeans.cz ({CHECKED}); cena zobrazeného výchozího balení.',
  'excluded': ['kapsle a instantní káva', 'výhodné sety a mystery box', 'kávovary, příslušenství, poukazy'],
  'shop': {'freeShipping': '', 'shippingNote': '', 'freeShippingSource': WEB + '/cs/doprava-a-platba'},
  'chips': ['Káva do automatu', 'Káva na filtr', 'Něco sladšího', 'Máte kávu bez kofeinu?'], 'commercialNote': '', 'products': products, 'sets': [], 'held': []}
write_coffee(SLUG, DATA, 'Fiftybeans – séria 3 (447 € + 10 €/měs.): katalog z e-shopu fiftybeans.cz/cs/eshop (' + CHECKED + '). Vygenerováno: tools/s3a/build_fiftybeans.py.')
for p in products: print(p['name'], p['preps'], p['taste'], p['notes'], p['variants'][0]['grams'], p['priceFrom'], p['process'], p['region'], p['decaf'])
