from pathlib import Path
from PIL import Image,ImageDraw
import json,math,shutil
FOLDER=Path('/workspace/work/perfume-audit/wave4-20261113/local-qa');OUT=Path('/workspace/previews/20261113-wave4');OUT.mkdir(exist_ok=True);d=json.load(open(FOLDER/'independent-ui.json'))
for slug,expected in [('hypno',4),('bookarazzi',5)]:
 FOLDER=Path('/workspace/work/perfume-audit/wave4-20261113')/('local-book-logo-qa' if slug=='bookarazzi' else 'local-qa');d=json.load(open(FOLDER/'independent-ui.json'))
 for width in [320,390,1280]:
  rows=[x for x in d['results'] if x['slug']==slug and x['width']==width]
  if len(rows)!=expected:continue
  ims=[]
  for r in rows:
   im=Image.open(FOLDER/r['screenshot']).convert('RGB')
   if width==1280:im=im.crop((706,118,1258,878))
   im.thumbnail((390,900));ims.append(im)
  cw=max(i.width for i in ims);ch=max(i.height for i in ims)+26;sheet=Image.new('RGB',(cw*3,ch*math.ceil(len(ims)/3)),'#e9e6e1');dr=ImageDraw.Draw(sheet)
  for i,(r,im) in enumerate(zip(rows,ims)):
   x=i%3*cw;y=i//3*ch;sheet.paste(im,(x,y+26));dr.text((x+6,y+6),r['id']+' / '+str(width),fill='black')
  sheet.save(OUT/(slug+'-vsetky-vysledky-'+str(width)+'.png'))
  if width==390:
   for n in [rows[0]['screenshot'],slug+'-question-1-390.png',slug+'-compare-390.png']:
    p=FOLDER/n
    if p.exists():shutil.copy2(p,OUT/p.name)
  print(slug,width,len(rows))
