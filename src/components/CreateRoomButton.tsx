import React from "react";
import Button from "@material-ui/core/Button";
import { useCreateOfferCallback } from "./PeerConnection";
import { useNewRoomCallback } from "./Room";
import { useCallerCandidateCallback } from "./LocalCandidates";

const CreateRoom = () => {
  const createOffer = useCreateOfferCallback();
  const newRoom = useNewRoomCallback();
  const claimCaller = useCallerCandidateCallback();

  return (
    <Button
      size="small"
      onClick={async () => {
        const { type, sdp } = await createOffer();
        claimCaller();
        const id = await newRoom({ offer: { type, sdp } });
        console.log("created Room " + id);
      }}
    >
      创建房间
    </Button>
  );
};

export default CreateRoom;
