import styled from "styled-components";
import BaseModal from "./BaseModal";

interface DetailModalProps {
  name: string;
  follows: number;
  time?: string;
  defaultThumbnailImageUrl: string;
  onRemove: () => void;
  onClose: () => void;
}

const DetailModal = (props: DetailModalProps) => {
  return (
    <BaseModal {...props}>
      <Container>
        <Header>
          <img src={props.defaultThumbnailImageUrl} />
        </Header>
        <Content>
          <Info>
            <p>{props.name}</p>
            <TextWrapper>
              <p>팔로워</p>
              <p>{props.follows}</p>
            </TextWrapper>
            <TextWrapper>
              <p>내 포인트</p>
            </TextWrapper>
          </Info>
          <Buttons>
            {props.time && (
              <LiveButton>
                {props.time}전부터 방송 중 <img src="/public/shortcut.svg" />
              </LiveButton>
            )}
            <RemoveButton onClick={props.onRemove}>
              <img src="/public/remove.svg" />
            </RemoveButton>
          </Buttons>
        </Content>
      </Container>
    </BaseModal>
  );
};

export default DetailModal;

const Container = styled.div`
  width: 400px;
  height: 400px;

  border-radius: 12px;
  background: rgba(60, 60, 60, 0.6);
  backdrop-filter: blur(6px);

  display: flex;
  flex-direction: column;

  overflow: hidden;
`;

const Header = styled.div`
  width: 100%;
  height: 210px;

  overflow: hidden;

  img {
    object-fit: cover;
    height: 100%;
  }
`;

const Content = styled.div`
  display: flex;
  width: 100%;
  padding: 20px;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #686868;
`;

const Info = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: space-between;

  > p {
    color: var(--Grayscale-White-60, #fff);
    font-size: 24px;
    font-style: normal;
    font-weight: 600;
    line-height: 150%; /* 36px */
  }
`;

const TextWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 4px;

  p:nth-child(1) {
    color: #b2b2c2;
    font-size: 14px;
    font-style: normal;
    font-weight: 600;
    line-height: 150%; /* 21px */
  }

  p:nth-child(2) {
    color: #b2b2c2;
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: 150%; /* 21px */
  }
`;

const Buttons = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 4px;
  flex-shrink: 0;
`;

const LiveButton = styled.div`
  display: flex;
  padding: 6px 9px;
  align-items: center;
  gap: 3px;
  border-radius: 6px;
  background: rgba(114, 115, 123, 0.4);
  color: #00ffa3;
`;

const RemoveButton = styled.div`
  display: flex;
  padding: 6px 9px;
  align-items: center;
  gap: 3px;
  border-radius: 6px;
  background: rgba(114, 115, 123, 0.4);
  color: #ff0000;
`;
