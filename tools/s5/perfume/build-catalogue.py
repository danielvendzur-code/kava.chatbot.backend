"""Offline, deterministic build from reviewed local perfume facts. No network or model calls."""
import json,pathlib,sys
root=pathlib.Path(__file__).resolve().parents[3]
slug=sys.argv[1]
assert slug in ['adoraniche','nicheandglow']
data=json.loads((root/f'n447/s5/sources/{slug}/verified-products.json').read_text())
assert data['segment']=='fragrance' and 1<=len(data['products'])<=25
(root/f'catalogues/{slug}.js').write_text('globalThis.CX_CATALOGUES ||= {};\nglobalThis.CX_CATALOGUES.'+slug+' = '+json.dumps(data,ensure_ascii=False,indent=1)+';\n')
print(slug,len(data['products']),'source-reviewed formulas; runtime not registered')
