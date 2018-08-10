#!/usr/bin/env bash

ALICE_IP=$(sudo docker inspect alice | jq '.[0].NetworkSettings.IPAddress' | tr -d \")
#BOB_IP=$(sudo docker inspect bob | jq '.[0].NetworkSettings.IPAddress' | tr -d \")
echo $ALICE_IP
docker exec bob curl -s --user admin:generated-password --data-binary '{"jsonrpc": "1.0", "id":"curltest", "method": "addnode", "params": ["$ALICE_IP","onetry"] }' -H 'content-type: text/plain;' http://localhost:18443/
