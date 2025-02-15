import { BrowserWindow } from "electron";
import Store from "electron-store";
import { StoreOptions } from "../options/options";
const store = new Store<StoreOptions>();

export class ChatWindow {
  private static instance: { [id: string]: BrowserWindow | null } = {};

  private constructor() {}

  public static isAvailable(id: string): boolean {
    return !!this.instance[id];
  }

  public static getInstance(id: string): BrowserWindow | null {
    if (!this.instance?.[id]) {
      this.createWindow(id);
    }
    return this.instance![id];
  }

  public static destroyInstance(id: string): void {
    if (this.instance[id]) {
      this.instance[id].close();
      this.instance[id] = null;
    }
  }

  private static createWindow(id: string): void {
    this.instance[id] = new BrowserWindow({
      x:
        store.get("pipOptions")[id].location.x +
        store.get("pipOptions")[id].size.width,
      y: store.get("pipOptions")[id].location.y,
      width: 380,
      height: store.get("pipOptions")[id].size.height,
      webPreferences: {
        webviewTag: true,
      },
      frame: false,
      resizable: true,
      maximizable: false,
      skipTaskbar: true,
    });
  }
}
