import React, { FC } from "react";
import { useStreamToPeer } from "../hooks/usePeerConnection";
import useVideoMedia from "../hooks/useVideoMedia";
import UserMedia, { useUserStream } from "./UserMedia";

interface LocalProps {}

const InnerLocalVideo = () => {
  const stream = useUserStream();
  const v = useVideoMedia(stream);
  useStreamToPeer(stream);

  return <video ref={v} style={{ backgroundColor: "grey" }} />;
};

export const LocalVideo: FC<LocalProps> = () => {
  return (
    <UserMedia>
      <InnerLocalVideo />
    </UserMedia>
  );
};

interface RemoteProps {}

export const RemoteVideo: FC<RemoteProps> = () => {
  return <video style={{ backgroundColor: "grey" }} />;
};
