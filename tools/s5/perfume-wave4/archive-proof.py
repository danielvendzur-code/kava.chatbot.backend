from pathlib import Path
import json,zipfile,hashlib,datetime,shutil
BASE=Path(__file__).resolve().parent;AUDIT=Path('/workspace/work/perfume-audit/wave4-20261113');PREV=Path('/workspace/previews/20261113-wave4');OUT=BASE/'proof';OUT.mkdir(exist_ok=True);summary=[]
for slug,n,run in [('hypno',4,'local-qa'),('bookarazzi',5,'local-book-logo-qa')]:
 folder=AUDIT/run;report=json.load(open(folder/'independent-ui.json'));assert report['complete'] and not report['errors'];scoped={k:([x for x in v if x.get('slug')==slug] if k in ['results','questionPages','interactions','enrichedStates','noteProfiles'] else v) for k,v in report.items()};assert len(scoped['results'])==n*3 and len(scoped['noteProfiles'])==n*3;assert all(x['sourceBound'] for x in scoped['noteProfiles']);(OUT/(slug+'-local-ui.json')).write_text(json.dumps(scoped,ensure_ascii=False,indent=2)+'\n');files=[(run+'/'+p.name,p) for p in folder.glob(slug+'-*.png')]
 for p in AUDIT.glob(slug+'-*.png'):files.append(('live-merchant/'+p.name,p))
 if slug=='hypno':
  for p in Path('/workspace/work/perfume-audit/wave4-20261113-hypno-question').glob('*.png'):files.append(('live-merchant-question/'+p.name,p))
 else:
  for p in Path('/workspace/work/perfume-audit/wave4-20261113-book-retry').glob('*.png'):files.append(('live-merchant-home-retry/'+p.name,p))
 for p in PREV.glob(slug+'-*.png'):files.append(('visual-review/'+p.name,p))
 files.append(('visual-review/'+slug+'-photos-review.jpg',AUDIT/(slug+'-photos-review.jpg')));zpath=OUT/(slug+'-source-local-proof.zip');entries=[]
 with zipfile.ZipFile(zpath,'w',zipfile.ZIP_DEFLATED,compresslevel=6) as z:
  for name,p in sorted(files):
   b=p.read_bytes();z.writestr(name,b);entries.append({'name':name,'bytes':len(b),'sha256':hashlib.sha256(b).hexdigest()})
 with zipfile.ZipFile(zpath) as z:
  for e in entries:assert hashlib.sha256(z.read(e['name'])).hexdigest()==e['sha256']
 row={'slug':slug,'status':'LOCAL_FIXTURE_QA_COMPLETE_NOT_INTEGRATED_NOT_PREVIEW','primaryRecords':n,'finalLocalResults':n*3,'sourceBoundNoteProfiles':n*3,'archiveBytes':zpath.stat().st_size,'archiveSha256':hashlib.sha256(zpath.read_bytes()).hexdigest(),'visualReview':'Allfinalprimaryoutcomes at320/390/1280viewed throughactualcontact sheets; originalmerchantphotos reviewed; merchanthome/product visuallyreviewed. Chatcomparisonsandcontrastingavatars also reviewed.','entries':entries};(OUT/(slug+'-manifest.json')).write_text(json.dumps(row,ensure_ascii=False,indent=2)+'\n');summary.append({k:v for k,v in row.items() if k!='entries'})
for name,p in [('live-merchant-preflight',AUDIT/'live-preflight.json'),('hypno-question-mode',Path('/workspace/work/perfume-audit/wave4-20261113-hypno-question/live-preflight.json')),('bookarazzi-home-retry',Path('/workspace/work/perfume-audit/wave4-20261113-book-retry/live-preflight.json'))]:shutil.copy2(p,OUT/(name+'.json'))
d={'at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'owner':'PERFUME_WORKER','integrationOwner':'MAIN','runtimeBase':'ef38930705f7ace33d9e2074cfe2f10847be4cbf','status':'TWO_SOURCE_PACKAGES_LOCAL_QA_COMPLETE_MAIN_INTEGRATION_PENDING','finalLocalResults':27,'widths':[320,390,1280],'primaryRecords':9,'browser':'OwnactualautomatedWPEWebKit; TLSon; notCUA/Chrome/physicaldeviceclaims.','chatTest':'Source-IDofflinemocks only, no deployedpaidprovider test.','paidCalls':0,'mailActions':0,'productionChanges':0,'newCoreChanges':0,'extraRuns':'Bookarazzientire15rerun afterenlargingofficiallogo via companyCSS; not15additionaluniqueproducts. Hypnounchanged12reused.','archives':summary,'allOriginalsPreserved':True};(OUT/'summary.json').write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n');print([(r['slug'],r['archiveBytes']) for r in summary])
