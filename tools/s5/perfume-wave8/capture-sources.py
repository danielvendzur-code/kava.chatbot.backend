from pathlib import Path
from lxml import html
import urllib.request,concurrent.futures,json,datetime,hashlib,re
B=Path(__file__).resolve().parent
entries={'inparfum':[('m233','https://www.inparfum.cz/obchod/prilezitost/bezny-den/in-parfum-m233/'),('m310','https://www.inparfum.cz/obchod/prilezitost/bezny-den/in-parfum-m310/'),('049','https://www.inparfum.cz/obchod/prilezitost/bezny-den/in-parfum-049/'),('w152','https://www.inparfum.cz/obchod/prilezitost/bezny-den/in-parfum-w152/'),('m209','https://www.inparfum.cz/obchod/prilezitost/aktivita/in-parfum-232/'),('w147','https://www.inparfum.cz/obchod/prilezitost/bezny-den/in-parfum-w147/')], 'topparfemy':[('portus-black','https://www.top-parfemy.eu/portus-cale-black-edition-panska-toaletni-voda--100-ml/'),('delusional','https://www.top-parfemy.eu/ng-eau-de-parfum-delusional-100-ml/'),('kopretina','https://www.top-parfemy.eu/anglicka-kopretina-damska-toaletni-voda--50-ml/'),('ruze','https://www.top-parfemy.eu/ruze-damska-toaletni-voda--50-ml/'),('bergamot-zazvor','https://www.top-parfemy.eu/bergamot-zazvor-toaletni-voda--100ml/'),('crevan','https://www.top-parfemy.eu/ng-eau-de-toilette-crevan-pour-hommes-100-ml/')]}
def run(it):
 slug,pid,url=it;out=B/'research'/slug;out.mkdir(exist_ok=True);r=urllib.request.urlopen(url,timeout=40);raw=r.read();(out/(pid+'.html')).write_bytes(raw);t=html.fromstring(raw);d={'id':pid,'url':url,'checkedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'sourceSha256':hashlib.sha256(raw).hexdigest(),'name':t.xpath('string(//h1)').strip()}
 if slug=='inparfum':
  d['variants']=json.loads(t.xpath('//*[@data-product_variations]/@data-product_variations')[0]);d['pyramid']=[]
  for e in t.xpath('//*[starts-with(normalize-space(text()),"Hlava parf") or starts-with(normalize-space(text()),"Srdce parf") or starts-with(normalize-space(text()),"Základ parf")]'):
   d['pyramid'].append(e.getparent().text_content().strip())
  d['description']=t.xpath('string(//*[@id="tab-description"])').strip();print(slug,pid,[(v['attributes'],v['display_price'],v['is_in_stock']) for v in d['variants'] if v['attributes']['attribute_pa_variant-vone'] in ['50-ml','10-ml']],d['pyramid'],flush=True)
 else:
  d['offer']=[{x.get('itemprop'):x.get('content') or x.get('href') for x in o.xpath('./meta|./link')} for o in t.xpath('//*[@itemtype="https://schema.org/Offer"]')];d['description']=t.xpath('string(//*[contains(concat(" ",normalize-space(@class)," ")," basic-description ")])').strip();d['photo']=t.xpath('//*[contains(@class,"p-main-image")]//img/@data-src') or t.xpath('//a[contains(@class,"p-main-image")]/@href');d['publicProducts']=re.findall(r'"hasVariants"\s*:\s*(true|false)',raw.decode());print(slug,pid,d['offer'],d['description'][:2200],flush=True)
 (out/(pid+'.json')).write_text(json.dumps(d,ensure_ascii=False,indent=2))
if __name__=='__main__':
 import argparse
 parser=argparse.ArgumentParser();parser.add_argument('--ids',nargs='*');a=parser.parse_args()
 with concurrent.futures.ThreadPoolExecutor(max_workers=5) as pool:list(pool.map(run,[(slug,pid,url) for slug,rows in entries.items() for pid,url in rows if not a.ids or pid in a.ids]))
