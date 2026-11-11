"""Read every available remote branch text blob for exact domain/operator/alias evidence."""
import pathlib,subprocess,json,re,collections,datetime,sys
ROOT=pathlib.Path(__file__).resolve().parents[3];OUT=ROOT/'tools/s5/perfume-independent/reports/candidate-packages-20261111/duplicates.json'
def git(*args):return subprocess.check_output(['git','-C',str(ROOT),*args])
refs=git('for-each-ref','--format=%(refname) %(objectname)','refs/remotes/origin').decode().splitlines();objects=collections.defaultdict(list)
terms={'kintsugi':['kintsugiperfumes.com','kintsugi.cz','d9353c-2.myshopify.com','KINTSUGI Labs','11879653'],'oraculum':['oraculum.store','oraculum-store.myshopify.com','ORACULUM Company','10905081'],'furiosa':['furiosa.cz','furiosa-store.myshopify.com','FURIOSA WORLD','02476029'],'scentium':['scentium.cz','ucet.scentium.cz','ir0ufv-18.myshopify.com','Scentium s.r.o.','24954748']}
for row in refs:
 ref,sha=row.split()
 for line in git('ls-tree','-r',ref).decode().splitlines():
  meta,p=line.split('\t',1);mode,kind,blob=meta.split()
  if kind!='blob' or not re.search(r'\.(js|mjs|cjs|ts|tsx|json|md|html|csv|txt|py|yaml|yml)$',p,re.I):continue
  if re.search(r'(package-lock|node_modules|secret|credential|\.env)',p,re.I):continue
  objects[blob].append({'ref':ref,'path':p})
if '--next-pair' in sys.argv:
 terms={'essentique':['essentique.sk','MOKK','57198756'],'fragrancesamples':['fragrancesamples.cz','MiroLi Parfums','29615984','czechfragranceclub.cz','krasyorientu.cz']}
 OUT=OUT.with_name('essentique-fragrancesamples-duplicates.json')
if '--alex-flakon' in sys.argv:
 terms={'alexmonhart':['alexmonhart.com','ywxmda-v4.myshopify.com','Alexmonhart','05910510','info@alexmonhart.com'],'flakon':['flakon.sk','Realitygroup','Reality group','51695201','obchod@flakon.sk']}
 OUT=ROOT/'tools/s5/perfume-independent/reports/alexmonhart-flakon-20261111/duplicates.json'
if '--orion-inspirovane' in sys.argv:
 terms={'orion':['parfumeria-orion.sk','ATM Consulting','ATMConsulting','45723991','info@parfumeria-orion.sk'],'inspirovane':['inspirovaneparfemy.cz','556869.myshoptet.com','Zdeňka Babková','Zdenka Babkova','75575434','Lanoir','info@inspirovaneparfemy.cz']}
 OUT=ROOT/'tools/s5/perfume-independent/reports/orion-inspirovane-20261111/duplicates.json'
if '--myskino' in sys.argv:
 terms={'myskino':['myskino.cz','myskino.com','Col de Bonte','ColdeBonte','29413184','info@myskino.cz']}
 OUT=ROOT/'tools/s5/perfume-independent/reports/myskino-20261111/duplicates.json'
if '--leparfum' in sys.argv:
 terms={'leparfumlechic':['leparfumlechic.sk','Le Parfum & Le Chic','Lukáš Roth','Lukas Roth','Fineluxart','51786796','SK1080976490','info@leparfumlechic.sk']}
 OUT=ROOT/'tools/s5/perfume-independent/reports/leparfumlechic-20261111/duplicates.json'
if '--replacement-pair' in sys.argv:
 terms={'vavavoom':['vava-voom.cz','vava-voom.sk','94f410-de.myshopify.com','VAVAVOOM','04930941','info@vava-voom.cz'],'rafinad':['rafinadparfumerie.com','RAFINAD','01413911','info@rafinadparfumerie.com'],'vzorky-parfemu':['vzorky-parfemu.cz','KB Parfums','23937564','mek.krista@gmail.com']}
 OUT=ROOT/'tools/s5/perfume-independent/reports/replacements-20261111/duplicates.json'
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
