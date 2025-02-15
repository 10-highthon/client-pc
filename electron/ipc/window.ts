import { ipcMain } from "electron";
import Store from "electron-store";
import { PIPWindow } from "../windows/PIPWindow";
import { StoreOptions } from "../options/options";
import { ChatWindow } from "../windows/ChatWindow";
import { MainWindow } from "../windows/MainWindow";

const store = new Store<StoreOptions>();

ipcMain.on("movePIP", (evt, arg) => {
  const streamWin = PIPWindow.getInstance(arg.channelId);

  const currentPostion = streamWin!.pip!.getPosition();
  const newPosition = {
    x: currentPostion[0] + arg.x,
    y: currentPostion[1] + arg.y,
  };
  streamWin!.pip!.setBounds({
    x: newPosition.x,
    y: newPosition.y,
    width: store.get("pipOptions")[arg.channelId].size.width,
    height: store.get("pipOptions")[arg.channelId].size.height,
  });
  store.set(`pipOptions.${arg.channelId}.location`, newPosition);
});

ipcMain.on("resizePIP", (evt, arg) => {
  store.set(`pipOptions.${arg.channelId}.size`, arg.size);
  store.set(`pipOptions.${arg.channelId}.location`, arg.location);
});

ipcMain.on("changeOpacity", (evt, channelId, opacity) => {
  const streamWin = PIPWindow.getInstance(channelId);
  streamWin!.pip!.setOpacity(opacity);
});

// ipcMain.on("fixedPIP", (evt, fixed, option) => {
//   const pip = BrowserWindow.fromWebContents(evt.sender);
//   pip.resizable = !fixed;
//   pip.setIgnoreMouseEvents(fixed, option);
// });

ipcMain.on("closePIP", (evt, channelId) => {
  PIPWindow.destroyInstance(channelId);

  const chatWin = ChatWindow.isAvailable(channelId);
  if (chatWin) {
    ChatWindow.destroyInstance(channelId);
  }

  store.set(`autoStart.${channelId}.status`, false);
  store.set(`autoStart.${channelId}.closed`, true);
});

ipcMain.on("minimizeMainWin", () => {
  const mainWin = MainWindow.getInstance();
  mainWin.minimize();
});
