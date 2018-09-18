FROM doichain/docker:dapp-base
USER doichain
ADD . /home/doichain/dapp
WORKDIR /home/doichain/dapp
RUN sudo chown -R doichain:doichain /home/doichain/dapp && \
git submodule init && git submodule update && \
meteor npm install && meteor npm install --save bcrypt && \
meteor build build/ --architecture os.linux.x86_64 --directory && \
cd /home/doichain/dapp/build/bundle/programs/server && npm install &&  npm install --save bcrypt
