import { ipcMain } from "electron";
import Store from "electron-store";

const store = new Store();

// ipcMain.on("isStreamOff", async (evt, name) => {
//   const isStream = (await lib.getUserById(name)).content.openLive;
//   const isStream = (await )
//   if (!isStream) store.set(`auto_start.${name}.closed`, false);
// });

// ipcMain.on("isStreamOffWhileOn", async (evt, channelId) => {
//   const isStream = (await lib.getUserById(channelId)).content.openLive;
//   if (!isStream) {
//     streamWin[channelId].pip.close();
//     streamWin[channelId].pip = null;
//     streamWin[channelId].points.close();
//     streamWin[channelId].points = null;
//     if (chatWin[channelId]) {
//       chatWin[channelId].close();
//       chatWin[channelId] = null;
//     }
//     streamWin[channelId] = null;
//     store.set(`auto_start.${channelId}.status`, false);
//     store.set(`auto_start.${channelId}.closed`, false);
//   }
// });
