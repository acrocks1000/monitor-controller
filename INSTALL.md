# DDC Monitor Controller - Distribution Package

## Installation Instructions for Customers

### Quick Start

1. **Extract the ZIP file** to a folder on your computer
   - Example: `C:\Users\YourName\DDC Monitor Controller\`

2. **Double-click `START.bat`** to launch the server
   - A console window will appear showing the server status
   - You'll see the WiFi network address (e.g., `http://192.168.X.X:3000`)

3. **Access from any device on your WiFi network**
   - On your phone/tablet/laptop, open a web browser
   - Go to: `http://[YOUR_PC_IP]:3000`
   - Example: `http://192.168.1.100:3000`

### Stopping the Server

Press **`Ctrl + C`** in the console window, or simply close it.

You can also double-click **`STOP-SERVER.bat`** for instructions on stopping the server.

### Features

- **Brightness Control**: `http://[PC_IP]:3000/api/monitor/0/brightness/75`
- **Contrast Control**: `http://[PC_IP]:3000/api/monitor/0/contrast/50`
- **Input Switching**: `http://[PC_IP]:3000/api/input/hdmi`
- **View All Monitors**: `http://[PC_IP]:3000/api/monitors`
- **API Docs**: `http://[PC_IP]:3000/api/info`

### Hardware Requirements

- Windows PC (Windows 10 or later)
- Monitor with DDC-CI support
- WiFi network access

### Troubleshooting

**Q: Console window closes immediately**
- Run `START.bat` instead of the `.exe` directly
- This shows any error messages

**Q: Can't connect from other devices**
- Check that both devices are on the same WiFi network
- Find your PC's IP address: it's shown in the console window when START.bat runs
- Make sure Windows Firewall allows port 3000 (or disable it)

**Q: Brightness doesn't change**
- Verify your monitor supports DDC-CI control
- Some monitors may have DDC disabled in their menu

**Q: See error "ClickMonitorDDC tool not found"**
- Make sure the `ClickMonitorDDC_7_2.exe` file exists in the `ClickMonitorDDC/` folder
- If missing, download it from: [ClickMonitorDDC official site]

### Support

For issues or questions, contact the developer.

---

**System Requirements:**
- Windows 10 or later
- Monitor with DDC-CI support enabled
- Network access (WiFi or Ethernet)
- Administrator rights (may be needed for some monitor operations)
