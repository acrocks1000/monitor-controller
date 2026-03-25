# Setup Guide: DDC Monitor Controller

This guide walks you through setting up the DDC Monitor Controller from scratch.

## Prerequisites Check

Before starting, verify you have the required software:

### 1. Node.js and npm
Check if Node.js is installed:
```bash
node --version
npm --version
```

Required: Node.js 18.0.0 or later

[Download Node.js](https://nodejs.org/) if not installed.

### 2. Visual Studio Build Tools
The C++ native addon requires a C++ compiler. You have two options:

**Option A: Visual Studio Code + Build Tools (Recommended)**
1. Download [Visual Studio Build Tools 2022](https://visualstudio.microsoft.com/visual-cpp-build-tools/)
2. During installation, select **"Desktop development with C++"**
3. Ensure MSVC v142 or higher is selected

**Option B: Full Visual Studio**
If you have Visual Studio 2022 Community/Professional installed, it includes the necessary build tools.

### 3. Python
Node-gyp requires Python for building:

```bash
python --version
```

If not installed, download [Python 3.x](https://www.python.org/downloads/) and add it to PATH during installation.

## Installation Steps

### Step 1: Clone or Download Project

```bash
git clone <repository-url> monitor-controller
cd monitor-controller
```

Or manually download and extract the project folder.

### Step 2: Install npm Dependencies

```bash
npm install
```

This installs Node.js dependencies including node-gyp.

### Step 3: Build the Native Addon

```bash
npm run rebuild
```

This compiles the C++ native addon from source. The first build may take 1-2 minutes.

**Expected output should contain:**
```
gyp info ok
```

If you see errors, check the troubleshooting section below.

### Step 4: Build TypeScript

```bash
npm run build
```

This compiles the TypeScript source to JavaScript in the `dist/` folder.

### Step 5: Verify Installation

Check that the build succeeded:

```bash
ls build/Release/  # On Windows: dir build\Release\
```

You should see `ddc_controller.node` file.

### Step 6: Run the Server

```bash
npm start
```

Expected output:
```
🖥️  DDC Monitor Controller running on http://localhost:3000
📡 API documentation: http://localhost:3000/api/info
```

## Verification Tests

Once running, verify the installation with these tests:

### Test 1: Get Connected Monitors
```bash
curl http://localhost:3000/api/monitors
```

Expected response:
```json
{
  "success": true,
  "monitors": [
    { "name": "Your Monitor Name", "handle": 0 }
  ],
  "count": 1
}
```

### Test 2: Get Brightness
```bash
curl http://localhost:3000/api/brightness
```

Expected response:
```json
{
  "success": true,
  "brightness": { "current": 75, "max": 100 }
}
```

### Test 3: Set Brightness
```bash
curl http://localhost:3000/api/brightness/80
```

Expected response:
```json
{
  "success": true,
  "message": "Brightness set to 80"
}
```

## Development Setup

For development with auto-reload:

```bash
npm run dev
```

This starts the server with hot-reload enabled using `ts-node-dev`.

## Troubleshooting Build Issues

### Error: "Cannot find Python"
**Solution:** 
```bash
npm config set python path/to/python.exe
npm run rebuild
```

### Error: "Visual C++ compiler not found"
**Solution:**
1. Install Visual Studio Build Tools 2022
2. Or set the compiler path:
```bash
npm config set msvs_version 2022
npm run rebuild
```

### Error: "node-gyp: command not found"
**Solution:**
```bash
npm install -g node-gyp
```

### Build succeeds but module not found at runtime
**Solution:**
```bash
npm run rebuild
npm run build
```

Run both commands to ensure native addon is built first.

### DXVA2.lib not found
**Solution:**
Visual Studio Build Tools may not have Windows SDK installed. Reinstall and ensure you select:
- Windows 11 SDK (or latest version)
- Under "Individual components"

### "Monitor not responding" after successful build
- Your monitor may not support DDC-CI
- Try powering the monitor off and back on
- Check monitor OSD settings for "DDC-CI" or "Monitor Control" - ensure it's disabled/allowed
- Some USB hubs interfere with DDC communication

## File Structure After Setup

After successful setup, your project should look like:

```
monitor-controller/
├── dist/                    # Compiled JavaScript (created by npm run build)
│   ├── index.js
│   ├── ddc-monitor.js
│   └── *.map
├── build/                   # Native addon build artifacts
│   └── Release/
│       └── ddc_controller.node
├── src/
│   ├── index.ts
│   ├── ddc-monitor.ts
│   └── native/
│       └── ddc_controller.cc
├── node_modules/            # Dependencies (created by npm install)
├── binding.gyp
├── tsconfig.json
├── package.json
└── README.md
```

## Next Steps

1. Read [README.md](./README.md) for API documentation
2. Check [EXAMPLES.ts](./EXAMPLES.ts) for usage examples
3. Try the HTTP endpoints with curl or Postman
4. Integrate with your monitor control application

## Running as Administrator

Some systems require administrator privileges. If you get permission errors:

**Windows PowerShell (as Administrator):**
```powershell
npm start
```

Or create a shortcut with "Run as administrator" option.

## Performance Optimization

For the best DDC communication performance:

1. **Direct connection**: Connect monitor directly via HDMI/DP if possible
2. **USB isolation**: Avoid USB hubs between computer and monitor
3. **Delays**: Add 100-500ms delays between sequential commands:

```typescript
async function multiCommand() {
  ddc.setBrightness(80);
  await new Promise(r => setTimeout(r, 200));
  ddc.setContrast(60);
}
```

## System Integration

### Windows Service (Optional)

To run the controller as a Windows service:

1. Install `nssm` (Non-Sucking Service Manager):
```bash
choco install nssm
```

2. Create service:
```bash
nssm install DDCMonitorController "C:\path\to\node.exe" "C:\path\to\dist\index.js"
nssm set DDCMonitorController AppDirectory C:\path\to\project
nssm start DDCMonitorController
```

### Autostart on Boot

Create a shortcut in:
```
C:\Users\[YourUsername]\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Startup
```

Point to:
```
Node.exe - "C:\path\to\dist\index.js"
```

## Support

If you encounter issues:

1. Check the [README.md](./README.md) troubleshooting section
2. Verify all prerequisites are installed
3. Try `npm run rebuild` again (sometimes fixes transient issues)
4. Check that your monitor supports DDC-CI

## What's Next?

- Customize the API by modifying `src/index.ts`
- Create a UI dashboard using the HTTP API
- Integrate with other home automation systems
- Write custom C++ code for advanced monitor features

Happy monitor controlling! 🖥️
