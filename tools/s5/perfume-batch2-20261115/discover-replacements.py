from pathlib import Path
from lxml import html
import urllib.request,concurrent.futures,json,datetime,hashlib,re
B=Path(__file__).resolve().parent/'research';B.mkdir(exist_ok=True)
urls={'svickyodkovare': 'https://www.svickyodkovare.cz/', 'soyca': 'https://www.soyca.cz/'}
def run(item):
 slug,url=item;r={'slug':slug,'url':url,'at':datetime.datetime.now(datetime.timezone.utc).isoformat()}
 try:
  f=urllib.request.urlopen(url,timeout=30);raw=f.read();(B/(slug+'-home.html')).write_bytes(raw);t=html.fromstring(raw);r.update(status=f.status,finalUrl=f.url,title=t.xpath('string(//title)'),sha256=hashlib.sha256(raw).hexdigest());r['legalLinks']=list(dict.fromkeys(t.xpath('//a[contains(@href,"podm") or contains(@href,"terms") or contains(@href,"contact") or contains(@href,"kontakt")]/@href')));r['emailLinks']=list(dict.fromkeys(t.xpath('//a[starts-with(@href,"mailto:")]/@href')))
  for x in t.xpath('//script|//style'):x.getparent().remove(x)
  text=' '.join(t.text_content().split());r['legalHints']=re.findall(r'IČO?[:\s]+[0-9][0-9 \u00a0]{6,16}',text,re.I)[:5]
 except Exception as e:r['error']=str(e)
 (B/(slug+'-discovery.json')).write_text(json.dumps(r,ensure_ascii=False,indent=2));return r
rows=list(concurrent.futures.ThreadPoolExecutor(5).map(run,urls.items()));(B/'discovery-replacements.json').write_text(json.dumps(rows,ensure_ascii=False,indent=2));print(json.dumps(rows,ensure_ascii=False,indent=2))
