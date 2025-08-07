@echo off
echo Downloading Maven...
powershell -Command "Invoke-WebRequest -Uri 'https://archive.apache.org/dist/maven/maven-3/3.9.5/binaries/apache-maven-3.9.5-bin.zip' -OutFile 'maven.zip'"

echo Extracting Maven...
powershell -Command "Expand-Archive -Path 'maven.zip' -DestinationPath '.' -Force"

echo Setting up environment...
set MAVEN_HOME=%CD%\apache-maven-3.9.5
set PATH=%MAVEN_HOME%\bin;%PATH%

echo Maven installed successfully!
echo You can now run: mvn clean compile
pause 