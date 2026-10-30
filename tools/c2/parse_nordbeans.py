"""c2 – rozparsuje primárny zber Nordbeans (Codex, verejné UI 29.–30. 10. 2026) na fakty produktov.
python3 -I tools/c2/parse_nordbeans.py RAW.json OUT.json"""
import sys, json, re
RAW, OUT = sys.argv[1], sys.argv[2]
D = json.load(open(RAW))
KEYS = ['Řada', 'Příprava', 'Chuť', 'Charakteristika', 'Intenzita těla', 'Intenzita kyselosti', 'Farmář', 'Zpracování', 'Odrůda', 'Původ',
        'Lokalita', 'Farma', 'Nadm. výška', 'Spolupráce od roku', 'Složení', 'Stupeň pražení', 'Výrobce / Dodavatel', 'Obsah balení', 'Obsah']
out = []
for p in D['products']:
    t = p['mainText']
    i = t.find('Detaily')
    blk = t[i:] if i >= 0 else t
    lines = [x.strip() for x in blk.split('\n')]
    facts = {}
    j = 0
    while j < len(lines):
        if lines[j] in KEYS:
            k = lines[j]; j += 1
            while j < len(lines) and not lines[j]: j += 1
            if j < len(lines) and k not in facts: facts[k] = lines[j]
        j += 1
    rec = None
    m = re.search(r'RECEPT POSTUP\n(.*?)\n\s*\n', blk, re.S)
    if m: rec = [x.strip() for x in m.group(1).split('\n') if x.strip()]
    cross = []
    c = t.find('Přibalte si také')
    if c >= 0:
        seg = [x.strip() for x in t[c:].split('\n') if x.strip()][2:60]
        for k, x in enumerate(seg):
            if re.fullmatch(r'[\d ]+ Kč', x):
                name = next((seg[q] for q in range(k - 1, -1, -1) if ':' in seg[q] or len(seg[q]) > 14), seg[k - 1])
                cross.append({'name': name, 'price': int(x.replace(' Kč', '').replace(' ', ''))})
    top = p['topText']
    tags = [x for x in ['NOVINKA', 'FILTR', 'ESPRESSO', 'DECAF', 'LIMITED'] if '\n' + x + '\n' in top]
    sec = {}
    for name in ['Charakter', 'Lokalita', 'Zpracování']:
        m = re.search(r'\n' + name + r'\n\n(.+?)\n', blk)
        if m: sec[name] = m.group(1).strip()
    out.append({'name': p['name'], 'url': p['source'], 'photo': p['photo'], 'checkedAt': p['checkedAt'], 'tags': tags, 'facts': facts, 'recipe': rec,
                'sections': sec, 'cross': cross,
                'offers': [{'label': (o['selected'][0]['label'] if o['selected'] else None), 'price': o['priceAmount'], 'url': o['url'],
                            'inStock': o['stockExplicit'] and o['stockText'].startswith('Skladem'), 'stockText': o['stockText'].split(' Ihned')[0]} for o in p['offers']],
                'lead': top.split('\n')[top.split('\n').index(p['name'], 4) + 1:][:6] if p['name'] in top.split('\n')[4:] else []})
json.dump(out, open(OUT, 'w'), ensure_ascii=False, indent=1)
for o in out:
    f = o['facts']
    print(o['name'], '|', o['tags'], '|', f.get('Příprava'), '|', f.get('Chuť'), '|', f.get('Charakteristika'), '|', f.get('Intenzita kyselosti'), '|', f.get('Zpracování'), '|', f.get('Původ'), '|', f.get('Stupeň pražení'), '| rec:', o['recipe'], '| cross:', [(c['name'][:30], c['price']) for c in o['cross']][:4])
