from pathlib import Path
from PIL import Image,ImageDraw
import urllib.request,json,hashlib,re
B=Path(__file__).resolve().parent;out=B/'candidate-packages/gom/assets';out.mkdir(parents=True,exist_ok=True);photos=[]
for r in json.load(open(B/'research/gom/products.json'))['rows']:
 for v in r['variants']:
  size=v['attributes']['attribute_pa_varianta'];u=v['image']['url'];b=urllib.request.urlopen(u,timeout=30).read();f=r['id']+'-'+size+'.webp';(out/f).write_bytes(b);w,h=Image.open(out/f).size;photos.append({'id':r['id']+'-'+size,'url':u,'file':f,'width':w,'height':h,'bytes':len(b),'sha256':hashlib.sha256(b).hexdigest(),'originalBytes':True,'selectedPack':'10 ml' if size=='10ml' else '50 ml'})
 raw=(B/'research/gom.html').read_text();svg=re.search(r'<svg[^>]+id="gom-icon"[\s\S]*?</svg>',raw).group(0).encode();(out/'logo.svg').write_bytes(svg)
for kind,u in [('avatar','https://gom-perfumes.cz/wp-content/themes/gom_theme_wp/assets/favicon.svg')]:
 b=urllib.request.urlopen(u,timeout=30).read();(out/(kind+'.svg')).write_bytes(b);photos.append({'id':kind,'file':kind+'.svg','url':u,'bytes':len(b),'sha256':hashlib.sha256(b).hexdigest(),'originalBytes':True})
photos.append({'id':'logo','file':'logo.svg','url':'https://gom-perfumes.cz/','inlineSelector':'svg#gom-icon','bytes':len(svg),'sha256':hashlib.sha256(svg).hexdigest(),'originalBytes':True,'width':500,'height':1000})
(B/'research/gom/photos.json').write_text(json.dumps(photos,ensure_ascii=False,indent=2));print([(r['id'],r.get('width'),r.get('height')) for r in photos])
ims=[r for r in photos if r['id'].endswith('50ml')];sheet=Image.new('RGB',(300*5,500),'#eee9e3');d=ImageDraw.Draw(sheet)
for n,r in enumerate(ims):
 im=Image.open(out/r['file']).convert('RGB');im.thumbnail((290,460));sheet.paste(im,(n*300+(300-im.width)//2,30));d.text((n*300+8,8),r['id'],fill='black')
p=Path('/workspace/work/perfume-audit/wave5-20261113/gom-photos-review.jpg');sheet.save(p)
