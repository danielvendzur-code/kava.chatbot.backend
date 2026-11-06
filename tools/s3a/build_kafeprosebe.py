"""Séria 3 (Andreine) – Pražírna KAFE PRO SEBE (kafeprosebe.cz, Eshop-rychle). Zdroj: kategórie e-shopu
„Čokoládová a oříšková“ / „Ovocná a citrusová“ (chuť), „Jednodruhová na espresso“ + „Espresso směsi“ / „Káva na filtr“ (príprava), „Bez kofeinu“;
z karty produktu „Chuť“ a „Zpracování“; ceny, sklad a URL každého variantu zo schema.org (Druh mletí „zrnko“, Množství).
Najviac 25: všetky filtrové, bezkofeínové a espresso zmesi; zvyšok jednodruhové espresso striedavo podľa chuti v poradí e-shopu. Vianočná limitovaná edícia sa nepreberá.
python3 -I tools/s3a/build_kafeprosebe.py DIR_S_HTML"""
import sys, os, re, json, html as H
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import sentences, photo, write_coffee, process_label
DIR = sys.argv[1]; CHECKED = '2026-11-06'; SLUG = 'kafeprosebe'; WEB = 'https://www.kafeprosebe.cz'
REG = {'brazilie': ('Brazílie', 'americas'), 'colombia': ('Kolumbie', 'americas'), 'costa': ('Kostarika', 'americas'), 'el': ('Salvador', 'americas'), 'etiopie': ('Etiopie', 'africa'),
       'guatemala': ('Guatemala', 'americas'), 'honduras': ('Honduras', 'americas'), 'indie': ('Indie', 'asia'), 'kenya': ('Keňa', 'africa'), 'mexico': ('Mexiko', 'americas'), 'nicaragua': ('Nikaragua', 'americas'),
       'papua': ('Papua-Nová Guinea', 'asia'), 'peru': ('Peru', 'americas'), 'rwanda': ('Rwanda', 'africa'), 'tanzania': ('Tanzanie', 'africa'), 'uganda': ('Uganda', 'africa')}
mem = json.load(open(f'{DIR}/mem.json'))
inc = lambda c: set(u.strip('/') for u in mem.get(c, []))
ESP = inc('jednodruhova-na-espresso') | inc('espresso-smesi2'); FIL = inc('kava-na-filtr'); DEC = inc('bez-kofeinu'); BLEND = inc('espresso-smesi2')
CHOCO = inc('cokoladova-a-oriskova-kava'); FRESH = inc('ovocna-a-citrusova-kava')
def pipes(h):
    t = re.sub(r'<(script|style)[^>]*>.*?</\1>', '', h, flags=re.S); t = H.unescape(re.sub(r'<[^>]+>', ' | ', t))
    return re.sub(r'(\s*\|\s*)+', ' | ', re.sub(r'[ \t\r\n\xa0]+', ' ', t))
LEX = [('mléčn\\w* čokol', 'mléčná čokoláda'), ('hořk\\w* čokol', 'hořká čokoláda'), ('čokol', 'čokoláda'), ('kaka', 'kakao'), ('karamel', 'karamel'), ('oříš|ořech', 'ořechy'), ('mandl', 'mandle'),
       ('javorov', 'javorový sirup'), ('sušen\\w* ovoc', 'sušené ovoce'), ('skořic', 'skořice'), ('koření', 'koření'), ('třtin', 'třtinový cukr')]
products = []
for slug in [u.strip('/') for u in open(f'{DIR}/urls.txt').read().split()]:
    if slug == 'vanocni-kava': print('MIMO (limitovaná vánoční edice)', slug); continue
    f = f'{DIR}/{slug}.html'
    if not os.path.exists(f): continue
    h = open(f, encoding='utf-8', errors='replace').read(); t = pipes(h)
    g = lambda k: (re.search(k + r': \| ([^|]+)', t) or [None, ''])[1].strip()
    name = H.unescape(re.sub(r'<[^>]+>', '', (re.search(r'<h1[^>]*>(.*?)</h1>', h, re.S) or [None, slug])[1])).strip()
    preps = [x for x, s in (('espresso', ESP), ('filter', FIL)) if slug in s]
    grinds = {json.loads('"' + v + '"') for v in re.findall(r'"name":"Druh mlet\\u00ed","value":"([^"]+)"|"name":"Druh mletí","value":"([^"]+)"', h) for v in v if v}
    prep_src = 'kategorie e-shopu'
    if not preps:  # bezkofeínové kávy nie sú v kategóriách prípravy – podľa ponúkaného mletia e-shopu
        preps = [x for x, rx in (('espresso', r'espresso|moka|džezv'), ('filter', r'filtr|french|překapáv')) if any(re.search(rx, g, re.I) for g in grinds)]
        prep_src = 'mletí nabízené e-shopem: ' + ', '.join(sorted(grinds))
    taste = 'fresh' if slug in FRESH else 'choco' if slug in CHOCO else None
    chut = g('Chuť')
    notes = [n.strip(' .').lower() for n in re.split(r',| a ', chut) if n.strip(' .')]
    if not notes or any(len(n) > 28 for n in notes[:3]):
        notes = list(dict.fromkeys(lab for _, lab in sorted((m.start(), lab) for rx, lab in LEX for m in [re.search(rx, chut.lower())] if m)))
    if not notes:
        desc = H.unescape((re.search(r'og:description" content="([^"]+)"', h) or [None, ''])[1]) + ' ' + (re.search(r'Zvolit variantu \| Kompletní specifikace \| (.{0,900})', t) or [None, ''])[1]
        notes = list(dict.fromkeys(lab for _, lab in sorted((m.start(), lab) for rx, lab in LEX for m in [re.search(rx, desc.lower())] if m)))
        if not notes: notes = ['čokoláda', 'oříšky'] if taste == 'choco' else ['ovoce', 'citrusy']  # podle kategorie chuti e-shopu
        if 'mléčná čokoláda' in notes or 'hořká čokoláda' in notes: notes = [n for n in notes if n != 'čokoláda']
    notes = notes[:4]
    if not preps or not taste or not notes: print('VYRADENÉ (príprava, chuť alebo tóny chýbajú)', name, preps, taste, chut[:40]); continue
    vs = []
    for m in re.finditer(r'\{"@type":"Product","name":"[^"]*","sku":"([^"]+)","offers":\{"@type":"Offer","price":"([\d.]+)","priceCurrency":"CZK","availability":"([^"]+)","url":"([^"]+)"(.*?)"isVariantOf"', h):
        props = dict(re.findall(r'"name":"([^"]+)","value":"([^"]+)"', m.group(5)))
        props = {json.loads('"' + k + '"'): json.loads('"' + v + '"') for k, v in props.items()}
        gm = re.fullmatch(r'(\d+)\s*g', props.get('Množství', ''))
        if not gm or props.get('Druh mletí') != 'zrnko' or not m.group(3).endswith('InStock'): continue
        vs.append({'grams': int(gm.group(1)), 'grind': 'zrnková', 'price': float(m.group(2)), 'url': m.group(4).replace('\\/', '/'), 'available': True, 'verifiedAt': CHECKED,
                   'source': 'schema.org varianta ' + m.group(1) + ' (kafeprosebe.cz, ' + CHECKED + '): zrnko, ' + gm.group(0) + ', InStock'})
    if not vs: print('VYRADENÉ (zrnko nie je skladom)', name); continue
    vs.sort(key=lambda v: v['grams'])
    c = REG.get(slug.split('-')[0]); blend = slug in BLEND
    proc = g('Zpracování')
    img = (re.search(r'og:image" content="([^"]+)"', h) or [None, None])[1]
    lead = (re.search(r'og:description" content="([^"]+)"', h) or [None, ''])[1]
    products.append({'id': slug, 'kind': 'coffee', 'name': name, 'url': f'{WEB}/{slug}', 'photo': photo(SLUG, H.unescape(img) if img else None, slug), 'photoRemote': False,
        'currency': 'CZK', 'available': True, 'decaf': slug in DEC, 'preps': preps, 'roastLabel': '', 'prepText': None, 'prepSource': prep_src,
        'taste': taste, 'tastes': [taste], 'tasteSource': 'kategorie e-shopu: ' + ('Ovocná a citrusová' if taste == 'fresh' else 'Čokoládová a oříšková'),
        'notes': notes, 'origin': 'směs' if blend else (g('Země') or (c[0] if c else '')), 'region': 'blend' if blend else (c[1] if c else None),
        'process': None if blend or not proc else process_label(re.split(r' - | / | a ', proc)[0].strip()), 'variety': g('Odrůda') or None, 'summary': sentences(H.unescape(lead), 2),
        'priceFrom': min(v['price'] for v in vs), 'priceTo': max(v['price'] for v in vs), 'weights': sorted({v['grams'] for v in vs}), 'variants': vs, 'checkedAt': CHECKED,
        'source': {'url': f'{WEB}/{slug}', 'verifiedAt': CHECKED, 'facts': 'kategorie podle chuti a přípravy, chuť, země, zpracování; ceny, sklad a URL variant (schema.org)'}})
products = [p for p in products if p['photo']]
core = [p for p in products if 'filter' in p['preps'] or p['decaf'] or p['region'] == 'blend']
rest = [p for p in products if p not in core]
fr, ch = [p for p in rest if p['taste'] == 'fresh'], [p for p in rest if p['taste'] == 'choco']
mix = [x for pair in zip(fr, ch) for x in pair] + fr[len(ch):] + ch[len(fr):]
keep = core + mix[:max(0, 25 - len(core))]
for p in products:
    if p not in keep: print('NAD LIMIT 25 (vynechané)', p['name'])
products = [p for p in products if p in keep]
DATA = {'slug': SLUG, 'lang': 'cs', 'checkedAt': CHECKED, 'beansOnly': True, 'altFallback': True, 'demo': {'heroProductId': products[0]['id']},
  'brand': {'name': 'Kafe pro sebe', 'legal': 'Pražírna Kafe pro sebe', 'place': 'Kafe pro sebe · rodinná pražírna z Hané', 'shopUrl': WEB + '/cerstve-prazena-kava', 'web': WEB + '/',
            'logo': '/assets/s3/kafeprosebe/logo.png', 'hero': products[0]['photo'], 'contact': '', 'contactSource': WEB + '/',
            'theme': {'ink': '#1d1d1b', 'brand': '#1d1d1b', 'accent': '#a3743b', 'soft': '#f5efe6', 'paper': '#ffffff'}},
  'tasteLabels': {'choco': ['Čokoládová a oříšková', 'Čokoláda, ořechy, karamel'], 'fruitFull': ['Vyvážená', ''], 'fresh': ['Ovocná a citrusová', 'Ovoce, citrusy, květy'], 'decaf': ['Bez kofeinu', 'Káva i na večer']},
  'scope': f'{len(products)} zrnkových káv z e-shopu kafeprosebe.cz ({CHECKED}), ceny a sklad přesných variant.',
  'excluded': ['limitovaná vánoční edice', 'mletá káva (doporučuje se zrnková)', 'příslušenství'],
  'shop': {'freeShipping': 'Doprava zdarma při nákupu nad 1 000 Kč.', 'shippingNote': '', 'freeShippingSource': WEB + '/'},
  'chips': ['Káva do automatu', 'Káva na filtr', 'Něco čokoládového', 'Máte kávu bez kofeinu?'], 'commercialNote': '', 'products': products, 'sets': [], 'held': []}
write_coffee(SLUG, DATA, 'Kafe pro sebe – séria 3 (447 € + 10 €/měs.): katalog z e-shopu kafeprosebe.cz (' + CHECKED + '). Vygenerováno: tools/s3a/build_kafeprosebe.py.')
for p in products: print(p['name'], p['preps'], p['taste'], p['notes'], [(v['grams'], v['price']) for v in p['variants']], p['process'], p['decaf'])
