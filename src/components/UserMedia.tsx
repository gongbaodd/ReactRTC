import React, { useState, FC, useContext } from "react";
import { createContext } from "react";
import Button from "@material-ui/core/Button";

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

const UserMediaContext = createContext<MediaStream>(new MediaStream());

const UserMedia: FC = ({ children }) => {
  const [stream, setStream] = useState(() => new MediaStream());

  return (
    <div style={{ position: "relative" }}>
      <UserMediaContext.Provider value={stream} children={children} />;
      <div style={buttonStyle}>
        <Button
          onClick={async () => {
            const userStream = await navigator.mediaDevices.getUserMedia({
              video: true,
              audio: true,
            });
            setStream(userStream);
          }}
        >
          打开摄像头&麦克风
        </Button>
      </div>
    </div>
  );
};

export const useUserStream = () => {
  const stream = useContext(UserMediaContext);
  return stream;
};

export default UserMedia;
