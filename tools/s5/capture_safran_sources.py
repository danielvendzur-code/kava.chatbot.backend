"""Read only selected observed Safran product pages; preserve existing captures."""
from pathlib import Path
from urllib.request import urlopen
from concurrent.futures import ThreadPoolExecutor
from lxml import html
import json, datetime
ROOT=Path('n447/s5/sources/safran'); RAW=ROOT/'raw'; RAW.mkdir(exist_ok=True)
SLUGS=['prirodni-dvoufazovy-odlicovac','prirodni-pletove-mydlo-s-arganovym-olejem-a-hedvabim','prirodni-mydlo-se-zelenym-jilem-a-aktivnim-uhlim','sipkovy-peeling-na-oblicej-s-arganovym-olejem2','arganovy-olej','bio-sipkovy-olej-lisovany-za-studena','sos-olej-na-zadery','zjemnujici-balzam-na-ztvrdlou-kuzi','prirodni-peelingove-mydlo-s-pemzou-a-salveji','sampuk-na-vlasy-s-ruzovym-jilem-a-geraniem','prirodni-balzam-na-rty-s-rakytnikem','prirodni-100-olivove-mydlo']
index=json.loads((ROOT/'category-index.json').read_text()); known={p['url'].rstrip('/').rsplit('/',1)[-1]:p['url'] for c in index for p in c['products']}
assert all(s in known for s in SLUGS),set(SLUGS)-known.keys()
def capture(slug):
 p=RAW/(slug+'.json'); raw=RAW/(slug+'.html')
 if p.exists(): return json.loads(p.read_text())
 u=known[slug]; now=datetime.datetime.now(datetime.timezone.utc).isoformat()
 try:
  data=raw.read_bytes() if raw.exists() else urlopen(u,timeout=20).read()
  raw.write_bytes(data); t=html.fromstring(data)
  schemas=[]
  for s in t.xpath('//script[@type="application/ld+json"]/text()'):
   try: schemas.append(json.loads(s))
   except ValueError: pass
  for bad in t.xpath('//script|//style'): bad.drop_tree()
  d={'slug':slug,'url':u,'checkedAt':now,'title':' '.join(t.xpath('//h1//text()')).strip(),'photo':t.xpath('//meta[@property="og:image"]/@content'),'schema':schemas,'text':' '.join(t.text_content().split()),'selects':[{'name':s.get('name'),'id':s.get('id'),'options':[{'value':o.get('value'),'text':' '.join(o.text_content().split()),'data':{k:v for k,v in o.attrib.items() if k.startswith('data-')}} for o in s.xpath('.//option')]} for s in t.xpath('//select')],'metaPrices':t.xpath('//*[@itemprop="price"]/@content|//*[@itemprop="availability"]/@href')}
  p.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n'); print(slug,d['title'],flush=True); return d
 except Exception as e:
  d={'slug':slug,'url':u,'checkedAt':now,'error':type(e).__name__+': '+str(e)[:300]}; print(slug,d['error'],flush=True);return d
with ThreadPoolExecutor(max_workers=3) as pool: results=list(pool.map(capture,SLUGS))
(ROOT/'captured-products.json').write_text(json.dumps(results,ensure_ascii=False,indent=2)+'\n')
print('Captured',sum('error' not in d for d in results),'of',len(results),flush=True)
