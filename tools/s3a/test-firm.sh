#!/bin/bash
# Séria 3: všetky kontroly jednej alebo viacerých firiem (lokálny server BASE, /api blokované alebo mock – 0 platených volaní).
# tools/s3a/test-firm.sh BASE SLUG…   → výstup aj do n447/s3/dokazy-s3a/<slug>-testy.txt
BASE=$1; shift
PORT=${BASE##*:}
LOG=/tmp/s3a-serve-$PORT.log
OUTD=${DOKAZY:-n447/s3/dokazy-s3a}; mkdir -p $OUTD
ensure() { curl -s -m 5 -o /dev/null "$BASE/index.html" || { node tools/s3a/serve.mjs "$PWD" $PORT >>$LOG 2>&1 & sleep 1; }; }
for s in "$@"; do
  ensure
  t=$(python3 -c "import json;print(json.load(open('tools/s3a/registry.json'))['demos']['$s']['type'])")
  out=$OUTD/$s-testy.txt
  { if [ "$t" = coffee ]; then node tools/s3a/dfs-coffee.mjs $BASE $s 320x568,390x800,1280x800 --shots $OUTD | head -12; ensure; node tools/s3a/dfs-coffee.mjs $BASE $s 390x800 --noimg | head -6;
    else ensure; node tools/s3a/dfs-native.mjs $BASE $s 320x568,390x800,1280x800 | head -12; node tools/s3a/dfs-native.mjs $BASE $s 390x800 --noimg | head -6; fi
    ensure; node tools/s3a/chips-avatar.mjs $BASE $s --shots $OUTD; node tools/s3a/chat-mock.mjs $BASE $s;
    ensure; node tools/s3a/a11y-names.mjs $BASE $s; [ "$t" = coffee ] && node tools/s3a/same-meaning.cjs $s; } 2>&1 | tee $out
done
