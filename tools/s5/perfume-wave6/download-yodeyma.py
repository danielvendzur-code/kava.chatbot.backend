from pathlib import Path
from lxml import html
from PIL import Image,ImageDraw
import urllib.request,json,hashlib,re
B=Path(__file__).resolve().parent;O=B/'candidate-packages/yodeymaparfemy/assets';O.mkdir(parents=True,exist_ok=True);rows=json.load(open(B/'research/yodeymaparfemy/products.json'))['rows'];items=[];mapped=[]
for r in rows:
 t=html.parse(str(B/'research/yodeymaparfemy'/(r['id']+'.html')));offerBySku={o['sku']:o for o in r['offers']};vs={}
 for size in ['50','15']:
  v=next(x for x in r['variants'] if x['label'] in ['Parfémovaná voda: '+size,'Varianta: '+size]);a=v['attributes'];index=a['data-index'];skus=[x.text_content().strip() for x in t.xpath('//span[contains(@class,"choose-variant")]') if index in x.get('class','').split() and x.text_content().strip() in offerBySku];assert len(set(skus))==1,(r['id'],size,skus);sku=skus[0];offer=offerBySku[sku];assert float(offer['price'])==float(a['data-customerprice']) and offer['availability']=='https://schema.org/InStock';vs[size]={**v,'sku':sku,'offer':offer,'pack':size+' ml'};items.append((r['id']+'-'+size+'ml',a['data-big'],size+' ml'))
 mapped.append({**r,'selectedVariants':vs})
home=html.fromstring((B/'research/initial-audit/yodeyma.raw').read_bytes());logo=home.xpath('//a[contains(@class,"site-name")]//img/@src')
if not logo:logo=[u for u in home.xpath('//img/@src') if 'logo' in u.lower()]
logo=[u for u in logo if not u.startswith('data:')][0];icons=home.xpath('//link[contains(@rel,"icon")]/@href');print('branding',logo,icons,flush=True);items += [('logo',logo,None),('avatar',icons[0],None)];photos=[]
for pid,u,pack in items:
 if u.startswith('//'):u='https:'+u
 elif u.startswith('/'):u='https://www.yodeymaparfemy.cz'+u
 raw=urllib.request.urlopen(u,timeout=30).read();ext='.png' if raw.startswith(b'\x89PNG') else '.jpg' if raw[:2]==b'\xff\xd8' else '.ico' if raw[:4]==b'\0\0\1\0' else '.webp';f=pid+ext;(O/f).write_bytes(raw);w,h=Image.open(O/f).size;photos.append({'id':pid,'url':u,'file':f,'bytes':len(raw),'width':w,'height':h,'sha256':hashlib.sha256(raw).hexdigest(),'originalBytes':True,'selectedPack':pack,'qualification':'Official published CDN variant image fetched unchanged; filename not used to infer pack.'});print(pid,w,h,flush=True)
(B/'research/yodeymaparfemy/mapped-products.json').write_text(json.dumps({'rows':mapped},ensure_ascii=False,indent=2));(B/'research/yodeymaparfemy/photos.json').write_text(json.dumps(photos,ensure_ascii=False,indent=2));sheet=Image.new('RGB',(300*4,420*3),'#eee');d=ImageDraw.Draw(sheet)
for n,r in enumerate(photos[:12]):
 im=Image.open(O/r['file']).convert('RGB');im.thumbnail((290,380));x=n%4*300;y=n//4*420;sheet.paste(im,(x+(300-im.width)//2,y+30));d.text((x+5,y+5),r['id'],fill='black')
sheet.save('/workspace/work/perfume-audit/wave6-20261113/yodeyma-photos-review.jpg')
