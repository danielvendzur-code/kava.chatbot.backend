from pathlib import Path
from lxml import html
from urllib.parse import urljoin
import urllib.request,json,re,datetime,hashlib,concurrent.futures
B=Path(__file__).resolve().parent/'research'
tasks={
 'dews':('https://www.dews.sk/',['passion_no_1/','reve-de-voyage-no--2/','wildflower_no_3/','golden-mango-no--4/','fresh-wind-no--5/','jewel_no_6/']),
 'siluvone':('https://www.siluvone.sk/',['sensuale-250ml/','lilly-250ml/','terra-250ml/','mattina-250ml/','carreza-250ml/','fiori-250ml/']),
 'vonavepranie':('https://www.vonavepranie.sk/',['parfem-na-pranie-white-musk/','parfem-na-pranie-cotton-flower/','parfem-na-pranie-elisir-di-ylang/','parfem-na-pranie-fiori-bianchi/','parfem-na-pranie-petali-blu/','parfem-na-pranie-marseille/']),
 'totap':('https://www.totap.cz/',['p/anit','p/arat','p/kyoto','p/cafe','p/abra','p/sanblu']),
 'kvapkavoni':('https://www.kvapkavoni.eu/',['p/blu-home-parfum-na-pranie-fior-di-pulito','p/blu-home-parfum-na-pranie-muschio-bianco-biele-pizmo','p/blu-home-parfum-na-pranie-gocce-di-freschezza-kvapka-sviezosti','p/blu-home-parfum-na-pranie-monoi','p/blu-home-parfum-na-pranie-fiori-d-arancio-pomarancove-kvety','p/blu-home-parfum-na-pranie-brezza-marina-morsky-vanok'])
}
def run(item):
 slug,i,url=item;out=B/slug;out.mkdir(exist_ok=True);d={'slug':slug,'id':str(i),'url':url,'checkedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'tlsVerified':True}
 try:
  f=urllib.request.urlopen(url,timeout=40);raw=f.read();(out/f'{i}.html').write_bytes(raw);t=html.fromstring(raw);d.update(status=f.status,finalUrl=f.url,sourceSha256=hashlib.sha256(raw).hexdigest(),name=t.xpath('string(//h1)').strip())
  d['jsonld']=t.xpath('//script[@type="application/ld+json"]/text()');d['offers']=[{x.get('itemprop'):x.get('content',x.get('href')) for x in e.xpath('./meta|./link')} for e in t.xpath('//*[@itemtype="https://schema.org/Offer"]')]
  d['variants']=t.xpath('//input[@name="priceId"]/@data-customerprice');d['photos']=t.xpath('//a[contains(@class,"p-main-image")]/@href')
  m=re.search(r"dataLayer.push\(\{'shoptet'\s*:\s*",raw.decode('utf-8'))
  if m:d['publicProduct']=json.JSONDecoder().raw_decode(raw.decode('utf-8')[m.end():])[0].get('product')
  inertia=t.xpath('//*[@data-page]/@data-page')
  if inertia:d['inertia']=json.loads(inertia[0])
  d['description']=' '.join(t.xpath('string(//*[contains(concat(" ",normalize-space(@class)," ")," basic-description ")])').split())
  d['shortDescription']=' '.join(t.xpath('string(//*[contains(@class,"p-short-description")])').split())
  for e in t.xpath('//script|//style'):e.getparent().remove(e)
  d['bodyText']=' '.join(t.text_content().split())
 except Exception as e:d['error']=str(e)
 (out/f'{i}.json').write_text(json.dumps(d,ensure_ascii=False,indent=2));print(slug,i,d.get('name'),d.get('error'),flush=True)
items=[(s,i+1,urljoin(home,p)) for s,(home,paths) in tasks.items() for i,p in enumerate(paths)]
list(concurrent.futures.ThreadPoolExecutor(5).map(run,items))
