import React from "react";
import Button from "@material-ui/core/Button";
import { UserMediaConsumer } from "./UserMedia";
import { RemoteStreamConsumer } from "./RemoteVideo";
import { useHangUpCallback } from "./PeerConnection";
import { useCancelRoomCallback } from "./Room";

const HangUpButton = () => {
  const hangup = useHangUpCallback();
  const cancelRoom = useCancelRoomCallback();

  return (
    <UserMediaConsumer
      render={localStream => {
        return (
          <RemoteStreamConsumer
            render={remoteStreams => {
              return (
                <Button
                  size="small"
                  onClick={async () => {
                    localStream.getTracks().forEach(t => t.stop());
                    remoteStreams.forEach(s =>
                      s.getTracks().forEach(t => t.stop()),
                    );
                    await hangup();
                    await cancelRoom();

                    // document.location.reload(true);
                  }}
                >
                  挂断
                </Button>
              );
            }}
          />
        );
      }}
    />
  );
};

export default HangUpButton;
