"""Séria 3 – TARANI (tarani.cz, Shoptet): kategórie e-shopu (typ a problém pleti) + produktové stránky (varianty z necessaryVariantData).
python3 -I tools/s3/build_tarani.py RAWDIR OUT.json   (RAWDIR/catmap.json, RAWDIR/pages/*.html)"""
import sys, json, re, os, html as H
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import sentences, photo
RAW, OUT = sys.argv[1], sys.argv[2]; CHECKED = '2026-11-05'; SLUG = 'tarani'; WEB = 'https://www.tarani.cz'
M = json.load(open(f'{RAW}/catmap.json')); CAT = {k: set(v) for k, v in M['cat'].items()}
inc = lambda u, *cs: any(u in CAT.get(c, set()) for c in cs)
SKIN = {'sensitive': ('kosmetika-pro-citlivou-plet', 'kosmetika-na-alergie-a-ekzemy', 'kosmetika-na-popraskane-zilky'),
        'blemish': ('kosmetika-pro-problematickou-plet', 'kosmetika-na-akne', 'kosmetika-pro-mastnou-plet', 'kosmetika-pro-smisenou-plet'),
        'dry': ('kosmetika-pro-suchou-plet',), 'mature': ('prirodni-kosmetika-pro-zralou-plet', 'kosmetika-na-vrasky', 'kosmetika-na-pigmentace-a-pihy')}
def flat(h):
    t = re.sub(r'<script.*?</script>|<style.*?</style>', '', h, flags=re.S); t = re.sub('<[^>]+>', '|', t)
    return re.sub(r'(\|\s*)+', '|', re.sub(r'\s+', ' ', H.unescape(t)))
KIND = {'Čistící mléka': 'Čištění a odličování', 'Mycí gely a mýdla': 'Čištění a odličování', 'Pleťová tonika a pudry': 'Tonika a živé vody', 'Pleťové a tělové krémy': 'Krémy',
        'Esenciální pleťové krémy': 'Krémy', 'Emulze': 'Emulze a gely', 'Gely': 'Emulze a gely', 'Séra na pleť a tělo': 'Séra a oleje', 'Masky a peelingy': 'Masky a peelingy',
        'Balzámy na rty': 'Balzámy na rty', 'Sluneční ochrana': 'Sluneční ochrana', 'Soli': 'Koupelové soli', 'Šampóny': 'Šampony', 'Kondicionéry': 'Kondicionéry',
        'Vlasová séra a gely': 'Vlasová séra a gely', 'AHA linie': 'Řada AHA', 'GOLD linie': 'Řada 24K GOLD', 'HYDRO linie': 'Řada HYDRO'}
rows, report = [], []
for u in sorted(set(x for c in ('kosmetika-pece-o-plet', 'kosmetika-pro-peci-o-telo', 'vlasy', 'pece-o-deti', 'ruce', 'nohy') for x in CAT[c])):
    f = f"{RAW}/pages/{u.strip('/')}.html"
    if not os.path.exists(f): continue
    h = open(f).read(); t = flat(h)
    name = H.unescape(re.search(r'<title>(.*?)\s*-\s*TARANI</title>', h).group(1)).strip()
    if re.search(r'dávkovač|pumpičk|poukaz|vzor', name, re.I): continue
    bc = re.search(r'\|Domů\|/\|(.+?)\|' + re.escape(name.split(' ')[0]), t)
    crumbs = [x.strip() for x in (bc.group(1).split('|/|') if bc else []) if x.strip() and x.strip() != '/']
    crumbs = [c.split('|')[0].strip() for c in crumbs]
    if 'BYLINNÉ KONCENTRÁTY' in crumbs: continue  # doplnky výživy – mimo kozmetiku
    nl = name.lower()
    kind = ('Šampony' if 'šampon' in nl else 'Kondicionéry' if 'kondicion' in nl else 'Vlasová séra a gely' if 'vlasov' in nl else
            'Koupelové soli' if re.search(r'\bsůl\b', nl) else 'Čištění a odličování' if re.search(r'mycí gel|čistící|čisticí|mléko', nl) else
            'Tonika a pleťové vody' if re.search(r'tonikum|živá voda|pudr', nl) else 'Masky a peelingy' if re.search(r'mask|peeling', nl) else
            'Séra a oleje' if re.search(r'sérum|olej', nl) else 'Emulze a gely' if re.search(r'emulze|gel', nl) else
            'Balzámy na rty' if 'rty' in nl else 'Krémy' if re.search(r'krém|balzám', nl) else None)
    vd = re.search(r'necessaryVariantData\s*=\s*(\{.*?\});', h, re.S)
    variants = []
    if vd:
        for key, v in json.loads(vd.group(1)).items():
            if not v.get('isNotSoldOut'): continue
            lab = re.search(r'<option value="' + key.split('-')[1] + r'"[^>]*>([^<]+)</option>', h)
            variants.append((v['priceUnformatted'], lab.group(1).strip() if lab else '', v['id'], (v.get('variantImage') or {}).get('big')))
    else:
        pr = re.search(r'"price"\s*:\s*"?(\d+(?:\.\d+)?)', h) or re.search(r'itemprop="price" content="([\d.]+)"', h)
        if pr and re.search(r'\|Skladem', t): variants.append((float(pr.group(1)), '', None, None))
    if not variants: report.append(('BEZ DOSTUPNEJ VARIANTY', name)); continue
    variants.sort()
    price, vol, vid, vimg = variants[0]
    cat = ('hair' if kind in ('Šampony', 'Kondicionéry', 'Vlasová séra a gely') else 'body' if kind == 'Koupelové soli' else
           'face' if inc(u, 'kosmetika-pece-o-plet') else 'hair' if inc(u, 'vlasy') else 'body' if inc(u, 'kosmetika-pro-peci-o-telo', 'ruce', 'nohy') else 'baby')
    if not kind: report.append(('BEZ DRUHU', name, crumbs)); continue
    meta = re.search(r'<meta name="description" content="([^"]+)"', h)
    popis = H.unescape(meta.group(1)).strip() if meta else ''
    if popis.lower().startswith(name.lower()): popis = popis[len(name):].lstrip(' .:–-')
    og = re.search(r'og:image" content="([^"]+)', h)
    img = vimg or (og and og.group(1))
    url = WEB + u + (f'?variantId={vid}' if vid and len(variants) > 0 and vd else '')
    r = {'id': 'tarani-' + u.strip('/'), 'name': name, 'url': url, 'priceAmount': float(price), 'currency': 'CZK', 'price': f'{price:,.0f} Kč'.replace(',', ' '),
         'volume': vol, 'variantLabel': vol, 'category': cat, 'kind': kind, 'tags': [], 'photo': photo(SLUG, img, u.strip('/')) or img, 'available': True, 'isSample': False,
         'description': sentences(popis, 2, 300), 'reason': sentences(popis, 1, 220),
         'source': {'url': url, 'verifiedAt': CHECKED, 'category': ' / '.join(crumbs), 'stock': 'Skladem', 'priceFrom': len(variants) > 1, 'imageUrl': img,
                    'variants': [{'label': l, 'price': p, 'variantId': i} for p, l, i, _ in variants], 'suitabilityEvidence': 'bez tvrdenia o type pleti',
                    'suitabilitySource': 'official product page description', 'categorySource': 'kategorie e-shopu tarani.cz (Pleť dle typu / dle problematiky)'}}
    EFFECT = [('calm', r'zklidň|tišící|proti zarudnutí|sos'), ('bright', r'rozjasň|pigment'), ('antiage', r'anti-aging|omlaz|lift|zpevň|kolagen|mládí|firm'),
              ('hydrate', r'hydrat|hydro|lehkosti'), ('detox', r'detox|energiz|osvěž|stimulač|tvarování|zeštíhl|svalov|tonizační'),
              ('nourish', r'regener|revital|antioxid|adaptogen|výživ|bioaktiv|mikrocirk|intenzivní|elixír|maxi')]
    eff = next((k for k, rx in EFFECT if re.search(rx, nl)), None)
    m = re.match(r'^([0-9A-ZÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ&\s-]{3,}?)\s+(?=[a-záčďéěíňóřšťúůýž])', name)
    focus = m.group(1).strip().title().replace('&', '&').replace(' Gold', ' GOLD').replace('24K', '24K') if m else None
    if cat == 'face':
        sk = [k for k, cs in SKIN.items() if inc(u, *cs)]
        r['facets'] = {'skin': sk or ['all']}
        LAB = {'kosmetika-pro-citlivou-plet': 'Citlivá pleť', 'kosmetika-na-alergie-a-ekzemy': 'Alergie, ekzémy', 'kosmetika-na-popraskane-zilky': 'Popraskané žilky',
               'kosmetika-pro-problematickou-plet': 'Problematická pleť', 'kosmetika-na-akne': 'Akné', 'kosmetika-pro-mastnou-plet': 'Mastná pleť', 'kosmetika-pro-smisenou-plet': 'Smíšená pleť',
               'kosmetika-pro-suchou-plet': 'Suchá pleť', 'prirodni-kosmetika-pro-zralou-plet': 'Zralá pleť', 'kosmetika-na-vrasky': 'Vrásky', 'kosmetika-na-pigmentace-a-pihy': 'Pigmentace, pihy'}
        cats_in = [LAB[c] for k in sk for c in SKIN[k] if inc(u, c)]
        r['source']['suitabilityEvidence'] = ('kategorie e-shopu: ' + ', '.join(dict.fromkeys(cats_in))) if sk else 'v žádné kategorii podle typu pleti – „bez konkrétního problému“'
    else: r['facets'] = {}
    if cat == 'hair':
        HAIR = {'loss': ('vypadavani-vlasu', 'rychly-rust'), 'dandruff': ('lupy-a-padani-vlasu',), 'oily': ('mastna-vlasova-pokozka',),
                'damaged': ('unavene-a-poskozene-vlasy', 'regenerace-barvenych-vlasu'), 'sensitive': ('jemne-vlasy-a-citliva-pokozka',)}
        hn = [k for k, cs in HAIR.items() if inc(u, *cs)]
        r['facets']['hairNeed'] = hn or ['all']
        r['source']['suitabilityEvidence'] = ('kategorie e-shopu Vlasy: ' + ', '.join(c for k in hn for c in HAIR[k] if inc(u, c))) if hn else 'bez kategorie podle potřeby vlasů'
    if eff: r['facets']['effect'] = eff
    if focus:
        focus = re.sub(r'\s*-\s*$', '', re.sub(r'\s+', ' ', focus)).strip()
        if not re.search(r'krém|gel|sérum|\d', focus, re.I): r['facets']['focus'] = focus
    rows.append(r)
json.dump(rows, open(OUT, 'w'), ensure_ascii=False, indent=1)
from collections import Counter
for x in report: print(*x)
print(len(rows), Counter(r['category'] for r in rows)); print(Counter((r['category'], r['kind']) for r in rows))
print(Counter(s for r in rows if r['category'] == 'face' for s in r['facets']['skin'])); print(Counter((r['category'], r['facets'].get('effect')) for r in rows)); print(sorted(Counter(r['facets'].get('focus') for r in rows).items(), key=lambda x: -x[1]))
