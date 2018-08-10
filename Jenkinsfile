pipeline {
    agent {
        docker {
            image 'node:8'
            args '-u root:root'
            // args '--tmpfs /.config'
            }
        }
    stages {
        stage('build') {
            steps {
                   sh 'npm --version'
                   docker.image("doichain/node-only").withRun("-u root:root --name=alice -e REGTEST=true -e RPC_ALLOW_IP=::/0 -p 18445:18445 -p 18443:18443") { c ->
                                sh './contrib/scripts/check-alice.sh'
                               // sh 'while ! lsof -i TCP:18445 | grep LISTEN; do sleep 1; done'
                                echo "running with doichain docker image alice"
                                //sh 'sleep 600'
                                echo "finished alice"
                   }
            }
        }
    }
}

