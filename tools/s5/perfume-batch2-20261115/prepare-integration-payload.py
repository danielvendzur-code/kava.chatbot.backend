"""Package only reviewed company files. Does not edit any shared integration file."""
from pathlib import Path
import json,hashlib,zipfile,subprocess,datetime
R=Path(__file__).resolve().parents[3];B=Path(__file__).resolve().parent
manifest=json.loads((B/'BATCH-15-INTEGRATION.json').read_text());entries={}
for company in manifest['companies']:
 for f in company['files']:
  p=R/f['path'];assert hashlib.sha256(p.read_bytes()).hexdigest()==f['sha256'],p
  entries[f['path']]=p
 css=company['companyCss'];entries[css['destination']]=R/css['source']
for name in ['BATCH-15-HANDOFF.md','BATCH-15-INTEGRATION.json','FINAL-CONSISTENCY-CHECK.json','OFFICIAL-CONTACTS-NOT-READY.json','OUTREACH-DRAFTS-NOT-READY.md']:
 entries[str((B/name).relative_to(R))]=B/name
for company in manifest['companies']:
 p=R/company['integrationReview'];entries[str(p.relative_to(R))]=p
assert all(p.startswith(('catalogues/','assets/s5/','n447/s5/sources/','n447/s5/perfume-fragments/','n447/s5/brands/','tools/s5/perfume-batch2-20261115/')) for p in entries)
assert not any(p in entries for p in ['n447/s5/registry.js','n447/s5/boot.js','n447/s5/engine.js','n447/s5/advisor-core.js','lib/cosmetics-chat.js'])
assert 'assets/s5/ravina/coffee.jpg' not in entries and 'assets/s5/ravina/violet.png' not in entries
out=B/'evidence/company-integration-files.zip'
record={'createdAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'sourceCheckpoint':subprocess.check_output(['git','-C',str(R),'rev-parse','HEAD'],text=True).strip(),'archive':str(out.relative_to(R)),'scope':'Exact reviewed15company assets/catalogues/facts/models/configfragments and company-only CSS at destination paths; zero sharedruntime/backend files. Archive is an integration aid, not deployed or liveQA. MAIN reviews files before extracting into ownintegrationbranch.','files':[{'path':name,'sha256':hashlib.sha256(p.read_bytes()).hexdigest(),'bytes':p.stat().st_size} for name,p in sorted(entries.items())]}
with zipfile.ZipFile(out,'w',zipfile.ZIP_DEFLATED) as z:
 for name,p in sorted(entries.items()):z.write(p,name)
 z.writestr('tools/s5/perfume-batch2-20261115/PAYLOAD-INDEX.json',json.dumps(record,ensure_ascii=False,indent=2)+'\n')
record['archiveSha256']=hashlib.sha256(out.read_bytes()).hexdigest();record['archiveBytes']=out.stat().st_size
(B/'COMPANY-PAYLOAD.json').write_text(json.dumps(record,ensure_ascii=False,indent=2)+'\n')
with zipfile.ZipFile(out) as z:assert z.testzip() is None
print(json.dumps({'files':len(entries),'bytes':out.stat().st_size,'sha256':record['archiveSha256'],'sharedRuntimeFiles':0}))
