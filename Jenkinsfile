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
                sh "apt-get update; apt-get install sudo"
                sh "sudo adduser --disabled-password --gecos '' doichain && \
                    sudo adduser doichain sudo && \
                    sudo echo '%sudo ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers"
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