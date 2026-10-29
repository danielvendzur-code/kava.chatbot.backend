"""k2 – katalóg NATURINKA (naturinka.cz) z overeného textu produktových stránok (názov, kategória e-shopu, varianty s cenou, popis).
python3 -I tools/k2/build_naturinka.py RAW OUT   (RAW = priečinok s products.json; parsuje sa tu)
Cena = prvý variant na stránke (presná cena aj s veľkosťou), nikdy „od“."""
import sys, json, re, html

RAW, OUT = sys.argv[1], sys.argv[2]
CHECKED = '2026-10-29'
pages = json.load(open(f'{RAW}/products.json'))
CATS = 'Mýdla|Šampony|Šampukony|Kondicionery|Deodoranty|Koupelové soli|Peelingy|Speciální masti|Tělová másla|Balzámy na pleť|Balzámy na rty|Hydroláty|Pleťové oleje|Esenciální oleje|Výživové oleje|Dárkové krabičky|Mýdlenky|Dárkové poukazy|Tašky|Med a svíčky|Praní|Obaly a příslušenství|Péče o mazlíčky'


def parse(p):
    t = p['pageText']; i = t.rfind('Obaly a příslušenství '); body = t[i + 22:] if i >= 0 else t
    for stop in ('Související produkty', 'Napište nám', 'Mapa webu'):
        j = body.find(stop); body = body[:j] if j > 0 else body
    m = re.match(rf'(.+?) ({CATS}) ', body)
    if not m: return None
    name, cat = m.group(1).strip(), m.group(2)
    rest = body[m.end():]
    head, _, desc = rest.partition('obecný popis')
    chunks = [c for c in head.split('Koupit') if 'Kč' in c]
    variants = []
    for c in chunks:
        size = re.search(r'(\d+(?:[.,]\d+)?\s?(?:g|ml|kg|l|ks))\b(?:\s*/\s*\d+\s?(?:g|ml))?', c)
        prices = re.findall(r'(\d[\d\s]*)\s*Kč(?!\s*/)', c)
        if size and prices: variants.append((size.group(0).strip(), int(prices[-1].replace(' ', ''))))
    desc = desc.strip()
    typ = desc.split('|', 1)[0].strip() if '|' in desc[:120] else ''
    scent = (re.search(r'Vůně:\s*(.+?)(?:\s+(?:Způsob|Hlavní|Obsah|Obsažené|INCI|Ingredients)\b|\.|$)', desc) or [None, ''])[1].strip()
    return {'url': p['url'], 'name': name, 'cat': cat, 'variants': variants, 'type': typ, 'scent': scent, 'desc': desc}


items = {x['name']: x for x in (parse(p) for p in pages) if x}
IMAGES = json.load(open(f'{RAW}/images.json'))


BAD = re.compile(r'± ?10|sedavého|Při zasažení|Zamezte|Skladujte|kloub|neduz|protira|Při barvených|Vůně:', re.I)


def first(d):
    d = re.sub(r'^DERMATOLOGICKY TESTOVÁNO\s*', '', d)
    parts = [x.strip() for x in re.split(r'(?<=[.!?|])\s+', d) if x.strip()]
    for x in parts:
        x = x.rstrip('|').strip()
        if 25 <= len(x) <= 260 and not BAD.search(x): return x
    return (parts[0] if parts else '')[:200]


rows = {}
def put(name, cat, kind, facets, evidence='bez tvrzení o typu pleti či vlasů', role=None):
    it = items[name]; assert it['variants'], ('bez ceny', name)
    size, price = it['variants'][0]
    slug = it['url'].rstrip('/').rsplit('/', 1)[-1]
    d = first(it['desc'])
    r = {'id': 'naturinka-' + re.sub(r'[^a-z0-9-]', '', html.unescape(slug).encode('ascii', 'ignore').decode()), 'name': name, 'url': it['url'], 'priceAmount': float(price),
         'currency': 'CZK', 'price': f'{price} Kč', 'volume': size, 'variantLabel': size, 'category': cat, 'kind': kind, 'tags': [], 'photo': IMAGES.get(it['url']),
         'available': True, 'isSample': False, 'description': d, 'reason': d, 'facets': facets,
         'source': {'url': it['url'], 'verifiedAt': CHECKED, 'category': it['cat'], 'stock': 'InStock', 'priceFrom': False, 'variant': size + ' (první varianta na stránce)', 'imageUrl': IMAGES.get(it['url']),
                    'suitabilityEvidence': evidence, 'suitabilitySource': 'official product page description'}}
    if role: r['role'] = role
    rows[name] = r
    return r


# ---- Mýdla podľa charakteru (vôňa a typ z popisu) ----
SOAPS = {
    'gentle': ['Kozí mýdlo', 'Olivové mýdlo', 'Solné mýdlo', 'Karité s aktivním uhlím', 'Měsíčkové mýdlo', 'Rakytníkové mýdlo'],
    'herbal': ['Rozmarýnové mýdlo', 'Čajovníkové mýdlo', 'Dubová kůra mýdlo', 'Heřmánkové mýdlo', 'Bambi mýdlo', 'Konopné mýdlo'],
    'earthy': ['Santalové mýdlo', 'Jalovcové mýdlo', 'Earl Grey mýdlo', 'Nimbatic mýdlo', 'Nimbové mýdlo'],
    'fresh': ['Lemongrass mýdlo', 'Meduňkové mýdlo', 'Levandulové mýdlo', 'Muškátové mýdlo'],
    'spicy': ['Propolisové mýdlo', 'Hřebíčkové mýdlo', 'Mateřídouškové mýdlo'],
    'peeling': ['Kávové peelingové mýdlo', 'Vanilkové mýdlo', 'Vločkomedové mýdlo'],
}
FOCUS = {  # názov → kľúč fotky/vône
    'Kozí mýdlo': 'goat', 'Olivové mýdlo': 'olive', 'Solné mýdlo': 'salt', 'Karité s aktivním uhlím': 'charcoal', 'Měsíčkové mýdlo': 'calendula', 'Rakytníkové mýdlo': 'buckthorn',
    'Rozmarýnové mýdlo': 'rosemary', 'Čajovníkové mýdlo': 'teatree', 'Dubová kůra mýdlo': 'oak', 'Heřmánkové mýdlo': 'chamomile', 'Bambi mýdlo': 'bambi', 'Konopné mýdlo': 'hemp',
    'Santalové mýdlo': 'sandal', 'Jalovcové mýdlo': 'juniper', 'Earl Grey mýdlo': 'earlgrey', 'Nimbatic mýdlo': 'nimbatic', 'Nimbové mýdlo': 'neem',
    'Lemongrass mýdlo': 'lemongrass', 'Meduňkové mýdlo': 'melissa', 'Levandulové mýdlo': 'lavender', 'Muškátové mýdlo': 'geranium',
    'Propolisové mýdlo': 'propolis', 'Hřebíčkové mýdlo': 'clove', 'Mateřídouškové mýdlo': 'thyme',
    'Kávové peelingové mýdlo': 'coffee', 'Vanilkové mýdlo': 'vanilla', 'Vločkomedové mýdlo': 'oatHoney',
}
for fam, names in SOAPS.items():
    for n in names: put(n, 'body', 'Tuhá mýdla', {'scope': 'single', 'family': fam, 'focus': FOCUS[n]})

for n, f in {'Velvet tělové máslo': 'rose', 'Švestkové máslo': 'plum', 'Lipové máslo': 'linden', 'Vanilkové máslo': 'vanilla', 'Meruňkové máslo': 'apricot', 'Jasmínové máslo': 'jasmine'}.items():
    put(n, 'body', 'Tělová másla', {'scope': 'single', 'focus': f})
for n, f in {'Vanilka / levandule solný tělový peeling': 'lavender', 'Meduňka solný tělový peeling': 'melissa', 'Káva / pomeranč solný tělový peeling': 'coffee', 'Eukalyptus / máta solný tělový peeling': 'eucalyptus'}.items():
    put(n, 'body', 'Solné peelingy', {'scope': 'single', 'focus': f})
for n, f in {'Koupelová sůl Lemongrass/Meduňka': 'lemongrass', 'Koupelová sůl Růže': 'rose', 'Koupelová sůl Levandule': 'lavender'}.items():
    put(n, 'body', 'Koupelové soli', {'scope': 'single', 'focus': f})
for n, f in {'Meduňka deodorant': 'melissa', 'Santal / pačuli / geranium deodorant': 'sandal', 'Bergamot / máta deodorant': 'mint', 'Levandule / vanilka deodorant': 'lavender',
             'Velvet deodorant': 'rose', 'Lípa deodorant': 'linden'}.items():
    put(n, 'body', 'Deodoranty', {'scope': 'single', 'focus': f})

# ---- Pleť ----
for n, f in {'Švestka pleťový balzám': 'plum', 'Levandule pleťový balzám': 'lavender', 'Lípa pleťový balzám': 'linden', 'Velvet pleťový balzám': 'rose',
             'Bambi pleťový balzám': 'bambi', 'Winter pleťový balzám': 'winter'}.items():
    put(n, 'face', 'Pleťové balzámy', {'scope': 'single', 'focus': f})
for n, f in {'100% Makový olej': 'poppy', '100 % Švestkový olej': 'plum', 'Růžový olej': 'rose', '100% Meruňkový olej': 'apricot', 'Lipový olej': 'linden', '100% Arganový olej BIO': 'argan'}.items():
    put(n, 'face', 'Pleťové oleje', {'scope': 'single', 'focus': f})
for n, f in {'100% hydrolát Rozmarýn': 'rosemary', '100% květová voda Levandule': 'lavender'}.items():
    if items[n]['variants']: put(n, 'face', 'Hydroláty', {'scope': 'single', 'focus': f})
for n, f in {'Vanilka balzám na rty 5ml': 'vanilla', 'Heřmánek balzám na rty 5ml': 'chamomile', 'Rakytník balzám na rty 5ml': 'buckthorn', 'Natur balzám na rty 5ml': 'natur'}.items():
    put(n, 'face', 'Balzámy na rty', {'scope': 'single', 'focus': f})

# ---- Vlasy (potreba podľa popisu produktu) ----
HAIR = {
    'Heřmánkový šampon': (['light'], 'chamomile', '„Pro světlé a ještě světlejší vlasy“'), 'Earl Grey šampon': (['dark'], 'earlgrey', '„Pro tmavé a ještě tmavší vlasy“'),
    'Kávový šampon': (['dark'], 'coffee', '„pro tmavé a ještě tmavší vlasy“'), 'Mateřídouškový šampon': (['oily'], 'thyme', '„Pro mastné vlasy“'),
    'Levandulový šampon': (['oily'], 'lavender', '„Pro normální až mastné vlasy“'), 'Březový šampon': (['oily'], 'birch', '„pro normální až mastné vlasy“'),
    'Muškátový šampon': (['oily'], 'geranium', '„Pro normální až mastné vlasy“'), 'Kopřivový šampon': (['oily'], 'nettle', '„pro normální až mastné vlasy“'),
    'Rakytníkový šampon': (['dry'], 'buckthorn', '„Pro suché a poškozené vlasy“'),
    'Nimbový šampon': (['scalp'], 'neem', '„zklidňující svědivou a šupinatou pokožku hlavy“'), 'Nimbatic šampon': (['scalp'], 'nimbatic', '„zklidňuje svědivou a šupinatou pokožku hlavy“'),
    'Konopný šampon': (['scalp'], 'hemp', '„zklidňuje svědivou a šupinatou pokožku hlavy“'),
    'Lemongrass šampon': (['all'], 'lemongrass', '„pro všechny typy vlasů“'), 'Chmelový šampon': (['all'], 'hops', '„pro všechny typy vlasů“'), 'Santalový šampon': (['all'], 'sandal', '„Pro všechny typy vlasů“'),
}
for n, (need, f, ev) in HAIR.items(): put(n, 'hair', 'Tuhé šampony', {'hairNeed': need, 'scope': 'single', 'focus': f}, 'popis produktu: ' + ev)
for n, f in {'Unicorn šampukon': 'vanilla', 'Lemongrass šampukon': 'lemongrass', 'Lipový šampukon': 'linden', 'Levandulový šampukon': 'lavender', 'Heřmánkový šampukon': 'chamomile'}.items():
    put(n, 'hair', 'Šampukony', {'hairNeed': ['all'], 'scope': 'single', 'focus': f}, 'popis produktu: „pro všechny typy vlasů“')
COND = {'Santal, Pačuli, Geranium kondicionér': (['dry'], 'sandal', 'popis: snižuje lámavost, hydratace a regenerace'),
        'Růže kondicionér': (['dry'], 'rose', 'popis: „pro suché a poškozené vlasy“'),
        'Lípa kondicionér': (['all', 'dry'], 'linden', 'popis: „pro všechny typy vlasů, zejména pak pro sušší, suché a poškozené“'),
        'Levandule, Litsea cubeba kondicionér': (['all'], 'lavender', 'popis: výživa a hydratace vlasů'),
        'Cypřiš, Levandule, Citron kondicionér': (['dry'], 'cypress', 'popis: „zejména pak pro vlnité, kudrnaté, lámavé, suché“')}
for n, (need, f, ev) in COND.items(): put(n, 'hair', 'Kondicionéry', {'hairNeed': need, 'scope': 'single', 'focus': f}, ev)

# ---- Pre mužov ----
for n, k, f in [('Pánské mýdlo', 'Mýdlo a šampon', 'soap'), ('Pánský šampon', 'Mýdlo a šampon', 'shampoo'), ('Pánský šampukon', 'Mýdlo a šampon', 'shampukon'),
                ('Pánský deodorant', 'Deodorant a balzám', 'deo'), ('Pánský pleťový balzám', 'Deodorant a balzám', 'balm')]:
    put(n, 'men', k, {'scope': 'single', 'focus': f})

# ---- Doplnok k mydlám ----
mm = items['Dřevěná mýdlenka']
if not mm['variants']:
    pt = next(p['pageText'] for p in pages if p['url'] == mm['url'])
    m = re.search(r'Dřevěná mýdlenka\s+(\d+)\s*Kč', pt) or re.search(r'(\d+)\s*Kč(?!\s*/)', pt[pt.rfind('Obaly a příslušenství'):])
    if m: mm['variants'] = [('malá', int(m.group(1)))]
put_ok = bool(items['Dřevěná mýdlenka']['variants'])
if put_ok:
    r = put('Dřevěná mýdlenka', 'body', 'Doplňky', {}, role='addon')
    r['description'] = r['reason'] = 'Dřevěná mýdlenka z nabídky NATURINKA (malá).'

out = list(rows.values())
json.dump(out, open(OUT, 'w'), ensure_ascii=False, indent=1)
from collections import Counter
print(len(out), Counter(r['category'] for r in out), 'mydelnicka:', put_ok)
print([n for n, it in items.items() if not it['variants']])
