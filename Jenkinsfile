pipeline {
  agent any
  stages {
    stage("run frontend") {
        steps {
          echo 'executing yarn...'
          nodejs('node-10.17') {
              sh 'yarn install'
          }
        }
    }
    stage("run backend") {
        steps {
          echo 'executing gradle...'
        }
    }
  }
}
