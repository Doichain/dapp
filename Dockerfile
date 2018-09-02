FROM ubuntu

RUN apt-get update && apt-get install -y --no-install-recommends bsdtar git curl iputils-ping sudo ca-certificates build-essential gnupg2 \
    && curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash - \
    && apt-get install -y nodejs \
    && export tar='bsdtar' \
    && adduser --disabled-password --gecos '' doichain && \
    adduser doichain sudo && \
    echo '%sudo ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers

USER doichain
ADD . /home/doichain/dapp
WORKDIR /home/doichain/dapp

RUN export tar='bsdtar' && sudo curl https://install.meteor.com/ | sh && \
sudo chown -R doichain:doichain /home/doichain/dapp && meteor npm install && meteor npm install --save bcrypt && \
cd build/bundle/programs/server && npm install &&  npm install --save bcrypt
