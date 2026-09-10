#!/usr/bin/env bash
# Research harness: execute unchanged upstream definitions, one selected package.
# Not a run of the complete osint.sh installation list.
set -euo pipefail
UPSTREAM="${1:?Provide the fixed upstream osint.sh}"
EVIDENCE="${2:?Provide evidence output directory}"
mkdir -p "$EVIDENCE"
export LOGFILE="$EVIDENCE/installer-errors.txt"
: > "$LOGFILE"
# Stop immediately before the first top-level require_root call.
# The exact prefix is retained to make the executed upstream code auditable.
awk '/^require_root$/{exit} {print}' "$UPSTREAM" > "$EVIDENCE/upstream-functions.sh"
source "$EVIDENCE/upstream-functions.sh"
require_root
detect_distro
echo 'Scope: original upstream pkg_install, ExifTool only; no full-stack install.'
echo 'Before:'
command -v exiftool || true
pkg_install libimage-exiftool-perl
echo 'Repeat installation to verify skip handling:'
pkg_install libimage-exiftool-perl
print_summary
echo 'Functional check:'
exiftool -ver
(( FAILED == 0 ))
