import React, { useState, createContext, FC, ReactNode } from "react";
import { useStreamFromPeer } from "./PeerConnection";
import useVideoMedia from "../hooks/useVideoMedia";

const RemoteStreamContext = createContext<MediaStream[]>([]);

const InnerRemoteVideo: FC<{ stream: MediaStream }> = ({ stream }) => {
  const v = useVideoMedia(stream);
  return <video ref={v} style={{ backgroundColor: "grey" }} />;
};

const RemoteVideo = () => {
  const [streams, setStreams] = useState<MediaStream[]>([]);
  useStreamFromPeer(setStreams);

  return (
    <RemoteStreamContext.Provider
      value={streams}
      children={
        <>
          {streams.map(s => (
            <InnerRemoteVideo stream={s} key={s.id} />
          ))}
        </>
      }
    />
  );
};

export default RemoteVideo;

interface RemoteProps {
  render: (streams: MediaStream[]) => ReactNode;
}

export const RemoteStreamConsumer: FC<RemoteProps> = ({ render }) => {
  return <RemoteStreamContext.Consumer>{render}</RemoteStreamContext.Consumer>;
};
