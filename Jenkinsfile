pipeline {
    agent {
        docker {
            image 'ubuntu'
            }
        }
    stages {
        stage('build') {
            steps {
                sh 'adduser --disabled-password --gecos '' doichain && \
                    adduser doichain sudo && \
                    echo '%sudo ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers'
                sh 'su doichain'
                sh 'curl https://install.meteor.com | /bin/sh'
                sh 'git submodule init'
                sh 'git submodule update'
                sh 'meteor npm install'
                sh 'meteor npm run lint'
                sh 'meteor npm run test-circleci-mocha'
            }
        }
    }
}