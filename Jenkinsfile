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
            steps{
                sh 'sudo apt install npm'
                sh 'npm test'
            }
        }

        stage('Build') {

            steps {
                sh 'docker build -t lcdamy/ngali-api:1.2 .'
            }
        }

        stage('Login'){

            steps {
                sh 'echo $DOCKERHUB_CREDENTIALS_PWS docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin'
            }
        }

        stage('Push'){

            steps {
                sh 'docker push lcdamy/ngali-api:1.2'
            }
        }

    }

    post {
        always {
            sh 'docker logout'
        }
    }

}