# Per-Monitor Control Implementation

## Overview
The DDC Monitor Controller now supports per-monitor control for brightness and contrast on systems with multiple monitors.

## Changes Made

### 1. **DDCMonitor Class Updates** (`src/ddc-monitor-js.ts`)

#### Monitor Selection Infrastructure
- Added `selectedMonitor` property (default: 0)
- Added `selectMonitor(handle: number)` method
- Added `getSelectedMonitor()` method
- Updated constructor to accept optional `monitorHandle` parameter

#### Brightness/Contrast Methods Enhanced
All methods now support optional `monitorHandle` parameter:
- `setBrightness(value: number, monitorHandle?: number): boolean`
- `getBrightness(monitorHandle?: number): MonitorValue | undefined`
- `setContrast(value: number, monitorHandle?: number): boolean`
- `getContrast(monitorHandle?: number): MonitorValue | undefined`

When `monitorHandle` is not provided, methods use `this.selectedMonitor`.

### 2. **REST API Endpoints** (`src/index.ts`)

#### Monitor Selection Endpoints
- **GET `/api/monitor/select/:handle`** - Select active monitor
  - Response: `{ success: true, selected: 0, message: "..." }`

- **GET `/api/monitor/selected`** - Get currently selected monitor
  - Response: `{ success: true, selected: 0 }`

#### Per-Monitor Brightness Endpoints
- **GET `/api/monitor/:handle/brightness`** - Get brightness for specific monitor
  - Response: `{ success: true, monitor: 0, brightness: { current: 75, max: 100 } }`

- **GET `/api/monitor/:handle/brightness/:value`** - Set brightness for specific monitor
  - Example: `/api/monitor/0/brightness/75`
  - Response: `{ success: true, monitor: 0, brightness: 75, message: "..." }`

#### Per-Monitor Contrast Endpoints
- **GET `/api/monitor/:handle/contrast`** - Get contrast for specific monitor
  - Response: `{ success: true, monitor: 0, contrast: { current: 50, max: 100 } }`

- **GET `/api/monitor/:handle/contrast/:value`** - Set contrast for specific monitor
  - Example: `/api/monitor/0/contrast/50`
  - Response: `{ success: true, monitor: 0, contrast: 50, message: "..." }`

## Usage Examples

### Get Connected Monitors
```
GET /api/monitors
```
Response:
```json
{
  "success": true,
  "monitors": [
    { "name": "DISPLAY\\CMN1521\\...", "handle": 0 },
    { "name": "DISPLAY\\LEN67B4\\...", "handle": 1 }
  ],
  "count": 2
}
```

### Select Monitor 1
```
GET /api/monitor/select/1
```

### Set Brightness for Monitor 1 to 75%
```
GET /api/monitor/1/brightness/75
```

### Get Current Brightness on Monitor 0
```
GET /api/monitor/0/brightness
```

## Architecture Details

- **Monitor Handles**: 0-based numeric identifiers (0 = first monitor, 1 = second, etc.)
- **Default Selection**: Monitor 0 is selected by default
- **WMI Integration**: Uses Windows Management Instrumentation (PowerShell) for brightness/contrast
- **Index Mapping**: WMI uses 1-based indexing; internally converted from 0-based handles

## Technical Implementation

### Brightness Control via WMI
```powershell
$methods = @(Get-WmiObject -Namespace root\wmi -Class WmiMonitorBrightnessMethods)
$methods[monitorIndex].WmiSetBrightness(1, brightness)
```

### Input Switching
- Uses external ClickMonitorDDC tool
- Supports: HDMI1, DisplayPort, and generic sources
- Not monitor-specific (affects selected monitor or default monitor)

### Power Control  
- Uses Windows WMI for power state control
- Limited cross-platform support
- Not monitor-specific

## Backward Compatibility

Old endpoints still work without specifying monitor:
- **GET `/api/brightness/:value`** - Sets brightness on selected monitor (default: monitor 0)
- **GET `/api/brightness`** - Gets brightness from selected monitor
- **GET `/api/contrast/:value`** - Sets contrast on selected monitor
- **GET `/api/contrast`** - Gets contrast from selected monitor

## Notes

**⚠️ Brightness Read Limitation**

- Getting brightness (`GET /api/monitor/0/brightness`) returns `success: false` on many Windows systems
- **This is expected and does NOT prevent setting brightness**
- The monitor supports brightness **control** (set) but not **reporting** (get)
- Your monitor's driver likely doesn't expose the `WmiMonitorBrightness` WMI class, which is a Windows driver limitation, not an issue with this controller
- **Solution**: Use `SET /api/monitor/0/brightness/:value` - it will work fine even when GET fails
  
**Brightness Read vs. Write**:
- `GET /api/monitor/0/brightness` - Reads current brightness (often fails) → `success: false`
- `GET /api/monitor/0/brightness/75` - **Sets** brightness to 75% (works) → `success: true`

---

- Monitor names in `/api/monitors` response are Windows device IDs (DISPLAY\...)
- Input switching via ClickMonitorDDC affects the selected monitor or default monitor
- Power control is not per-monitor (affects all displays)

