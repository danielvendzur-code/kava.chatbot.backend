from pathlib import Path
import json,urllib.request,datetime,concurrent.futures
B=Path(__file__).resolve().parent/'research'
def get(slug,key,url):
 f=urllib.request.urlopen(url,timeout=35);raw=f.read();(B/(slug+'-'+key+'.json')).write_bytes(raw);return json.loads(raw)
def run(it):
 slug,ico=it;o={'slug':slug,'ico':ico,'at':datetime.datetime.now(datetime.timezone.utc).isoformat()}
 try:
  r=get(slug,'rpo','https://api.statistics.sk/rpo/v1/search?identifier='+ico);o['operator']=[(x['fullNames'],x.get('termination')) for x in r['results']];ix=get(slug,'ruz-index','https://www.registeruz.sk/cruz-public/api/uctovne-jednotky?ico='+ico+'&zmenene-od=2000-01-01');unit=get(slug,'unit','https://www.registeruz.sk/cruz-public/api/uctovna-jednotka?id='+str(ix['id'][0]));o['unit']=ix['id'][0]
  for zid in sorted(unit['idUctovnychZavierok'],reverse=True)[:3]:
   z=get(slug,'statement-'+str(zid),'https://www.registeruz.sk/cruz-public/api/uctovna-zavierka?id='+str(zid))
   if z.get('obdobieOd','').startswith('2025'):
    o['statement']=zid;o['reports']=[]
    for rid in z['idUctovnychVykazov']:
     v=get(slug,'report-'+str(rid),'https://www.registeruz.sk/cruz-public/api/uctovny-vykaz?id='+str(rid));o['reports'].append({'id':rid,'template':v.get('idSablony'),'tables':[(x['nazov'],x['data'][:16]) for x in v.get('obsah',{}).get('tabulky',[])],'attachments':v.get('prilohy')})
    break
 except Exception as e:o['error']=str(e)
 (B/(slug+'-finance-summary.json')).write_text(json.dumps(o,ensure_ascii=False,indent=2));return o
print(json.dumps(list(concurrent.futures.ThreadPoolExecutor(4).map(run,[('drogeriadomov','51468221'),('esodrogeria','47350318')])),ensure_ascii=False,indent=2))
