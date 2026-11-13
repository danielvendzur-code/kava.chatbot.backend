"""Read every available remote branch text blob for exact domain/operator/alias evidence."""
import pathlib,subprocess,json,re,collections,datetime,sys
ROOT=pathlib.Path(__file__).resolve().parents[3];OUT=ROOT/'tools/s5/perfume-independent/reports/candidate-packages-20261111/duplicates.json'
def git(*args):return subprocess.check_output(['git','-C',str(ROOT),*args])
refs=git('for-each-ref','--format=%(refname) %(objectname)','refs/remotes/origin').decode().splitlines();objects=collections.defaultdict(list)
terms=json.loads((ROOT/'tools/s5/perfume-wave4/research/duplicate-terms.json').read_text())
OUT=ROOT/'tools/s5/perfume-wave4/research/fresh-duplicates.json'
for row in refs:
 ref,sha=row.split()
 for line in git('ls-tree','-r',ref).decode().splitlines():
  meta,p=line.split('\t',1);mode,kind,blob=meta.split()
  if kind!='blob' or not re.search(r'\.(js|mjs|cjs|ts|tsx|json|md|html|csv|txt|py|yaml|yml)$',p,re.I):continue
  if re.search(r'(package-lock|node_modules|secret|credential|\.env)',p,re.I):continue
  objects[blob].append({'ref':ref,'path':p})
patterns={slug:[(term,re.compile(r'\s*'.join(term) if term.isdigit() else re.escape(term),re.I)) for term in ts] for slug,ts in terms.items()}
proc=subprocess.Popen(['git','-C',str(ROOT),'cat-file','--batch'],stdin=subprocess.PIPE,stdout=subprocess.PIPE);hits=collections.defaultdict(list);missing=[];controls=0
for sha,loc in objects.items():
 proc.stdin.write((sha+'\n').encode());proc.stdin.flush();head=proc.stdout.readline().decode().split()
 if len(head)!=3:missing.append(sha);continue
 data=proc.stdout.read(int(head[2]));proc.stdout.read(1);text=data.decode('utf-8','replace')
 if 'mydlarnarubens.cz' in text or 'raekosmetika.cz' in text:controls+=1
 for slug,pats in patterns.items():
  found=[t for t,p in pats if p.search(text)]
  if found:hits[slug].append({'blob':sha,'terms':found,'locations':loc})
proc.stdin.close();proc.wait()
report={'checkedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'scope':'All locally fetched remote branch heads; official domains, aliases, operators and ICO, not slug-only. No reservation made.','remoteHeads':dict(r.split() for r in refs),'remoteCount':len(refs),'uniqueTextBlobs':len(objects),'missingBlobs':missing,'positiveControlBlobs':controls,'terms':terms,'hits':hits,'claimOwnership':{slug:'NOT_CHANGED_BY_THIS_AUDIT' for slug in terms}}
OUT.parent.mkdir(parents=True,exist_ok=True);OUT.write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');print(json.dumps({'refs':len(refs),'blobs':len(objects),'missing':len(missing),'controls':controls,'hitBlobs':{k:len(v) for k,v in hits.items()}}))
