from pathlib import Path
import urllib.request,concurrent.futures,re,json,datetime
from lxml import html
B=Path(__file__).resolve().parent/'research/new-leads';B.mkdir(exist_ok=True)
urls={'welvet':'https://welvetparfume.cz/','welvet-terms':'https://welvetparfume.cz/policies/terms-of-service','inparfum':'https://www.inparfum.cz/','inparfum-terms':'https://www.inparfum.cz/obchodni-podminky/','rbeauty':'https://rbeauty-industry.eu/','rbeauty-terms':'https://rbeauty-industry.eu/terms','top-parfemy':'https://www.top-parfemy.eu/','top-parfemy-size':'https://www.chytryrejstrik.cz/ico-21825971/top-parfemy-s-r-o','rbeauty-size':'https://www.chytryrejstrik.cz/ico-09775129/romana-beauty-industry-s-r-o'}
def run(item):
 k,u=item
 try:
  r=urllib.request.urlopen(u,timeout=35);raw=r.read();(B/(k+'.html')).write_bytes(raw);t=html.fromstring(raw);tx=re.sub(r'\s+',' ',t.text_content());hits=[]
  for pat in [r'IČO?[:\s]+\d[\d\s]{6,12}',r'Obrat.{0,60}',r'[\w.+-]+@[\w.-]+\.[a-z]{2,}']:
   hits+=re.findall(pat,tx,re.I)[:3]
  return {'id':k,'url':u,'status':r.status,'at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'hints':hits,'title':t.xpath('string(//title)')}
 except Exception as e:return {'id':k,'url':u,'error':str(e)}
rows=list(concurrent.futures.ThreadPoolExecutor(max_workers=5).map(run,urls.items()));(B/'lead-captures.json').write_text(json.dumps(rows,ensure_ascii=False,indent=2));print(json.dumps(rows,ensure_ascii=False,indent=2))
