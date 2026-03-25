/**
 * DDC Monitor Controller - JavaScript Implementation with External Tool Support
 * Uses Windows Registry (WMI) plus external DDC tool for input switching
 */

import { execSync } from "child_process";
import path from "path";
import fs from "fs";

// Path to ClickMonitorDDC tool if available
// Try multiple paths to handle both development and packaged executable scenarios
const findClickMonitorDDC = (): string | null => {
  const possiblePaths = [
    // Development: dist/../ClickMonitorDDC/...
    path.join(__dirname, "../ClickMonitorDDC/ClickMonitorDDC_7_2.exe"),
    // Packaged executable: snapshot/project/ClickMonitorDDC/...
    path.join(__dirname, "../../ClickMonitorDDC/ClickMonitorDDC_7_2.exe"),
    // Relative to current working directory
    path.resolve("ClickMonitorDDC/ClickMonitorDDC_7_2.exe"),
    // Absolute path if set in environment
    process.env.CLICK_MONITOR_DDC || "",
  ];

  for (const toolPath of possiblePaths) {
    if (toolPath && fs.existsSync(toolPath)) {
      console.log(`✓ ClickMonitorDDC found at: ${toolPath}`);
      return toolPath;
    }
  }
  console.warn(
    "⚠ ClickMonitorDDC tool not found. Checked paths:",
    possiblePaths.filter((p) => p)
  );
  return null;
};

const CLICK_MONITOR_DDC = findClickMonitorDDC();
const hasClickMonitorDDC = CLICK_MONITOR_DDC !== null;

export interface Monitor {
  name: string;
  handle: number;
}

export interface MonitorValue {
  current: number;
  max: number;
}

// VCP Codes for common monitor controls
export const VCP_CODES = {
  BRIGHTNESS: 0x10,
  CONTRAST: 0x12,
  COLOR_TEMP: 0x14,
  INPUT_SOURCE: 0x60,
  POWER_MODE: 0xd6,
};

// Input source values
export const INPUT_SOURCES = {
  HDMI_1: 0x11,
  HDMI_2: 0x12,
  DISPLAYPORT: 0x0f,
  DVI: 0x03,
  VGA: 0x01,
};

/**
 * Pure JavaScript DDC Monitor Controller
 * Uses WMI queries and existing Windows tools
 */
export class DDCMonitor {
  private static readonly TOOLS_DIR = path.join(__dirname, "../tools");
  private selectedMonitor: number = 0; // Default to first monitor

  constructor(monitorHandle?: number) {
    // Initialize with optional monitor selection
    if (monitorHandle !== undefined) {
      this.selectedMonitor = monitorHandle;
    }
  }

  /**
   * Set the active monitor for subsequent operations
   */
  public selectMonitor(handle: number): void {
    this.selectedMonitor = handle;
    console.log(`Monitor ${handle} selected`);
  }

  /**
   * Get currently selected monitor handle
   */
  public getSelectedMonitor(): number {
    return this.selectedMonitor;
  }

  /**
   * Get list of connected monitors using WMI
   */
  public getMonitors(): Monitor[] {
    try {
      // Query Windows WMI for connected monitors
      const cmd = `powershell -Command "Get-WmiObject WmiMonitorBasicDisplayParams -Namespace root\\wmi | Select-Object InstanceName | ConvertTo-Json"`;
      const result = execSync(cmd, { encoding: "utf-8" });

      if (!result || result.trim() === "") {
        return [{ name: "Generic Monitor", handle: 0 }];
      }

      const data = JSON.parse(result);
      const monitors: any[] = Array.isArray(data) ? data : [data];

      return monitors.map((m, i) => ({
        name: m.InstanceName || `Monitor ${i}`,
        handle: i,
      }));
    } catch (error) {
      console.warn("Monitor detection failed, returning default:", error);
      return [{ name: "Generic Monitor", handle: 0 }];
    }
  }

  /**
   * Get monitor capabilities (stub for compatibility)
   */
  public getCapabilities() {
    try {
      const monitors = this.getMonitors();
      return { monitors: monitors.length, selected: this.selectedMonitor };
    } catch {
      return { monitors: 0, selected: this.selectedMonitor };
    }
  }

  /**
   * Set brightness using ClickMonitorDDC tool
   * @param value brightness value (0-100)
   * @param monitorHandle optional monitor handle, uses selected monitor if not provided
   */
  public setBrightness(value: number, monitorHandle?: number): boolean {
    if (!hasClickMonitorDDC) {
      console.error(
        "Brightness control requires ClickMonitorDDC tool. Install it in ./ClickMonitorDDC/"
      );
      return false;
    }

    const clamped = Math.max(0, Math.min(100, value));

    try {
      const cmd = `"${CLICK_MONITOR_DDC}" b ${clamped}`;
      execSync(cmd, { windowsHide: true });
      return true;
    } catch (error) {
      console.error(`Failed to set brightness to ${clamped}:`, error);
      return false;
    }
  }

  /**
   * Get brightness - Not reliably supported via ClickMonitorDDC
   * Returns undefined as monitors don't report brightness via DDC
   * @param monitorHandle optional monitor handle (ignored - get not supported)
   */
  public getBrightness(monitorHandle?: number): MonitorValue | undefined {
    // ClickMonitorDDC doesn't support reading brightness values
    // This is a limitation of DDC protocol on most monitors
    return undefined;
  }

  /**
   * Set contrast using ClickMonitorDDC tool
   * @param value contrast value (0-100)
   * @param monitorHandle optional monitor handle, uses selected monitor if not provided
   */
  public setContrast(value: number, monitorHandle?: number): boolean {
    if (!hasClickMonitorDDC) {
      console.error(
        "Contrast control requires ClickMonitorDDC tool. Install it in ./ClickMonitorDDC/"
      );
      return false;
    }

    const clamped = Math.max(0, Math.min(100, value));

    try {
      const cmd = `"${CLICK_MONITOR_DDC}" c ${clamped}`;
      execSync(cmd, { windowsHide: true });
      return true;
    } catch (error) {
      console.error(`Failed to set contrast to ${clamped}:`, error);
      return false;
    }
  }

  /**
   * Get contrast - Not reliably supported via ClickMonitorDDC
   * Returns undefined as monitors don't report contrast via DDC
   * @param monitorHandle optional monitor handle (ignored - get not supported)
   */
  public getContrast(monitorHandle?: number): MonitorValue | undefined {
    // ClickMonitorDDC doesn't support reading contrast values
    // This is a limitation of DDC protocol on most monitors
    return undefined;
  }

  /**
   * Set input source using external DDC tool
   */
  public setInputSource(source: string | number): boolean {
    if (!hasClickMonitorDDC) {
      console.error(
        "Input switching requires ClickMonitorDDC tool. Install it in ./ClickMonitorDDC/"
      );
      return false;
    }

    try {
      // Convert source to string if it's a number
      const sourceStr = typeof source === "number" ? this.vcpToInputName(source) : source;

      execSync(`"${CLICK_MONITOR_DDC}" s ${sourceStr}`, {
        windowsHide: true,
      });
      return true;
    } catch (error) {
      console.error("Failed to set input source:", error);
      return false;
    }
  }

  /**
   * Convert VCP code to ClickMonitorDDC input name
   */
  private vcpToInputName(vcp: number): string {
    const mapping: { [key: number]: string } = {
      0x01: "VGA",
      0x03: "DVI",
      0x0f: "DisplayPort",
      0x11: "HDMI1",
      0x12: "HDMI2",
      0x13: "HDMI3",
      0x14: "HDMI4",
      0x20: "USB-C",
    };
    return mapping[vcp] || "HDMI1";
  }

  /**
   * Switch to HDMI using external tool
   */
  public switchToHDMI(): boolean {
    if (!hasClickMonitorDDC) {
      console.error("ClickMonitorDDC tool not found");
      return false;
    }

    try {
      execSync(`"${CLICK_MONITOR_DDC}" s HDMI1`, {
        windowsHide: true,
      });
      return true;
    } catch (error) {
      console.error("Failed to switch to HDMI:", error);
      return false;
    }
  }

  /**
   * Switch to DisplayPort using external tool
   */
  public switchToDisplayPort(): boolean {
    if (!hasClickMonitorDDC) {
      console.error("ClickMonitorDDC tool not found");
      return false;
    }

    try {
      execSync(`"${CLICK_MONITOR_DDC}" s DisplayPort1`, {
        windowsHide: true,
      });
      return true;
    } catch (error) {
      console.error("Failed to switch to DisplayPort:", error);
      return false;
    }
  }

  /**
   * Powers monitor on or off
   */
  public setPowerMode(on: boolean): boolean {
    try {
      // This uses WMI power state control - limited support
      const cmd = `powershell -Command "
        (Get-WmiObject -Namespace root\\cimv2 -Class Win32_PnPDevice -Filter 'DeviceID like \\"%%PCI%%VGA%%\\"')|
        Invoke-WmiMethod -Name SetPowerState -ArgumentList @(${on ? "1" : "5"})
      "`;

      execSync(cmd, { windowsHide: true });
      return true;
    } catch (error) {
      console.warn("Power control may not be supported:", error);
      return false;
    }
  }
}

export default DDCMonitor;
