import React from "react";
import Button from "@material-ui/core/Button";
import {
  useCreateOfferCallback,
  useSetRemoteDescriptionCallback,
} from "./PeerConnection";
import { useNewRoomCallback, useOnUpdateRoomAnswer } from "./Room";
import { useClaimCallerCallback } from "../hooks/useCandidateCallback";
import { useUserMediaCallback } from "./UserMedia";

const CreateRoom = () => {
  const createOffer = useCreateOfferCallback();
  const newRoom = useNewRoomCallback();
  const claimCaller = useClaimCallerCallback();
  const setRemote = useSetRemoteDescriptionCallback();
  const getUserMedia = useUserMediaCallback();

  useOnUpdateRoomAnswer(setRemote);

  return (
    <Button
      size="small"
      onClick={async () => {
        const { type, sdp } = await createOffer();
        claimCaller();
        const id = await newRoom({ offer: { type, sdp } });
        console.log("created Room " + id);

        await getUserMedia();
      }}
    >
      创建房间
    </Button>
  );
};

export default CreateRoom;
