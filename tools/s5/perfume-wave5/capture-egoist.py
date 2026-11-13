from pathlib import Path
from lxml import html
import urllib.request,datetime,json,re,hashlib
B=Path(__file__).resolve().parent;O=B/'research/egoist';O.mkdir(exist_ok=True);links=json.load(open(B/'research/egoist-fetch.json'))['links'];urls=[u for u in links if '/cs/product/' in u][:6];rows=[]
for url in urls:
 pid=url.rstrip('/').split('/')[-1]
 if pid=='syn-cherry-parfemova-voda':raw=(B/'research/egoist-syn-cherry.html').read_bytes();at=json.load(open(B/'research/egoist-syn-cherry-fetch.json'))['checkedAt']
 else:
  with urllib.request.urlopen(url,timeout=30) as f:raw=f.read();assert f.status==200
  at=datetime.datetime.now(datetime.timezone.utc).isoformat()
 (O/(pid+'.html')).write_bytes(raw);t=html.fromstring(raw);table={}
 for tr in t.xpath('//table[contains(@class,"woocommerce-product-attributes")]//tr'):
  cells=tr.xpath('./th|./td')
  if len(cells)==2:table[re.sub(r'\s+',' ',cells[0].text_content()).strip()]=re.sub(r'\s+',' ',cells[1].text_content()).strip()
 photo=t.xpath('//*[contains(@class,"woocommerce-product-gallery__image")]//a/@href')[0];price=''.join(t.xpath('//*[contains(@class,"summary")]//*[contains(@class,"price")]//text()')).strip();name=t.xpath('//h1/text()')[0];klass=t.xpath('//*[starts-with(@id,"product-")]/@class')[0]
 row={'id':pid,'url':url,'name':name,'price':price,'attributes':table,'productClass':klass,'photo':photo,'checkedAt':at,'sourceSha256':hashlib.sha256(raw).hexdigest()};rows.append(row);(O/(pid+'.json')).write_text(json.dumps(row,ensure_ascii=False,indent=2));print(pid,price,table,klass,flush=True)
(O/'products.json').write_text(json.dumps({'rows':rows},ensure_ascii=False,indent=2))
