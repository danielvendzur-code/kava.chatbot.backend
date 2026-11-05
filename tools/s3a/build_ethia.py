"""Séria 3 (Andreine) – Ethia (ethia.cz, WooCommerce Store API): pleť a vlasy v natívnom poradcovi Andreine.
Oblasť (Pleť / Vlasy), druh produktu, problém a typ vlasov = kategórie e-shopu; hlavný problém podľa názvu produktu.
python3 -I tools/s3a/build_ethia.py PRODUCTS.json"""
import sys, os, re, json, html as H
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import photo
CHECKED = '2026-11-05'; SLUG = 'ethia'; WEB = 'https://ethia.cz'
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
ps = json.load(open(sys.argv[1]))
txt = lambda h: re.sub(r'\s+', ' ', H.unescape(re.sub(r'<[^>]+>', ' ', h or ''))).strip()
FACE_USE = [('Čištění pleti', 's3Cleanse', 'Čištění a odličování'), ('Séra', 's3Serum', 'Séra'), ('Noční krémy', 's3Night', 'Noční krémy'), ('Denní krémy', 's3Day', 'Denní krémy')]
HAIR_USE = [('šampony', 's3Wash', 'Šampony'), ('Šampony', 's3Wash', 'Šampony'), ('Kondicionéry', 's3Cond', 'Kondicionéry'), ('Oleje', 's3Oil', 'Oleje na vlasy')]
PROB = [('lup', 's3Dandruff', 'Lupy'), ('vypadáv|lám', 's3Breakage', 'Lámavost'), ('objem', 's3Volume', 'Nedostatek objemu'), ('retinol|Q10|anti-age|bakuchiol', 's3Wrinkles', 'Vrásky'),
        ('rozjas|vitamín C', 's3Bright', 'Rozjasnění'), ('mandl', 's3Oily', 'Mastná pleť'), ('niacinamid', 's3Oily', 'Mastná pleť'), ('odličovací olej', 's3Acne', 'Akné'), ('oliv|růž', 's3Hydra', 'Hydratace'), ('rozmarýn', 's3Breakage', 'Lámavost')]
CAT_PROB = {'Lupy': 's3Dandruff', 'Lámavost': 's3Breakage', 'Vypadávání': 's3Breakage', 'Nedostatek objemu': 's3Volume', 'Vrásky': 's3Wrinkles', 'Rozjasnění': 's3Bright', 'Mastná pleť': 's3Oily', 'Akné': 's3Acne', 'Hydratace': 's3Hydra', 'Citlivost': 's3Sensitive'}
out = []
for p in ps:
    cats = [H.unescape(c['name']) for c in p['categories']]
    name = H.unescape(p['name'])
    if not p['is_in_stock'] or p['type'] == 'grouped' or not int(p['prices']['price'] or 0) or re.search(r'Vzorek|Voucher', name): continue
    area = 'face' if 'Pleť' in cats else 'hair' if 'Vlasy' in cats or any(c in cats for c in ('Kondicionéry', 'šampony', 'Šampony')) else None
    if not area: print('MIMO', name, cats); continue
    use = next(((k, kind) for c, k, kind in (FACE_USE if area == 'face' else HAIR_USE) if c in cats), None)
    if not use: print('VYRADENÉ (druh)', name, cats); continue
    prob = next((k for rx, k, lab in PROB if re.search(rx, name, re.I) and lab in cats), None) or next((CAT_PROB[c] for c in cats if c in CAT_PROB), None)
    if not prob: print('VYRADENÉ (problém)', name, cats); continue
    hairType = 's3Curly' if 'Kudrnaté a hodně vlnité' in cats else 's3Straight' if 'Rovné a lehce vlnité' in cats else None
    price = int(p['prices']['price']) / (10 ** p['prices']['currency_minor_unit'])
    desc = ' '.join(re.split(r'(?<=[.!?])\s+', txt(p['short_description'] or p['description']))[:2])[:300]
    traits = {'careUse': use[0], 'purpose': use[0]}
    if area == 'face': traits['skinFocus'] = prob
    else: traits['hairNeed'] = prob; traits['hairFocus'] = hairType or 's3AnyHair'
    pid = p['permalink'].rstrip('/').split('/')[-1]
    out.append({'id': pid, 'name': name + (' – kudrnaté vlasy' if hairType == 's3Curly' else ' – rovné vlasy' if hairType == 's3Straight' and any(o['name'] == p['name'] and o['id'] != p['id'] for o in ps) else ''),
        'url': p['permalink'], 'priceAmount': price, 'currency': 'CZK', 'price': f'{int(price)} Kč', 'volume': '', 'variantLabel': '',
        'category': area, 'kind': use[1], 'tags': [], 'photo': photo(SLUG, (p['images'] or [{}])[0].get('src'), pid), 'available': True, 'isSample': False, 'description': desc, 'reason': desc,
        'source': {'url': p['permalink'], 'verifiedAt': CHECKED, 'stock': 'InStock', 'priceFrom': p['type'] == 'variable' and p['prices'].get('price_range') is not None,
                   'selectionTraits': traits, 'selectionTraitsEvidence': 'kategorie e-shopu ethia.cz: ' + ', '.join(cats), 'suitabilitySource': 'kategorie e-shopu', 'allSkinTypes': True,
                   'routineRole': {'s3Cond': 'conditioner', 's3Oil': 'leaveInCare'}.get(use[0])}})
pick, combo = [], set()
for p in out:
    t = p['source']['selectionTraits']; c = (p['category'], t['careUse'], t.get('skinFocus') or t.get('hairNeed'), t.get('hairFocus'))
    if c not in combo: combo.add(c); pick.append(p)
out = [p for p in pick if p['photo']][:25]
cat = {'verifiedAt': CHECKED + 'T10:00:00Z', 'source': WEB + '/', 'collectionMethod': 'WooCommerce Store API e-shopu ethia.cz (kategorie Pleť, Vlasy, Problémy, typ vlasů), ' + CHECKED, 'excluded': ['vzorky, vouchery, dárečky', 'balíčky', 'vyprodané produkty'], 'products': out}
open(f'{ROOT}/catalogues/{SLUG}.js', 'w').write('/* Séria 3 (Andreine) – Ethia: ' + str(len(out)) + ' dostupných produktů pleťové a vlasové péče (' + CHECKED + '). Generované: tools/s3a/build_ethia.py. */\nglobalThis.CX_CATALOGUES ||= {};\nglobalThis.CX_CATALOGUES["' + SLUG + '"] = ' + json.dumps(cat, ensure_ascii=False) + ';\n')
for p in out: print(p['name'], '|', p['category'], p['source']['selectionTraits'], p['price'])
