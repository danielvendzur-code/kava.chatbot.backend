"""Séria 3 – Merrybeans (merrybeans.cz, Upgates): produktové stránky a stránky variant e-shopu.
python3 -I tools/s3/build_merrybeans.py RAWDIR   (RAWDIR/pages/*.html, RAWDIR/espresso.html, RAWDIR/filtr.html)"""
import sys, json, re, os, glob, html as H
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import sentences, photo, write_coffee, region_of, process_label
RAW = sys.argv[1]; CHECKED = '2026-11-05'; SLUG = 'merrybeans'; BASE = 'https://www.merrybeans.cz/p/'
def flat(h):
    t = re.sub(r'<script.*?</script>|<style.*?</style>', '', h, flags=re.S); t = re.sub('<[^>]+>', '|', t)
    return re.sub(r'(\|\s*)+', '|', re.sub(r'\s+', ' ', H.unescape(t)))
cat = {k: set(re.findall(r'/p/([a-z0-9-]+)', open(f'{RAW}/{k}.html').read())) for k in ('espresso', 'filtr')}
COUNTRY = {'brazilie': 'Brazílie', 'etiopie': 'Etiopie', 'kena': 'Keňa', 'kolumbie': 'Kolumbie', 'kostarika': 'Kostarika', 'peru': 'Peru', 'uganda': 'Uganda'}
# Chuťová skupina: Merrybeans neuvádí kyselost – skupina je odvozená z „Chuťového profilu“ e-shopu (citrus/rybíz/čaj = svěží; čokoláda/oříšky = čokoládová).
FRESH = r'citr|limet|grep|rybíz|ibiš|šíp|čaj|bergam|jasmín|květ'
CHOCO = r'čokol|oříš|kakao|karamel|med\b|mandl|marcip'
products, report = [], []
for slug in sorted((cat['espresso'] | cat['filtr']) - {'merry-kapsle'}):
    h = open(f'{RAW}/pages/{slug}.html').read(); t = flat(h)
    name = H.unescape(re.search(r'<title>([^<:]+?)\s*::', h).group(1)).strip()
    par = dict(re.findall(r'\|(Odrůda kávovníku|Nadmořská výška|Metoda zpracování|Chuťový profil|Farmář)\|([^|]+)', t.split('|Parametry|', 1)[1] if '|Parametry|' in t else ''))
    popis = re.search(r'\|Popis\|(.+?)\|(?:Původ|Příprava|Parametry)\|', t)
    prip = re.search(r'\|Příprava\|(.+?)\|(?:Parametry|Vše čerstvě)', t)
    notes = [n.strip() for n in par.get('Chuťový profil', '').split(',') if n.strip()]
    variants = []
    for f in sorted(glob.glob(f'{RAW}/pages/{slug}_*.html')):
        vh = open(f).read(); vt = flat(vh)
        g = re.search(r'- Balení: (\d+)\s*(g|kg)', vh); pr = re.search(r'<meta itemprop="price" content="(\d+)"', vh)
        if not g or not pr: continue
        grams = int(g.group(1)) * (1000 if g.group(2) == 'kg' else 1)
        sold_out = bool(re.search(r'Není skladem|Vyprodáno|Momentálně nedostupné', vt))
        if sold_out or 'Do košíku' not in vt: continue
        variants.append({'grams': grams, 'grind': 'zrnková', 'price': int(pr.group(1)), 'url': BASE + slug + '/' + f.rsplit('_', 1)[1][:-5], 'available': True,
                         'stock': 'Skladem' if '|Skladem|' in vt else 'objednatelné (tlačítko „Do košíku“)', 'verifiedAt': CHECKED, 'source': 'stránka varianty v e-shopu merrybeans.cz (' + CHECKED + ')'})
    variants.sort(key=lambda v: v['grams'])
    if not variants or not notes: report.append(('VYRADENÉ', name, len(variants), notes)); continue
    nt = ' '.join(notes).lower()
    decaf = 'decaf' in slug
    # rozhoduje první (hlavní) tón chuťového profilu; čokoládová jen když převažují čokoládové tóny
    first = notes[0].lower()
    nch = sum(bool(re.search(CHOCO, n.lower())) for n in notes); nfr = sum(bool(re.search(FRESH, n.lower())) for n in notes)
    taste = 'fresh' if re.search(FRESH, first) else 'choco' if re.search(CHOCO, first) and nch * 2 >= len(notes) else 'fruitFull'
    preps = (['espresso'] if slug in cat['espresso'] else []) + (['filter'] if slug in cat['filtr'] else [])
    country = COUNTRY.get(slug.split('-')[0])
    og = re.search(r'og:image" content="([^"]+)', h)
    products.append({'id': slug, 'kind': 'coffee', 'name': name, 'url': BASE + slug, 'photo': photo(SLUG, og and og.group(1), slug), 'photoRemote': False, 'currency': 'CZK',
        'available': True, 'decaf': decaf, 'preps': preps,
        'roastLabel': 'pražení na espresso i filtr' if len(preps) == 2 else 'pražení na espresso' if preps == ['espresso'] else 'pražení na filtr',
        'prepText': (prip.group(1).strip() if prip else ', '.join(('espresso' if 'espresso' in p else 'filtr') for p in preps)), 'taste': taste, 'tastes': [taste],
        'tasteSource': 'odvozeno z chuťového profilu e-shopu (pražírna kyselost neuvádí)', 'notes': notes,
        'origin': ' · '.join(x for x in [country, par.get('Farmář')] if x), 'region': 'blend' if not country else region_of([country]),
        'process': process_label(par.get('Metoda zpracování')), 'variety': par.get('Odrůda kávovníku'),
        'summary': sentences(popis.group(1) if popis else '', 2), 'priceFrom': variants[0]['price'], 'priceTo': variants[-1]['price'],
        'weights': [v['grams'] for v in variants], 'variants': variants, 'checkedAt': CHECKED,
        'source': {'url': BASE + slug, 'verifiedAt': CHECKED, 'facts': 'Parametry (odrůda, zpracování, chuťový profil), Popis, Příprava; kategorie Káva na espresso / Káva na filtr'}})
    if decaf: products[-1]['decafNote'] = 'Bez kofeinu podle pražírny.'
DATA = {'slug': SLUG, 'lang': 'cs', 'checkedAt': CHECKED, 'beansOnly': True, 'demo': {'heroProductId': 'espresso-blend'},
  'brand': {'name': 'Merrybeans', 'legal': 'Merrybeans s.r.o.', 'place': 'Merrybeans · pražírna výběrové kávy', 'shopUrl': 'https://www.merrybeans.cz/espresso',
            'web': 'https://www.merrybeans.cz/', 'logo': '/assets/s3/merrybeans/logo.png', 'hero': '/assets/s3/merrybeans/espresso-blend.jpg',
            'contact': 'info@merrybeans.cz', 'contactSource': 'https://www.merrybeans.cz/ (patička e-shopu)',
            'theme': {'ink': '#274249', 'brand': '#274249', 'accent': '#c2930a', 'soft': '#f6f1e4', 'paper': '#ffffff'}},
  'tasteLabels': {'choco': ['Čokoládová a oříšková', 'Podle chuťového profilu e-shopu'], 'fruitFull': ['Plná a ovocná', 'Podle chuťového profilu e-shopu'],
                  'fresh': ['Svěží a čajová', 'Citrusy, rybíz, květy – podle e-shopu'], 'decaf': ['Bez kofeinu', 'Káva i na večer']},
  'scope': f'{len(products)} zrnkových káv z kategorií Káva na espresso a Káva na filtr na merrybeans.cz ({CHECKED}), ceny přesných variant balení. Kapsle, cascara, čokolády a příslušenství nejsou ve výběru.',
  'excluded': ['kapsle Merry kapsle', 'cascara, čokolády a oříšky', 'příslušenství a mletí na profesionálním mlýnku (služba)'],
  'shop': {'freeShipping': 'Doprava zdarma nad 950 Kč (podle e-shopu).', 'shippingNote': '', 'freeShippingSource': 'https://www.merrybeans.cz/'},
  'chips': ['Káva do automatu', 'Káva na filtr', 'Máte kávu bez kofeinu?', 'Co je méně kyselé?'], 'commercialNote': '', 'products': products, 'sets': [], 'held': []}
write_coffee(SLUG, DATA, 'Merrybeans – séria 3 (447 € + 10 €/měs.): katalog ze stránek produktů a variant e-shopu merrybeans.cz (' + CHECKED + '). Chuťová skupina odvozená z „Chuťového profilu“. Vygenerováno: tools/s3/build_merrybeans.py.')
for r in report: print(*r)
for p in products: print(p['name'], p['preps'], p['taste'], p['notes'], [(v['grams'], v['price']) for v in p['variants']], p['process'])
