from pathlib import Path
from lxml import html
from urllib.parse import urljoin
import urllib.request,json,re,datetime,hashlib,concurrent.futures
B=Path(__file__).resolve().parent/'research'
tasks={'alma': ('https://www.alma.cz/', ['esse/', 'bohyne-prirodni-olejovy-parfem/', 'magicka/', 'laska/']), 'ravina': ('https://ravina.cz/', ['https://ravina.cz/imitace-damske-parfemy-inspirovane-giorgio-armani-si/948-1096-imitace-damske-parfemy-apar-f001-inspirovane-armani-si.html#/1-objem-50_ml_standard', 'https://ravina.cz/imitace-damske-parfemy-inspirovane-giorgio-armani-si/949-1097-imitace-damsky-parfem-apar-inspirovane-armani-aqua-di-gio.html#/1-objem-50_ml_standard', 'https://ravina.cz/damsky-parfem-apar-inspirovany-yves-saint-laurent/899-1281-damsky-parfem-apar-f219-inspirovany-yves-saint-laurent-black-opium-parfemovana-voda.html#/1-objem-50_ml_standard', 'https://ravina.cz/imitace-damske-parfemy-inspirovane-marc-jacobs/720-1226-damsky-parfem-apar-f163-inspirovane-marc-jacobs-daisy.html#/1-objem-50_ml_standard', 'https://ravina.cz/378-1-damsky-parfem-apar-f065-standard-inspirovano-abercrombie-fitch-8.html#/1-objem-50_ml_standard', 'https://ravina.cz/379-damsky-parfem-apar-f271-standard-inspirovano-azzaro-wanted-girl.html'])}
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
