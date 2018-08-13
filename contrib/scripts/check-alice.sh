#!/usr/bin/env bash

MY_IP=$(sudo docker inspect alice | jq '.[0].NetworkSettings.IPAddress' | tr -d \")
echo $MY_IP
docker ps
docker exec alice sudo apt-get update
docker exec alice sudo apt install net-tools
docker exec alice sudo netstat -atn
docker exec alice doichain-cli -getinfo
docker exec alice doichain-cli getnetworkinfo

echo "checking node from inside docker cointainer"
docker exec alice curl -s --user admin:generated-password --data-binary '{"jsonrpc": "1.0", "id":"curltest", "method": "getblockchaininfo", "params": [] }' -H 'content-type: text/plain;' http://$MY_IP:18443/

echo "checking node from outside the docker cointainer (localhost)"
curl --user admin:generated-password --data-binary '{"jsonrpc": "1.0", "id":"curltest", "method": "getblockchaininfo", "params": [] }' -H 'content-type: text/plain;' http://$MY_IP:18543/