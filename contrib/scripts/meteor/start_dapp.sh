#!/usr/bin/env bash

#temporary move these tests into the test directory
#mv server/*test*.js test/
#rm -rf build && meteor build build/ --architecture os.linux.x86_64 --directory #this takes a lot of time and could be excluded when not needed.
#npm cache verify
#cd build/bundle/programs/server/
#meteor npm install --save bcrypt
#cd -
export METEOR_SETTINGS=$(cat settings-jenkins-bob.json)
echo $METEOR_SETTINGS
export PORT=4000
export ROOT_URL=http://localhost:4000
export MONGO_URL=mongodb://mongo:27017/bob
#move tests back to original place
#mv test/*test*.js server/
nohup node build/bundle/main.js &

#overwrite .meteorignore
echo "build/" > .meteorignore

