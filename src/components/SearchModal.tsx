import styled from "styled-components";
import BaseModal from "./BaseModal";
import { useEffect, useMemo, useState } from "react";
import { debounce } from "lodash";

interface SearchProps {
  onClose: () => void;
}

const SearchModal = ({ onClose }: SearchProps) => {
  const [value, setValue] = useState("");

  const debouncedSearch = useMemo(
    () => debounce((query: string) => console.log, 300),
    []
  );

  useEffect(() => {
    debouncedSearch(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <BaseModal onClose={onClose}>
      <Container>
        <InputBox>
          <Input value={value} onChange={(e) => setValue(e.target.value)} />
        </InputBox>
      </Container>
    </BaseModal>
  );
};

export default SearchModal;

const Container = styled.div`
  width: 80%;
  height: 80%;
  display: flex;
  padding: 1rem;
  border-radius: 12px;
  background: rgba(60, 60, 60, 0.6);
  backdrop-filter: blur(6px);
`;

const InputBox = styled.div`
  width: 100%;
  height: 2.5rem;
  padding: 0.5rem;
  border: 1px solid #00ffa3;
  border-radius: 8px;

  display: flex;
  justify-content: center;
  align-items: center;
`;

const Input = styled.input`
  border: 0;
  outline: none;
  background-color: transparent;
  width: 100%;
  height: 100%;
  font-size: 14px;
`;
