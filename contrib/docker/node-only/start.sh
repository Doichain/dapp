#!/bin/bash
set -euo pipefail

scripts/doichain-start.sh &

exec /bin/bash
