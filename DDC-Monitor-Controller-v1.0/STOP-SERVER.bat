@echo off
title How to Stop DDC Monitor Controller
color 0A

echo.
echo ====================================
echo  How to Stop DDC Monitor Controller
echo ====================================
echo.
echo METHOD 1: Keyboard Shortcut (Easiest)
echo ----------
echo If the console window is open and running:
echo   Press: Ctrl + C
echo   The server will shut down gracefully
echo.
echo.
echo METHOD 2: Close the Window
echo ----------
echo Simply click the X button on the console window
echo The server will stop immediately
echo.
echo.
echo METHOD 3: Task Manager (If stuck)
echo ----------
echo 1. Press: Ctrl + Shift + Esc
echo    (or Ctrl + Alt + Delete, then Task Manager)
echo 2. Find: node.exe or monitor-controller.exe
echo 3. Right-click and select "End Task"
echo.
echo.
echo METHOD 4: Command Line
echo ----------
echo Open Command Prompt and run:
echo   taskkill /F /IM monitor-controller.exe
echo Or for Node process:
echo   taskkill /F /IM node.exe
echo.
echo.
echo ====================================
echo Note: The server only runs while the
echo console window is open. Close it to stop.
echo ====================================
echo.
pause
