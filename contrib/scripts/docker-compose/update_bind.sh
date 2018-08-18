#!/bin/bash

NOW=$(date +%s)
MAIL_IP=172.20.0.4
BIND_IP_LASTPART=5
ALICE_IP=172.20.0.6
BOB_IP=172.20.0.7
echo "updating bind serial: $NOW with: IP: $BIND_IP_LASTPART"

apt-get update
apt-get install -y wget iputils-ping

#get new named.conf.local from git - update IP-Address, rename file.
wget -N --directory-prefix=/data/bind/etc/ https://raw.githubusercontent.com/doichain/dapp/0.0.6/contrib/scripts/bind/named.conf.local
sed -i.bak s/x.0.17.172./${BIND_IP_LASTPART}.0.20.172./g /data/bind/etc/named.conf.local
sed -i.bak s/172.17.0.x./172.20.0.${BIND_IP_LASTPART}./g /data/bind/etc/named.conf.local
chown bind.bind /data/bind/etc/*

#process .rev file of ci-doichain.org dns zone
wget -N --directory-prefix=/data/bind/lib/ https://raw.githubusercontent.com/doichain/dapp/0.0.6/contrib/scripts/bind/172.17.0.x.rev
sed -i.bak s/x.0.17.172./${BIND_IP_LASTPART}.0.20.172./g /data/bind/lib/172.17.0.x.rev
mv /data/bind/lib/172.17.0.x.rev  /data/bind/lib/172.20.0.${BIND_IP_LASTPART}.rev
sed -i.bak s/_serial_/${NOW}/g /data/bind/lib/172.20.0.${BIND_IP_LASTPART}.rev

#process hosts file of ci-doichain.org dns zone
wget -N --directory-prefix=/data/bind/lib/ https://raw.githubusercontent.com/doichain/dapp/0.0.6/contrib/scripts/bind/ci-doichain.org.hosts
sed -i.bak s/172.17.0.ns/172.20.0.${BIND_IP_LASTPART}/g /data/bind/lib/ci-doichain.org.hosts

#update bind with hostname of alice and bob
sed -i.bak s/172.17.0.alice/${ALICE_IP}/g /data/bind/lib/ci-doichain.org.hosts
sed -i.bak s/172.17.0.bob/${BOB_IP}/g /data/bind/lib/ci-doichain.org.hosts

#update bind with hostname of mail, update serial and reload bind
sed -i.bak s/172.17.0.mail/${MAIL_IP}/g /data/bind/lib/ci-doichain.org.hosts

sed -i.bak s/_serial_/${NOW}/g /data/bind/lib/ci-doichain.org.hosts
chown bind:bind /data/bind/lib/*
echo "search ci-doichain.org" >> /etc/resolv.conf
cat  /etc/resolv.conf
service bind9 restart
service bind9 status

named-checkzone ci-doichain.org /data/bind/lib/ci-doichain.org.hosts
named-checkzone 5.0.20.172.in-addr.arpa.in-addr.arpa. /data/bind/lib/172.20.0.${BIND_IP_LASTPART}.rev
#ls -l /data/bind/etc/
named-checkconf /etc/bind/named.conf
echo "name.conf ok"
cat /etc/bind/named.conf.local

cat /etc/resolv.conf
ls -l /var/lib/bind/

cat /var/lib/bind/172.20.0.${BIND_IP_LASTPART}.rev
cat /var/lib/bind/ci-doichain.org.hosts



ping -c 2 bind
ping -c 2 alice.ci-doichain.org
#ping -c 2 bob.ci-doichain.org
#ping -c 2 mail.ci-doichain.org
#ping -c 2 ns.ci-doichain.org
#ping -c 2 ci-doichain.org




#update meteor ip of bob for correct walletnotfify
#docker exec bob  sh -c 'sed -i.bak s/localhost:3000/${METEOR_IP}:4000/g /home/doichain/.doichain/doichain.conf && cat /home/doichain/.doichain/doichain.conf && /usr/local/bin/doichain-cli stop && sleep 10 && /usr/local/bin/doichaind -regtest'
#docker exec bind sh -c 'echo \"search ci-doichain.org\" >> /etc/resolv.conf'