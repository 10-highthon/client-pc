import { BrowserWindow } from "electron";
import Store from "electron-store";
import { StoreOptions } from "../options/options";

const store = new Store<StoreOptions>();

export class PIPWindow {
  private static instance: {
    [id: string]: {
      pip: BrowserWindow;
      points: BrowserWindow;
    };
  } = {};

  private constructor() {}

  public static getInstance(id: string, url: string): BrowserWindow {
    if (!this.instance?.[id]) {
      this.createWindow(id, url);
    }
    return this.instance![id].pip;
  }

  private static createWindow(id: string, url: string): void {
    this.instance[id].pip = new BrowserWindow({
      width: store.get("pipOptions")[id].size.width,
      height: store.get("pipOptions")[id].size.height,
      minWidth: 240,
      minHeight: 135,
      webPreferences: {
        contextIsolation: false,
        nodeIntegration: true,
        webSecurity: false,
        partition: id,
      },
      frame: false,
      resizable: true,
      maximizable: false,
      skipTaskbar: true,
      x: store.get("pipOptions")[id].location.x,
      y: store.get("pipOptions")[id].location.y,
      opacity: store.get("pipOptions")[id].opacity,
    });
    this.instance[id].pip.setAspectRatio(16 / 9);
    this.instance[id].pip.setMenu(null);
    this.instance[id].pip.loadURL(
      `file://${__dirname}/index.html#pip?url=${url}&id=${id}`
    );
    this.instance[id].pip.setAlwaysOnTop(true, "screen-saver");
    this.instance[id].pip.setVisibleOnAllWorkspaces(true);

    this.createLiveWindow(id);
  }

  private static createLiveWindow(id: string): void {
    this.instance[id].points = new BrowserWindow({
      show: false,
      width: 1280,
      height: 720,
    });

    this.instance[id].points.loadURL("https://chzzk.naver.com/live/" + id, {
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
    });
    this.instance[id].points.webContents.setAudioMuted(true);
    this.instance[id].points.webContents.on("did-finish-load", () => {
      this.instance[id].points.webContents.executeJavaScript(
        `setTimeout(() => {
        document.querySelector("#layout-body > section > div > main > div.live_information_contents__ms0SV > div.live_information_player__uFFcH > div.live_information_video_dimmed__Hrmtd > div > div:nth-child(4) > button").click();
      }, 3000);`
      );
    });
  }
}
