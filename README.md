# Doichain dApp
A reference implementation of the "Doichain Atomic Double-Opt-In Protocoll"

## Table of Contents
- [Manual Installation](doc/en/install-manual-linux.md) (en) [Manual Installation](doc/de/install-manual-linux.md) (de)
- [Docker Installation](doc/en/install-docker.md) (en) [Docker Installation](doc/de/install-docker.md) (de)
- [REST-API](doc/en/rest-api.md)
- [Bounty Program](doc/en/bounty.md)
- [Settings](#settings)
- [UML](#uml)
    * [Activity diagram](#activity-diagram)
    * [Sequence diagram](#sequence-diagram)
- [Blockchain entry name id](#blockchain-entry-name-id)

## Blockchain entry name id
The name id is a 256-bit, ECDSA valid, number represanted as a 32 byte (64 characters) string (Same as every Bitcoin privateKey). See also: https://en.bitcoin.it/wiki/Private_key
## UML

##### activity-diagram

![Alt activity diagram](doc/uml/activity.svg)

##### sequence-diagram

![Alt secquence diagram](doc/uml/sequence.svg)

## Developer Section
##### How to start developing
1. Install Meteor from meteor.com
2. Checkout this repository ``git clone https://github.com/Doichain/dapp.git; cd dapp;meteor npm install``
3. Start development environment with Docker Compose ``docker-compose -f -f docker-compose-test-regtest.yml up``
4. Start Bobs meteor ``MONGO_URL=mongodb://localhost:28017/bob meteor run --settings settings-bob.json --port 4000``
5. Start Alice meteor durring development ``MONGO_URL=mongodb://localhost:28017/alice meteor run --settings settings-alice.json --port 3000``
6. Or run tests on Alice ``meteor npm run test-alice``