#!/usr/bin/env sh
cd "$(dirname "$0")"

if command -v python3 >/dev/null 2>&1; then
  python3 server/panorama_server.py
else
  python server/panorama_server.py
fi
