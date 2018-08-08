pipeline {
    agent {
        docker {
            image 'node:8'
            args '-u jenkins'
            // args '--tmpfs /.config'
            }
        }
    stages {
        stage('build') {
            steps {
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