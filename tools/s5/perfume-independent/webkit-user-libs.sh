#!/bin/sh
# Official Playwright WPE runtime plus ordinary user-owned Debian dependencies.
# Does not disable sandboxing or HTTPS validation and does not alter trust stores.
set -eu
: "${PERFUME_WEBKIT_DIR:?Set to the official Playwright minibrowser-wpe directory}"
: "${PERFUME_WEBKIT_DEPS:?Set to the task-local dpkg-deb extraction root}"
export WEBKIT_EXEC_PATH="$PERFUME_WEBKIT_DIR/bin"
export WEBKIT_INJECTED_BUNDLE_PATH="$PERFUME_WEBKIT_DIR/lib"
export WEBKIT_INSPECTOR_RESOURCES_PATH="$PERFUME_WEBKIT_DIR/share"
export LD_LIBRARY_PATH="$PERFUME_WEBKIT_DIR/lib:$PERFUME_WEBKIT_DIR/sys/lib:$PERFUME_WEBKIT_DEPS/usr/lib/x86_64-linux-gnu${LD_LIBRARY_PATH:+:$LD_LIBRARY_PATH}"
exec "$PERFUME_WEBKIT_DIR/bin/MiniBrowser" "$@"
