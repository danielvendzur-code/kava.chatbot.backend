from pathlib import Path
import json,urllib.request,hashlib,concurrent.futures,re
from PIL import Image,ImageDraw
from lxml import html
BASE=Path(__file__).resolve().parent;OUT=BASE/'candidate-packages/atmanperfumes/assets';OUT.mkdir(parents=True,exist_ok=True);rows=json.load(open(BASE/'research/atmanperfumes/products.json'))['rows'];items=[]
for r in rows:
 m=next(x for x in r['product']['media'] if x['title'].startswith('lnt'));items.append((r['id'],m['fullUrl']))
s=Path('/workspace/work/perfume-audit/wave3-20261113/atman-live/home.html').read_text();t=html.fromstring(s);items.append(('avatar',t.xpath('//link[@rel="icon"]/@href')[0]))
def get(pair):
 pid,u=pair;b=urllib.request.urlopen(u,timeout=35).read();ext='.png' if b[:8]==b'\x89PNG\r\n\x1a\n' else '.webp' if b[:4]==b'RIFF' else '.jpg';p=OUT/(pid+ext);p.write_bytes(b);im=Image.open(p);return {'id':pid,'url':u,'file':p.name,'bytes':len(b),'sha256':hashlib.sha256(b).hexdigest(),'width':im.width,'height':im.height,'originalBytes':True}
photos=list(concurrent.futures.ThreadPoolExecutor(3).map(get,items));logo=next(m.group(0) for m in re.finditer(r'<svg\b[^>]*>.*?</svg>',s,re.S) if '323 43.341' in m.group(0));b=logo.encode();(OUT/'logo.svg').write_bytes(b);photos.append({'id':'logo','url':'https://www.atmanperfumes.com/','source':'Exactofficial header vector, extracted verbatim from rendered DOM; no invented textlogo.','file':'logo.svg','bytes':len(b),'sha256':hashlib.sha256(b).hexdigest(),'width':323,'height':43,'originalMarkup':True});(BASE/'research/atmanperfumes/photos.json').write_text(json.dumps(photos,indent=2)+'\n');print([(x['id'],x['width'],x['height']) for x in photos]);sheet=Image.new('RGB',(360*3,540*3),'#eee9e3');d=ImageDraw.Draw(sheet)
for i,r in enumerate(photos[:-1]):
 im=Image.open(OUT/r['file']).convert('RGB');im.thumbnail((340,490));x=(i%3)*360;y=(i//3)*540;sheet.paste(im,(x+(360-im.width)//2,y+30));d.text((x+10,y+10),r['id'],fill='black')
sheet.save('/workspace/work/perfume-audit/wave3-20261113/atman-photos-review.jpg')
