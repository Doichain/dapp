# Setting up a Doichain Development Environment on testnet

1. Clone Repository ```git clone https://github.com/Doichain/dapp.git doichain-dapp; cd doichain-dapp/```
2. Start a Doichain Testnet node as described on https://github.com/Doichain/docker/tree/master/node-only
3. Install Meteor from meteor.com
4. Open a another terminal and start meteor 
    - ```meteor npm install```
    - configure settings-bob-json 'app.host' to your public ip or public hostname
    - configure RPC username and password of your Doichain Node (the one you setup or the one you can find inside doichain.conf inside the doichain nodes docker container ~/data/doichain/doichain.conf)
    - ```meteor run --settings settings-bob.json --port 4010```
5. GoTo http://localhost:4010 an change your admin password! 
6. (skip this step if you machine has a offical IP) Create an ssh tunnel ```ssh -R 4010:localhost:4010 you@your-public-remote-ssh-server``
7. Request Funding (Doichain Testnet coins) on our Telegram Group https://t.me/doichain
8. Test: Request your userId and authToken via ```curl -H "Content-Type: application/json" -X POST -d '{"username":"admin","password":"password"}' http://localhost:4010/api/v1/login```
9. Test: Request Double-Opt-In via ```curl -X POST -H "X-User-Id: xxxxxxx" -H "X-Auth-Token: yyyyyyyyyyyyyyy" -i "http://localhost:4010/api/v1/opt-in?recipient_mail=<your-customer-email@example.com>&sender_mail=info@doichain.org"```