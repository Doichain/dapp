pipeline {
    agent {
        docker {
            image 'doichain/node-only'
            args '-u root:root --name=alice -e REGTEST=true -e RPC_ALLOW_IP=::/0 -p 18543:18332'
            // args '--tmpfs /.config'
            }
        }
    stages {
        stage('build') {
            steps {
                   sh 'npm --version'
                   sh './contrib/scripts/check-alice.sh'
                   docker.image("doichain/node-only").withRun("-u root:root --name=alice -e REGTEST=true -e RPC_ALLOW_IP=::/0 -p 18445:18445 -p 18443:18443") { c ->

                               // sh 'while ! lsof -i TCP:18445 | grep LISTEN; do sleep 1; done'
                                echo "running with doichain docker image alice"
                                //sh 'sleep 600'
                                echo "finished alice"
                   }
            }
        }
    }
}

