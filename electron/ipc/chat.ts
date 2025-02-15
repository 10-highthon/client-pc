import { ipcMain } from "electron";
import { ChatWindow } from "../windows/ChatWindow";

ipcMain.on("openChat", (evt, channelId) => {
  const chatWin = ChatWindow.isAvailable(channelId);

  if (chatWin) {
    ChatWindow.destroyInstance(channelId);
  } else {
    ChatWindow.getInstance(channelId);
  }
});
