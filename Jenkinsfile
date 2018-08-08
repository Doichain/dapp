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
            }
        }
    }
}