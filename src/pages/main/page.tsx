import styled from "styled-components";
import Card from "../../components/Card";
import { useEffect, useState } from "react";
import QRModal from "../../components/QRModal";
import SearchModal from "../../components/SearchModal";

const Main = () => {
  const [isShowQR, setIsShowQR] = useState(false);
  const [isShowSearch, setIsShowSearch] = useState(false);
  const [getUserInfo, setGetUserInfo] = useState<any>();
  const [info, setInfo] = useState([]);

  async function test() {
    return await window.ipcRenderer.sendSync("getChannelInfo");
  }

  async function test2() {
    return await window.ipcRenderer.sendSync("getUserProfile");
  }

  useEffect(() => {
    const getStream = setInterval(async () => {
      const autoStart = await window.store.get("autoStart");

      const channels: {
        channelId: string;
      }[] = (await window.ipcRenderer.sendSync("getChannelInfo")).flat();

      for (const channel of channels) {
        console.log(autoStart[channel.channelId]);
        if (
          autoStart[channel.channelId].enabled &&
          !autoStart[channel.channelId].closed &&
          !autoStart[channel.channelId].status
        ) {
          window.ipcRenderer.send("getStream", channel.channelId);
          test().then(setInfo);
        } else if (
          autoStart[channel.channelId].closed &&
          !autoStart[channel.channelId].status
        ) {
          window.ipcRenderer.send("isStreamOff", channel.channelId);
        } else if (!autoStart[channel.channelId].status) {
          window.ipcRenderer.send("isSpaceOff", channel.channelId);
        }
      }
    }, 5000);

    return () => {
      clearInterval(getStream);
    };
  });

  useEffect(() => {
    test().then(setInfo);
    test2().then((res) => setGetUserInfo(res[0]));
  }, []);

  return (
    <Container>
      <Header>
        <div />
        <Buttons>
          <Button onClick={() => setIsShowQR(true)}>
            <img src="/public/qr.svg" />
          </Button>
          <Button onClick={() => setIsShowSearch(true)}>
            <img src="/public/add.svg" />
          </Button>
          <Button onClick={() => location.reload()}>
            <img src="/public/refresh.svg" />
          </Button>
          <Divider>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="2"
              height="16"
              viewBox="0 0 2 16"
              fill="none"
            >
              <path d="M1 0L1 16" stroke="#37373D" />
            </svg>
          </Divider>

          <div
            style={{
              display: "flex",
              gap: "8px",
              alignItems: "center",
            }}
          >
            {getUserInfo && <p>{getUserInfo.name}</p>}
            <Button
              onClick={() => {
                window.ipcRenderer.send("login");
              }}
            >
              <Profile
                style={
                  getUserInfo
                    ? {
                        backgroundImage: `url(${getUserInfo.profile})`,
                      }
                    : {}
                }
              />
            </Button>
          </div>
        </Buttons>
      </Header>
      <Body>
        {info
          .flat()
          .map(
            (v: {
              channelId: string;
              displayName: string;
              profile: string;
              follows: number;
              startDate: string;
              lastStreamDate: string;
              isStream: boolean;
              thumbnail: string;
            }) => (
              <Card
                key={v.channelId}
                channelId={v.channelId}
                name={v.displayName}
                $status={v.isStream ? "OPEN" : "CLOSED"}
                follows={v.follows}
                time={v.isStream ? v.startDate : v.lastStreamDate}
                imageUrl={v.profile}
                defaultThumbnailImageUrl={v.thumbnail}
              />
            )
          )}
      </Body>
      {isShowQR && <QRModal onClose={() => setIsShowQR(false)} />}
      {isShowSearch && <SearchModal onClose={() => setIsShowSearch(false)} />}
    </Container>
  );
};

export default Main;

const Container = styled.div`
  width: 100dvw;
  height: 100dvh;
  background-color: #000000;
`;

const Header = styled.div`
  display: flex;
  padding: 16px 24px;
  justify-content: space-between;
  align-items: center;
  align-self: stretch;
  -webkit-app-region: drag;
`;

const Buttons = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  -webkit-app-region: no-drag;
`;

const Button = styled.div`
  display: flex;
  width: 40px;
  height: 40px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

const Divider = styled.div`
  display: flex;
  padding: 0px 12px;
  justify-content: center;
  align-items: flex-start;
`;

const Profile = styled.div`
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  border-radius: 32px;
  background: url(https://file.suk.kr/avatar.png) lightgray 50% / cover
    no-repeat;
`;

const Body = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;

  gap: 8px;
  padding: 0px 16px 16px 16px;
`;
