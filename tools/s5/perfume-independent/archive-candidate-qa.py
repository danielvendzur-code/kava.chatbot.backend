"""Authorized QA proof archive; screenshot PNGs retained, WebP pixels verified identical."""
import pathlib,argparse,json,hashlib,zipfile,datetime
from PIL import Image
p=argparse.ArgumentParser();p.add_argument('--root',required=True);p.add_argument('--destination',required=True);a=p.parse_args();base=pathlib.Path(a.root);dest=pathlib.Path(a.destination);dest.mkdir(parents=True,exist_ok=True);scratch=base/'pixel-equivalent-proof';scratch.mkdir(exist_ok=True);manifest={'at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'scope':'Actual LOCAL QA only; MAIN corec9e4da0. Not live Preview or a complete comparison claim.','authorization':'Owner explicitly permits GitHub QA screenshots/ZIPs, excluded from Vercel under /tools/.','format':'Lossless WebP verified byte-identical RGBA pixel buffers to original PNG. All original PNGs preserved locally.','images':[],'archives':[]};groups={}
for i,src in enumerate(sorted((base/'canonical-final').glob('*.png'))):
 slug='fragrancesamples' if src.name.startswith('fragrancesamples-') else 'essentique';width=src.stem.rsplit('-',1)[-1];assert width in ['320','390','1280'];key=slug+'-'+width;target=scratch/(src.stem+'.webp');original=Image.open(src).convert('RGBA');original.save(target,'WEBP',lossless=True,method=6);decoded=Image.open(target).convert('RGBA');assert original.size==decoded.size and original.tobytes()==decoded.tobytes(),src
 row={'sourcePng':str(src.relative_to(base)),'sourcePngSha256':hashlib.sha256(src.read_bytes()).hexdigest(),'archiveFile':target.name,'webpSha256':hashlib.sha256(target.read_bytes()).hexdigest(),'rgbaPixelsSha256':hashlib.sha256(original.tobytes()).hexdigest(),'pixelIdentical':True,'width':original.width,'height':original.height};manifest['images'].append(row);groups.setdefault(key,[]).append((target,row))
 if (i+1)%22==0:print(i+1,'local screenshot PNGs pixel-verified',flush=True)
assert len(manifest['images'])==132
for key,items in groups.items():
 archive=dest/('local-'+key+'.zip')
 with zipfile.ZipFile(archive,'w',compression=zipfile.ZIP_DEFLATED) as z:
  for file,row in items:z.write(file,file.name)
  for kind in ['results','questions','chat']:
   slug,width=key.rsplit('-',1);sheet=base/'visual-final'/(slug+'-'+kind+'-'+width+'.jpg');assert sheet.is_file();z.write(sheet,'review-sheets/'+sheet.name)
  z.writestr('manifest.json',json.dumps({'scope':manifest['scope'],'images':[r for f,r in items]},ensure_ascii=False,indent=2))
 with zipfile.ZipFile(archive) as z:assert z.testzip() is None
 manifest['archives'].append({'path':str(archive),'bytes':archive.stat().st_size,'sha256':hashlib.sha256(archive.read_bytes()).hexdigest(),'originalScreenshotCount':len(items),'derivedReviewSheets':3})
(dest/'archive-manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n');print('Archives',len(manifest['archives']),'bytes',sum(r['bytes'] for r in manifest['archives']),flush=True)
