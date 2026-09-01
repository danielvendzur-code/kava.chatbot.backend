import { mkdirSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const cli = fileURLToPath(new URL('../node_modules/@playwright/test/cli.js', import.meta.url));
mkdirSync('artifacts', { recursive: true });

const result = spawnSync(process.execPath, [
  cli,
  'test',
  'tests/full-coffee-release-audit.spec.mjs',
  '--reporter=json',
  '--workers=1'
], { encoding: 'utf8' });

writeFileSync('artifacts/playwright-report.json', result.stdout || '{}');
writeFileSync('artifacts/playwright-stderr.log', result.stderr || '');

if (result.stdout) process.stdout.write(result.stdout);
if (result.stderr) process.stderr.write(result.stderr);
process.exit(result.status ?? 1);
