"""k2 – katalóg Goodie (goodie.cz) – iba vlastná značka Goodie, kozmetika. Údaje: JSON-LD a mikrodáta produktových stránok.
python3 -I tools/k2/build_goodie.py RAW OUT"""
import sys, json, re

RAW, OUT = sys.argv[1], sys.argv[2]
CHECKED = '2026-10-29'
ps = [p for p in json.load(open(f'{RAW}/products.json')) if (p.get('brand') or '') == 'Goodie' and p.get('name')]
by = {}
for p in ps: by.setdefault(re.sub(r'\s+', ' ', p['name']).strip(), p)
BAD = re.compile(r'Zpět|Zobrazit vše|košík|Kč', re.I)


def first(p):
    for src in (p.get('description') or '', p.get('metaDescription') or ''):
        sents = [x.strip() for x in re.split(r'(?<=[.!?])\s+', src) if x.strip()]
        for x in sents:
            if 40 <= len(x) <= 260 and not BAD.search(x): return x
    return ''


rows = {}
def put(name, cat, kind, facets, role=None, evidence='bez tvrzení o typu pleti'):
    p = by[name]; o = (p.get('offers') or [{}])[0]
    price = float(o['price']); vol = (re.search(r'(\d+(?:[.,]\d+)?\s?(?:ml|g|ks))\b', name) or [None, ''])[1]
    d = first(p)
    r = {'id': 'goodie-' + p['url'].rstrip('/').rsplit('/', 1)[-1], 'name': name, 'url': p['url'], 'priceAmount': price, 'currency': 'CZK', 'price': f'{int(price)} Kč',
         'volume': vol, 'variantLabel': '', 'category': cat, 'kind': kind, 'tags': [], 'photo': p.get('image') or p.get('ogImage'),
         'available': o.get('availability') == 'InStock', 'isSample': False, 'description': d, 'reason': d, 'facets': {'scope': 'single', **facets},
         'source': {'url': p['url'], 'verifiedAt': CHECKED, 'category': ' > '.join((p.get('breadcrumb') or [])[1:-1]), 'stock': o.get('availability'), 'priceFrom': False,
                    'imageUrl': p.get('image'), 'suitabilityEvidence': evidence, 'suitabilitySource': 'official product page description'}}
    if role: r['role'] = role
    rows[name] = r


def find(prefix):
    hits = [n for n in by if n.startswith(prefix)]
    assert len(hits) == 1, (prefix, hits)
    return hits[0]


# ---- Pleť ----
for pre, f in [('Čisticí pěna - Pro problematickou pleť', 'acne'), ('Vitamínová čisticí pěna na obličej - Mango 150', 'mango'), ('Vyvažující čisticí pěna na obličej - Lesní borůvka 60', 'blueberry')]:
    put(find(pre), 'face', 'Čisticí pěny', {'focus': f}, evidence='název produktu' if f == 'acne' else 'bez tvrzení o typu pleti')
for pre, f in [('Odličovací balzám - Cleansing Balm - Unscented 50', 'unscented'), ('Odličovací balzám - Cleansing Balm - Mango & Apricot 50', 'mangoApricot'),
               ('Odličovací olej - natural', 'natural'), ('Odličovací olej - mandarinka', 'mandarin')]:
    put(find(pre), 'face', 'Odličovací balzámy a oleje', {'focus': f})
for pre, fam, f in [('AHA + BHA sérum', 'acids', 'ahabha'), ('Pleťové sérum Niacinamid', 'acids', 'niacinamide'), ('Hyaluronové sérum s extraktem z malachitu', 'hydration', 'malachite'),
                    ('Hyaluronové sérum 5M', 'hydration', 'ectoin'), ('Pleťové sérum Vitamin C 15%', 'vitamin', 'vitc15'), ('Pleťové sérum Vitamin C 5%', 'vitamin', 'vitc5'),
                    ('Vitaminové sérum s Antioxidanty', 'vitamin', 'bakuchiol'), ('Dvoufázový revitalizační booster', 'vitamin', 'booster')]:
    if any(n.startswith(pre) for n in by): put(find(pre), 'face', 'Séra', {'family': fam, 'focus': f})
for pre, f in [('Face cream - Denní krém s rakytníkem', 'buckthorn'), ('Face cream - Prebiotický denní krém', 'aloe'), ('Night Face Cream', 'night'),
               ('Hydratační gel-krém pro podporu kožní bariéry s CBD', 'cbd'), ('Eye cream - Oční krém', 'eye')]:
    put(find(pre), 'face', 'Krémy', {'focus': f})
for pre, f in [('Rozjasňující plátýnková maska', 'vitcMask'), ('Hydratační plátýnková maska', 'hyalMask'), ('Pleťová maska kurkuma & med', 'turmeric'), ('Kurkuma a med - pleťová maska', 'turmeric2')]:
    put(find(pre), 'face', 'Plátýnkové a krémové masky', {'focus': f})
for pre, f in [('PURPLE Face Mask', 'purple'), ('PINK Face mask', 'pink'), ('GREEN Face mask', 'green'), ('BLACK Face mask', 'black'), ('BLUE Face mask', 'blue'), ('WHITE Face mask', 'white')]:
    put(find(pre), 'face', 'Jílové masky', {'focus': f})
for pre, f in [('Tonikum - LESNÍ BORŮVKA', 'blueberry'), ('Tonikum - MANGO', 'mango'), ('Celulární okurková voda', 'cucumber')]:
    put(find(pre), 'face', 'Tonika', {'focus': f})
for pre, fam, f in [('Růžová voda - Damašská', 'floral', 'rose'), ('Růžová voda - růže Alba', 'floral', 'roseAlba'), ('Levandulová voda', 'floral', 'lavender'), ('Heřmánková voda', 'floral', 'chamomile'),
                    ('Jasmínová voda', 'floral', 'jasmine'), ('Mátová voda', 'fresh', 'mint'), ('Pomerančová voda', 'fresh', 'orange'), ('Aloe vera voda', 'fresh', 'aloe'), ('Kokosová voda', 'fresh', 'coconut')]:
    put(find(pre), 'face', 'Květové vody', {'family': fam, 'focus': f})
for pre, f in [('Jojobový olej', 'jojoba'), ('Avokádový olej', 'avocado'), ('Šípkový olej', 'rosehip'), ('Arganový olej BIO RAW 100', 'argan'), ('Pupalkový olej', 'primrose'), ('Kávový olej ze zelených zrn', 'coffee')]:
    put(find(pre), 'face', 'Pleťové oleje', {'focus': f})
for pre in ['Konjac houbička - Zelený čaj', 'Konjac houbička - Růžový jíl', 'Konjac houbička - Natural', 'Konjac houbička - Aktivní uhlí', 'Konjac houbička - Kurkuma', 'Špachtle na krém']:
    put(find(pre), 'face', 'Doplňky', {}, role='addon')

# ---- Telo ----
for pre, fam, f in [('Přírodní mýdlo - Dead sea', 'mineral', 'deadsea'), ('Přírodní mýdlo - Blue ocean', 'mineral', 'ocean'), ('Přírodní mýdlo - Black detox', 'mineral', 'charcoal'),
                    ('Přírodní mýdlo - Fresh herbs', 'mineral', 'herbs'), ('Přírodní mýdlo - Cinnamon orange', 'sweet', 'cinnamonOrange'), ('Přírodní mýdlo - Chocolate', 'sweet', 'chocolate'),
                    ('Přírodní mýdlo - Pumpkin spice', 'sweet', 'pumpkin'), ('Přírodní mýdlo - Rose garden', 'floral', 'rose'), ('Přírodní mýdlo - Sandalwood', 'floral', 'sandal'),
                    ('Přírodní mýdlo - Rakytník', 'floral', 'buckthorn'), ("Dragon's Blood Soap", 'floral', 'dragon')]:
    put(find(pre), 'body', 'Přírodní mýdla', {'family': fam, 'focus': f})
for pre, f in [('Tělový peeling - Berry', 'berry'), ('Tělový peeling - CocoVanilla', 'cocoVanilla'), ('Tělový peeling - Coffee', 'coffee'), ('Tělový peeling - Matcha', 'matcha')]:
    put(find(pre), 'body', 'Tělové peelingy', {'focus': f})
for pre, f in [('Body butter - Šlehané bergamotové', 'bergamot'), ('Body butter - Růžové', 'rose'), ('Body Butter - Vanilla Coconut', 'vanillaCoconut'), ('Bambucké máslo BIO 200', 'shea'),
               ('Ovesný tělový krém - Mango', 'mango'), ('Ovesný tělový krém - Magnólia', 'magnolia')]:
    put(find(pre), 'body', 'Tělová másla a krémy', {'focus': f})
for pre, f in [('Shimmer oil', 'shimmer'), ('Třpytivý suchý olej Coconut Glitter', 'coconut'), ('Anti-Stretch Mark Oil', 'stretch')]:
    put(find(pre), 'body', 'Tělové oleje', {'focus': f})
BOMBS = [('Exotic Mango', 'fruity', 'mango'), ('Crazy Grape', 'fruity', 'grape'), ('Juicy Orange', 'fruity', 'orange'), ('Calming Lavender', 'relax', 'lavender'),
         ('Lemon Lavender', 'relax', 'lemonLavender'), ('Rose Gold', 'relax', 'rose'), ('Good Night', 'relax', 'goodNight'), ('Fresh Eucalyptus', 'herbal', 'eucalyptus'),
         ('Matcha Detox', 'herbal', 'matcha'), ('Rosemary', 'herbal', 'rosemary'), ('Easy Breath', 'herbal', 'easyBreath'), ('Anise Cinnamon', 'sweet', 'anise'),
         ('Choco Caramel', 'sweet', 'choco'), ('Galaxy', 'fun', 'galaxy'), ('Unicorn', 'fun', 'unicorn'), ('Mermaid Pearl', 'fun', 'mermaid'), ('Black Surprise', 'fun', 'black'),
         ('Starburst', 'fun', 'starburst'), ('Winter Glow', 'fun', 'winter'), ('Flawless Rose', 'relax', 'flawlessRose'), ('Funky Monkey', 'fun', 'monkey')]
for key, fam, f in BOMBS:
    n = next(n for n in by if n.lower().startswith('bath bomb') and key.lower() in n.lower())
    put(n, 'bath', 'Šumivé koule', {'family': fam, 'focus': f})
for pre, f in [('Koupelová sůl - Lemon grass', 'lemongrass'), ('Epsomská sůl s eukalyptem', 'eucalyptus'), ('Epsomská sůl s heřmánkem', 'chamomile'),
               ('Koupelová sůl - Flower garden', 'flowers'), ('Koupelová sůl - Pumpkin spice', 'pumpkin')]:
    put(find(pre), 'bath', 'Koupelové soli', {'focus': f})
for pre in ['Lufa s provázkem', 'Přírodní mořská houba', 'Exfoliační rukavice z BIO konopného vlákna']:
    put(find(pre), 'body', 'Doplňky', {}, role='addon')

# ---- Vlasy ----
for pre, f in [('Tuhý šampon - Black Charcoal', 'charcoal'), ('Tuhý šampón - Dead Sea', 'deadsea'), ('Tuhý šampon – Levandule a meduňka', 'lavenderMelissa'),
               ('Tuhý šampon - Minty Spirulina', 'spirulina'), ('Tuhý šampón - Pink clay', 'pinkClay'), ('Tuhý šampón - Chinin', 'quinine')]:
    put(find(pre), 'hair', 'Tuhé šampony', {'focus': f})
for pre, f in [('Tuhý kondicionér s keratinem', 'keratin'), ('Hair Food s bergamotem', 'hairfood'), ('Exfoliační peeling vlasové pokožky', 'scalpPeel')]:
    put(find(pre), 'hair', 'Kondicionéry a péče', {'focus': f})

MERGE = {'Čisticí pěny': ('Čištění a odličování', 'foam'), 'Odličovací balzámy a oleje': ('Čištění a odličování', 'balmOil'),
         'Plátýnkové a krémové masky': ('Masky', 'sheetCream'), 'Jílové masky': ('Masky', 'clay'), 'Tonika': ('Tonika a květové vody', 'tonic')}
for r in rows.values():
    if r['kind'] in MERGE:
        r['kind'], r['facets']['family'] = MERGE[r['kind']]
    elif r['kind'] == 'Květové vody':
        r['kind'] = 'Tonika a květové vody'
out = [r for r in rows.values() if r['available']]
json.dump(out, open(OUT, 'w'), ensure_ascii=False, indent=1)
from collections import Counter
print(len(out), Counter(r['category'] for r in out), 'nedostupné:', [r['name'][:30] for r in rows.values() if not r['available']])
print(Counter((r['kind'], r['facets'].get('family')) for r in out))
