#!/bin/bash
set -euo pipefail

_RPC_PORT=${RPC_PORT}
_NODE_PORT=${NODE_PORT}
_REGTEST=0
_TESTNET=0
if [ $REGTEST = true ]; then
	_REGTEST=1
	_RPC_PORT=$RPC_PORT_REGTEST
  	_NODE_PORT=$NODE_PORT_REGTEST
fi

if [ $TESTNET = true ]; then
	_TESTNET=1
	_RPC_PORT=$RPC_PORT_TESTNET
  	_NODE_PORT=$NODE_PORT_TESTNET
fi

if [ -z ${RPC_USER} ]; then
	RPC_USER='admin'
	echo "RPC_USER was not set, using "$RPC_USER
fi

if [ -z ${RPC_PASSWORD} ]; then
	#echo "generating password"
	RPC_PASSWORD=$(xxd -l 30 -p /dev/urandom)
	echo "RPC_PASSWORD was not set, generated: "$RPC_PASSWORD
fi

DOICHAIN_CONF_FILE=/home/doichain/data/doichain/doichain.conf
if [ ! -f "$DOICHAIN_CONF_FILE" ]; then
echo "DOICHAIN_CONF_FILE not found - generating new!"
echo "
regtest=$_REGTEST
testnet=$_TESTNET
daemon=1
server=1
rpcuser=${RPC_USER}
rpcpassword=${RPC_PASSWORD}
rpcallowip=${RPC_ALLOW_IP}
#txindex=1
#namehistory=1
blocknotify=curl -X GET http://localhost:${HTTP_PORT}/api/v1/blocknotify?block=%s
walletnotify=curl -X GET http://localhost:${HTTP_PORT}/api/v1/walletnotify?tx=%s

[test]
rpcport=${_RPC_PORT}
rpcbind=127.0.0.1
rpcallowip=127.0.0.1
port=${_NODE_PORT}

[regtest]
rpcport=${_RPC_PORT}
rpcbind=127.0.0.1
rpcallowip=127.0.0.1
port=${_NODE_PORT}" > $DOICHAIN_CONF_FILE
fi

cd /home/doichain/data/
cd dapp

DAPP_SETTINGS_FILE=/home/doichain/data/dapp/settings.json
if [ ! -f "$DAPP_SETTINGS_FILE" ]; then

	if [ $DAPP_SEND = false ] && [ $DAPP_CONFIRM = false ] && [ $DAPP_VERIFY = false ]; then
		echo "No dApp type is enabled. Please use at least one dApp type or use node-only container instead! (ENV DAPP_SEND, DAPP_CONFIRM, DAPP_VERIFY)"
		exit 1
	fi
	if [ -z "$DAPP_HOST" ]; then
		echo "No host settings found! (ENV DAPP_HOST)"
		exit 1
	fi
	DAPP_SETTINGS='{
	  "app": {
			"debug": "'$DAPP_DEBUG'",
			"host": "'$DAPP_HOST'",
			"port": "'$DAPP_PORT'",
			"ssl": '$DAPP_SSL',
	    "types": ['
	if [ $DAPP_SEND = true ]; then
	  DAPP_SETTINGS=$DAPP_SETTINGS'"send"'
	  if [ $DAPP_CONFIRM = true ] || [ $DAPP_VERIFY = true ]; then
			DAPP_SETTINGS=$DAPP_SETTINGS','
	  fi
	fi
	if [ $DAPP_CONFIRM = true ]; then
	  DAPP_SETTINGS=$DAPP_SETTINGS'"confirm"'
	  if [ $DAPP_VERIFY = true ]; then
			DAPP_SETTINGS=$DAPP_SETTINGS','
	  fi
	fi
	if [ $DAPP_VERIFY = true ]; then
	  DAPP_SETTINGS=$DAPP_SETTINGS'"verify"'
	fi
	DAPP_SETTINGS=$DAPP_SETTINGS']
	  },'


	if [ $DAPP_SEND = true ]; then
	  DAPP_SETTINGS=$DAPP_SETTINGS'"send": {
			"doiMailFetchUrl": "'$DAPP_DOI_URL'",
			"doichain": {
		    "host":"'$RPC_HOST'",
		    "port": "'$_RPC_PORT'",
		    "username": "'$RPC_USER'",
		    "password": "'$RPC_PASSWORD'"
		  }
	  }'
	  if [ $DAPP_CONFIRM = true ] || [ $DAPP_VERIFY = true ]; then
			DAPP_SETTINGS=$DAPP_SETTINGS','
	  fi
	fi
	if [ $DAPP_CONFIRM = true ]; then
		if [ -z "$DAPP_SMTP_USER" ] || [ -z "$DAPP_SMTP_HOST" ] || [ -z "$DAPP_SMTP_PORT" ]; then
			echo "Confirmation dApp active but smtp settings not found! (ENV DAPP_SMTP_USER, DAPP_SMTP_PASS, DAPP_SMTP_HOST, DAPP_SMTP_PORT)"
			exit 1
		fi
	  DAPP_SETTINGS=$DAPP_SETTINGS'"confirm": {
			"doichain": {
		      "host":"'$RPC_HOST'",
			  "port": "'$_RPC_PORT'",
			  "username": "'$RPC_USER'",
			  "password": "'$RPC_PASSWORD'",
			  "address": "'$CONFIRM_ADDRESS'"
			},
			"smtp": {
		      "username": "'$DAPP_SMTP_USER'",
		      "password": "'$DAPP_SMTP_PASS'",
		      "server":   "'$DAPP_SMTP_HOST'",
		      "smtps":false,
		      "port": "'$DAPP_SMTP_PORT'",
		      "NODE_TLS_REJECT_UNAUTHORIZED":"0",
		      "defaultFrom": "doichain@example-domain.org"
	    }
	  }'
	  if [ $DAPP_VERIFY = true ]; then
			DAPP_SETTINGS=$DAPP_SETTINGS','
	  fi
	fi
	if [ $DAPP_VERIFY = true ]; then
	  DAPP_SETTINGS=$DAPP_SETTINGS'"verify": {
			"doichain": {
		    "host":"'$RPC_HOST'",
		    "port": "'$_RPC_PORT'",
		    "username": "'$RPC_USER'",
		    "password": "'$RPC_PASSWORD'"
		  }
	  }'
	fi
	DAPP_SETTINGS=$DAPP_SETTINGS'}'
	echo $DAPP_SETTINGS > $DAPP_SETTINGS_FILE
fi

exec "$@"
