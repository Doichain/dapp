node {
    notifyStarted()
    checkout scm
    def emailRecipient='nico@doichain.org'
    // Bob's node should use this reg-test (for DNS-TXT doichain-testnet-opt-in-key)
    // address: mthu4XsqpmMYsrgTore36FV621JWM3Epxj
    // publicKey: 0259daba8cfd6f5e404d776da61421ffbbfb6f3720bfb00ad116f6054a31aad5b8
    // privateKey: cP3EigkzsWuyKEmxk8cC6qXYb4ZjwUo5vzvZpAPmDQ83RCgXQruj

    docker.image("sameersbn/bind:latest").withRun("-it --dns=127.0.0.1 --name=bind --publish=53:53/udp --volume=/bind:/data --env='ROOT_PASSWORD=generated-password'") { b ->
        def BIND_IP = sh(script: "sudo docker inspect bind | jq '.[0].NetworkSettings.IPAddress'", returnStdout: true).trim()
        docker.image("doichain/node-only").withRun("-it --name=alice -e REGTEST=true -e RPC_ALLOW_IP=::/0 -p 18543:18443 -e RPC_PASSWORD=generated-password -e DAPP_HOST=alice -e DAPP_SMTP_HOST=smtp -e DAPP_SMTP_USER=alice -e DAPP_SMTP_PASS='alice-mail-pw!' -e DAPP_SMTP_PORT=25 -e CONFIRM_ADDRESS=xxx -e DEFAULT_FROM='doichain@ci-doichain.org' --dns=${BIND_IP} --dns-search=ci-doichain.org") { c ->
                         sh 'docker logs alice'
                         sh './contrib/scripts/check-alice.sh'
                         echo "running with doichain docker image alice"
                         docker.image("doichain/node-only").withRun("-it --name=bob -e REGTEST=true -e RPC_ALLOW_IP=::/0 -p 18544:18443 -e RPC_PASSWORD=generated-password -e RPC_HOST=bob -e DAPP_SMTP_HOST=smtp -e DAPP_SMTP_USER=bob -e DAPP_SMTP_PASS='bob-mail-pw!' -e DAPP_SMTP_PORT=25 -e CONFIRM_ADDRESS=xxx -e DEFAULT_FROM='doichain@ci-doichain.org' --dns=${BIND_IP} --dns-search=ci-doichain.org") { c2 ->
                                sh 'docker logs bob'
                                sh 'sleep 5'
                                //sh 'docker exec bind ping alice -c2'
                                //sh 'docker exec bind ping bob -c2'
                                //sh 'docker exec alice ping bob -c2'
                                //sh 'docker exec alice ping alice -c2'
                                sh './contrib/scripts/connect-alice.sh'
                                sh 'sudo ./contrib/scripts/meteor-install.sh'
                                sh 'sudo git submodule init;sudo git submodule update;sudo meteor npm install;sudo meteor npm run lint;sudo meteor npm run test-jenkins-alice-mocha'
                                echo "finished alice"
                                jobFinished()
                          }
         }
    }
}
//https://stackoverflow.com/questions/41235165/jenkins-global-environment-variables-in-jenkinsfile
def notifyStarted() {
   emailext to: 'nico@le-space.de',
   subject: 'STARTED: Job ${env.JOB_NAME} [${env.BUILD_ID}]',
   body:  '${params}<p>STARTED: Job ${env.JOB_NAME} [${env.BUILD_NUMBER}]:</p><p>Check console output at <a href="${env.JENKINS_URL}">${env.JOB_NAME} [${env.BUILD_NUMBER}]</a></p>',
   recipientProviders: [[$class: 'DevelopersRecipientProvider'], [$class: 'RequesterRecipientProvider']]

        /*subject: 'test',
        body: "<p>STARTED: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]':</p>
             <p>Check console output at <a href="${env.BUILD_URL}">${env.JOB_NAME} [${env.BUILD_NUMBER}]</a></p>",
        recipientProviders: [[$class: 'DevelopersRecipientProvider'], [$class: 'RequesterRecipientProvider']], to: emailRecipient*/
}

def jobFinished() { //https://medium.com/@gustavo.guss/jenkins-sending-email-on-post-build-938b236545d2
    /* emailext
        subject: 'STARTED: Job ${env.JOB_NAME} [${env.BUILD_NUMBER}]',
        body: "${currentBuild.currentResult}: Job ${env.JOB_NAME} build ${env.BUILD_NUMBER}\n More info at: ${env.BUILD_URL}",
        recipientProviders: [[$class: 'DevelopersRecipientProvider'], [$class: 'RequesterRecipientProvider']], to: 'nico@le-space.de'*/
}