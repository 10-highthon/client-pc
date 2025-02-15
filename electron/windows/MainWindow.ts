import { BrowserWindow } from "electron";

import { getURL } from "../utils/url";

export class MainWindow {
  private static instance: BrowserWindow | null = null;

  private constructor() {}

  public static getInstance(): BrowserWindow {
    if (!this.instance) {
      this.createWindow();
    }
    return this.instance!;
  }

  public static destroyInstance(): void {
    if (this.instance) {
      this.instance.close();
      this.instance = null;
    }
  }

  private static createWindow(): void {
    this.instance = new BrowserWindow({
      width: 560,
      height: 494,
      frame: false,
      resizable: false,
      titleBarStyle: "hidden",
      webPreferences: {
        contextIsolation: false,
        nodeIntegration: true,
      },
    });
    this.instance.loadURL(getURL());
    this.instance.setMenu(null);
    this.instance.on("closed", () => {
      this.instance = null;
    });
  }
}
