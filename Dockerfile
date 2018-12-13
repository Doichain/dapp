FROM doichain/docker:dapp-base
USER root
RUN  apt-get update && \
  apt-get install --no-install-recommends -y apt-utils python python-dev python-distribute python-pip wget curl \
#  xvfb xdg-utils libxtst6 libxss1 libxrender1 libxrandr2 libxi6 libxcursor1 libxcomposite1  libpango-1.0-0 libpangocairo-1.0-0 \
#  libpango-1.0-0 libnss3 libnspr4 libgtk-3-0 libglib2.0-0 libgdk-pixbuf2.0-0 libdbus-1-3 libcups2 fonts-liberation  \
#  libcairo2 libatspi2.0-0 libcups2 libdbus-1-3 libgdk-pixbuf2.0-0 libglib2.0-0 libnss3 libnspr4 libgtk-3-0 libatk1.0-0 \
#  libatk-bridge2.0-0 libasound2 libappindicator3-1 && \
  rm -rf /var/lib/apt/lists/* && \
  curl -sSL https://get.docker.com/ | sh

# Install Chrome https://discuss.circleci.com/t/installing-chrome-inside-of-your-docker-container/9067
#RUN wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb && \
# dpkg -i google-chrome-stable_current_amd64.deb && \
# apt-get -fy install && rm *.deb

ADD . /home/doichain/dapp
WORKDIR /home/doichain/dapp
RUN chown -R doichain:doichain /home/doichain/dapp
USER doichain
RUN git submodule init && git submodule update && \
 meteor npm install && meteor npm install --save bcrypt
# && \
# meteor build build/ --architecture os.linux.x86_64 --directory && \
# cd /home/doichain/dapp/build/bundle/programs/server && npm install &&  npm install --save bcrypt

#ENV DISPLAY=:99
#ADD ./contrib/scripts/docker-compose/start-regtest.sh .
#CMD ["./start-regtest.sh"]

#check lint with https://www.fromlatest.io/#/