from pathlib import Path
from lxml import html
from urllib.request import urlopen
from concurrent.futures import ThreadPoolExecutor
import json,re,datetime
R=Path('n447/s5/sources/rubens');raw=R/'raw';raw.mkdir(exist_ok=True)
index=json.loads((R/'category-index.json').read_text());chosen=[]
for cat in index:
 ps=cat['products']
 if cat['category']=='vyzivujici-oleje':ps=[p for p in ps if any(s in p['url'] for s in ['s-listky-bileho-caje','s-okurkou','s-ruzi'])]
 if cat['category']=='kokosove-tuky':ps=[p for p in ps if any(s in p['url'] for s in ['-tropique/','-s-rakytnikem/'])]
 if cat['category']=='peelingova-myci-sul-2':ps=[p for p in ps if any(s in p['url'] for s in ['-hermanek/','-mata-peprna/'])]
 if cat['category']=='prirodni-balzamy-na-rty':ps=[p for p in ps if any(s in p['url'] for s in ['pro-alergiky--tuhy/','balzam-na-rty--roll-on-/'])]
 chosen += [dict(p,category=cat['category']) for p in ps]
assert len(chosen)<=25
clean=lambda s:' '.join(s.split())
def get(p):
 slug=p['url'].rstrip('/').split('/')[-1];b=urlopen(p['url'],timeout=35).read();(raw/(slug+'.html')).write_bytes(b);h=html.fromstring(b);p.update(checkedAt=datetime.datetime.now(datetime.timezone.utc).isoformat(),title=clean(' '.join(h.xpath('//h1//text()'))),short=clean(' '.join(h.xpath('//*[contains(concat(" ",normalize-space(@class)," ")," p-short-description ")]//text()'))),description=clean(' '.join(h.xpath('//*[@id="description"]//text()'))),photo=h.xpath('//meta[@property="og:image"]/@content'),options=[{'text':clean(o.text_content()),'value':o.get('value'),'price':o.get('data-customerprice'),'stock':o.get('data-stock')} for o in h.xpath('//select[@id="simple-variants-select"]/option') if o.get('value')],offers=[])
 for o in h.xpath('//*[@itemprop="offers"]'):
  p['offers'].append({k:o.xpath('.//*[@itemprop="'+k+'"]/@content | .//*[@itemprop="'+k+'"]/@href')[:1] for k in ['price','availability','url','priceCurrency','sku']})
 (raw/(slug+'.json')).write_text(json.dumps(p,ensure_ascii=False,indent=2)+'\n');return p
with ThreadPoolExecutor(max_workers=3) as pool:rows=list(pool.map(get,chosen))
(R/'captured-products.json').write_text(json.dumps(rows,ensure_ascii=False,indent=2)+'\n')
for p in rows:
 print(p['title']);print(p['url']);print('variants',p['options'] or p['offers']);print('SHORT',p['short']);print('DESC',p['description'][:2500]);print()
