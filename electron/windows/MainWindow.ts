import { BrowserWindow } from "electron";

import { getURL } from "../utils/url";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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
        preload: path.join(__dirname, "preload.mjs"),
      },
    });
    this.instance.loadURL(getURL());
    this.instance.setMenu(null);
    this.instance.on("closed", () => {
      this.instance = null;
    });
  }
}
