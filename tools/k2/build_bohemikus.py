"""k2 – katalóg Mydlárna Bohemikus (bohemikus.cz) – mydlá, tuhé šampóny a sady. Údaje: text produktových stránok (cena „Vaše cena“, dostupnosť).
python3 -I tools/k2/build_bohemikus.py RAW/products.json OUT
Mimo výberu: masti z „Domácí lékárny“ (zdravotné použitie), polovičné 40g mydlá, 32g šampóny, nedostupné položky."""
import sys, json, re

RAW, OUT = sys.argv[1], sys.argv[2]
CHECKED = '2026-10-29'
ps = json.load(open(RAW))
by = {p['url'].rstrip('/').rsplit('/', 1)[-1]: p for p in ps}
BAD = re.compile(r'Kč|ekzém|léč|hojen|hojí|antimykot|afrodiz|desinf|dezinf|nemoc|zánět|Cena za', re.I)


def lead(p):
    t = p['pageText']; i = t.find('Popis produktu:')
    s = t[i + 15:] if i >= 0 else t
    s = re.split(r'Vaše cena|Výběr velikosti|Obsah:|Popis produktu|Cena za 1', s)[0]
    return re.sub(r'\b([A-ZŽŠČŘ]) (?=[a-zžščřďťňáéíóúůý])', r'\1', s).strip()   # „V yrobené“ → „Vyrobené“


def first(p):
    for x in [x.strip() for x in re.split(r'(?<=[.!?])\s+', lead(p)) if x.strip()]:
        if 35 <= len(x) <= 240 and not BAD.search(x): return x
    return ''


def price(p):
    return float(re.search(r'Vaše cena:\s*([\d ]+)\s*Kč', p['pageText']).group(1).replace(' ', ''))


rows = {}
def put(slug, cat, kind, facets, name=None, vol='80 g', role=None, set_=None, evidence='popis produktu na e-shopu'):
    p = by[slug]; t = p['pageText']; amount = price(p)
    nm = name or p['title'].split(' - Mydlárna')[0].strip()
    d = first(p)
    r = {'id': 'bohemikus-' + slug.strip('-'), 'name': nm, 'url': p['url'], 'priceAmount': amount, 'currency': 'CZK', 'price': f'{int(amount)} Kč',
         'volume': vol, 'variantLabel': vol, 'category': cat, 'kind': kind, 'tags': [], 'photo': p.get('ogImage'),
         'available': 'Dostupnost: Skladem' in t, 'isSample': False, 'description': d, 'reason': d, 'facets': {'scope': 'set' if set_ else 'single', **facets},
         'source': {'url': p['url'], 'verifiedAt': CHECKED, 'category': kind, 'stock': 'InStock' if 'Dostupnost: Skladem' in t else 'OutOfStock', 'priceFrom': False,
                    'imageUrl': p.get('ogImage'), 'suitabilityEvidence': evidence, 'suitabilitySource': 'official product page description'}}
    # zloženie zo stránky produktu („Složení: …“) – chat podľa neho overuje požadované aj vylúčené zložky
    m = re.search(r'Složení:\s*(.+?)\s*(?:Cena za|Hmotnost:|Další produkty)', t)
    if m and not m.group(1).lower().startswith('viz'): r['inci'] = m.group(1).strip().rstrip(',').strip()
    if role: r['role'] = role
    if set_: r['set'] = set_
    rows[slug] = r
    return r['id']


# ---- Mýdla ----
JOG = put('jogurtove-mydlo-ciste', 'soap', 'Mýdla', {'family': 'gentle', 'focus': 'yogurt'}, name='Jogurtové mýdlo – čisté', evidence='popis: vhodné pro extra citlivou pokožku')
HON = put('prirodni-mydlo-medova-princezna', 'soap', 'Mýdla', {'family': 'gentle', 'focus': 'honey'}, evidence='popis: vhodné na nejcitlivější části těla')
BP = put('solne-mydlo-bila-pani', 'soap', 'Mýdla', {'family': 'gentle', 'focus': 'unscented'}, evidence='popis: neparfémované')
VD = put('jogurtove-mydlo-vzacna-divoska', 'soap', 'Mýdla', {'family': 'gentle', 'focus': 'almond'}, evidence='popis: mandlový olej k péči o citlivou pleť')
put('mydlo-s-aktivnim-uhlim-cerna-perla', 'soap', 'Mýdla', {'family': 'problem', 'focus': 'charcoal'}, evidence='popis: vhodné pro problematickou pleť')
SD = put('jogurtove-mydlo-santalovy-divoch', 'soap', 'Mýdla', {'family': 'problem', 'focus': 'sandal'}, evidence='popis: santalový prášek k čištění ucpaných pórů')
DB = put('-jogurtove-mydlo-draci-bojovnice', 'soap', 'Mýdla', {'family': 'problem', 'focus': 'dragon'}, name='Jogurtové mýdlo Dračí bojovnice', evidence='popis: patchouli pomáhá proti akné')
LP = put('prirodni-levandulove-mydlo-lady-provence', 'soap', 'Mýdla', {'family': 'lavender', 'focus': 'provence'})
KJ = put('solne-mydlo-kralovna-jihu', 'soap', 'Mýdla', {'family': 'lavender', 'focus': 'south'}, name='Solné mýdlo Královna jihu')
KR = put('solne-mydlo-kralovna-ruzi', 'soap', 'Mýdla', {'family': 'care', 'focus': 'rose'}, evidence='popis: olej z růžového dřeva pro suchou a ochablou pleť')
LM = put('kavove-mydlo-lady-mocca', 'soap', 'Mýdla', {'family': 'care', 'focus': 'coffee'}, evidence='popis: jemně mletá káva pro šetrný peeling')

# sady – vlastné kroky aj „hotová sada“ pri produkte, ktorý obsahujú (ignoreKeys)
put('levandulove-mydlo-sada-se-sirupem', 'soap', 'Mýdla', {'family': 'lavender', 'focus': 'lavSyrup'}, name='Levandulová sada se sirupem', vol='',
    set_={'contains': [LP, KJ], 'ignoreKeys': ['focus'], 'containsNames': ['Přírodní levandulové mýdlo Lady Provence', 'Solné mýdlo Královna jihu', 'Levandulový sirup 0,2 l']})
put('levandulova-sada-xxl', 'soap', 'Mýdla', {'family': 'lavender', 'focus': 'lavXXL'}, vol='',
    set_={'contains': [LP, KJ], 'containsNames': ['Solné mýdlo Královna jihu 80 g', 'Přírodní levandulové mýdlo Lady Provence 80 g', 'Levandulový sirup 0,2 l',
                                                  'Bambucké máslo s levandulí a zinkem 50 g', 'Kytička sušené levandule', 'Bavlněný sáček se sušenou levandulí']})
put('kavova-sada-mydel', 'soap', 'Mýdla', {'family': 'care', 'focus': 'coffeeSet'}, vol='',
    set_={'contains': [LM], 'ignoreKeys': ['focus'], 'containsNames': ['Kávové mýdlo Lady Mocca', 'Vánoční káva z Ústecké pražírny']})
put('sada-solnych-mydel', 'soap', 'Mýdla', {'family': 'sets', 'focus': 'saltTrio'}, vol='110 g',
    set_={'contains': [BP, KJ, KR], 'ignoreKeys': ['family', 'focus'], 'containsNames': ['Solné mýdlo Královna jihu (menší)', 'Solné mýdlo Královna růží (menší)', 'Solné mýdlo Bílá paní (menší)']})
put('sada-jogurtovych-mydel', 'soap', 'Mýdla', {'family': 'sets', 'focus': 'yogurtFour'}, vol='108 g',
    set_={'contains': [JOG, VD, SD, DB], 'ignoreKeys': ['family', 'focus'], 'containsNames': ['Jogurtové mýdlo – čisté (malé)', 'Vzácná divoška (malé)', 'Santalový divoch (malé)', 'Dračí bojovnice (malé)']})
put('darkova-mydla-jogurtova-mala', 'soap', 'Mýdla', {'family': 'sets', 'focus': 'yogurtGift'}, vol='4 × 27 g',
    set_={'contains': [JOG, VD, SD, DB], 'containsNames': ['Jogurtové mýdlo s BIO bambuckým máslem 27 g', 'Vzácná divoška 27 g', 'Santalový divoch 27 g', 'Dračí bojovnice 27 g']})
put('darkova-sada-mydel-kralovny', 'soap', 'Mýdla', {'family': 'sets', 'focus': 'queens'}, vol='3 × 80 g',
    set_={'contains': [BP, KJ, KR], 'containsNames': ['Solné mýdlo Bílá paní', 'Solné mýdlo Královna jihu', 'Solné mýdlo Královna růží']})

# ---- Vlasy ----
NET = put('tuhy-sampon-s-koprivou-a-ovesnym-hedvabim', 'hair', 'Tuhé šampony', {'focus': 'nettle'}, vol='65 g', evidence='popis: kopřiva pomáhá s mastnými vlasy')
put('tuhy-sampon-s-hermankem-a-ovesnym-hedvabim', 'hair', 'Tuhé šampony', {'focus': 'chamomile'}, vol='65 g', evidence='popis: šampon pro normální a mastné vlasy')
put('tuhy-sampon-s-neemovym-pudrem-a-matou', 'hair', 'Tuhé šampony', {'focus': 'neemMint'}, vol='65 g', evidence='popis: šampon pro normální a mastné vlasy')

out = [r for r in rows.values() if r['available']]
json.dump(out, open(OUT, 'w'), ensure_ascii=False, indent=1)
from collections import Counter
print(len(out), Counter(r['category'] for r in out), 'nedostupné:', [r['name'][:30] for r in rows.values() if not r['available']])
for r in out: print(r['id'], r['priceAmount'], r['facets'], '|', r['description'][:100])
