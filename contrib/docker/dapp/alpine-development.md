# doichain/docker:alpine
## an Alpine docker image for the Doichain environment http://www.doichain.org

This Docker Image is Based on Alpine Linux And Is Under Development 
---

## Step to compile the smaller alpine image for your Doichain Environment

1. make sure you have docker installed on your machine, [Digital Ocean Guide for Docker](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-ubuntu-18-04)
2. clone this repository and `cd contrib/docker/dapp` and you'll find `alpine.Dockerfile`
3. to build this docker image, run the following command:
    `docker build -t doichain/docker:alpine -f alpine.Dockerfile .`
4. additionally you can get this dockerfile [here](alpine.Dockerfile)
5. this will build the docker image on your local machine


## CAVEATS

1. It is necessary to provide all the required environment variables, which are expected by the entrypoint.sh file


## How To Run This Image:

1. change any required values inside the environment variables, like changing the port number for dapp, host ip address, etc
2. run this newly built docker image with:
    ```
   docker run -it --restart always --network doinet --hostname=doichain-testnet \
   -e TESTNET=true -e MONGO_URL="mongodb://doichain-testnet:doichain-testnet@mongo:27017/doichain-testnet" \
   -e DAPP_HOST='13.235.135.177' -e DAPP_PORT=3000 -e HTTP_PORT=3000  -e DAPP_DOI_URL=http://localhost:3000/api/v1/debug/mail \
   -e DAPP_SSL=false -e DAPP_DEBUG=true   -e DAPP_CONFIRM='true'  -e DAPP_SEND='true'  -e DAPP_VERIFY='true' \
   -e DEFAULT_FROM='reply@your-domain.com'  -e DAPP_SMTP_HOST=localhost  -e DAPP_SMTP_USER=doichain \
   -e DAPP_SMTP_PASS='doichain-mail-pw!'  -e DAPP_SMTP_PORT=25  -e RPC_USER=admin  -e RPC_PORT=8339 \
   -e RPC_ALLOW_IP=127.0.0.1 -e RPC_PORT_TESTNET=18339 -e RPC_PORT_REGTEST=18332 -e RPC_PASSWORD=rpc-password \
   -e RPC_HOST=localhost  -e NODE_PORT=8338 -e REGTEST=false -e TESTNET=true -e NODE_PORT_TESTNET=18338 \
   -e NODE_PORT_REGTEST=18445 -e CONFIRM_ADDRESS='' -e CONNECTION_NODE='5.9.154.226' \
   -p 3000:3000 -p 18338:18338 -p 18339:18339 \
   -v doichain-testnet-data:/home/doichain/data \
   doichain/docker:alpine
   ```

