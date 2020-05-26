import React, { useRef, useEffect, FC, RefObject } from "react";
import Button from "@material-ui/core/Button";
import useUserMedia from "../hooks/useUserMedia";
import { useStreamToPeer } from "../hooks/usePeerConnection";
import useVideoMedia from "../hooks/useVideoMedia";

const buttonStyle = {
  position: "absolute",
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
} as const;

interface LocalProps {}

export const LocalVideo: FC<LocalProps> = () => {
  const { stream: localStream, setStream: setLocalStream } = useUserMedia();
  const v = useVideoMedia(localStream);

  useStreamToPeer(localStream);

  return (
    <div style={{ position: "relative" }}>
      <video ref={v} style={{ backgroundColor: "grey" }} />
      <div style={buttonStyle}>
        <Button onClick={() => setLocalStream()}>打开摄像头&麦克风</Button>
      </div>
    </div>
  );
};

interface RemoteProps {}

export const RemoteVideo: FC<RemoteProps> = () => {
  return <video style={{ backgroundColor: "grey" }} />;
};
