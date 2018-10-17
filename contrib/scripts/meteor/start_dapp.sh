#!/usr/bin/env bash
echo "build/\nserver/*test*.js" > .meteorignore
rm -rf build && meteor build build/ --architecture os.linux.x86_64 --directory #this takes a lot of time and could be excluded when not needed.
export METEOR_SETTINGS=$(cat settings-jenkins-bob.json)
echo $METEOR_SETTINGS
export PORT=4000
export ROOT_URL=http://localhost:4000
export MONGO_URL=mongodb://mongo:27017/bob
nohup node build/bundle/main.js &

#overwrite .meteorignore
echo "build/" > .meteorignore

