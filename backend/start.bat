@echo off
echo Starting Gym Management System Backend...
echo.

REM Check if Maven is available
where mvn >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Maven not found. Setting up Maven...
    call install-maven.bat
)

echo Compiling and starting the application...
mvn clean compile
if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ Compilation successful!
    echo 🚀 Starting Spring Boot application...
    echo.
    echo 📍 Application will be available at: http://localhost:8080
    echo 🔐 Sample users:
    echo    - admin/admin123 (ADMIN)
    echo    - trainer/trainer123 (TRAINER)
    echo    - staff/staff123 (STAFF)
    echo    - member/member123 (MEMBER)
    echo.
    echo Press Ctrl+C to stop the application
    echo.
    mvn spring-boot:run
) else (
    echo.
    echo ❌ Compilation failed! Please check the errors above.
    pause
) 