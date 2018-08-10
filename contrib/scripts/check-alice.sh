#!/usr/bin/env bash

#echo (sudo docker inspect alice | jq '.[0].NetworkSettings.IPAddress')
docker ps
sleep 10
#curl --user admin:generated-password --data-binary '{"jsonrpc": "1.0", "id":"curltest", "method": "-getinfo", "params": [] }' -H 'content-type: text/plain;' http://localhost:18443/
curl --user admin:generated-password --data-binary '{"jsonrpc": "1.0", "id":"curltest", "method": "-getinfo", "params": [] }' -H 'content-type: text/plain;' http://localhost:18543/