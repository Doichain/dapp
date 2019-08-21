# Docker Installation Doichain Node and dApp

## preconditions for DOI-requester installing "Send - dApp"
- public IP-address and hostname (we recommend doichain.<your-domain.com>)
- ssl certificate for nginx for above stated domain
- prepare at least one email template for your DOI request email (if not provided, default is used)

#### in case you want to install a Doichain Double-Opt-In validator
- SMTP server for outgoing DOI-Emails 
- defaultFrom (z.B. doichain@your-domain.com)
- edit your DNS-Zone of <your-domain.com> (txt value with doichain public key)

## Hardware Requirements
- e.g. "Debian: 9 (Stretch) with 1 CPU, 2 GB RAM, 40 GB SSD"

## Installation
- setup your server and connect via ssh
- don't forget to activate a backup
- install docker as described https://docs.docker.com/install/linux/docker-ce/debian/ or copy step by step:
```bash
sudo apt-get update

apt-get install -y \
     apt-transport-https \
     ca-certificates \
     curl \
     gnupg2 \
     software-properties-common \
     git
curl -fsSL https://download.docker.com/linux/debian/gpg | sudo apt-key add -
apt-key fingerprint 0EBFCD88

add-apt-repository \
   "deb [arch=amd64] https://download.docker.com/linux/debian \
   $(lsb_release -cs) \
   stable"
   
apt-get update
apt-get install docker-ce
```

- create 'doinet' on docker
```bash
docker network create doinet
```

- start mongo (see: https://hub.docker.com/_/mongo)  (change the password!)
```bash
#for testnet
docker volume create doichain-testnet-db
#for mainnet
docker volume create doichain
docker run -d --network doinet --name mongo \
    -v doichain-testnet-db:/data/db \
    -e MONGO_INITDB_ROOT_USERNAME=admin \
    -e MONGO_INITDB_ROOT_PASSWORD=secret \
    mongo
```
- create a user on Mongo DB https://docs.mongodb.com/manual/tutorial/create-users/
```mongo
    use doichain
    db.createUser(
      {
        user: "doichain",
        pwd: "doichain",
        roles: [
           { role: "readWrite", db: "doichain" }
        ]
      }
    )
    
    use doichain-testnet
    db.createUser(
      {
        user: "doichain-testnet",
        pwd: "doichain-testnet",
        roles: [
           { role: "readWrite", db: "doichain-testnet" }
        ]
      }
    )
```

# start doichain image

```bash
 docker run -td --restart always --network doinet \
 --name=doichain-testnet --hostname=doichain-testnet   \
-e TESTNET=true \
-e MONGO_URL="mongodb://doichain-testnet:doichain-testnet@mongo:27017/doichain-testnet" \
-e DAPP_HOST=<ip-or-hostname.your-domain.org> \
-e DAPP_PORT=3000 \
-e HTTP_PORT=3000  \
-e DAPP_DOI_URL=http://localhost:3000/api/v1/debug/mail \
-e DAPP_SSL=false \
-e DAPP_DEBUG=true   \
-e DAPP_CONFIRM='true'  \
-e DAPP_SEND='true'  \
-e DAPP_VERIFY='true'  \
-e DEFAULT_FROM='reply@your-domain.com'  \
-e DAPP_SMTP_HOST=localhost  \
-e DAPP_SMTP_USER=doichain   \
-e DAPP_SMTP_PASS='doichain-mail-pw!'  \
-e DAPP_SMTP_PORT=25  \
-e RPC_USER=admin  \
-e RPC_PASSWORD=rpc-password  \
-e RPC_HOST=localhost  \
-p 3000:3000 -p 18338:18338 -p 18339:18339 \
-v doichain-testnet-data:/home/doichain/data  \
doichain/dapp-testnet:0.0.9.30

```
- check if dApp is running http://<ip-or-hostname>:3000
- change the admin password!
- install nginx ``apt-get update; apt-get install nginx``
- edit file ``vi /etc/nginx/sites-available/doichain``
```
upstream doichain {
    server 127.0.0.1:3000;
    keepalive 32;
}
server {
        listen 80;
        listen [::]:80;

        server_name <your-hostname-and-domain>;
        
        location / {
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_set_header Host $http_host;
                proxy_set_header X-NginX-Proxy true;
                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection "upgrade";
                proxy_pass http://doichain;
                proxy_redirect off;
        }
}
```
- link file ``ln -s /etc/nginx/sites-available/doichain /etc/nginx/sites-enabled/doichain``
- start nginx ``systemctl nginx start``
- check if nginx is running on port 80 
- install letsencrypt https://certbot.eff.org/

# Test
- Request your userId and authToken via curl -H "Content-Type: application/json" -X POST -d '{"username":"admin","password":"password"}' https://localhost/api/v1/login
- Request Double-Opt-In via curl -X POST -H "X-User-Id: xxxxxxx" -H "X-Auth-Token: yyyyyyyyyyyyyyy" -i "https://localhost/api/v1/opt-in?recipient_mail=<your-customer-email@example.com>&sender_mail=info@doichain.org"