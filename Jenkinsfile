@Library('freebyTech')_

import com.freebyTech.BuildInfo
import com.freebyTech.NugetPushOptionEnum

String repository = 'freebytech'    
String imageName = "fb-transcription"
String versionPrefix = '0.5'
String extraDockerBuildArguments = ''
String extraSHCommands = ''
BuildInfo buildInfo

node 
{
  showBuildSettings()
  extraSHCommands = 'cd projects/fb-transcription | sed -i \'s/^  "version".*$/  "version": "1.0"/\' package.json ${BUILD_VERSION}'
  withCredentials([usernamePassword(credentialsId: 'a28fbe0d-6c96-4178-bac2-56de06cd26e2', passwordVariable: 'GITHUB_TOKEN', usernameVariable: 'GITHUB_USER')]) {
    extraDockerBuildArguments = "--build-arg ENVIRONMENT=production --build-arg NPM_AUTH_TOKEN=$env.GITHUB_TOKEN --build-arg NPM_USER=$env.GITHUB_USER"
    buildInfo = build(this, versionPrefix, repository, imageName, extraDockerBuildArguments, false, false, NugetPushOptionEnum.NoPush, '', '.', '', extraSHCommands)
  }
}

