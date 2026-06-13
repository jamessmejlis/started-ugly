#!/usr/bin/env bash
# Capture a screenshot for an entry.
# Usage: ./scripts/capture.sh <url> <output-name>
# Wayback tip: insert `if_` after the timestamp to hide the archive toolbar,
#   e.g. https://web.archive.org/web/19981202230410if_/http://www.google.com/
# Year-form URLs (…/web/1998/http://google.com) redirect to the nearest capture;
# resolve the final URL first, then add if_.
set -euo pipefail
URL="$1"; NAME="$2"
mkdir -p public/screenshots
bunx playwright screenshot --viewport-size=1280,960 "$URL" "public/screenshots/${NAME}.png"
echo "Captured ${URL} -> public/screenshots/${NAME}.png"
