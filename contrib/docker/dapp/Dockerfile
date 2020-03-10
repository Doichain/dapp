FROM jasdeepsingh/doichain-base:docker-base-image

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

#Install locales
RUN locale-gen ${OS_LOCALE}

ENV OS_LOCALE en_US.UTF-8
ENV LANG ${OS_LOCALE}
ENV LANGUAGE en_US:en

USER doichain



#Copy start scripts
WORKDIR /home/doichain/scripts/
COPY entrypoint.sh entrypoint.sh
COPY start.sh start.sh
COPY getblocktimes.sh getblocktimes.sh
COPY doichain-start.sh doichain-start.sh
COPY dapp-start.sh dapp-start.sh

RUN sudo dos2unix \
	entrypoint.sh \
	start.sh \
	doichain-start.sh && \
	sudo chmod +x \
	entrypoint.sh \
	start.sh \
	getblocktimes.sh \
	doichain-start.sh \
	dapp-start.sh && \
	sudo apt-get --purge remove -y dos2unix build-essential autoconf && \
	sudo rm -rf /var/lib/apt/lists/*

#Create data dir
WORKDIR /home/doichain
RUN mkdir data && \
	cd data && \
	mkdir doichain && \
	mkdir -p \
	dapp/local && \
	sudo rm -rf /home/doichain/.doichain \
	/home/doichain/dapp/.meteor/local && \
	sudo ln -s /home/doichain/data/doichain /home/doichain/.doichain && \
	sudo ln -s /home/doichain/data/dapp/local /home/doichain/dapp/.meteor

WORKDIR /home/doichain/dapp
RUN meteor build build/ --architecture os.linux.x86_64 --directory --server ${DAPP_HOST}:${DAPP_PORT} && \
    rm -rf node_modules

WORKDIR /home/doichain
ENTRYPOINT ["scripts/entrypoint.sh"]

#Start doichain and meteor
CMD ["/home/doichain/scripts/start.sh"]

#Expose ports
EXPOSE $DAPP_PORT $NODE_PORT $RPC_PORT
