#!/bin/bash
set -euo pipefail

/home/doichain/scripts/dapp-start.sh &
/home/doichain/scripts/doichain-start.sh &

exec /bin/bash