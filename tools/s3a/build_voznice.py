"""Séria 3 (Andreine) – Pražírna Voznice (prazirnavoznice.cz, JZShop). Zdroj: kategórie e-shopu
„Podle přípravy“ (Espresso & automat, Moka a french press, Filtr) a „Podle chuti“ (Bez kyselosti, Jemná & vyvážená, Ovocná & svěží),
chuťové tóny z karty produktu (alebo z vety „V chuti…“ v popise), cena a sklad východiskového variantu 150 g zrnková (vlastná URL variantu).
Iné hmotnosti sa menia odoslaním formulára – neoverujú sa, preto sa ponúka iba overené balenie 150 g. Cascara a sety sa nepreberajú.
python3 -I tools/s3a/build_voznice.py DIR_S_HTML"""
import sys, os, re, glob, html as H
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import sentences, photo, write_coffee, process_label
DIR = sys.argv[1]; CHECKED = '2026-11-05'; SLUG = 'voznice'; WEB = 'https://www.prazirnavoznice.cz'
PREP = {'kava-pro-espresso-a-automat-cerstve-prazena-prazirna-voznice': 'espresso', 'kava-pro-moka-konvicku-a-french-press-prazirna-voznice': 'espresso', 'kava-pro-filtr-v60-a-aeropress-prazirna-voznice': 'filter'}
TASTE = {'kava-bez-kyselosti-cokolada-karamel-orechy-prazirna-voznice': 'choco', 'vyvazena-kava-jemne-sladka-lehce-ovocna-prazirna-voznice': 'fruitFull', 'ovocna-kava-lesni-ovoce-citrusy-zive-tony-prazirna-voznice': 'fresh'}
REG = {'brazil': ('Brazílie', 'americas'), 'colombia': ('Kolumbie', 'americas'), 'ethiopia': ('Etiopie', 'africa'), 'guatemala': ('Guatemala', 'americas'), 'honduras': ('Honduras', 'americas'),
       'india': ('Indie', 'asia'), 'kenya': ('Keňa', 'africa'), 'peru': ('Peru', 'americas'), 'podzimni': ('Salvador', 'americas')}
LEX = [('tropick', 'tropické ovoce'), ('bobul', 'bobule'), ('fík', 'fíky'), ('peka|peko', 'pekanové ořechy'), ('malin', 'maliny'), ('med', 'med'), ('čokol', 'čokoláda'), ('kaka', 'kakao'), ('karamel', 'karamel'), ('oříš|ořech', 'ořechy'), ('meru[ňn]', 'meruňky'), ('broskv', 'broskev'), ('jasmín', 'jasmín'),
       ('bergamot', 'bergamot'), ('květ', 'květy'), ('citr', 'citrusy'), ('pomeranč', 'pomeranč'), ('limet', 'limeta'), ('grep', 'grep'), ('borův', 'borůvky'), ('jahod', 'jahody'), ('třešn', 'třešně'),
       ('rybíz', 'rybíz'), ('švest', 'švestky'), ('hrozn|rozin', 'rozinky'), ('jablk', 'jablko'), ('hrušk', 'hruška'), ('mandl', 'mandle'), ('marcipán', 'marcipán'), ('javor', 'javorový sirup'), ('cukr', 'třtinový cukr'), ('vanil', 'vanilka')]
txt = lambda h: re.sub(r'\s+', ' ', H.unescape(re.sub(r'<[^>]+>', ' ', h or ''))).strip()
def pipes(h):
    t = re.sub(r'<(script|style)[^>]*>.*?</\1>', '', h, flags=re.S); t = H.unescape(re.sub(r'<[^>]+>', ' | ', t))
    return re.sub(r'(\s*\|\s*)+', ' | ', re.sub(r'[ \t\r\n\xa0]+', ' ', t))
key = lambda u: re.sub(r'-p\d+-\d+$', '', u.strip('/'))
cat_prep, cat_taste = {}, {}
for c, v in PREP.items():
    for u in set(re.findall(r'href="/([a-z0-9-]+-p\d+-\d+)"', open(f'{DIR}/l-{c}.html', encoding='utf-8', errors='replace').read())): cat_prep.setdefault(key(u), set()).add(v)
for c, v in TASTE.items():
    for u in set(re.findall(r'href="/([a-z0-9-]+-p\d+-\d+)"', open(f'{DIR}/l-{c}.html', encoding='utf-8', errors='replace').read())): cat_taste.setdefault(key(u), []).append(v)
products = []
for f in sorted(glob.glob(DIR + '/*-p[0-9]*.html')):
    slug = os.path.basename(f)[:-5]; k = key(slug)
    if re.search(r'cascara|set-', slug): continue
    h = open(f, encoding='utf-8', errors='replace').read(); t = pipes(h)
    name = re.sub(r'\s*\d+\s*g\b.*$', '', txt(re.search(r'<h1[^>]*>(.*?)</h1>', h, re.S).group(1))).strip()
    price = re.search(r'itemprop="price" content="([\d.]+)"', h)
    sel = re.search(r'name="variant1_id".*?</select>', h, re.S)
    w = re.search(r'selected="selected">(\d+)\s*g<', sel.group(0)) if sel else None
    gr = re.search(r'name="variant2_id".*?selected="selected">([^<]+)<', h, re.S)
    if not price or 'schema.org/InStock' not in h or not w or not gr or 'zrnková' not in gr.group(1): print('VYRADENÉ (cena, sklad alebo balenie)', name); continue
    card = (re.search(r'Zobrazit hodnocení \| (.*?) \| Více informací', t) or [None, ''])[1]
    lead = (re.search(r'Hodnocení \(\d+\) \| [^|]+ \| ([^|]+)', t) or [None, ''])[1]
    notes = [n.strip(' .').lower() for n in card.split(',') if n.strip(' .')] if card else []
    if not notes and re.search(r'chuti|chuť|šálku|tóny', lead):
        sent = next((x for x in re.split(r'(?<=[.!?])\s+', lead) if re.search(r'chuti|chuť|šálku|tóny', x)), lead).lower()
        hits = sorted((m.start(), lab) for rx, lab in LEX for m in [re.search(rx, sent)] if m)
        notes = list(dict.fromkeys(lab for _, lab in hits))
        if 'pekanové ořechy' in notes: notes = [n for n in notes if n != 'ořechy']
    notes = notes[:4]
    preps = sorted(cat_prep.get(k, []))
    tastes = cat_taste.get(k, [])
    if not notes or not preps or not tastes: print('VYRADENÉ (chuť alebo príprava chýba)', name, notes, preps, tastes); continue
    order = ['fresh', 'fruitFull', 'choco']; tastes = sorted(set(tastes), key=order.index)
    decaf = bool(re.search(r'decaf|bezkofein', slug))
    blend = bool(re.search(r'smes', slug))
    c = REG.get(k.split('-')[0])
    proc = (re.search(r'Zpracování: ([^|]+)', t) or [None, ''])[1].strip()
    img = (re.search(r'og:image" content="([^"]+)"', h) or [None, None])[1]
    url = f'{WEB}/{slug}'
    products.append({'id': k, 'kind': 'coffee', 'name': name, 'url': url, 'photo': photo(SLUG, H.unescape(img) if img else None, k), 'photoRemote': False,
        'currency': 'CZK', 'available': True, 'decaf': decaf, 'preps': preps, 'roastLabel': (re.search(r'Pražení: ([^|]+)', t) or [None, ''])[1].strip(), 'prepText': None,
        'taste': tastes[0], 'tastes': tastes, 'tasteSource': 'kategorie e-shopu „Podle chuti“: ' + ', '.join({'choco': 'Bez kyselosti', 'fruitFull': 'Jemná & vyvážená', 'fresh': 'Ovocná & svěží'}[x] for x in tastes),
        'notes': notes, 'origin': 'směs' if blend else (c[0] if c else ''), 'region': 'blend' if blend else (c[1] if c else None),
        'process': None if blend else (process_label(re.split(r' a | / ', proc)[0].strip()) if proc else None), 'variety': (re.search(r'Odrůda(?: kávy)?: ([^|]+)', t) or [None, ''])[1].strip() or None, 'summary': sentences(lead, 2),
        'priceFrom': float(price.group(1)), 'priceTo': float(price.group(1)), 'weights': [int(w.group(1))],
        'variants': [{'grams': int(w.group(1)), 'grind': 'zrnková', 'price': float(price.group(1)), 'url': url, 'available': True, 'verifiedAt': CHECKED,
                      'source': 'stránka variantu prazirnavoznice.cz (' + CHECKED + '): ' + w.group(1) + ' g, zrnková káva, „Skladem“'}], 'checkedAt': CHECKED,
        'source': {'url': url, 'verifiedAt': CHECKED, 'facts': 'kategorie podle přípravy a chuti, chuťové tóny a detaily z popisu produktu; cena a sklad variantu 150 g'}})
products = [p for p in products if p['photo']][:25]
DATA = {'slug': SLUG, 'lang': 'cs', 'checkedAt': CHECKED, 'beansOnly': True, 'altFallback': True, 'demo': {'heroProductId': products[0]['id']},
  'brand': {'name': 'Pražírna Voznice', 'legal': 'Pražírna Voznice s.r.o.', 'place': 'Pražírna Voznice · výběrová káva', 'shopUrl': WEB + '/cerstve-prazena-vyberova-kava-prazirna-vozniceva-kava', 'web': WEB + '/',
            'logo': '/assets/s3/voznice/logo.png', 'hero': products[0]['photo'], 'contact': '', 'contactSource': WEB + '/',
            'theme': {'ink': '#1c1c1c', 'brand': '#1c1c1c', 'accent': '#a8743f', 'soft': '#f5efe7', 'paper': '#ffffff'}},
  'tasteLabels': {'choco': ['Bez kyselosti', 'Čokoláda, karamel, ořechy'], 'fruitFull': ['Jemná a vyvážená', 'Jemně sladká, lehce ovocná'], 'fresh': ['Ovocná a svěží', 'Lesní ovoce, citrusy, živé tóny'], 'decaf': ['Bez kofeinu', 'Káva i na večer']},
  'scope': f'{len(products)} zrnkových káv z e-shopu prazirnavoznice.cz ({CHECKED}), ověřená cena a sklad balení 150 g.',
  'excluded': ['cascara', 'degustační a dárkové sety', 'příslušenství'],
  'shop': {'freeShipping': '', 'shippingNote': '', 'freeShippingSource': WEB + '/'},
  'chips': ['Káva do automatu', 'Káva na filtr', 'Co je bez kyselosti?', 'Máte kávu bez kofeinu?'], 'commercialNote': '', 'products': products, 'sets': [], 'held': []}
write_coffee(SLUG, DATA, 'Pražírna Voznice – séria 3 (447 € + 10 €/měs.): katalog z e-shopu prazirnavoznice.cz (' + CHECKED + '). Vygenerováno: tools/s3a/build_voznice.py.')
for p in products: print(p['name'], p['preps'], p['tastes'], p['notes'], p['variants'][0]['price'], p['process'], p['region'], p['decaf'])
