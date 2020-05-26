import React, { useState, FC } from "react";
import { useStreamFromPeer } from "./PeerConnection";
import useVideoMedia from "../hooks/useVideoMedia";

const InnerRemoteVideo: FC<{ stream: MediaStream }> = ({ stream }) => {
  const v = useVideoMedia(stream);
  return <video ref={v} style={{ backgroundColor: "grey" }} />;
};

const RemoteVideo = () => {
  const [streams, setStreams] = useState<MediaStream[]>([]);
  useStreamFromPeer(setStreams);

  return (
    <>
      {streams.map(s => (
        <InnerRemoteVideo stream={s} />
      ))}
    </>
  );
};

export default RemoteVideo;
