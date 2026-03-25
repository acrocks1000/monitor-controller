# Monitor Configuration Guide

This guide helps you configure your specific monitor type and use case with the DDC Monitor Controller.

## Common Monitor VCP Codes

Different monitor manufacturers support different VCP codes. Here are the most common ones:

| VCP Code | Hex | Function | Range |
|----------|-----|----------|-------|
| Brightness | 0x10 | Brightness level | 0-100 |
| Contrast | 0x12 | Contrast level | 0-100 |
| Color Temperature | 0x14 | Color temp preset | Varies |
| Red Gain | 0x16 | Red color intensity | 0-100 |
| Green Gain | 0x18 | Green color intensity | 0-100 |
| Blue Gain | 0x1A | Blue color intensity | 0-100 |
| Input Source | 0x60 | Active input | See table below |
| Power Mode | 0xD6 | On/Standby/Off | 1=On, 4=Standby, 5=Off |
| Input Lag | 0xF3 | Display lag setting | Varies |
| Response Time | 0xF4 | Response time | Varies |

## Input Source Codes

| Value | Hex | Input Type |
|-------|-----|-----------|
| 1 | 0x01 | Analog (VGA) |
| 3 | 0x03 | DVI |
| 15 | 0x0F | DisplayPort |
| 17 | 0x11 | HDMI-1 |
| 18 | 0x12 | HDMI-2 |
| 19 | 0x13 | HDMI-3 |
| 20 | 0x14 | HDMI-4 |
| 32 | 0x20 | USB-C |

## Monitor-Specific Guides

### Dell Monitors

Dell UltraSharp, P-series, and U-series monitors typically support:
- All standard VCP codes above
- Extended color management options
- Factory preset color modes

**Test brightness:**
```bash
curl http://localhost:3000/api/brightness
```

**Switch to HDMI:**
```bash
curl http://localhost:3000/api/input/0x11
```

### LG Monitors

LG UltraWide and gaming monitors support:
- Standard VCP codes
- DisplayPort as primary input
- Variable response time settings (VCP 0xF4)

**Gaming preset example:**
```typescript
ddc.setBrightness(100);
ddc.setContrast(75);
ddc.setMonitorValue(0xF4, 1); // Fastest response time
```

### ASUS Monitors

ASUS ROG gaming monitors support:
- Standard codes
- Extended RGB controls
- Dynamic refresh rate options

**Color calibration:**
```typescript
ddc.setMonitorValue(0x16, 100); // Red
ddc.setMonitorValue(0x18, 100); // Green
ddc.setMonitorValue(0x1A, 100); // Blue
```

### BenQ Monitors

BenQ monitors typically support basic control:
- Brightness and contrast
- Input switching
- May have limited DDC-CI support

**Basic profile:**
```typescript
const ddc = new DDCMonitor();
ddc.setBrightness(80);
ddc.setContrast(50);
ddc.switchToDisplayPort();
```

### Samsung Monitors

Samsung monitors vary by model:
- Check if DDC-CI is enabled in OSD settings
- May require firmware update
- Gaming models have better DDC support

**Enable in OSD:**
Settings → System → DDC/CI → Enable

## Troubleshooting by Monitor Brand

### "Monitor not responding" issues

**Dell:**
- Settings → General → PowerManager → DDC/CI Support: Enabled
- Restart monitor

**LG:**
- Settings → Power → Power Management → DDC/CI: Enabled

**ASUS:**
- Settings → System Information → System Information
- Check that monitor recognizes DDC commands

**BenQ:**
- Settings → System Setup → DDC/CI: Enable
- Update monitor firmware if available

### Brightness/Contrast not working

**Common causes:**
1. Monitor in factory reset or locked mode
2. DDC-CI disabled in monitor settings
3. USB cable instead of HDMI/DP for connection
4. Monitor connected through KVM switch

**Solutions:**
1. Press menu → restore to factory defaults
2. Check monitor OSD for DDC/CI setting
3. Use native HDMI or DisplayPort connection
4. Connect directly to monitor, not through switch

## Use Cases

### Pro Color Work

```typescript
// Calibrated workspace
const ddc = new DDCMonitor();

// Set to sRGB mode if available (manufacturer preset)
ddc.setMonitorValue(0x14, 6505); // 6500K daylight

// Calibrate color balance
ddc.setMonitorValue(0x16, 100);  // Red
ddc.setMonitorValue(0x18, 100);  // Green
ddc.setMonitorValue(0x1A, 100);  // Blue

// Optimal brightness for color work
ddc.setBrightness(75);
```

### Gaming Setup

```typescript
// Competitive gaming profile
const ddc = new DDCMonitor();

// Maximum brightness for responsiveness
ddc.setBrightness(100);

// Lower contrast for better visibility
ddc.setContrast(60);

// Set fastest response time if available
ddc.setMonitorValue(0xF4, 1);

// Maximum color saturation
ddc.setMonitorValue(0x16, 120);
ddc.setMonitorValue(0x18, 120);
ddc.setMonitorValue(0x1A, 120);
```

### Office Work

```typescript
// Comfortable office lighting
const ddc = new DDCMonitor();

// Moderate brightness to reduce eye strain
ddc.setBrightness(60);

// Neutral contrast
ddc.setContrast(50);

// Warm color temperature (3000K)
ddc.setMonitorValue(0x14, 3000);
```

### Movie/Video Watching

```typescript
// Cinema preset
const ddc = new DDCMonitor();

// Lower brightness for dark room viewing
ddc.setBrightness(40);

// Higher contrast for better blacks
ddc.setContrast(70);

// Neutral color temperature (6500K)
ddc.setMonitorValue(0x14, 6500);

// Lower response time for smoother motion
ddc.setMonitorValue(0xF4, 3);
```

## Multi-Monitor Setup

Currently, the addon controls the primary monitor. For multi-monitor control:

**Planned:** Multi-monitor support coming in v2.0

**Workaround:** Run multiple instances on different ports

```bash
# Terminal 1: Primary monitor
PORT=3000 npm start

# Terminal 2: Secondary monitor (requires instance selector)
PORT=3001 npm start
```

## Advanced: DDC Protocol Troubleshooting

### Testing DDC Communication

```bash
# Check if monitor responds to any command
curl http://localhost:3000/api/brightness

# Should get back a value, not an error
```

### Enable Verbose Logging (In Code)

Add this to `src/index.ts`:

```typescript
app.use(express.json());
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});
```

Then rebuild with `npm run build` and restart.

## Common VCP Scenarios

### Scenario 1: Preset Modes

```typescript
// Define presets for different use cases
const presets = {
  work: { brightness: 60, contrast: 50, colorTemp: 6500 },
  gaming: { brightness: 100, contrast: 70, colorTemp: 6500 },
  evening: { brightness: 30, contrast: 50, colorTemp: 3000 },
  presentation: { brightness: 100, contrast: 75, colorTemp: 5500 },
};

function applyPreset(preset: keyof typeof presets) {
  const config = presets[preset];
  ddc.setBrightness(config.brightness);
  ddc.setContrast(config.contrast);
  ddc.setMonitorValue(0x14, config.colorTemp);
  console.log(`Applied ${preset} preset`);
}
```

### Scenario 2: Time-Based Brightness

```typescript
// Auto-adjust brightness based on time of day
const hour = new Date().getHours();

if (hour < 8) {
  ddc.setBrightness(30); // Early morning
} else if (hour < 12) {
  ddc.setBrightness(80); // Morning
} else if (hour < 17) {
  ddc.setBrightness(90); // Afternoon
} else if (hour < 21) {
  ddc.setBrightness(60); // Evening
} else {
  ddc.setBrightness(20); // Night
}
```

### Scenario 3: Input Auto-Detection

```typescript
// Automatically switch to active input
function detectAndSwitch() {
  const monitors = ddc.getMonitors();
  
  if (monitors.length > 0) {
    // Try HDMI first
    if (ddc.switchToHDMI()) {
      console.log("Switched to HDMI");
      return;
    }
    
    // Fallback to DisplayPort
    if (ddc.switchToDisplayPort()) {
      console.log("Switched to DisplayPort");
      return;
    }
    
    console.log("No active input detected");
  }
}
```

## Monitor Firmware Updates

Some monitors require firmware updates for better DDC-CI support:

1. Visit manufacturer's support page
2. Download latest firmware
3. Update via USB or on-monitor procedure
4. Restart monitor and controller

## Next Steps

1. Identify your monitor model
2. Check its manual for supported VCP codes
3. Test with basic commands
4. Create presets for your workflow
5. Integrate with your application

## Reference Resources

- [DDC-CI Specification](https://en.wikipedia.org/wiki/Display_Data_Channel)
- [VESA DDC Standard](https://vesa.org/)
- Monitor manufacturer documentation
- Windows Monitor Configuration API documentation

Happy monitoring! 🎨
