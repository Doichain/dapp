#!/usr/bin/env bash

#echo (sudo docker inspect alice | jq '.[0].NetworkSettings.IPAddress')
curl --user admin:generated-password --data-binary '{"jsonrpc": "1.0", "id":"curltest", "method": "-getinfo", "params": [] }' -H 'content-type: text/plain;' http://127.0.0.1:18443/