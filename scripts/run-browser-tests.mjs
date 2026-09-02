import { createServer } from 'node:http';
import { mkdirSync, writeFileSync } from 'node:fs';
import { readFile, stat } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { extname, join, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = resolve(fileURLToPath(new URL('../', import.meta.url)));
const cli = fileURLToPath(new URL('../node_modules/@playwright/test/cli.js', import.meta.url));
const host = '127.0.0.1';
const port = 4173;
const baseURL = `http://${host}:${port}`;

const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.gif': 'image/gif',
  '.html': 'text/html; charset=utf-8',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml; charset=utf-8',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2'
};

const server = createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url || '/', baseURL).pathname);
    const relativePath = pathname.replace(/^\/+/, '') || 'index.html';
    let target = resolve(rootDir, relativePath);

    if (target !== rootDir && !target.startsWith(`${rootDir}${sep}`)) {
      response.writeHead(403).end('Forbidden');
      return;
    }

    if ((await stat(target)).isDirectory()) target = join(target, 'index.html');
    const body = await readFile(target);
    response.writeHead(200, { 'content-type': contentTypes[extname(target).toLowerCase()] || 'application/octet-stream' });
    response.end(body);
  } catch {
    response.writeHead(404).end('Not found');
  }
});

await new Promise((accept, reject) => {
  server.once('error', reject);
  server.listen(port, host, accept);
});

mkdirSync(join(rootDir, 'artifacts'), { recursive: true });

const forwardedArgs = process.argv.slice(2);
const hasExplicitTestFile = forwardedArgs.some((argument) => /(?:^|[\\/])tests[\\/].*\.(?:spec|test)\.m?js$/i.test(argument));
const child = spawn(process.execPath, [
  cli,
  'test',
  ...(!hasExplicitTestFile ? ['tests/full-coffee-release-audit.spec.mjs'] : []),
  '--reporter=json',
  '--workers=1',
  ...forwardedArgs
], {
  cwd: rootDir,
  env: { ...process.env, BASE_URL: baseURL },
  stdio: ['ignore', 'pipe', 'pipe']
});

let stdout = '';
let stderr = '';
child.stdout.on('data', (chunk) => { stdout += chunk; });
child.stderr.on('data', (chunk) => { stderr += chunk; });

const status = await new Promise((accept) => {
  child.once('close', (code) => accept(code ?? 1));
});

await new Promise((accept) => server.close(accept));

writeFileSync(join(rootDir, 'artifacts/playwright-report.json'), stdout || '{}');
writeFileSync(join(rootDir, 'artifacts/playwright-stderr.log'), stderr);

if (stdout) process.stdout.write(stdout);
if (stderr) process.stderr.write(stderr);
process.exitCode = status;
