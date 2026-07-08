#!/usr/bin/env sh
set -eu

ROOT=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
HELPER="$ROOT/aiblackhole-director/scripts/local_import.py"
OPEN_FLAG="--open"

if [ "${1:-}" = "--no-open" ]; then
  OPEN_FLAG=""
  shift
fi

if command -v python3 >/dev/null 2>&1; then
  PYTHON_CMD="python3"
elif command -v python >/dev/null 2>&1; then
  PYTHON_CMD="python"
else
  echo "Python 3 is required to run AI Blackhole Director." >&2
  exit 1
fi

if [ "$#" -gt 0 ]; then
  exec "$PYTHON_CMD" "$HELPER" "$1" $OPEN_FLAG
else
  exec "$PYTHON_CMD" "$HELPER" $OPEN_FLAG
fi
