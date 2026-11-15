from pathlib import Path
from lxml import html
import urllib.request,json,hashlib,datetime,concurrent.futures
B=Path(__file__).resolve().parent;O=B/'research/contacts';O.mkdir(exist_ok=True)
CONTACTS=[('dews','info@wajda.sk','https://www.dews.sk/o_parfume/'),('siluvone','info@siluvone.sk','https://www.siluvone.sk/'),('durance','info@durance.cz','https://durance.cz/'),('vonavepranie','info@vonavepranie.sk','https://www.vonavepranie.sk/'),('mmnt','info@mmntshop.com','https://mmntshop.cz/obchodni-podminky/'),('aromis','obchod@aromis.eu','https://www.aromis.eu/'),('rozvoneno','info@rozvoneno.cz','https://www.rozvoneno.cz/'),('ketts','ketts@kettscandles.com','https://www.kettscandles.com/vse-o-nakupu/obchodni-podminky/'),('totap','info@totap.cz','https://www.totap.cz/'),('kvapkavoni','info@srubka.info','https://www.kvapkavoni.eu/'),('alma','objednavky@alma.cz','https://www.alma.cz/'),('ravina','info@ravina.cz','https://ravina.cz/content/3-obchodni-podminky'),('vunebis','eshop@vunebis.cz','https://www.vunebis.cz/'),('esodrogeria','obchod@esodrogeria.eu','https://www.esodrogeria.eu/'),('candella','info@candella.sk','https://www.candella.sk/')]
def fetch(item):
 slug,email,url=item;r={'slug':slug,'candidateContact':email,'url':url,'checkedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'scope':'Read-only officialprimaryHTML contactverification, not livewidget/demoQA. No emailapp operations.','tlsVerified':True,'outreachStatus':'NOT_READY','demoLiveUrl':None,'sentByWorker':False,'externalMailboxStatus':'UNKNOWN'}
 try:
  f=urllib.request.urlopen(url,timeout=45);raw=f.read();(O/(slug+'.html')).write_bytes(raw);text=raw.decode('utf8','replace');t=html.fromstring(text);plain=' '.join(t.text_content().split());found=email.lower() in text.lower() or email.lower() in plain.lower();r.update(httpStatus=f.status,finalUrl=f.url,sourceSha256=hashlib.sha256(raw).hexdigest(),officialContact=email if found else None,foundInPrimary=found)
  i=plain.lower().find(email.lower());r['quote']=plain[max(0,i-100):i+len(email)+100] if i>=0 else 'Email explicitly present in primaryHTML/embeddedpubliccontactJSON' if found else 'NOT_FOUND_IN_THIS_PRIMARY_CAPTURE'
 except Exception as e:r['error']=str(e)
 (O/(slug+'.json')).write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n');print(slug,r.get('foundInPrimary'),r.get('error'),flush=True);return r
if __name__=='__main__':
 rows=list(concurrent.futures.ThreadPoolExecutor(4).map(fetch,CONTACTS));(B/'OFFICIAL-CONTACTS-NOT-READY.json').write_text(json.dumps({'status':'NOT_READY_NOT_SENT','ownerWebsite':'https://mojchatbot.sk','contacts':rows,'emailAppOperations':0},ensure_ascii=False,indent=2)+'\n')
