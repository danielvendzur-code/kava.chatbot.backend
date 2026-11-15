from pathlib import Path
from lxml import html
from urllib.parse import urljoin
import urllib.request,json,re,datetime,hashlib,concurrent.futures
B=Path(__file__).resolve().parent/'research'
tasks={'vunebis-corri': ('https://www.vunebis.cz/', ['corri-d-italia-parfemy-na-pradlo/corri-d-italia-florence-250ml/', 'corri-d-italia-parfemy-na-pradlo/corri-d-italia-roma-250ml/', 'corri-d-italia-parfemy-na-pradlo/corri-d-italia-pisa-250ml/']), 'esodrogeria': ('https://www.esodrogeria.eu/', ['Tesori-d-Oriente-vonne-tycinky-ayurveda-200ml-d1251.htm', 'AIR-WICK-difuzer-jasmine-bouquet-228ml-d1921.htm', 'Bispol-DZ230-326-vonny-difuzer-Frezia-hruska-230ml-d942.htm', 'Bispol-AD-001-465-vonny-difuzer-nocny-kvet-50ml-d18959.htm', 'Aromaticky-olej-Paculi-10ml-d689.htm', 'Aromaticky-olej-Hruskovy-jogurt-10ml-d1169.htm'])}
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
