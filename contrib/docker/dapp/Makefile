IMG=doichain/dapp-testnet:v0.0.9.75
DOICHAIN_VER=0.16.3.2
DOICHAIN_DAPP_VER=v0.0.9.75


DNS1=91.217.137.37
DNS2=172.104.136.243
#DAPP_HOST is used for settings.json to tell confirm dapp under which url to request the DOI template
#DAPP_HOST is also used
DAPP_HOST=5.9.154.226
DAPP_PORT=4010
#internal http-port inside docker
HTTP_PORT=3010
DAPP_SSL=true
MONGO_URL=mongodb://doichain-testnet:doichain-testnet@mongo:27017/doichain-testnet

#in case you want to play with alice and bob - change those parameters!
HTTP_PORT_ALICE=84
HTTP_PORT_BOB=85

RPC_PORT_ALICE=18339
RPC_PORT_BOB=28339

PORT_ALICE=18338
PORT_BOB=28338


RPC_USER=admin
RPC_PASSWORD=

THIS_FILE := $(lastword $(MAKEFILE_LIST))

DOCKER_RUN=docker run -td --restart always --network doinet --dns=${DNS1} --dns=${DNS2}
DOCKER_RUN_DEFAULT_ENV=-e DAPP_DEBUG=true -e MONGO_URL=$(MONGO_URL)
DOCKER_RUN_OTHER_ENV=-e DAPP_CONFIRM='true' -e DAPP_VERIFY='true' -e DAPP_SEND='true' -e RPC_USER=$(RPC_USER) -e RPC_PASSWORD=$(RPC_PASSWORD) -e RPC_HOST=localhost -e DAPP_SSL=false -e DAPP_HOST=$(DAPP_HOST) -e HTTP_PORT=$(HTTP_PORT) -e DAPP_PORT=$(DAPP_PORT)  -e DAPP_SMTP_HOST=localhost -e DAPP_SMTP_USER=doichain -e DAPP_SMTP_PASS='doichain-mail-pw!' -e DAPP_SMTP_PORT=25 -e DEFAULT_FROM='reply@your-domain.com'
DOCKER_MAINNET=$(DOCKER_RUN) $(DOCKER_RUN_DEFAULT_ENV) $(DOCKER_RUN_OTHER_ENV) -p $(DAPP_PORT):$(HTTP_PORT) -p $(PORT):8338 -p $(RPC_PORT):8339 -v doichain_$@:/home/doichain/data --name=doichain_$@ --hostname=doichain_$@
DOCKER_TESTNET=$(DOCKER_RUN) $(DOCKER_RUN_DEFAULT_ENV) $(DOCKER_RUN_OTHER_ENV) -e TESTNET=true -e RPC_ALLOW_IP=::/0 -p $(DAPP_PORT):$(HTTP_PORT) -p $(PORT):18338 -p $(RPC_PORT):18339 -v doichain_$@:/home/doichain/data --name=$@ --hostname=$@
DOCKER_REGTEST=$(DOCKER_RUN) $(DOCKER_RUN_DEFAULT_ENV) $(DOCKER_RUN_OTHER_ENV) -e REGTEST=true -e RPC_ALLOW_IP=::/0 -p $(DAPP_PORT):$(HTTP_PORT) -p $(PORT):18445 -p $(RPC_PORT):18332 -v doichain_$@:/home/doichain/data --name=$@ --hostname=$@

private RUNNING_TARGET:=$(shell docker ps -aq -f name=$@)

RUN_SHELL=bash

default: help

check:
	which jq; which bc

help:
	$(info Usage: make <mainnet|testnet|regtest-alice|regtest-bob|regtest-*> HTTP_PORT=<http-port>)
	$(info 		  make clean - removes $(IMG) image and containers)
	$(info 		  make builds the images according to the given doichain core and dapp versions)
	$(info 		  make mainnet-<your-name-or-id> creates a doichain mainet node and dapp with docker name <your-name-or-id>)
	$(info 		  make testnet-<your-name-or-id> creates a doichain mainet node and dapp with docker name <your-name-or-id>)
	$(info        make test_regtest - creates a regtest network, connects alice and bob, generates 110 blocks, sends 10 to bob)
	$(info        make test_testnet - creates a testnet network, connects alice and bob, disables initial-blockdownload, block-validation and gets ready for mining. after receiving enough blocks, it normalises difficulty and enables block validation and verification)
	$(info        make test_rm - deletes regtest containers - but leaves volumes untouched)
	$(info        make all - compile and test )
	$(info 		  generate-110 - generate 110 blocks in regtest network)
	$(info 		  send-10-to-bob - send 10 doi to bob)
	$(info 		  name_doi - test name_doi)

setports:
	HTTPPORT_EXISTS=$(shell lsof -i TCP:$(HTTP_PORT) | grep LISTEN) #cannot recognise my webserver for some reason
	RPCPORT_EXISTS=$(shell lsof -i TCP:$(RPC_PORT) | grep LISTEN) #cannot recognise my webserver for some reason
	P2PPORT_EXISTS=$(shell lsof -i TCP:$(PORT) | grep LISTEN) #cannot recognise my webserver for some reason


http_port: setports
	$(info checking port $(HTTP_PORT) -$(filter-out \ , $(strip ${HTTPPORT_EXISTS}))-)
ifeq ($(filter-out \ , $(strip ${HTTPPORT_EXISTS})), )
	$(info http port $(HTTP_PORT) seems free - truying to use it...)
else
	$(info http port $(HTTP_PORT) seems already in use - e.g. use HTTP_PORT=<http-port> !)
	exit 1 ;
endif

rpc_port:
	$(info checking rpc-port $(RPC_PORT) -$(filter-out \ , $(strip ${RPCPORT_EXISTS}))-)
ifneq ($(filter-out \ , $(strip ${RPCPORT_EXISTS})), )
		$(info rpc port seems already in use!  ${RPC_PORT})
		exit 1 ;
else
		$(info rpc port $(RPC_PORT) seems free - truying to use it...)
endif

p2pport:
	$(info checking p2p-port $(PORT) -$(filter-out \ , $(strip ${P2PPORT_EXISTS}))-)
ifneq ($(filter-out \ , $(strip ${P2PPORT_EXISTS})), )
		$(info p2p port seems already in use!  ${PORT})
		exit 1 ;
else
		$(info p2p port $(PORT) seems free - truying to use it...)
endif

all: build test

#--no-cache
build:
	docker build -t $(IMG) --no-cache --build-arg DOICHAIN_VER=$(DOICHAIN_VER) --build-arg DOICHAIN_DAPP_VER=$(DOICHAIN_DAPP_VER) .

mainnet%: http_port rpc_port p2pport
	$(info Checking if HTTP_PORT, RPC_PORT and PORT is set)
	@printf 'HTTP_PORT is $(if $(HTTP_PORT),true,$(eval HTTP_PORT=80) ${HTTP_PORT}). HTTP_PORT is ${HTTP_PORT} \n'
	@printf 'RPC_PORT is $(if $(RPC_PORT),true,$(eval RPC_PORT=8339) ${RPC_PORT}). RPC_PORT is ${RPC_PORT} \n'
	@printf 'PORT is $(if $(PORT),true,$(eval PORT=8338) ${PORT}). RPC_PORT is ${PORT} \n'
	$(DOCKER_MAINNET) -i $(IMG)

testnet%: http_port rpc_port p2pport
	$(info Checking if HTTP_PORT, RPC_PORT and PORT is set)
	@printf 'HTTP_PORT is $(if $(HTTP_PORT),true,$(eval HTTP_PORT=81) ${HTTP_PORT}). HTTP_PORT is ${HTTP_PORT} \n'
	@printf 'RPC_PORT is $(if $(RPC_PORT),true,$(eval RPC_PORT=18339) ${RPC_PORT}). RPC_PORT is ${RPC_PORT} \n'
	@printf 'PORT is $(if $(PORT),true,$(eval PORT=18338) ${PORT}). RPC_PORT is ${PORT} \n'
	$(DOCKER_TESTNET) -i $(IMG)

regtest%: http_port rpc_port p2pport
	$(info -$(RUNNING_TARGET)-)
ifneq ($(RUNNING_TARGET),)
	$(info running: -$(RUNNING_TARGET)-)
	docker rm -f $(RUNNING_TARGET)
endif
	$(DOCKER_REGTEST) -i $(IMG)

new_mainnet:
	$(eval RPC_PORT_ALICE=8339)
	$(eval RPC_PORT_BOB=28339)
	$(eval PORT_ALICE=8338)
	$(eval PORT_BOB=28338)
	#starting mainnet-alice on port 84 and RPC_PORT 8339 (with send-mode dapp)
	@$(MAKE) -e -f $(THIS_FILE) mainnet-alice HTTP_PORT=$(HTTP_PORT_ALICE) RPC_PORT=$(RPC_PORT_ALICE) PORT=$(PORT_ALICE)
	#starting regtest-bob on port 85 and RPC_PORT 18339 (with confirm-mode and verify mode dapp)
	@$(MAKE) -e -f $(THIS_FILE) mainnet-bob HTTP_PORT=$(HTTP_PORT_BOB) RPC_PORT=$(RPC_PORT_BOB) PORT=$(PORT_BOB)

	#now connect bob to alice!
	sleep 3
	$(eval ALICE_DOCKER_IP=$(shell docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' doichain_mainnet-alice))
	@echo doichain_mainnet-alice has internal IP:$(ALICE_DOCKER_IP)
	curl -s --user admin:generated-password --data-binary '{"jsonrpc": "1.0", "id":"curltest", "method": "addnode", "params": ["$(ALICE_DOCKER_IP)", "onetry"] }' -H 'content-type: text/plain;' http://127.0.0.1:$(RPC_PORT_BOB)/
	curl -s --user admin:generated-password --data-binary '{"jsonrpc": "1.0", "id":"curltest", "method": "getpeerinfo", "params": [] }' -H 'content-type: text/plain;' http://127.0.0.1:$(RPC_PORT_BOB)/
	# ./checkdifficulty_mainnet.sh # do not enable this since doichaind does not allow connection - correct rpcallowip first!

new_testnet:
	$(eval RPC_PORT_ALICE=18339)
	$(eval RPC_PORT_BOB=28339)
	$(eval PORT_ALICE=18338)
	$(eval PORT_BOB=28338)
	#starting testnet-alice on port 84 and RPC_PORT 18339 (with send-mode dapp)
	@$(MAKE) -e -f $(THIS_FILE) testnet-alice HTTP_PORT=$(HTTP_PORT_ALICE) RPC_PORT=$(RPC_PORT_ALICE) PORT=$(PORT_ALICE)
	#starting regtest-bob on port 85 and RPC_PORT 18339 (with confirm-mode and verify mode dapp)
	@$(MAKE) -e -f $(THIS_FILE) testnet-bob HTTP_PORT=$(HTTP_PORT_BOB) RPC_PORT=$(RPC_PORT_BOB) PORT=$(PORT_BOB)
	sleep 3

	#now connect bob to alice!
	@$(MAKE) -j 1 -e -f $(THIS_FILE) connect-testnet
	curl -s --user admin:generated-password --data-binary '{"jsonrpc": "1.0", "id":"curltest", "method": "getpeerinfo", "params": [] }' -H 'content-type: text/plain;' http://127.0.0.1:$(RPC_PORT_BOB)/
	./checkdifficulty_testnet.sh
	#start p2pool on alice node so it checks current difficulty with each found block
	#if difficulty is high enough (so every minute are found a couple of blocks) - switch back to validation and a higher auxpowtime

new_regtest:
	#starting regtest-alice on port 84 and RPC_PORT 18339 (with send-mode dapp)
	@$(MAKE) -e -f $(THIS_FILE) regtest-alice HTTP_PORT=$(HTTP_PORT_ALICE) RPC_PORT=$(RPC_PORT_ALICE) PORT=$(PORT_ALICE)
	#starting regtest-bob on port 85 and RPC_PORT 18339 (with confirm-mode and verify mode dapp)
	@$(MAKE) -e -f $(THIS_FILE) regtest-bob HTTP_PORT=$(HTTP_PORT_BOB) RPC_PORT=$(RPC_PORT_BOB) PORT=$(PORT_BOB)
	sleep 3
	@echo started alice and bob as regtest doichain nodes!


	#curl connect to RCP of alice and create new doichain address
	#curl connect to RPC of bob and create new doichain address
	@$(MAKE) -e -f $(THIS_FILE) connect-regtest

	#curl generate 110 new blocks and send it to generated doichain address
	@$(MAKE) -e -f $(THIS_FILE) generate-110
	#curl connect to RPC of alice and send 10 doicoins to bob
	@$(MAKE) -e -f $(THIS_FILE) send-10-to-bob

	#test simple name-doi and send it to another addresss
	@$(MAKE) -j 1 -e -f $(THIS_FILE) name_doi


connect-testnet:
	#get internal docker ipaddress of alice and let bob connect to alice
	sleep 3
	$(eval ALICE_DOCKER_IP=$(shell docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' testnet-alice))
	@echo testnet-alice has internal IP:$(ALICE_DOCKER_IP)
	curl -s --user $(RPC_USER):$(RPC_PASSWORD) --data-binary '{"jsonrpc": "1.0", "id":"curltest", "method": "addnode", "params": ["$(ALICE_DOCKER_IP)", "onetry"] }' -H 'content-type: text/plain;' http://127.0.0.1:$(RPC_PORT_BOB)/
	curl --user $(RPC_USER):$(RPC_PASSWORD) --data-binary '{"jsonrpc": "1.0", "id":"curltest", "method": "getpeerinfo", "params": [] }' -H 'content-type: text/plain;' http://127.0.0.1:$(RPC_PORT_ALICE)/ | jq

connect-regtest:
	#get internal docker ipaddress of alice and let bob connect to alice
	$(eval ALICE_DOCKER_IP=$(shell docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' regtest-alice))
	@echo regtest-alice has internal IP:$(ALICE_DOCKER_IP)
	curl -s --user $(RPC_USER):$(RPC_PASSWORD) --data-binary '{"jsonrpc": "1.0", "id":"curltest", "method": "addnode", "params": ["$(ALICE_DOCKER_IP)", "onetry"] }' -H 'content-type: text/plain;' http://127.0.0.1:$(RPC_PORT_BOB)/
	curl --user $(RPC_USER):$(RPC_PASSWORD) --data-binary '{"jsonrpc": "1.0", "id":"curltest", "method": "getpeerinfo", "params": [] }' -H 'content-type: text/plain;' http://127.0.0.1:$(RPC_PORT_ALICE)/ | jq

generate-110:
	#generate new addresses on alice and bob
	#generating 110 blocks on alice
	$(eval ALICE_NEW_ADDRESS=$(shell curl  -s --user $(RPC_USER):$(RPC_PASSWORD) --data-binary '{"jsonrpc": "1.0", "id":"curltest", "method": "getnewaddress", "params": [""] }' -H 'content-type: text/plain;' http://127.0.0.1:$(RPC_PORT_ALICE)/ | jq .result))
	$(eval BOB_NEW_ADDRESS=$(shell curl  -s --user $(RPC_USER):$(RPC_PASSWORD) --data-binary '{"jsonrpc": "1.0", "id":"curltest", "method": "getnewaddress", "params": [""] }' -H 'content-type: text/plain;' http://127.0.0.1:$(RPC_PORT_BOB)/ | jq .result))

	curl --silent --user admin:generated-password --data-binary '{"jsonrpc": "1.0", "id":"curltest", "method": "generatetoaddress", "params": [110,$(ALICE_NEW_ADDRESS)] }' -H 'content-type: text/plain;' http://127.0.0.1:$(RPC_PORT_ALICE)/ | jq '.result'

send-10-to-bob:
	$(eval BOB_ADDRESS=$(shell curl -s --user $(RPC_USER):$(RPC_PASSWORD) --data-binary '{"jsonrpc": "1.0", "id":"curltest", "method": "getaddressesbyaccount", "params": [""] }' -H 'content-type: text/plain;' http://127.0.0.1:$(RPC_PORT_BOB)/ | jq '.result[0]'))
	$(eval ALICE_ADDRESS=$(shell curl -s --user $(RPC_USER):$(RPC_PASSWORD) --data-binary '{"jsonrpc": "1.0", "id":"curltest", "method": "getaddressesbyaccount", "params": [""] }' -H 'content-type: text/plain;' http://127.0.0.1:$(RPC_PORT_ALICE)/ | jq '.result[0]'))

	$(eval ismine=$(shell curl -s --user $(RPC_USER):$(RPC_PASSWORD) --data-binary '{"jsonrpc": "1.0", "id":"curltest", "method": "validateaddress", "params": [$(BOB_ADDRESS)] }' -H 'content-type: text/plain;' http://127.0.0.1:$(RPC_PORT_BOB)/ | jq '.result.ismine'))
	$(info bobs doichain address: $(BOB_ADDRESS) ismine: $(ismine))

	$(eval txid=$(shell curl -s --user admin:generated-password --data-binary '{"jsonrpc": "1.0", "id":"curltest", "method": "sendtoaddress", "params": [$(BOB_ADDRESS),10] }' -H 'content-type: text/plain;' http://127.0.0.1:$(RPC_PORT_ALICE)/ | jq '.result' ))
	$(info 10 dois send to bob: ($(BOB_ADDRESS)) with txid: $(txid))
	#mine another block so the transaction can arrive
	curl -s --user $(RPC_USER):$(RPC_PASSWORD) --data-binary '{"jsonrpc": "1.0", "id":"curltest", "method": "generatetoaddress", "params": [1,$(ALICE_ADDRESS)] }' -H 'content-type: text/plain;' http://127.0.0.1:$(RPC_PORT_ALICE)/ | jq '.result'
	curl -s --user $(RPC_USER):$(RPC_PASSWORD) --data-binary '{"jsonrpc": "1.0", "id":"curltest", "method": "getbalance", "params": [] }' -H 'content-type: text/plain;' http://127.0.0.1:$(RPC_PORT_ALICE)/ | jq '.result'
	curl -s --user $(RPC_USER):$(RPC_PASSWORD) --data-binary '{"jsonrpc": "1.0", "id":"curltest", "method": "getbalance", "params": [] }' -H 'content-type: text/plain;' http://127.0.0.1:$(RPC_PORT_BOB)/ | jq '.result'

name_doi:
	#create example name_doi on alice and send it to bob

	$(eval currentTime=$(shell date +%s))
	$(eval BOB_ADDRESS=$(shell curl -s --user $(RPC_USER):$(RPC_PASSWORD) --data-binary '{"jsonrpc": "1.0", "id":"curltest", "method": "getaddressesbyaccount", "params": [""] }' -H 'content-type: text/plain;' http://127.0.0.1:$(RPC_PORT_BOB)/ | jq '.result[0]'))
	$(eval ALICE_ADDRESS=$(shell curl -s --user $(RPC_USER):$(RPC_PASSWORD) --data-binary '{"jsonrpc": "1.0", "id":"curltest", "method": "getaddressesbyaccount", "params": [""] }' -H 'content-type: text/plain;' http://127.0.0.1:$(RPC_PORT_ALICE)/ | jq '.result[0]'))

	$(shell curl -s --user admin:generated-password --data-binary '{"jsonrpc": "1.0", "id":"curltest", "method": "generatetoaddress", "params": [1,$(ALICE_ADDRESS)] }' -H 'content-type: text/plain;' http://127.0.0.1:$(RPC_PORT_ALICE)/ | jq '.result')

	$(info bobs address is:($(BOB_ADDRESS)))
	$(eval txid_fee=$(shell curl -s --user $(RPC_USER):$(RPC_PASSWORD) --data-binary '{"jsonrpc": "1.0", "id":"curltest", "method": "sendtoaddress", "params": [$(BOB_ADDRESS),0.02] }' -H 'content-type: text/plain;' http://127.0.0.1:$(RPC_PORT_ALICE)/ | jq '.result' ))
	$(info sent 0.02 to Bob txid:($(txid_fee))) #namecoind crashes after receiving two different transactions

	$(eval txid_doi=$(shell curl -s --user $(RPC_USER):$(RPC_PASSWORD) --data-binary '{"jsonrpc": "1.0", "id":"curltest", "method": "name_doi", "params": ["e/maketest_doi_$(currentTime)","{testparam:testval}",$(BOB_ADDRESS)] }' -H 'content-type: text/plain;' http://127.0.0.1:$(RPC_PORT_ALICE)/ | jq '.result' ))
	$(info sent new name_doi to Bob txid: $(txid_doi))

	sleep 2
	$(eval txid_fee_result=$(shell curl -s --user $(RPC_USER):$(RPC_PASSWORD) --data-binary '{"jsonrpc": "1.0", "id":"curltest", "method": "getrawtransaction", "params": [$(txid_doi), 1] }' -H 'content-type: text/plain;' http://127.0.0.1:$(RPC_PORT_BOB) | jq '.result.vout | .[] | select(.scriptPubKey.nameOp.op=="name_doi") | .scriptPubKey.hex' ))
	$(info doi transaction arrived @ port $(RPC_PORT_BOB) with hex:  ($(txid_fee_result)))

	$(eval txid_fee_result=$(shell curl -s --user $(RPC_USER):$(RPC_PASSWORD) --data-binary '{"jsonrpc": "1.0", "id":"curltest", "method": "getrawtransaction", "params": [$(txid_fee), 1] }' -H 'content-type: text/plain;' http://127.0.0.1:$(RPC_PORT_BOB) | jq '.result.vout | .[] | select(.value==0.02) .value' ))
	$(info doi fee transaction arrived  @ port $(RPC_PORT_BOB) with value:  ($(txid_fee_result)))

temp:

	#check if transaction already arrived at bobs
	#curl -s --user $(RPC_USER):$(RPC_PASSWORD) --data-binary '{"jsonrpc": "1.0", "id":"curltest", "method": "getrawtransaction", "params": [$(txid_doi), 1] }' -H 'content-type: text/plain;' http://127.0.0.1:$(RPC_PORT_BOB)/ | jq '.result.vout | .[] | select(.scriptPubKey.nameOp.op=="name_doi") | .scriptPubKey.hex'
#| jq '.result.vout | .[] | select(.scriptPubKey.nameOp.op=="name_doi") | .scriptPubKey.hex'

	#$(eval txid_doi_result=$(shell curl -s --user $(RPC_USER):$(RPC_PASSWORD) --data-binary '{"jsonrpc": "1.0", "id":"curltest", "method": "getrawtransaction", "params": ["$(txid_doi)", 1] }' -H 'content-type: text/plain;' http://127.0.0.1:$(RPC_PORT_BOB)/ | jq )) #'.result.vout.scriptPubKey.nameOp'
	#$(info doi transaction arrived?  ($(txid_doi_result)))
	#curl -s --user admin:generated-password --data-binary '{"jsonrpc": "1.0", "id":"curltest", "method": "generatetoaddress", "params": [1,$(ALICE_ADDRESS)] }' -H 'content-type: text/plain;' http://127.0.0.1:$(RPC_PORT_ALICE)/ | jq '.result'


	#get internal docker ipaddress of alice and let bob connect to alice
	#$(eval ALICE_DOCKER_IP=$(shell docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' regtest-alice))
	#@echo regtest-alice has internal IP:$(ALICE_DOCKER_IP)
	#curl -s --user admin:generated-password --data-binary '{"jsonrpc": "1.0", "id":"curltest", "method": "addnode", "params": ["$(ALICE_DOCKER_IP)", "onetry"] }' -H 'content-type: text/plain;' http://127.0.0.1:$(RPC_PORT_BOB)/


test_mainnet_rm:
	docker rm -fv doichain_mainnet-bob doichain_mainnet-alice
	docker volume rm doichain_mainnet-bob doichain_mainnet-alice

test_testnet_rm:
	docker rm -fv testnet-bob testnet-alice
	docker volume rm doichain_testnet-alice doichain_testnet-bob

test_regtest_rm:
	docker rm -fv regtest-bob regtest-alice
	docker volume rm doichain_regtest-bob doichain_regtest-alice
clean:
	docker rmi -f $(IMG)

	##dApp tests
	#curl to alice dapp and autenticate, get userId and token
	#curl to alice dapp and add new opt-in
	#curl to alice RPC and check if transaction was created
	#curl to bob RPC and check if transaction already arrived
	#check email server if email arrived confirm email
	#curl to alice RPC and generate 1 new block
	#curl to bob and check if name_list contains new doi


