"""Séria 3 – kozmetická ukážka: tools/k2/write_demo.py + doplnky série 3 (karty v chate, tri bodky, PLUS štýl).
python3 -I tools/s3/write_k2_demo.py SLUG"""
import sys, re, os, subprocess
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
slug = sys.argv[1]
subprocess.run([sys.executable, '-I', f'{ROOT}/tools/k2/write_demo.py', f'{ROOT}/tools/s3/brands/{slug}.json', f'{ROOT}/tools/s3/data/{slug}.json'], check=True)
p = f'{ROOT}/{slug}.html'; h = open(p).read()
if '/n447/s3/k2-plus.css' not in h:
    h = re.sub(r'(<link rel="stylesheet" href="/demo-motion\.css[^"]*">)', r'\1<link rel="stylesheet" href="/n447/s3/k2-plus.css">', h, count=1)
    h = h.replace('</body>', '<script src="/n447/s3/plus-chat.js" defer></script>\n</body>')
open(p, 'w').write(h)
print('s3 ok', slug, h.count('/n447/s3/'))
