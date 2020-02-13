# Setting up a Doichain Development Environment via RegTest

1. Clone Repository ```git clone https://github.com/Doichain/dapp.git doichain-dapp; cd doichain-dapp/```
2. Install Docker and Docker Compose and run ```docker-compose -f contrib/docker/docker-compose-test-regtest.yml up``` to setup the development environment
    - mongo server running on port 28017 (db alice and db bob)
    - bind (dns) server running (serving test domain ci-doichain.org with TXT records holding doichain public-key)
    - mail server (smtp, pop) running on smtp port 25 (and pop3 for user alice and usr bob)
    - Doichain node running for Alice
    - Doichain node running for Bob
    - !!!Doichain dApps for Alice and Bob - do not run inside docker compose because of performance issues!!!
3. Install Meteor from meteor.com
4. Open a second terminal and start meteor for Bob (Confirmation dApp on port 4000)
    - ```meteor npm install```
    - ```MONGO_URL=mongodb://localhost:28017/bob meteor run --settings contrib/settings/settings-bob.json --port 4000```
5. Open a third terminal and start meteor test with
    - ```meteor npm run regtest-alice```
6. If all tests ran successfully you can start developing while starting dApp of Alice
    - ```MONGO_URL=mongodb://localhost:28017/alice meteor run --settings contrib/settings/settings-alice.json --port 3000```
7. Use commands:
    - connect to mongo db ```docker-compose -f contrib/docker/docker-compose-test-regtest.yml exec regtest-mongo mongo alice```
    - check blockchain  ```docker-compose -f contrib/docker/docker-compose-test-regtest.yml exec alice doichain-cli -getinfo```
    - generate a block  ```docker-compose -f contrib/docker/docker-compose-test-regtest.yml exec alice doichain-cli generate 1```
    - connect to mail
    - connect to bind
