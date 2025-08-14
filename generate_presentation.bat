@echo off
echo ========================================
echo Gym Management System - PPT Generator
echo ========================================
echo.

echo Installing required packages...
pip install -r requirements.txt

echo.
echo Generating PowerPoint Presentation...
python generate_presentation.py

echo.
echo ========================================
echo Presentation generation complete!
echo ========================================
echo.
echo The presentation file has been created:
echo "Gym_Management_System_Presentation.pptx"
echo.
echo You can now open it in Microsoft PowerPoint
echo or any compatible presentation software.
echo.
pause 