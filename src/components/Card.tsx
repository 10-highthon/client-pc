import { useState } from "react";
import styled, { css } from "styled-components";
import DetailModal from "./DetailModal";

interface CardProps {
  channelId: string;
  name: string;
  $status: "OPEN" | "CLOSED";
  follows: number;
  time: string;
  imageUrl: string;
  defaultThumbnailImageUrl: string;
}

const Card = (props: CardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <Container
      onClick={() => {
        window.ipcRenderer.send("getStream", props.channelId);
      }}
      onMouseOver={() => setIsHovered(true)}
      onMouseOut={() => setIsHovered(false)}
    >
      <Profile $status={props.$status}>
        <img src={props.imageUrl} />
      </Profile>
      <Content>
        <Name>{props.name}</Name>
        <Details>
          {props.$status === "OPEN" ? (
            <ActiveTextCard>
              <p>{props.time}부터 방송 중!</p>
            </ActiveTextCard>
          ) : (
            <TextCard>
              <p>최근 방송</p>
              <p>{props.time}</p>
            </TextCard>
          )}
          <TextCard>
            <p>팔로워</p>
            {props.follows}
          </TextCard>
        </Details>
      </Content>
      {isHovered && (
        <PlusButton
          onClick={(e) => {
            e.stopPropagation();
            setIsModalOpen(true);
          }}
        >
          +
        </PlusButton>
      )}
      {isModalOpen && (
        <DetailModal
          name={props.name}
          follows={props.follows}
          time={props.$status === "OPEN" ? props.time : undefined}
          defaultThumbnailImageUrl={props.defaultThumbnailImageUrl}
          onClose={() => setIsModalOpen(false)}
          onRemove={() => {}}
        />
      )}
    </Container>
  );
};

export default Card;

const PlusButton = styled.div`
  padding: 0.5rem 1rem;
  position: absolute;
  right: 0;
  bottom: 0;
  cursor: pointer;
`;

const Container = styled.div`
  user-select: none;
  cursor: pointer;
  display: flex;
  padding: 16px;
  align-items: center;
  gap: 16px;
  flex-shrink: 0;
  border-radius: 8px;
  background: rgba(87, 87, 87, 0.3);
  box-shadow: 5px 5px 4px 0px rgba(47, 50, 82, 0.2);
  backdrop-filter: blur(7px);

  p {
    margin: 0;
  }
`;

const Profile = styled.div<Pick<CardProps, "$status">>`
  display: flex;
  padding: 8px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 40px;

  ${({ $status }) =>
    $status === "OPEN"
      ? css`
          border: 2px solid #7aeb85;
        `
      : css`
          border: 2px solid #686868;
        `}

  overflow: hidden;

  img {
    width: 64px;
    height: 64px;
    border-radius: 32px;
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  flex: 1 0 0;
`;

const Name = styled.div`
  align-self: stretch;
  color: #fff;

  font-size: 20px;
  font-style: normal;
  font-weight: 600;
  line-height: 125%; /* 25px */
`;

const Details = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  align-self: stretch;
`;

const TextCard = styled.div`
  height: fit-content;
  display: flex;
  align-items: center;
  gap: 4px;
  align-self: stretch;

  p:nth-child(1) {
    color: var(--Grayscale-White-50, #b2b2c2);
    font-size: 14px;
    font-style: normal;
    font-weight: 600;
    line-height: 150%; /* 21px */
  }

  p:nth-child(2) {
    flex: 1 0 0;
    color: var(--Grayscale-White-50, #b2b2c2);
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 150%; /* 21px */
  }
`;

const ActiveTextCard = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 4px;
  align-self: stretch;

  p {
    flex: 1 0 0;
    color: var(--Green-Green-Light, #7aeb85);
    font-size: 14px;
    font-style: normal;
    font-weight: 600;
    line-height: 150%; /* 21px */
  }
`;
