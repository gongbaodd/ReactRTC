import React, { FC } from "react";
import { useStreamToPeer } from "./PeerConnection";
import useVideoMedia from "../hooks/useVideoMedia";
import { useUserStream } from "./UserMedia";

interface LocalProps {}

const InnerLocalVideo = () => {
  const stream = useUserStream();
  const v = useVideoMedia(stream);
  useStreamToPeer(stream);

  return <video ref={v} style={{ backgroundColor: "grey" }} />;
};

export const LocalVideo: FC<LocalProps> = () => {
  return <InnerLocalVideo />;
};

export default LocalVideo;
