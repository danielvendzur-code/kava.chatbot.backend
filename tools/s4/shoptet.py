"""Shoptet: kategórie -> produkty -> JSON (názov, cena, sklad, varianty, parametre, popis, foto). python3 -I tools/shoptet.py OUTDIR BASE cat1 cat2 ..."""
import sys,re,json,html,subprocess,os,time
out,base,cats=sys.argv[1],sys.argv[2].rstrip('/'),sys.argv[3:]
os.makedirs(out,exist_ok=True)
def get(u):
    r=subprocess.run(['curl','-sL','-m','30','-A','Mozilla/5.0 (Windows NT 10.0; Win64; x64)',u],capture_output=True);return r.stdout.decode('utf-8','replace')
txt=lambda s:re.sub(r'\s+',' ',html.unescape(re.sub(r'<[^>]+>',' ',s or ''))).strip()
links={}
for c in cats:
    for page in range(1,8):
        u=base+c+('' if page==1 else f'strana-{page}/')
        h=get(u);found=re.findall(r'<a href="('+re.escape(base)+r'/[^"#?]+/|/[^"#?]+/)" class="(?:name|image|p-name)',h)
        found+=re.findall(r'class="(?:name|p-name)"[^>]*href="([^"#?]+)"',h)
        new=0
        for f in found:
            f=f if f.startswith('http') else base+f
            if f not in links: links[f]=[c];new+=1
            elif c not in links[f]: links[f].append(c)
        if not new: break
print('produkty',len(links),file=sys.stderr)
res=[]
for u,c in links.items():
    h=get(u);time.sleep(0.3)
    ld=[]
    for m in re.finditer(r'<script type="application/ld\+json">(.*?)</script>',h,re.S):
        try:
            j=json.loads(m.group(1));ld+=j if isinstance(j,list) else [j]
        except Exception: pass
    prod=[x for x in ld if x.get('@type')=='Product']
    params={}
    for m in re.finditer(r'<tr[^>]*>\s*<th[^>]*>(.*?)</th>\s*<td[^>]*>(.*?)</td>',h,re.S):
        k,v=txt(m.group(1)).rstrip(':'),txt(m.group(2))
        if k and v and len(k)<40: params[k]=v
    short=txt((re.search(r'class="p-short-description"[^>]*>(.*?)</div>',h,re.S) or [0,''])[1])
    desc=txt((re.search(r'id="description"[^>]*>(.*?)(?:id="productDiscussion"|id="ratingTab"|class="extended-description")',h,re.S) or [0,''])[1])[:3000]
    name=txt((re.search(r'<h1[^>]*>(.*?)</h1>',h,re.S) or [0,''])[1])
    img=(re.search(r'og:image" content="([^"]+)"',h) or [0,''])[1]
    variants=[]
    opt={v:html.unescape(t).strip() for v,t in re.findall(r'<option value="(\d+)" data-index="\d+">([^<]+)</option>',h)}
    m=re.search(r'necessaryVariantData = (\{.*?\});\s*\n',h)
    if m:
        try:
            nv=json.loads(m.group(1))
            for k,d in nv.items():
                pairs=re.findall(r'(\d+)-(\d+)',k);lab=' / '.join(opt.get(b,b) for a,b in pairs)
                variants.append({'name':lab,'sku':d.get('code'),'price':d.get('priceUnformatted'),'cur':'','avail':d.get('availabilityName'),'soldOut':not d.get('isNotSoldOut'),'url':u})
        except Exception as e: print('ERR split',u,e,file=sys.stderr)
    if not variants:
        for o in re.finditer(r'<span itemprop="offers".*?</span>',h,re.S):
            d=dict(re.findall(r'itemprop="(sku|price|availability|url|priceCurrency)" (?:content|href)="([^"]+)"',o.group(0)))
            if d.get('price'): variants.append({'name':'','sku':d.get('sku'),'price':float(d['price']),'cur':d.get('priceCurrency'),'avail':d.get('availability','').split('/')[-1],'soldOut':'InStock' not in d.get('availability',''),'url':d.get('url',u)})
    for p in prod:
        offs=p.get('offers');offs=offs if isinstance(offs,list) else [offs] if offs else []
        for o in offs:
            variants.append({'name':p.get('name'),'sku':p.get('sku'),'price':o.get('price'),'cur':o.get('priceCurrency'),'avail':str(o.get('availability','')).split('/')[-1],'url':o.get('url')})
    res.append({'url':u,'cat':c[0],'cats':c,'name':name,'img':img,'params':params,'short':short,'desc':desc,'variants':variants})
json.dump(res,open(f'{out}/products.json','w'),ensure_ascii=False,indent=1)
print('ok',len(res),file=sys.stderr)
