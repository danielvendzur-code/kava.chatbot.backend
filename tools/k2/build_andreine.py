"""k2 – katalóg Andreine z overených údajov e-shopu (products.json, kolekcie podľa problému, stránky sád).
python3 -I tools/k2/build_andreine.py RAW_DIR OUT_JSON"""
import sys, json, re, html

RAW, OUT = sys.argv[1], sys.argv[2]
CHECKED = '2026-10-29'
ps = json.load(open(f'{RAW}/products-1.json'))['products'] + json.load(open(f'{RAW}/products-2.json'))['products']
cols = json.load(open(f'{RAW}/collections-map.json'))
set_prices = json.load(open(f'{RAW}/set-prices.json'))
by = {p['handle']: p for p in ps}
txt = lambda h: re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', ' ', h or ''))).strip()
money = lambda v: f"{v:.2f}".replace('.', ',') + ' €'

NEED = {'vypadavanie-vlasov': 'loss', 'mastna-seborea': 'oily', 'sucha-pokozka-hlavy': 'dryScalp', 'sucha-seborea': 'dryScalp',
        'poskodene-a-oslabene-vlasy': 'damaged', 'jemne-vlasy-bez-objemu': 'fine', 'kucerave-vlasy': 'curly', 'stylingove-produkty': 'styling'}
ALL_NEEDS = ['loss', 'oily', 'dryScalp', 'damaged', 'fine', 'curly']
# Priradenie z výslovného popisu e-shopu pri produktoch mimo kolekcií podľa problému (citát v source.needEvidence).
EXPLICIT = {
    'boost-tonic-1': (['oily'], 'Tonikum pre rýchlomastiacu sa pokožku hlavy'),
    'vyzivujuci-kondicioner-leave-in-velvet': (['damaged'], 'Kondicionér pre poškodené a farbené vlasy'),
    'vyzivujuci-kondicioner-leave-in-flower': (ALL_NEEDS, 'vhodný pre nepoddajné vlasy a všetky typy vlasov'),
}
KIND = {'Šampón': 'Šampóny', 'Kondicionér': 'Kondicionéry', 'Vlasová maska': 'Masky na vlasy', 'Hair tonic': 'Toniká na vlasy',
        'Vlasové tonikum': 'Toniká na vlasy', 'Olej': 'Oleje na vlasy', 'Fixácia vlasov': 'Styling', 'Suchý šampón': 'Styling',
        'Sada': 'Hotové sady', 'Sprchovanie': 'Sprchové gély', 'Čistiaca pena': 'Čistiaca pena', 'Balzám na vlasy': 'Balzam na bradu'}
MEN = {'intense-shampoo', 'gentleman-oil', 'hydro-foam', 'andreine-balzam-na-bradu-a-vlasy', 'andreine-panska-sada-pre-rast-a-vitalitu-vlasov'}
BABY = {'shampoo-for-littles', 'telove-detske-mlieko-little-love-lotion'}
BODY = {'telove-mlieko-pre-dospelych-lavender-lotion', 'calming-cream-1', 'andreine-harmony-sprchovy-gel-harmony-shower-gel-kopie',
        'andreine-sprchovy-gel-harmony-limitovana-edicia'}
STYLING_KIND = {'anti-frizz-uhladzujuci-krem-na-vlasy', 'curly-cream-krem-na-podporu-a-tvarovanie-kucier', 'fixing-gel-fixacny-gel'}
ADDON = {'dreveny-hreben', 'drevena-kefa-na-vlasy-andreine', 'hodvabna-ciapka', 'andreine-turban-na-vlasy', 'filtracna-sprchova-hlavica-andreine',
         'cestovna-sada-na-vlasove-produkty'}
SETS = {  # zloženie podľa časti „Obsah sady“ / postupu na stránke sady (overené 2026-10-29)
    'andreine-sada-start-na-obnovu-poskodenych-a-farbenych-vlasov': ['velvet-shampoo', 'infusion-tonic', 'vyzivujuci-kondicioner-leave-in-velvet'],
    'andreine-sada-na-obnovu-poskodenych-a-farbenych-vlasov': ['velvet-shampoo', 'obnovujuca-maska-na-vlasy-repair-mask', 'vyzivujuci-kondicioner-leave-in-velvet', 'infusion-tonic', '#Daily Ritual MANGO (doplnok stravy)'],
    'andreine-sada-start-pre-objem-a-silu-vlasov': ['volume-shampoo-2', 'vyzivujuci-kondicioner-leave-in-flower', 'boost-tonic-1'],
    'andreine-sada-na-objem-a-silu-vlasov': ['volume-shampoo-2', 'vyzivujuca-maska-na-vlasy-nutrition-mask', 'vyzivujuci-kondicioner-leave-in-flower', 'boost-tonic-1', '#Daily Ritual MANGO (doplnok stravy)'],
    'andreine-intenzivna-sada-start-na-podporu-rastu': ['revitalizacny-sampon-unisex-scalp-renewal-shampoo', 'infusion-tonic', 'leave-in-fruit'],
    'andreine-sada-start-na-rychlo-mastiacu-sa-pokozku-a-rast-vlasov': ['growth-shampoo-1', 'infusion-tonic', 'leave-in-fruit'],
    'andreine-sada-start-na-normalnu-az-problematicku-pokozku-a-suche-dlzky': ['shine-shampoo-1', 'infusion-tonic', 'vyzivujuci-kondicioner-pre-lesk-vlasov-leave-in-herbs'],
    'andreine-sada-pre-kucerave-vlasy': ['shine-shampoo-1', 'hydration-mask', 'leave-in-fruit', 'heat-protection-tepelna-ochrana-na-vlasy', 'fixing-gel-fixacny-gel', 'curly-cream-krem-na-podporu-a-tvarovanie-kucier'],
    'andreine-sada-na-normalnu-a-problematicku-pokozku-a-suche-dlzky': ['shine-shampoo-1', 'protein-mask', 'vyzivujuci-kondicioner-pre-lesk-vlasov-leave-in-herbs', 'infusion-tonic', '#Daily Ritual MANGO (doplnok stravy)'],
    'andreine-sada-pre-jemnu-a-detsku-vlasovu-starostlivost': ['shampoo-for-littles', 'growth-tonic', 'leave-in-fruit'],
    'andreine-intenzivna-sada-na-podporu-rastu-vlasov': ['revitalizacny-sampon-unisex-scalp-renewal-shampoo', 'infusion-tonic', 'protein-mask', 'leave-in-fruit', 'gentleman-oil', '#Daily Ritual MANGO (doplnok stravy)'],
    'andreine-panska-sada-pre-rast-a-vitalitu-vlasov': ['intense-shampoo', 'hydro-foam', 'gentleman-oil'],
    'andreine-sada-na-rychlo-mastiacu-sa-pokozku-a-suche-dlzky-vlasov': ['growth-shampoo-1', 'hydration-mask', 'leave-in-fruit', 'growth-tonic', 'treatment-oil', '#Daily Ritual MANGO (doplnok stravy)'],
}
FOCUS = {  # zameranie podľa názvu produktu v e-shope (nie odhad)
    'growth-shampoo-1': 'growth', 'volume-shampoo-2': 'volume', 'revitalizacny-sampon-unisex-scalp-renewal-shampoo': 'scalp',
    'shine-shampoo-1': 'hydration', 'velvet-shampoo': 'repair',
    'hydration-mask': 'hydration', 'obnovujuca-maska-na-vlasy-repair-mask': 'repair', 'vyzivujuca-maska-na-vlasy-nutrition-mask': 'nutrition',
    'protein-mask': 'strength',
    'leave-in-fruit': 'light', 'vyzivujuci-kondicioner-leave-in-flower': 'smooth', 'vyzivujuci-kondicioner-leave-in-velvet': 'repair',
    'vyzivujuci-kondicioner-pre-lesk-vlasov-leave-in-herbs': 'dry',
    'growth-tonic': 'growth', 'infusion-tonic': 'scalp', 'boost-tonic-1': 'oilControl',
    'treatment-oil': 'hairSkin', 'silk-oil': 'silk',
    'fixacny-sprej-na-vlasy-s-prirodnym-zlozenim-fixing-spray': 'hold', 'fixing-gel-fixacny-gel': 'hold', 'anti-frizz-uhladzujuci-krem-na-vlasy': 'smooth',
    'heat-protection-tepelna-ochrana-na-vlasy': 'heat', 'curly-cream-krem-na-podporu-a-tvarovanie-kucier': 'curls', 'sos-powder': 'dryShampoo',
}
SKIP = re.compile(r'vzorka|poukaz|doplnok-stravy|vitaminy|90-day|clone_freegift|nahradny|filter-proti|doplnkova-sada')


def full(handle_prefix):
    if handle_prefix in by:
        return handle_prefix
    m = [h for h in by if h.startswith(handle_prefix[:60]) and 'vzorka' not in h]
    assert len(m) == 1, (handle_prefix, m)
    return m[0]


def first_sentence(t):
    t = re.sub(r'\s+', ' ', t).strip()
    m = re.match(r'^(.{40,260}?[.!?])(\s|$)', t)
    return (m.group(1) if m else t[:240].rsplit(' ', 1)[0] + '…')


rows = []
for h, p in by.items():
    if SKIP.search(h) or float(p['variants'][0]['price']) <= 0:
        continue
    v = p['variants'][0]
    price = float(v['price'])
    body = txt(p['body_html'])
    pid = 'andreine-' + h[:60]
    needs = sorted({NEED[c] for c, hs in cols.items() if h in hs and c in NEED})
    evidence = 'kolekcie e-shopu: ' + ', '.join(sorted(c for c, hs in cols.items() if h in hs and c in NEED)) if needs else None
    if h in EXPLICIT:
        needs, quote = EXPLICIT[h][0], EXPLICIT[h][1]
        evidence = 'popis e-shopu: „' + quote + '“'
    role = 'addon' if h in ADDON else None
    ptype = p['product_type']
    if h in MEN:
        cat = 'men'
    elif h in BABY:
        cat = 'baby'
    elif h in BODY:
        cat = 'body'
    elif role:
        cat = 'other'
    else:
        cat = 'hair'
    kind = 'Hotové sady' if ptype == 'Sada' else 'Styling' if h in STYLING_KIND else KIND.get(ptype) or ('Telové mlieka a krémy' if cat in ('body', 'baby') and ptype == 'Krém' else ptype or 'Doplnky')
    if role:
        kind = 'Doplnky'
    size = re.search(r'\b(\d{2,4})\s?(ml|g)\b', body)
    row = {'id': pid, 'name': p['title'], 'url': 'https://andreine.com/products/' + h, 'priceAmount': price, 'currency': 'EUR',
           'price': money(price), 'volume': (size.group(1) + ' ' + size.group(2)) if size and ptype != 'Sada' else '',
           'variantLabel': '' if v['title'] == 'Default Title' else v['title'], 'category': cat, 'kind': kind, 'tags': [],
           'photo': p['images'][0]['src'] if p['images'] else None, 'available': bool(v['available']), 'isSample': False,
           'description': first_sentence(body), 'reason': first_sentence(body),
           'source': {'url': 'https://andreine.com/products/' + h, 'verifiedAt': CHECKED, 'category': ptype, 'stock': 'InStock' if v['available'] else 'OutOfStock',
                      'priceFrom': False, 'imageUrl': p['images'][0]['src'] if p['images'] else None, 'suitabilityEvidence': evidence or 'bez tvrdenia o type vlasov',
                      'suitabilitySource': 'official product page description'}}
    if role:
        row['role'] = role
    facets = {}
    if cat == 'hair':
        if h in {'heat-protection-tepelna-ochrana-na-vlasy', 'fixing-gel-fixacny-gel', 'curly-cream-krem-na-podporu-a-tvarovanie-kucier',
                 'anti-frizz-uhladzujuci-krem-na-vlasy', 'sos-powder', 'fixacny-sprej-na-vlasy-s-prirodnym-zlozenim-fixing-spray'}:
            needs = sorted(set(needs) | {'styling'})
        # produkt, ktorý v názve cieli „na suché vlasy“, sa pri mastných vlasoch neponúka sám (kolekcia e-shopu ho tam má pre suché dĺžky;
        # tú kombináciu vysvetľuje sada „na rýchlo mastiacu sa pokožku a suché dĺžky“)
        if 'oily' in needs and re.search(r'na such|pre such', p['title'].lower()) and not re.search(r'mast', p['title'].lower()):
            needs = [n for n in needs if n != 'oily']
        if not needs:
            raise SystemExit('chýba potreba: ' + h)
        facets['hairNeed'] = needs
        if ptype != 'Sada':
            facets['focus'] = FOCUS[h]
    if cat in ('hair', 'men'):
        facets['scope'] = 'set' if ptype == 'Sada' else 'single'
    if facets:
        row['facets'] = facets
    if ptype == 'Sada':
        key = next(k for k in SETS if h.startswith(k[:60]) or k.startswith(h[:60]))
        contents = SETS[key]
        sp = set_prices.get(h[:60]) or next((v for k, v in set_prices.items() if h.startswith(k)), None)
        regular = float(sp[1].replace(',', '.')) if sp else None
        row['set'] = {'contains': ['andreine-' + full(c)[:60] for c in contents if not c.startswith('#')],
                      'containsNames': [by[full(c)]['title'] if not c.startswith('#') else c[1:] for c in contents],
                      'regularPrice': regular, 'regularPriceSource': 'e-shop: „Bežná cena“ na stránke sady (' + CHECKED + ')'}
    rows.append(row)

json.dump(rows, open(OUT, 'w'), ensure_ascii=False, indent=1)
from collections import Counter
print(len(rows), Counter(r['category'] for r in rows), Counter(r['kind'] for r in rows if r['category'] == 'hair'))
