#!/usr/bin/env bash

MY_IP=$(sudo docker inspect alice | jq '.[0].NetworkSettings.IPAddress' | tr -d \")
echo $MY_IP
docker ps
docker exec alice sudo apt-get update
docker exec alice sudo apt install net-tools
docker exec alice sudo netstat -atn
docker exec alice doichain-cli -getinfo
docker exec alice doichain-cli getnetworkinfo

docker exec alice curl -s --user admin:generated-password --data-binary '{"jsonrpc": "1.0", "id":"curltest", "method": "-getinfo", "params": [] }' -H 'content-type: text/plain;' http://$MY_IP:18443/
curl -s --user admin:generated-password --data-binary '{"jsonrpc": "1.0", "id":"curltest", "method": "-getinfo", "params": [] }' -H 'content-type: text/plain;' http://$MY_IP:18445/
curl -s --user admin:generated-password --data-binary '{"jsonrpc": "1.0", "id":"curltest", "method": "-getinfo", "params": [] }' -H 'content-type: text/plain;' http://$MY_IP:18543/