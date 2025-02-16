import { ipcMain, IpcMainEvent } from "electron";
import {
  addFavorite,
  getFavorites,
  getFavoritesAll,
  getLiveDetail,
  searchChannels,
} from "../libs/favorite";
import Store from "electron-store";
import { StoreOptions } from "../options/options";
import { PIPWindow } from "../windows/PIPWindow";

const store = new Store<StoreOptions>();

ipcMain.on("addFavorite", async (_, channelId: string) => {
  await addFavorite(channelId);
  return;
});

ipcMain.on("searchChannels", async (event: IpcMainEvent, query: string) => {
  const channels = await searchChannels(query);
  event.reply("searchChannels", channels);
});

ipcMain.on("getChannelInfo", async (event: IpcMainEvent) => {
  const favorites = await getFavoritesAll();

  const info = favorites.channels.map(async (channel) => {
    const stream = await getLiveDetail(channel.channelId);

    return {
      channelId: channel.channelId,
      displayName: channel.channelName,
      profile: channel.channelImageUrl,
      follows: channel.followerCount,
      startDate: stream?.openDate,
      lastStreamDate: stream?.closeDate,
      isStream: channel.openLive,
      thumbnail: stream.defaultThumbnailImageUrl,
    };
  });

  event.reply("getChannelInfo", await Promise.all(info));
});

ipcMain.on("getThumbnail", async (evt, channelId) => {
  const stream = await getLiveDetail(channelId);
  const thumbnail = stream?.defaultThumbnailImageUrl;
  evt.returnValue = thumbnail;
});

ipcMain.on("getStream", async (_, channelId) => {
  if (store.get("autoStart")[channelId].status) {
    const streamWin = PIPWindow.getInstance(channelId);
    streamWin!.pip!.focus();
    return;
  }

  const isStream = (await getFavorites(channelId)).openLive;
  if (isStream) {
    store.set(`autoStart.${channelId}.status`, true);
    await getLiveDetail(channelId).then((res) => {
      if (res.videoUrl) PIPWindow.getInstance(channelId, res.videoUrl);
    });
  }
});
