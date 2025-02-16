import styled from "styled-components";
import BaseModal from "./BaseModal";
import { useEffect, useMemo, useState } from "react";
import { debounce } from "lodash";

interface SearchProps {
  onClose: () => void;
}

const SearchModal = ({ onClose }: SearchProps) => {
  const [value, setValue] = useState("");
  const [result, setResult] = useState<any>();

  async function test(query: string) {
    return await window.ipcRenderer.sendSync("searchChannels", query);
  }

  const debouncedSearch = useMemo(
    () => debounce((query: string) => test(query).then(setResult), 300),
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
        {result &&
          result[0].channels.map((channel) => (
            <Channel>
              <div>
                <Image>
                  <img src={channel.channelImageUrl} />
                </Image>
                <p>{channel.channelName}</p>
              </div>
              <p
                onClick={() => {
                  window.ipcRenderer.sendSync("addFavorite", channel.channelId);
                  location.reload();
                }}
              >
                추가
              </p>
            </Channel>
          ))}
      </Container>
    </BaseModal>
  );
};

export default SearchModal;

const Channel = styled.div`
  width: 100%;
  height: 3rem;

  display: flex;
  justify-content: space-between;
  align-items: center;

  > div {
    display: flex;
    gap: 10px;
    align-items: center;
  }

  > p {
    color: #00ffa3;
    font-weight: 600;
    cursor: pointer;
  }
`;

const Image = styled.div`
  width: 2rem;
  height: 2rem;
  border-radius: 50px;

  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  p {
    margin: 0;
  }
`;

const Container = styled.div`
  width: 80%;
  height: 80%;
  display: flex;
  flex-direction: column;
  padding: 1rem;
  border-radius: 12px;
  background: rgba(60, 60, 60, 0.6);
  backdrop-filter: blur(6px);
`;

const InputBox = styled.div`
  width: 100%;
  height: 2.5rem;
  padding: 0.5rem;
  margin-bottom: 1rem;
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
