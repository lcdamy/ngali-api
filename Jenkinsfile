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
                bat 'npm install'
                bat 'npm test'
            }
        }

        stage('Build') {

            steps {
                bat 'docker build -t lcdamy/ngali-api:1.2 .'
            }
        }

        stage('Push'){

            steps {
                withCredentials([usernamePassword(credentialsId:'dockerhub',passwordVariable:'DOCKERHUB_PASSWORD',usernameVariable:'DOCKERHUB_USERNAME')]){
                    bat 'echo $DOCKERHUB_PASSWORD docker login -u $DOCKERHUB_USERNAME --password-stdin' 
                    bat 'docker push lcdamy/ngali-api:1.2'
                    bat 'docker logout'
                }
            }
        }

    }

    post {
        always {
            sh 'docker logout'
        }
    }

}