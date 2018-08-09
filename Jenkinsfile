node {


   docker.withRegistry('https://registry.hub.docker.com', 'Docker-Hub-Credentials') {
        image = docker.image('doichain/node-only')
        image.pull()
   }


  def runCmd = { cmd,port, rpc_port ->
        docker.image("doichain/node-only").withRun("--rm --hostname=${cmd} -e REGTEST=true -e RPC_ALLOW_IP=::/0 -p ${port}:18445 -p ${rpc_port}:18443 -e RPC_USER=admin -e RPC_PASSWORD=generated-password -e RPC_HOST=localhost") {
           echo "running inside doichain docker image ${cmd} ${port} ${rpc_port}"
        }
    }

 stage 'Build'
  parallel (
    "alice": {
      runCmd ("alice", 18445,18443)
    },
    "bob": {
      runCmd ("bob", 18446,18444)
    }
  )

}