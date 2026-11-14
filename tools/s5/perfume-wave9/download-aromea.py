from pathlib import Path
from PIL import Image,ImageDraw
from lxml import html
import urllib.request,json,hashlib
B=Path(__file__).resolve().parent;O=B/'candidate-packages/aromea/assets';O.mkdir(parents=True,exist_ok=True);out=[];rows=[json.load(open(p)) for p in (B/'research/aromea').glob('*.json')];h=html.parse('tools/s5/perfume-wave8/research/aromea.html');logo=h.xpath('//*[contains(@class,"site-name")]//img/@src')[0];items=[(r['id'],r['photo'][0]) for r in rows]+[('logo',logo)]
for pid,url in items:
 if url.startswith('/'):url='https://www.aromea.cz'+url
 raw=urllib.request.urlopen(url,timeout=35).read();ext='.png' if raw.startswith(b'\x89PNG') else '.jpg' if raw.startswith(b'\xff\xd8') else '.webp' if raw.startswith(b'RIFF') else '.svg';file=pid+ext;(O/file).write_bytes(raw)
 if ext=='.svg':w=h=None
 else:im=Image.open(O/file);w,h=im.size
 out.append({'id':pid,'url':url,'file':file,'width':w,'height':h,'bytes':len(raw),'sha256':hashlib.sha256(raw).hexdigest(),'originalBytes':True});print(pid,w,h,flush=True)
(O/'initial.svg').write_text('<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96"><rect width="96" height="96" rx="48" fill="#3a382f"/><text x="48" y="66" text-anchor="middle" font-family="Georgia,serif" font-size="60" fill="white">A</text></svg>');out.append({'id':'avatar','file':'initial.svg','scope':'Factualdemoinitial, notofficialbrandmark'});(B/'research/aromea/photos.json').write_text(json.dumps(out,ensure_ascii=False,indent=2));sheet=Image.new('RGB',(1050,1650),'#eee');d=ImageDraw.Draw(sheet)
for i,r in enumerate(out[:8]):
 im=Image.open(O/r['file']).convert('RGB');im.thumbnail((330,490));x=i%3*350;y=i//3*550;sheet.paste(im,(x+(350-im.width)//2,y+30));d.text((x+5,y+5),r['id'],fill='black')
sheet.save('/workspace/work/perfume-audit/wave7-20261114/aromea-photos.jpg')
