from pathlib import Path
from PIL import Image,ImageDraw
from lxml import html
import urllib.request,json,hashlib,re
B=Path(__file__).resolve().parent;O=B/'candidate-packages/egoist/assets';O.mkdir(parents=True,exist_ok=True);rows=json.load(open(B/'research/egoist/products.json'))['rows'];home=html.parse(str(B/'research/egoist.html'));logos=[x for x in home.xpath('//img/@src') if 'logo' in x];print('logos',logos);items=[(r['id'],r['photo']) for r in rows]+[('logo',logos[0]),('avatar',home.xpath('//link[contains(@rel,"icon")]/@href')[0])];out=[]
for pid,url in items:
 if not url.startswith('https://'):url='https://egoist-parfums.cz/'+url.lstrip('/')
 raw=urllib.request.urlopen(url,timeout=30).read();ext='.png' if raw.startswith(b'\x89PNG') else '.jpg' if raw.startswith(b'\xff\xd8') else '.ico' if raw[:4]==b'\0\0\1\0' else '.svg' if b'<svg' in raw[:1000] else '.webp';f=pid+ext;(O/f).write_bytes(raw);
 if ext=='.svg':
  sv=html.fromstring(raw);v=sv.get('viewbox','0 0 100 100').split();w,h=int(float(v[2])),int(float(v[3]))
 else:im=Image.open(O/f);w,h=im.size
 out.append({'id':pid,'file':f,'url':url,'bytes':len(raw),'width':w,'height':h,'sha256':hashlib.sha256(raw).hexdigest(),'originalBytes':True});print(pid,w,h,flush=True)
(B/'research/egoist/photos.json').write_text(json.dumps(out,ensure_ascii=False,indent=2));sheet=Image.new('RGB',(360*3,550*2),'#eee');d=ImageDraw.Draw(sheet)
for n,r in enumerate(out[:6]):
 im=Image.open(O/r['file']).convert('RGB');im.thumbnail((340,490));x=n%3*360;y=n//3*550;sheet.paste(im,(x+(360-im.width)//2,y+35));d.text((x+5,y+5),r['id'],fill='black')
sheet.save('/workspace/work/perfume-audit/wave5-20261113/egoist-photos-review.jpg')
