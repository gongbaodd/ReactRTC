import { useState } from "react";

const setUserStream = (setStream: (s: MediaStream) => void) => {
  navigator.mediaDevices
    .getUserMedia({
      video: true,
      audio: true,
    })
    .then(s => setStream(s));
};

const useUserMedia = () => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [, setPermitted] = useState(false);

  const getPermitted = () => {
    setPermitted(true);
    setUserStream(setStream);
  };

  return { stream, getPermitted };
};

export default useUserMedia;
