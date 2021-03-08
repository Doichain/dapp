FROM doichain-base:alpine as build
RUN ls -a /opt


FROM node:12 as doichain

ARG DOICHAIN_VER=master
ARG DOICHAIN_DAPP_VER=master
ENV DOICHAIN_VER $DOICHAIN_VER
ENV DOICHAIN_DAPP_VER $DOICHAIN_DAPP_VER
ENV DAPP_HOST "localhost"
ENV DAPP_PORT 3000

RUN apt-get update && \
    apt-get install -y curl git curl && \
    (curl https://install.meteor.com/?release=1.9.3 | sh) && \
    rm -rf /var/lib/apt/lists/*

RUN adduser --disabled-password --gecos '' doichain && \
    adduser doichain root && \
    echo '%sudo ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers
USER doichain

RUN cd /home/doichain; mkdir .doichain scripts && \
    git clone --branch ${DOICHAIN_DAPP_VER} https://github.com/Doichain/dapp.git && cd dapp && \
    meteor npm install && \
    cd /home/doichain && \
    mkdir -p data; cd data && \
    mkdir doichain && \
    mkdir -p dapp/local && \
    rm -rf /home/doichain/.doichain /home/doichain/dapp/.meteor/local && \
    ln -s /home/doichain/data/doichain /home/doichain/.doichain && \
    ln -s /home/doichain/data/dapp/local /home/doichain/dapp/.meteor && \
    cd /home/doichain/dapp && \
    meteor build build/ --directory --server ${DAPP_HOST}:${DAPP_PORT} && \
    rm -rf /home/doichain/dapp/node_modules

## main docker image build step
FROM node:12-alpine

ARG DOICHAIN_VER=master
ARG DOICHAIN_DAPP_VER=master
ENV DOICHAIN_VER $DOICHAIN_VER
ENV DOICHAIN_DAPP_VER $DOICHAIN_DAPP_VER
#Setup run vars
ENV DAPP_SEND true
ENV DAPP_CONFIRM true
ENV DAPP_VERIFY true
ENV DAPP_DEBUG true
ENV DAPP_HOST "localhost"
ENV DAPP_PORT 3000
ENV HTTP_PORT 3000
ENV CONFIRM_ADDRESS ""
ENV MONGO_URL false
ENV DAPP_DOI_URL http://localhost:$DAPP_PORT/api/v1/debug/mail
ENV DAPP_SMTP_USER "doichain"
ENV DAPP_SMTP_HOST "smtp"
ENV DAPP_SMTP_PASS ""
ENV DAPP_SMTP_PORT 587
ENV CONNECTION_NODE 5.9.154.226
ENV NODE_PORT 8338
ENV NODE_PORT_TESTNET 18338
ENV NODE_PORT_REGTEST 18445
ENV REGTEST false
ENV TESTNET false

ENV RPC_ALLOW_IP 127.0.0.1
ENV RPC_HOST "localhost"
ENV RPC_PASSWORD ""
ENV RPC_PORT 8339
ENV RPC_PORT_TESTNET 18339
ENV RPC_PORT_REGTEST 18332
ENV RPC_USER ""

ENV DOICHAIN_PREFIX=/opt/doichain-${DOICHAIN_VER}
ENV BERKELEYDB_PREFIX=/opt/db-4.8.30.NC
ENV PATH=${DOICHAIN_PREFIX}/bin:$PATH

## copy the doichain core binaries and berkeley db
COPY --from=build /opt /opt

RUN sed -i 's/http\:\/\/dl-cdn.alpinelinux.org/https\:\/\/alpine.global.ssl.fastly.net/g' /etc/apk/repositories && \
    apk add --no-cache bash boost boost-program_options libevent libressl libzmq su-exec build-base gcc && \
    ln -s ${BERKELEYDB_PREFIX} /usr/include/db4.8 && \
    ln -s ${BERKELEYDB_PREFIX}/lib/* /usr/lib && \
    ln -s ${BERKELEYDB_PREFIX}/include/* /usr/include && \
    adduser --disabled-password --gecos '' doichain && \
    adduser doichain root && \
    echo '%sudo ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers
USER doichain

## copy everything from user doichain in meteor build step
COPY --from=doichain /home/doichain/ /home/doichain/

COPY *.sh /home/doichain/scripts/

ENTRYPOINT ["bash", "/home/doichain/scripts/entrypoint.sh"]

#Start doichain and meteor
CMD ["bash", "/home/doichain/scripts/start.sh"]

#Expose ports
EXPOSE $DAPP_PORT $NODE_PORT $RPC_PORT