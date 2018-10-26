FROM doichain/docker:dapp-base
USER doichain
ADD . /home/doichain/dapp
WORKDIR /home/doichain/dapp
RUN  sudo apt-get update && \
  sudo apt-get install -y python python-dev python-distribute python-pip && \
  sudo apt-get install curl -y && \
  sudo curl -sSL https://get.docker.com/ | sh && \
  #sudo pip install docker-compose && \
  sudo chown -R doichain:doichain /home/doichain/dapp && \
  git submodule init && git submodule update && \
  meteor npm install && meteor npm install --save bcrypt && \
  meteor build build/ --architecture os.linux.x86_64 --directory && \
  cd /home/doichain/dapp/build/bundle/programs/server && npm install &&  npm install --save bcrypt

