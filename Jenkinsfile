/*
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
*/
node {
    checkout scm

    docker.image("doichain/node-only").withRun("-it --name=alice -e REGTEST=true -e RPC_ALLOW_IP=::/0 -p 18545:18445 -p 18543:18443") { c ->
                    sh 'sleep 10'
                    sh './contrib/scripts/check-alice.sh'
                   // sh 'while ! lsof -i TCP:18445 | grep LISTEN; do sleep 1; done'
                    echo "running with doichain docker image alice"
                    sh 'sleep 30'
                    echo "finished alice"
    }
}