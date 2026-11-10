"""Capture selected public Boemi pages for human review; no forms, cart or model calls."""
from pathlib import Path
from lxml import html
from urllib.request import urlopen
import json,re,datetime
R=Path('n447/s5/sources/boemi/raw')
selected=['krem-na-ruce-bambucke-maslo-150ml','krem-na-ruce-levandule-150ml-kopirovat','krem-na-ruce-s-rakytnikovym-olejem','bylinny-krem-na-nohy-150ml','telove-maslo-shea-butter-150-ml','telove-mleko-cerne-hrozno-m-150ml','telove-mleko-mandarinka-a-zel-caj-150ml','telovy-krem-boemi-mrtve-more-150ml','telovy-peeling-shea-butter-180g','vlasovy-sampon-magistra-levandule-250ml','vlasovy-sampon-mrtve-more-275ml','balzam-na-rty-hruska-15ml','balzam-na-rty-tuba-shea-butter-15ml','sprchovy-gel-bambucke-maslo-275ml','sprchovy-gel-s-vitaminovymi-kulickami-mandarinka-a-zeleny-caj-240ml']
known={}
for p in R.glob('*.html'):
 t=html.fromstring(p.read_bytes())
 for a in t.xpath('//a[@href]'):
  u=a.get('href');slug=u.rstrip('/').rsplit('/',1)[-1]
  if '/produkt/' in u and slug in selected:known[slug]=u
assert len(known)==len(selected),(len(known),set(selected)-known.keys())
out=[]
for slug in selected:
 u=known[slug];p=R/(slug+'.html')
 if not p.exists():p.write_bytes(urlopen(u,timeout=40).read())
 t=html.fromstring(p.read_bytes());src={'url':u,'checkedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'title':' '.join(t.xpath('//h1//text()')).strip(),'summary':' '.join(t.xpath('//*[contains(@class,"short-description")]//text()')).strip(),'description':' '.join(t.xpath('//*[@id="tab-description"]//text()')).strip(),'offerText':' '.join(t.xpath('//*[contains(@class,"summary")]//text()')).strip(),'schema':[json.loads(s) for s in t.xpath('//script[@type="application/ld+json"]/text()')],'images':t.xpath('//a[contains(@href,"wp-content/uploads")]/@href'),'prices':t.xpath('//*[@itemprop="price"]/@content'),'availability':t.xpath('//*[@itemprop="availability"]/@href|//*[@itemprop="availability"]/@content'),'bodyClass':t.xpath('//body/@class')}
 (R/(slug+'.json')).write_text(json.dumps(src,ensure_ascii=False,indent=2)+'\n');out.append(src);print(slug,src['title'],src['prices'],src['availability'],flush=True)
(R/'captured-products.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n')
