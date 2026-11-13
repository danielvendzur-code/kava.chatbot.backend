from pathlib import Path
from lxml import html
from PIL import Image,ImageDraw
import urllib.request,urllib.parse,json,hashlib,concurrent.futures,re
BASE=Path(__file__).resolve().parent
for slug in ['hypno','bookarazzi']:
 rows=json.load(open(BASE/'research'/slug/'products.json'))['rows'];home=BASE/'research'/('hypno-home.html' if slug=='hypno' else 'bookarazzi-sk-home.html');t=html.fromstring(home.read_text());domain='https://www.mojehypno.sk/' if slug=='hypno' else 'https://bookarazzi.sk/';logo=t.xpath('//img/@src')[0];avatar=urllib.parse.urljoin(domain,t.xpath('//link[@rel="icon" or @rel="shortcut icon"]/@href')[0]);items=[(r['id'],r['gallery'][0] if slug=='hypno' else r['schema'][0]['image']) for r in rows]+[('logo',logo),('avatar',avatar)];out=BASE/'candidate-packages'/slug/'assets';out.mkdir(parents=True,exist_ok=True)
 def get(pair):
  pid,u=pair;b=urllib.request.urlopen(u,timeout=35).read();svg=b.lstrip().startswith((b'<svg',b'<?xml'));ext='.svg' if svg else '.png' if b[:8]==b'\x89PNG\r\n\x1a\n' else '.webp' if b[:4]==b'RIFF' else '.jpg';p=out/(pid+ext);p.write_bytes(b)
  if svg:
   m=re.search(r'viewBox="([^"]+)"',b.decode());v=[float(x) for x in m.group(1).split()];w,h=int(v[2]),int(v[3])
  else:im=Image.open(p);w,h=im.size
  return {'id':pid,'url':u,'file':p.name,'bytes':len(b),'sha256':hashlib.sha256(b).hexdigest(),'width':w,'height':h,'originalBytes':True}
 photos=list(concurrent.futures.ThreadPoolExecutor(3).map(get,items));(BASE/'research'/slug/'photos.json').write_text(json.dumps(photos,indent=2)+'\n');print(slug,[(x['id'],x['width'],x['height']) for x in photos],flush=True);sheet=Image.new('RGB',(360*3,540*3),'#eee9e3');dr=ImageDraw.Draw(sheet)
 for i,r in enumerate([x for x in photos if not x['file'].endswith('.svg')]):
  im=Image.open(out/r['file']).convert('RGB');im.thumbnail((340,490));x=i%3*360;y=i//3*540;sheet.paste(im,(x+(360-im.width)//2,y+30));dr.text((x+8,y+8),r['id'][:45],fill='black')
 dest=Path('/workspace/work/perfume-audit/wave4-20261113')/(slug+'-photos-review.jpg');sheet.save(dest)
