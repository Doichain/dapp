# Setting up a Doichain Development Environment on testnet  manually

1. Clone Repository ```git clone https://github.com/Doichain/dapp.git doichain-dapp; cd doichain-dapp/```
2. In case you install on an unofficial IP, you maybe want to create a tunnel to a public available server so testnet dApps can communicate with your local Doichain dApp 
```ssh -R 4010:localhost:4010 you@your-public-remote-ssh-server```
3. Start a Doichain Testnet node as described on https://github.com/Doichain/docker/tree/master/node-only
```sh docker run -it -e TESTNET=true -e DAPP_URL=http://<public-ip-or-hostname>:4010 -p 18339:18339 -e RPC_PASSWORD=<rpc-password> --name doichain-testnet doichain/node-only```
4. Install Meteor from meteor.com
5. Open a another terminal and start meteor 
    - ```meteor npm install```
    - configure settings-testnet.json 'app.host' to your public ip or public hostname
    - configure settings-testnet.json  RPC username and password of your Doichain Node (the one you setup or the one you can find inside doichain.conf inside the doichain nodes docker container ~/data/doichain/doichain.conf)
    - configure settings-testnet.json Validation Node (formally known as "confirmation node") configure smtp-settings 
    - ```meteor run --settings settings-testnet.json --port 4010``` or run 
      ```TEST_METEOR_SETTINGS=$(sed -e "s/\${host}/<public-ip-or-hostname>/" -e "s/\${password}/generated-password/" contrib/settings/settings-testnet.json) meteor run --port 4010```
6. GoTo http://localhost:4010 an change your admin password! 
7. Get your Doichain-Address from dApp webfrontend or via ```docker exec -it doichain-testnet doichain-cli getaddressesbyaccount ''```
8. Request Funding (Doichain Testnet coins) on our Telegram Group https://t.me/doichain
9. Test: Request your userId and authToken via ```curl -H "Content-Type: application/json" -X POST -d '{"username":"admin","password":"password"}' http://localhost:4010/api/v1/login```
10. Test: Request Double-Opt-In via ```curl -X POST -H "X-User-Id: xxxxxxx" -H "X-Auth-Token: yyyyyyyyyyyyyyy" -i "http://localhost:4010/api/v1/opt-in?recipient_mail=<your-customer-email@example.com>&sender_mail=info@doichain.org"```