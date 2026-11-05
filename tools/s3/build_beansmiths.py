"""Séria 3 – Beansmith's (beansmiths.com, WooCommerce Store API, verejné údaje e-shopu).
python3 -I tools/s3/build_beansmiths.py RAWDIR  (RAWDIR = list.json + variations.json z woo_fetch.py)"""
import sys, json, re, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import txt, sentences, photo, write_coffee, region_of, process_label
RAW = sys.argv[1]; CHECKED = '2026-11-05'; SLUG = 'beansmiths'
ps = json.load(open(f'{RAW}/list.json')); var = json.load(open(f'{RAW}/variations.json'))
TASTE = {'nízká': 'choco', 'střední': 'fruitFull', 'vysoká': 'fresh'}
PACKS = {'250-g': 250, '1-kg': 1000}  # spotrebiteľské balenia; 2,5 kg a balenia „Bezobal“ (gastro) sa neponúkajú
def field(sd, label):
    m = re.search(label + r'\s*\|?\s*:\s*\|?\s*([^|]+)', sd); return m.group(1).strip() if m else ''
products, report = [], []
for p in ps:
    cats = {c['name'] for c in p['categories']}
    if '/en/' in p['permalink'] or not cats & {'Espresso', 'Filtr'} or re.search(r'Coffee Bags|Test Roast', p['name']): continue
    attrs = {a['name']: [t['name'] for t in a['terms']] for a in p['attributes']}
    sd = re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', '|', p['short_description'] or '')).replace('&nbsp;', ' ')
    import html as H; sd = H.unescape(sd)
    prep = field(sd, 'Doporučená příprava').lower()
    preps = []
    if 'Espresso' in cats or 'espresso' in prep or 'automat' in prep: preps.append('espresso')
    if 'Filtr' in cats or 'filtr' in prep: preps.append('filter')
    tastes = [TASTE[a.lower()] for a in attrs.get('Acidita', []) if a.lower() in TASTE]
    decaf = bool(re.search(r'decaf', p['name'] + ' ' + field(sd, 'Metoda zpracování'), re.I))
    countries = attrs.get('Země původu', [])
    notes = [n.strip() for n in re.split(r',', field(sd, 'Chuťový profil')) if n.strip() and n.strip() not in ('–', '-')]
    automat = 'automat' in prep or 'Automatický' in p['name']
    variants = []
    for v in p['variations']:
        val = v['attributes'][0]['value'] if v['attributes'] else ''
        x = var.get(str(v['id']))
        if val not in PACKS or not x: continue
        variants.append({'grams': PACKS[val], 'grind': 'zrnková', 'price': int(x['prices']['price']), 'url': x['permalink'], 'available': bool(x['is_in_stock']),
                         'verifiedAt': CHECKED, 'source': 'WooCommerce Store API e-shopu beansmiths.com (verejné ceny variantov, ' + CHECKED + ')'})
    variants = [v for v in variants if v['available']]
    if not variants or not tastes or not preps:
        report.append(('VYRADENÉ', p['name'], len(variants), tastes, preps)); continue
    name = H.unescape(p['name']).replace(' – Automatický kávovar', ' – pro automatický kávovar')
    pid = p['permalink'].rstrip('/').split('/')[-1]
    desc = txt(p['description'])
    img = (p['images'] or [{}])[0].get('src')
    prod = {'id': pid, 'kind': 'coffee', 'name': name, 'url': p['permalink'], 'photo': photo(SLUG, img, pid) or img, 'photoRemote': False,
            'currency': 'CZK', 'available': True, 'decaf': decaf, 'preps': preps,
            'roastLabel': 'pražení pro automatický kávovar' if automat else ('pražení na espresso' if preps == ['espresso'] else 'pražení na filtr' if preps == ['filter'] else 'pražení na espresso i filtr'),
            'prepText': field(sd, 'Doporučená příprava') or ', '.join(sorted(cats & {'Espresso', 'Filtr'})), 'taste': tastes[0], 'tastes': tastes,
            'acidityLabel': ', '.join(attrs.get('Acidita', [])), 'notes': notes,
            'origin': ' · '.join(x for x in [', '.join(countries), field(sd, 'Oblast')] if x), 'region': region_of(countries),
            'process': process_label(field(sd, 'Metoda zpracování')), 'variety': field(sd, 'Odrůda') or None,
            'summary': sentences(desc, 2), 'series': ', '.join(attrs.get('Edice', [])) or None,
            'priceFrom': min(v['price'] for v in variants), 'priceTo': max(v['price'] for v in variants), 'weights': [v['grams'] for v in variants],
            'variants': variants, 'checkedAt': CHECKED,
            'source': {'url': p['permalink'], 'verifiedAt': CHECKED, 'facts': 'Acidita, Chutě, Země původu (atributy e-shopu); Oblast, Odrůda, Metoda zpracování, Chuťový profil, Doporučená příprava (krátky popis produktu)'}}
    if decaf: prod['decafNote'] = 'Bez kofeinu podle pražírny (' + field(sd, 'Metoda zpracování') + ').'
    if automat: prod['packNote'] = 'Pražírna ji praží tak, aby se dobře vyextrahovala i v automatickém kávovaru.'
    products.append(prod)
DATA = {'slug': SLUG, 'lang': 'cs', 'checkedAt': CHECKED, 'beansOnly': True, 'demo': {'heroProductId': 'core-of-espresso'},
  'brand': {'name': "Beansmith's", 'legal': "Beansmith's", 'place': "Beansmith's · pražírna výběrové kávy", 'shopUrl': 'https://beansmiths.com/kategorie-produktu/kava/',
            'web': 'https://beansmiths.com/', 'logo': '/assets/s3/beansmiths/logo.png', 'hero': '/assets/s3/beansmiths/core-of-espresso.jpg',
            'contact': 'roastery@beansmiths.com', 'contactSource': 'https://beansmiths.com/kontakt/',
            'theme': {'ink': '#1d1d1b', 'brand': '#1d1d1b', 'accent': '#b3432f', 'soft': '#f2ebe1', 'paper': '#ffffff'}},
  'tasteLabels': {'choco': ['Čokoládová a jemná', 'Nízká kyselost podle pražírny'], 'fruitFull': ['Vyvážená s ovocem', 'Střední kyselost podle pražírny'],
                  'fresh': ['Svěží a šťavnatá', 'Vysoká kyselost podle pražírny'], 'decaf': ['Bez kofeinu', 'Káva i na večer']},
  'scope': f'{len(products)} zrnkových káv z e-shopu beansmiths.com ({CHECKED}): balení 250 g a 1 kg se stavem „skladem“. Velkoobchodní balení (2,5 kg a „Bezobal“), kávové sáčky, předplatné, čaje a příslušenství nejsou ve výběru.',
  'excluded': ['velkoobchodní balení 2,5 kg a „Bezobal“ (2–10 kg)', 'kávové louhovací sáčky, předplatné, čaje, příslušenství a merch', 'Test Roast (testovací pražení)'],
  'shop': {'freeShipping': '', 'shippingNote': '', 'freeShippingSource': 'https://beansmiths.com/'},
  'chips': ['Káva do automatu', 'Káva na filtr', 'Máte kávu bez kofeinu?', 'Co je méně kyselé?'],
  'commercialNote': '', 'products': products, 'sets': [], 'held': []}
write_coffee(SLUG, DATA, "Beansmith's – séria 3 (447 € + 10 €/měs.): katalog z WooCommerce Store API e-shopu beansmiths.com (" + CHECKED + "), ceny přesných variant 250 g / 1 kg. Vygenerováno: tools/s3/build_beansmiths.py.")
for r in report: print(*r)
print(len(products), 'káv', sum(len(p['variants']) for p in products), 'variant')
