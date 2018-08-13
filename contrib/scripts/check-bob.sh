#!/usr/bin/env bash

MY_IP=$(sudo docker inspect bob | jq '.[0].NetworkSettings.IPAddress' | tr -d \")
echo $MY_IP
docker ps
docker exec bob sudo apt-get update
docker exec bob sudo apt install net-tools
docker exec bob sudo netstat -atn
docker exec bob sudo doichain-cli -getinfo
docker exec bob doichain-cli -regtest getnetworkinfo

echo "checking bob's node from inside docker cointainer"
docker exec bob curl -s --user admin:generated-password --data-binary '{"jsonrpc": "1.0", "id":"bob-getblockchaininfo-internal", "method": "getblockchaininfo", "params": [] }' -H 'content-type: text/plain;' http://$MY_IP:18443/

echo "checking bob's node from outside the docker cointainer (localhost)"
curl --user admin:generated-password --data-binary '{"jsonrpc": "1.0", "id":"bob-getblockchaininfo-external", "method": "getblockchaininfo", "params": [] }' -H 'content-type: text/plain;' http://localhost:18544/