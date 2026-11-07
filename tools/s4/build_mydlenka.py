"""Séria 4 – MýdLenka (mydlenka.cz, Shoptet; Lenka Sojková, IČO 72218533, Šumava) v natívnom poradcovi Andreine.
Krok 1 = oblasť (pleť, vlasy, deodorant, tělo a ruce) podľa kategórií e-shopu; krok 2 = typ pleti podľa kategórií „Péče o normální / citlivou /
suchou / problematickou pleť“ (produkt vo všetkých štyroch = „Pro všechny typy pleti“), typ vlasov podľa názvu šamponu, vôňa deodorantu, druh telovej
starostlivosti. Popisy: neutrálna veta z názvu a kategórie + prvá veta e-shopu bez zdravotných tvrdení. Mýdla, soli do koupele, poukazy a textil sa nepreberajú.
python3 -I tools/s4/build_mydlenka.py DIR"""
import sys, os, re, json
sys.path.insert(0, os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 's3a'))
from common import photo
DIR = sys.argv[1]; CHECKED = '2026-11-07'; SLUG = 'mydlenka'; WEB = 'https://www.mydlenka.cz'
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
P = json.load(open(f'{DIR}/products.json'))
CLAIM = r'zdrav|silnějš|akné|lup|ekzém|zánět|léč|hojí|alerg|mazov|lámav|poškozen|úlev|zázrak|revoluč|mladistv|patent|zápach|podráždění|zklidň'
SKIN = {'/pece-o-normalni-plet/': 's4Normal', '/pece-o-citlivou-plet/': 's4Sensitive', '/pece-o-suchou-plet/': 's4Dry', '/pece-o-problematickou-plet/': 's4Problem'}
# Produkt v dvoch typoch pleti je zaradený k typu, kde e-shop inak nemá samostatný produkt (overené v kategóriách 2026-11-07).
PREFER = {'Pleťové sérum Neroli': 's4Normal', 'Pleťové sérum Lipový květ': 's4Sensitive'}
HAIR = [('jemné', 's4HairFine'), ('mastné', 's4HairOily'), ('normální', 's4HairNormal'), ('suché', 's4HairDry'), ('lupům', 's4HairScalp'), ('kondicionér', 's4HairCond')]
DEO = [('Meduňka', 's4DeoBalm'), ('Pomeranč', 's4DeoOrange'), ('Lemongrass', 's4DeoLemongrass'), ('Harmonie', 's4DeoFloral'), ('Bez parfemace', 's4DeoFree')]
BODY = [('krém na ruce', 's4Hands'), ('tělový balzám', 's4Balm'), ('peeling', 's4Scrub')]
KIND = {'s4Face': 'Péče o pleť', 's4Hair': 'Vlasy', 's4Deo': 'Přírodní deodorant', 's4Body': 'Péče o tělo a ruce'}
out = []
for p in P:
    n, cats = p['name'], p['cats']
    use = focus = None
    if any(c in SKIN for c in cats) and not re.search(r'mýdlo', n, re.I) or n == 'Černý samet pleťové mýdlo':
        sk = [SKIN[c] for c in cats if c in SKIN]
        use = 's4Face'; focus = 's4AllSkin' if len(sk) == 4 else PREFER.get(n, sk[0] if len(sk) == 1 else None)
        if re.search(r'odličovač', n, re.I): focus = 's4MakeupOff'
        if re.search(r'mýdlo', n, re.I): focus = 's4CleanBar'
    elif '/vlasy/' in cats and re.search(r'šampon|kondicionér', n, re.I):
        use = 's4Hair'; focus = next((k for w, k in HAIR if w in n), None)
    elif '/deodoranty/' in cats:
        use = 's4Deo'; focus = next((k for w, k in DEO if w in n), None)
    elif '/pece-o-telo/' in cats:
        use = 's4Body'; focus = next((k for w, k in BODY if w in n.lower()), None)
    if not use or not focus: print('MIMO', n, cats); continue
    vs = [v for v in p['variants'] if not v.get('soldOut') and v['avail'] in ('Skladem', 'InStock') and v['price'] and not re.search(r'mini', v['name'] or '', re.I)]
    if not vs: print('VYRADENÉ (nie je skladom)', n); continue
    v = min(vs, key=lambda v: float(v['price']))
    price = float(v['price'])
    vol = v['name'] if re.search(r'\d+\s*ml', v['name'] or '') else (p['params'].get('Objem ', '') if not p['params'].get('Objem ', '').startswith('Zvolte') else '')
    first = re.split(r'(?<=[.!?])\s+', p['short'].strip())
    first = next((s for s in first if s and not re.search(CLAIM, s, re.I) and len(s) < 220), '')
    base = {'s4Face': 'Pleťová péče MýdLenka', 's4Hair': 'Vlasová péče MýdLenka', 's4Deo': 'Přírodní deodorant bez sody a bez hliníku', 's4Body': 'Tělová péče MýdLenka'}[use]
    if 'Kompletní péče' in n: base = 'Sada péče sestavená e-shopem pro tento typ pleti; cena sady ' + p['params'].get('#cena-sada ', '').strip() + ' místo ' + p['params'].get('#cena-produkty ', '').strip() + ' za produkty jednotlivě'
    desc = (base + '. ' + first).strip()
    pid = p['url'].rstrip('/').split('/')[-1]
    out.append({'id': pid, 'name': n, 'url': p['url'], 'priceAmount': price, 'currency': 'CZK', 'price': f'{price:.0f} Kč', 'volume': vol, 'variantLabel': v['name'] or '',
        'category': 'body', 'kind': 'Sada péče o pleť' if 'Kompletní péče' in n else KIND[use], 'tags': ['sensitive'] if focus in ('s4Sensitive', 's4AllSkin') else [],
        'photo': photo(SLUG, p['img'].replace('&amp;', '&'), pid), 'available': True, 'isSample': False, 'description': desc, 'reason': desc,
        'source': {'url': p['url'], 'verifiedAt': CHECKED, 'stock': 'InStock', 'categoryLocked': True, 'priceFrom': len(vs) > 1, 'variants': [{'label': x['name'], 'price': x['price']} for x in vs],
                   'selectionTraits': {'careUse': use, 'purpose': use, 'skinFocus': focus},
                   'selectionTraitsEvidence': 'kategorie e-shopu mydlenka.cz: ' + ', '.join(c.strip('/') for c in cats),
                   'suitabilitySource': 'kategorie e-shopu (typ pleti / vlasy / deodoranty / péče o tělo)', 'descriptionSource': 'neutrální věta z názvu a kategorie + první věta e-shopu bez zdravotních tvrzení', 'allSkinTypes': focus == 's4AllSkin'}})
out = [p for p in out if p['photo']][:25]
cat = {'verifiedAt': CHECKED + 'T09:00:00Z', 'source': WEB + '/', 'collectionMethod': 'kategorie Péče o pleť (podle typu pleti), Vlasy, Deodoranty, Péče o tělo e-shopu mydlenka.cz (Shoptet), ' + CHECKED,
       'excluded': ['mýdla a soli do koupele', 'dárkové poukazy, textil a cestovní obaly', 'péče o rty a dětská řada MimiLenka'], 'products': out}
open(f'{ROOT}/catalogues/{SLUG}.js', 'w').write('/* Séria 4 – MýdLenka: ' + str(len(out)) + ' dostupných produktů (' + CHECKED + '). Generováno: tools/s4/build_mydlenka.py. */\nglobalThis.CX_CATALOGUES ||= {};\nglobalThis.CX_CATALOGUES["' + SLUG + '"] = ' + json.dumps(cat, ensure_ascii=False) + ';\n')
for p in out: print(p['name'], '|', p['source']['selectionTraits']['careUse'], p['source']['selectionTraits']['skinFocus'], p['price'], p['volume'], '|', p['description'][:90])
