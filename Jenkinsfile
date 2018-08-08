node {
  def runCmd = { cmd ->
        docker.image("ubuntu:latest").withRun("-t -v /home/mn:/src/mn") { c ->
            sh "docker exec ${c.id} ${cmd}"
        }
    }

  stage 'Build'
  runCmd 'make stuff'
  parallel (
    "frontend": {
      runCmd "make frontend"
    },
    "backend": {
      runCmd "make backend"
    }
  )
}