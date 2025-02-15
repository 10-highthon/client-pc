import { BrowserWindow } from "electron";
import Store from "electron-store";
import { StoreOptions } from "../options/options";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getURL } from "../utils/url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const store = new Store<StoreOptions>();

interface PIPInstance {
  [id: string]: {
    pip: BrowserWindow | null;
    points: BrowserWindow | null;
  } | null;
}

export class PIPWindow {
  private static instance: PIPInstance = {};

  private constructor() {}

  public static getInstance(
    id: string,
    url?: string
  ): PIPInstance[keyof PIPInstance] {
    if (!this.instance?.[id]) {
      this.createWindow(id, url);
    }
    return this.instance![id];
  }

  public static destroyInstance(id: string): void {
    console.log(this.instance[id]);
    if (
      this.instance[id] &&
      this.instance[id].pip &&
      this.instance[id].points
    ) {
      this.instance[id].pip.close();
      this.instance[id].points.close();
      this.instance[id] = null;
    }
  }

  private static createWindow(id: string, url?: string): void {
    this.instance[id] = {
      pip: null,
      points: null,
    };

    this.instance[id].pip = new BrowserWindow({
      width: store.get("pipOptions")[id].size.width,
      height: store.get("pipOptions")[id].size.height,
      minWidth: 240,
      minHeight: 135,
      webPreferences: {
        nodeIntegration: true,
        webSecurity: false,
        partition: id,
        preload: path.join(__dirname, "preload.mjs"),
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
    this.instance[id].pip.loadURL(getURL(`/pip?url=${url}&channelId=${id}`));
    this.instance[id].pip.setAlwaysOnTop(true, "screen-saver");
    this.instance[id].pip.setVisibleOnAllWorkspaces(true);

    this.createLiveWindow(id);
  }

  private static createLiveWindow(id: string): void {
    if (!this.instance[id]) return;
    if (!this.instance[id]?.pip) return;

    this.instance[id].points = new BrowserWindow({
      show: false,
      width: 1280,
      height: 720,
      webPreferences: {
        nodeIntegration: true,
        preload: path.join(__dirname, "preload.mjs"),
      },
    });

    this.instance[id].points.loadURL("https://chzzk.naver.com/live/" + id, {
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
    });
    this.instance[id].points.webContents.setAudioMuted(true);
    this.instance[id].points.webContents.on("did-finish-load", () => {
      if (!this.instance[id]?.points) return;
      this.instance[id].points.webContents.executeJavaScript(
        `setTimeout(() => {
        document.querySelector("#layout-body > section > div > main > div.live_information_contents__ms0SV > div.live_information_player__uFFcH > div.live_information_video_dimmed__Hrmtd > div > div:nth-child(4) > button").click();
      }, 3000);`
      );
    });
  }
}
