node {
  def runCmd = { cmd ->
        docker.image("ubuntu:latest").withRun("-t -v /home/mn:/src/mn") { c ->
            sh "docker exec ${c.id} ${cmd}"
        }
    }

  stage 'Build'
  runCmd 'echo stuff'
  parallel (
    "frontend": {
      runCmd "echo frontend"
    },
    "backend": {
      runCmd "echo backend"
    }
  )
}