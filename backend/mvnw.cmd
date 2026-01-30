@ECHO OFF
SETLOCAL

SET MAVEN_PROJECTBASEDIR=%~dp0
IF "%MAVEN_PROJECTBASEDIR%"=="" SET MAVEN_PROJECTBASEDIR=.
SET MAVEN_PROJECTBASEDIR=%MAVEN_PROJECTBASEDIR:~0,-1%

SET WRAPPER_JAR="%MAVEN_PROJECTBASEDIR%\.mvn\wrapper\maven-wrapper.jar"

IF NOT EXIST %WRAPPER_JAR% (
  echo Downloading Maven wrapper...
  IF NOT EXIST "%MAVEN_PROJECTBASEDIR%\.mvn\wrapper" (
    mkdir "%MAVEN_PROJECTBASEDIR%\.mvn\wrapper"
  )
  powershell -NoProfile -ExecutionPolicy Bypass -Command "Invoke-WebRequest -Uri 'https://repo.maven.apache.org/maven2/org/apache/maven/wrapper/maven-wrapper/3.3.2/maven-wrapper-3.3.2.jar' -OutFile '%MAVEN_PROJECTBASEDIR%\.mvn\wrapper\maven-wrapper.jar'"
)

SET JAVA_EXE=java

"%JAVA_EXE%" -classpath %WRAPPER_JAR% "-Dmaven.multiModuleProjectDirectory=%MAVEN_PROJECTBASEDIR%" org.apache.maven.wrapper.MavenWrapperMain %*

ENDLOCAL
