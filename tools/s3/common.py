"""Séria 3 – spoločné pomôcky (bez siete okrem sťahovania fotiek z oficiálneho e-shopu)."""
import json, os, re, html, subprocess, hashlib
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
UA = 'Mozilla/5.0 (X11; Linux x86_64) Chrome/130'
txt = lambda h: re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', ' ', h or ''))).strip()

def sentences(t, n=2, limit=320):
    parts = re.split(r'(?<=[.!?])\s+', t.strip())
    out = ''
    for s in parts[:n]:
        if len(out) + len(s) > limit and out: break
        out = (out + ' ' + s).strip()
    return out

def photo(slug, url, name=None, width=900):
    """Stiahne oficiálnu fotku produktu a uloží zmenšenú JPG do assets/s3/<slug>/; vráti webovú cestu alebo None."""
    if not url: return None
    d = f'{ROOT}/assets/s3/{slug}'; os.makedirs(d, exist_ok=True)
    base = name or hashlib.sha1(url.encode()).hexdigest()[:12]
    out = f'{d}/{base}.jpg'
    if not os.path.exists(out):
        tmp = out + '.src'
        subprocess.run(['curl', '-sL', '-A', UA, '--max-time', '60', '-o', tmp, url])
        if not os.path.exists(tmp) or os.path.getsize(tmp) < 2000: return None
        r = subprocess.run(['convert', tmp + '[0]', '-background', 'white', '-alpha', 'remove', '-alpha', 'off', '-resize', f'{width}x{width}>', '-strip', '-quality', '82', out])
        os.remove(tmp)
        if r.returncode or not os.path.exists(out): return None
    return f'/assets/s3/{slug}/{base}.jpg'

def write_coffee(slug, data, comment):
    path = f'{ROOT}/n447/c2/data/{slug}.js'
    open(path, 'w').write(f"""/* {comment} */
(function (g) {{
  'use strict';
  const DATA = {json.dumps(data, ensure_ascii=False, indent=1)};
  (g.N447_DATA = g.N447_DATA || {{}}).{slug} = DATA;
  if (typeof module !== 'undefined' && module.exports) module.exports = DATA;
}})(typeof globalThis !== 'undefined' ? globalThis : window);
""")
    return path

REGION = {'etiopie': 'africa', 'etiópia': 'africa', 'keňa': 'africa', 'keňa': 'africa', 'uganda': 'africa', 'burundi': 'africa', 'rwanda': 'africa', 'tanzanie': 'africa', 'tanzánia': 'africa',
          'kolumbie': 'americas', 'kolumbia': 'americas', 'brazílie': 'americas', 'brazília': 'americas', 'guatemala': 'americas', 'peru': 'americas', 'kostarika': 'americas',
          'honduras': 'americas', 'salvador': 'americas', 'el salvador': 'americas', 'nikaragua': 'americas', 'mexiko': 'americas', 'mexico': 'americas', 'bolívie': 'americas', 'ekvádor': 'americas', 'panama': 'americas',
          'indie': 'asia', 'india': 'asia', 'indonésie': 'asia', 'indonézia': 'asia', 'jemen': 'asia', 'vietnam': 'asia', 'čína': 'asia', 'papua': 'asia'}

def region_of(countries):
    rs = {REGION.get(c.strip().lower()) for c in countries if c.strip()}
    rs.discard(None)
    return 'blend' if len(countries) > 1 else (rs.pop() if len(rs) == 1 else None)

def process_label(x):
    """Do textu doplní anglický kľúč (washed/natural/honey), podľa ktorého jadro c2 delí kávy podľa spracovania."""
    s = (x or '').strip(); l = s.lower()
    if not s: return None
    if re.search(r'honey', l): return s if 'honey' in l else s + ' (honey)'
    nat = bool(re.search(r'natur|anaerob|carbonic|macer|fermen', l)); was = bool(re.search(r'promyt|praná|prané|washed|mytá', l))
    if nat and was: return s + ' (natural / washed)'
    if nat: return s if 'natural' in l else s + ' (natural)'
    if was: return s if 'washed' in l else s + ' (washed)'
    return s
