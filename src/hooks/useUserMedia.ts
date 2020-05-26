import { useState } from "react";

const useUserMedia = () => {
  const [stream, setStream] = useState<MediaStream>(() => new MediaStream());
  const [, setPermitted] = useState(false);

  const getPermitted = async () => {
    setPermitted(true);
    const userStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    setStream(userStream);
  };

  return { stream, setStream: getPermitted };
};

export default useUserMedia;
