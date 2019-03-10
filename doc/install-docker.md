# Docker Installation Doichain Node und dApp
## Vorraussetzungen
- Hostname für die dapp bzw. node: z.B. doichain.<ihre-domain.de>
- SMTP-Server für ausgehende Emails (nur bei confirm dApp) 
- SMTP-Server defaultFrom (nur bei confirm dApp) 
- DNS-Konfiguration. 
- Email Template (nur für Send-dApp)
- Doichain-Adresse bzw. PublicKey (für DNS)
- SSL-Zertifikat
- Minimal-Konfiguration
    - Cloud-Server mit "Debian: 9 (Stretch), 1 CPU, 2 GB RAM, 20 GB SSD" z.B. über Hetzner bzw. Nessus (Wien)
- Zugang über SSH-Key
- ``ssh <neue-server-ip>``
- Backup einschalten
- Docker Installieren nach Beschreibung: https://docs.docker.com/install/linux/docker-ce/debian/
- ``sudo apt-get update``
- ``apt-get install -y \
     apt-transport-https \
     ca-certificates \
     curl \
     gnupg2 \
     software-properties-common \
     git``
- ``curl -fsSL https://download.docker.com/linux/debian/gpg | sudo apt-key add -``
- ``apt-key fingerprint 0EBFCD88``
- ``add-apt-repository \
   "deb [arch=amd64] https://download.docker.com/linux/debian \
   $(lsb_release -cs) \
   stable"``
- ``apt-get update``
- ``sudo apt-get install docker-ce``
- ``Generate Doichain-Address and PrivateKey https://walletgenerator.net/?currency=NameCoin ``
- ``docker run -td --restart always -e DAPP_DEBUG=true -e DAPP_CONFIRM='true' -e DAPP_VERIFY='true' -e DAPP_SEND='true' -e RPC_USER=admin -e RPC_PASSWORD=rpc-password -e RPC_HOST=localhost -e DAPP_HOST=your-dapp-hostname+domain-name-or-ip -e DAPP_SMTP_HOST=localhost -e DAPP_SMTP_USER=doichain -e DAPP_SMTP_PASS='doichain-mail-pw!' -e DAPP_SMTP_PORT=25 -e CONFIRM_ADDRESS=previously-generated-doichain-address -e DEFAULT_FROM='reply@your-domain.com' -p DAPP_HTTP_PORT 3000:3000 -p PORT 8339:8338 -p RPC_PORT 8339:8339 -v doichain_PROJEKTNAME:/home/doichain/data --name=doichain_PROJEKTNAME --hostname=doichain_PROJEKTNAME -i doichain/dapp``
# Run Example sendApp (alice) only
- ``docker run -td --restart always -e DAPP_DEBUG=true -e DAPP_SEND='true' -e RPC_USER=admin -e RPC_PASSWORD=<choose password> -e RPC_HOST=localhost -e DAPP_HOST=<your-hostname> -p 3000:3000 -p 8338:8338 -p 8339:8339 -v doichain_<name>@:/home/doichain/data --name=doichain_<name> --hostname=doichain_<name> -i doichain/dapp``
- ``WatchTower installieren (Automatische Updates)  https://github.com/v2tec/watchtower``
- Automatisches Update der Docker Container: ``docker run -d \
  --name watchtower \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -e WATCHTOWER_NOTIFICATIONS_LEVEL=debug \
  -e WATCHTOWER_NOTIFICATIONS=email \
  -e WATCHTOWER_NOTIFICATION_EMAIL_FROM=<doichain@your-domain.com> \
  -e WATCHTOWER_NOTIFICATION_EMAIL_TO=<doichain@your-domain.com> \
  -e WATCHTOWER_NOTIFICATION_EMAIL_SERVER=<smtp-server> \
  -e WATCHTOWER_NOTIFICATION_EMAIL_SERVER_USER=<your-username> \
  -e WATCHTOWER_NOTIFICATION_EMAIL_SERVER_PASSWORD=<your-password> \
  v2tec/watchtower``