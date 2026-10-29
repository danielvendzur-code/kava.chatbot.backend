"""k2 – katalóg MARK face and body z overených údajov (Shopify products.json, popisy produktov a sád).
python3 -I tools/k2/build_mark.py RAW OUT  (RAW = priečinok s products.json)"""
import sys, json, re, html

RAW, OUT = sys.argv[1], sys.argv[2]
CHECKED = '2026-10-29'
ps = json.load(open(f'{RAW}/products.json'))['products']
by = {p['handle']: p for p in ps}
txt = lambda h: re.sub(r'\s+', ' ', html.unescape(re.sub(r'<style.*?</style>|<(?!/?(?:span|strong|b|em|i|u|a)\b)[^>]+>', ' ', re.sub(r'</?(?:span|strong|b|em|i|u|a)\b[^>]*>', '', h or ''), flags=re.S))).strip()
money = lambda v: f"{v:.2f}".replace('.', ',') + ' €'
SHOP = 'https://www.markscrub.com/products/'

# ---- Pleť: rady MARK (ALL SKIN / SENSITIVE / PROBLEMATIC / AGE THERAPY) podľa názvu a popisu produktu ----
CL_ALL, CL_SENS, CL_PROB, CL_AGE = ('cleanser-makeu-up-remover-all-skin-types', 'mark-cleanser-make-up-remover-pre-citlivu-a-namahanu-plet',
                                    'mark-cleanser-make-up-remover-na-aknoznu-plet', 'mark-cleanser-make-up-remover-age-therapy')
SR_ALL, SR_PROB, SR_AGE = ('mark-prebiotic-hyaluronic-serum-pre-vsetky-typy-pleti', 'mark-prebiotic-hyaluronic-serum-pre-problematicku-plet',
                           'mark-prebiotic-hyaluronic-serum-age-therapy')
CR_ALL, CR_SENS, CR_AGE = ('aktivny-hydratacny-krem-pre-vsetky-typy-pleti', 'intenzivny-upokojujuci-krem-pre-citlivu-plet',
                           'hlbkovy-omladzujuci-krem-s-kmenovymi-bunkami-a-kolagenom')
FACE = {  # handle: (druh, typy pleti, dôkaz)
    CL_ALL: ('Čistiace gély', ['normal'], 'názov: „pre všetky typy pleti“ (rada ALL SKIN)'),
    CL_SENS: ('Čistiace gély', ['sensitive'], 'názov: „pre citlivú a namáhanú pleť“'),
    CL_PROB: ('Čistiace gély', ['blemish'], 'názov: „na aknóznu pleť“'),
    CL_AGE: ('Čistiace gély', ['mature'], 'popis: „pre suchú a zrelú pokožku“ (Age Therapy)'),
    SR_ALL: ('Séra', ['normal', 'sensitive'], 'názov: „pre všetky typy pleti“; súčasť setov SENSITIVE'),
    SR_PROB: ('Séra', ['blemish'], 'názov: „pre problematickú pleť“'),
    SR_AGE: ('Séra', ['mature'], 'názov: Age Therapy'),
    CR_ALL: ('Krémy', ['normal'], 'názov: „pre všetky typy pleti“'),
    CR_SENS: ('Krémy', ['sensitive'], 'názov: „pre citlivú pleť“'),
    CR_AGE: ('Krémy', ['mature'], 'popis: hĺbkový omladzujúci krém (Age Therapy)'),
    'mark-organic-oil-lemongrass': ('Pleťové oleje', ['normal', 'blemish'], 'popis: „vhodné pre všetky typy pleti, špeciálne pre pleť so sklonom k akné“'),
    'mark-organic-oil-coffee': ('Pleťové oleje', ['normal', 'mature'], 'popis: „vhodné pre všetky typy pleti, s výraznými benefitmi pre zrelú pokožku“'),
    'mark-bio-lavender-water': ('Pleťové vody', ['normal', 'sensitive'], 'popis: „vhodná pre všetky typy pleti, vrátane citlivej“'),
    'mark-face-water-damask-rose': ('Pleťové vody', ['normal', 'mature'], 'názov: „s antiage efektom“'),
    'mark-bio-mint-water-osviezujuca-s-chladivym-ucinkom': ('Pleťové vody', ['normal'], 'popis: osviežujúce tonikum'),
    'mark-pink-clay-face-mask': ('Masky a peelingy', ['normal', 'mature'], 'názov: „redukcia vrások a pigmentových škvŕn“'),
    'mark-face-scrub': ('Masky a peelingy', ['blemish'], 'názov: „s tea tree na akné“'),
}
FACE_SETS = {  # handle: (obsah, typy pleti, typ sady)
    'mark-all-skin-set-cleanser-cream': ([CL_ALL, CR_ALL], ['normal'], 'cleanCream'),
    'mark-all-skin-set-cleanser-serum': ([CL_ALL, SR_ALL], ['normal'], 'cleanSerum'),
    'mark-all-skin-set-cistiaci-gel-serum-krem': ([CL_ALL, SR_ALL, CR_ALL], ['normal'], 'trio'),
    'mark-all-skin-set-cleanser-serum-konjac': ([CL_ALL, SR_ALL, 'mark-hubka-na-tvar-s-aktivnym-uhlim'], ['normal'], 'sponge'),
    'mark-set-cistiaci-odlicovaci-gel-konjac-hubka': ([CL_ALL, 'mark-hubka-na-tvar-s-aktivnym-uhlim'], ['normal'], 'sponge'),
    'mark-all-skin-set-serum-organic-oil-coffee': ([SR_ALL, 'mark-organic-oil-coffee'], ['normal'], 'serumOil'),
    'mark-set-pre-intenzivnu-hydrataciu': ([SR_ALL, 'mark-organic-oil-coffee', 'mark-face-water-damask-rose'], ['normal'], 'serumOil'),
    'mark-sensitive-set-cleanser-cream': ([CL_SENS, CR_SENS], ['sensitive'], 'cleanCream'),
    'mark-sensitive-set-cleanser-serum': ([CL_SENS, SR_ALL], ['sensitive'], 'cleanSerum'),
    'mark-sensitive-set-cleanser-serum-cream': ([CL_SENS, SR_ALL, CR_SENS], ['sensitive'], 'trio'),
    'mark-sensitive-set-cleanser-serum-konjac': ([CL_SENS, SR_ALL, 'mark-hubka-na-tvar-zo-zeleneho-caju'], ['sensitive'], 'sponge'),
    'mark-cleanser-pre-citlivu-a-namahanu-plet-mark-hubka-s-extraktom-zo-zeleneho-caju': ([CL_SENS, 'mark-hubka-na-tvar-zo-zeleneho-caju'], ['sensitive'], 'sponge'),
    'mark-age-therapy-set-cleanser-cream': ([CL_AGE, CR_AGE], ['mature'], 'cleanCream'),
    'mark-age-therapy-set-cleanser-serum': ([CL_AGE, SR_AGE], ['mature'], 'cleanSerum'),
    'mark-age-therapy-set-cleanser-serum-cream': ([CL_AGE, SR_AGE, CR_AGE], ['mature'], 'trio'),
    'mark-age-therapy-cleanser-konjac': ([CL_AGE, 'mark-hubka-na-tvar-s-ruzovym-ilom'], ['mature'], 'sponge'),
    'mark-premium-skin-care': ([CL_AGE, SR_AGE, 'mark-pink-clay-face-mask', 'mark-hubka-na-tvar-s-ruzovym-ilom'], ['mature'], 'premium'),
}
# ---- Telo: druh a vôňa/zložka podľa názvu ----
BODY = {
    'mark-coconut': ('Kávové peelingy', 'coconut'), 'mark-peppermint': ('Kávové peelingy', 'peppermint'), 'mark-citrus': ('Kávové peelingy', 'citrus'),
    'mark-coffee-cinnamon-chai': ('Kávové peelingy', 'cinnamon'), 'mark-golden-shine': ('Kávové peelingy', 'golden'), 'mark-simpl-therapy': ('Kávové peelingy', 'cocoa'),
    'mark-sugar-scrub-cinnamon-chai': ('Cukrové peelingy', 'cinnamon'), 'mark-sugar-scrub-nougat': ('Cukrové peelingy', 'nougat'),
    'mark-sugar-scrub-cherry-blossom': ('Cukrové peelingy', 'cherry'), 'mark-sugar-scrub-milk-honey': ('Cukrové peelingy', 'honey'),
    'mark-foot-sugar-scrub-neem-oil-tea-tree': ('Cukrové peelingy', 'feet'),
    'mark-body-butter-orange-cinnamon': ('Telové maslá', 'cinnamon'), 'mark-body-butter-nougat': ('Telové maslá', 'nougat'),
    'shower-pudding-nougat': ('Sprchové pudingy', 'nougat'), 'shower-pudding-peppermint': ('Sprchové pudingy', 'peppermint'),
    'shower-pudding-orange-and-coffee': ('Sprchové pudingy', 'orangeCoffee'),
    'mark-anti-cellulite-shaping-body-oil': ('Telové oleje', 'cellulite'), 'mark-golden-shine-oil': ('Telové oleje', 'golden'), 'mark-organic-argan-oil': ('Telové oleje', 'argan'),
    'mark-mydlo-coffee-peelingove-1': ('Mydlá', 'coffee'), 'mark-jemne-mydlo-calendula-1': ('Mydlá', 'calendula'), 'mark-mydlo-s-aktivnym-ciernym-uhlim': ('Mydlá', 'charcoal'),
    'mark-bath-tea-body-glow': ('Kúpeľové soli', 'glow'), 'mark-bath-tea-body-relax': ('Kúpeľové soli', 'relax'), 'mark-bath-tea-body-love': ('Kúpeľové soli', 'love'),
}
BODY_SETS = {
    'mark-golden-shine-set': (['mark-golden-shine', 'mark-golden-shine-oil'], 'golden'),
    'laska-na-prvy-dotyk': (['mark-bath-tea-body-love', 'mark-sugar-scrub-nougat'], 'love'),
    'mark-anti-cellulite-shaping-body-oil-anticelulitidny-tvarujuci-olej-copy': (['mark-anti-cellulite-shaping-body-oil', 'mark-anticelulitidny-balicek-copy'], 'cellulite'),
}
# ---- Vlasy ----
HAIR = {  # handle: (druh, potreby, dôkaz)
    'mark-hair-shampoo-coffee-lemon': ('Šampóny', ['oily'], 'názov: „pre normálne a mastné vlasy“'),
    'mark-hair-shampoo-rosemary-coffein-s-prebiotikami': ('Šampóny', ['loss'], 'názov: „proti vypadávaniu vlasov a na obnovu ich rastu“'),
    'mark-shampoo-sensitive-scalp': ('Šampóny', ['sensitive'], 'názov: „pre citlivú pokožku hlavy“'),
    'mark-kid-s-shampoo-aloe-bamboo': ('Šampóny', ['kids'], 'názov: „Detský šampón“'),
    'mark-hair-conditioner-vegan-keratin-murumuru-pre-suche-vlasy': ('Kondicionéry a masky', ['dry'], 'názov: „pre suché a poškodené vlasy“'),
    'mark-hair-conditioner-broccoli-oil-prebiotic-pre-vsetky-typy-vlasov': ('Kondicionéry a masky', ['normal'], 'názov: „pre normálne vlasy“; popis: „jemné a krehké vlasy bez objemu“'),
    'hydratacna-maska-na-vlasy': ('Kondicionéry a masky', ['dry', 'normal', 'sensitive'], 'popis: „pre všetky typy vlasov, predovšetkým suché a oslabené… aj pre citlivú vlasovú pokožku“'),
    'mark-body-hair-organic-argan-oil': ('Oleje na vlasy', ['dry'], 'popis: arganový olej na telo a vlasy, ochrana proti vysušovaniu'),
}
HAIR_SETS = {
    'set-shampoo-coffee-lemon-conditioner-broccoli-oil-prebiotic': (['mark-hair-shampoo-coffee-lemon', 'mark-hair-conditioner-broccoli-oil-prebiotic-pre-vsetky-typy-vlasov'], ['oily'], 'normalCond'),
    'set-shampoo-coffee-lemon-conditioner-vegan-keratin': (['mark-hair-shampoo-coffee-lemon', 'mark-hair-conditioner-vegan-keratin-murumuru-pre-suche-vlasy'], ['oily'], 'dryCond'),
    'set-shampoo-rosemary-conditioner-broccoli-oil-prebiotic': (['mark-hair-shampoo-rosemary-coffein-s-prebiotikami', 'mark-hair-conditioner-broccoli-oil-prebiotic-pre-vsetky-typy-vlasov'], ['loss'], 'normalCond'),
    'set-shampoo-rosemary-conditioner-vegan-keratin-murumuru': (['mark-hair-shampoo-rosemary-coffein-s-prebiotikami', 'mark-hair-conditioner-vegan-keratin-murumuru-pre-suche-vlasy'], ['loss'], 'dryCond'),
    'vlasovy-set-sampon-kondicioner-maska': (['mark-hair-shampoo-rosemary-coffein-s-prebiotikami', 'mark-hair-conditioner-broccoli-oil-prebiotic-pre-vsetky-typy-vlasov', 'hydratacna-maska-na-vlasy'], ['loss'], 'complete'),
}
MEN = {'shower-pudding-for-him': ('Sprchové pudingy', 'shower'), 'mark-organic-beard-oil-1': ('Brada a fúzy', 'beardOil'), 'mark-beard-wax': ('Brada a fúzy', 'beardWax')}
MEN_SETS = {
    'mark-set-pre-neho': (['shower-pudding-for-him', 'mark-hair-shampoo-rosemary-coffein-s-prebiotikami', 'mark-organic-beard-oil-1', 'mark-hubka-na-tvar-s-aktivnym-uhlim'], 'beardHair'),
    'men-skin-body-care': (['shower-pudding-for-him', 'mark-organic-beard-oil-1', 'mark-velka-hubka-na-telo-s-aktivnym-uhlim'], 'beardBody'),
}
LIPS = {'mark-lip-balm-oblubeny-kakaovo-kavovy-balzam-s-ochrannym-vitaminom-e': 'Balzamy na pery', 'mark-lip-balm-duo': 'Balzamy na pery', 'mark-coffee-lip-scrub': 'Peelingy na pery'}
LIP_SETS = {'mark-lip-scrub-lip-balm': ['mark-coffee-lip-scrub', 'mark-lip-balm-oblubeny-kakaovo-kavovy-balzam-s-ochrannym-vitaminom-e']}
ADDONS = {'mark-hubka-na-tvar-s-aktivnym-uhlim': 'face', 'mark-hubka-na-tvar-zo-zeleneho-caju': 'face', 'mark-hubka-na-tvar-s-ruzovym-ilom': 'face',
          'mark-hubka-na-telo-s-extraktom-zo-zeleneho-caju-1': 'body', 'mark-velka-hubka-na-telo-s-aktivnym-uhlim': 'body', 'mark-anticelulitidny-balicek-copy': 'body'}


BAD = re.compile(r'objednávke|maximálne \d|vzork|dávkovač|exspir|zadarmo|darček|netestujeme|#mark|--mark', re.I)


def first(t):
    """Prvá zmysluplná veta popisu (bez technických poznámok o vzorke, dávkovači či exspirácii)."""
    t = re.sub(r'^(?:[A-ZÁČĎÉÍĽĹŇÓÔŔŠŤÚÝŽ0-9%&,.\- ]{12,}\s)+', '', t)  # úvodné heslá veľkými písmenami
    U = 'A-ZÁČĎÉÍĽĹŇÓÔŔŠŤÚÝŽ'; l = 'a-záäčďéíľĺňóôŕšťúýž'
    t = re.sub(rf'^[–-]?\s*(?:[{U}0-9%]+\s+)+?(?=MARK\b|[{U}][{l}])', '', t)
    sents = [re.sub(rf'^[{U}][{l}]+(?:, ?[{l} ]+)+ (?=[{U}])', '', x.strip()) for x in re.split(r'(?<=[.!?])\s+', t) if x.strip()]
    sents = [x for x in sents if not re.match(r'(?:Bez |100 ?%)', x)] or sents
    sents = [re.sub(r'^([BCDEFGHJLMNPRTŽŠČŤĎĽŇ]) ([a-záäčďéíľĺňóôŕšťúýž]{2,})', r'\1\2', x) for x in sents]  # „T ento“ z rozdelených značiek
    good = [x for x in sents if 50 <= len(x) <= 300 and not BAD.search(x) and not x.isupper()]
    if good: return good[0]
    return next((x for x in sents if not BAD.search(x)), t[:240])[:300]


def variant(p):
    """Prvý dostupný variant okrem vzorky; cena je presná cena tohto variantu (nie „od“)."""
    vs = [v for v in p['variants'] if 'vzork' not in v['title'].lower()] or p['variants']
    return next((v for v in vs if v['available']), vs[0])


def row(h, cat, kind, role=None):
    p = by[h]; v = variant(p); price = float(v['price']); body = txt(p['body_html'])
    vt = '' if v['title'] == 'Default Title' else v['title']
    r = {'id': 'mark-' + h, 'name': re.sub(r'\s+', ' ', p['title']).strip(), 'url': SHOP + h, 'priceAmount': price, 'currency': 'EUR', 'price': money(price),
         'volume': vt, 'variantLabel': vt if len(p['variants']) > 1 else '', 'category': cat, 'kind': kind, 'tags': [],
         'photo': p['images'][0]['src'] if p['images'] else None, 'available': bool(v['available']), 'isSample': False,
         'description': first(body), 'reason': first(body),
         'source': {'url': SHOP + h, 'verifiedAt': CHECKED, 'category': p['product_type'], 'stock': 'InStock' if v['available'] else 'OutOfStock', 'priceFrom': False,
                    'variant': vt, 'imageUrl': p['images'][0]['src'] if p['images'] else None, 'suitabilityEvidence': 'bez tvrdenia o type pleti',
                    'suitabilitySource': 'official product page title/description'}}
    if role: r['role'] = role
    return r


rows = {}
def put(r, facets, evidence=None):
    r['facets'] = facets
    if evidence: r['source']['suitabilityEvidence'] = evidence
    rows[r['id']] = r

FACE_FOCUS = {'mark-organic-oil-lemongrass': 'lemongrass', 'mark-organic-oil-coffee': 'coffeeOil', 'mark-bio-lavender-water': 'lavender',
              'mark-face-water-damask-rose': 'rose', 'mark-bio-mint-water-osviezujuca-s-chladivym-ucinkom': 'mint'}
for h, (kind, skin, ev) in FACE.items(): put(row(h, 'face', kind), {'skin': skin, 'scope': 'single', **({'focus': FACE_FOCUS[h]} if h in FACE_FOCUS else {})}, ev)
for h, (kind, focus) in BODY.items(): put(row(h, 'body', kind), {'scope': 'single', 'focus': focus})
for h, (kind, need, ev) in HAIR.items(): put(row(h, 'hair', kind), {'hairNeed': need, 'scope': 'single'}, ev)
for h, (kind, focus) in MEN.items(): put(row(h, 'men', kind), {'scope': 'single', 'focus': focus})
for h, kind in LIPS.items(): put(row(h, 'lips', kind), {'scope': 'single'})
for h, cat in ADDONS.items(): put(row(h, cat, 'Doplnky', role='addon'), {})


def add_set(h, cat, contents, facets, extra_names=()):
    p = by[h]; v = variant(p); r = row(h, cat, 'Hotové sady')
    missing = [c for c in contents if 'mark-' + c not in rows]
    assert not missing, (h, missing)
    reg = float(v['compare_at_price']) if v.get('compare_at_price') else None
    r['set'] = {'contains': ['mark-' + c for c in contents], 'containsNames': [rows['mark-' + c]['name'] for c in contents] + list(extra_names)}
    if reg and reg > r['priceAmount']:
        r['set'].update({'regularPrice': reg, 'regularPriceSource': 'e-shop: pôvodná (prečiarknutá) cena sady (' + CHECKED + ')'})
    put(r, {'scope': 'set', **facets})

for h, (contents, skin, typ) in FACE_SETS.items(): add_set(h, 'face', contents, {'skin': skin, 'setType': typ})
for h, (contents, focus) in BODY_SETS.items(): add_set(h, 'body', contents, {'focus': focus})
for h, (contents, need, typ) in HAIR_SETS.items():
    add_set(h, 'hair', contents, {'hairNeed': need, 'setType': typ}, ['darček: levanduľový hydrolát'] if typ == 'complete' else ())
for h, (contents, typ) in MEN_SETS.items(): add_set(h, 'men', contents, {'focus': typ})
for h, contents in LIP_SETS.items(): add_set(h, 'lips', contents, {})

out = [r for r in rows.values() if r['available'] or r.get('role') == 'addon']
dropped = [r['id'] for r in rows.values() if r not in out]
json.dump(out, open(OUT, 'w'), ensure_ascii=False, indent=1)
from collections import Counter
print(len(out), 'nedostupné vyradené:', dropped)
print(Counter(r['category'] for r in out), Counter(r['kind'] for r in out))
