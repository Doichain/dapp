FROM doichain/docker:dapp-base
USER root
RUN  apt-get update && \
  apt-get install --no-install-recommends -y python python-dev python-distribute python-pip && \
  rm -rf /var/lib/apt/lists/* && \
  xvfb wget curl && \
  curl -sSL https://get.docker.com/ | sh && \
  chown -R doichain:doichain /home/doichain/dapp && \
  git submodule init && git submodule update && \
  meteor npm install && meteor npm install --save bcrypt && \
  meteor build build/ --architecture os.linux.x86_64 --directory && \
  cd /home/doichain/dapp/build/bundle/programs/server && npm install &&  npm install --save bcrypt
# Install Chrome https://discuss.circleci.com/t/installing-chrome-inside-of-your-docker-container/9067
RUN wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb && \
 dpkg -i google-chrome-stable_current_amd64.deb && \
 apt-get -fy install --no-install-recommends  && \
 apt-get -y remove curl wget jq && \ rm *.deb
USER doichain
ADD . /home/doichain/dapp
WORKDIR /home/doichain/dapp

ENV DISPLAY=:99
ADD ./contrib/scripts/docker-compose/start-regtest.sh .
CMD ["./start-regtest.sh"]

#check lint with https://www.fromlatest.io/#/