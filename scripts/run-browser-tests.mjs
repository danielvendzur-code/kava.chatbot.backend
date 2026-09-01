import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const cli = fileURLToPath(new URL('../node_modules/@playwright/test/cli.js', import.meta.url));
const result = spawnSync(process.execPath, [
  cli,
  'test',
  'tests/full-coffee-release-audit.spec.mjs',
  '--reporter=line',
  '--workers=1'
], { stdio: 'inherit' });

process.exit(result.status ?? 1);
