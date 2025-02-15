import { ipcRenderer, contextBridge } from "electron";

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld("ipcRenderer", {
  on(...args: Parameters<typeof ipcRenderer.on>) {
    const [channel, listener] = args;
    return ipcRenderer.on(channel, (event, ...args) =>
      listener(event, ...args)
    );
  },
  off(...args: Parameters<typeof ipcRenderer.off>) {
    const [channel, ...omit] = args;
    return ipcRenderer.off(channel, ...omit);
  },
  send(...args: Parameters<typeof ipcRenderer.send>) {
    const [channel, ...omit] = args;
    return ipcRenderer.send(channel, ...omit);
  },
  sendSync(...args: Parameters<typeof ipcRenderer.sendSync>) {
    const [channel, ...omit] = args;
    ipcRenderer.send(channel, ...omit);

    return new Promise((resolve) => {
      ipcRenderer.once(channel, (_, ...args) => resolve(args));
    });
  },
  invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
    const [channel, ...omit] = args;
    return ipcRenderer.invoke(channel, ...omit);
  },
});

contextBridge.exposeInMainWorld("store", {
  get: (key: string) => {
    ipcRenderer.send("get-store", key);

    return new Promise((resolve) => {
      ipcRenderer.once("get-store-reply", (_, value) => resolve(value));
    });
  },

  set: (key: string, value: any) => {
    ipcRenderer.send("set-store", key, value);
  },
});
