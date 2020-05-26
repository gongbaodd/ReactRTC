import React, { useRef, useEffect, FC } from "react";

interface Props {
  stream: HTMLMediaElement["srcObject"];
}

const Video: FC<Props> = ({ stream }) => {
  const v = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (v.current) {
      v.current.srcObject = stream;
    }
  }, [stream]);

  return <video ref={v} style={{ backgroundColor: "grey" }} />;
};

export default Video;
