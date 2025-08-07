@echo off
echo Setting up Maven and running Spring Boot application...

REM Download Maven if not exists
if not exist "apache-maven-3.9.5" (
    echo Downloading Maven...
    powershell -Command "Invoke-WebRequest -Uri 'https://archive.apache.org/dist/maven/maven-3/3.9.5/binaries/apache-maven-3.9.5-bin.zip' -OutFile 'maven.zip'"
    echo Extracting Maven...
    powershell -Command "Expand-Archive -Path 'maven.zip' -DestinationPath '.' -Force"
    del maven.zip
)

REM Set Maven environment
set MAVEN_HOME=%CD%\apache-maven-3.9.5
set PATH=%MAVEN_HOME%\bin;%PATH%

echo Compiling and running the application...
mvn clean compile
if %ERRORLEVEL% EQU 0 (
    echo Compilation successful! Starting the application...
    mvn spring-boot:run
) else (
    echo Compilation failed! Please check the errors above.
    pause
) 