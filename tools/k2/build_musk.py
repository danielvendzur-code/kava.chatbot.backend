"""k2 – katalóg MusK (musk.sk) z primárnych údajov produktových stránok, ktoré 29. 10. 2026 zozbieral majiteľ ukážok
v svojom prehliadači (Cloudflare overenie prešiel sám; nič sa neobchádzalo) – súbor musk.json.
python3 -I tools/k2/build_musk.py RAW/musk.json OUT"""
import sys, json, re

RAW, OUT = sys.argv[1], sys.argv[2]
D = json.load(open(RAW))
CHECKED = D.get('checkedAt', '2026-10-29')
by = {p['slug']: p for p in D['products']}
SALE = re.compile(r'\s*(Dopredaj[^.]*\.|Posledné (kusy|fľašky)[^.]*\.)', re.I)


def desc(p):
    s = SALE.sub('', p.get('shortDescription') or '').strip()
    return re.sub(r'\s*[—–-]\s*(posledné kusy[^.]*|dopredaj)$', '', s, flags=re.I).strip()


def fmt(x):
    return (f'{x:.2f}'.rstrip('0').rstrip('.') if x % 1 else f'{int(x)}').replace('.', ',') + ' €'


rows = {}
def put(slug, cat, kind, facets, role=None, set_=None, name=None, evidence='popis produktu na e-shope'):
    p = by[slug]
    var = (p.get('variants') or [{}])[0]
    price = float(var.get('price') or p['price'])
    vol = (p.get('weightOrVolume') or '').lower().replace(' g', ' g').replace(' ml', ' ml')
    label = (var.get('label') or '').replace('Mydlo bez obalu', 'bez obalu').replace('40g bez obalu', 'bez obalu').strip()
    d = desc(p)
    r = {'id': 'musk-' + slug, 'name': name or p['name'].replace('  ', ' ').strip(), 'url': p['url'], 'priceAmount': price, 'currency': 'EUR', 'price': fmt(price),
         'volume': vol, 'variantLabel': label, 'category': cat, 'kind': kind, 'tags': [], 'photo': p.get('imageUrl'),
         'available': bool(p.get('available')), 'isSample': False, 'description': d, 'reason': d,
         'facets': {'scope': 'set' if set_ else 'single', **facets},
         'source': {'url': p['url'], 'verifiedAt': CHECKED, 'category': p.get('category'), 'stock': p.get('stockText'), 'priceFrom': False,
                    'imageUrl': p.get('imageUrl'), 'suitabilityEvidence': evidence, 'suitabilitySource': 'official product page description'}}
    if p.get('ingredients'): r['inci'] = re.sub(r'^Ingredients:\s*', '', p['ingredients'])
    if role: r['role'] = role
    if set_: r['set'] = set_
    rows[slug] = r
    return r['id']


# ---- Mydlá: najprv vôňa (podľa silíc v popise), potom konkrétne mydlo ----
SOAPS = {
    'none': ['az-na-kozu', 'nezny-dotyk'],  # KÚSOK NEHY mimo výberu: vôňa nie je v popise uvedená
    'floral': ['vona-provence', 'solny-kvet-2', 'ruzova-alej', 'rozkvitnuta-luka', 'mozaika', 'solna-krasa'],
    'citrus': ['mliecna-draha', 'solny-dotyk', 'solna-krystal', 'maly-princ', 'tiene', 'na-vlnach'],
    'herbal': ['pokoj-v-dusi', 'sladke-spomienky', 'zeleny-poklad', 'krivan', 'kolaz', 'solny-vavrin'],
    'fresh': ['pomarancova-sviezost', '9-3-4', 'priliv', 's-lucmi-slnka', 'macko', 'liska'],
    'woody': ['dzentlmen', 'pan-bozsky', 'zeleny-haj', 'strbske-pleso', 'sachmat', 'cierne-zlato'],
}
for scent, slugs in SOAPS.items():
    for s in slugs:
        put(s, 'soap', 'Mydlá', {'scent': scent, 'focus': s})
for s in ['carbicka', 'farbicka', 'tucniak']:
    put(s, 'kids', 'Detské mydlá', {'focus': s})

# ---- Vlasy ----
HAIR = [('jemny-dotyk-tuhy-sampon-na-citlivu-pokozku', ['sensitive']), ('kapitan-pansky-tuhy-sampon-na-podporu-rastu-vlasov', ['growth']),
        ('povzbudenie-tuhy-sampon-pre-podporu-rastu-vlasov', ['growth']), ('laskykvet-tuhy-sampon-na-jemne-vlasy', ['fine']),
        ('nezbednik-tuhy-sampon-proti-lupinam', ['dandruff']), ('svieze-rano-tuhy-sampon-na-mastne-vlasy', ['oily']),
        ('vazna-znamost-tuhy-sampon-na-normalne-vlasy', ['normal']), ('vona-vianoc-tuhy-sampon-s-vianocnou-vonou-2', ['general'])]
for s, need in HAIR:
    nm = re.split(r'\s*-\s*', by[s]['name'], maxsplit=1)
    put(s, 'hair', 'Tuhé šampóny', {'hairNeed': need, 'focus': s}, evidence=('názov a popis: ' + nm[1]) if len(nm) > 1 else 'typ vlasov e-shop neuvádza')
put('vkondicioner-na-denne-pouzitie', 'hair', 'Kondicionéry', {'hairNeed': ['general'], 'focus': 'condDaily'}, evidence='názov: na denné použitie')
put('kondicioner-na-suche-a-poskodene-vlasy', 'hair', 'Kondicionéry', {'hairNeed': ['dry'], 'focus': 'condDry'}, evidence='názov: na suché a poškodené vlasy')

# ---- Pleť ----
OILS = [('avokadovy-olej', 'dry'), ('borakovy-olej', 'dry'), ('mandlovy-olej', 'sensitive'), ('svetlicovy-olej', 'sensitive'),
        ('jojobovy-olej', 'light'), ('konopny-olej', 'light'), ('sipkovy-olej', 'mature'), ('olej-z-malinovych-semien', 'mature'),
        ('arganovy-olej', 'everyday'), ('marhulovy-olej', 'everyday')]
for s, fam in OILS:
    put(s, 'face', 'Kozmetické oleje', {'family': fam, 'focus': s})
for s, fam in [('hydrolat-biela-ruza', 'roseH'), ('kvetova-voda-ruza', 'roseH'), ('hydrolat-harmancek', 'calmH'), ('hydrolat-medovka', 'calmH'),
               ('mydelnicka-drevena-2', 'calmH'), ('hydrolat-slamiha', 'calmH'), ('hydrolat-mata', 'freshH')]:
    put(s, 'face', 'Hydroláty', {'family': fam, 'focus': s})
for s in ['olejove-serum-levandula', 'olejove-serum-medovka', 'olejove-serum-ruza']:
    put(s, 'face', 'Olejové séra', {'focus': s})
for s in ['balzam-na-pery-kava', 'balzam-na-pery-prirodny']:
    put(s, 'face', 'Balzamy na pery', {'focus': s})

# ---- Telo a kúpeľ ----
for s in ['slahane-telove-maslo-levandula', 'slahane-telove-maslo-medovka', 'slahane-telove-maslo-ruza', 'bambucke-maslo-oranicke-nerafinovane']:
    put(s, 'body', 'Telové maslá', {'focus': s})
for s in ['osviezujuci-kupel', 'upokojujuci-kupel', 'sol-do-kupela-vianoce-vo-vani-600g']:
    put(s, 'body', 'Soli do kúpeľa', {'focus': s})

# ---- Doplnky do zostavy ----
for s in ['mydelnicka-soap-lift-prirodna', 'mydelnicka-cipkova', 'mydelnicka-tulipan-biela', 'mydelnicka-drevena-rovna', 'prenoska-na-mydlo-prirodna']:
    put(s, 'soap', 'Mydelničky', {}, role='addon')
for s in ['samponicka-soap-lift-prirodna', 'samponicka-biela', 'samponicka-musk', 'prenoska-na-tuhy-sampon-40g-prirodna']:
    put(s, 'hair', 'Šampóničky', {}, role='addon')

# ---- Darčekové sady (obsah zo stránky sady; bežná cena = súčet zložiek v rovnakom balení, iba keď sú všetky predávané samostatne) ----
def item(line):
    nm, _, var = line.partition('\n')
    for p in D['products']:
        if p['name'].strip().upper() == nm.strip().upper():
            v = next((x for x in p.get('variants') or [] if x.get('label') == var.strip()), None)
            return 'musk-' + p['slug'], float(v['price']) if v else (float(p['price']) if not var.strip() else None)
    return None, None

for slug, who, focus in [('darcekova-sada-damske-mydla', 'her', 'setHer3'), ('darcekova-sada-si-nadherna', 'her', 'setArgan'), ('darcekova-sada-pre-teba', 'her', 'setLavender'),
                         ('darcekova-sada-panske-mydla', 'him', 'setMen'), ('darcekova-sada-rodinne-mydla', 'family', 'setFamily'),
                         ('darcekova-sada-bylinkovych-mydiel', 'lover', 'setHerbal'), ('darcekova-sada-dizajnove-mydla', 'lover', 'setDesign'),
                         ('darcekova-sada-prirodne-mydla', 'lover', 'setNatural'), ('darcekova-sada-nase-oblubene', 'lover', 'setFav'),
                         ('darcekova-sada-pre-najmensich', None, 'setKids')]:
    p = by[slug]; lines = p.get('setContents') or []
    found = [item(l) for l in lines]
    contains = [i for i, _ in found if i]
    names = [l.replace('\n', ' – ').replace('Mydlo v papierovej krabičke', 'v papierovej krabičke').replace('Mydlo bez obalu', 'bez obalu') for l in lines]
    s = {'contains': contains, 'containsNames': names, 'ignoreKeys': ['scent', 'focus', 'forWhom', 'hairNeed', 'family']}
    if all(pr is not None for _, pr in found) and found:
        reg = round(sum(pr for _, pr in found), 2)
        if reg > float(p['price']):
            s['regularPrice'] = reg; s['regularPriceSource'] = 'súčet cien položiek sady v rovnakom balení na e-shope'
    if who:
        put(slug, 'gift', 'Darčekové sady', {'forWhom': who, 'focus': focus}, set_=s)
    else:
        put(slug, 'kids', 'Detské mydlá', {'focus': focus}, set_=s)

for r in rows.values():  # sady môžu obsahovať iba produkty z katalógu
    if r.get('set'): r['set']['contains'] = [i for i in r['set']['contains'] if any(x['id'] == i for x in rows.values())]
out = [r for r in rows.values() if r['available']]
json.dump(out, open(OUT, 'w'), ensure_ascii=False, indent=1)
from collections import Counter
print(len(out), Counter(r['category'] for r in out), 'nedostupné:', [r['name'][:30] for r in rows.values() if not r['available']])
for r in out:
    if r.get('set'): print(r['id'], r['priceAmount'], r['set'].get('regularPrice'), r['set']['contains'])
print('mimo:', sorted(set(by) - set(rows)))
