from pathlib import Path
from lxml import html
import json,re,urllib.request,datetime,hashlib
ROOT=Path(__file__).resolve().parent;OUT=ROOT/'research/gom';OUT.mkdir(parents=True,exist_ok=True)
rows=[]
for pid in ['chu','nyi-ma','rgyal-mo','rgyal-po','rlung']:
 url='https://gom-perfumes.cz/product/'+pid+'/'
 if pid=='chu':raw=(ROOT/'research/gom-chu.html').read_bytes();checked=json.load(open(ROOT/'research/gom-chu-fetch.json'))['checkedAt']
 else:
  with urllib.request.urlopen(url,timeout=30) as r:raw=r.read();assert r.status==200
  checked=datetime.datetime.now(datetime.timezone.utc).isoformat()
 (OUT/(pid+'.html')).write_bytes(raw);t=html.fromstring(raw)
 variants=json.loads(t.xpath('//*[@data-product_variations]/@data-product_variations')[0]);v=next(x for x in variants if x['attributes']['attribute_pa_varianta']=='50ml');assert v['is_in_stock'] and v['variation_is_active']
 text=re.sub(r'\s+',' ',t.text_content()).strip();m=re.search(r'HLAVA\s+(.*?)\s+SRDCE\s+(.*?)\s+ZÁKLAD\s+(.*?)(?=\s+SLOŽENÍ)',text,re.I);assert m,pid
 row={'id':pid,'name':pid.upper().replace('-',' '),'url':url,'checkedAt':checked,'sourceSha256':hashlib.sha256(raw).hexdigest(),'variants':variants,'selected':v,'notes':list(m.groups()),'notesOriginal':m.group(0),'title':t.xpath('//title/text()'),'images':[{'src':i.get('src'),'alt':i.get('alt'),'class':i.get('class')} for i in t.xpath('//img[@src]')]}
 rows.append(row);(OUT/(pid+'.json')).write_text(json.dumps(row,ensure_ascii=False,indent=2));print(pid,v['display_price'],v['availability_html'],row['notes'],flush=True)
(OUT/'products.json').write_text(json.dumps({'rows':rows},ensure_ascii=False,indent=2))
