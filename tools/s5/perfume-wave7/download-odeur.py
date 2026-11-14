from pathlib import Path
from lxml import html
from PIL import Image,ImageDraw
import json,urllib.request,hashlib
B=Path(__file__).resolve().parent;O=B/'candidate-packages/odeur/assets';O.mkdir(parents=True,exist_ok=True);rows=json.load(open(B/'research/odeur/verified-input.json'))['rows'];h=html.fromstring((B/'research/odeur.html').read_bytes());logo=h.xpath('//*[contains(@class,"site-name")]//img/@src')[0];icon=h.xpath('//link[contains(@rel,"icon")]/@href')[0];items=[(r['id'],r['photo'][0]) for r in rows]+[('logo',logo),('avatar',icon)];photos=[]
for pid,u in items:
 u='https:'+u if u.startswith('//') else 'https://www.odeur.sk'+u if u.startswith('/') else u;b=urllib.request.urlopen(u,timeout=30).read();ext='.png' if b.startswith(b'\x89PNG') else '.jpg' if b[:2]==b'\xff\xd8' else '.ico' if b[:4]==b'\0\0\1\0' else '.webp';name=pid+ext;(O/name).write_bytes(b);w,h=Image.open(O/name).size;photos.append({'id':pid,'url':u,'file':name,'width':w,'height':h,'bytes':len(b),'sha256':hashlib.sha256(b).hexdigest(),'originalBytes':True,'selectedPack':'250 ml' if pid not in ['logo','avatar'] else None});print(pid,w,h,flush=True)
(B/'research/odeur/photos.json').write_text(json.dumps(photos,ensure_ascii=False,indent=2));sheet=Image.new('RGB',(300*3,460*3),'white');d=ImageDraw.Draw(sheet)
for n,p in enumerate(photos):
 im=Image.open(O/p['file']).convert('RGBA');im.thumbnail((290,420));x=n%3*300;y=n//3*460;sheet.paste(im,(x+(300-im.width)//2,y+30),im);d.text((x+5,y+5),p['id'],fill='black')
sheet.save('/workspace/work/perfume-audit/wave7-20261114/odeur-photo-review.jpg')
