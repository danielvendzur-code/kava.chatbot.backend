from pathlib import Path
from lxml import html
import urllib.request,concurrent.futures,json,re,datetime,unicodedata
B=Path(__file__).resolve().parent/'research'
companies={'alma': ('08881871', 'Alma-natural-cosmetics'), 'naturinka': ('01646109', 'Naturinka')}
def run(it):
 slug,(ico,name)=it;out={'slug':slug,'ico':ico,'at':datetime.datetime.now(datetime.timezone.utc).isoformat()}
 for kind,url in [('ares','https://ares.gov.cz/ekonomicke-subjekty-v-be/rest/ekonomicke-subjekty/'+ico),('size','https://www.chytryrejstrik.cz/ico-'+ico+'/'+name.lower().replace(' ','-')+'-s-r-o')]:
  try:
   f=urllib.request.urlopen(url,timeout=30);raw=f.read();(B/(slug+'-'+kind+('.json' if kind=='ares' else '.html'))).write_bytes(raw)
   if kind=='ares':j=json.loads(raw);out.update(name=j.get('obchodniJmeno'),start=j.get('datumVzniku'),end=j.get('datumZaniku'))
   else:
    t=html.fromstring(raw)
    for e in t.xpath('//script|//style'):e.getparent().remove(e)
    text=' '.join(t.text_content().split());m=re.search(r'Obrat\s+(20\d\d)\s+(.{0,50}?)(?:🔒|Aktiva|Rizika)',text);out['turnoverSnippet']=m.group(0) if m else 'UNKNOWN';out['sizeUrl']=url
  except Exception as e:out[kind+'Error']=str(e)
 (B/(slug+'-finance-summary.json')).write_text(json.dumps(out,ensure_ascii=False,indent=2));return out
print(json.dumps(list(concurrent.futures.ThreadPoolExecutor(4).map(run,companies.items())),ensure_ascii=False,indent=2))
