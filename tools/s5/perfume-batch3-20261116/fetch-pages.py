from pathlib import Path
from lxml import html
from urllib.parse import urljoin
import urllib.request,json,datetime,hashlib,concurrent.futures,re,sys
B=Path(__file__).resolve().parent;O=B/'research'
def fetch(item):
 slug,label,url=item;out=O/slug;out.mkdir(exist_ok=True);r={'slug':slug,'label':label,'url':url,'checkedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'tlsVerified':True,'scope':'Read-only officialHTML; notlivewidgetQA'}
 try:
  f=urllib.request.urlopen(url,timeout=35);raw=f.read();(out/(label+'.html')).write_bytes(raw);t=html.fromstring(raw);r.update(status=f.status,finalUrl=f.url,sourceSha256=hashlib.sha256(raw).hexdigest(),name=t.xpath('string(//h1)').strip(),jsonld=t.xpath('//script[@type="application/ld+json"]/text()'),offers=[{x.get('itemprop'):x.get('content',x.get('href')) for x in e.xpath('./meta|./link')} for e in t.xpath('//*[@itemtype="https://schema.org/Offer"]')],photos=t.xpath('//a[contains(@class,"p-main-image")]/@href'),links=[{'text':' '.join(a.text_content().split())[:100],'url':urljoin(f.url,a.get('href'))} for a in t.xpath('//a[@href]') if not a.get('href').startswith(('#','javascript:'))])
  s=raw.decode('utf8','replace');m=re.search(r"dataLayer.push\(\{'shoptet'\s*:\s*",s)
  if m:r['publicProduct']=json.JSONDecoder().raw_decode(s[m.end():])[0].get('product')
  r['description']=' '.join(t.xpath('string(//*[contains(concat(" ",normalize-space(@class)," ")," basic-description ")])').split());r['shortDescription']=' '.join(t.xpath('string(//*[contains(@class,"p-short-description")])').split())
  for e in t.xpath('//script|//style'):e.getparent().remove(e)
  r['bodyText']=' '.join(t.text_content().split())
 except Exception as e:r['error']=str(e)
 (out/(label+'.json')).write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n');print(slug,label,r.get('status'),r.get('name'),r.get('error'),flush=True);return r
if __name__=='__main__':
 tasks=json.load(open(sys.argv[1]));list(concurrent.futures.ThreadPoolExecutor(5).map(fetch,tasks))
