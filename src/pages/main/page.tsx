import styled from "styled-components";
import Card from "../../components/Card";

const Main = () => {
  return (
    <Container>
      <Header>
        <div />
        <Buttons>
          <Button>
            <img src="/public/add.svg" />
          </Button>
          <Button>
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
          <Button>
            <Profile />
          </Button>
        </Buttons>
      </Header>
      <Body>
        <Card
          name={"홍길동"}
          $status={"OPEN"}
          follows={10000}
          time={"15시간 전"}
          imageUrl={"https://file.suk.kr/avatar.png"}
          defaultThumbnailImageUrl="https://file.suk.kr/avatar.png"
        />
        <Card
          name={"홍길동"}
          $status={"OPEN"}
          follows={10000}
          time={"15시간 전"}
          imageUrl={"https://file.suk.kr/avatar.png"}
          defaultThumbnailImageUrl="https://file.suk.kr/avatar.png"
        />
        <Card
          name={"홍길동"}
          $status={"OPEN"}
          follows={10000}
          time={"15시간 전"}
          imageUrl={"https://file.suk.kr/avatar.png"}
          defaultThumbnailImageUrl="https://file.suk.kr/avatar.png"
        />
        <Card
          name={"홍길동"}
          $status={"OPEN"}
          follows={10000}
          time={"15시간 전"}
          imageUrl={"https://file.suk.kr/avatar.png"}
          defaultThumbnailImageUrl="https://file.suk.kr/avatar.png"
        />
        <Card
          name={"홍길동"}
          $status={"OPEN"}
          follows={10000}
          time={"15시간 전"}
          imageUrl={"https://file.suk.kr/avatar.png"}
          defaultThumbnailImageUrl="https://file.suk.kr/avatar.png"
        />
        <Card
          name={"홍길동"}
          $status={"OPEN"}
          follows={10000}
          time={"15시간 전"}
          imageUrl={"https://file.suk.kr/avatar.png"}
          defaultThumbnailImageUrl="https://file.suk.kr/avatar.png"
        />
      </Body>
    </Container>
  );
};

export default Main;

const Container = styled.div`
  width: 100%;
  background-color: #000000;

  * {
    box-sizing: border-box;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }
`;

const Header = styled.div`
  display: flex;
  padding: 16px 24px;
  justify-content: space-between;
  align-items: center;
  align-self: stretch;
`;

const Buttons = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
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
  display: flex;
  width: 100%;
  padding: 0px 16px 16px 16px;
  justify-content: center;
  align-items: flex-start;
  align-content: flex-start;
  gap: 8px;
  flex-wrap: wrap;
`;
