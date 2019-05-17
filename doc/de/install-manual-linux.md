# Manuelle Installation Doichain Node und dApp (Linux)

Dieses Dokument beschreibt die Installation eines Doichain Nodes und einer Doichain dApp. 
Für gewöhnlich gibt es derzeit zwei Hauptbeweggründe warum man das tun möchte:

1. **Emailmarketing-Unternehmen und E-Commerce Webseiten**, 
    die ihren Kunden **qualifizierte Double-Opt-Ins** bieten wollen, 
    installieren eine Doichain dApp und konfigurieren den **"Send-Mode"**
2. **ISP's / Unternehmen mit eigenem Mailserver** die "Double-Opt-Ins" für Ihre Kunden **selbst bestätigen wollen** 
    und ihren **SMTP-Filter** oder Spam-Filter die **Doichain-Whiteliste** abfragen lassen wollen, konfigurieren den Confirm-Mode bzw. den Verify-Mode.

Dieses Dokument beschreibt die volle Doichain Installation im **Send-Mode, Confirmation-Mode und Verify-Mode**

## Vorraussetzungen (notwendige Informationen bevor sie mit der Konfiguration beginnen) 
- Server z.B. Debian/Ubuntu: 18.04, 1 CPU, 2 GB RAM, 20 GB SSD
- Hostname / DNS-Eintrag: https://doichain.your-domain.com
- SSL-Zertifikat für doichain.your-domain.com (z.B: Letsencrypt)
- Doicoin (DOI) (via https://bisq.network)
- nur Send-dApp: 
    - Default Email-Template zum Versand an den Emailempfänger eines Double-Opt-In Requests
- nur Confirm-dApp
    - Konfiguration SMTP-Server für ausgehende Mails (nur für DOI-Bestätigung) 
    - DNS Konfiguration  (Doichain DNS-TXT Attribut der Empfänger-Email-Domain)
    - Standard-Email-Absender (defaultFrom) beim Versenden des Doi-Requests: e.g. doichain@your-domain.com 
    - Eine Doichain-Addresse (über offline Wallet generieren oder via doichain-cli newaddress)

## Vorgehensweise Installation
- ``ssh neue-server-ip``
- Backup einschalten (für Datenbank der lokalen dApp als auch für die Konfiguration wichtig)
### Doichain Node installieren:
- ``apt-get update`` ausführen
- ``apt-get install autoconf automake apt-utils bsdmainutils build-essential curl jq vim bc bsdtar git libboost-all-dev libevent-dev libssl-dev libtool locales pkg-config sudo``
- add doichain user: ``adduser --disabled-password --gecos '' doichain``
- ``adduser doichain sudo``
- ``echo '%sudo ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers``
- ``su doichain``
- Installation Berkley-DB:
```
cd /usr/src; sudo wget http://download.oracle.com/berkeley-db/db-4.8.30.NC.tar.gz;
sudo tar xzvf db-4.8.30.NC.tar.gz
cd db-4.8.30.NC/build_unix/
sudo ../dist/configure --enable-cxx && sudo make
sudo make install
sudo ln -s /usr/local/BerkeleyDB.4.8 /usr/include/db4.8
sudo ln -s /usr/include/db4.8/include/* /usr/include
sudo ln -s /usr/include/db4.8/lib/* /usr/lib
```

- Doichain core clonen und installieren:
```
cd
git clone https://github.com/Doichain/core.git doichain-core \
cd doichain-core &&  ./autogen.sh && ./configure --without-gui  --disable-tests  --disable-gui-tests CXXFLAGS="--param ggc-min-expand=1 --param ggc-min-heapsize=32768" 
make \
sudo make install
```
- Start/Stop Script für Doichaind erstellen 
```
sudo wget https://raw.github.com/frdmn/service-daemons/master/debian -O /etc/init.d/doichaind
sudo vi /etc/init.d/doichaind
sudo chmod +x /etc/init.d/doichaind
sudo update-rc.d doichaind defaults
service doichaind start
```
- Logfile Rotation einschalten für debug.log 
- Passwort für RPC-Zugriff generieren z.B. mit: xxd -l 30 -p /dev/urandom
- Konfigurationsdatei doichain.conf im Verzeichnis /home/doichain/.doichain/ erstellen:
```
daemon=1
txindex=1
server=1        
rpcuser=admin
rpcpassword=<bitte hier gerade generiertes Passwort einsetzen>
rpcallowip=127.0.0.1
walletnotify=curl -X GET http://localhost:3000/api/v1/walletnotify?tx=%s
```

### Doichain dApp installieren
- meteor installieren: ``sudo curl https://install.meteor.com/ | sh``
```
git clone https://github.com/Doichain/dApp.git dapp \
cd dapp \
git submodule init && sudo git submodule update \
meteor npm install && meteor npm install --save bcrypt
```
- Doichain Adresse generieren: 
```
doichain-cli getnewaddress
```
- Pubkey von Doichain Adresse herausfinden 
```
doichain-cli validateaddress <doichain-adresse-von-gerade-eben>
```
- doichain-opt-in-key=your-doichain-public-key in DNS aufnehmen (TXT value)
- doichain-opt-in-provider=<your domain> 
- settings.json file mit folgendem Inhalt konfigurieren (<Markierungen-bitte anpassen>)

```json
{
    "app":
    {
        "debug": "true",
        "host": "<your-public-ip-or-hostname>",
        "port": "80",
        "types": ["send", "confirm", "verify"]
    },
    "send":
    {
        "doiMailFetchUrl": "http://localhost:3000/api/v1/debug/mail",
        "doichain":
        {
            "host": "localhost",
            "port": "8339",
            "username": "admin",
            "password": "<use-the-long-generated-rpc-password-here>"
        }
    },
    "confirm":
    {
        "doichain":
        {
            "host": "localhost",
            "port": "8339",
            "username": "admin",
            "password": "<use-the-long-generated-rpc-password-here>",
            "address": "<your-doichain-address>"
        },
        "smtp":
        {
            "username": "<username>",
            "password": "<password>",
            "server": "<smtp-host-ip-or-host>",
            "port": "25",
            "defaultFrom": "sender-of-doi-request@your-email-domain.com",
            "NODE_TLS_REJECT_UNAUTHORIZED":0
        }
    },
    "verify":
    {
        "doichain":
        {
            "host": "localhost",
            "port": "8339",
            "username": "admin",
            "password": "<use-the-long-generated-rpc-password-here>"
        }
    }
}
```
- Start/Stop Scripte erstellen:
```
sudo wget https://raw.github.com/frdmn/service-daemons/master/debian -O /etc/init.d/doichain-dApp
sudo vi /etc/init.d/doichain-dApp
sudo chmod +x /etc/init.d/doichain-dApp
sudo update-rc.d doichain-dApp defaults
sudo service doichain-dApp start
```
- Default admin-userser nach dem login in http://localhost:3000 ändern
- Ngnix installieren `sudo apt-get install nginx`
- Installiere die Datei /etc/nginx/sites-available/doichain.<your-domain> mit folgendem Inhalt:

```
upstream doichain.<your-domain> {
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
                proxy_pass http://doichain.<your-domain>;
                proxy_redirect off;
        }
}
```

- Ausführen: ``ln -s /etc/nginx/sites-available/doichain.<your-domain> /etc/nginx/sites-enabled/doichain.<your-domain>``
- ``service nginx restart``
- SSL über Letsencrypt.org bzw. https://certbot.eff.org/
- Restart Server
- Log file Rotierung einschalten
- Confirm dApp - default Email Template Confirm-DOI ändern 
    - default im Verzeichnis: ./dapp/server/api/rest/imports/debug.js Template und Redirect ändern
    - oder für jeden User einzeln via REST: 

## Installations Test
- Test Send dApp
    - Dapp benötigt Funding (DOI)! Bitte informieren auf www.doichain.org bzw. Doi über http://bisq.network erwerben!
    - Doichain-Addresse auf dem Node von Alice generieren ``doichain-cli getnewaddress``
    - Anmelden und Authentifizieren an REST-API
```curl -H "Content-Type: application/json" -X POST -d '{"username":"admin","password":"password"}' http://<ip-or-hostname>:3000/api/v1/login```
    - Double-Opt-In anfordern
```curl -X POST -H "X-User-Id: xxxxxxx" -H "X-Auth-Token: yyyyyyyyyyyyyyy" -i "http://<your-ip-or-hostname>:3000/api/v1/opt-in?recipient_mail=<your-customer-email@example.com>&sender_mail=info@doichain.org"```
    - Posteingang von Bob - Email bestätigen
    - http://localhost:3000 - als admin einloggen und überprüfen ob DOI bestätigt wurde
    - DOI verifzieren via REST-API
    - DOI exportieren via REST-API