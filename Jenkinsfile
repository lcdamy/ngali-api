pipeline {

    agent any

    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub')
    }

    stages {

        stage('checkout') {
            steps {
                checkout scm
            }
        }

        stage ('Test'){
            steps {
                bat 'npm test'
            }
        }

        stage('Build') {

            steps {
                bat 'docker build -t lcdamy/ngali-api:1.2 .'
            }
        }

        stage('Login'){

            steps {
                bat 'echo $DOCKERHUB_CREDENTIALS_PWS docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin'
            }
        }

        stage('Push'){

            steps {
                bat 'docker push lcdamy/ngali-api:1.2'
            }
        }

    }

    post {
        always {
            sh 'docker logout'
        }
    }

}