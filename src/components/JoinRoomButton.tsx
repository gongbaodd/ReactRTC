import React, { useState } from "react";
import RoomDialog from "./RoomDialog";
import { useExistRoomCallback, useUpdateRoomAnswerCallback } from "./Room";
import { useClaimCalleeCallback } from "../hooks/useCandidateCallback";
import { useAcceptOfferCallback } from "./PeerConnection";
import { useUserMediaCallback } from "./UserMedia";
import firebase from "../utils/firebase";

type DocumentSnapshot = firebase.firestore.DocumentSnapshot<
  firebase.firestore.DocumentData
>;

const JoinRoomButton = () => {
  const getRoom = useExistRoomCallback();
  const updateAnswer = useUpdateRoomAnswerCallback();
  const claimCallee = useClaimCalleeCallback();
  const acceptOffer = useAcceptOfferCallback();
  const getUserMedia = useUserMediaCallback();


  const [room, setRoom] = useState<null | DocumentSnapshot>(null);

  return (
    <RoomDialog
      onJoinRoom={async id => {
        const room = await getRoom(id);
        if (room.exists) {
          setRoom(room);
        }

        return room.exists;
      }}
      onClosed={
        async () => {
          if (room) {
            await getUserMedia();

            const { type, sdp } = await acceptOffer(room.data()?.offer);
            await updateAnswer({ answer: { type, sdp } });
            
            claimCallee();
          }
        }
      }
    />
  );
};

export default JoinRoomButton;
