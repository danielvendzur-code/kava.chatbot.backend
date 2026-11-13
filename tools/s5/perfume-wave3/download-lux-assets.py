from pathlib import Path
import json,urllib.request,hashlib,concurrent.futures
from PIL import Image,ImageDraw
BASE=Path(__file__).resolve().parent;OUT=BASE/'candidate-packages/luxparfum/assets';OUT.mkdir(parents=True,exist_ok=True);rows=json.load(open(BASE/'research/luxparfum/products.json'))['rows'];items=[(r['id'],r['photoUrl']) for r in rows]+[('logo',rows[0]['logoUrl']),('avatar','https://www.luxparfum.cz/favicon.png')]
def get(pair):
 pid,u=pair;b=urllib.request.urlopen(u,timeout=30).read();ext='.png' if b[:8]==b'\x89PNG\r\n\x1a\n' else '.webp' if b[:4]==b'RIFF' else '.jpg';p=OUT/(pid+ext);p.write_bytes(b);im=Image.open(p);return {'id':pid,'url':u,'file':p.name,'bytes':len(b),'sha256':hashlib.sha256(b).hexdigest(),'width':im.width,'height':im.height,'originalBytes':True}
photos=list(concurrent.futures.ThreadPoolExecutor(3).map(get,items));(BASE/'research/luxparfum/photos.json').write_text(json.dumps(photos,indent=2)+'\n');print([(x['id'],x['width'],x['height']) for x in photos]);w=360;sheet=Image.new('RGB',(w*3,540*3),'#f1eee8');d=ImageDraw.Draw(sheet)
for i,r in enumerate(photos):
 im=Image.open(OUT/r['file']).convert('RGB');im.thumbnail((340,490));x=(i%3)*w;y=(i//3)*540;sheet.paste(im,(x+(w-im.width)//2,y+30));d.text((x+10,y+10),r['id'],fill='black')
sheet.save('/workspace/work/perfume-audit/wave3-20261113/lux-photos-review.jpg')
