pipeline {
    agent {
        docker {
            image 'doichain/dapp'
            args '-u root:root --name=alice -e REGTEST=true -e RPC_ALLOW_IP=::/0 -p 18543:18332'
            // args '--tmpfs /.config'
            }
        }
    stages {
        stage('build') {
            steps {
                   sh 'npm --version'
                   sh './contrib/scripts/check-alice.sh'

            }
        }
    }
}

