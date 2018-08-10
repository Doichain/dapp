#!/usr/bin/env bash

sudo docker inspect alice | jq '.[0].NetworkSettings.IPAddress'