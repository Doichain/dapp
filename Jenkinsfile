node {
  def runCmd = { cmd ->
        docker.image("ubuntu:latest").withRun("-t -v /home/mn:/src/mn") { c ->
            sh "docker exec ${c.id} ${cmd}"
        }
    }

  stage 'Build'
  runCmd 'npm install'
  parallel (
    "frontend": {
      runCmd "make frontend"
    },
    "backend": {
      runCmd "make backend"
    }
  )
}