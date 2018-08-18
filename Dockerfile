FROM ubuntu

RUN apt-get update && apt-get install -y --no-install-recommends bsdtar curl sudo ca-certificates && export tar='bsdtar' \
    && adduser --disabled-password --gecos '' doichain && \
    adduser doichain sudo && \
    echo '%sudo ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers

USER doichain
ADD . /home/doichain/dapp
WORKDIR /home/doichain/dapp

RUN export tar='bsdtar' && sudo curl https://install.meteor.com/ | sh && \
sudo chown -R doichain:doichain /home/doichain/dapp &&meteor npm install && meteor npm install --save bcrypt && \
meteor npm run lint && meteor npm run test-d-compose-alice-mocha