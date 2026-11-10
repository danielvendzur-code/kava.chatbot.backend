"""Source and declarative-tree integrity checks. These are NOT UI/engine/live QA."""
import pathlib,json,hashlib,re,datetime,collections,sys,subprocess
from PIL import Image
root=pathlib.Path(__file__).resolve().parents[3]
reports=[]
slugs=sys.argv[1:] or ['adoraniche','nicheandglow']
assert set(slugs)<= {'adoraniche','nicheandglow','scentisimo'}
for slug in slugs:
 data=json.loads((root/f'n447/s5/sources/{slug}/verified-products.json').read_text())
 products=data['products'];ids={p['id'] for p in products};assert len(ids)==len(products)<=25
 assert len({p['url'] for p in products})==len(products)
 hashes=[]
 for p in products:
  s=p['source'];assert p['category']=='fragrance' and p['available'] and not p['isSample']
  assert s['stock']=='InStock' and s['stockEvidence']['schema'].endswith('/InStock')
  assert s['url']==p['url'] and 'www.'+data['domain']+'/' in p['url']
  assert p['currency']==s['priceEvidence']['currency']==data['currency']
  assert p['priceAmount']==float(s['priceEvidence']['schemaAmount'])==s['priceEvidence']['retailIncludingTaxes']
  visible=float(re.search(r'\d+(?:[.,]\d+)?',s['priceEvidence']['visiblePrice'].replace(' ','').replace('\u00a0','')).group().replace(',','.'))
  assert visible==p['priceAmount'] and p['volume']==s['packEvidence']['pack']
  assert s['verifiedAt'] and s['photoUrl'].startswith('https://cdn.myshoptet.com/usr/www.'+data['domain']+'/')
  assert s['fragrance']['notes'] and s['fragrance']['intensity'] is None and s['fragrance']['occasion'] is None
  f=root/p['photo'].lstrip('/');im=Image.open(f);im.load();assert min(im.size)>=500
  hashes.append(hashlib.sha256(f.read_bytes()).hexdigest())
 assert len(set(hashes))==len(products),'Identical photo bytes need manual review'
 model=json.loads((root/f'n447/s5/sources/{slug}/selection-model.json').read_text())
 leaves=[];paths=[]
 def walk(node,answers):
  if 'productId' in node:
   pid=node['productId'];assert pid in ids
   p=next(p for p in products if p['id']==pid)
   assert all(p['source']['selectionTraits'][k]==v for k,v in answers.items())
   leaves.append(pid);paths.append({'answers':answers,'productId':pid});return
  assert len(node['options'])>=2,'Empty or one-option question'
  assert len({o['value'] for o in node['options']})==len(node['options'])
  for option in node['options']:walk(option,{**answers,node['key']:option['value']})
 walk(model,{})
 assert set(leaves)==ids and len(leaves)==len(ids),'Missing or repeated product route'
 fragment=json.loads((root/f'n447/s5/perfume-fragments/{slug}.config.json').read_text())
 assert not fragment['enableRuntime'] and fragment['addon'] is None and not fragment['budgetQuestion']
 assert len(fragment['quickChips'])==4 and len(set(fragment['quickChips']))==4
 assert len(set(fragment['compareProductIds']))==2 and set(fragment['compareProductIds'])<=ids
 coverage=json.loads((root/'n447/s5/dokazy/perfume-worker/choice-photo-coverage.json').read_text())
 assert fragment['choicePhotos']==coverage['companies'][slug]['choicePhotos']
 for question in coverage['companies'][slug]['allQuestions']:
  photo_hashes=[]
  for value in question['values']:
   path=fragment['choicePhotos'][value][0];asset=coverage['assets'][path];assert min(asset['width'],asset['height'])>=500
   local=root/path.lstrip('/')
   raw=local.read_bytes() if local.exists() else subprocess.check_output(['git','show','HEAD:'+path.lstrip('/')],cwd=root)
   digest=hashlib.sha256(raw).hexdigest();assert digest==asset['sha256'];photo_hashes.append(digest)
  assert len(set(photo_hashes))==len(photo_hashes),'Repeated image within a question'
 reports.append({'slug':slug,'sourceRecords':len(products),'uniqueFormulaRoutes':len(paths),'loadedLocalPhotos':len(hashes),'paths':paths,'priceStockPackUrlChecks':'PASS','treeModelChecks':'PASS','staticChoicePhotoCoverage':'PASS','uiQA':'NOT_RUN_ENGINE_PENDING','liveWidgetQA':'PENDING_OWN_BROWSER_QA','previewQA':'NOT_RUN','paidModelCalls':0})
out={'checkedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'scope':'Reviewed source facts + proposed declarative tree; not shared-engine or browser UI QA','reports':reports}
filename='source-model-check-'+slugs[0]+'.json' if len(slugs)==1 else 'source-model-check.json'
(root/'n447/s5/dokazy/perfume-worker'/filename).write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(out,ensure_ascii=False))
