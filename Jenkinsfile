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
  extraDockerBuildArguments = ""
  buildInfo = build(this, versionPrefix, repository, imageName, extraDockerBuildArguments, true, true, NugetPushOptionEnum.NoPush, '', '.', '', extraSHCommands)
}

