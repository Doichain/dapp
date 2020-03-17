FROM alpine as build

# Build stage for BerkeleyDB
RUN sed -i 's/http\:\/\/dl-cdn.alpinelinux.org/https\:\/\/alpine.global.ssl.fastly.net/g' /etc/apk/repositories && \
    export TMP_PKGS_DB="autoconf automake build-base libressl" && \
    apk --no-cache add $TMP_PKGS_DB

ENV BERKELEYDB_VERSION=db-4.8.30.NC
ENV BERKELEYDB_PREFIX=/opt/${BERKELEYDB_VERSION}

RUN wget https://download.oracle.com/berkeley-db/${BERKELEYDB_VERSION}.tar.gz && \
    tar -xzf *.tar.gz && \
    sed s/__atomic_compare_exchange/__atomic_compare_exchange_db/g -i ${BERKELEYDB_VERSION}/dbinc/atomic.h && \
    mkdir -p ${BERKELEYDB_PREFIX} && \
    cd /${BERKELEYDB_VERSION}/build_unix && \
    ../dist/configure --enable-cxx --disable-shared --with-pic --prefix=${BERKELEYDB_PREFIX} && \
    make -j && \
    make install && \
    rm -rf ${BERKELEYDB_PREFIX}/docs;

# Build stage for DOICHAIN Core
RUN sed -i 's/http\:\/\/dl-cdn.alpinelinux.org/https\:\/\/alpine.global.ssl.fastly.net/g' /etc/apk/repositories && \
    export TMP_PKGS_CORE="autoconf automake boost-dev build-base chrpath file gnupg libevent-dev libressl libressl-dev \
                         libtool linux-headers protobuf-dev zeromq-dev git db-utils db-c++" && \
    apk --no-cache add $TMP_PKGS_CORE

ENV DOICHAIN_VERSION=0.0.9
ENV DOICHAIN_PREFIX=/opt/doichain-${DOICHAIN_VERSION}

RUN git clone --branch ${DOICHAIN_VER} https://github.com/Doichain/core.git doichain-core && \
    cd doichain-core && \
    ./autogen.sh && \
    ./configure LDFLAGS=-L`ls -d /opt/db*`/lib/ CPPFLAGS=-I`ls -d /opt/db*`/include/ \
    --prefix=${DOICHAIN_PREFIX} \
    --mandir=/usr/share/man \
    --disable-tests \
    --disable-bench \
    --disable-ccache \
    --with-gui=no \
    --with-utils \
    --with-libs \
    --with-daemon && \
    make -j4 && \
    make install && \
    apk del $TMP_PKGS_DB $TMP_PKGS_CORE

#FROM staeke/meteor-alpine:1.9.2
FROM node:12 as doichain

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

RUN apt-get update && \
    apt-get install -y curl git curl && \
    (curl https://install.meteor.com/ | sh) && \
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

RUN sed -i 's/http\:\/\/dl-cdn.alpinelinux.org/https\:\/\/alpine.global.ssl.fastly.net/g' /etc/apk/repositories && \
    apk add --no-cache bash boost boost-program_options libevent libressl libzmq su-exec build-base gcc && \
    adduser --disabled-password --gecos '' doichain && \
    adduser doichain root && \
    echo '%sudo ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers
USER doichain

ENV DOICHAIN_VERSION=0.0.9
ENV DOICHAIN_PREFIX=/opt/doichain-${DOICHAIN_VERSION}
ENV PATH=${DOICHAIN_PREFIX}/bin:$PATH

## copy the doichain core binaries and berkeley db
COPY --from=build /opt /opt
## copy everything from user doichain in meteor build step
COPY --from=doichain /home/doichain/ /home/doichain/

COPY . /home/doichain/scripts/

ENTRYPOINT ["bash", "/home/doichain/scripts/entrypoint.sh"]

#Start doichain and meteor
CMD ["bash", "/home/doichain/scripts/start.sh"]

#Expose ports
EXPOSE $DAPP_PORT $NODE_PORT $RPC_PORT