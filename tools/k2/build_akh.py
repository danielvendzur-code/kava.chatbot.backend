"""k2 – katalóg AKH (aromakh.cz) z overených údajov: JSON-LD produktových stránok a kategórie e-shopu.
python3 -I tools/k2/build_akh.py RAW OUT  (RAW = priečinok s products-all.json a cats.json)
Pleť: iba produkty, ktoré AKH sama zaraďuje do kategórií „Dle typu pleti“ (suchá, normální, smíšená, mastná)."""
import sys, json, re

RAW, OUT = sys.argv[1], sys.argv[2]
CHECKED = '2026-10-29'
ps = json.load(open(f'{RAW}/products-all.json'))
cats = json.load(open(f'{RAW}/cats.json'))
by = {p['url']: p for p in ps}
SKIN = {'sucha': 'dry', 'normalni': 'normal', 'smisena': 'combination', 'mastna': 'oily'}
slug = lambda u: u.rstrip('/').rsplit('/', 1)[-1]
BAD = re.compile(r'balení \d+ ?ml je dodáváno|dávkovač|objednáv|vzork|doprav', re.I)


def first(t):
    sents = [x.strip().lstrip('✨ ').strip() for x in re.split(r'(?<=[.!?])\s+', t or '') if x.strip()]
    good = [x for x in sents if 50 <= len(x) <= 280 and not BAD.search(x)]
    return good[0] if good else (sents[0][:280] if sents else '')


def row(u, cat, kind, facets, evidence='bez tvrzení o typu pleti'):
    p = by[u]; o = p['offers'][0]; price = round(float(o['price']))
    vol = (re.search(r'(\d+\s?(?:ml|g))\b', p.get('title') or '') or [None, ''])[1]
    desc = first(p.get('metaDescription')) or first(p.get('description'))
    return {'id': 'akh-' + slug(u), 'name': re.sub(r'\s+', ' ', p['name']).strip(), 'url': u, 'priceAmount': float(price), 'currency': 'CZK', 'price': f'{price} Kč',
            'volume': vol, 'variantLabel': '', 'category': cat, 'kind': kind, 'tags': [], 'photo': p.get('image') or p.get('ogImage'),
            'available': o.get('availability') == 'InStock', 'isSample': False, 'description': desc, 'reason': desc, 'facets': facets,
            'source': {'url': u, 'verifiedAt': CHECKED, 'category': ' > '.join((p.get('breadcrumb') or [])[1:-1]), 'stock': o.get('availability'), 'priceFrom': False,
                       'imageUrl': p.get('image'), 'suitabilityEvidence': evidence, 'suitabilitySource': 'official product page description'}}


rows = {}
# ---- Pleť podľa typu pleti ----
skin_of = {}
for k, v in SKIN.items():
    for u in cats[f'https://www.aromakh.cz/anatomie/plet/{k}/akh']:
        skin_of.setdefault(u, []).append(v)


def face_kind(n):
    n = n.lower()
    if 'hy-olej' in n or 'odlič' in n: return 'Odličovací oleje'
    if 'pleťová voda' in n: return 'Pleťové vody'
    if 'tonikum' in n: return 'Pleťová tonika'
    if 'sérum' in n: return 'Séra'
    if 'oční' in n: return 'Oční krém'
    if 'olej' in n: return 'Pleťové oleje'
    return 'Krémy'


SCENT = [('růžového dřeva', 'rosewood'), ('citron', 'citron'), ('jalovc', 'juniper'), ('levandul', 'lavender'), ('růž', 'rose'), ('ylang', 'ylang'), ('rozmarýn', 'rosemary'),
         ('čajovník', 'teatree'), ('měsíčk', 'calendula'), ('vratič', 'tansy'), ('propolis', 'propolis'), ('santal', 'sandal'), ('make-up', 'neutral')]


def scent(n):
    n = n.lower()
    return next((v for k, v in SCENT if k in n), None)


for u, skins in skin_of.items():
    p = by[u]; kind = face_kind(p['name']); f = {'skin': skins, 'scope': 'single'}
    if kind in ('Pleťové vody', 'Pleťová tonika', 'Odličovací oleje'):
        s = scent(p['name'])
        if s: f['focus'] = s
    if kind in ('Krémy', 'Séra', 'Pleťové oleje'):
        f['spf'] = 'spf' if re.search(r'SPF\s*6', p['name']) else 'none'
    names = {'dry': 'suchá', 'normal': 'normální', 'combination': 'smíšená', 'oily': 'mastná'}
    rows[u] = row(u, 'face', kind, f, 'kategorie e-shopu „Dle typu pleti“: ' + ', '.join(names[s] for s in skins))

# ---- Telo: sprchovacie a kúpeľové oleje podľa vône, telové mlieka, peelingy ----
OILS = {  # názov (časť): (rodina vôní, vôňa)
    'BOROVICOV': ('forest', 'pine'), 'JALOVCOV': ('forest', 'juniper'), 'SANTALOV': ('forest', 'sandal'), 'PAČULIOV': ('forest', 'patchouli'),
    'CITRONOVÝ': ('citrus', 'citron'), 'GRAPEFRUITOV': ('citrus', 'grapefruit'), 'MANDARINKOV': ('citrus', 'mandarin'), 'CITRONOVO-KAFR': ('citrus', 'citronCamphor'),
    'LEVANDULOV': ('floral', 'lavender'), 'YLANGOV': ('floral', 'ylang'), 'CITRONOVÁ RŮŽE': ('floral', 'roseGeranium'), 'CITRONOVÉ RŮŽE': ('floral', 'roseGeranium'),
    'MEDUŇKOV': ('herbal', 'melissa'), 'ROZMARÝNOV': ('herbal', 'rosemary'), 'ČAJOVNÍKOV': ('herbal', 'teatree'), 'ŠALVĚJOV': ('herbal', 'sage'),
    'TYMIÁNOV': ('herbal', 'thyme'), 'EUKALYPTO-TYMIÁN': ('herbal', 'eucalyptus'), 'FRISCH': ('herbal', 'mint'),
    'NEUTRÁLNÍ': ('neutral', 'neutral'), 'HVĚZDA': ('xmas', 'xmas'), 'JEŽÍŠEK': ('xmas', 'xmas'), 'CELLU-THERAP': ('herbal', 'cellu'),
}
body_cat = cats['https://www.aromakh.cz/pece-o-telo--1/akh']
for u in body_cat:
    n = by[u]['name']
    if 'MENOTON' in n: continue  # olej pre obdobie hormonálnych zmien – zdravotné tvrdenie, mimo výberu
    kind = 'Sprchové oleje' if n.startswith('Sprchový olej') else 'Koupelové oleje' if n.startswith('Koupelový olej') else None
    if kind:
        key = next((k for k in OILS if k in n.upper()), None)
        assert key, n
        fam, sc = OILS[key]
        rows[u] = row(u, 'body', kind, {'scope': 'single', 'family': fam, 'focus': sc})
    elif re.search(r'GRAPESIA|LECITINIA BODY BALM|ARMONIA', n) and not n.startswith('SADA'):
        rows[u] = row(u, 'body', 'Tělová mléka', {'scope': 'single', 'focus': 'grapefruit' if 'GRAPESIA' in n else 'citron' if 'ARMONIA' in n else 'neutral'})
    elif n.startswith(('Tělový solno-olejový peeling', 'Solno-olejový peeling na nohy')):
        rows[u] = row(u, 'body', 'Solné peelingy', {'scope': 'single', 'focus': {'BAL': 'gentle', 'CELLU': 'celluPeel', 'JAGR': 'grapefruit', 'PEDI': 'feet'}[n.split()[-1]]})

# ---- Sady (len kozmetika; obsah zo stránky sady) ----
U = 'https://www.aromakh.cz/'
oil = lambda part: next(u for u, r in rows.items() if r['category'] == 'body' and r['kind'] == 'Sprchové oleje' and part in r['name'].upper())
milk = lambda part: next(u for u, r in rows.items() if r['kind'] == 'Tělová mléka' and part in r['name'].upper())
SETS = {
    U + 'sada-grapesia-pro-povzbuzeni-tela-i-mysli': ('body', [oil('GRAPEFRUIT'), milk('GRAPESIA')],
        ['Grapefruitový sprchovací olej (100 ml)', 'Tělové lecitinové mléko GRAPESIA (100 ml)']),
    U + 'sada-armonia-pro-harmonii-svezest-a-zklidneni': ('body', [milk('ARMONIA')],
        ['Tělové mléko Armonia (100 ml)', 'sprchovací oleje meduňkový, citronový, borovicový a z citronové růže (po 20 ml)']),
    U + 'ozivujici-sada-pro-plet': ('face', [], ['Odličovací olej HY-Neutral (100 ml)', 'Citronové pleťové tonikum (100 ml)', 'Eleutherococc regenerační krém (10 ml)', 'dárek: Jojobová maska (10 ml)']),
    U + 'rozjasnujici-sada-pro-plet': ('face', [], ['Odličovací olej HY-Neutral (100 ml)', 'Pleťové tonikum jalovcové (100 ml)', 'Lipio sérum LMP (30 ml)', 'dárek: Jojobová maska (10 ml)']),
    U + 'cestovatelka-cestovni-sada-pro-zeny': ('travel', [], ['HY-INTIMA (15 ml)', 'HY-OLEJ na odlíčení make-upu (15 ml)', 'Citronové pleťové tonikum (15 ml)', 'LECIDERMA SHEA NEUTRAL (15 ml)']),
}
for u, (target, contains, names) in SETS.items():
    r = row(u, 'sets', 'Dárkové sady', {'setFor': target})
    r['set'] = {'contains': [rows[c]['id'] for c in contains], 'containsNames': names}
    rows[u] = r
for u in cats['https://www.aromakh.cz/darkove-sady/akh']:
    n = by[u]['name']
    if re.search(r'SPRCHOVÝCH OLEJŮ|KOUPELOVÝCH OLEJŮ|VÁNOČNÍ KOUPELOVÁ', n):
        rows[u] = row(u, 'sets', 'Dárkové sady', {'setFor': 'shower' if 'SPRCHOV' in n else 'bath'})
        rows[u]['set'] = {'contains': [], 'containsNames': []}

out = [r for r in rows.values() if r['available']]
json.dump(out, open(OUT, 'w'), ensure_ascii=False, indent=1)
from collections import Counter
print(len(out), 'nedostupné:', [r['name'] for r in rows.values() if not r['available']])
print(Counter(r['category'] for r in out), Counter(r['kind'] for r in out))
