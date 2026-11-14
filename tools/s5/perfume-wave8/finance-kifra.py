from pathlib import Path
import urllib.request,json,datetime
B=Path(__file__).resolve().parent/'research';P=B
def get(k,u):
 r=urllib.request.urlopen(u,timeout=35);j=json.load(r);(B/(k+'.json')).write_text(json.dumps({'url':u,'at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'data':j},ensure_ascii=False,indent=2));return j
j=json.load(open(P/'kifra-ruz-index.json'));print('INDEX',j,flush=True)
u=get('kifra-unit','https://www.registeruz.sk/cruz-public/api/uctovna-jednotka?id='+str(j['id'][0]));print('UNIT',u['idUctovnychZavierok'],flush=True)
for zid in sorted(u['idUctovnychZavierok'],reverse=True)[:3]:
 z=get('kifra-statement-'+str(zid),'https://www.registeruz.sk/cruz-public/api/uctovna-zavierka?id='+str(zid));print('STATEMENT',zid,z.get('obdobieOd'),flush=True)
 if z.get('obdobieOd','').startswith('2025'):
  for vid in z['idUctovnychVykazov']:
   v=get('kifra-report-'+str(vid),'https://www.registeruz.sk/cruz-public/api/uctovny-vykaz?id='+str(vid));print('REPORT',vid,v.get('idSablony'),[(x['nazov'],x['data'][:12]) for x in v.get('obsah',{}).get('tabulky',[])],v.get('prilohy'),flush=True)
