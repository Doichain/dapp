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

     //sh './contrib/scripts/start-docker-compose.sh!' //TODO
     sh 'docker-compose up'

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
