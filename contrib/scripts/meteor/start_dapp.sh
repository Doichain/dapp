#!/usr/bin/env bash
cd build/bundle/programs/server/
meteor npm install --save bcrypt
cd -
export METEOR_SETTINGS=$(cat settings-jenkins-bob.json)
echo $METEOR_SETTINGS
export PORT=4000
export ROOT_URL=http://localhost:4000
export MONGO_URL=mongodb://mongo:27017/bob
node build/bundle/main.js