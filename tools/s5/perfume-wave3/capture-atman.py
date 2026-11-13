from pathlib import Path
from lxml import html
import urllib.request,json,datetime,hashlib,re,concurrent.futures
BASE=Path(__file__).resolve().parent;OUT=BASE/'research/atmanperfumes';OUT.mkdir(parents=True,exist_ok=True)
slugs=['ambra-rossa','contesse','aura-blanc','oxymoron-extrait-de-parfum','sole-intimo-extrait-de-parfum','tramonto-extrait-de-parfum']
def rich(o):
 if isinstance(o,str):
  try:return rich(json.loads(o))
  except:return o
 if isinstance(o,dict):
  if 'textData' in o:return o['textData']['text']
  return ' '.join(rich(v) for k,v in o.items() if k=='nodes')
 if isinstance(o,list):return ' '.join(rich(v) for v in o)
 return ''
def get(slug):
 url='https://www.atmanperfumes.com/product-page/'+slug;b=urllib.request.urlopen(url,timeout=35).read();(OUT/(slug+'.html')).write_bytes(b);t=html.fromstring(b.decode());warm=json.loads(t.xpath('//script[@id="wix-warmup-data"]')[0].text);found=[]
 def walk(o):
  if isinstance(o,dict):
   if 'product' in o and isinstance(o['product'],dict) and 'productItems' in o['product']:found.append(o['product']);return
   for v in o.values():walk(v)
  elif isinstance(o,list):
   for v in o:walk(v)
 walk(warm);assert len(found)==1,(slug,len(found));p=found[0];schema=next(json.loads(x.text) for x in t.xpath('//script[@type="application/ld+json"]') if x.text and json.loads(x.text).get('@type')=='Product');desc=rich(p['description']);info=[{'title':x['title'],'text':rich(x['description'])} for x in p['additionalInfo']];row={'id':slug.replace('-extrait-de-parfum',''),'url':url,'checkedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'sourceSha256':hashlib.sha256(b).hexdigest(),'product':p,'schema':schema,'descriptionText':desc,'info':info};print(row['id'],desc,[(x['optionsSelections'],x['price'],x['inventory']) for x in p['productItems']],info[0]['text'][:1600],flush=True);return row
rows=list(concurrent.futures.ThreadPoolExecutor(3).map(get,slugs));(OUT/'products.json').write_text(json.dumps({'rows':rows},ensure_ascii=False,indent=2)+'\n')
