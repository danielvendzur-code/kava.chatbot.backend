from pathlib import Path
import shutil,json,zipfile,hashlib,datetime
BASE=Path(__file__).resolve().parent;AUDIT=Path('/workspace/work/perfume-audit/wave3-20261113');PROOF=BASE/'proof/atmanperfumes';PROOF.mkdir(parents=True,exist_ok=True);r=json.load(open(AUDIT/'atman-local-fixed-qa/independent-ui.json'));assert r['complete'] and len(r['results'])==18 and not r['errors'];assert len(r['noteProfiles'])==18 and all(x['sourceBound'] for x in r['noteProfiles']);shutil.copy2(AUDIT/'atman-local-fixed-qa/independent-ui.json',PROOF/'local-ui.json');shutil.copy2(AUDIT/'atman-legal-product-preflight.json',BASE/'research/atmanperfumes/legal-product-preflight.json');files=[]
for name in ['atman-local-fixed-qa','atman-live']:
 for p in (AUDIT/name).glob('*'):
  if p.suffix in ['.png','.json']:files.append((name+'/'+p.name,p))
for p in Path('/workspace/previews/20261113-wave3').glob('atman-opravene-*.png'):files.append(('visual-review/'+p.name,p))
files.append(('visual-review/atman-photos-review.jpg',AUDIT/'atman-photos-review.jpg'))
zpath=PROOF/'local-and-merchant-proof.zip';entries=[]
with zipfile.ZipFile(zpath,'w',zipfile.ZIP_DEFLATED,compresslevel=6) as z:
 for name,p in sorted(files):
  b=p.read_bytes();z.writestr(name,b);entries.append({'name':name,'bytes':len(b),'sha256':hashlib.sha256(b).hexdigest()})
with zipfile.ZipFile(zpath) as z:
 for e in entries:assert hashlib.sha256(z.read(e['name'])).hexdigest()==e['sha256']
d={'at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'status':'LOCAL_FIXTURE_QA_COMPLETE_NOT_INTEGRATED_NOT_PREVIEW','runtimeBase':'ebf1cc8e72d5d24b79c4839d4e76486610c0dbd4','localResults':18,'distinctFormulas':6,'paidCalls':0,'visualReview':'All18fixed primary outcomes visuallyreviewed via320/390/1280contact sheets, allsixoriginalgalleryphotos reviewed, merchanthome/product reviewed. ActualwhiteSVGlogo visible on darkbackground; literalTop/Baza headings faithfully normalized withoutchangingnotephrases.','priorRun':'Original18testviews passed mechanicalchecks but visualreview foundwhiteonwhitelogo andflatfallback. Originalrawscreens retainedlocally; thisproofsupersedes priorrun/firstsource558ATMAN. No sharedenginefix.','archiveBytes':zpath.stat().st_size,'sha256':hashlib.sha256(zpath.read_bytes()).hexdigest(),'entries':entries};(PROOF/'manifest.json').write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n');print('Atman proofbytes',zpath.stat().st_size)
