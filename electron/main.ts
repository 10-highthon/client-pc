import { app, session } from "electron";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { MainWindow } from "./windows/MainWindow";
import Store from "electron-store";
import { StoreOptions } from "./options/options";
import { BackgroundWindow } from "./windows/BackgroundWindow";
import { getLiveDetails } from "./libs/favorite";
import { createUser } from "./libs/user";
import "./ipc";

const store = new Store<StoreOptions>();

// const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, "..");

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
export const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
export const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, "public")
  : RENDERER_DIST;

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  MainWindow.getInstance();
  BackgroundWindow.getInstance();
});

app.whenReady().then(async () => {
  store.set("app_start", false);
  store.set("user", "fe2ebfc4-f6e5-49d4-bf6a-e5fe70051e08");

  if (!store.get("user")) {
    const { id } = await createUser();
    store.set("user", id);
  }

  const { channels } = await getLiveDetails();

  const autoStart: StoreOptions["autoStart"] = {};
  for (const { channel } of channels) {
    autoStart[channel.channelId] = {
      enabled: true,
      closed: false,
      status: false,
    };
  }

  store.set("autoStart", autoStart);

  const pipOptions: StoreOptions["pipOptions"] = {};
  for (const { channel } of channels) {
    pipOptions[channel.channelId] = {
      size: {
        width: 480,
        height: 270,
      },
      location: {
        x: 0,
        y: 0,
      },
      volume: 0.5,
      opacity: 1,
    };
  }

  store.set("pipOptions", pipOptions);

  if (!store.get("chzzkSession")) {
    store.set("chzzkSession", "");
  } else {
    try {
      store
        .get("chzzkSession")
        .split(";")
        .forEach((e) => {
          if (e === "") return;
          const cookie = {
            url: "https://chzzk.naver.com",
            name: e.split("=")[0],
            value: e.split("=")[1],
            domain: ".naver.com",
            secure: true,
          };
          session.defaultSession.cookies.set(cookie);
        });
    } catch {
      store.set("chzzkSession", "");
    }
  }

  MainWindow.getInstance();
  BackgroundWindow.getInstance();
});
