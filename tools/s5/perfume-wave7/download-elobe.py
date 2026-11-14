from pathlib import Path
from PIL import Image,ImageDraw
import json,urllib.request,hashlib
B=Path(__file__).resolve().parent;O=B/'candidate-packages/elobe/assets';O.mkdir(parents=True,exist_ok=True);out=[]
items=[]
for p in (B/'research/elobe').glob('*.json'):
 j=json.load(open(p));items.append((j['id'],j['product']['cover']['bySize']['large_default']['url']))
items.append(('logo','https://elobe.cz/img/logo-1695223246.jpg'))
for pid,url in items:
 raw=urllib.request.urlopen(url,timeout=35).read();name=pid+'.jpg';(O/name).write_bytes(raw);im=Image.open(O/name);out.append({'id':pid,'file':name,'url':url,'sha256':hashlib.sha256(raw).hexdigest(),'width':im.width,'height':im.height,'bytes':len(raw),'originalBytes':True});print(pid,im.size,flush=True)
(O/'initial.svg').write_text('<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96"><rect width="96" height="96" rx="48" fill="#30251f"/><text x="48" y="66" text-anchor="middle" font-family="Georgia,serif" font-size="64" fill="white">e</text></svg>');out.append({'id':'avatar','file':'initial.svg','scope':'Factual demo initial, not officialbrandmark'})
(B/'research/elobe/photos.json').write_text(json.dumps(out,ensure_ascii=False,indent=2));sheet=Image.new('RGB',(1050,1100),'#eee');d=ImageDraw.Draw(sheet)
for i,r in enumerate(out[:6]):
 im=Image.open(O/r['file']).convert('RGB');im.thumbnail((340,490));x=i%3*350;y=i//3*550;sheet.paste(im,(x+(350-im.width)//2,y+30));d.text((x+5,y+5),r['id'],fill='black')
sheet.save('/workspace/work/perfume-audit/wave7-20261114/elobe-photos.jpg')
