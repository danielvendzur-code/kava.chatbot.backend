"""Séria 3 (Andreine) – Mydlo z farmy (mydlozfarmy.sk, Shoptet): ručne robené mydlá s kozím mliekom a prírodná starostlivosť v natívnom poradcovi Andreine.
Krok 1 = druh produktu (mydlo, tuhý šampuk, telové maslo, balzam na pery) podľa kategórie e-shopu;
krok 2 (mydlá) = charakter mydla podľa kategórií e-shopu: jemné, bylinkové, korenisté, svieže, dámske, pánske.
Popisy iba z krátkeho popisu e-shopu bez viet so zdravotnými tvrdeniami. Esenciálne oleje (zdravotné tvrdenia), zubné kefky, difuzér a doplnky sa nepreberajú.
python3 -I tools/s3a/build_mydlozfarmy.py DIR"""
import sys, os, re, json, html as H
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import photo
DIR = sys.argv[1]; CHECKED = '2026-11-06'; SLUG = 'mydlozfarmy'; WEB = 'https://www.mydlozfarmy.sk'
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
CHAR = {'jemne_mydla': 's3Gentle', 'koreniste_mydla': 's3Spicy', 'svieze_mydla': 's3Fresh', 'bylinkove-mydla': 's3Herbal', 'damske_mydla': 's3Women', 'panske_mydla': 's3Men'}
USE = {'mydla': ('s3Soap', 'Mydlá'), 'sampuky': ('s3Hair', 'Tuhé šampuky'), 'balzamytelove': ('s3Butter', 'Telové maslá'), 'balzamynapery': ('s3Lips', 'Balzamy na pery')}
CLAIM = r'liečb|lieči|hojiv|hoji|akn|ekzém|lupienk|antibakt|antisept|plesň|celulit|hormón|zápal|choroba|ochoren|bolest|reum|imunit'
ING = [('s3LavSage', r'šalvi'), ('s3LavRosemary', r'levanduľa a rozmarín'), ('s3Geranium', r'letný večer'), ('s3Lavender', r'levanduľ'), ('s3Mint', r'mät'), ('s3Nettle', r'žihľav'),
       ('s3Poppy', r'mak'), ('s3Argan', r'argán'), ('s3Olive', r'hodváb|olivov'), ('s3Hemp', r'konop'), ('s3Carrot', r'mrkv'), ('s3Buckthorn', r'rakytník'), ('s3Oats', r'vločk|ovsen'),
       ('s3Coffee', r'káv'), ('s3Dragon', r'dračia krv'), ('s3Citrus', r'venezia|citrusov'), ('s3Lemonbalm', r'medovk'), ('s3Mandarin', r'mandarin'), ('s3Cedar', r'céder|cédr'),
       ('s3SeaSalt', r'morsk'), ('s3Rosemary', r'rozmarín'), ('s3Cinnamon', r'škoric'), ('s3Herbs', r'bylin')]
KINDS = {'s3Gentle': 'Jemné mydlá', 's3Spicy': 'Korenisté mydlá', 's3Fresh': 'Svieže mydlá', 's3Herbal': 'Bylinkové mydlá', 's3Women': 'Dámske mydlá', 's3Men': 'Pánske mydlá'}
txt = lambda h: re.sub(r'\s+', ' ', H.unescape(re.sub(r'<[^>]+>', ' ', h or '').replace('​', ''))).strip()
member = {}
for c in CHAR:
    for u in re.findall(r'<a href="([^"]+)" class="name"', open(f'{DIR}/c-{c}.html', encoding='utf-8', errors='replace').read()):
        member.setdefault(u, []).append(c)
out = []
for u in [l.strip() for l in open(f'{DIR}/u2.txt') if l.strip()]:
    f = f'{DIR}/p{u.replace("/", "_")}.html'
    if not os.path.exists(f): continue
    top = u.strip('/').split('/')[0]
    use = USE.get('mydla' if top in CHAR or top == 'mydla' else top)
    if not use: print('MIMO', u); continue
    h = open(f, encoding='utf-8', errors='replace').read()
    name = txt(re.search(r'<h1[^>]*>(.*?)</h1>', h, re.S).group(1))
    if re.search(r'mini', name, re.I): print('MIMO (menšie balenie rovnakého produktu)', name); continue
    pm = re.search(r'itemprop="price" content="([\d.]+)"', h)
    if not pm or 'schema.org/InStock' not in h: print('VYRADENÉ (cena/sklad)', name); continue
    short = txt((re.search(r'class="p-short-description"[^>]*>(.*?)</div>', h, re.S) or [None, ''])[1])
    sents = [x for x in re.split(r'(?<=[.!?])\s+', short.replace('Prírodn é', 'Prírodné')) if x and not re.search(CLAIM, x, re.I)]
    desc = ' '.join(sents[:2])[:280]
    if use[0] == 's3Soap':
        cs = [top] if top in CHAR else member.get(u, [])
        order = ['jemne_mydla', 'koreniste_mydla', 'svieze_mydla', 'bylinkove-mydla', 'damske_mydla', 'panske_mydla']
        cs = sorted(set(cs), key=order.index)
        if not cs: print('VYRADENÉ (bez kategórie charakteru)', name); continue
        focus = CHAR[cs[0]]
    else:
        focus = {'s3Hair': 's3HairWash', 's3Butter': 's3BodyCare', 's3Lips': 's3LipCare'}[use[0]]
    # s3a: krok 1 = druh (pri mydlách charakter z kategórie e-shopu), krok 2 = hlavná zložka podľa názvu a zloženia v krátkom popise
    if use[0] == 's3Soap':
        char = focus
        focus = next((k for k, rx in ING if re.search(rx, (name + ' ' + short).lower())), None)
        if not focus: print('VYRADENÉ (hlavná zložka nejasná)', name); continue
    else:
        char = use[0]
    if not desc:
        desc = {'s3Lips': 'Balzam na pery v biokvalite, v plechovke.', 's3Soap': 'Ručne robené mydlo z kategórie ' + {'s3Gentle': 'jemné', 's3Spicy': 'korenisté', 's3Fresh': 'svieže', 's3Herbal': 'bylinkové', 's3Women': 'dámske', 's3Men': 'pánske'}.get(char, '') + ' mydlá.'}.get(use[0], name + '.')
    price = float(pm.group(1))
    img = (re.search(r'og:image" content="([^"]+)"', h) or [None, None])[1]
    vol = re.search(r'(\d+)\s*(g|ml)\b', short + ' ' + txt((re.search(r'id="description"(.*?)productDiscussion', h, re.S) or [None, ''])[1])[:2000])
    pid = u.strip('/').split('/')[-1]
    out.append({'id': pid, 'name': name, 'url': WEB + u, 'priceAmount': price, 'currency': 'EUR', 'price': f'{price:.2f} €'.replace('.', ','), 'volume': (vol.group(1) + ' ' + vol.group(2)) if vol else '',
        'variantLabel': '', 'category': 'body', 'kind': KINDS.get(char, use[1]), 'tags': ['sensitive'] if char == 's3Gentle' else [], 'photo': photo(SLUG, H.unescape(img) if img else None, pid), 'available': True, 'isSample': False,
        'description': desc, 'reason': desc,
        'source': {'url': WEB + u, 'verifiedAt': CHECKED, 'stock': 'InStock', 'priceFrom': False,
                   'selectionTraits': {'careUse': char, 'purpose': char, 'skinFocus': focus},
                   'selectionTraitsEvidence': 'kategórie e-shopu mydlozfarmy.sk: ' + (', '.join(cs) if use[0] == 's3Soap' else top),
                   'suitabilitySource': 'kategória e-shopu', 'descriptionSource': 'krátky popis e-shopu bez zdravotných tvrdení', 'allSkinTypes': True}})
out = [p for p in out if p['photo']]
# najviac 25: všetky druhy ostávajú; uberá sa posledné mydlo z najpočetnejšej skupiny charakteru
while len(out) > 25:
    from collections import Counter
    key = lambda p: p['source']['selectionTraits']['careUse']
    big = Counter(map(key, out)).most_common(1)[0][0]
    drop = [p for p in out if key(p) == big][-1]; print('NAD LIMIT 25 (vynechané)', drop['name']); out.remove(drop)
cat = {'verifiedAt': CHECKED + 'T08:00:00Z', 'source': WEB + '/', 'collectionMethod': 'kategórie Mydlá (jemné, bylinkové, korenisté, svieže, dámske, pánske), Šampuky, Telové a pery balzamy e-shopu mydlozfarmy.sk (Shoptet), ' + CHECKED,
       'excluded': ['esenciálne oleje (zdravotné tvrdenia)', 'zubné kefky, difuzér, hubky, lufy, pemza a mydlovničky', 'mini balenie bambuckého masla (rovnaký produkt)'], 'products': out}
open(f'{ROOT}/catalogues/{SLUG}.js', 'w').write('/* Séria 3 (Andreine) – Mydlo z farmy: ' + str(len(out)) + ' dostupných produktov (' + CHECKED + '). Generované: tools/s3a/build_mydlozfarmy.py. */\nglobalThis.CX_CATALOGUES ||= {};\nglobalThis.CX_CATALOGUES["' + SLUG + '"] = ' + json.dumps(cat, ensure_ascii=False) + ';\n')
for p in out: print(p['name'], '|', p['kind'], p['source']['selectionTraits']['skinFocus'], p['price'], p['volume'], '|', p['description'][:70])
