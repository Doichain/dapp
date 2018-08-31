#!/usr/bin/env bash
#meteor build build/ --architecture os.linux.x86_64  #this takes a lot of time and could be excluded when not needed.
cd build/bundle/programs/server/
meteor npm install --save bcrypt
cd -
export METEOR_SETTINGS=$(cat settings-jenkins-bob.json)
echo $METEOR_SETTINGS
export PORT=4000
export ROOT_URL=http://localhost:4000
export MONGO_URL=mongodb://mongo:27017/bob
nohup node build/bundle/main.js &