# Quick Start Guide

Get your DDC Monitor Controller up and running in 5 minutes!

## 1. Prerequisites (2 minutes)

Make sure you have:
- **Node.js 18+** - [Download](https://nodejs.org/)
- **Visual Studio Build Tools 2022** with C++ workload - [Download](https://visualstudio.microsoft.com/visual-cpp-build-tools/)
- **Python 3.x** - [Download](https://www.python.org/)

Check installation:
```bash
node --version
npm --version
python --version
```

## 2. Install Project (1 minute)

```bash
npm install
```

## 3. Build Native Addon (1 minute)

```bash
npm run rebuild
```

Look for `gyp info ok` in the output.

## 4. Start Server (1 minute)

```bash
npm start
```

You should see:
```
🖥️  DDC Monitor Controller running on http://localhost:3000
📡 API documentation: http://localhost:3000/api/info
```

## 5. Test It Works!

Open a browser or terminal and try:

```bash
# Get monitors
curl http://localhost:3000/api/monitors

# Set brightness to 75%
curl http://localhost:3000/api/brightness/75

# Check brightness
curl http://localhost:3000/api/brightness

# Switch to HDMI
curl http://localhost:3000/api/input/hdmi

# Switch to DisplayPort
curl http://localhost:3000/api/input/dp
```

## API Cheat Sheet

| Action | Command |
|--------|---------|
| Get monitors | `GET /api/monitors` |
| Get brightness | `GET /api/brightness` |
| Set brightness | `GET /api/brightness/75` |
| Get contrast | `GET /api/contrast` |
| Set contrast | `GET /api/contrast/50` |
| Switch to HDMI | `GET /api/input/hdmi` |
| Switch to DP | `GET /api/input/dp` |
| Power on | `GET /api/power/on` |
| Power off | `GET /api/power/off` |
| API info | `GET /api/info` |

## Use in Code

```typescript
import DDCMonitor from "./ddc-monitor";

const ddc = new DDCMonitor();

// Set brightness
ddc.setBrightness(80);

// Switch input
ddc.switchToHDMI();
ddc.switchToDisplayPort();

// Get current value
const brightness = ddc.getBrightness();
console.log(brightness); // { current: 80, max: 100 }
```

## Troubleshooting

### Build fails?
```bash
npm install -g node-gyp
npm config set msvs_version 2022
npm run rebuild
```

### Monitor not responding?
1. Check monitor OSD: Settings → System → DDC/CI → Enable
2. Disconnect from USB hub (use direct HDMI/DP)
3. Restart monitor

### Module not found?
```bash
npm run rebuild
npm run build
npm start
```

## What's Next?

- 📖 Read [README.md](./README.md) for full documentation
- 🔧 Check [SETUP.md](./SETUP.md) for detailed setup
- 📋 See [EXAMPLES.ts](./EXAMPLES.ts) for code examples
- ⚙️ Find [MONITOR_CONFIG.md](./MONITOR_CONFIG.md) for monitor-specific setup

## Tips

✅ **Pro tips:**
- Close the external ClickMonitorDDC tool if running - it may conflict
- Add delays between commands: `await new Promise(r => setTimeout(r, 200))`
- Monitor supports standard VCP codes: 0x10=brightness, 0x60=input
- Run as Administrator if you get permission errors

✅ **Next automation:**
- Time-based brightness adjustments
- Input auto-switching based on active window
- Hardware sensor integration (temperature, light)
- REST API dashboard

## Support

Need help? Check:
1. [SETUP.md](./SETUP.md) - Detailed setup guide
2. [README.md](./README.md) - Full documentation
3. [MONITOR_CONFIG.md](./MONITOR_CONFIG.md) - Monitor-specific guides

Enjoy! 🖥️✨
