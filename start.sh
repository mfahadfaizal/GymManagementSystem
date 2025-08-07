#!/bin/bash

echo "========================================"
echo "Gym Management System Startup Script"
echo "========================================"
echo

echo "Starting Backend..."
cd backend
gnome-terminal --title="Backend Server" -- bash -c "mvn spring-boot:run; exec bash" 2>/dev/null || \
xterm -title "Backend Server" -e "mvn spring-boot:run; exec bash" 2>/dev/null || \
osascript -e 'tell app "Terminal" to do script "cd '$(pwd)' && mvn spring-boot:run"' 2>/dev/null || \
start "Backend Server" cmd /k "mvn spring-boot:run" 2>/dev/null
cd ..

echo
echo "Waiting for backend to start..."
sleep 10

echo
echo "Starting Frontend..."
cd frontend
gnome-terminal --title="Frontend Server" -- bash -c "npm start; exec bash" 2>/dev/null || \
xterm -title "Frontend Server" -e "npm start; exec bash" 2>/dev/null || \
osascript -e 'tell app "Terminal" to do script "cd '$(pwd)' && npm start"' 2>/dev/null || \
start "Frontend Server" cmd /k "npm start" 2>/dev/null
cd ..

echo
echo "========================================"
echo "Both servers are starting..."
echo "Backend: http://localhost:8080"
echo "Frontend: http://localhost:3000"
echo "========================================"
echo
echo "Default users:"
echo "- Admin: admin/admin123"
echo "- Staff: staff/staff123"
echo "- Trainer: trainer/trainer123"
echo "- Member: member/member123"
echo
read -p "Press Enter to continue..." 