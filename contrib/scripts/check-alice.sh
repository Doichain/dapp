#!/usr/bin/env bash

MY_IP=$(sudo docker inspect alice | jq '.[0].NetworkSettings.IPAddress' | tr -d \")
echo $MY_IP
docker ps
docker exec alice netstat -atn
docker exec alice doichain-cli -getinfo
docker exec alice doichain-cli getnetworkinfo

#curl --user admin:generated-password --data-binary '{"jsonrpc": "1.0", "id":"curltest", "method": "-getinfo", "params": [] }' -H 'content-type: text/plain;' http://$MY_IP:18443/
#curl --user admin:generated-password --data-binary '{"jsonrpc": "1.0", "id":"curltest", "method": "-getinfo", "params": [] }' -H 'content-type: text/plain;' http://$MY_IP:18543/