FROM node:12

ARG DOICHAIN_VER=master
ARG DOICHAIN_DAPP_VER=master
ENV DOICHAIN_VER $DOICHAIN_VER
ENV DOICHAIN_DAPP_VER $DOICHAIN_DAPP_VER

#Install dependencies
RUN apt-get update && apt-get install -y \
	autoconf \
	apt-utils \
	bsdmainutils \
	build-essential \
	curl \
	jq \
	vim \
	bc \
	bsdtar \
	dos2unix \
	git \
	libboost-all-dev \
	libevent-dev \
	libssl-dev \
	libtool \
	locales \
	pkg-config \
	sudo \
  	&& (curl https://install.meteor.com/ | sh) \
	&& rm -rf /var/lib/apt/lists/*

RUN export tar='bsdtar'

#Install locales
RUN locale-gen ${OS_LOCALE}

ENV OS_LOCALE en_US.UTF-8
ENV LANG ${OS_LOCALE}
ENV LANGUAGE en_US:en

WORKDIR /
RUN adduser --disabled-password --gecos '' doichain && \
	adduser doichain sudo && \
	echo '%sudo ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers
USER doichain

#Install berkeley-db
WORKDIR /tmp/build/bdb
ADD http://download.oracle.com/berkeley-db/db-4.8.30.NC.tar.gz db-4.8.30.NC.tar.gz
RUN echo '12edc0df75bf9abd7f82f821795bcee50f42cb2e5f76a6a281b85732798364ef  db-4.8.30.NC.tar.gz' | sudo sha256sum -c && \
	sudo tar xzvf db-4.8.30.NC.tar.gz && \
	cd db-4.8.30.NC/build_unix/ && \
	sudo ../dist/configure --enable-cxx && \
	sudo rm /usr/include/db.h && \
	sudo make && \
	sudo make install && \
	sudo ln -s /usr/local/BerkeleyDB.4.8 /usr/include/db4.8 && \
	sudo ln -s /usr/include/db4.8/lib/* /usr/lib && \
    sudo ln -s /usr/include/db4.8/include/* /usr/include

#Install doichain-core
WORKDIR /home/doichain
RUN mkdir .doichain scripts && \
	git clone --branch ${DOICHAIN_VER} https://github.com/Doichain/core.git doichain-core && \
	cd doichain-core && \
	./autogen.sh && \
	./configure --without-gui  --disable-tests  --disable-gui-tests && \
	make && \
	sudo make install && cd .. && \
	git clone --branch ${DOICHAIN_DAPP_VER} https://github.com/Doichain/dApp.git dapp && cd dapp && \
	meteor npm install --save bcrypt