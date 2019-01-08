#!/usr/bin/env bash
meteor npm install --save bcrypt
export MONGO_URL=mongodb://localhost:28017/alice;nohup meteor run --settings  settings-alice.json --port 3000  > logs/alice-dapp.log 2> logs/alice-dapp.err