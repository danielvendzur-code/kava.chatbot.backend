"""k2 – katalóg libebit (libebit.cz) z overených údajov: JSON-LD variantov (cache stránok), kategórie e-shopu podľa typu pleti/vlasov.
python3 -I tools/k2/build_libebit.py RAW OUT  (RAW = priečinok s products.json, cats.json, variants.json)"""
import sys, json, re

RAW, OUT = sys.argv[1], sys.argv[2]
CHECKED = '2026-10-29'
B = 'https://www.libebit.cz/'
pages = {p['url']: p for p in json.load(open(f'{RAW}/products.json'))}
cats = json.load(open(f'{RAW}/cats.json'))
variants = {v['url'].split('#')[0]: v for v in json.load(open(f'{RAW}/variants.json'))}
slug = lambda u: u.rstrip('/').rsplit('/', 1)[-1]
C = lambda k: set(cats[B + k])
DRY, OILY = C('plet-sussi-sucha-reaktivni-citliva'), C('plet-smisena-mastnejsi-problematicka')
H_OILY, H_DANDRUFF, H_DRY = C('vlasy-rychle-se-mastici-jemne-bez-objemu'), C('pokozka-s-lupy-a/nebo-svediva'), C('vlasy-suche-barvene-vlnite')
SKIP_VARIANT = re.compile(r'\bmini\b|cestovní|vzork|1 litr|200 ml$', re.I)


def offer(u):
    """Presný variant: prvý bežný (nie mini, cestovný, litrový ani 200 ml mlha)."""
    v = variants[u]['variants']
    if len(v) == 1 and v[0][0] is None:
        return None, float(v[0][1]), True
    named = [x for x in v if x[0]]
    if u.endswith(('balicek-pro-peci-o-suchou-citlivou-reaktivni-plet', 'balicek-pro-peci-o-normalni-smisenou-az-problematickou-plet')):
        return 'varianta KLASIK', float(v[0][1]), v[0][2] == 'InStock'  # poradie na stránke: KLASIK, MINIMALISTA, MAXI
    pick = next((x for x in named if not SKIP_VARIANT.search(x[0])), named[0])
    label = pick[0].replace(variants[u]['name'].strip(), '').strip(' -')
    return label, float(pick[1]), pick[2] == 'InStock'


def text(u):
    t = pages[u]['pageText']; i = t.find('Podrobný popis a složení', t.find('Podrobný popis a složení') + 10)
    body = t[i + 25:] if i > 0 else (pages[u].get('metaDescription') or '')
    sents = [x.strip() for x in re.split(r'(?<=[.!?])\s+', body) if x.strip()]
    good = [x for x in sents if 50 <= len(x) <= 260 and not re.search(r'Kč|DO KOŠÍKU|hodnocení', x)]
    return good[0] if good else (pages[u].get('metaDescription') or '')[:240]


def name(u):
    return re.sub(r'\s+', ' ', variants[u]['name'] or re.sub(r'\s*\|.*$', '', pages[u]['title'])).strip()


rows = {}
def put(u, cat, kind, facets, evidence='bez tvrzení o typu pleti', role=None):
    label, price, avail = offer(u)
    if not label:
        sizes = set(re.findall(r'\b(\d+ ?(?:ml|g))\b', pages[u]['pageText']))
        if len(sizes) == 1: label = sizes.pop()
    p = pages[u]; d = text(u); p_img = p.get('ogImage')
    r = {'id': 'libebit-' + slug(u), 'name': name(u), 'url': u, 'priceAmount': price, 'currency': 'CZK', 'price': f'{int(price)} Kč',
         'volume': label or '', 'variantLabel': label or '', 'category': cat, 'kind': kind, 'tags': [], 'photo': p_img, 'available': avail, 'isSample': False,
         'description': d, 'reason': d, 'facets': facets,
         'source': {'url': u, 'verifiedAt': CHECKED, 'category': ' > '.join((p.get('breadcrumb') or [])[1:-1]), 'stock': 'InStock' if avail else 'OutOfStock',
                    'priceFrom': False, 'variant': label or '', 'imageUrl': p_img, 'suitabilityEvidence': evidence, 'suitabilitySource': 'official product page description'}}
    if role: r['role'] = role
    rows[u] = r
    return r


SMALL = re.compile(r'\bmini\b|výhodné balení|velké balení|rodinné balení|\bmaxi\b|ve skle', re.I)
FACE_KIND = [(r'mýdlo', 'Mýdla'), (r'pudr|hydrofilní', 'Čisticí pudry a oleje'), (r'mlha', 'Pleťové mlhy'), (r'balzám na rty|balzám', 'Balzámy na rty'), (r'krém', 'Pleťové krémy'), (r'olej', 'Pěsticí oleje')]
FOCUS = [('ROZMARÝN', 'rosemary'), ('YLANG', 'ylang'), ('LEMONGRASS', 'lemongrass'), ('LEVANDULE', 'lavender'), ('TEA TREE', 'teatree'), ('GERANIUM', 'geranium'),
         ('SÍLA', 'mistSila'), ('POHYB', 'mistPohyb'), ('KLID', 'mistKlid'), ('RŮŽOVÝ JÍL', 'pinkClay'), ('ZELENÝ JÍL', 'greenClay'), ('MODRÝ JÍL', 'blueClay'), ('OVES', 'oatNeem'),
         ('syrovátkou', 'whey'), ('uhelné', 'charcoal'), ('DĚTSK', 'kids'), ('jemný', 'gentle'), ('svěží', 'fresh'), ('konopn', 'hemp'), ('SIMMON', 'simmon'), ('LINUM', 'linum'),
         ('MINT', 'mint'), ('sváteční', 'festive')]
focus = lambda n: next((v for k, v in FOCUS if k.lower() in n.lower()), None)
SKIN_TXT = {'dry': 'sušší, suchá, reaktivní, citlivá', 'oily': 'smíšená, mastnější, problematická'}

for u in cats[B + 'pletova']:
    if u in rows: continue
    n = name(u)
    if 'Balíč' in n: continue
    if 'konopný balzám' in n and 'rty' not in n: continue  # telová starostlivosť (mazání)
    kind = next(k for rx, k in FACE_KIND if re.search(rx, n, re.I))
    skins = [s for s, S in (('dry', DRY), ('oily', OILY)) if u in S]
    f = {'skin': skins, 'scope': 'single'}
    fo = focus(n)
    if fo: f['focus'] = fo
    put(u, 'face', kind, f, 'kategorie e-shopu: pleť ' + ' / '.join(SKIN_TXT[s] for s in skins), role='addon' if SMALL.search(n) else None)

HAIR_KIND = [(r'kondicionér', 'Kondicionéry'), (r'sprchový šampon', 'Sprchové šampony na tělo i vlasy'), (r'šampon', 'Bylinné šampony')]
HFOCUS = [('AMLA', 'amla'), ('NEEM', 'neem'), ('REETHA', 'reetha'), ('SHIKAKAI', 'shikakai'), ('ALOE', 'aloe'), ('TULSI', 'tulsi'), ('MORINGA', 'moringa'),
          ('IBIŠEK', 'hibiscus'), ('pačuli', 'patchouli'), ('rozmarýn', 'rosemary')]
for u in cats[B + 'vlasova']:
    if u in rows: continue
    n = name(u)
    kind = next((k for rx, k in HAIR_KIND if re.search(rx, n, re.I)), None)
    if not kind:
        if 'lufy' in n.lower() or 'lufa' in n.lower(): put(u, 'hair', 'Doplňky', {}, role='addon')
        continue
    if 'sáček' in n.lower(): continue
    needs = [s for s, S in (('oily', H_OILY), ('dandruff', H_DANDRUFF), ('dry', H_DRY)) if u in S]
    put(u, 'hair', kind, {'hairNeed': needs, 'scope': 'single', 'focus': next(v for k, v in HFOCUS if k.lower() in n.lower())},
        'kategorie e-shopu: vlasy ' + ', '.join({'oily': 'rychle se mastící, jemné', 'dandruff': 's lupy a/nebo svědivá pokožka', 'dry': 'suché, barvené, vlnité'}[s] for s in needs))

BODY_KIND = [(r'deodorant', 'Deodoranty'), (r'peelingový kondicionér', 'Peelingové kondicionéry'), (r'tekuté mýdlo', 'Tekutá mýdla'), (r'máslo', 'Másla a balzámy'),
             (r'konopný balzám|konopný krém|bambuckého', 'Másla a balzámy'), (r'po hol', 'Po holení')]
BFOCUS = [('DAVAO', 'davao'), ('YUNNAN', 'yunnan'), ('HARARE', 'harare'), ('unisex', 'unisex'), ('pro muže', 'men'), ('PRO MUŽE', 'men'), ('pro ženy', 'women'),
          ('litsea', 'litsea'), ('bylinky', 'herbs'), ('skořice', 'cinnamon'), ('ylang', 'ylang'), ('konopným', 'hemp'), ('meduň', 'melissa'),
          ('máslo', 'butter'), ('balzám', 'hempBalm'), ('krém', 'hempCream')]
for u in cats[B + 'telova'] + cats[B + 'deodoranty']:
    if u in rows: continue
    n = name(u)
    kind = next((k for rx, k in BODY_KIND if re.search(rx, n, re.I)), None)
    if not kind: continue
    f = {'scope': 'single', 'focus': next((v for k, v in BFOCUS if k.lower() in n.lower()), None)}
    if kind == 'Deodoranty': f['deoType'] = 'solid' if 'tuhý' in n.lower() else 'cream'
    put(u, 'body', kind, f, role='addon' if SMALL.search(n) else None)

# ---- Balíčky pleťovej starostlivosti (obsah a 15 % zľava uvedené na stránke balíčka) ----
find = lambda pat: next(u for u, r in rows.items() if re.search(pat, r['name'], re.I))
PACKS = {
    B + 'balicek-pro-peci-o-suchou-citlivou-reaktivni-plet': (['dry'], [r'pudr YLANG', r'mlha KLID', r'krém JEMNÝ\s*$', r'LINUM mini']),
    B + 'balicek-pro-peci-o-normalni-smisenou-az-problematickou-plet': (['oily'], [r'pudr ROZMARÝN', r'mlha POHYB', r'krém SVĚŽÍ\s*$', r'SIMMON mini']),
}
for u, (skins, parts) in PACKS.items():
    r = put(u, 'face', 'Balíčky pleťové péče', {'skin': skins, 'scope': 'set'}, 'balíček z kategorie e-shopu: pleť ' + SKIN_TXT[skins[0]])
    ids = [find(p) for p in parts]
    reg = sum(rows[i]['priceAmount'] for i in ids)
    r['set'] = {'contains': [rows[i]['id'] for i in ids],
                'containsNames': [rows[i]['name'] + (' (' + rows[i]['volume'] + ')' if rows[i]['volume'] else '') for i in ids],
                'regularPrice': reg, 'regularPriceSource': 'součet cen produktů v e-shopu; stránka balíčku uvádí „o 15 % levněji než jednotlivé produkty“ (' + CHECKED + ')'}

out = [r for r in rows.values() if r['available'] or r.get('role') == 'addon']
json.dump(out, open(OUT, 'w'), ensure_ascii=False, indent=1)
from collections import Counter
print(len(out), 'nedostupné:', [r['name'] for r in rows.values() if r not in out])
print(Counter(r['category'] for r in out if r.get('role') != 'addon'), Counter(r['kind'] for r in out if r.get('role') != 'addon'))
for r in out:
    if r.get('set'): print(r['name'], r['priceAmount'], r['set'])
