FROM ubuntu:18.04

ARG DOICHAIN_VER=master
ENV DOICHAIN_VER $DOICHAIN_VER

#Setup run vars
ENV CONFIRM_ADDRESS ""
ENV CONNECTION_NODE 5.9.154.226
ENV DAPP_URL http://localhost:3000
ENV NODE_PORT 8338
ENV NODE_PORT_TESTNET 18338
ENV NODE_PORT_REGTEST 18445
ENV REGTEST false
ENV TESTNET false
ENV RPC_ALLOW_IP 172.17.0.0/16
ENV RPC_PASSWORD ""
ENV RPC_PORT 8339
ENV RPC_PORT_TESTNET 18339
ENV RPC_PORT_REGTEST 18332
ENV RPC_USER admin

#Install dependencies
RUN apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install -y \
	autoconf \
	apt-utils \
	bsdmainutils \
	build-essential \
	curl \
	jq \
	vim \
	jq \
	bc \
#	bsdtar \
	dos2unix \
	git \
	libboost-all-dev \
	libevent-dev \
	libssl-dev \
	libtool \
	locales \
	pkg-config \
	sudo \
	&& rm -rf /var/lib/apt/lists/*

#RUN export tar='bsdtar'


#Install locales
RUN locale-gen ${OS_LOCALE}

ENV OS_LOCALE en_US.UTF-8
ENV LANG ${OS_LOCALE}
ENV LANGUAGE en_US:en
#ENV LC_ALL ${OS_LOCALE}

#Set user
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
	#sudo rm /usr/include/db.h && \
	sudo make && \
	sudo make install && \
	sudo ln -s /usr/local/BerkeleyDB.4.8 /usr/include/db4.8 && \
	sudo ln -s /usr/include/db4.8/lib/* /usr/lib && \
    sudo ln -s /usr/include/db4.8/include/* /usr/include

#Install doichain-core
WORKDIR /home/doichain
RUN mkdir .doichain && \
	sudo git clone --branch dc0.20.1.2 https://github.com/Le-Space/namecoin-core doichain-core && \
	cd doichain-core && \
	sudo ./autogen.sh && sudo ./configure --disable-tests  --disable-gui-tests && \
	sudo make && \
	sudo make install

#Copy start scripts
WORKDIR /home/doichain/scripts/
COPY entrypoint.sh entrypoint.sh
COPY start.sh start.sh
COPY getblocktimes.sh getblocktimes.sh
COPY doichain-start.sh doichain-start.sh

RUN sudo dos2unix \
	entrypoint.sh \
	start.sh \
	doichain-start.sh && \
	sudo chmod +x \
	entrypoint.sh \
	start.sh \
	doichain-start.sh \
	getblocktimes.sh && \
	sudo apt-get purge -y dos2unix && \
	sudo rm -rf /var/lib/apt/lists/*

#Create data dir
WORKDIR /home/doichain
RUN mkdir data && \
	cd data && \
	mkdir doichain &&\
	sudo rm -rf /home/doichain/.doichain && \
	sudo ln -s /home/doichain/data/doichain /home/doichain/.doichain

#Run entrypoint
WORKDIR /home/doichain
ENTRYPOINT ["scripts/entrypoint.sh"]

#Start doichain and meteor
CMD ["scripts/start.sh"]

#Expose ports
EXPOSE $NODE_PORT $RPC_PORT $RPC_PORT_REGTEST
