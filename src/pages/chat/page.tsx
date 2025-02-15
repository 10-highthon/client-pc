import { useSearchParams } from "react-router";
import styled from "styled-components";

const Chat = () => {
  const [searchParams] = useSearchParams();
  const channelId = searchParams.get("channelId");

  return (
    <Container>
      <Nav />
      <webview src={`https://chzzk.naver.com/live/${channelId}/chat`} />
    </Container>
  );
};

export default Chat;

const Container = styled.div`
  width: 100dvw;
  height: 100dvh;

  overflow: hidden;
`;

const Nav = styled.div`
  -webkit-app-region: drag;
  position: fixed;
  top: 0;
  left: 0;
  width: 90%;
  height: 44px;
  overflow: hidden;
`;
