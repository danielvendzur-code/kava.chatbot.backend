from pathlib import Path
import urllib.request,json,datetime,concurrent.futures
B=Path(__file__).resolve().parent/'research'
def get(url):
 with urllib.request.urlopen(url,timeout=30) as f:d=json.load(f)
 return {'url':url,'at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'data':d}
for slug,ico in [('parfums4all','36291781'),('scents','46721177')]:
 d=get('https://api.statistics.sk/rpo/v1/search?identifier='+ico);(B/(slug+'-rpo.json')).write_text(json.dumps(d,ensure_ascii=False,indent=2));print(slug,'RPO',[(x['fullNames'],x.get('termination')) for x in d['data']['results']],flush=True)
 u=json.load(open(B/(slug+'-unit.json')))['data'];ids=sorted(u['idUctovnychZavierok'],reverse=True)[:3];ds=list(concurrent.futures.ThreadPoolExecutor(3).map(lambda i:get('https://www.registeruz.sk/cruz-public/api/uctovna-zavierka?id='+str(i)),ids));(B/(slug+'-statements.json')).write_text(json.dumps(ds,ensure_ascii=False,indent=2))
 for z in ds:
  zz=z['data'];print(slug,zz.get('id'),zz.get('obdobieOd'),zz.get('obdobieDo'),zz.get('idUctovnychVykazov'),flush=True)
  if zz.get('obdobieOd','').startswith('2025'):
   for i in zz['idUctovnychVykazov']:
    v=get('https://www.registeruz.sk/cruz-public/api/uctovny-vykaz?id='+str(i));(B/(slug+'-report-'+str(i)+'.json')).write_text(json.dumps(v,ensure_ascii=False,indent=2));print('REPORT',slug,i,'template',v['data'].get('idSablony'),[(t['nazov'],t['data'][:20]) for t in v['data'].get('obsah',{}).get('tabulky',[])],[(p['id'],p['meno']) for p in v['data'].get('prilohy',[])],flush=True)
