import React, { useState, FC, useContext, ReactNode, useCallback } from "react";
import { createContext } from "react";

const defaultMediaStream = new MediaStream();

interface UserMediaContextValue {
  stream: MediaStream;
  setStream: (s: MediaStream) => void;
}

const UserMediaContext = createContext<UserMediaContextValue>({
  stream: defaultMediaStream,
  setStream: () => {},
});

const UserMedia: FC = ({ children }) => {
  const [stream, setStream] = useState(() => defaultMediaStream);

  return (
    <UserMediaContext.Provider
      value={{ stream, setStream }}
      children={children}
    />
  );
};

interface ConsumerProps {
  render: (
    stream: MediaStream,
    setStream: UserMediaContextValue["setStream"],
  ) => ReactNode;
}

export const UserMediaConsumer: FC<ConsumerProps> = ({ render }) => {
  return (
    <UserMediaContext.Consumer>
      {({ stream, setStream }) => stream && render(stream, setStream)}
    </UserMediaContext.Consumer>
  );
};

export const useUserStream = () => {
  const { stream } = useContext(UserMediaContext);
  return stream;
};

export const useUserMediaCallback = () => {
  const { setStream } = useContext(UserMediaContext);
  const callback = useCallback(async () => {
    const userStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    console.log("Got user stream", userStream);
    setStream(userStream);
  }, [setStream]);

  return callback;
};

export const setUserMedia = async (
  setStream: UserMediaContextValue["setStream"],
) => {
  const userStream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: false,
  });
  console.log("Got user stream", userStream);
  setStream(userStream);
};

export default UserMedia;
