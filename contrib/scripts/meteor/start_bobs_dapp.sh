#!/usr/bin/env bash
mkdir -p logs
meteor npm install --save bcrypt
#export MONGO_URL=mongodb://localhost:28017/bob;nohup meteor run --settings  settings-bob.json --port 4000  > logs/bobs-dapp.log 2> logs/bobs-dapp.err
export MONGO_URL=mongodb://localhost:28017/bob;meteor run --settings  settings-bob.json --port 4000
