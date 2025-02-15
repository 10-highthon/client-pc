// import { ipcRenderer } from "electron";
// import Store from "electron-store";
// import { StoreOptions } from "../../../electron/options/options";

const Background = () => {
  // const store = new Store<StoreOptions>();
  // let getStream: NodeJS.Timeout;
  // ipcRenderer.on("login", () => {
  //   getStream = setInterval(() => {
  //     const autoStart = store.get("autoStart");
  //     store.get("pip_order").forEach((e) => {
  //       if (
  //         auto_start[e].enabled &&
  //         !auto_start[e].closed &&
  //         !auto_start[e].status
  //       ) {
  //         ipcRenderer.send("getStream", e);
  //       } else if (auto_start[e].closed && !auto_start[e].status) {
  //         ipcRenderer.send("isStreamOff", e);
  //       } else if (!auto_start[e].status && spaceSetting) {
  //         ipcRenderer.send("getSpace", e);
  //       } else if (!auto_start[e].status) {
  //         ipcRenderer.send("isSpaceOff", e);
  //       }
  //     });
  //   }, 10000);
  // });

  return <div />;
};

export default Background;
