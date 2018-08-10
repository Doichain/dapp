#!/usr/bin/env bash

MY_IP=$(sudo docker inspect alice | jq '.[0].NetworkSettings.IPAddress')
echo  ${$MY_IP//'"'}
MY_IP=${$MY_IP//'"'}
docker ps
ping $MY_IP
sleep 10
#curl --user admin:generated-password --data-binary '{"jsonrpc": "1.0", "id":"curltest", "method": "-getinfo", "params": [] }' -H 'content-type: text/plain;' http://$MY_IP:18443/
curl --user admin:generated-password --data-binary '{"jsonrpc": "1.0", "id":"curltest", "method": "-getinfo", "params": [] }' -H 'content-type: text/plain;' http://$MY_IP:18543/