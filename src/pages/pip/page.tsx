import styled from "styled-components";
import { useSearchParams } from "react-router";
import { useEffect, useRef } from "react";
import Hls from "hls.js";

const docQuery = (element: string): HTMLElement => {
  return document.querySelector(element)!;
};

const Pip = () => {
  const draggableRef = useRef<HTMLDivElement>(null);

  const video = document.createElement("video");
  const panelRef = useRef<HTMLDivElement>(null);

  const [searchParams] = useSearchParams();

  const channelId = searchParams.get("channelId") ?? "";
  const videoURL = searchParams.get("url") ?? "";

  const windowClose = () => window.ipcRenderer.send("closePIP", channelId);

  window.onresize = () => {
    const location = {
      x: window.screenLeft,
      y: window.screenTop,
    };

    window.ipcRenderer.send("resizePIP", {
      channelId,
      size: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
      location,
    });
  };

  async function test2() {
    const hls = new Hls();
    hls.loadSource(videoURL.replace(/\\/g, "/"));
    hls.attachMedia(video);
    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      video.play();
    });
    video.volume = parseFloat(
      await window.store.get(`pipOptions.${channelId}.volume`)
    );
    video.addEventListener("loadedmetadata", () => {
      video.currentTime = video.duration;
    });

    hls.on(Hls.Events.ERROR, (_, data) => {
      if (data.fatal) {
        switch (data.type) {
          case Hls.ErrorTypes.NETWORK_ERROR:
            console.error("Network error encountered", data);
            hls.startLoad();
            break;
          case Hls.ErrorTypes.MEDIA_ERROR:
            console.error("Media error encountered", data);
            hls.recoverMediaError();
            break;
          default:
            hls.destroy();
            console.error("Unrecoverable error encountered", data);
            break;
        }
      }
    });

    video.addEventListener("progress", () => {
      if (video.paused)
        docQuery(".control_time .control_progress").style.width =
          (video.currentTime / video.duration) * 100 + "%";
    });

    let realTimeTemp = false;
    video.addEventListener("timeupdate", () => {
      docQuery(".control_time .control_progress").style.width =
        (video.currentTime / video.duration) * 100 + "%";
      if (video.currentTime <= video.duration - 4) {
        const realTimeText = docQuery(".real_time p");
        const realTimeSpan = docQuery(".real_time span");
        const time = video.duration - video.currentTime;
        const hour = Math.floor(time / 3600);
        const minute = Math.floor((time - hour * 3600) / 60);
        const second = Math.floor(time - hour * 3600 - minute * 60);
        realTimeText.innerText = `-${hour}:${minute}:${second}`;
        realTimeSpan.style.backgroundColor = "rgba(255, 255, 255, 0.40)";
        realTimeTemp = false;
      } else if (!realTimeTemp) {
        const realTimeText = docQuery(".real_time p");
        const realTimeSpan = docQuery(".real_time span");
        realTimeText.innerText = "실시간";
        realTimeSpan.style.backgroundColor = "#79EC84";
        realTimeTemp = true;
      }
    });

    panelRef.current!.appendChild(video);

    docQuery("#draggable")?.addEventListener("mousedown", () => {
      const moveHandler = (e: MouseEvent) => {
        console.log(e.movementX, e.movementY);
        window.ipcRenderer.send("movePIP", {
          channelId,
          x: e.movementX,
          y: e.movementY,
        });
      };
      const upHandler = () => {
        window.removeEventListener("mousemove", moveHandler);
        window.removeEventListener("mouseup", upHandler);
      };
      window.addEventListener("mousemove", moveHandler);
      window.addEventListener("mouseup", upHandler);
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }

  useEffect(() => {
    test2();
  }, []);

  async function test() {
    let soundTemp: number = parseFloat(
      (await window.store.get(`pipOptions.${channelId}.volume`)) ?? 1
    );

    docQuery(".control_volume .control_progress").style.height =
      parseFloat(await window.store.get(`pipOptions.${channelId}.volume`)) *
        100 +
      "%";

    function volumeControl(e: MouseEvent) {
      const barTop = docQuery(
        ".control_volume .control_background"
      ).getBoundingClientRect().top;
      const barBotom =
        docQuery(".control_volume .control_background").getBoundingClientRect()
          .bottom - barTop;
      if (e.clientY - barTop > 0 && e.clientY - barTop < barBotom) {
        const volume = 1 - (e.clientY - barTop) / barBotom;
        video.volume = volume;
        window.store.set(`pipOptions.${channelId}.volume`, volume);
        docQuery(".control_volume .control_progress").style.height =
          volume * 100 + "%";
        (docQuery(".control_volume img") as HTMLImageElement).src =
          "/public/sound.svg";
      } else if (e.clientY - barTop <= 0) {
        video.volume = 1;
        window.store.set(`pipOptions.${channelId}.volume`, 1);
        docQuery(".control_volume .control_progress").style.height = "100%";
      } else if (e.clientY - barTop >= barBotom) {
        video.volume = 0;
        window.store.set(`pipOptions.${channelId}.volume`, 0);
        docQuery(".control_volume .control_progress").style.height = "0%";
        (docQuery(".control_volume img") as HTMLImageElement).src =
          "/public/sound_off.svg";
      }
      soundTemp = video.volume;
    }

    docQuery(".control_volume .control_background").addEventListener(
      "mousedown",
      volumeControl
    );

    docQuery(".control_volume .control_thumb").addEventListener(
      "mousedown",
      () => {
        const moveHandler = (e: MouseEvent) => {
          docQuery(".control_volume .control_background").removeEventListener(
            "mousedown",
            volumeControl
          );
          volumeControl(e);
        };
        const upHandler = () => {
          window.removeEventListener("mousemove", moveHandler);
          window.removeEventListener("mouseup", upHandler);
          docQuery(".control_volume .control_background").addEventListener(
            "mousedown",
            volumeControl
          );
        };
        window.addEventListener("mousemove", moveHandler);
        window.addEventListener("mouseup", upHandler);
      }
    );

    docQuery(".control_volume img").addEventListener("click", () => {
      if (video.volume) {
        video.volume = 0;
        window.store.set(`pipOptions.${channelId}.volume`, 0);
        docQuery(".control_volume .control_progress").style.height = "0%";
        (docQuery(".control_volume img") as HTMLImageElement).src =
          "/assets/sound_off.svg";
      } else {
        video.volume = soundTemp;
        window.store.set(`pipOptions.${channelId}.volume`, soundTemp);
        docQuery(".control_volume .control_progress").style.height =
          soundTemp * 100 + "%";
        (docQuery(".control_volume img") as HTMLImageElement).src =
          "/public/sound.svg";
      }
    });

    docQuery(".control_opacity .control_progress").style.height =
      ((await window.store.get(`pipOptions.${channelId}.opacity`)) as number) *
        100 +
      "%";

    async function opacityControl(e) {
      const barTop = docQuery(
        ".control_opacity .control_background"
      ).getBoundingClientRect().top;
      const barBotom =
        docQuery(".control_opacity .control_background").getBoundingClientRect()
          .bottom - barTop;

      let opacity = 0;
      if (e.clientY - barTop > 0 && e.clientY - barTop < barBotom) {
        if (1 - (e.clientY - barTop) / barBotom < 0.1) {
          window.store.set(`pip_options.${channelId}.opacity`, 0.1);
          opacity = 0.1;
        } else {
          window.store.set(
            `pip_options.${channelId}.opacity`,
            1 - (e.clientY - barTop) / barBotom
          );
          opacity = 1 - (e.clientY - barTop) / barBotom;
        }
        docQuery(".control_opacity .control_progress").style.height =
          (1 - (e.clientY - barTop) / barBotom) * 100 + "%";
      } else if (e.clientY - barTop <= 0) {
        window.store.set(`pip_options.${channelId}.opacity`, 1);
        opacity = 1;
        docQuery(".control_opacity .control_progress").style.height = "100%";
      } else if (e.clientY - barTop >= barBotom) {
        window.store.set(`pip_options.${channelId}.opacity`, 0.1);
        opacity = 0.1;
        docQuery(".control_opacity .control_progress").style.height = "0%";
      }
      window.ipcRenderer.send("changeOpacity", channelId, opacity);
    }

    docQuery(".control_opacity .control_background").addEventListener(
      "mousedown",
      opacityControl
    );

    docQuery(".control_opacity .control_thumb").addEventListener(
      "mousedown",
      (e) => {
        const moveHandler = (e) => {
          docQuery(".control_opacity .control_background").removeEventListener(
            "mousedown",
            opacityControl
          );
          opacityControl(e);
        };
        const upHandler = () => {
          window.removeEventListener("mousemove", moveHandler);
          window.removeEventListener("mouseup", upHandler);
          docQuery(".control_opacity .control_background").addEventListener(
            "mousedown",
            opacityControl
          );
        };
        window.addEventListener("mousemove", moveHandler);
        window.addEventListener("mouseup", upHandler);
      }
    );

    docQuery(".control_time .control_background").addEventListener(
      "click",
      (e) => {
        const barLeft = docQuery(
          ".control_time .control_background"
        ).getBoundingClientRect().left;
        const barRight =
          docQuery(".control_time .control_background").getBoundingClientRect()
            .right - barLeft;
        if (e.clientX - barLeft > 0 && e.clientX - barLeft < barRight) {
          video.currentTime =
            video.duration * ((e.clientX - barLeft) / barRight);
          docQuery(".control_time .control_progress").style.width =
            (video.currentTime / video.duration) * 100 + "%";
        }
      }
    );

    docQuery(".control_time .control_thumb").addEventListener(
      "mousedown",
      (e) => {
        const moveHandler = (e) => {
          const barLeft = docQuery(
            ".control_time .control_background"
          ).getBoundingClientRect().left;
          const barRight =
            docQuery(
              ".control_time .control_background"
            ).getBoundingClientRect().right - barLeft;
          if (e.clientX - barLeft > 0 && e.clientX - barLeft < barRight) {
            video.currentTime =
              video.duration * ((e.clientX - barLeft) / barRight);
            docQuery(".control_time .control_progress").style.width =
              (video.currentTime / video.duration) * 100 + "%";
          }
        };
        const upHandler = () => {
          window.removeEventListener("mousemove", moveHandler);
          window.removeEventListener("mouseup", upHandler);
        };
        window.addEventListener("mousemove", moveHandler);
        window.addEventListener("mouseup", upHandler);
      }
    );

    function panelMouseEnter() {
      window.ipcRenderer.send("fixedPIP", true, { forward: true });
    }
    function panelMouseLeave() {
      window.ipcRenderer.send("fixedPIP", false);
    }

    docQuery(".not_fixed").addEventListener("click", () => {
      docQuery(".panel").classList.add("panel_fixed");
      docQuery(".fixed").style.display = "flex";
      docQuery(".panel").addEventListener("mouseenter", panelMouseEnter);
      docQuery(".panel").addEventListener("mouseleave", panelMouseLeave);
    });

    docQuery(".fixed").addEventListener("click", () => {
      docQuery(".panel").classList.remove("panel_fixed");
      docQuery(".fixed").style.display = "none";
      docQuery(".panel").removeEventListener("mouseenter", panelMouseEnter);
      docQuery(".panel").removeEventListener("mouseleave", panelMouseLeave);
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }

  useEffect(() => {
    test();
  }, []);

  return (
    <Container>
      <div className="fixed">
        <img src="/pin_fixed.svg" />
      </div>
      <div id="panel" className="panel" ref={panelRef}>
        <div className="draggable" id="draggable" ref={draggableRef}></div>
        <div className="header">
          <div className="real_time">
            <span></span>

            <p>실시간</p>
          </div>
          <div className="header_button_container">
            <div className="header_button not_fixed">
              <img src="/pin.svg" />
            </div>
            <div className="header_button close_pip" onClick={windowClose}>
              <img src="/close_pip.svg" id="close" />
            </div>
          </div>
        </div>
        <div className="controls">
          <div className="control_item control_opacity">
            <input type="range" id="opacity" min="0" max="1" />
            <label htmlFor="opacity">
              <div className="control_background">
                <div className="control_bar">
                  <div className="control_progress">
                    <div className="control_thumb"></div>
                  </div>
                </div>
              </div>
            </label>
            <img src="/opacity.svg" />
          </div>
          <div className="control_item control_volume">
            <input
              type="range"
              id="volume"
              min="0"
              max="1"
              onChange={(e) => {
                video.volume = parseFloat(e.target.value);
              }}
            />
            <label htmlFor="volume">
              <div className="control_background">
                <div className="control_bar">
                  <div className="control_progress">
                    <div className="control_thumb"></div>
                  </div>
                </div>
              </div>
            </label>
            <img src="/sound.svg" />
          </div>
        </div>
        <div className="control_play">
          <img src="/pause.svg" id="play" />
        </div>
        <div className="controls_bottom">
          <div className="control_time">
            <label htmlFor="time">
              <div className="control_background">
                <div className="control_bar">
                  <div className="control_progress">
                    <div className="control_thumb"></div>
                  </div>
                </div>
              </div>
            </label>
            <div className="move_time">
              <p
                className="minus10sec"
                onClick={() => {
                  video.currentTime = Math.max(video.currentTime - 10, 2);
                }}
              >
                (-10)
              </p>
              <p
                className="plus10sec"
                onClick={() => {
                  const newTime = video.currentTime + 10;
                  if (newTime < video.duration) {
                    video.currentTime = newTime;
                  } else {
                    video.currentTime = video.duration - 1;
                  }
                }}
              >
                (+10)
              </p>
            </div>
            <input type="range" id="time" min="0" value="0" readOnly />
          </div>
          <div
            className="control_chat"
            onClick={() => window.ipcRenderer.send("openChat", channelId)}
          >
            <img src="/chat.svg" />
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Pip;

const Container = styled.div`
  * {
    margin: 0;
    padding: 0;
    -webkit-user-drag: none;
    user-select: none;
  }

  width: 100dvw;
  height: 100dvh;
  background-color: #0e0e10;
  overflow: hidden;

  .fixed {
    display: none;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 8px;
    right: 44px;
    width: 32px;
    height: 32px;
    cursor: pointer;
    z-index: 1000;
  }
  .fixed img {
    width: 20px;
    height: 20px;
  }

  .panel {
    width: 100%;
    height: 100%;
  }
  .panel * {
    z-index: 1000;
  }
  .panel:hover .draggable {
    background-color: rgba(0, 0, 0, 0.5);
  }
  .panel:hover .header,
  .panel:hover .controls,
  .panel:hover .controls_bottom,
  .panel:hover .control_play {
    display: flex;
  }
  .panel_fixed .header,
  .panel_fixed .controls,
  .panel_fixed .controls_bottom,
  .panel_fixed .control_play,
  .panel_fixed .draggable {
    display: none !important;
  }

  .draggable {
    position: fixed;
    width: 100%;
    height: 100%;
    z-index: 2 !important;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .header {
    margin: 8px;
    margin-bottom: 0;
    padding-left: 8px;
    display: none;
    justify-content: space-between;
    align-items: center;
  }
  .header .real_time {
    display: flex;
    align-items: center;
  }
  .header .real_time p {
    color: #ffffff;
    font-family: "SUIT";
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: 150%;
    display: flex;
    align-items: center;
  }
  .header .real_time span {
    display: block;
    margin-right: 8px;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: #79ec84;
  }
  .header .header_button_container {
    display: flex;
    gap: 4px;
  }
  .header .header_button {
    width: 32px;
    height: 32px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }

  .controls {
    padding-bottom: 6px;
    display: none;
    gap: 12px;
    position: absolute;
    top: 52px;
    left: 12px;
    bottom: 8px;
  }
  .controls .control_item {
    display: flex;
    flex-direction: column;
    gap: 16px;
    align-items: center;
  }
  .controls .control_item input[type="range"] {
    display: none;
  }
  .controls .control_item label {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1 0 0;
    align-self: stretch;
  }
  .controls .control_item .control_background {
    width: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1 0 0;
    cursor: pointer;
  }
  .controls .control_item .control_bar {
    width: 2px;
    flex: 1 0 0;
    background-color: rgba(255, 255, 255, 0.4);
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
  }
  .controls .control_item .control_progress {
    width: 100%;
    min-height: 4px;
    background-color: #ffffff;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  }
  .controls .control_item .control_thumb {
    width: 12px;
    height: 4px;
    border-radius: 2px;
    background-color: #ffffff;
    cursor: pointer;
    transform: translateX(-40%);
  }
  .controls .control_volume img {
    cursor: pointer;
    width: 20px;
    height: 20px;
  }

  .control_play {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 48px;
    height: 48px;
    display: none;
    justify-content: center;
    cursor: pointer;
  }

  .controls_bottom {
    position: absolute;
    left: 76px;
    right: 12px;
    bottom: 8px;
    padding-left: 8px;
    display: none;
    align-items: center;
    gap: 16px;
  }
  .controls_bottom .control_time {
    height: 12px;
    display: flex;
    align-items: center;
    flex: 1 0 0;
    position: relative;
  }
  .controls_bottom .control_time input {
    display: none;
  }
  .controls_bottom .control_time label {
    display: flex;
    align-items: center;
    flex: 1 0 0;
    align-self: stretch;
  }
  .controls_bottom .control_time .control_background {
    height: 12px;
    display: flex;
    align-items: center;
    flex: 1 0 0;
    cursor: pointer;
  }
  .controls_bottom .control_time .control_bar {
    height: 2px;
    flex: 1 0 0;
    background-color: rgba(255, 255, 255, 0.4);
    display: flex;
    justify-content: flex-start;
  }
  .controls_bottom .control_time .control_progress {
    height: 2px;
    min-width: 12px;
    background-color: #ffffff;
    display: flex;
    justify-content: flex-end;
  }
  .controls_bottom .control_time .control_thumb {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: #ffffff;
    cursor: pointer;
    transform: translateY(-40%);
  }
  .controls_bottom .control_time .move_time {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }
  .controls_bottom .control_time .move_time p {
    color: #ffffff;
    font-family: "SUIT";
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: 150%;
    display: flex;
    align-items: center;
    margin-left: 16px;
    cursor: pointer;
  }
  .controls_bottom .control_chat {
    display: flex;
    width: 32px;
    height: 32px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }
  .controls_bottom .control_chat img {
    width: 20px;
    height: 20px;
  }
  .disabled {
    filter: invert(23%) sepia(0%) saturate(1465%) hue-rotate(203deg)
      brightness(105%) contrast(72%) !important;
    cursor: default !important;
  }

  video {
    position: fixed;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 1 !important;
  }
`;
