pipeline {
    agent {
        docker {
            image 'ubuntu'
            args '-u root:root'
            }
        }
    stages {
        stage('build') {
            steps {
                sh "apt-get update; apt-get install -y git sudo curl jq"
                sh "sudo adduser --disabled-password --gecos '' doichain && \
                    sudo adduser doichain sudo && \
                    sudo echo '%sudo ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers"
                sh 'sudo chown doichain * -R;curl https://install.meteor.com | /bin/sh;git submodule init;git submodule update;meteor npm install; meteor npm run lint;meteor npm run test-circleci-mocha --allow-superuser'
            }
        }
    }
}