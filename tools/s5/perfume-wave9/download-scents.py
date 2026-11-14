from pathlib import Path
from PIL import Image,ImageDraw
import urllib.request,json,hashlib
B=Path(__file__).resolve().parent;O=B/'candidate-packages/scents/assets';O.mkdir(parents=True,exist_ok=True);out=[];rows=[json.load(open(p)) for p in (B/'research/scents').glob('*.json')];items=[(r['id'],r['photo']) for r in rows]+[('logo','https://scents.cz/img/california-scents-current-logo.png')]
for pid,url in items:
 raw=urllib.request.urlopen(url,timeout=35).read();ext='.png' if raw.startswith(b'\x89PNG') else '.jpg' if raw.startswith(b'\xff\xd8') else '.webp';file=pid+ext;(O/file).write_bytes(raw);im=Image.open(O/file);out.append({'id':pid,'url':url,'file':file,'width':im.width,'height':im.height,'bytes':len(raw),'sha256':hashlib.sha256(raw).hexdigest(),'originalBytes':True,'selectedPack':'42 g' if pid!='logo' else None});print(pid,im.size,flush=True)
(O/'initial.svg').write_text('<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96"><rect width="96" height="96" rx="48" fill="#08768a"/><text x="48" y="66" text-anchor="middle" font-family="Georgia,serif" font-size="60" fill="white">S</text></svg>');out.append({'id':'avatar','file':'initial.svg','scope':'Factual retailerinitial, notmanufacturerlogo'});(B/'research/scents/photos.json').write_text(json.dumps(out,ensure_ascii=False,indent=2));sheet=Image.new('RGB',(1050,1100),'#eee');d=ImageDraw.Draw(sheet)
for i,r in enumerate(out[:6]):
 im=Image.open(O/r['file']).convert('RGB');im.thumbnail((330,490));x=i%3*350;y=i//3*550;sheet.paste(im,(x+(350-im.width)//2,y+30));d.text((x+5,y+5),r['id'],fill='black')
sheet.save('/workspace/work/perfume-audit/wave7-20261114/scents-photos.jpg')
