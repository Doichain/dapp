# doichain/node-only docker image 
### a Doichain node (without integrated Doichain dApp)

### Installation (you can skip step 1 and 2 if you want to use the image from docker hub!)
1. clone this repository ```git clone https://github.com/Doichain/docker.git doichain-docker```
2. build docker image 
```shell
cd doichain-docker/node-only
docker build --no-cache -t dc0.20.1.5 --build-arg DOICHAIN_VER=doichain/node-only .
```
3. Run docker image (see Makefile)
```shell
make
```
 
   
```shell
#mainnet example
docker run -it -e RPC_PASSWORD=<my-rpc-password> --name doichain-testnet doichain/node-only

#testnet example
docker run -it -e TESTNET=true -p DAPP_URL=http://localhost:4010 -p 18339:18339 -e RPC_PASSWORD=<my-rpc-password> --name doichain-testnet doichain/node-only
```
4. Connect into docker container and check if node connects to testnet
```shell
docker exec -it doichain-testnet doichain-cli -getinfo
```
5. Please ALWAYS backup your privatKeys! via 
```shell
docker exec -it doichain-testnet doichain-cli getnewaddress
docker exec -it doichain-testnet doichain-cli dumpprivkey <address>
```
