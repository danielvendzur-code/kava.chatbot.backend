from pathlib import Path
from lxml import html
import urllib.request,json,datetime,concurrent.futures,sys,re
B=Path(__file__).resolve().parent/'research'
def run(args):
 slug,ico,suffix=args;out=B/slug;out.mkdir(exist_ok=True);r={'slug':slug,'ico':ico,'at':datetime.datetime.now(datetime.timezone.utc).isoformat()}
 for label,url in [('official','https://ares.gov.cz/ekonomicke-subjekty-v-be/rest/ekonomicke-subjekty/'+ico),('size','https://www.chytryrejstrik.cz/ico-'+ico+'/'+suffix)]:
  try:
   f=urllib.request.urlopen(url,timeout=30);raw=f.read();(out/(label+('.json' if label=='official' else '.html'))).write_bytes(raw)
   if label=='official':
    d=json.loads(raw);r.update(name=d.get('obchodniJmeno'),start=d.get('datumVzniku'),end=d.get('datumZaniku'),officialRegistry=url)
   else:
    text=' '.join(html.fromstring(raw).text_content().split());i=text.find('Obrat 2024');r.update(sizeSource=url,historicalBand=text[i:i+100] if i>=0 else 'UNKNOWN',latestExact2025='UNKNOWN')
  except Exception as e:r[label+'Error']=str(e)
 (out/'finance-summary.json').write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n');print(slug,r.get('name'),r.get('historicalBand'),r.get('officialError'),flush=True)
if __name__=='__main__':list(concurrent.futures.ThreadPoolExecutor(5).map(run,json.load(open(sys.argv[1]))))
