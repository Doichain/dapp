#!/usr/bin/env bash
docker inspect alice | jq '.[0].NetworkSettings.IPAddress'