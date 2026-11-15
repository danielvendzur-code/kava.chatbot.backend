from pathlib import Path
import json,zipfile,datetime
B=Path(__file__).resolve().parent;Q=Path('/workspace/work/perfume-audit/batch2-20261115')
for slug,folder,count in [('totap','totap-final-local-qa',18),('kvapkavoni','kvapka-alma-local-qa',15),('alma','alma-final-local-qa',12)]:
 p=Q/folder;d=json.load(open(p/'independent-ui.json'));results=[x for x in d['results'] if x['slug']==slug];assert len(results)==count and all(x['photoLoaded'] and x['ctaInsideCard'] and x['reset'] for x in results)
 if slug!='kvapkavoni':assert d['allRequestedResultsPassed']
 report={k:v for k,v in d.items() if not isinstance(v,list) and k not in ['failure','complete','allRequestedResultsPassed']}
 for k,v in d.items():
  if isinstance(v,list):report[k]=[x for x in v if not isinstance(x,dict) or x.get('slug') in [None,slug]]
 report.update(results=results,allCompanyRequestedResultsPassed=True,company=slug,finalResultViews=count,complete=True,visualReview='All finalresult screenshots at320/390/1280 manuallyvisuallyreviewed',qaType='Localimmutablefixture/sourceIDmock, notintegrated/livePreview',paidModelCalls=0)
 if slug=='kvapkavoni':report['extractionQualification']='Parent multi-companyrun completed all15Kvapka results+allthree widths before subsequentALMA failure. ExtractonlyKvapka positive result proof; originalunmodified mixedreport preserved inarchive. SeparateALMA finalrerunpassed. Kvapkalogo-only incremental3views separatelyarchived, no full15rerun claim.'
 (B/(slug+'-ui-qa.json')).write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
 with zipfile.ZipFile(B/f'evidence/{slug}-local-qa.zip','w',zipfile.ZIP_DEFLATED) as z:
  for a in p.iterdir():
   if a.is_file() and (a.name.startswith(slug) or a.name=='independent-ui.json'):z.write(a,a.name)
 (B/(slug.upper()+'-HANDOFF.md')).write_text(f'''# {slug}: source/local handoff\n\nLOCAL_FIXTURE_QA_COMPLETE_NOT_INTEGRATED_NOT_PREVIEW. PERFUME_WORKER sources; MAIN sharedruntime/backend/integration/livePreview.\n\n- Catalogue `catalogues/{slug}.js`; facts `n447/s5/sources/{slug}/verified-products.json`; model samefolder`selection-model.json`.\n- Config `n447/s5/perfume-fragments/{slug}.config.json`; separate selection-model fragment sameprefix.\n- Assets `assets/s5/{slug}/`; exactimport/registry/brandguard/companyCSS in `tools/s5/perfume-batch2-20261115/candidate-packages/{slug}/integration-review.json`.\n- QA `{slug}-ui-qa.json`, evidence `evidence/{slug}-local-qa.zip`, {count}finalviews320/390/1280 allvisuallyreviewed. Existingunchangedc9core/snapshot68dbfixture, sourceIDmockonly/paid0. MAINmustenableexistingstandalonepolish+visual-v1 opt-in and brandguard, thenactualREADYPreviewQA.\n- 447+10unchanged; no production/DNS/mail/core/backend edits. No inventednotepercentages or trialtext.\n''')
with zipfile.ZipFile(B/'evidence/kvapkavoni-logo-incremental-qa.zip','w',zipfile.ZIP_DEFLATED) as z:
 for p in (Q/'kvapka-logo-incremental-qa').iterdir():
  if p.is_file():z.write(p,p.name)
with (B/'KVAPKAVONI-HANDOFF.md').open('a') as f:f.write('\nFiveverified250ml15.90EURnativevariants. Gocceunverifiedselectorblockedexcluded. ParentmixedQAfailedonlylaterALMA; extractedKvapka15passed and originalreportpreserved. Headercontrastonlychangecheckedwithoneleafat3widths, allthreeimagesvisuallyreviewed; no full15rerunclaim.\n')
with (B/'ALMA-HANDOFF.md').open('a') as f:f.write('\nFourfullretail10mlformulas, notsamples. ESSEalcohol10mlSKU1038/1390CZK; oilvariantnotextraformula. MAGICKAonlysweet-fresh/orientpublisherdescriptors, noINCIinference. InitialprofiletextparserfailurecorrectedbyexposingonlycuratedsensorysourceText; final12viewsallpassed. Originalrawmarketingremainsauditonly, MAINbrandguardmustexcludemedical/hormonal/crystalclaims.\n')
with (B/'TOTAP-HANDOFF.md').open('a') as f:f.write('\nSixselectednative50ml409CZKSKUs, not159CZK10mlminimum. Visible own-inspired/notdesigneroriginaldisclosureaddedafterinitialQAflag; final18passed. Ordinarydesignernamefinderobserved is FIT_REVIEW, no absent-advisorabsoluteclaim.\n')
p=B/'BATCH2-PROGRESS.json';d=json.load(open(p));d.update(at=datetime.datetime.now(datetime.timezone.utc).isoformat(),completedSourceLocal=['dews','siluvone','durance','vonavepranie','mmnt','aromis','rozvoneno','ketts','totap','kvapkavoni','alma'],primaryFormulas=59,finalLocalViewportViews=177,sourcePackagesBuiltQaNext=['vunebis','esodrogeria','candella','ravina'],reservedSourcesNext=[],fifteenth='Candella51188112reserved3dddc97, verysmallrevenuecommercialreview; SvieckovounreservedVATconflict');p.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n')
