# Doichain Meteor API

This meteor project adds the Doichain (see https://doichain.org) REST API to your web project.

1. Prerequisites
    - running Doichain Node (manual installation see: https://github.com/Doichain/core/tree/master/doc)
    - or via Docker-Hub ``docker run -it doichain/node-only``

2. Installation
    - ```meteor add doichain:doichain-meteor-api```
    - ```meteor npm install simpl-schema```
    - configure settings.json as described under https://github.com/Doichain/dapp#settings`
    - run meteor ```meteor run --settings settings.json```
3. Test
    - authenticate on via REST (e.g. via ```curl -H "Content-Type: application/json" -X POST -d '{"username":"admin","password":"password"}' http://localhost:3000/api/v1/login ```)