; DDC Monitor Controller NSIS Installer Script
; Download NSIS from: https://nsis.sourceforge.io/

!include "MUI2.nsh"

; Installer settings
Name "DDC Monitor Controller"
OutFile "DDC-Monitor-Controller-Setup.exe"
InstallDir "$PROGRAMFILES\DDC Monitor Controller"
RequestExecutionLevel user

; MUI Settings
!insertmacro MUI_PAGE_DIRECTORY
!insertmacro MUI_PAGE_INSTFILES
!insertmacro MUI_LANGUAGE "English"

; Installer sections
Section "Install"
  SetOutPath "$INSTDIR"
  
  ; Copy main executable
  File "dist\bin\monitor-controller.exe"
  
  ; Copy startup batch file
  File "START.bat"
  
  ; Copy documentation
  File "INSTALL.md"
  File "PER-MONITOR-CONTROL.md"
  
  ; Copy ClickMonitorDDC tool
  SetOutPath "$INSTDIR\ClickMonitorDDC"
  File "ClickMonitorDDC\ClickMonitorDDC_7_2.exe"
  
  ; Create shortcuts
  SetOutPath "$INSTDIR"
  CreateDirectory "$SMPROGRAMS\DDC Monitor Controller"
  CreateShortCut "$SMPROGRAMS\DDC Monitor Controller\Start Server.lnk" "$INSTDIR\START.bat"
  CreateShortCut "$SMPROGRAMS\DDC Monitor Controller\Documentation.lnk" "$INSTDIR\INSTALL.md"
  CreateShortCut "$SMPROGRAMS\DDC Monitor Controller\Uninstall.lnk" "$INSTDIR\Uninstall.exe"
  
  CreateShortCut "$DESKTOP\DDC Monitor Controller.lnk" "$INSTDIR\START.bat"
  
  ; Create uninstaller
  WriteUninstaller "$INSTDIR\Uninstall.exe"
SectionEnd

; Uninstaller section
Section "Uninstall"
  RMDir /r "$INSTDIR"
  RMDir /r "$SMPROGRAMS\DDC Monitor Controller"
  Delete "$DESKTOP\DDC Monitor Controller.lnk"
SectionEnd
