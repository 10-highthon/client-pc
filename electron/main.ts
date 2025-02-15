import { app, BrowserWindow, screen } from "electron";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { MainWindow } from "./windows/MainWindow";
import Store from "electron-store";
import { StoreOptions } from "./options/options";
import { BackgroundWindow } from "./windows/BackgroundWindow";

const lock = app.requestSingleInstanceLock();
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

app.whenReady().then(() => {
  store.set("app_start", false);

  if (!store.get("autoStart")) {
    store.set("autoStart", {});
  }

  if (!store.get("pipOptions")) {
    store.set("pip_options", {});
  }

  MainWindow.getInstance();
  BackgroundWindow.getInstance();
});
