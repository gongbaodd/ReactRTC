import React from "react";
import Button from "@material-ui/core/Button";
import { useCreateOfferCallback } from "./PeerConnection";
import { useNewRoomCallback } from "./DB";

const CreateRoom = () => {
  const createOffer = useCreateOfferCallback();
  const newRoom = useNewRoomCallback();

  return (
    <Button
      size="small"
      onClick={async () => {
        const { type, sdp } = await createOffer();

        if (callerAddCandidates) {
          callerAddCandidates();

          const id = await newRoom({ offer: { type, sdp } });
          console.log("created Room " + id);
        }
      }}
    >
      创建房间
    </Button>
  );
};

export default CreateRoom;
