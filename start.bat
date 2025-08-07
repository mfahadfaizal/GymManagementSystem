@echo off
echo ========================================
echo Gym Management System Startup Script
echo ========================================
echo.

echo Starting Backend...
cd backend
start "Backend Server" cmd /k "mvn spring-boot:run"
cd ..

echo.
echo Waiting for backend to start...
timeout /t 10 /nobreak > nul

echo.
echo Starting Frontend...
cd frontend
start "Frontend Server" cmd /k "npm start"
cd ..

echo.
echo ========================================
echo Both servers are starting...
echo Backend: http://localhost:8080
echo Frontend: http://localhost:3000
echo ========================================
echo.
echo Default users:
echo - Admin: admin/admin123
echo - Staff: staff/staff123
echo - Trainer: trainer/trainer123
echo - Member: member/member123
echo.
pause 