"""Contact sheets for actual local candidate screenshots; originals stay unchanged."""
import pathlib,json,argparse,math
from PIL import Image,ImageDraw,ImageFont
p=argparse.ArgumentParser();p.add_argument('--root',required=True);p.add_argument('--ui',default='ui-final');p.add_argument('--chat',default='chat-final');p.add_argument('--slugs',nargs='+',required=True);a=p.parse_args();base=pathlib.Path(a.root);out=base/'visual-final';out.mkdir(exist_ok=True);font=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',13);manifest=[]
def sheet(name,rows,folder):
 rows=[r for r in rows if r.get('screenshot') and (folder/r['screenshot']).is_file()]
 if not rows:return
 items=[]
 for r in rows:
  im=Image.open(folder/r['screenshot']).convert('RGB');crop=(704,116,1270,882) if r['width']==1280 else None
  if crop:im=im.crop(crop)
  im.thumbnail((320,900));items.append((im,r,crop))
 cols=min(4,len(items));height=max(im.height for im,r,c in items)+34;canvas=Image.new('RGB',(cols*330,math.ceil(len(items)/cols)*height),'#eee');draw=ImageDraw.Draw(canvas)
 for i,(im,r,crop) in enumerate(items):
  x=i%cols*330;y=i//cols*height;canvas.paste(im,(x,y));draw.text((x+3,y+im.height+4),str(r.get('id',r.get('key','state')))[:38],font=font,fill='black')
 file=out/(name+'.jpg');canvas.save(file,quality=92);manifest.append({'file':file.name,'sourceCount':len(items),'sources':[{'path':str((folder/r['screenshot']).relative_to(base)),'desktopWidgetCrop':crop} for im,r,crop in items],'visualReview':'PENDING_ACTUAL_INSPECTION'})
u=json.load(open(base/a.ui/'independent-ui.json'));c=json.load(open(base/a.chat/'independent-chat.json'))
for slug in a.slugs:
 for width in [320,390,1280]:
  rs=[r for r in u['results'] if r['slug']==slug and r['width']==width]
  if rs:sheet(slug+'-results-'+str(width),rs,base/a.ui)
  sheet(slug+'-questions-'+str(width),[r for r in u['questionPages'] if r['slug']==slug and r['width']==width],base/a.ui)
  sheet(slug+'-chat-'+str(width),[r for r in c['cards'] if r['slug']==slug and r['width']==width],base/a.chat)
(out/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n');print(len(manifest),'sheets')
