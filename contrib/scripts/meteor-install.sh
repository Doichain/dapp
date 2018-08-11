#!/bin/bash
#check if meteor is installed - if not install it - otherwise do nothing.
command -v meteor >/dev/null 2>&1 || { echo >&2 "I require meteor but it's not installed.  Installing..."; curl https://install.meteor.com | /bin/sh; }

