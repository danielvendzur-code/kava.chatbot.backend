"""Preserve original screenshots; archive complete live evidence and representative local views."""
from pathlib import Path
import json,zipfile,hashlib,datetime,shutil,subprocess
BASE=Path(__file__).resolve().parent; AUDIT=Path('/workspace/work/perfume-audit/perfume-profile-20261113'); OUT=BASE/'proof'; PREV=Path('/workspace/previews/20261113-vonny-profil'); OUT.mkdir(exist_ok=True)
reports={n:json.load(open(AUDIT/n/'independent-ui.json')) for n in ['local-nine','local-six','live-all']}
for n,d in reports.items():
 assert d['complete'] and not d['errors'] and d['allRequestedResultsPassed'],n
assert sum(len(reports[n]['results']) for n in ['local-nine','local-six'])==483
live=reports['live-all'];assert len(live['results'])==161 and len(live['noteProfiles'])==161 and all(x['sourceBound'] for x in live['noteProfiles'])
slugs=list(json.load(open(BASE/'engine-qa.json'))['companies']); archives=[]
for slug in slugs:
 files=[('live/'+p.name,p) for p in (AUDIT/'live-all').glob(slug+'-*.png')]
 sheet=PREV/(slug+'-vsetky-profily-live.png'); assert sheet.exists();files.append(('visual-review/'+sheet.name,sheet))
 first=next(x['id'] for x in live['results'] if x['slug']==slug)
 for n in ['local-nine','local-six']:
  for p in (AUDIT/n).glob(slug+'-*.png'):
   if '-result-'+first+'-' in p.name or '-question-' in p.name:files.append((n+'/'+p.name,p))
 zpath=OUT/(slug+'-visual-profile-qa.zip'); entries=[]
 with zipfile.ZipFile(zpath,'w',zipfile.ZIP_DEFLATED,compresslevel=6) as z:
  for name,p in sorted(files):
   b=p.read_bytes();z.writestr(name,b);entries.append({'path':name,'bytes':len(b),'sha256':hashlib.sha256(b).hexdigest()})
 with zipfile.ZipFile(zpath) as z:
  for e in entries:assert hashlib.sha256(z.read(e['path'])).hexdigest()==e['sha256']
 row={'slug':slug,'archive':zpath.name,'archiveBytes':zpath.stat().st_size,'archiveSha256':hashlib.sha256(zpath.read_bytes()).hexdigest(),'entries':entries};(OUT/(slug+'-manifest.json')).write_text(json.dumps(row,ensure_ascii=False,indent=2)+'\n');archives.append({k:v for k,v in row.items() if k!='entries'})
for n,d in reports.items(): (OUT/(n+'-ui.json')).write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n')
summary={'at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'runtimeCommit':'a918c9db69b83c63fdeb06f9bd13c2a3193a3487','deploymentId':'dpl_44trt79Gb1EanvkiLrATn8cA4Mhx','preview':'https://kava-chatbot-backend-f1h1drbsr-danielvendzur-codes-projects.vercel.app','status':'ALL15_VISUAL_PROFILE_PREVIEW_QA_COMPLETE','localResultViews':483,'localWidths':[320,390,1280],'liveResultViews':161,'liveWidth':390,'sourceBoundLiveProfiles':161,'visualReview':'All161live profiles viewed via15actual contact sheets; representative primary result cards at all3localwidths and live Vonya/SpaceFluid/Essentique visually reviewed.','browser':'Automated actual WPEWebKit, TLSverificationON, not CUA/Chrome or physical devices.','apiMode':'Real loopback backend with injected AI stub; deployed paid provider untested.','paidCalls':0,'mailActions':0,'productionChanges':0,'dnsAliasChanges':0,'archives':archives,'retainedLocalOnly':'All483local raw result/addon/compare/question screenshots remain in '+str(AUDIT)+'; archives include all live screenshots plus representative local outcomes/questions. No deletion.'}
(OUT/'summary.json').write_text(json.dumps(summary,ensure_ascii=False,indent=2)+'\n');print('Archived',len(archives),'companies',sum(r['archiveBytes'] for r in archives),'bytes')
