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
  extraSHCommands = 'sed -i \'s/^  "version".*$/  "version": "${BUILD_VERSION}",/\' ./projects/fb-transcription/package.json'
  withCredentials([usernamePassword(credentialsId: 'a28fbe0d-6c96-4178-bac2-56de06cd26e2', passwordVariable: 'NPM_TOKEN', usernameVariable: 'NPM_USER')]) {
    extraDockerBuildArguments = "--build-arg ENVIRONMENT=production --build-arg NPM_AUTH_TOKEN=$env.NPM_TOKEN --build-arg NPM_USER=$env.NPM_USER --build-arg NPM_SCOPE=$env.NPM_USER --build-arg NPM_REGISTRY=https://npm.pkg.github.com/temporafugiunt"
    buildInfo = build(this, versionPrefix, repository, imageName, extraDockerBuildArguments, false, false, NugetPushOptionEnum.NoPush, '', '.', '', extraSHCommands)
  }
}

