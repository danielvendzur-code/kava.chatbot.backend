"""Offline build of reviewed official Eoné products; no model/network calls."""
import pathlib,json
R=pathlib.Path(__file__).resolve().parents[2]
c=json.loads((R/'n447/s5/sources/eone/verified-products.json').read_text())
assert len(c['products'])<=25
assert all(p['available'] and p['source']['stock'] in ['InStock','MadeToOrder'] and pathlib.Path(str(R)+p['photo']).is_file() for p in c['products'])
(R/'catalogues/eone.js').write_text('globalThis.CX_CATALOGUES ||= {};\nglobalThis.CX_CATALOGUES.eone = '+json.dumps(c,ensure_ascii=False,indent=1)+';\n')
print('EONE',len(c['products']),'reviewed products')
