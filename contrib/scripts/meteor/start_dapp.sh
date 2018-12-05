#!/usr/bin/env bash

#build dApp for bob
printf "build/\\ntest/" > .meteorignore #don't include tests into build
meteor npm install --save-exact @babel/runtime@7.0.0-beta.55
sudo rm -rf build && meteor build build/ --architecture os.linux.x86_64 --directory #this takes a long and could be excluded when not needed.
cd build/bundle/programs/server && npm install
cd - #go back to project root


#export settings.json for bob
export METEOR_SETTINGS=$(cat settings-jenkins-bob.json)
echo $METEOR_SETTINGS
export PORT=4000
export ROOT_URL=http://localhost:4000
export MONGO_URL=mongodb://mongo:27017/bob

#start bob
nohup node build/bundle/main.js &

#overwrite .meteorignore back to normal
sudo echo "build/" > .meteorignore

