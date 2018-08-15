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
        docker.image("mongo:3.2").withRun("--rm -p 27018:27017"){

          //check webmin   (root. generated-password - or env=ROOT_PASSWORD) https://x.x.x.x:10000/
          docker.image("sameersbn/bind:latest").withRun("-it --dns=127.0.0.1 --name=bind --publish=53:53/udp --publish 10000:10000/tcp --env='ROOT_PASSWORD=generated-password'") { b -> // --volume=/var/jenkins/bind/:/data
            def BIND_IP = sh(script: "sudo docker inspect bind | jq '.[0].NetworkSettings.IPAddress'", returnStdout: true).trim().replaceAll("\"", "")
            def BIND_IP_LASTPART = BIND_IP.substring(BIND_IP.lastIndexOf('.')+1,BIND_IP.length())

                //check webmin (admin:x) https://x.x.x.x:8443/
                //doku: https://bitbucket.org/esminis/mailserver https://hub.docker.com/r/esminis/mail-server-postfix-vm-pop3d/
                docker.image("esminis/mail-server-postfix-vm-pop3d").withRun("-it --dns=${BIND_IP} --name=mail --hostname=mail -p 8443:8443 -p 25:25 -p 465:465 -p 995:995 "){ //-v /var/jenkins/tequila:/opt/tequila -v /var/jenkins/stunnel:/var/lib/stunnel4
                def MAIL_IP = sh(script: "sudo docker inspect mail | jq '.[0].NetworkSettings.IPAddress'", returnStdout: true).trim().replaceAll("\"", "")

                sh "docker cp ./contrib/scripts/tequila/. mail:/opt/tequila/domains/ && docker exec mail sh -c 'chown -R tequila:tequila /opt/tequila/domains && mkdir /var/spool/virtual/ci-doichain.org && chown tequila:tequila /var/spool/virtual/ci-doichain.org'"
                sleep 5
                    docker.image("doichain/node-only:latest").withRun("-it --name=alice -e REGTEST=true -e RPC_ALLOW_IP=::/0 -p ${ALICE_NODE_PORT}:18443 -e RPC_PASSWORD=generated-password -e DAPP_HOST=alice -e DAPP_SMTP_HOST=smtp -e DAPP_SMTP_USER=alice -e DAPP_SMTP_PASS='alice-mail-pw!' -e DAPP_SMTP_PORT=25 -e CONFIRM_ADDRESS=xxx -e DEFAULT_FROM='doichain@ci-doichain.org' --dns=${BIND_IP} --dns-search=ci-doichain.org") { c ->
                     def ALICE_IP = sh(script: "sudo docker inspect alice | jq '.[0].NetworkSettings.IPAddress'", returnStdout: true).trim().replaceAll("\"", "")
                                      sh 'docker logs alice'

                                     sh './contrib/scripts/check-alice.sh'
                                     echo "running with doichain docker image alice"

                                     def BOBS_DOCKER_PARAMS = "-it --name=bob -e REGTEST=true -e RPC_ALLOW_IP=::/0 -p ${BOB_NODE_PORT}:18443 -e RPC_PASSWORD=generated-password -e RPC_HOST=bob -e DAPP_SMTP_HOST=smtp -e DAPP_SMTP_USER=bob -e DAPP_SMTP_PASS='bob-mail-pw!' -e DAPP_SMTP_PORT=25 -e CONFIRM_ADDRESS=xxx -e DEFAULT_FROM='doichain@ci-doichain.org' --dns=${BIND_IP} --dns-search=ci-doichain.org";
                                     docker.image("doichain/node-only:latest").withRun(BOBS_DOCKER_PARAMS) { c2 ->
                                            def BOB_IP = sh(script: "sudo docker inspect bob | jq '.[0].NetworkSettings.IPAddress'", returnStdout: true).trim().replaceAll("\"", "")
                                            def NOW = System.currentTimeMillis().toString()[0..-6] //cutting the millisecondsand and seconds
                                            //update bind with correct ip of bind (named.local.conf, rev-file, host-file)
                                            sh "docker cp contrib/scripts/bind/named.conf.local bind:/data/bind/etc/ && docker exec bind  sh -c 'sed -i.bak s/x.0.17.172./${BIND_IP_LASTPART}.0.17.172./g /data/bind/etc/named.conf.local && sed -i.bak s/172.17.0.x./172.17.0.${BIND_IP_LASTPART}./g /data/bind/etc/named.conf.local && chown bind.bind /data/bind/etc/*'"
                                            sh "docker cp contrib/scripts/bind/172.17.0.x.rev bind:/data/bind/lib/ && docker exec bind  sh -c 'sed -i.bak s/x.0.17.172./${BIND_IP_LASTPART}.0.17.172./g /data/bind/lib/172.17.0.x.rev && mv /data/bind/lib/172.17.0.x.rev  /data/bind/lib/172.17.0.${BIND_IP_LASTPART}.rev && sed -i.bak s/_serial_/${NOW}/g /data/bind/lib/172.17.0.${BIND_IP_LASTPART}.rev'"
                                            sh "docker cp contrib/scripts/bind/ci-doichain.org.hosts bind:/data/bind/lib/ && docker exec bind  sh -c 'sed -i.bak s/172.17.0.ns/172.17.0.${BIND_IP_LASTPART}/g /data/bind/lib/ci-doichain.org.hosts'"

                                            //update bind with hostname of alice and bob
                                            sh "docker exec bind  sh -c 'sed -i.bak s/172.17.0.alice/${ALICE_IP}/g /data/bind/lib/ci-doichain.org.hosts'"
                                            sh "docker exec bind  sh -c 'sed -i.bak s/172.17.0.bob/${BOB_IP}/g /data/bind/lib/ci-doichain.org.hosts'"

                                            //update bind with hostname of mail, update serial and reload bind
                                            sh "docker exec bind  sh -c 'sed -i.bak s/172.17.0.mail/${MAIL_IP}/g /data/bind/lib/ci-doichain.org.hosts && sed -i.bak s/_serial_/${NOW}/g /data/bind/lib/ci-doichain.org.hosts && chown bind:bind /data/bind/lib/* && service bind9 reload'"

                                            //update meteor ip of bob for correct walletnotfify
                                            sh "docker exec bob  sh -c 'sed -i.bak s/localhost:3000/${METEOR_IP}:4000/g /home/doichain/.doichain/doichain.conf && cat /home/doichain/.doichain/doichain.conf && /usr/local/bin/doichain-cli stop && sleep 10 && /usr/local/bin/doichaind -regtest'"
                                            sh "docker exec bind sh -c 'echo \"search ci-doichain.org\" >> /etc/resolv.conf'"
                                            sh 'sleep 10'
                                            sh './contrib/scripts/connect-alice.sh'
                                            sh 'sudo ./contrib/scripts/meteor-install.sh'

                                          //use this in order to start a second meteor test for bob

                                            sh 'sudo git submodule init && sudo git submodule update && sudo meteor npm install && sudo meteor npm install --save bcrypt && sudo meteor npm run lint && sudo nohup meteor run --port=4000 --settings settings-jenkins-bob-json & sudo meteor npm run test-jenkins-alice-mocha'

                                            echo "finished alice"
                                            //sh 'sudo meteor npm run test-jenkins-bob-mocha'
                                           // echo "finished bob"
                                            sleep 1200
                                      } //bobs node
                     } //alice node
                } //mail-server
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
