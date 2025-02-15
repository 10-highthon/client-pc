import { BrowserWindow } from "electron";
import { getURL } from "../utils/url";

export class BackgroundWindow {
  private static instance: BrowserWindow | null = null;

  private constructor() {}

  public static getInstance(): BackgroundWindow {
    if (!this.instance) {
      this.createWindow();
    }
    return this.instance!;
  }

  private static createWindow(): void {
    this.instance = new BrowserWindow({
      show: false,
      webPreferences: {
        contextIsolation: false,
        nodeIntegration: true,
      },
    });

    this.instance.loadURL(getURL("/background"));
  }
}
