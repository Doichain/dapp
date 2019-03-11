#Doichain Docker installation:

docker rm doichain-ub
docker volume rm doichain.ub.de
docker run --name=doichain-ub --hostname=doichain-ub -it -e DAPP_VERIFY='true' -e DAPP_SEND='true' -e RPC_USER='admin' -e RPC_PASSWORD='xyz2019!' -e RPC_HOST=localhost -e DAPP_HOST=doichain.unitedbase.de:80 -e DAPP_SMTP_HOST=smtp.unitedbase.de -e DAPP_SMTP_USER=doichain-info -e DAPP_SMTP_PASS=doichain-info-xyz2019! -e DAPP_SMTP_PORT=25 -p 80:3000 -p 8338:8338 -v doichain-ub:/home/doichain/data doichain/dapp:latest

#Login 
curl -H "Content-Type: application/json" -X POST -d '{"username":"username","password":"password"}' http://localhost:3000/api/v1/login

#Doi Request:
curl -X POST -H 'X-User-Id: a7Rzs7KdNmGwj64Eq' -H 'X-Auth-Token: Y1z8vzJMo1qqLjr1pxZV8m0vKESSUxmRvbEBLAe8FV3' -i 'http://SEND_DAPP_HOST:3000/api/v1/opt-in?recipient_mail=<your-customer-email@example.com>&sender_mail=info@doichain.org'
