#!/usr/bin/env bash

#build dApp for bob
<<<<<<< HEAD
printf "stories/\nbuild/\ntest/" > .meteorignore #don't include tests into build
=======
#printf "stories/\nbuild/\ntest/" > .meteorignore #don't include tests into build
>>>>>>> 0.0.9
#meteor npm install --save-exact @babel/runtime@latest
#sudo rm -rf build && meteor build build/ --architecture os.linux.x86_64 --directory #this takes a long and could be excluded when not needed.
#cd build/bundle/programs/server && npm install
#cd - #go back to project root


#export settings.json for bob
#export METEOR_SETTINGS=$(cat settings-jenkins-bob.json)
#echo $METEOR_SETTINGS
#export PORT=4000
#export ROOT_URL=http://localhost:4000
#export MONGO_URL=mongodb://mongo:27017/bob

#start bob
#nohup node build/bundle/main.js &
#meteor npm install --save bcrypt
export MONGO_URL=mongodb://mongo:27017/bob;nohup meteor run --settings  settings-jenkins-bob.json --port 4000
#export MONGO_URL=mongodb://mongo:27017/bob;nohup meteor run --settings  settings-jenkins-bob.json --port 4000 > bobs-dapp.out 2> bobs-dapp.err
#overwrite .meteorignore back to normal
<<<<<<< HEAD
sudo printf "stories/\nbuild/" > .meteorignore
=======
#sudo echo "stories/\nbuild/" > .meteorignore
>>>>>>> 0.0.9
