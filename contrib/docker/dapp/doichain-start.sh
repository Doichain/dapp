_REGTEST=''
if [ $REGTEST = true ]; then
	_REGTEST='-regtest -addnode='$CONNECTION_NODE
fi

_TESTNET=''
if [ $TESTNET = true ]; then
	_TESTNET='-testnet -addnode='$CONNECTION_NODE
fi

doichaind $_REGTEST $_TESTNET

