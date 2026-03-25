# DDC Monitor Controller for Windows

A Node.js-based DDC-CI (Display Data Channel) monitor controller for Windows. Uses Windows WMI for brightness/contrast control and the ClickMonitorDDC tool for input switching.

## Architecture

```
Node.js (TypeScript)
    ↓
JavaScript Implementation
    ├─ WMI (brightness, contrast, detection)
    └─ ClickMonitorDDC Tool (input switching)
    ↓
Monitor (DDC-CI Protocol)
```

## Features

- **Monitor Detection**: Automatically detect connected monitors (via WMI)
- **Brightness Control**: Set and get monitor brightness (via WMI)
- **Contrast Control**: Set and get monitor contrast (via WMI)
- **Input Switching**: Switch between HDMI, DisplayPort, DVI, VGA (via ClickMonitorDDC)
- **Power Control**: Turn monitors on/off
- **Generic VCP Code Support**: Send any VCP (Virtual Control Panel) code
- **RESTful API**: Full HTTP API for remote control
- **TypeScript**: Fully typed for better development experience
- **Zero Native Dependencies**: No C++ compilation required

## Prerequisites

### System Requirements
- Windows 10 or later
- Monitor with DDC-CI support
- Node.js 18+ (with npm)
- ClickMonitorDDC tool (included in project)

### No Build Tools Required!
Unlike previous versions, this implementation does **not** require Visual Studio Build Tools or Python. Just Node.js and npm.

## Installation

1. **Clone or download the project**:
```bash
cd monitor-controller
```

2. **Build and run**:
```bash
npm run build
npm start
```

That's it! No native compilation required.

## Build Commands

```bash
# Build TypeScript
npm run build

# Development mode (with auto-reload)
npm run dev

# Run production build
npm start
```

## Project Structure

```
monitor-controller/
├── src/
│   ├── index.ts              # Main Express server
│   ├── ddc-monitor.ts        # TypeScript wrapper for DDC control
│   └── native/
│       └── ddc_controller.cc # C++ native addon code
├── binding.gyp               # Node-gyp configuration
├── tsconfig.json            # TypeScript configuration
└── package.json             # Project dependencies & scripts
```

## Usage

### Start the Server

```bash
npm start
```

The server will start on `http://localhost:3000`

### API Endpoints

#### Get Connected Monitors
```bash
GET /api/monitors
```

Response:
```json
{
  "success": true,
  "monitors": [
    {
      "name": "Dell U2720Q",
      "handle": 0
    }
  ],
  "count": 1
}
```

#### Get Monitor Capabilities
```bash
GET /api/capabilities
```

#### Brightness Control

Get brightness:
```bash
GET /api/brightness
```

Set brightness (0-100):
```bash
GET /api/brightness/75
```

#### Contrast Control

Get contrast:
```bash
GET /api/contrast
```

Set contrast (0-100):
```bash
GET /api/contrast/50
```

#### Input Switching

Switch to HDMI:
```bash
GET /api/input/hdmi
```

Switch to DisplayPort:
```bash
GET /api/input/dp
```

Switch to custom input (by VCP code):
```bash
GET /api/input/0x12
```

#### Power Control

Power on:
```bash
GET /api/power/on
```

Power off:
```bash
GET /api/power/off
```

#### API Information
```bash
GET /api/info
```

### Using in TypeScript/JavaScript

```typescript
import DDCMonitor, { INPUT_SOURCES } from "./ddc-monitor";

const ddc = new DDCMonitor();

// Get monitors
const monitors = ddc.getMonitors();
console.log(monitors);

// Set brightness
ddc.setBrightness(75);

// Get brightness
const brightness = ddc.getBrightness();
console.log(brightness); // { current: 75, max: 100 }

// Switch input
ddc.setInputSource(INPUT_SOURCES.HDMI_1);

// Switch to HDMI
ddc.switchToHDMI();

// Switch to DisplayPort
ddc.switchToDisplayPort();

// Control power
ddc.setPowerMode(true);  // Turn on
ddc.setPowerMode(false); // Turn off
```

## VCP Codes

Common VCP codes supported:

- `0x10` - Brightness
- `0x12` - Contrast
- `0x14` - Color Temperature
- `0x60` - Input Source
- `0xD6` - Power Mode

For a complete list, see the [VESA DDC-CI specification](https://en.wikipedia.org/wiki/Display_Data_Channel#DDC-CI).

## Input Source Values

- `0x01` - VGA/Analog
- `0x03` - DVI
- `0x0f` - DisplayPort
- `0x11` - HDMI 1
- `0x12` - HDMI 2

## Troubleshooting

### Native Module Not Found
```
Error: Cannot find module '.../build/Release/ddc_controller'
```
**Solution**: Run `npm run rebuild` to compile the native addon.

### Build Fails with MSVC Error
**Solution**: Install Visual Studio Build Tools 2022 with C++ workload.

### Monitor Not Responding
- Verify your monitor supports DDC-CI
- Check DisplayPort version (some older monitors have limited DDC support)
- Try updating monitor firmware
- Some USB hubs or cables may interfere with DDC communication

### Permission Issues
- Run as Administrator if you encounter permission errors
- Some monitors require power on to respond to DDC commands

## Advanced: Custom VCP Codes

To send custom VCP codes:

```typescript
const success = ddc.setMonitorValue(0x14, 150); // Set VCP code 0x14 to 150

const value = ddc.getMonitorValue(0x14);  // Get current value for VCP code 0x14
console.log(value); // { current: 150, max: 200 }
```

## Performance Notes

- DDC communication over monitors is relatively slow (typically 50-100ms per command)
- Batch multiple commands rather than sending them individually
- The API is non-blocking - you can send multiple commands in parallel

## Security Considerations

- This library requires administrator privileges to access DDC
- Running the server exposed on a network allows remote monitor control
- Consider implementing authentication and authorization for production use
- Validate all input, especially VCP codes and values

## Platform Support

Currently supports Windows only. The DXVA2 API is Windows-specific.

For cross-platform DDC control, consider:
- macOS: DDC-CI control is available through IOKit
- Linux: Use `ddcutil` or `python-ddc-ci`

## Implementation Details

The controller is implemented in pure JavaScript/TypeScript using:

- **Windows WMI** (`Windows Management Instrumentation`): For monitor detection and brightness/contrast control
- **ClickMonitorDDC Tool**: External utility for input source switching
- **Express.js**: RESTful API server
- **TypeScript**: Type-safe implementation

No native C++ addon required - everything runs on Node.js directly.

## Development

### Project Structure

```
src/
├── index.ts              # Express server with API endpoints
└── ddc-monitor-js.ts     # DDC implementation layer
```

### Building

```bash
# Compile TypeScript to JavaScript
npm run build

# Watch mode during development
npm run dev
```

### Extending

To add new features or monitor controls:

1. Add the method to `DDCMonitor` class in `src/ddc-monitor-js.ts`
2. Add the API endpoint to `src/index.ts`
3. Rebuild with `npm run build`

Example:
```typescript
public setCustomFeature(value: number): boolean {
  // Implementation here
  return true;
}
```

## License

ISC

## References

- [VESA DDC-CI Standard](https://en.wikipedia.org/wiki/Display_Data_Channel)
- [Windows Physical Monitor Configuration API](https://docs.microsoft.com/en-us/windows/win32/api/physicalmonitorenumerationapi/)
- [Node.js Native Addons](https://nodejs.org/api/addons.html)

## Changelog

### v1.1.0 (Current)
- Simplified to pure JavaScript (no native addon)
- Uses Windows WMI for brightness/contrast
- Uses ClickMonitorDDC tool for input switching
- Removed dependency on Visual Studio Build Tools
- Much faster setup - just `npm install` and `npm run build`
- Clean, maintainable codebase

### v1.0.0
- Initial release with native C++ addon
- Direct DXVA2 API access
- Brightness, contrast, and input switching
- TypeScript support
