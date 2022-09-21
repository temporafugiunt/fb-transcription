@Library('freebyTech')_

import com.freebyTech.BuildInfo
import com.freebyTech.NugetPushOptionEnum

String versionPrefix = '0.2'
String repository = 'freebytech'    
String imageName = "fb-transcription"
String extraDockerBuildArguments = ''
String extraSHCommands = ''
BuildInfo buildInfo

node 
{
  println("App Version ${versionPrefix}.$env.BUILD_ID");

  showBuildSettings()
  extraSHCommands = ""
  withCredentials([usernamePassword(credentialsId: 'a28fbe0d-6c96-4178-bac2-56de06cd26e2', passwordVariable: 'GITHUB_TOKEN', usernameVariable: 'GITHUB_USER')]) {
    extraDockerBuildArguments = "--build-arg ENVIRONMENT=production --build-arg NODE_AUTH_TOKEN=$env.GITHUB_TOKEN"
    buildInfo = build(this, versionPrefix, repository, imageName, extraDockerBuildArguments, true, true, NugetPushOptionEnum.NoPush, '', '.', '', extraSHCommands)
  }
}

