import { ipcMain } from "electron";
import Store from "electron-store";
import { PIPWindow } from "../windows/PIPWindow";
import { StoreOptions } from "../options/options";

const store = new Store<StoreOptions>();

ipcMain.on("movePIP", (evt, arg) => {
  const streamWin = PIPWindow.getInstance(arg.channelId);

  const currentPostion = streamWin.getPosition();
  const newPosition = {
    x: currentPostion[0] + arg.x,
    y: currentPostion[1] + arg.y,
  };
  streamWin.setBounds({
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

ipcMain.on("changeOpacity", (evt, channelId) => {
  const streamWin = PIPWindow.getInstance(channelId);
  streamWin.setOpacity(store.get(`pipOptions.${channelId}.opacity`));
});
