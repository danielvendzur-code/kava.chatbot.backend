#!/usr/bin/env bash
# Collect the files the demo pages serve into dist/ for upload to Websupport.
# Development files (tests, scripts, docs, the Vercel API) are left out.
set -euo pipefail
cd "$(dirname "$0")/.."

rm -rf dist
mkdir dist
# Only tracked files, so local scratch output never reaches the server.
git ls-files -z \
  | grep -zvE '^(\.github/|tests/|scripts/|deploy/|api/|artifacts/)|\.md$|^(package(-lock)?\.json|vercel\.json|\.gitignore|\.nojekyll)$' \
  | xargs -0 cp --parents -t dist
cp deploy/websupport.htaccess dist/.htaccess

# Every page the index links to must be in the upload.
for page in index.html ukazky.html cosmetics.html verzia.txt; do
  test -f "dist/$page" || { echo "missing dist/$page" >&2; exit 1; }
done
echo "dist/: $(find dist -type f | wc -l) files, $(du -sh dist | cut -f1)"
