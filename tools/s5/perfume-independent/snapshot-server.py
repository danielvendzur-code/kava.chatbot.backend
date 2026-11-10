"""Local read-only static server for one immutable Git commit. API always mocked 503."""
import argparse,functools,http.server,mimetypes,pathlib,subprocess,urllib.parse,re,json
p=argparse.ArgumentParser();p.add_argument('--repo',required=True);p.add_argument('--commit',required=True);p.add_argument('--port',type=int,default=8911);p.add_argument('--fixture-scentisimo',action='store_true');p.add_argument('--fixture-niche-avatar',action='store_true');a=p.parse_args();assert re.fullmatch('[a-f0-9]{40}',a.commit)
@functools.lru_cache(maxsize=256)
def blob(path):return subprocess.check_output(['git','-C',a.repo,'show',a.commit+':'+path],stderr=subprocess.DEVNULL)
def fixture(path):
 if a.fixture_niche_avatar:
  if path=='__perfume_fixture/niche-avatar.html':return blob('s5.html').decode().replace('<script src="/n447/s5/boot.js">','<script src="/__perfume_fixture/niche-avatar-register.js"></script><script src="/n447/s5/boot.js">').encode()
  if path=='__perfume_fixture/niche-avatar-register.js':return b'window.S3_REG.demos.nicheandglow.brand.mark="/assets/s5/nicheandglow/mark.png";window.S3_REG.demos.nicheandglow.logos.avatar="/assets/s5/nicheandglow/mark.png";'
  if path=='assets/s5/nicheandglow/mark.png':return (pathlib.Path(a.repo)/path).read_bytes()
 if not a.fixture_scentisimo:return None
 if path=='__perfume_fixture/scentisimo.html':
  original=blob('s5.html').decode();original=original.replace('<script src="/n447/s5/boot.js">','<script src="/__perfume_fixture/scentisimo-register.js"></script><script src="/n447/s5/boot.js">');original=original.replace('</head>','<link rel="stylesheet" href="/n447/s5/perfume-fragments/scentisimo.ui-review.css"></head>');return original.encode()
 if path=='__perfume_fixture/scentisimo-register.js':
  data=json.loads((pathlib.Path(a.repo)/'n447/s5/perfume-fragments/scentisimo.integration-review.json').read_text());return ('window.S3_REG.demos.scentisimo='+json.dumps(data['registryObject'],ensure_ascii=False)+';').encode()
 if path=='catalogues/scentisimo.js' or path=='n447/s5/perfume-fragments/scentisimo.ui-review.css' or path.startswith('assets/s5/scentisimo/'):
  file=pathlib.Path(a.repo)/path
  return file.read_bytes() if file.is_file() else None
 return None
class Handler(http.server.BaseHTTPRequestHandler):
 def do_HEAD(self):self.respond(False)
 def do_GET(self):self.respond(True)
 def respond(self,body):
  route=urllib.parse.unquote(urllib.parse.urlsplit(self.path).path).lstrip('/') or 's5.html'
  if route.startswith('api/'):
   payload=b'{"error":"offline_snapshot_mock"}';self.send_response(503);self.send_header('Content-Type','application/json')
  elif any(part.startswith('.') for part in pathlib.PurePosixPath(route).parts) or pathlib.PurePosixPath(route).suffix.lower() not in {'.html','.js','.css','.json','.jpg','.jpeg','.png','.webp','.svg','.woff','.woff2','.ico','.ttf'}:
   payload=b'Not found';self.send_response(404);self.send_header('Content-Type','text/plain')
  else:
   try:payload=fixture(route);payload=blob(route) if payload is None else payload
   except subprocess.CalledProcessError:payload=None
   if payload is None:payload=b'Not found';self.send_response(404);self.send_header('Content-Type','text/plain')
   else:self.send_response(200);self.send_header('Content-Type',mimetypes.guess_type(route)[0] or 'application/octet-stream')
  self.send_header('Cache-Control','no-store');self.send_header('Content-Length',str(len(payload)));self.end_headers()
  if body:self.wfile.write(payload)
 def log_message(self,fmt,*args):
  if args and str(args[1]) not in ['200','304']:print(fmt%args,flush=True)
print('Serving local fixture on coordinator snapshot' if a.fixture_scentisimo or a.fixture_niche_avatar else 'Serving immutable local snapshot',a.commit,'on 127.0.0.1:'+str(a.port),flush=True)
http.server.ThreadingHTTPServer(('127.0.0.1',a.port),Handler).serve_forever()
