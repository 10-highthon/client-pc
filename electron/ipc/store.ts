import { ipcMain } from "electron";
import Store from "electron-store";

const store = new Store();

ipcMain.on("get-store", (evt, key) => {
  const data = store.get(key);

  evt.reply("get-store-reply", data);
});

ipcMain.on("set-store", (evt, key, value) => {
  store.set(key, value);
});
