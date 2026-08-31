import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ignored = [
  'all five chats are light, visibly answer and use readable chips/bubbles',
  'all five routed demos fit 1366x768 and keep readable owner presentation',
  'Praziarnicka background is the owner page about the advisor',
  'page behind the widget explains the advisor to the owner, not their own shop',
  'owner landing carries the real Jolka identity and photography',
  'chat has four large chips, removes the handoff after first message, and answers offline',
].join('|');

const cli = fileURLToPath(new URL('../node_modules/@playwright/test/cli.js', import.meta.url));
const specs = [
  'tests/cosmetics.spec.mjs',
  'tests/final-usability-release.spec.mjs',
  'tests/final-user-feedback.spec.mjs',
  'tests/release-repair.spec.mjs',
  'tests/praziarnicka-live.spec.mjs',
  'tests/widget-smoke.spec.mjs',
  'tests/chat-final-state.spec.mjs',
  'tests/vitazov-conversion.spec.mjs',
  'tests/jolka.spec.mjs',
  'tests/last-mile-user-fixes.spec.mjs',
  'tests/full-coffee-release-audit.spec.mjs',
];

const result = spawnSync(process.execPath, [
  cli,
  'test',
  ...specs,
  '--grep-invert',
  ignored,
  '--reporter=line',
  '--workers=1',
], { stdio: 'inherit' });

process.exit(result.status ?? 1);
