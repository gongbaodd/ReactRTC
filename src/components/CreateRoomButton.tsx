import React from "react";
import Button from "@material-ui/core/Button";
import {
  useCreateOfferCallback,
  useSetRemoteDescriptionCallback,
} from "./PeerConnection";
import { useNewRoomCallback, useOnUpdateRoomAnswer } from "./Room";
import { useClaimCallerCallback } from "../hooks/useCandidateCallback";
import { UserMediaConsumer, setUserMedia } from "./UserMedia";

const CreateRoom = () => {
  const createOffer = useCreateOfferCallback();
  const newRoom = useNewRoomCallback();
  const claimCaller = useClaimCallerCallback();
  const setRemote = useSetRemoteDescriptionCallback();

  useOnUpdateRoomAnswer(setRemote);

  return (
    <UserMediaConsumer
      render={(_, setStream) => {
        return (
          <Button
            size="small"
            onClick={async () => {
              const { type, sdp } = await createOffer();
              claimCaller();
              const id = await newRoom({ offer: { type, sdp } });
              console.log("created Room " + id);

              await setUserMedia(setStream);
            }}
          >
            创建房间
          </Button>
        );
      }}
    />
  );
};

export default CreateRoom;
