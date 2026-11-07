"""Séria 3: z tools/s3a/registry.json vygeneruje s3-registry.js (prehliadač), statické importy chatu (lib/*), vercel.json a index.html.
python3 -I tools/s3a/register.py"""
import json, os, re
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
R = json.load(open(f'{ROOT}/tools/s3a/registry.json'))
HOLD = {k: v for k, v in R['demos'].items() if v.get('status', '').startswith('HOLD')}
# HOLD_* (napr. HOLD_DUPLICATE): firma sa nezverejňuje – nie je v prehliadači, chate, subdoménach ani v zozname
D = {k: v for k, v in R['demos'].items() if k not in HOLD}
open(f'{ROOT}/s3-registry.js', 'w').write('/* Séria 3: zoznam firiem (generované z tools/s3a/registry.json – neupravovať ručne). */\nwindow.S3_REG = ' + json.dumps({'demos': D}, ensure_ascii=False) + ';\n')
cof = [k for k, v in D.items() if v['type'] == 'coffee']; cos = [k for k, v in D.items() if v['type'] == 'cosmetics']
# lib/coffee-chat.js
p = f'{ROOT}/lib/coffee-chat.js'; s = open(p).read()
s = re.sub(r"(import REPLY from '../n447/c2/reply-c2.js';\n)(?:import \w+ from '../n447/c2/data/\w+.js';\n)+", lambda m: m.group(1) + ''.join(f"import D_{k} from '../n447/c2/data/{k}.js';\n" for k in cof), s)
s = re.sub(r'export const DEMOS = \{[^}]*\};', 'export const DEMOS = {' + ', '.join(f'{k}: D_{k}' for k in cof) + '};', s)
open(p, 'w').write(s)
# lib/cosmetics-chat.js
p = f'{ROOT}/lib/cosmetics-chat.js'; s = open(p).read()
s = re.sub(r"(import '../n447/s3/chat-guard-k2.js';\n)(?:import '../catalogues/[\w-]+.js';\n)+", lambda m: m.group(1) + ''.join(f"import '../catalogues/{k}.js';\n" for k in cos), s)
s = re.sub(r'export const BRANDS = \{.*?\};', 'export const BRANDS = {' + ', '.join(f"{k}: {{brand: {json.dumps(D[k]['brand']['name'], ensure_ascii=False)}, web: {json.dumps(D[k]['brand']['website'])}, family: {json.dumps(D[k].get('segment', 'cosmetics'))}}}" for k in cos) + '};', s, flags=re.S)
open(p, 'w').write(s)
# vercel.json
V = json.load(open(f'{ROOT}/vercel.json'))
for rw in V['rewrites']:
    rw['has'][0]['value'] = '^(' + '|'.join(D) + ')(\\.mojchatbot\\.sk|-mojchatbot\\.vercel\\.app)$'
json.dump(V, open(f'{ROOT}/vercel.json', 'w'), ensure_ascii=False, indent=2)
# index.html
seg = {'coffee': 'káva', 'cosmetics': 'kozmetika', 'tea': 'čaj', 'hair': 'vlasová kozmetika'}
# index.html: schválená jednoduchá stránka bez zoznamu firiem (klient vidí iba svoju značku) – negeneruje sa
print(len(D), 'firiem:', ', '.join(D)); print('HOLD:', ', '.join(f"{k} ({v['status']})" for k, v in HOLD.items()) or '–')
