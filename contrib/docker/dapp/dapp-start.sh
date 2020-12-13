#!/bin/bash

export METEOR_SETTINGS=$(cat /home/doichain/data/dapp/settings.json)
export PORT=$HTTP_PORT
export ROOT_URL=http://$DAPP_HOST:$DAPP_PORT

_BUILD=$1
if [ $_BUILD = 'build' ]; then
	git -C /home/doichain/dapp pull origin 0.0.9
	echo "starting creating bundle $DAPP_HOST:$DAPP_PORT" 
	rm -rf /home/doichain/dapp/bundle 
	cd /home/doichain/dapp/
	meteor build build/ --architecture os.linux.x86_64 --directory --server $DAPP_HOST:$DAPP_PORT
	cd /home/doichain/dapp/build/bundle/programs/server
	npm install
fi
#PID=`cat /home/doichain/dapp/dapp.pid`
pidfile=/home/doichain/dapp/dapp.pid
if [ -e $pidfile ]; then
    if ps `cat /home/doichain/dapp/dapp.pid` > /dev/null
    then
        echo "$PID is running"
        kill -9 $PID
    fi
fi

echo "starting dapp via node bundle"
cd /home/doichain/dapp
nohup node build/bundle/main.js > dapp.log  2>&1 & echo $! > dapp.pid
