import express from "express";
import DDCMonitor, { INPUT_SOURCES } from "./ddc-monitor-js";
import os from "os";

const app = express();
const PORT = 3000;

// Initialize DDC Monitor
const ddc = new DDCMonitor();

// Middleware
app.use(express.json());

/**
 * Get connected monitors
 */
app.get("/api/monitors", (req, res) => {
  try {
    const monitors = ddc.getMonitors();
    res.json({
      success: true,
      monitors: monitors,
      count: monitors.length,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: String(error) });
  }
});

/**
 * Get monitor capabilities
 */
app.get("/api/capabilities", (req, res) => {
  try {
    const caps = ddc.getCapabilities();
    res.json({ success: true, capabilities: caps });
  } catch (error) {
    res.status(500).json({ success: false, error: String(error) });
  }
});

/**
 * Select active monitor for subsequent operations
 * GET /api/monitor/select/0
 */
app.get("/api/monitor/select/:handle", (req, res) => {
  try {
    const handle = parseInt(req.params.handle, 10);
    if (isNaN(handle) || handle < 0) {
      return res.status(400).json({
        success: false,
        error: "Invalid monitor handle",
      });
    }
    ddc.selectMonitor(handle);
    res.json({
      success: true,
      selected: handle,
      message: `Monitor ${handle} selected for operations`,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: String(error) });
  }
});

/**
 * Get current selected monitor
 */
app.get("/api/monitor/selected", (req, res) => {
  try {
    const selected = ddc.getSelectedMonitor();
    res.json({
      success: true,
      selected: selected,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: String(error) });
  }
});

/**
 * Set brightness for specific monitor
 * GET /api/monitor/0/brightness/75
 */
app.get("/api/monitor/:handle/brightness/:value", (req, res) => {
  try {
    const handle = parseInt(req.params.handle, 10);
    const value = parseInt(req.params.value, 10);

    if (isNaN(handle) || handle < 0) {
      return res.status(400).json({
        success: false,
        error: "Invalid monitor handle",
      });
    }

    if (isNaN(value) || value < 0 || value > 100) {
      return res.status(400).json({
        success: false,
        error: "Brightness must be between 0 and 100",
      });
    }

    const success = ddc.setBrightness(value, handle);
    res.json({
      success: success,
      monitor: handle,
      brightness: value,
      message: success
        ? `Monitor ${handle} brightness set to ${value}`
        : `Failed to set brightness on monitor ${handle}`,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: String(error) });
  }
});

/**
 * Get brightness for specific monitor
 * GET /api/monitor/0/brightness
 */
app.get("/api/monitor/:handle/brightness", (req, res) => {
  try {
    const handle = parseInt(req.params.handle, 10);
    if (isNaN(handle) || handle < 0) {
      return res.status(400).json({
        success: false,
        error: "Invalid monitor handle",
      });
    }

    const brightness = ddc.getBrightness(handle);
    res.json({
      success: brightness !== undefined,
      monitor: handle,
      brightness: brightness,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: String(error) });
  }
});

/**
 * Set contrast for specific monitor
 * GET /api/monitor/0/contrast/50
 */
app.get("/api/monitor/:handle/contrast/:value", (req, res) => {
  try {
    const handle = parseInt(req.params.handle, 10);
    const value = parseInt(req.params.value, 10);

    if (isNaN(handle) || handle < 0) {
      return res.status(400).json({
        success: false,
        error: "Invalid monitor handle",
      });
    }

    if (isNaN(value) || value < 0 || value > 100) {
      return res.status(400).json({
        success: false,
        error: "Contrast must be between 0 and 100",
      });
    }

    const success = ddc.setContrast(value, handle);
    res.json({
      success: success,
      monitor: handle,
      contrast: value,
      message: success
        ? `Monitor ${handle} contrast set to ${value}`
        : `Failed to set contrast on monitor ${handle}`,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: String(error) });
  }
});

/**
 * Get contrast for specific monitor
 * GET /api/monitor/0/contrast
 */
app.get("/api/monitor/:handle/contrast", (req, res) => {
  try {
    const handle = parseInt(req.params.handle, 10);
    if (isNaN(handle) || handle < 0) {
      return res.status(400).json({
        success: false,
        error: "Invalid monitor handle",
      });
    }

    const contrast = ddc.getContrast(handle);
    res.json({
      success: contrast !== undefined,
      monitor: handle,
      contrast: contrast,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: String(error) });
  }
});

/**
 * Set brightness (0-100)
 * GET /api/brightness/75
 */
app.get("/api/brightness/:value", (req, res) => {
  try {
    const value = parseInt(req.params.value, 10);
    if (isNaN(value) || value < 0 || value > 100) {
      return res.status(400).json({
        success: false,
        error: "Brightness must be between 0 and 100",
      });
    }
    const success = ddc.setBrightness(value);
    res.json({
      success: success,
      message: success
        ? `Brightness set to ${value}`
        : "Failed to set brightness",
    });
  } catch (error) {
    res.status(500).json({ success: false, error: String(error) });
  }
});

/**
 * Get current brightness
 */
app.get("/api/brightness", (req, res) => {
  try {
    const brightness = ddc.getBrightness();
    res.json({
      success: brightness !== undefined,
      brightness: brightness,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: String(error) });
  }
});

/**
 * Set contrast (0-100)
 */
app.get("/api/contrast/:value", (req, res) => {
  try {
    const value = parseInt(req.params.value, 10);
    if (isNaN(value) || value < 0 || value > 100) {
      return res.status(400).json({
        success: false,
        error: "Contrast must be between 0 and 100",
      });
    }
    const success = ddc.setContrast(value);
    res.json({
      success: success,
      message: success ? `Contrast set to ${value}` : "Failed to set contrast",
    });
  } catch (error) {
    res.status(500).json({ success: false, error: String(error) });
  }
});

/**
 * Get current contrast
 */
app.get("/api/contrast", (req, res) => {
  try {
    const contrast = ddc.getContrast();
    res.json({
      success: contrast !== undefined,
      contrast: contrast,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: String(error) });
  }
});

/**
 * Switch to HDMI
 */
app.get("/api/input/hdmi", (req, res) => {
  try {
    const success = ddc.switchToHDMI();
    res.json({
      success: success,
      message: success ? "Switched to HDMI" : "Failed to switch to HDMI",
    });
  } catch (error) {
    res.status(500).json({ success: false, error: String(error) });
  }
});

/**
 * Switch to DisplayPort
 */
app.get("/api/input/dp", (req, res) => {
  try {
    const success = ddc.switchToDisplayPort();
    res.json({
      success: success,
      message: success ? "Switched to DisplayPort" : "Failed to switch to DisplayPort",
    });
  } catch (error) {
    res.status(500).json({ success: false, error: String(error) });
  }
});

/**
 * Set input source (generic)
 * e.g., /api/input/0x12 for HDMI 2
 */
app.get("/api/input/:source", (req, res) => {
  try {
    const source = parseInt(req.params.source, 16) || parseInt(req.params.source, 10);
    if (isNaN(source)) {
      return res.status(400).json({
        success: false,
        error: "Invalid source code",
      });
    }
    const success = ddc.setInputSource(source);
    res.json({
      success: success,
      source: source,
      message: success ? `Input set to 0x${source.toString(16)}` : "Failed to set input",
    });
  } catch (error) {
    res.status(500).json({ success: false, error: String(error) });
  }
});

/**
 * Power control
 * GET /api/power/on or /api/power/off
 */
app.get("/api/power/:mode", (req, res) => {
  try {
    const mode = req.params.mode.toLowerCase();
    if (mode !== "on" && mode !== "off") {
      return res.status(400).json({
        success: false,
        error: "Mode must be 'on' or 'off'",
      });
    }
    const success = ddc.setPowerMode(mode === "on");
    res.json({
      success: success,
      mode: mode,
      message: success ? `Monitor powered ${mode}` : `Failed to power ${mode}`,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: String(error) });
  }
});

/**
 * Health check / API info
 */
app.get("/api/info", (req, res) => {
  res.json({
    name: "DDC Monitor Controller",
    version: "1.0.0",
    description: "Windows DDC-CI Monitor Control via Native Addon",
    endpoints: {
      monitors: "GET /api/monitors",
      capabilities: "GET /api/capabilities",
      brightness: "GET /api/brightness or GET /api/brightness/:value",
      contrast: "GET /api/contrast or GET /api/contrast/:value",
      input: "GET /api/input/hdmi or GET /api/input/dp or GET /api/input/:source",
      power: "GET /api/power/on or GET /api/power/off",
    },
  });
});

/**
 * Debug endpoint - shows system info and tool status
 */
app.get("/api/debug", (req, res) => {
  res.json({
    timestamp: new Date().toISOString(),
    node_version: process.version,
    platform: process.platform,
    cwd: process.cwd(),
    ddc_info: {
      tools_available: true,
      monitors: ddc.getMonitors(),
    },
  });
});

// Legacy endpoint compatibility
app.get("/hdmi", (req, res) => {
  const success = ddc.switchToHDMI();
  res.send(success ? "Switched to HDMI" : "Error switching to HDMI");
});

app.get("/dp", (req, res) => {
  const success = ddc.switchToDisplayPort();
  res.send(success ? "Switched to DisplayPort" : "Error switching to DP");
});

app.get("/brightness/:value", (req, res) => {
  const value = parseInt(req.params.value, 10);
  const success = ddc.setBrightness(value);
  res.send(
    success ? `Brightness set to ${value}` : "Error setting brightness"
  );
});

app.listen(PORT, "0.0.0.0", () => {
  // Get local IP address
  const interfaces = os.networkInterfaces();
  let localIP = "127.0.0.1";
  
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name] || []) {
      // Skip internal and non-IPv4 addresses
      if (iface.family === "IPv4" && !iface.internal) {
        localIP = iface.address;
        break;
      }
    }
  }
  
  console.log(`\n🖥️  DDC Monitor Controller running on http://${localIP}:${PORT}`);
  console.log(`📡 Local access: http://localhost:${PORT}`);
  console.log(`📡 Network access: http://${localIP}:${PORT}`);
  console.log(`📡 API documentation: http://${localIP}:${PORT}/api/info\n`);
});