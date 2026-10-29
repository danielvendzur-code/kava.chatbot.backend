"""k2 – katalóg MALINNA° z overených údajov (products.json, kolekcie, stránky sád). python3 -I tools/k2/build_malinna.py RAW OUT"""
import sys, json, re, html

RAW, OUT = sys.argv[1], sys.argv[2]
CHECKED = '2026-10-29'
ps = json.load(open(f'{RAW}/products.json'))['products']
cols = json.load(open(f'{RAW}/collections-map.json'))
sets_meta = json.load(open(f'{RAW}/sets.json'))
by = {p['handle']: p for p in ps}
txt = lambda h: re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', ' ', h or ''))).strip()
money = lambda v: f"{v:.2f}".replace('.', ',') + ' €'
ALL = ['sensitive', 'blemish', 'dry', 'mature', 'normal']
# Typ pleti: kolekcie e-shopu (citliva-pokozka-ekzem, akne-problematicka-plet) + výslovný popis produktu (citát v evidence)
SKIN = {
    'cleansing-foam': (ALL, 'kolekcie citlivá pokožka a akné; popis: „pre rôzne typy pleti“'),
    'face-wash': (['sensitive', 'blemish'], 'kolekcie citlivá pokožka a akné'),
    'skin-toner': (['sensitive', 'blemish', 'normal'], 'kolekcie citlivá pokožka a akné; popis: „pre normálnu a citlivú pokožku“'),
    'skin-toner-neroli': (['sensitive', 'normal'], 'popis: „pre normálnu a citlivú pokožku“'),
    'rose-repairing-cream': (ALL, 'popis: „Vhodný pre všetky typy pleti, najmä suchú, citlivú a zrelú“'),
    'immortelle-anti-aging-cream': (['normal', 'sensitive', 'mature', 'blemish'], 'popis: „Vhodný pre normálnu, citlivú, zrelú aj aknóznu pleť“'),
    'lavender-sensitive-cream': (['sensitive', 'blemish'], 'popis: „aj veľmi citlivú, problematickú či mladistvú pleť“'),
}
CREAM = {'rose-repairing-cream': 'rose', 'immortelle-anti-aging-cream': 'immortelle', 'lavender-sensitive-cream': 'lavender'}
SCENT = {'body-serum-neroli': 'neroli', 'body-serum-geranium': 'geranium', 'body-serum-mint-lemon-rosemary': 'mintLemon',
         'body-serum-cedar-wood-cinnamon': 'cedarCinnamon', 'hand-soap-tilia-pine': 'tiliaPine', 'hand-soap-bergamot-vanilla': 'bergamotVanilla'}
SETS = {  # podľa „Set obsahuje“ na stránke sady
    'daily-duo-sensitive': ['cleansing-foam', 'skin-toner'], 'daily-duo-intensive': ['face-wash', 'skin-toner'],
    'daily-trio-lavender-sensitive': ['cleansing-foam', 'skin-toner', 'lavender-sensitive-cream'],
    'daily-trio-lavender-intensive': ['face-wash', 'skin-toner', 'lavender-sensitive-cream'],
    'daily-trio-rose-sensitive': ['cleansing-foam', 'skin-toner-neroli', 'rose-repairing-cream'],
    'daily-trio-rose-intensive': ['face-wash', 'skin-toner', 'rose-repairing-cream'],
    'daily-trio-immortelle-sensitive': ['cleansing-foam', 'skin-toner-neroli', 'immortelle-anti-aging-cream'],
    'daily-trio-immortelle-intensive': ['face-wash', 'skin-toner', 'immortelle-anti-aging-cream'],
    'hand-care-set-tilia-pine': ['hand-soap-tilia-pine', 'hand-cream'], 'hand-care-set-bergamot-vanilla': ['hand-soap-bergamot-vanilla', 'hand-cream'],
    'body-scalp-essentials-set': ['body-serum-neroli', 'shampoo-clary-sage'],
    'body-serum-trio': ['body-serum-neroli', 'body-serum-geranium', 'body-serum-mint-lemon-rosemary'],
    'kids-body-set': ['kids-body-foam', 'kids-body-balm'],
}
FACE = {'cleansing-foam', 'face-wash', 'skin-toner', 'skin-toner-neroli', 'rose-repairing-cream', 'immortelle-anti-aging-cream', 'lavender-sensitive-cream'}
BODY = {'body-serum-neroli', 'body-serum-geranium', 'body-serum-mint-lemon-rosemary', 'body-serum-cedar-wood-cinnamon', 'hand-soap-tilia-pine',
        'hand-soap-bergamot-vanilla', 'hand-cream', 'foot-cream'}
KIDS = {'kids-body-foam', 'kids-body-balm'}
HAIR = {'shampoo-clary-sage'}
KIND = {'cleansing-foam': 'Čistenie pleti', 'face-wash': 'Čistenie pleti', 'skin-toner': 'Toniká', 'skin-toner-neroli': 'Toniká',
        'rose-repairing-cream': 'Pleťové krémy', 'immortelle-anti-aging-cream': 'Pleťové krémy', 'lavender-sensitive-cream': 'Pleťové krémy',
        'body-serum-neroli': 'Sprchové séra', 'body-serum-geranium': 'Sprchové séra', 'body-serum-mint-lemon-rosemary': 'Sprchové séra',
        'body-serum-cedar-wood-cinnamon': 'Sprchové séra', 'hand-soap-tilia-pine': 'Mydlá na ruky', 'hand-soap-bergamot-vanilla': 'Mydlá na ruky',
        'hand-cream': 'Krémy na ruky a nohy', 'foot-cream': 'Krémy na ruky a nohy', 'kids-body-foam': 'Detská pena', 'kids-body-balm': 'Detský balzam',
        'shampoo-clary-sage': 'Šampóny'}
TONER = {}  # obe toniká majú na e-shope rovnaký popis – nerozlišujeme ich otázkou
HANDFOOT = {'hand-cream': 'hands', 'foot-cream': 'feet'}
CLEANSER = {'cleansing-foam': 'gentle', 'face-wash': 'deep'}


def first(t):
    m = re.match(r'^(.{30,260}?[.!?])(\s|$)', t)
    return m.group(1) if m else t[:240]


def row(h, cat):
    p = by[h]; v = p['variants'][0]; price = float(v['price']); body = txt(p['body_html'])
    return {'id': 'malinna-' + h, 'name': p['title'], 'url': 'https://malinna.com/products/' + h, 'priceAmount': price, 'currency': 'EUR',
            'price': money(price), 'volume': '' if v['title'] == 'Default Title' else v['title'], 'variantLabel': '', 'category': cat, 'kind': KIND.get(h, 'Hotové sady'),
            'tags': [], 'photo': p['images'][0]['src'] if p['images'] else None, 'available': bool(v['available']), 'isSample': False,
            'description': first(body), 'reason': first(body),
            'source': {'url': 'https://malinna.com/products/' + h, 'verifiedAt': CHECKED, 'category': p['product_type'], 'stock': 'InStock' if v['available'] else 'OutOfStock',
                       'priceFrom': False, 'imageUrl': p['images'][0]['src'] if p['images'] else None, 'suitabilityEvidence': 'bez tvrdenia o type pleti',
                       'suitabilitySource': 'official product page description'}}


rows = {}
for h in FACE | BODY | KIDS | HAIR:
    cat = 'face' if h in FACE else 'baby' if h in KIDS else 'body'  # šampón (jediný vlasový produkt) patrí k telu a vlasom
    r = row(h, cat); f = {}
    if h in SKIN:
        f['skin'] = SKIN[h][0]; r['source']['suitabilityEvidence'] = SKIN[h][1]
    f['scope'] = 'single'
    if h in CREAM: f['focus'] = CREAM[h]
    if h in TONER: f['focus'] = TONER[h]
    if h in CLEANSER: f['focus'] = CLEANSER[h]
    if h in SCENT: f['focus'] = SCENT[h]
    if h in HANDFOOT: f['focus'] = HANDFOOT[h]
    r['facets'] = f; rows[h] = r
for h, contents in SETS.items():
    cat = 'face' if h.startswith('daily') else 'baby' if h.startswith('kids') else 'body'
    r = row(h, cat); meta = sets_meta[h]
    skins = None
    for c in contents:
        s = set(SKIN.get(c, (ALL, ''))[0]); skins = s if skins is None else skins & s
    f = {'scope': 'set'}
    if cat == 'face':
        f['skin'] = sorted(skins); r['source']['suitabilityEvidence'] = 'prienik typov pleti produktov v sade (' + ', '.join(contents) + ')'
        f['cleanse'] = 'gentle' if 'sensitive' in h else 'deep'
        cream = next((CREAM[c] for c in contents if c in CREAM), None)
        f['focus'] = cream or 'duo'
    elif cat == 'body':
        f['focus'] = {'hand-care-set-tilia-pine': 'tiliaPine', 'hand-care-set-bergamot-vanilla': 'bergamotVanilla', 'body-scalp-essentials-set': 'bodyScalp', 'body-serum-trio': 'trio'}[h]
    r['facets'] = f
    r['set'] = {'contains': ['malinna-' + c for c in contents], 'containsNames': [by[c]['title'] for c in contents],
                'regularPrice': float(meta['regular'].replace(',', '.')), 'regularPriceSource': 'e-shop: „Bežná cena“ na stránke sady (' + CHECKED + ')'}
    assert abs(float(meta['price'].replace(',', '.')) - r['priceAmount']) < 0.01, (h, meta, r['priceAmount'])
    rows[h] = r
out = list(rows.values())
json.dump(out, open(OUT, 'w'), ensure_ascii=False, indent=1)
from collections import Counter
print(len(out), Counter(r['category'] for r in out), Counter(r['kind'] for r in out))
