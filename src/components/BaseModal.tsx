import { PropsWithChildren } from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";

interface BaseModalProps extends PropsWithChildren {
  onClose: () => void;
}

const BaseModal = ({ onClose, children }: BaseModalProps) => {
  return createPortal(
    <Container onClick={(e) => e.target === e.currentTarget && onClose()}>
      {children}
    </Container>,
    document.body
  );
};

export default BaseModal;

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #00000040;

  display: flex;
  justify-content: center;
  align-items: center;
`;
