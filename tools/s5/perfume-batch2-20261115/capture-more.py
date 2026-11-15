from pathlib import Path
from lxml import html
from urllib.parse import urljoin
import urllib.request,json,re,datetime,hashlib,concurrent.futures
B=Path(__file__).resolve().parent/'research'
tasks={'durance': ('https://durance.cz/produkt/', ['parfemovana-voda-s-vuni-bergamotu-50ml', 'parfemovana-voda-s-vuni-verbeny-50ml', 'parfemovana-voda-s-vuni-ruze-50ml', 'parfemovana-voda-s-vuni-monoi-50ml', 'parfemovana-voda-s-vuni-pacule-50ml', 'parfemovana-voda-s-vuni-bavlny-50ml']), 'luxoa': ('https://www.luxoa.cz/cs/', ['slunce', 'luna', 'mars', 'merkur']), 'aromis': ('https://www.aromis.eu/', ['vonna-svicka-ve-skle-bella-vita/', 'vonna-svicka-ve-skle-desert-dust/', 'vonna-svicka-ve-skle-fantazie/', 'vonna-svicka-ve-skle-fresh-len/', 'vonna-svicka-ve-skle-kava/', 'vonna-svicka-ve-skle-levandule/']), 'mmnt': ('https://mmntshop.cz/produkt/', ['svicka-sklo-umami-220-ml/', 'svicka-sklo-les-is-more-220-ml/', 'svicka-vanoce-na-miru-180-ml/'])}
def run(item):
 slug,i,url=item;out=B/slug;out.mkdir(exist_ok=True);d={'slug':slug,'id':str(i),'url':url,'checkedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'tlsVerified':True}
 try:
  f=urllib.request.urlopen(url,timeout=40);raw=f.read();(out/f'{i}.html').write_bytes(raw);t=html.fromstring(raw);d.update(status=f.status,finalUrl=f.url,sourceSha256=hashlib.sha256(raw).hexdigest(),name=t.xpath('string(//h1)').strip())
  d['jsonld']=t.xpath('//script[@type="application/ld+json"]/text()');d['offers']=[{x.get('itemprop'):x.get('content',x.get('href')) for x in e.xpath('./meta|./link')} for e in t.xpath('//*[@itemtype="https://schema.org/Offer"]')]
  d['variants']=t.xpath('//input[@name="priceId"]/@data-customerprice');d['photos']=t.xpath('//a[contains(@class,"p-main-image")]/@href')
  m=re.search(r"dataLayer.push\(\{'shoptet'\s*:\s*",raw.decode('utf-8'))
  if m:d['publicProduct']=json.JSONDecoder().raw_decode(raw.decode('utf-8')[m.end():])[0].get('product')
  inertia=t.xpath('//*[@data-page]/@data-page')
  if inertia and inertia[0]:d['inertia']=json.loads(inertia[0])
  elif t.xpath('//script[@type="application/json"]/text()'):d['inertia']=json.loads(t.xpath('//script[@type="application/json"]/text()')[0])
  d['description']=' '.join(t.xpath('string(//*[contains(concat(" ",normalize-space(@class)," ")," basic-description ")])').split())
  d['shortDescription']=' '.join(t.xpath('string(//*[contains(@class,"p-short-description")])').split())
  for e in t.xpath('//script|//style'):e.getparent().remove(e)
  d['bodyText']=' '.join(t.text_content().split())
 except Exception as e:d['error']=str(e)
 (out/f'{i}.json').write_text(json.dumps(d,ensure_ascii=False,indent=2));print(slug,i,d.get('name'),d.get('error'),flush=True)
items=[(s,i+1,urljoin(home,p)) for s,(home,paths) in tasks.items() for i,p in enumerate(paths)]
list(concurrent.futures.ThreadPoolExecutor(5).map(run,items))
