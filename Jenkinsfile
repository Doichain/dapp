node {


   docker.withRegistry('https://registry.hub.docker.com', 'Docker-Hub-Credentials') {
        image = docker.image('doichain:node-only')
        image.pull()
   }


  def runCmd = { cmd,cmd2 ->
        echo "${cmd}"
        echo "${cmd2}"

//        docker.image("doichain:node-only").withRun("--name=${cmd} --hostname=${cmd} -e REGTEST=true -e RPC_ALLOW_IP=::/0 -p 18445:18445 -p 18443:18443 -e DAPP_DEBUG=true -e DAPP_CONFIRM='true' -e DAPP_VERIFY='true' -e DAPP_SEND='true' -e RPC_USER=admin -e RPC_PASSWORD=generated-password -e RPC_HOST=localhost -e DAPP_HOST=your-domain-name-or-ip -e DAPP_SMTP_HOST=localhost -e DAPP_SMTP_USER=doichain -e DAPP_SMTP_PASS='doichain-mail-pw!' -e DAPP_SMTP_PORT=25 -e CONFIRM_ADDRESS=xxx") { c ->
           // sh "docker exec ${c.id} ${cmd}"
  //      }
    }

 stage 'Build'
  //runCmd 'echo stuff'
  parallel (
    "alice": {
      runCmd ("alice", "alice's node")
    },
    "bob": {
      runCmd ("bob", "bob's node")
    }
  )

}