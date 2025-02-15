import { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import styled from "styled-components";
import BaseModal from "./BaseModal";

interface QRModalProps {
  onClose: () => void;
}

const QRModal = ({ onClose }: QRModalProps) => {
  const [uuid, setUUID] = useState("");

  useEffect(() => {
    window.store.get("user").then(setUUID);
  }, []);

  return (
    <BaseModal onClose={onClose}>
      <Wrapper>
        <Container>
          <QRCode value={uuid} />
          <p>모바일에서 로그인을 진행하세요!</p>
        </Container>
      </Wrapper>
    </BaseModal>
  );
};

export default QRModal;

const Wrapper = styled.div`
  padding: 1rem;
  background-color: white;

  display: flex;
  justify-content: center;
  align-items: center;

  border-radius: 10px;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  p {
    color: black;
    margin: 13px 0 0;
    font-weight: 700;
  }
`;
