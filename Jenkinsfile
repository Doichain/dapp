pipeline {
    agent {
        docker {
            image 'node:8'
            args '-u root:root'
            }
        }

    stages {
        stage("Parallel") {
            steps {
                parallel (
                    "alice" : {
                        echo "start alice node";
                         //agent {
                           //         docker { image 'doichain/node-only' }
                             //       args '-u root:root'
                               // }

                          // sh 'doichain-cli -getinfo'
                           sh 'docker run doichain/node-only'
                           sh 'sleep 20'
                           sh 'doichain-cli -getinfo'
                           echo "finished alice after 60 seconds"
                           sh 'sleep 60'

                    },
                    "bob" : {
                      echo "start bob node";
                       // docker.image("doichain/node-only").withRun("-u root:root") { c ->
                            //sh 'while ! mysqladmin ping -h0.0.0.0 --silent; do sleep 1; done'
                            sh 'docker run doichain/node-only'
                            echo "running with doichain docker image bob"
                            sh 'sleep 20'
                            sh 'doichain-cli -getinfo'
                            echo "finished alice after 60 seconds"
                            sh 'sleep 60'
                        //}
                    },
                    "meteor": {
                        echo "starting meteor parallel task"
                        sh 'curl https://install.meteor.com | /bin/sh;git submodule init;git submodule update;meteor npm install; meteor npm run lint;meteor npm run test-jenkins-mocha'

                    },
                    failFast: true
                )
            } // steips
        } //stage parallel

      /*  stage('build') {
             parallel alice: {
                         // runCmd ("alice", 18445,18443)
                         stage("start") {
                         steps {
                            echo "test 1"
                            }
                            docker.image("doichain/node-only").withRun("-u root:root") { c ->
                                    //sh 'while ! mysqladmin ping -h0.0.0.0 --silent; do sleep 1; done'
                                    echo "running with doichain docker image alice"
                                    sh 'sleep 60'
                                    echo "finished alice after 60 seconds"
                            }
                          }
                        },
                        bob: {
                            stage("start") {
                              steps {
                                                        echo "test 2"
                                                        }
                              docker.image("doichain/node-only").withRun("-u root:root") { c ->
                                     echo "running with doichain docker image bob"
                                     sh 'sleep 60'
                                     echo "finished bob after 60 seconds"

                                }
                            }
                        },
                        meteor:{
                            stage("start") {
                                steps {
                                echo "teset 3"
                                        sh 'curl https://install.meteor.com | /bin/sh;git submodule init;git submodule update;meteor npm install; meteor npm run lint;meteor npm run test-jenkins-mocha'
                                }
                            }
                        },
                        failFast: true
        } */

    } //stages
} //pipeline
    /*
pipeline {
    agent {
        docker {
            image 'ubuntu'
            args '-u root:root'
            }
    }
    stages {
        stage('build') {
       parallel "node-alice": {
             // runCmd ("alice", 18445,18443)
                docker.image("doichain/node-only").withRun("-u root:root") { c ->
                        //sh 'while ! mysqladmin ping -h0.0.0.0 --silent; do sleep 1; done'
                        echo "running with doichain docker image alice"
                        sh 'sleep 60'
                        echo "finished alice after 60 seconds"
                }
            },
            "node-bob": {
                   docker.image("doichain/node-only").withRun("-u root:root") { c ->
                         echo "running with doichain docker image bob"
                         sh 'sleep 60'
                         echo "finished bob after 60 seconds"

                    }
            },
            "dapp": {
              //  steps {
                       sh "docker run -d --name=bind --dns=$MY_IP \
                        --publish=53:53/udp \
                        --publish=10000:10000 \
                        --volume=/bind:/data \
                        --env='ROOT_PASSWORD=generated-password' \
                        sameersbn/bind:latest"

                //        sh 'curl https://install.meteor.com | /bin/sh;git submodule init;git submodule update;meteor npm install; meteor npm run lint;meteor npm run test-jenkins-mocha'

                //}
            }

        } //stage build
    } //stages
}

node {


   docker.withRegistry('https://registry.hub.docker.com', 'Docker-Hub-Credentials') {
        image = docker.image('doichain/node-only')
        image.pull()
   }


//  def runCmd = { cmd,port, rpc_port ->
  //      docker.image("doichain/node-only").withRun("--rm --hostname=${cmd} -e REGTEST=true -e RPC_ALLOW_IP=::/0 -p ${port}:18445 -p ${rpc_port}:18443 -e RPC_USER=admin -e RPC_PASSWORD=generated-password -e RPC_HOST=localhost") {
    //       echo "running inside doichain docker image ${cmd} ${port} ${rpc_port}"
      //  }
  //  }

 stage 'Build'
  parallel (
    "alice": {
     // runCmd ("alice", 18445,18443)
     docker.image("doichain/node-only").withRun("-u root:root") { c ->
                //sh 'while ! mysqladmin ping -h0.0.0.0 --silent; do sleep 1; done'
                echo "running with doichain docker image alice"
                sh 'sleep 10'
                echo "finished alice"
     }

    },
    "bob": {
           docker.image("doichain/node-only").withRun("-u root:root") { c ->
                 echo "running with doichain docker image bob"
                 sh 'sleep 20'
                 echo "finished bob"

            }
    },
    "ubuntu": {
             docker.image("ubuntu").withRun("-u root:root"){ c ->
                 echo "running with doichain docker image ubuntu"
                 sh 'sleep 30'
                 echo "finished ubuntu"
             }
    }
  )

}*/