# doichain/docker
## a docker image for the Doichain environment http://www.doichain.org

### Usage
  - ``git clone https://github.com/Doichain/docker.git doichain-docker; cd doichain-docker``
  - run a testnet node ``make testnet-[my-doichain] HTTP_PORT=81 PORT=18338 RPC_PORT=18339``
  - run a testnet network with alice and bob ``make test_testnet``
  - run a regtest node run ``make regtest-[my-doichain] HTTP_PORT=81 PORT=18338 RPC_PORT=18339``
  - run a regtest network wiht aliceand bob ```maek test_regtest``
  - run ``docker attach testnet-[my-doichain]`` in order to connect to your docker container
  - run inside the docker container: ``tail -f /home/doichain/.doichain/testnet/debug.log`` in order to watch blockchain download
  - run ``doichain-cli getnewaddress`` and send your testnet address to testnet@doichain.org with subject "send me money"


### Installation Send - dApp
1. Install ``docker run -it --rm -e DAPP_SEND='true' -p 3000:3000  doichain/dapp:v0.0.9.73``
2. Get auth token with: ``curl -H "Content-Type: application/json" -X POST -d '{"username":"admin","password":"password"}' http://localhost:3000/api/v1/login``

    Output should be something like:

    ```
    {
      "status": "success",
      "data": {
        "authToken": "Y1z8vzJMo1qqLjr1pxZV8m0vKESSUxmRvbEBLAe8FV3",
        "userId": "a7Rzs7KdNmGwj64Eq"
    }
    ```

3. Give your Send - dAPP some funding: (during alpha test, please send your doichain address to funding@doichain.org)
4. DOI-Request
Take the **authToken** and **userId** from above and paste it into the appropriate header fields below.
```
curl -X POST -H 'X-User-Id: a7Rzs7KdNmGwj64Eq' -H 'X-Auth-Token: Y1z8vzJMo1qqLjr1pxZV8m0vKESSUxmRvbEBLAe8FV3' -i 'http://SEND_DAPP_HOST:3000/api/v1/opt-in?recipient_mail=<your-customer-email@example.com>&sender_mail=info@doichain.org'
```

    Output should be:
    ```
      {
      "status": "success",
      "data": {
        "message": "Opt-In added. ID: SyXPehQz6utWnacRa"
      }
    ```


### Installation Confirmation - dApp
1. Install ``docker run --name=doichain-<your-host> --hostname=doichain-<your-host> -it --rm -e DAPP_CONFIRM='true' -e DAPP_VERIFY='true' -e DAPP_SEND='true' -e RPC_USER='admin' -e RPC_PASSWORD='<your-password>' -e RPC_HOST=localhost -e DAPP_HOST=<dAppHostFromTheInternet:Port> -e DAPP_SMTP_HOST=<smtp-host> -e DAPP_SMTP_USER=<smtp-username> -e DAPP_SMTP_PASS=<smtp-password> -e DAPP_SMTP_PORT=25 -p 3000:3000 -p 8338:8338 -v doichain.org:/home/doichain/data doichain/dapp:latest``

2. Update the DNS of your mail domain(s) :
   1. Connect to your running docker container via ``docker ps`` and ``docker attach <your-cointainer>``
   2. list your accounts with ``doichain-cli listaccounts``
   3. get the account address of your account ``doichain-cli getaccountaddress ""`` or use:``doichain-cli getaddressesbylabel ""``
   4. get the ``pubkey`` from ``doichain-cli validateaddress <your-address>``
   5. add a **TXT** field ``doichain-opt-in-provider:<your-email-domain e.g. doichain.org>``
   6. add a **TXT** field ``doichain-opt-in-key:<your pubkey from above> ``
   7. exit your docker cointainer
   8. start docker container again with an additional environment variable ``-e CONFIRM_ADDRESS=<your-address>`` (or modify `/home/doichain/data/dapp/settings.json ``) which is the address of you found under 2.3
3. check if your blockchain receive blocks with: ``doichain-cli getblockcount``
4. check your balance with ``doichain-cli getbalance`` (send some coins with ``doichain-cli sendtoaddress ``)

### Installation Verify - dApp
2. ``docker run --name=doichain-<your-host> --hostname=doichain-<your-host> -it --rm -e DAPP_CONFIRM='true' -e DAPP_VERIFY='true' -e DAPP_SEND='true' -e RPC_USER='admin' -e RPC_PASSWORD='<rpc-password>' -e RPC_HOST=localhost -e DAPP_HOST=<dAppHostFromTheInternet:Port> -e DAPP_SMTP_HOST=<smtp-host> -e DAPP_SMTP_USER=<smtp-username> -e DAPP_SMTP_PASS=<smtp-password> -e DAPP_SMTP_PORT=25 -p 3000:3000 -p 8338:8338 -v doichain.org:/home/doichain/data  doichain/dapp:latest``


### Pitfalls and possible errors
1. Authentication of dApp (REST-API) needs correct auth token and user id. Get it and correct authentication!
2. Doi gets successful accepted by REST interface and appears in the dapps web frontend but nothing else happens. (connect to the docker container and check for errors)
2.2 no coins in the wallet - get some fund and send to an address of your dApp in send mode
2.3 configure mail account (mail server, username, password) server for confirm dapp
3. confirmation link shows localhost and not correct url of dapp (e.g. http://dapp.doichain.org)
4. DOI-Request Email doesn't loook beatiful or should look differently. Please change template and data in server/api/rest/imports/debug.js
5. DOI-Request Email has wrong sender email address. Please change template and data in server/api/rest/imports/debug.js
6. Confirmation email is not send out. Enable type 'confirm' (and maybe 'verify') in /home/doichain/data/dapp/settings.json
