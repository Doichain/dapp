#!/usr/bin/env bash

echo (sudo docker inspect alice | jq '.[0].NetworkSettings.IPAddress')