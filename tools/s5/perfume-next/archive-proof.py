"""Lossless proof archive; exact byte verification, no deletion of originals."""
import argparse,pathlib,json,hashlib,zipfile,datetime,shutil
p=argparse.ArgumentParser();p.add_argument('--slug',required=True);p.add_argument('--local-root',required=True);p.add_argument('--ui-folder',default='final');p.add_argument('--merchant-root',required=True);a=p.parse_args();base=pathlib.Path(__file__).resolve().parent;out=base/'proof-20261113'/a.slug;out.mkdir(parents=True,exist_ok=True);local=pathlib.Path(a.local_root);merchant=pathlib.Path(a.merchant_root);ui=json.load(open(local/a.ui_folder/'independent-ui.json'));chat=json.load(open(local/'chat/independent-chat.json'));assert ui['complete'] and not ui['errors'];assert chat['complete'] and not chat['errors'];files=[]
for label,folder in [('local-ui',local/a.ui_folder),('local-chat',local/'chat'),('merchant',merchant)]:
 for f in folder.iterdir():
  if f.suffix.lower()=='.png' or (label!='merchant' and f.suffix=='.json'):files.append((label+'/'+f.name,f))
zip_path=out/'lossless-proof.zip';entries=[]
with zipfile.ZipFile(zip_path,'w',zipfile.ZIP_DEFLATED,compresslevel=6) as z:
 for name,f in sorted(files):
  b=f.read_bytes();z.writestr(name,b);entries.append({'name':name,'bytes':len(b),'sha256':hashlib.sha256(b).hexdigest()})
with zipfile.ZipFile(zip_path) as z:
 for e in entries:assert hashlib.sha256(z.read(e['name'])).hexdigest()==e['sha256']
manifest={'checkedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'slug':a.slug,'status':'LOCAL_FIXTURE_QA_COMPLETE_NOT_INTEGRATED_NOT_PREVIEW','scope':'Exact PNG/JSON archive bytes verified; PNG pixels preserved. All original local files retained. Not live Preview QA.','entries':entries,'entryCount':len(entries),'archiveBytes':zip_path.stat().st_size,'archiveSha256':hashlib.sha256(zip_path.read_bytes()).hexdigest(),'resultViews':len(ui['results']),'questionViews':len(ui['questionPages']),'interactionGroups':len(ui['interactions']),'mockChatCards':len(chat['cards']),'paidCalls':0}
(out/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n');shutil.copy2(local/a.ui_folder/'independent-ui.json',out/'local-ui.json');shutil.copy2(local/'chat/independent-chat.json',out/'local-chat.json');print({k:v for k,v in manifest.items() if k!='entries'})
