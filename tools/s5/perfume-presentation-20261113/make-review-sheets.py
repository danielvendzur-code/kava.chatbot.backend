from pathlib import Path
from PIL import Image,ImageDraw
import json,math
AUDIT=Path('/workspace/work/perfume-audit/perfume-profile-20261113');OUT=Path('/workspace/previews/20261113-vonny-profil');r=json.load(open(AUDIT/'live-all/independent-ui.json'));engine=json.load(open(Path(__file__).with_name('engine-qa.json')))
for slug,c in engine['companies'].items():
 rows=[x for x in r.get('noteProfiles',[]) if x['slug']==slug]
 if len(rows)!=len(c['leaves']):continue
 ims=[Image.open(AUDIT/'live-all'/x['screenshot']).convert('RGB') for x in rows];w=360;cols=3
 for im in ims:im.thumbnail((w,700))
 h=max(im.height for im in ims)+42;canvas=Image.new('RGB',(w*cols,h*math.ceil(len(ims)/cols)),'#e7e7e7');dr=ImageDraw.Draw(canvas)
 for i,(x,im) in enumerate(zip(rows,ims)):
  xx=i%cols*w;yy=i//cols*h;canvas.paste(im,(xx+(w-im.width)//2,yy+36));dr.text((xx+5,yy+6),slug+' / '+x['id'][:35],fill='black')
 canvas.save(OUT/(slug+'-vsetky-profily-live.png'));print(slug,len(rows),'live source-bound note profiles')
