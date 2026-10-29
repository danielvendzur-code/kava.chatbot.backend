"""k2 – katalóg Moravité (moravite.cz) – iba kozmetika a doplnky k nej. Údaje: WooCommerce Store API (verejný zoznam produktov).
python3 -I tools/k2/build_moravite.py RAW/all.json OUT"""
import sys, json, re, html

RAW, OUT = sys.argv[1], sys.argv[2]
CHECKED = '2026-10-29'
ps = json.load(open(RAW))
T = lambda h: re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', ' ', h or ''))).strip()
by = {T(p['name']): p for p in ps}
BAD = re.compile(r'Kč|objednáv|doprav|Náš tip|recenz|botox|energie|lymfat|není náhodné|toxin|léč', re.I)


def first(p):
    src = T(p.get('short_description')) or T(p.get('description'))
    for x in [x.strip() for x in re.split(r'(?<=[.!?])\s+', src) if x.strip()]:
        if 40 <= len(x) <= 260 and not BAD.search(x): return x
    return ''


rows = {}
def put(name, cat, kind, facets, role=None, variant='', price=None, set_=None, evidence='bez tvrzení o typu pleti'):
    p = by[name]; pr = p['prices']
    amount = float(price if price is not None else pr['price'])
    d = first(p); slug = p['permalink'].rstrip('/').rsplit('/', 1)[-1]
    clean = name.replace(' – ', ' – ')
    r = {'id': 'moravite-' + slug, 'name': clean, 'url': p['permalink'], 'priceAmount': amount, 'currency': 'CZK', 'price': f'{int(amount)} Kč',
         'volume': variant, 'variantLabel': variant, 'category': cat, 'kind': kind, 'tags': [], 'photo': (p.get('images') or [{}])[0].get('src'),
         'available': bool(p.get('is_in_stock')), 'isSample': False, 'description': d, 'reason': d, 'facets': {'scope': 'set' if set_ else 'single', **facets},
         'source': {'url': p['permalink'], 'verifiedAt': CHECKED, 'category': ' > '.join(c['name'] for c in p.get('categories', []) if c['name'] != 'Všechny produkty'),
                    'stock': 'InStock' if p.get('is_in_stock') else 'OutOfStock', 'priceFrom': False, 'imageUrl': (p.get('images') or [{}])[0].get('src'),
                    'suitabilityEvidence': evidence, 'suitabilitySource': 'official product page description'}}
    if role: r['role'] = role
    if set_: r['set'] = set_
    rows[name] = r
    return r['id']


def find(prefix):
    if prefix in by: return prefix
    hits = [n for n in by if n.startswith(prefix)]
    assert len(hits) == 1, (prefix, hits)
    return hits[0]


# ---- Pleť ----
SERUM = put(find('Pleťové sérum'), 'face', 'Séra a krémy', {'focus': 'hyaluron'}, evidence='popis: kyselina hyaluronová a opuncie')
put(find('Vitamínový hydratační pleťový krém'), 'face', 'Séra a krémy', {'focus': 'vitamin'}, evidence='popis: vhodný pro všechny typy pleti')
OPUN = put(find('Pěstící olej Opuncie'), 'face', 'Pěstící oleje', {'focus': 'opuntia'}, variant='10 ml', evidence='popis: pro všechny typy pleti')
VAN = put(find('Pěstící olej Vanilkový rituál'), 'face', 'Pěstící oleje', {'focus': 'vanilla'}, variant='10 ml', price=239, evidence='popis: i pro citlivou pokožku')
ROLLER = put(find('Masážní váleček růženín'), 'face', 'Masážní pomůcky', {}, role='addon')
GUA = put(find('GUA-SHA růženín'), 'face', 'Masážní pomůcky', {}, role='addon')
SPICE = put(find('Masážní špice'), 'face', 'Masážní pomůcky', {}, role='addon', variant='růženín', price=299)
KONJ = put(find('Konjac houbička pleťová'), 'face', 'Masážní pomůcky', {}, role='addon', variant='Natural', price=149)
put(find('Dárková sada pěstících olejů'), 'face', 'Pěstící oleje', {'focus': 'oilSet'},
    set_={'contains': [OPUN, VAN], 'containsNames': ['Pěstící olej Opuncie 10 ml', 'Pěstící olej Vanilkový rituál 10 ml'], 'regularPrice': 638,
          'ignoreKeys': ['focus'], 'regularPriceSource': 'součet cen olejů Opuncie 10 ml (399 Kč) a Vanilkový rituál 10 ml (239 Kč) na e-shopu'})
put(find('Masážní sada malá'), 'face', 'Masážní rituál', {'focus': 'small'},
    set_={'contains': [OPUN, VAN, ROLLER], 'containsNames': ['Pěstící olej Vanilkový rituál 10 ml', 'Pěstící olej Opuncie 10 ml', 'Masážní váleček růženín']})
put(find('Masážní sada velká'), 'face', 'Masážní rituál', {'focus': 'large'}, variant='špice růženín',
    set_={'contains': [OPUN, VAN, ROLLER, SPICE, GUA], 'containsNames': ['Pěstící olej Vanilkový rituál 10 ml', 'Pěstící olej Opuncie 10 ml', 'Masážní váleček růženín', 'Masážní špice', 'Gua Sha růženín']})
put(find('Gua Sha jasan No.1'), 'face', 'Masážní rituál', {'focus': 'guasha'})
# samostatná gua sha a váleček sú vybrateľné aj v kroku „masážní rituál“ – ako doplnok ostávajú v zostave
rows[find('Gua Sha jasan No.1')]['name'] = 'Gua Sha jasan (dřevo)'

# ---- Mýdla ----
for pre, fam, f in [('Mýdlo Aktivní uhlí', 'deep', 'charcoal'), ('Mýdlo Himalájská sůl a rakytník', 'deep', 'saltBuckthorn'),
                    ('Mýdlo Měsíček lékařský', 'gentle', 'calendula'), ('Mýdlo Probiotický jogurt', 'gentle', 'yogurt'),
                    ('Mýdlo Extra syrovátka a med', 'gentle', 'honey'), ('Mýdlo Syrovátka', 'gentle', 'whey')]:
    put(find(pre), 'soap', 'Mýdla', {'family': fam, 'focus': f})
put(find('Dárkový balíček pro muže'), 'soap', 'Mýdla', {'family': 'deep', 'focus': 'men'},
    set_={'contains': [VAN], 'containsNames': ['Pěstící olej Vanilkový rituál 10 ml', 'Mýdlo Aktivní uhlí a pačuli']})
put(find('Dřevěná mýdlenka'), 'soap', 'Doplňky', {}, role='addon')
put(find('Keramická mýdlenka'), 'soap', 'Doplňky', {}, role='addon', variant='dle výběru')

# ---- Ruce a tělo ----
put(find('Krém na ruce '), 'body', 'Krémy na ruce', {'focus': 'hyaluron'})
put(find('Vitamínový hydratační krém na ruce'), 'body', 'Krémy na ruce', {'focus': 'vitamin'})
put(find('Vitamínový sprchový gel'), 'body', 'Sprchový gel a šampon', {'focus': 'citrus'}, variant='skleněná lahev 240 ml', price=332)

# ---- Koupel ----
for pre, fam, f, var, price in [('Koupelová sůl Květinová', 'relax', 'flowers', 'skleněná doza 355 g', 299), ('Koupelová sůl Měsíček a mandarinka', 'relax', 'calendulaMandarin', 'papírový sáček 200 g', 85),
                                ('Koupelová sůl Punč', 'warm', 'punch', 'papírový sáček 200 g', 85), ('Koupelová sůl Matcha a grep', 'warm', 'matcha', 'papírový sáček 200 g', 85)]:
    put(find(pre), 'bath', 'Koupelové soli', {'focus': f}, variant=var, price=price)

out = [r for r in rows.values() if r['available']]
json.dump(out, open(OUT, 'w'), ensure_ascii=False, indent=1)
from collections import Counter
print(len(out), Counter(r['category'] for r in out), 'nedostupné:', [r['name'][:30] for r in rows.values() if not r['available']])
for r in out: print(r['id'], r['priceAmount'], r['kind'], r['facets'], '|', r['description'][:90])
