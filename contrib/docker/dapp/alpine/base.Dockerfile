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
    ../dist/configure --enable-cxx --prefix=${BERKELEYDB_PREFIX} && \
    make -j && \
    make install && \
    ln -s ${BERKELEYDB_PREFIX} /usr/include/db4.8 && \
    ln -s ${BERKELEYDB_PREFIX}/lib/* /usr/lib && \
    ln -s ${BERKELEYDB_PREFIX}/include/* /usr/include && \
    rm -rf ${BERKELEYDB_PREFIX}/docs;

# Build stage for DOICHAIN Core
RUN sed -i 's/http\:\/\/dl-cdn.alpinelinux.org/https\:\/\/alpine.global.ssl.fastly.net/g' /etc/apk/repositories && \
    export TMP_PKGS_CORE="autoconf automake boost-dev build-base chrpath file gnupg libevent-dev libressl libressl-dev \
                         libtool linux-headers protobuf-dev zeromq-dev git db-utils db-c++" && \
    apk --no-cache add $TMP_PKGS_CORE

ARG DOICHAIN_VER=master
ENV DOICHAIN_VER $DOICHAIN_VER
ENV DOICHAIN_PREFIX=/opt/doichain-${DOICHAIN_VER}

RUN git clone --branch ${DOICHAIN_VER} https://github.com/Doichain/core.git doichain-core && \
    cd doichain-core && \
    ./autogen.sh && \
    ./configure --without-gui  --disable-tests  --disable-gui-tests --prefix=${DOICHAIN_PREFIX} && \
    make && \
    make install && \
    apk del $TMP_PKGS_DB $TMP_PKGS_CORE