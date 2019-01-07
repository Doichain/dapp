#!/usr/bin/env bash
meteor npm install --save bcrypt
export MONGO_URL=mongodb://localhost:28017/bob;nohup meteor run --settings  settings-bob.json --port 4000  > bobs-dapp.log 2> bobs-dapp.err
