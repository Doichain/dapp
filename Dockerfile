FROM doichain/docker:dapp-base
USER doichain
ADD . /home/doichain/dapp

WORKDIR /home/doichain/dapp
RUN  sudo apt-get update && \
  sudo apt-get install -y python python-dev python-distribute python-pip && \
  sudo apt-get install xvfb wget curl -y && \
  sudo curl -sSL https://get.docker.com/ | sh && \
  sudo chown -R doichain:doichain /home/doichain/dapp && \
  git submodule init && git submodule update && \
  meteor npm install && meteor npm install --save bcrypt && \
  meteor build build/ --architecture os.linux.x86_64 --directory && \
  cd /home/doichain/dapp/build/bundle/programs/server && npm install &&  npm install --save bcrypt

# Install Chrome https://discuss.circleci.com/t/installing-chrome-inside-of-your-docker-container/9067
RUN wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
RUN dpkg -i google-chrome-stable_current_amd64.deb; apt-get -fy install
ENV DISPLAY=:99
ADD ./contrib/scripts/docker-compose/start-regtest.sh .
CMD ["sh","start-regtest.sh"]

