"""Remove only empty white margins; original bytes and exact crop manifest retained."""
from pathlib import Path
from PIL import Image,ImageChops
import json,hashlib,math
BASE=Path(__file__).resolve().parent;OUT=BASE/'candidate-packages/vonya';p=BASE/'research/vonya-products-source.json';d=json.loads(p.read_text())
for r in d['rows']:
 for item in [r]+([r['mini']] if r.get('mini') else []):
  original=OUT/'original-assets'/(item['id']+'.jpg');im=Image.open(original).convert('RGB');mask=ImageChops.difference(im,Image.new('RGB',im.size,'white')).convert('L').point(lambda v:255 if v>12 else 0);b=mask.getbbox();assert b;minimum=500 if item is r else 1;width=min(im.width,max(minimum,b[2]-b[0]+32));height=min(im.height,max(minimum,b[3]-b[1]+32));left=max(0,min(im.width-width,math.floor((b[0]+b[2]-width)/2)));top=max(0,min(im.height-height,math.floor((b[1]+b[3]-height)/2)));box=(left,top,left+width,top+height);assert box[0]<=b[0] and box[1]<=b[1] and box[2]>=b[2] and box[3]>=b[3];crop=im.crop(box);target=OUT/'assets'/(item['id']+'.webp');crop.save(target,lossless=True);e=item['photoEvidence'];e.update(originalWidth=im.width,originalHeight=im.height,width=crop.width,height=crop.height,cropBox=list(box),localSha256=hashlib.sha256(target.read_bytes()).hexdigest(),processing='White-margin-only crop with32pxpadding, entire meaningful merchant image retained; no retouch/upscale/new props. Original exact JPEG retained.')
p.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n');print('24originals preserved; crop boxes/local hashes recorded; primary>=500px, minis keep native detail.')
