@echo off
setlocal enabledelayedexpansion

REM Create distribution folder
set "DIST_FOLDER=DDC-Monitor-Controller-v1.0"

if exist "%DIST_FOLDER%" (
    echo Removing old distribution folder...
    rmdir /s /q "%DIST_FOLDER%"
)

echo Creating distribution package...
mkdir "%DIST_FOLDER%"

REM Copy essential files
echo Copying files...
copy "START.bat" "%DIST_FOLDER%\" >nul
copy "STOP-SERVER.bat" "%DIST_FOLDER%\" >nul
copy "INSTALL.md" "%DIST_FOLDER%\README.md" >nul
copy "PER-MONITOR-CONTROL.md" "%DIST_FOLDER%\FEATURES.md" >nul
mkdir "%DIST_FOLDER%\dist"
xcopy "dist\bin\monitor-controller.exe" "%DIST_FOLDER%\dist\bin\" /I /Y >nul

REM Copy ClickMonitorDDC tool if it exists
if exist "ClickMonitorDDC" (
    echo Copying ClickMonitorDDC tool...
    xcopy "ClickMonitorDDC" "%DIST_FOLDER%\ClickMonitorDDC\" /I /Y >nul
)

echo.
echo ====================================
echo Distribution package created!
echo ====================================
echo.
echo Folder: %DIST_FOLDER%
echo Size: Check with Windows Explorer
echo.
echo Next steps:
echo 1. Right-click folder "%DIST_FOLDER%" 
echo 2. Send to > Compressed (zipped) folder
echo 3. Share the ZIP file with customers
echo.
echo Or create an installer using NSIS:
echo   https://nsis.sourceforge.io/
echo.
pause
