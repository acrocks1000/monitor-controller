@echo off
title DDC Monitor Controller
color 0A
echo.
echo ====================================
echo   DDC Monitor Controller Starting
echo ====================================
echo.
echo Starting server...
echo Server will run only while this window is open
echo Close this window (or press Ctrl+C) to stop the server
echo.

rem Run the executable in foreground (server stops when window closes)
"%~dp0dist\bin\monitor-controller.exe"

if errorlevel 1 (
    echo.
    echo ERROR: Failed to start the application
    echo.
    pause
)
