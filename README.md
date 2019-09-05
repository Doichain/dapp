# Doichain dApp
A reference implementation of the "Doichain Atomic Double-Opt-In Protocol"

Note: This is still experimental software. This module is not intended for use in production environments, or for use where real money is at stake, at this point.
Please contact developers over Telegram @doichain for questions.

## Table of Contents
- [Manual Installation](doc/en/install-manual-linux.md) (en) [Manual Installation](doc/de/install-manual-linux.md) (de)
- [Docker Installation](doc/en/install-docker.md)
- [REST-API](doc/en/rest-api.md)
- [Setting up a Doichain Development Environment via RegTest](doc/en/dev-env-regtest.md)
- [Setting up a Doichain Development Environment via Testnet](doc/en/dev-env-testnet.md)

- [Bounty Program](doc/en/bounty.md)
- [Settings](doc/en/settings.md)
- [UML](doc/en/uml.md)
- [Funding]
    - Buy/Sell Doicoin from https://bisq.network 
    - (mainnet/testnet) Transfer it to your new Doichain Node Address you create with ```curl --user admin:<your-password> --data-binary '{"jsonrpc": "1.0", "id":"curltest", "method": "getnewaddress", "params": [] }' -H 'content-type: text/plain;' http://localhost:(1)8339``` <--- choose correct port

