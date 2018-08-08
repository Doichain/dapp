pipeline {
    agent {
        docker {
            image 'ubuntu'
            args '-u root:root'
            }
        }
    stages {
        stage('build') {

            def startNode = { cmd ->
                    docker.image("doichain/node-only").withRun("-d -i  -e REGTEST=true -e RPC_ALLOW_IP=::/0 -p 18445:18445 -p 18443:18443 -e DAPP_DEBUG=true -e DAPP_CONFIRM='true' -e DAPP_VERIFY='true' -e DAPP_SEND='true' -e RPC_USER=admin -e RPC_PASSWORD=generated-password -e RPC_HOST=localhost -e DAPP_HOST=your-domain-name-or-ip -e DAPP_SMTP_HOST=localhost -e DAPP_SMTP_USER=doichain -e DAPP_SMTP_PASS='doichain-mail-pw!' -e DAPP_SMTP_PORT=25 -e CONFIRM_ADDRESS=xxx --name=alice --hostname=${cmd}") { c ->
                       // sh "docker exec ${c.id} ${cmd}"
                    }
            }

            parallel (
                    "Bind9":{
                        /*sh "docker run -d --name=bind \
                                          --publish=53:53/udp \
                                          --publish=10000:10000 \
                                          --volume=/bind:/data \
                                          --env='ROOT_PASSWORD=generated-password' \
                                          sameersbn/bind:latest"*/
                    },
                    "Alice doichain node" : {
                            startNode "alice"
                    },
                    "Bob doichain node" : {
                            startNode "bob"
                    },
                    "Meteor":{
                            sh "apt-get update; apt-get install -y git sudo curl python jq g++ build-essential"
                            sh "sh 'curl https://install.meteor.com | /bin/sh;git submodule init;git submodule update;meteor npm install; meteor npm run lint;meteor npm run test-jenkins-mocha'
                    }
            )
            steps {

               // sh "ALICE_DOCKER_IP=\$(sudo docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' alice) \
                 //   echo 'alice has internal IP starting and connecting bob`s node too:'$ALICE_DOCKER_IP \
                  //  docker run -d -i -e CONNECTION_NODE=$ALICE_DOCKER_IP -e REGTEST=true -e RPC_ALLOW_IP=::/0 -p 18446:18445 -p 18444:18443 -e DAPP_DEBUG=true -e DAPP_CONFIRM='true' -e DAPP_VERIFY='true' -e DAPP_SEND='true' -e RPC_USER=admin -e RPC_PASSWORD=generated-password -e RPC_HOST=localhost -e DAPP_HOST=your-domain-name-or-ip -e DAPP_SMTP_HOST=localhost -e DAPP_SMTP_USER=doichain -e DAPP_SMTP_PASS='doichain-mail-pw!' -e DAPP_SMTP_PORT=25 -e CONFIRM_ADDRESS=xxx --name=bob --hostname=bob doichain/node-only"

            }
        }
    }
}