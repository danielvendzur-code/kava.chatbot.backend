"""Offline build from reviewed official JAGAIA source facts. No network and no model calls."""
import pathlib,json
R=pathlib.Path(__file__).resolve().parents[2]
c=json.loads((R/'n447/s5/sources/jagaia/verified-products.json').read_text())
assert len(c['products'])<=25
assert all(p['available'] and p['source']['stock']=='InStock' and pathlib.Path(str(R)+p['photo']).is_file() for p in c['products'])
(R/'catalogues/jagaia.js').write_text('globalThis.CX_CATALOGUES ||= {};\nglobalThis.CX_CATALOGUES.jagaia = '+json.dumps(c,ensure_ascii=False,indent=1)+';\n')
print('JAGAIA',len(c['products']),'reviewed available products')
