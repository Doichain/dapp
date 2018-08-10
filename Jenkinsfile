node {
    checkout scm

    docker.image("doichain/node-only").withRun("-it --name=alice -e REGTEST=true -e RPC_ALLOW_IP=::/0 -p 18543:18443 -e RPC_PASSWORD=generated-password -e DAPP_HOST=alice -e DAPP_SMTP_HOST=smtp -e DAPP_SMTP_USER=alice -e DAPP_SMTP_PASS='alice-mail-pw!' -e DAPP_SMTP_PORT=25 -e CONFIRM_ADDRESS=xxx -e DEFAULT_FROM='reply@your-domain.com'") { c ->
                     sh 'docker logs alice'
                     sh './contrib/scripts/check-alice.sh'
                     echo "running with doichain docker image alice"
                     docker.image("doichain/node-only").withRun("-it --name=bob -e REGTEST=true -e RPC_ALLOW_IP=::/0 -p 18544:18443 -e RPC_PASSWORD=generated-password -e RPC_HOST=bob -e DAPP_SMTP_HOST=smtp -e DAPP_SMTP_USER=bob -e DAPP_SMTP_PASS='bob-mail-pw!' -e DAPP_SMTP_PORT=25 -e CONFIRM_ADDRESS=xxx -e DEFAULT_FROM='reply@your-domain.com'") { c2 ->
                                        sh 'docker logs bob'
                                        sh 'sudo ./contrib/scripts/meteor-install.sh'
                                        sh 'sudo git submodule init;sudo git submodule update;sudo meteor npm install;sudo meteor npm run lint;sudo meteor npm run test-jenkins-alice-mocha'
                                        echo "finished alice"

                      }
     }
}