"""Séria 3 (Andreine) – Pražírna Českáva (ceskava.cz, Upgates). Zdroj: kategória /kava a produktové stránky:
vlastnosti e-shopu Acidita, Hořkost, Obsah kofeinu a Vhodná příprava (štruktúrované parametre), chuťové tóny z popisu,
ceny balení z dát e-shopu (upgates.product.options), sklad zo schema.org. Předplatné a „káva na míru“ sa nepreberajú.
python3 -I tools/s3a/build_ceskava.py DIR_S_HTML"""
import sys, os, re, json, glob, html as H
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import sentences, photo, write_coffee
DIR = sys.argv[1]; CHECKED = '2026-11-05'; SLUG = 'ceskava'; WEB = 'https://www.ceskava.cz'
REG = {'Etiopie': 'africa', 'Brazílie': 'americas', 'Guatemala': 'americas', 'Kolumbie': 'americas', 'Mexiko': 'americas', 'Nikaragua': 'americas', 'Kostarika': 'americas', 'Vietnam': 'asia'}
LEX = [(r'silně hořk|výrazně hořk', 'výrazná hořkost'), ('tropick', 'tropické ovoce'), ('melas', 'melasa'), ('rybíz', 'černý rybíz'), ('slad(?!k)', 'slad'), ('mlék', 'mléko'), (r'hořk\w* čokol', 'hořká čokoláda'), (r'mléčn\w* čokol', 'mléčná čokoláda'),
       ('(?<!hořké )(?<!hořká )(?<!mléčné )(?<!mléčná )čokol', 'čokoláda'), ('kaka', 'kakao'), ('karamel', 'karamel'), ('oříš|ořech', 'ořechy'), ('citr', 'citrusy'), ('květ', 'květy'), ('bergamot', 'bergamot'),
       ('meru[ňn]', 'meruňky'), ('broskv', 'broskev'), ('jahod', 'jahody'), ('malin', 'maliny'), ('třešn', 'třešně'), ('švest', 'švestky'), ('jablk', 'jablko'), (r'\bmed', 'med'), ('vanil', 'vanilka'), ('koření', 'koření'), ('ovocn', 'ovoce')]
PREP = {'Espresso': 'espresso', 'Moka': 'espresso', 'Džezva': 'espresso', 'Dripper': 'filter', 'Chemex': 'filter', 'French press': 'filter', 'Aeropress': 'filter', 'Vacuum pot': 'filter'}
TOOL = {'Dripper': 'v60', 'Chemex': 'v60', 'Aeropress': 'aeropress', 'French press': 'frenchpress'}
txt = lambda h: re.sub(r'\s+', ' ', H.unescape(re.sub(r'<[^>]+>', ' ', h or ''))).strip()
def prop(h, k):
    i = h.find('<span>' + k + '</span>')
    return re.findall(r'title="([^"]+)"', h[i:i + 4000].split('</tr>')[0]) if i > 0 else []
products = []
for f in sorted(glob.glob(DIR + '/*.html')):
    slug = os.path.basename(f)[:-5]
    if slug.startswith('l-') or slug == 'p1': continue
    h = open(f, encoding='utf-8', errors='replace').read()
    m = re.search(r'var upgates = (\{.*?\});', h)
    d = json.loads(m.group(1))['product'] if m else {}
    if d.get('category', {}).get('title') != 'Káva' or 'schema.org/InStock' not in h: print('MIMO / nie skladom', slug); continue
    name = d['title']
    acid = [x.split(' - ')[-1] for x in prop(h, 'Acidita')]; bitter = [x.split(' - ')[-1] for x in prop(h, 'Hořkost')]; caf = prop(h, 'Obsah kofeinu'); way = prop(h, 'Vhodná příprava')
    preps = sorted({PREP[w] for w in way if w in PREP}); tools = sorted({TOOL[w] for w in way if w in TOOL})
    a = acid[0] if acid else ''
    taste = 'fresh' if a in ('vyšší', 'vysoká') else 'choco' if a in ('nižší', 'nízká') else 'fruitFull' if a == 'střední' else None
    t = txt(h)
    i = t.find('Rychlý kontakt'); head = t[i + 15:i + 600]
    sub = re.sub(r'^' + re.escape(name) + r'\s*(\d+ gramů, zrnková káva)?\s*(Tip|Novinka|Akce)?\s*', '', head).split(' Více ')[0].strip()
    desc = (re.search(r' Popis (.*?) Vlastnosti ', t) or [None, ''])[1]
    sent = ' '.join(x for x in re.split(r'(?<=[.!?])\s+', sub + '. ' + desc) if re.search(r'tóny|tónem|chuti|chuť|nádech', x)).lower()
    hits = sorted((mm.start(), lab) for rx, lab in LEX for mm in [re.search(rx, sent)] if mm)
    notes = list(dict.fromkeys(lab for _, lab in hits))
    if 'ovoce' in notes and len(notes) > 1: notes.remove('ovoce')
    notes = notes[:4]
    if not taste or not preps or not notes: print('VYRADENÉ (acidita, príprava alebo tóny chýbajú)', name, acid, way, notes); continue
    vs = []
    for o in d.get('options', []):
        g = re.search(r'-(\d+)$', o['code'])
        if g and int(g.group(1)) in (250, 500, 1000):
            vs.append({'grams': int(g.group(1)), 'grind': 'zrnková', 'price': float(o['price']['withVat']), 'url': f'{WEB}/p/{slug}', 'available': True, 'verifiedAt': CHECKED,
                       'source': 'ceny balení z dát e-shopu ceskava.cz (upgates.product.options, ' + CHECKED + '); varianta „zrnková káva“ se volí na stránce'})
    if not vs:
        g = re.search(r'Balení (\d+) gramů', t) or re.search(r'(\d+) gramů, zrnková káva', head); pr = re.search(r'itemprop="price" content="([\d.]+)"', h)
        if g and pr: vs.append({'grams': int(g.group(1)), 'grind': 'zrnková', 'price': float(pr.group(1)), 'url': f'{WEB}/p/{slug}', 'available': True, 'verifiedAt': CHECKED, 'source': 'stránka produktu ceskava.cz (' + CHECKED + '), „Skladem“'})
    if not vs: print('VYRADENÉ (bez ceny balení)', name); continue
    vs.sort(key=lambda v: v['grams'])
    country = (re.search(r'Země původu (.+?) (?:Vhodná příprava|Varianta|Nadmořská|Hořkost)', t) or [None, ''])[1].replace(' ,', ',').strip()
    variety = (re.search(r'Odrůda kávy (.+?) Země původu', t) or [None, ''])[1].strip()
    blend = ',' in country or bool(re.search(r'směs', slug + sub, re.I))
    img = (re.search(r'og:image" content="([^"]+)"', h) or [None, None])[1]
    products.append({'id': slug, 'kind': 'coffee', 'name': name, 'url': f'{WEB}/p/{slug}', 'photo': photo(SLUG, H.unescape(img) if img else None, slug), 'photoRemote': False,
        'currency': 'CZK', 'available': True, 'decaf': False, 'preps': preps, 'tools': tools or None, 'roastLabel': '', 'prepText': ', '.join(way),
        'taste': taste, 'tastes': [taste], 'tasteSource': 'vlastnosti e-shopu: acidita ' + a + (', hořkost ' + bitter[0] if bitter else '') + (', kofein ' + caf[0].lower() if caf else ''),
        'notes': notes, 'origin': country[:90], 'region': 'blend' if blend else REG.get(country), 'process': None, 'variety': variety or None, 'summary': sentences(sub, 1) or sentences(desc, 2),
        'priceFrom': min(v['price'] for v in vs), 'priceTo': max(v['price'] for v in vs), 'weights': sorted({v['grams'] for v in vs}), 'variants': vs, 'checkedAt': CHECKED,
        'source': {'url': f'{WEB}/p/{slug}', 'verifiedAt': CHECKED, 'facts': 'vlastnosti Acidita, Hořkost, Obsah kofeinu, Vhodná příprava; chuťové tóny z popisu; ceny balení (Upgates)'}})
    if not tools: products[-1].pop('tools')
products = [p for p in products if p['photo']][:25]
DATA = {'slug': SLUG, 'lang': 'cs', 'checkedAt': CHECKED, 'beansOnly': True, 'altFallback': True, 'demo': {'heroProductId': products[0]['id']},
  'brand': {'name': 'Českáva', 'legal': 'Českáva', 'place': 'Pražírna Českáva · Praha', 'shopUrl': WEB + '/kava', 'web': WEB + '/',
            'logo': '/assets/s3/ceskava/logo.png', 'hero': products[0]['photo'], 'contact': '', 'contactSource': WEB + '/',
            'theme': {'ink': '#1c1c1c', 'brand': '#1c1c1c', 'accent': '#b5823e', 'soft': '#f5efe6', 'paper': '#ffffff'}},
  'tasteLabels': {'choco': ['Nižší acidita', 'Čokoláda, ořechy, plné tělo'], 'fruitFull': ['Střední acidita', 'Vyvážená chuť'], 'fresh': ['Vyšší acidita', 'Ovocné a květinové tóny'], 'decaf': ['Bez kofeinu', 'Káva i na večer']},
  'scope': f'{len(products)} zrnkových káv z kategorie Káva e-shopu ceskava.cz ({CHECKED}), ceny balení podle dat e-shopu.',
  'excluded': ['kávové předplatné', 'káva na míru', 'čaje, čokoláda, kávovary a příslušenství'],
  'shop': {'freeShipping': '', 'shippingNote': '', 'freeShippingSource': WEB + '/a/doprava-a-platby'},
  'chips': ['Káva do automatu', 'Káva na filtr', 'Co je méně kyselé?', 'Něco méně hořkého'], 'commercialNote': '', 'products': products, 'sets': [], 'held': []}
write_coffee(SLUG, DATA, 'Českáva – séria 3 (447 € + 10 €/měs.): katalog z e-shopu ceskava.cz (' + CHECKED + '). Vygenerováno: tools/s3a/build_ceskava.py.')
for p in products: print(p['name'], p['preps'], p.get('tools'), p['taste'], p['notes'], [(v['grams'], v['price']) for v in p['variants']], p['region'])
