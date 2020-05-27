import React from "react";
import RoomDialog from "./RoomDialog";
import { useExistRoomCallback, useUpdateRoomAnswerCallback } from "./Room";
import { useClaimCalleeCallback } from "../hooks/useCandidateCallback";
import { useAcceptOfferCallback } from "./PeerConnection";

const JoinRoomButton = () => {
  const getRoom = useExistRoomCallback();
  const updateAnswer = useUpdateRoomAnswerCallback();
  const claimCallee = useClaimCalleeCallback();
  const acceptOffer = useAcceptOfferCallback();

  return (
    <RoomDialog
      onJoinRoom={async id => {
        const room = await getRoom(id);
        if (room.exists) {
          claimCallee();
          const { type, sdp } = await acceptOffer(room.data()?.offer);
          await updateAnswer({ answer: { type, sdp } })
        }
        return room.exists;
      }}
    />
  );
};

export default JoinRoomButton;
