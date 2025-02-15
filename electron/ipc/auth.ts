import { ipcMain } from "electron";
import Store from "electron-store";
import { getMyData, loginAndGetSession, logout } from "../libs/login";
import { MainWindow } from "../windows/MainWindow";
import { StoreOptions } from "../options/options";

const store = new Store<StoreOptions>();

ipcMain.on("login", async () => {
  store.set("chzzkSession", await loginAndGetSession());
  const mainWin = MainWindow.getInstance();
  mainWin.webContents.reload();
});

ipcMain.on("logout", () => {
  store.delete("chzzkSession");
  logout();
  const mainWin = MainWindow.getInstance();
  mainWin.webContents.reload();
});

ipcMain.on("getUserProfile", async (evt) => {
  const user = await getMyData(store.get("chzzkSession"));
  if (!user) store.set("chzzkSession", "");
  evt.reply("getUserProfile", {
    name: user?.nickname,
    profile: user?.profileImageUrl,
  });
});
