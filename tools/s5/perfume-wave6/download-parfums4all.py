from pathlib import Path
from lxml import html
from PIL import Image,ImageDraw
import json,urllib.request,hashlib,re
B=Path(__file__).resolve().parent;O=B/'candidate-packages/parfums4all/assets';O.mkdir(parents=True,exist_ok=True);rows=json.load(open(B/'research/parfums4all/products.json'))['rows'];home=html.fromstring((B/'research/initial-audit/parfums4all.raw').read_bytes());logo=[u for u in home.xpath('//img/@src') if 'logo_parfums4all' in u][0];icons=home.xpath('//link[contains(@rel,"icon")]/@href');print('icons',icons,flush=True);items=[(r['id'],r['photo']) for r in rows]+[('logo',logo),('avatar',icons[-1])];photos=[]
for pid,u in items:
 raw=urllib.request.urlopen(u,timeout=30).read();ext='.png' if raw.startswith(b'\x89PNG') else '.webp' if raw[:4]==b'RIFF' else '.jpg';f=pid+ext;(O/f).write_bytes(raw);w,h=Image.open(O/f).size;photos.append({'id':pid,'url':u,'file':f,'bytes':len(raw),'width':w,'height':h,'sha256':hashlib.sha256(raw).hexdigest(),'originalBytes':True,'selectedPack':'100 ml' if pid not in ['logo','avatar'] else None});print(pid,w,h,flush=True)
(B/'research/parfums4all/photos.json').write_text(json.dumps(photos,ensure_ascii=False,indent=2));sheet=Image.new('RGB',(360*3,550*2),'#eee');d=ImageDraw.Draw(sheet)
for n,r in enumerate(photos):
 im=Image.open(O/r['file']).convert('RGB');im.thumbnail((340,490));x=n%3*360;y=n//3*550;sheet.paste(im,(x+(360-im.width)//2,y+30));d.text((x+5,y+5),r['id'][:40],fill='black')
sheet.save('/workspace/work/perfume-audit/wave6-20261113/parfums4all-photos-review.jpg')
