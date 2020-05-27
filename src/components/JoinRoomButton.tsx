import React from "react";
import RoomDialog from "./RoomDialog";
import { useExistRoomCallback, useUpdateRoomAnswerCallback } from "./Room";
import { useClaimCalleeCallback } from "../hooks/useCandidateCallback";
import { useAcceptOfferCallback } from "./PeerConnection";
import { UserMediaConsumer, setUserMedia } from "./UserMedia";

const JoinRoomButton = () => {
  const getRoom = useExistRoomCallback();
  const updateAnswer = useUpdateRoomAnswerCallback();
  const claimCallee = useClaimCalleeCallback();
  const acceptOffer = useAcceptOfferCallback();

  return <UserMediaConsumer
    render={(_, setStream) => {
      return (
        <RoomDialog
          onJoinRoom={async id => {
            const room = await getRoom(id);
            if (room.exists) {
              claimCallee();
              const { type, sdp } = await acceptOffer(room.data()?.offer);
              await updateAnswer({ answer: { type, sdp } });
              await setUserMedia(setStream);
            }
            return room.exists;
          }}
        />
      );
    }}
  />;

  
};

export default JoinRoomButton;
