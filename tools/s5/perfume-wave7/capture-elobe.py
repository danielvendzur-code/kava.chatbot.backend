from pathlib import Path
import urllib.request,concurrent.futures,json,hashlib,datetime,re
from lxml import html
B=Path(__file__).resolve().parent/'research/elobe';B.mkdir(exist_ok=True)
links=json.load(open(B.parent/'elobe-fragrance-links.json'));links.append(['Ellis Brooklyn Eau de Parfum Vanilla Rice','https://elobe.cz/domu/9648-11965-ellis-brooklyn-eau-de-parfum-vannila-rice.html#/1-_-50_ml'])
names=['Plum Tonic','Vanilla Rice','Dirty Hinoki','Dirty Coconut','Black Salt','Rhubarb Thief']
def go(n):
 name,url=next((name,url) for name,url in links if n in name);pid=n.lower().replace(' ','-');r=urllib.request.urlopen(url,timeout=40);raw=r.read();(B/(pid+'.html')).write_bytes(raw);t=html.fromstring(raw);p=json.loads(t.xpath('//*[@id="product-details"]/@data-product')[0]);desc=html.fromstring(p['description']).text_content();result={'id':pid,'url':url,'at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'sourceSha256':hashlib.sha256(raw).hexdigest(),'product':p,'descriptionText':desc};(B/(pid+'.json')).write_text(json.dumps(result,ensure_ascii=False,indent=2));return pid,p['price_amount'],p['attributes'],p['quantity'],desc[-2400:]
for r in concurrent.futures.ThreadPoolExecutor(max_workers=4).map(go,names):print(r,flush=True)
