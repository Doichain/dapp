pipeline {
    agent {
        docker {
            image 'node:8'
           // args '-u root:root --name=alice -e REGTEST=true -e RPC_ALLOW_IP=::/0 -p 18543:18332'
            // args '--tmpfs /.config'
            }
        }
    stages {
        stage('build') {
            steps {
                   sh 'npm --version'
                   //sh './contrib/scripts/check-alice.sh'
                   docker.image('python:2.7').withRun('-u root --entrypoint /bin/bash') {
                       sh 'pip install version'
                   }
            }
        }
    }
}

