from pathlib import Path
from lxml import html
import urllib.request,json,datetime,hashlib,re,concurrent.futures
B=Path(__file__).resolve().parent;O=B/'research/parfums4all';O.mkdir(exist_ok=True);ls=json.load(open(B/'research/initial-audit/parfums4all-links.json'));urls=list(dict.fromkeys(x['url'] for x in ls if '/produkt/' in x['url']))[:20]
def get(url):
 pid=url.rstrip('/').split('/')[-1]
 if (O/(pid+'.json')).exists():return json.load(open(O/(pid+'.json')))
 with urllib.request.urlopen(url,timeout=30) as f:raw=f.read();assert f.status==200
 t=html.fromstring(raw);pid=url.rstrip('/').split('/')[-1];(O/(pid+'.html')).write_bytes(raw);parts=t.xpath('//*[@id="tab-description"]')
 if not parts:print('NO_DESCRIPTION',pid,flush=True);return None
 desc=parts[0];notes=re.sub(r'\s+',' ',desc.text_content()).strip();summary=t.xpath('//*[contains(@class,"summary")]')[0];summaryText=re.sub(r'\s+',' ',summary.text_content());photo=t.xpath('//*[contains(@class,"woocommerce-product-gallery__image")]//a/@href')[0];klass=t.xpath('//*[starts-with(@id,"product-")]/@class')[0];price=''.join(summary.xpath('.//*[contains(@class,"price")]//text()')).strip();name=t.xpath('//h1/text()')[0];r={'id':pid,'url':url,'name':name,'price':price,'summary':summaryText,'description':notes,'productClass':klass,'photo':photo,'checkedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'sourceSha256':hashlib.sha256(raw).hexdigest()};(O/(pid+'.json')).write_text(json.dumps(r,ensure_ascii=False,indent=2));print(pid,price,notes[:1600],flush=True);return r
rows=list(concurrent.futures.ThreadPoolExecutor(3).map(get,urls));(O/'products.json').write_text(json.dumps({'rows':[r for r in rows if r]},ensure_ascii=False,indent=2))
