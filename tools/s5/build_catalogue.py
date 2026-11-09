"""Build a new S5 catalogue only from reviewed local official facts. No network/model calls."""
import pathlib,json,sys
R=pathlib.Path(__file__).resolve().parents[2]
slug=sys.argv[1]
assert slug.isascii() and slug.replace('-','').isalnum()
c=json.loads((R/f'n447/s5/sources/{slug}/verified-products.json').read_text())
assert 1<=len(c['products'])<=25
assert len({p['id'] for p in c['products']})==len(c['products'])
assert all(p['available'] and p['source']['stock'] in ['InStock','MadeToOrder'] and p['source']['selectionTraitsEvidence'] and pathlib.Path(str(R)+p['photo']).is_file() for p in c['products'])
(R/f'catalogues/{slug}.js').write_text('globalThis.CX_CATALOGUES ||= {};\nglobalThis.CX_CATALOGUES.'+slug+' = '+json.dumps(c,ensure_ascii=False,indent=1)+';\n')
print(slug,len(c['products']),'reviewed products')
