"""Séria 3 (Andreine) – KAMIKAVA (kamikava.cz, Eshop-rychle). Zdroj: kategórie výběrová káva, jednodruhová arabica, espresso směsi,
robusta a bezkofeinová káva; na stránke produktu „Chuťové vlastnosti“ (viditeľné škály 1–10: kyselost, hořkost, sladkost, tělo),
„Chuťový profil“ a „Vhodná příprava“; ceny a sklad variantov zo schema.org ProductGroup (úprava „zrnková“, bez dóz).
python3 -I tools/s3a/build_kamikava.py DIR_S_HTML"""
import sys, os, re, json, glob, html as H
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import sentences, photo, write_coffee, process_label
DIR = sys.argv[1]; CHECKED = '2026-11-05'; SLUG = 'kamikava'; WEB = 'https://www.kamikava.cz'
REG = {'brazil': ('Brazílie', 'americas'), 'colombia': ('Kolumbie', 'americas'), 'costa': ('Kostarika', 'americas'), 'cuba': ('Kuba', 'americas'), 'ethiopia': ('Etiopie', 'africa'),
       'honduras': ('Honduras', 'americas'), 'india': ('Indie', 'asia'), 'kenya': ('Keňa', 'africa'), 'malawi': ('Malawi', 'africa'), 'papua': ('Papua-Nová Guinea', 'asia'), 'salvador': ('Salvador', 'americas')}
def pipes(h):
    t = re.sub(r'<(script|style)[^>]*>.*?</\1>', '', h, flags=re.S); t = H.unescape(re.sub(r'<[^>]+>', ' | ', t))
    return re.sub(r'(\s*\|\s*)+', ' | ', re.sub(r'[ \t\r\n\xa0]+', ' ', t))
def scale(h, lab):
    m = re.search(r'>\s*' + lab + r'\s*(?:<span[^>]*>[^<]*</span>\s*)?</span>\s*<div style="display: flex; gap[^"]*">(.*?)</div>\s*</div>', h, re.S)
    return m.group(1).count('#2d2d2d') if m else None
products = []
for f in sorted(glob.glob(DIR + '/*.html')):
    slug = os.path.basename(f)[:-5]
    if slug.startswith(('l-', 'h-')): continue
    h = open(f, encoding='utf-8', errors='replace').read(); t = pipes(h)
    name = re.sub(r'\s*-?\s*\d+\s*g\s*\(.*$', '', H.unescape((re.search(r'"name":"([^"]+)","price"', h) or [None, slug])[1].encode().decode('unicode_escape').encode('latin1').decode('utf-8', 'replace'))).strip()
    sc = {k: scale(h, k) for k in ('Kyselost', 'Hořkost', 'Sladkost', 'Tělo')}
    prof = (re.search(r'Chuťový profil \| ([^|]+)', t) or [None, ''])[1]
    notes = [n.strip().lower() for n in re.split(r'\s*[•·]\s*', prof) if n.strip()][:4]
    way = (re.search(r'Vhodná příprava \| (.*?)(?: \| (?:Zpracování|Stupeň|Původ|Region|Odrůda|Nadmořská|Země)\b|$)', t) or [None, ''])[1]
    way = re.sub(r'\s*\|\s*', ' ', way)
    way = re.split(r' (?:SLOŽENÍ|Poznámka|Zboží zařazeno)\b', way)[0].strip()
    preps = [x for x, rx in [('espresso', r'Espresso|Automatický|Moka'), ('filter', r'Filtr|Aero ?press|French press')] if re.search(rx, way)]
    tools = [x for x, rx in [('v60', r'Filtr'), ('aeropress', r'Aero ?press'), ('frenchpress', r'French press')] if re.search(rx, way)]
    k = sc['Kyselost']
    taste = None if k is None else 'fresh' if k >= 6 else 'choco' if k <= 2 else 'fruitFull'
    if not notes or not preps or taste is None: print('VYRADENÉ (profil, príprava alebo škála chýba)', name, notes, way[:60], sc); continue
    vs = []
    for m in re.finditer(r'\{"@type":"Product","name":"[^"]*","sku":"([^"]+)","offers":\{"@type":"Offer","price":"([\d.]+)","priceCurrency":"CZK","availability":"([^"]+)"[^}]*\}(.*?)"isVariantOf"', h):
        props = {a.strip(): b.strip() for a, b in re.findall(r'"name":"([^"]+?)\s*-\s*","value":"([^"]+)"', m.group(4))}
        g = re.fullmatch(r'(\d+)\s*g', props.get('velikost balení', ''))
        if not g or props.get('úprava') != 'zrnková' or not m.group(3).endswith('InStock'): continue
        vs.append({'grams': int(g.group(1)), 'grind': 'zrnková', 'price': float(m.group(2)), 'url': f'{WEB}/{slug}', 'available': True, 'verifiedAt': CHECKED,
                   'source': 'schema.org varianta ' + m.group(1) + ' na stránke kamikava.cz (' + CHECKED + '): ' + g.group(0) + ', zrnková, InStock'})
    if not vs: print('VYRADENÉ (nie skladom)', name); continue
    vs.sort(key=lambda v: v['grams'])
    decaf = 'decaf' in slug
    blend = 'smes' in slug
    c = REG.get(slug.split('-')[0])
    proc = (re.search(r'Zpracování \| ([^|]+)', t) or [None, ''])[1].strip()
    img = (re.search(r'og:image" content="([^"]+)"', h) or [None, None])[1]
    lead = (re.search(r'og:description" content="([^"]+)"', h) or [None, ''])[1]
    products.append({'id': slug, 'kind': 'coffee', 'name': name, 'url': f'{WEB}/{slug}', 'photo': photo(SLUG, H.unescape(img) if img else None, slug), 'photoRemote': False,
        'currency': 'CZK', 'available': True, 'decaf': decaf, 'preps': preps, 'tools': tools, 'roastLabel': '', 'prepText': way.replace(' •', ',').strip(' ,•'),
        'taste': taste, 'tastes': [taste], 'tasteSource': 'škály pražírny (1–10): ' + ', '.join(f'{a.lower()} {b}' for a, b in sc.items() if b is not None),
        'notes': notes, 'origin': 'směs' if blend else (c[0] if c else ''), 'region': 'blend' if blend else (c[1] if c else None),
        'process': process_label(proc) if proc else None, 'variety': None, 'summary': sentences(H.unescape(lead), 2),
        'priceFrom': min(v['price'] for v in vs), 'priceTo': max(v['price'] for v in vs), 'weights': sorted({v['grams'] for v in vs}), 'variants': vs, 'checkedAt': CHECKED,
        'source': {'url': f'{WEB}/{slug}', 'verifiedAt': CHECKED, 'facts': 'chuťové vlastnosti (škály), chuťový profil, vhodná příprava, zpracování; ceny a sklad variant (schema.org)'}})
products = [p for p in products if p['photo']][:25]
DATA = {'slug': SLUG, 'lang': 'cs', 'checkedAt': CHECKED, 'beansOnly': True, 'altFallback': True, 'demo': {'heroProductId': products[0]['id']},
  'brand': {'name': 'KAMIKAVA', 'legal': 'KAMIKAVA', 'place': 'KAMIKAVA · rodinná pražírna kávy', 'shopUrl': WEB + '/vyberova-kava', 'web': WEB + '/',
            'logo': '/assets/s3/kamikava/logo.png', 'hero': products[0]['photo'], 'contact': '', 'contactSource': WEB + '/',
            'theme': {'ink': '#1d1d1d', 'brand': '#1d1d1d', 'accent': '#b8873b', 'soft': '#f5efe6', 'paper': '#ffffff'}},
  'tasteLabels': {'choco': ['Nízká kyselost', 'Čokoláda, ořechy, plné tělo'], 'fruitFull': ['Vyvážená', 'Střední kyselost, sladkost'], 'fresh': ['Ovocná a svěží', 'Vyšší kyselost, ovoce, květy'], 'decaf': ['Bez kofeinu', 'Káva i na večer']},
  'scope': f'{len(products)} zrnkových káv z e-shopu kamikava.cz ({CHECKED}), ceny a sklad přesných variant (bez dóz).',
  'excluded': ['dózy a dárková balení', 'adventní kalendáře', 'kávovary, čaje, sirupy a čokoláda'],
  'shop': {'freeShipping': '', 'shippingNote': '', 'freeShippingSource': WEB + '/'},
  'chips': ['Káva do automatu', 'Káva na filtr', 'Co je méně kyselé?', 'Máte kávu bez kofeinu?'], 'commercialNote': '', 'products': products, 'sets': [], 'held': []}
write_coffee(SLUG, DATA, 'KAMIKAVA – séria 3 (447 € + 10 €/měs.): katalog z e-shopu kamikava.cz (' + CHECKED + '). Vygenerováno: tools/s3a/build_kamikava.py.')
for p in products: print(p['name'], p['preps'], p['tools'], p['taste'], p['notes'], [(v['grams'], v['price']) for v in p['variants']], p['region'], p['decaf'])
