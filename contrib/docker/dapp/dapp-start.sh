#!/bin/bash

export METEOR_SETTINGS=$(cat /home/doichain/data/dapp/settings.json)
export PORT=$HTTP_PORT
export ROOT_URL=http://$DAPP_HOST:$DAPP_PORT

if [[ $1 = 'build' ]]; then
	git -C /home/doichain/dapp pull origin master
	echo "starting creating bundle $DAPP_HOST:$DAPP_PORT" 
	rm -rf /home/doichain/dapp/bundle 
	cd /home/doichain/dapp/
	meteor build build/ --architecture os.linux.x86_64 --directory --server $DAPP_HOST:$DAPP_PORT
	cd /home/doichain/dapp/build/bundle/programs/server
	npm install
fi
pidfile=/home/doichain/dapp/dapp.pid
if [ -e $pidfile ]; then
	echo "pidfile existiert"
	if ps `cat /home/doichain/dapp/dapp.pid` > /dev/null
	then
		PID=`cat /home/doichain/dapp/dapp.pid`
		echo "$PID is running"
		kill -9 $PID
	fi
fi
echo "starting dapp via node bundle"
cd /home/doichain/dapp 
node build/bundle/main.js
sleep 5
