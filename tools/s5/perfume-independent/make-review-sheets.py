"""Compact audit sheets; original browser screenshots remain unchanged in their source folders."""
import argparse,pathlib,json,math
from PIL import Image,ImageDraw,ImageFont
p=argparse.ArgumentParser();p.add_argument('--review-root',required=True);a=p.parse_args();base=pathlib.Path(a.review_root);out=base/'visual-reviews';out.mkdir(exist_ok=True);font=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',14);manifest=[]
def sheet(name,rows,folder,labelKey='id'):
 items=[]
 for row in rows:
  file=folder/row['screenshot'];im=Image.open(file).convert('RGB');crop=None
  if row['width']==1280:crop=(704,116,1270,882);im=im.crop(crop)
  im.thumbnail((320,900));items.append((row,im,crop))
 cols=min(4,len(items));tileHeight=max(im.height for _,im,_ in items)+30;canvas=Image.new('RGB',(cols*330,math.ceil(len(items)/cols)*tileHeight),'#e6e6e6');draw=ImageDraw.Draw(canvas)
 for i,(row,im,crop) in enumerate(items):
  x=i%cols*330;y=i//cols*tileHeight;canvas.paste(im,(x,y));draw.text((x+3,y+im.height+5),str(row.get(labelKey,row.get('key','state')))[:38],font=font,fill='black')
 file=out/(name+'.webp');canvas.save(file,'WEBP',quality=86);manifest.append({'file':file.name,'inputCount':len(items),'inputs':[{'file':str((folder/r['screenshot']).relative_to(base)),'crop':c} for r,_,c in items],'note':'1280px screenshots use the observed widget crop; complete originals preserved locally. Mobile screenshots use full viewport.'})
for group,folderName in [('main','independent-ui'),('fixture','scentisimo-fixture-ui')]:
 folder=base/folderName;report=json.loads((folder/'independent-ui.json').read_text())
 for slug in sorted({r['slug'] for r in report['results']}):
  for width in [320,390,1280]:sheet(f'{group}-{slug}-results-{width}',[r for r in report['results'] if r['slug']==slug and r['width']==width],folder)
  sheet(f'{group}-{slug}-questions-390',[r for r in report['questionPages'] if r['slug']==slug and r['width']==390],folder,'key')
  sheet(f'{group}-{slug}-compare-390',[r for r in report['interactions'] if r['slug']==slug and r['width']==390],folder,'slug')
folder=base/'independent-chat';report=json.loads((folder/'independent-chat.json').read_text())
for slug in sorted({r['slug'] for r in report['cards']}):
 for width in [320,390]:sheet(f'main-{slug}-chat-{width}',[r for r in report['cards'] if r['slug']==slug and r['width']==width],folder)
(out/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n');print(len(manifest),'audit sheets;',sum((out/r['file']).stat().st_size for r in manifest),'bytes')
