# Setting up a Doichain Development Environment 

1. Clone Repository ```git clone https://github.com/Doichain/dapp.git doichain-dapp; cd doichain-dapp/```
2. Install Docker and Docker Compose and run ```docker-compose -f docker-compose-test-regtest.yml up``` to settup the develpment environemnt
    - mongo server running on port 28017 (db alice and db bob) 
    - bind (dns) server running (serving test domain ci-doichain.org with TXT records holding doichain public-key) 
    - mail server (smtp, pop) running on smtp port 25 (and pop3 for user alice and usr bob)
    - Doichain node running for Alice 
    - Doichain node running for Bob
    - !!!Doichain dApps for Alice and Bob - do not run inside docker compose because of performance issues!!!
3. Open a second terminal and start meteor for Bob (Confirmation dApp on port 4000)
    - ```meteor npm install``
    - ```MONGO_URL=mongodb://localhost:28017/bob meteor run --settings settings-bob.json --port 4000```
4. Open a third terminal and start meteor test with
    - ```meteor npm run test-alice```
5. If all tests ran successfully you can start developing while starting dApp of Alice 
    - ```MONGO_URL=mongodb://localhost:28017/alice meteor run --settings settings-alice.json --port 3000```
    