#!/bin/sh
set -eu

OUTPUT="${1:-assets/demo.cast}"
HERE="$(dirname "$0")"

asciinema rec --overwrite --cols 100 --rows 32 --idle-time-limit 2 --command "python3 $HERE/type.py" "$OUTPUT"
