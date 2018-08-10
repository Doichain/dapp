#!/usr/bin/env bash

ALICE_IP=$(sudo docker inspect alice | jq '.[0].NetworkSettings.IPAddress' | tr -d \")
echo $ALICE_IP
docker exec bob doichain-cli addnode $ALICE_IP "onetry"
