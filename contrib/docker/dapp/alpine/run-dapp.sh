#!/usr/bin/env bash

 docker run --restart always -td --network doinet \
 --name=doichain-testnet --hostname=doichain-testnet   \
-e TESTNET='true' \
-e MONGO_URL="mongodb://doichain-testnet:doichain-testnet@mongo:27017/doichain-testnet" \
-e DAPP_HOST='15.206.116.100' \
-e DAPP_PORT=3000 \
-e HTTP_PORT=3000  \
-e DAPP_DOI_URL=http://localhost:3000/api/v1/debug/mail \
-e DAPP_SSL=false \
-e DAPP_DEBUG=true   \
-e DAPP_CONFIRM='true'  \
-e DAPP_SEND='true'  \
-e DAPP_VERIFY='true'  \
-e DEFAULT_FROM='reply@your-domain.com'  \
-e DAPP_SMTP_HOST=localhost  \
-e DAPP_SMTP_USER=doichain   \
-e DAPP_SMTP_PASS='doichain-mail-pw!'  \
-e DAPP_SMTP_PORT=25  \
-e RPC_USER=admin  \
-e RPC_PASSWORD=rpc-password  \
-e RPC_HOST=localhost  \
-p 3000:3000 -p 18338:18338 -p 18339:18339 \
-v doichain-testnet-data:/home/doichain/data  \
doichain-alpine:alpine
