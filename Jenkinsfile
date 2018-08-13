node {
    checkout scm
    def emailRecipient='nico@doichain.org'
    def METEOR_IP='5.9.154.231'
    def ALICE_NODE_PORT=18543
    def BOB_NODE_PORT=18544

    // Bob's node should use this reg-test (for DNS-TXT doichain-testnet-opt-in-key)
    // address: mthu4XsqpmMYsrgTore36FV621JWM3Epxj
    // publicKey: 0259daba8cfd6f5e404d776da61421ffbbfb6f3720bfb00ad116f6054a31aad5b8
    // privateKey: cP3EigkzsWuyKEmxk8cC6qXYb4ZjwUo5vzvZpAPmDQ83RCgXQruj

    emailext to: emailRecipient,
        subject: "STARTED: Job ${env.JOB_NAME} ID:${env.BUILD_ID} [${env.BUILD_NUMBER}]",
        body:  "STARTED: Job ${env.JOB_NAME} Build:[${env.BUILD_NUMBER}]:Check console output at ${env.PROMOTED_URL} ${env.JOB_NAME} [${env.BUILD_NUMBER}]",
        recipientProviders: [[$class: 'DevelopersRecipientProvider'], [$class: 'RequesterRecipientProvider']]

   // try {
        docker.image("mongo:3.2").withRun("-p 27018:27017"){
            docker.image("sameersbn/bind:latest").withRun("-it --dns=127.0.0.1 --name=bind --publish=53:53/udp --volume=/bind:/data --env='ROOT_PASSWORD=generated-password'") { b ->
                def BIND_IP = sh(script: "sudo docker inspect bind | jq '.[0].NetworkSettings.IPAddress'", returnStdout: true).trim()
                docker.image("doichain/node-only:latest").withRun("-it --name=alice -e REGTEST=true -e RPC_ALLOW_IP=::/0 -p ${ALICE_NODE_PORT}:18443 -e RPC_PASSWORD=generated-password -e DAPP_HOST=alice -e DAPP_SMTP_HOST=smtp -e DAPP_SMTP_USER=alice -e DAPP_SMTP_PASS='alice-mail-pw!' -e DAPP_SMTP_PORT=25 -e CONFIRM_ADDRESS=xxx -e DEFAULT_FROM='doichain@ci-doichain.org' --dns=${BIND_IP} --dns-search=ci-doichain.org") { c ->
                                 sh 'docker logs alice'
                                 sh './contrib/scripts/check-alice.sh'
                                 echo "running with doichain docker image alice"
                                 def BOBS_DOCKER_PARAMS = "-it --name=bob -e REGTEST=true -e RPC_ALLOW_IP=::/0 -p ${BOB_NODE_PORT}:18443 -e RPC_PASSWORD=generated-password -e RPC_HOST=bob -e DAPP_SMTP_HOST=smtp -e DAPP_SMTP_USER=bob -e DAPP_SMTP_PASS='bob-mail-pw!' -e DAPP_SMTP_PORT=25 -e CONFIRM_ADDRESS=xxx -e DEFAULT_FROM='doichain@ci-doichain.org' --dns=${BIND_IP} --dns-search=ci-doichain.org";
                                 echo BOBS_DOCKER_PARAMS
                                 docker.image("doichain/node-only:latest").withRun(BOBS_DOCKER_PARAMS) { c2 ->
                                        sh 'docker logs bob;sleep 10'
                                        sh "docker exec bob  sh -c 'sed -i.bak s/localhost:3000/${METEOR_IP}:4000/g /home/doichain/.doichain/doichain.conf && cat /home/doichain/.doichain/doichain.conf && /usr/local/bin/doichain-cli stop && sleep 10 && /usr/local/bin/doichaind -regtest'"
                                        sh 'sleep 5'
                                        sh './contrib/scripts/connect-alice.sh'
                                        sh 'sudo ./contrib/scripts/meteor-install.sh'

                                        sh 'sudo git submodule init && sudo git submodule update && sudo meteor npm install && sudo meteor npm install --save bcrypt && sudo meteor npm run lint && sudo meteor npm run test-jenkins-alice-mocha'
                                        echo "finished alice"
                                        sh 'sudo meteor npm run test-jenkins-bob-mocha'
                                        echo "finished bob"

                                  } //bobs node
                 } //alice node
            }//bind
       }//mongo
       emailext attachLog: true,
                          to: emailRecipient,
                          subject: "${currentBuild.currentResult}: Job ${env.JOB_NAME} ID:${env.BUILD_ID} [${env.BUILD_NUMBER}]",
                          body:  "${currentBuild.currentResult}: Job ${env.JOB_NAME} Build:[${env.BUILD_NUMBER}]:Check console output at ${env.PROMOTED_URL} ${env.JOB_NAME} [${env.BUILD_NUMBER}]",
                          recipientProviders: [[$class: 'DevelopersRecipientProvider'], [$class: 'RequesterRecipientProvider']]
   /* }catch(error){
           // echo "error: ${error}"
           emailext attachLog: true, to: emailRecipient,
                              subject: "${currentBuild.currentResult}: Job ${env.JOB_NAME} ID:${env.BUILD_ID} [${env.BUILD_NUMBER}]",
                              body:  "${currentBuild.currentResult}: Job ${env.JOB_NAME} Build:[${env.BUILD_NUMBER}]:Check console output at ${env.PROMOTED_URL} ${env.JOB_NAME} [${env.BUILD_NUMBER}]",
                              recipientProviders: [[$class: 'DevelopersRecipientProvider'], [$class: 'RequesterRecipientProvider']]

   }finally{

   } */

}

//https://medium.com/@gustavo.guss/jenkins-sending-email-on-post-build-938b236545d2
//https://stackoverflow.com/questions/41235165/jenkins-global-environment-variables-in-jenkinsfile
