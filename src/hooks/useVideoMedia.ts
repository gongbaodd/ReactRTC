import { useRef, useEffect } from "react";

const useMedia = (stream: HTMLMediaElement["srcObject"]) => {
  const v = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (v.current) {
      v.current.srcObject = stream;
      v.current.autoplay = true;
    }
  }, [stream]);

  return v;
};

export default useMedia;
