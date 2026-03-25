@echo off
REM This script adds port 3000 to Windows Firewall
REM Run as Administrator

echo.
echo ====================================
echo  Opening Firewall for Port 3000
echo ====================================
echo.

REM Check if running as admin
openfiles >nul 2>&1
if errorlevel 1 (
    echo ERROR: This script must be run as Administrator!
    echo.
    echo Please:
    echo 1. Right-click this file
    echo 2. Select "Run as administrator"
    echo.
    pause
    exit /b 1
)

echo Adding inbound firewall rule for port 3000...
netsh advfirewall firewall add rule name="DDC Monitor Controller" ^
    dir=in action=allow protocol=tcp localport=3000 profile=any

if errorlevel 1 (
    echo ERROR: Failed to add firewall rule
    pause
    exit /b 1
)

echo.
echo ====================================
echo SUCCESS! Firewall rule added
echo ====================================
echo.
echo Port 3000 is now accessible from other network devices
echo.
echo Next steps:
echo 1. Make sure the server is running (START.bat)
echo 2. On your phone, try accessing the server again
echo 3. Use the IP shown in the console window
echo.
pause
