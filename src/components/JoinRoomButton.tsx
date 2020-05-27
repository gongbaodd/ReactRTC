import React from "react";
import RoomDialog from "./RoomDialog";
import { useExistRoomCallback, useUpdateRoomAnswerCallback } from "./Room";
import { useClaimCalleeCallback } from "../hooks/useCandidateCallback";
import { useAcceptOfferCallback } from "./PeerConnection";
import { useUserMediaCallback } from "./UserMedia";

const JoinRoomButton = () => {
  const getRoom = useExistRoomCallback();
  const updateAnswer = useUpdateRoomAnswerCallback();
  const claimCallee = useClaimCalleeCallback();
  const acceptOffer = useAcceptOfferCallback();
  const getUserMedia = useUserMediaCallback();

  return <RoomDialog
    onJoinRoom={async id => {
      const room = await getRoom(id);
      if (room.exists) {
        claimCallee();
        const { type, sdp } = await acceptOffer(room.data()?.offer);
        await updateAnswer({ answer: { type, sdp } });
        await getUserMedia();
      }
      return room.exists;
    }}
  />;  
};

export default JoinRoomButton;
