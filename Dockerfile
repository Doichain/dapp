FROM doichain/dapp-base
USER doichain
WORKDIR /home/doichain/dapp
RUN sudo chown -R doichain:doichain /home/doichain/dapp && \
git clone https://github.com/Doichain/dapp.git /home/doichain/dapp --depth=1 --branch=0.0.6 && \
cd /home/doichain/dapp && git submodule init && git submodule update && \
meteor npm install && meteor npm install --save bcrypt && \
meteor build build/ --architecture os.linux.x86_64 --directory && \
cd /home/doichain/dapp/build/bundle/programs/server && npm install &&  npm install --save bcrypt
