from pathlib import Path
from lxml import html
import urllib.request,json,re,hashlib,datetime,concurrent.futures
BASE=Path(__file__).resolve().parent;HOME=json.load(open(BASE/'research/official-preflight.json'));hypno=[]
for x in HOME[0]['links']:
 u=x['url']
 if re.search(r'/hypno-.*50ml/',u) and u not in hypno:hypno.append(u)
hypno=hypno[:10];book=['/produkt/'+s+'/' for s in ['the-final-chapter','wind-of-change','dialogue','bestseller','turns-and-twists']]
def get(pair):
 slug,path=pair;pid=path.strip('/').split('/')[-1];out=BASE/'research'/slug;out.mkdir(exist_ok=True);cache=out/(pid+'.html');domain='https://www.mojehypno.sk' if slug=='hypno' else 'https://bookarazzi.sk';u=path if path.startswith('https:') else domain+path;b=cache.read_bytes() if cache.exists() else urllib.request.urlopen(u,timeout=30).read();t=html.fromstring(b.decode());name=t.xpath('//h1')[0].text_content().strip();pid=path.strip('/').split('/')[-1];out=BASE/'research'/slug;out.mkdir(exist_ok=True);
 if not cache.exists():cache.write_bytes(b)

 clean=lambda e:re.sub(r'\s+',' ',e.text_content()).strip();descs=t.xpath('//*[@id="description"] | //*[contains(concat(" ",normalize-space(@class)," ")," woocommerce-product-details__short-description ")] | //*[contains(concat(" ",normalize-space(@class)," ")," woocommerce-Tabs-panel--description ")]');desc=' '.join(clean(e) for e in descs);schema=[]
 for e in t.xpath('//script[@type="application/ld+json"]'):
  try:schema.append(json.loads(e.text))
  except:pass
 variations=[json.loads(x.get('data-product_variations')) for x in t.xpath('//*[@data-product_variations]') if x.get('data-product_variations') not in ['', 'false']]
 priceMeta=[dict(x.attrib) for x in t.xpath('//meta[@itemprop="price" or @property="product:price:amount" or @property="product:price:currency"]')];stock=t.xpath('//*[@itemprop="availability"]/@href');images=[{'src':x.get('data-src') or x.get('src'),'alt':x.get('alt')} for x in t.xpath('//img') if any(y in str(x.get('src'))+str(x.get('data-src')) for y in ['/shop/big/','/wp-content/uploads/'])];gallery=t.xpath('//a[contains(@class,"p-main-image")]/@href | //div[contains(@class,"woocommerce-product-gallery__image")]/a/@href');dl=re.search(r"dataLayer.push\(\{'shoptet'\s*:\s*",b.decode());public=json.JSONDecoder().raw_decode(b.decode()[dl.end():])[0] if dl else None;r={'publicShoptet':public,'id':pid,'url':u,'checkedAt':datetime.datetime.fromtimestamp(cache.stat().st_mtime,datetime.timezone.utc).isoformat(),'sourceSha256':hashlib.sha256(b).hexdigest(),'name':name,'text':re.sub(r'\s+',' ',' '.join(t.xpath('//body//text()[not(ancestor::script or ancestor::style)]'))),'description':desc,'schema':schema,'priceMeta':priceMeta,'stockMeta':stock,'variations':variations,'images':images,'gallery':gallery};(out/(pid+'.json')).write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n');print(slug,pid,name,priceMeta,stock,'variants',len(variations[0]) if variations else 0,desc[:170],flush=True);return slug,r
results=list(concurrent.futures.ThreadPoolExecutor(3).map(get,[('hypno',u) for u in hypno]+[('bookarazzi',u) for u in book]));
for slug in ['hypno','bookarazzi']:(BASE/'research'/slug/'products.json').write_text(json.dumps({'rows':[r for s,r in results if s==slug]},ensure_ascii=False,indent=2)+'\n')
