from pathlib import Path
import json,datetime,zipfile,shutil
BASE=Path(__file__).resolve().parent; summary=json.load(open(BASE/'proof/summary.json'));assert summary['status']=='ALL15_VISUAL_PROFILE_PREVIEW_QA_COMPLETE'
packet=BASE.parent/'perfume-preview-20261113/outreach-15';old='https://kava-chatbot-backend-3jfxpdtpl-danielvendzur-codes-projects.vercel.app';new=summary['preview']
for p in packet.glob('*.md'):p.write_text(p.read_text().replace(old,new))
p=packet/'ZOZNAM-A-TEXTY-15.md';s=p.read_text();a=s.index('Nových šesť prešlo');b=s.index('\n\nOrion,',a);s=s[:a]+'Aktuálny vzhľad všetkých 15 ukážok prešiel 483/483 lokálnymi výsledkami na šírkach 320/390/1280 a 161/161 výsledkami vlastného živého Preview na 390 px. Zo všetkých 161 profilov boli overené zdrojové tóny a vizuálne prezreté snímky. Sú odstránené pomocné texty o počte krokov a výbere podľa uvedených tónov. Výsledok má otvorený farebný profil vône bez vymyslených percent alebo skóre. Fotografie, presné ceny/balenia, CTA, doplnky, porovnanie, reset a priebeh prešli; chat iba cez reálny lokálny backend s injektovaným AI stubom, platené volania 0. Testovaný runtime `'+summary['runtimeCommit']+'`, Preview `'+summary['deploymentId']+'`.'+s[b:];p.write_text(s)
p=packet/'manifest.json';d=json.load(open(p));d['presentationUpdatedAt']=datetime.datetime.now(datetime.timezone.utc).isoformat();d['presentationRuntime']=summary['runtimeCommit'];d['presentationProof']='tools/s5/perfume-presentation-20261113/proof/summary.json'
for r in d['rows']:r['previewUrl']=r['previewUrl'].replace(old,new)
p.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n')
prev=Path('/workspace/previews/20261113');shutil.copy2(packet/'ZOZNAM-A-TEXTY-15.md',prev/'15-neposlanych-kontakty-a-texty.md')
# New download preserves the old source archive and adds current screenshots.
zpath=prev/'15-neposlanych-novy-vzhlad-NOT_READY.zip'
with zipfile.ZipFile(zpath,'w',zipfile.ZIP_DEFLATED,compresslevel=6) as z:
 for p in packet.glob('*'):
  if p.is_file():z.write(p,'textove-navrhy/'+p.name)
 for p in Path('/workspace/previews/20261113-vonny-profil').glob('*-novy-vysledok-live.png'):z.write(p,'aktualne-zive-snimky/'+p.name)
 z.write(BASE/'proof/summary.json','QA-summary.json')
print('Updated15 Preview links and owner download:',zpath)
