@Library('freebyTech')_

import com.freebyTech.BuildInfo
import com.freebyTech.NugetPushOptionEnum

String repository = 'freebytech'    
String imageName = "fb-transcription"
String versionPrefix = ''
String extraDockerBuildArguments = ''
String extraSHCommands = ''
BuildInfo buildInfo

node 
{
  stage('Get package.json Version')
  {
    script {
    // Major and minor version pulled from the package.json file.
      versionPrefix = """${sh(
              returnStdout: true,
              script: '''grep 'version' package.json | cut -d '"' -f4 | cut -d '.'  -f 1-2 | tr -d \'\\n\' '''
          )}"""
    }
  }

  showBuildSettings()
  extraSHCommands = ""
  withCredentials([usernamePassword(credentialsId: 'a28fbe0d-6c96-4178-bac2-56de06cd26e2', passwordVariable: 'GITHUB_TOKEN', usernameVariable: 'GITHUB_USER')]) {
    extraDockerBuildArguments = "--build-arg ENVIRONMENT=production --build-arg NPM_AUTH_TOKEN=$env.GITHUB_TOKEN --build-arg NPM_USER=$env.GITHUB_USER"
    buildInfo = build(this, versionPrefix, repository, imageName, extraDockerBuildArguments, false, false, NugetPushOptionEnum.NoPush, '', '.', '', extraSHCommands)
  }
}

