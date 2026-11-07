"""Séria 4 – Ambere (ambere.cz, Shoptet; Ambere s.r.o., IČO 08256519). Zdroj: kategórie KÁVA AMBERE, Espresso směsi, Káva na filtr,
Mikroloty; z karty produktu parametre Kyselost / Tělo / Hořkost (slovné hodnoty pražírny – zobrazujú sa slovom, nie ako vymyslené čísla),
Profil pražení, Chuťový profil / Chuťové tóny, Způsob přípravy; ceny a sklad zrnkových variant (150 g – 1 kg) zo Shoptet dát.
Zvýhodněné balíčky (2–3 kávy) a kávy iba „Objednáno“ (nie skladom) sa nepreberajú.
python3 -I tools/s4/build_ambere.py DIR_S_products.json"""
import sys, os, re, json
sys.path.insert(0, os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 's3a'))
from common import sentences, photo, write_coffee
DIR = sys.argv[1]; CHECKED = '2026-11-07'; SLUG = 'ambere'; WEB = 'https://www.ambere.cz'
P = json.load(open(f'{DIR}/products.json'))
CO = {'BRAZÍLIE': ('Brazílie', 'americas'), 'GUATEMALA': ('Guatemala', 'americas'), 'HONDURAS': ('Honduras', 'americas'), 'INDONÉSIE': ('Indonésie', 'asia'), 'KOSTARIKA': ('Kostarika', 'americas'),
      'MEXIKO': ('Mexiko', 'americas'), 'NIKARAGUA': ('Nikaragua', 'americas'), 'ETIOPIE': ('Etiopie', 'africa'), 'PERU': ('Peru', 'americas'), 'KOLUMBIE': ('Kolumbie', 'americas'),
      'INDIE': ('Indie', 'asia'), 'KEŇA': ('Keňa', 'africa'), 'BURUNDI': ('Burundi', 'africa'), 'TANZÁNIE': ('Tanzanie', 'africa'), 'DOMINIKÁNSKÁ': ('Dominikánská republika', 'americas')}
FRUIT = r'višeň|mandarin|pomeranč|citr|hrozn|rozin|fík|broskev|ostruži|rybíz|angrešt|bergamot|černý čaj'
ACR = {'SHG', 'SHB', 'EP', 'AA', 'AB'}
def nice(n):
    n = re.sub(r'\s*-?\s*KÁVA AMBERE\s*$|\s+AMBERE\s*$|^KÁVA AMBERE\s*|^AMBERE\s+', '', n.strip())
    w = [x if x in ACR or not x.isupper() or not x.strip(',').isalpha() else (x.capitalize() if i == 0 or x not in ('DE', 'DO') else x.lower()) for i, x in enumerate(n.split())]
    return ' '.join(w).replace(' - ', ' – ')
products = []
for p in P:
    pr = {k.strip(): v.strip() for k, v in p['params'].items()}
    if re.search(r'BALÍČEK|\+', p['name']): print('MIMO (zvýhodněný balíček)', p['name']); continue
    vs = []
    for v in p['variants']:
        m = re.fullmatch(r'Zrnková / (\d+)\s*g', (v['name'] or '').strip())
        if not m or v.get('soldOut') or v['avail'] != 'Skladem': continue
        vs.append({'grams': int(m.group(1)), 'grind': 'zrnková', 'price': float(v['price']), 'url': p['url'], 'available': True, 'verifiedAt': CHECKED,
                   'source': f"Shoptet varianta {v.get('sku')} (ambere.cz, {CHECKED}): {v['name']}, Skladem"})
    if not vs: print('VYRADENÉ (zrnková nie je skladom)', p['name']); continue
    vs.sort(key=lambda v: v['grams'])
    zp = pr.get('Způsob přípravy', '').lower()
    preps = sorted({x for x, rx in (('espresso', r'espresso|automat|moka|turec'), ('filter', r'filtr|french|cold brew')) if re.search(rx, zp)})
    roast = pr.get('Profil pražení', '')
    if not preps and re.match(r'1', roast): preps = ['filter']
    if not preps: print('VYRADENÉ (príprava neuvedená)', p['name']); continue
    tones = pr.get('Chuťový profil') or pr.get('Chuťové tóny') or ''
    notes = [re.sub(r'^(a|i)\s+', '', n.strip(' .')).lower() for n in re.split(r',|•| a ', tones) if n.strip(' .')]
    notes = [n.replace('čokláda', 'čokoláda').replace('ořísky', 'oříšky') for n in notes if len(n) <= 26][:4]
    kys = pr.get('Kyselost', '').lower()
    taste = 'fresh' if re.search(r'vyšší|střední', kys) else 'fruitFull' if re.search(FRUIT, tones.lower()) else 'choco'
    first = p['name'].split()[0].upper().strip(',:')
    co = CO.get(first)
    blend = not co
    profile = [{'name': k, 'text': pr[k].lower()} for k in ('Kyselost', 'Tělo', 'Hořkost') if pr.get(k)]
    pid = p['url'].rstrip('/').split('/')[-1]
    products.append({'id': pid, 'kind': 'coffee', 'name': nice(p['name']), 'url': p['url'], 'photo': photo(SLUG, p['img'].replace('&amp;', '&'), pid), 'photoRemote': False,
        'currency': 'CZK', 'available': True, 'decaf': False, 'preps': preps, 'roastLabel': re.sub(r'^\d\s*[•\-]\s*', '', roast).strip().lower() or None, 'prepText': pr.get('Způsob přípravy'),
        'taste': taste, 'tastes': [taste], 'tasteSource': 'parametry e-shopu: kyselost ' + (kys or 'neuvedena') + (', tělo ' + pr['Tělo'].lower() if pr.get('Tělo') else '') + (', hořkost ' + pr['Hořkost'].lower() if pr.get('Hořkost') else '') + '; chuťový profil ' + (tones or 'neuveden'),
        'tasteProfile': profile, 'notes': notes, 'origin': 'směs' if blend else co[0], 'region': 'blend' if blend else co[1], 'process': None, 'variety': None, 'summary': sentences(p['short'], 2),
        'priceFrom': vs[0]['price'], 'priceTo': max(v['price'] for v in vs), 'weights': [v['grams'] for v in vs], 'variants': vs, 'checkedAt': CHECKED,
        'source': {'url': p['url'], 'verifiedAt': CHECKED, 'facts': 'parametry produktu (kyselost, tělo, hořkost, profil pražení, chuťový profil, způsob přípravy), krátký popis; ceny a sklad zrnkových variant'}})
products = [p for p in products if p['photo']][:25]
DATA = {'slug': SLUG, 'lang': 'cs', 'checkedAt': CHECKED, 'beansOnly': True, 'altFallback': True, 'demo': {'heroProductId': products[0]['id']},
  'brand': {'name': 'Ambere', 'legal': 'Ambere s.r.o.', 'place': 'Ambere · pražírna výběrové kávy', 'shopUrl': WEB + '/kava-ambere/', 'web': WEB + '/',
            'logo': '/assets/s3/ambere/logo.png', 'hero': products[0]['photo'], 'contact': 'obchod.ambere@seznam.cz', 'contactSource': WEB + '/doprava-a-platba/',
            'theme': {'ink': '#3a2e28', 'brand': '#3a2e28', 'accent': '#b59a6a', 'soft': '#f6f1e9', 'paper': '#ffffff'}},
  'tasteLabels': {'choco': ['Čokoládová, bez kyselosti', 'Čokoláda, oříšky, karamel'], 'fruitFull': ['Čokoláda s ovocem', 'Nízká kyselost, ovocný tón'],
                  'fresh': ['Svěží a ovocná', 'Výraznější kyselost, ovoce, čaj'], 'decaf': ['Bez kofeinu', 'Káva i na večer']},
  'scope': f'{len(products)} zrnkových káv z e-shopu ambere.cz ({CHECKED}), ceny a sklad přesných balení.',
  'excluded': ['zvýhodněné balíčky více káv', 'kávy, které nejsou skladem (Objednáno)', 'mletá káva (doporučuje se zrnková)'],
  'addons': {}, 'shop': {'freeShipping': 'Doprava zdarma při objednávce nad 800 Kč.', 'shippingNote': '', 'freeShippingSource': WEB + '/doprava-a-platba/'},
  'chips': ['Káva bez kyselosti', 'Káva na filtr', 'Porovnat 2 kávy', 'Do automatického kávovaru'], 'commercialNote': '', 'products': products, 'sets': [], 'held': []}
write_coffee(SLUG, DATA, 'Ambere – séria 4 (447 € + 10 €/měs.): katalog z e-shopu ambere.cz (' + CHECKED + '). Vygenerováno: tools/s4/build_ambere.py.')
for p in products: print(p['name'], p['preps'], p['taste'], p['notes'], p['roastLabel'], [(v['grams'], v['price']) for v in p['variants']])
