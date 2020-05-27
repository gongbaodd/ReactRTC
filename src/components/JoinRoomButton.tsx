import React, { useState, useEffect } from "react";
import RoomDialog from "./RoomDialog";
import { useExistRoomCallback, useUpdateRoomAnswerCallback } from "./Room";
import { useClaimCalleeCallback } from "../hooks/useCandidateCallback";
import { useAcceptOfferCallback } from "./PeerConnection";
import { useUserMediaCallback } from "./UserMedia";
import firebase from "../utils/firebase";

type DocumentSnapshot = firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>;

const JoinRoomButton = () => {
  const getRoom = useExistRoomCallback();
  const updateAnswer = useUpdateRoomAnswerCallback();
  const claimCallee = useClaimCalleeCallback();
  const acceptOffer = useAcceptOfferCallback();
  const getUserMedia = useUserMediaCallback();

  const [room, setRoom] = useState<null|DocumentSnapshot>(null);

  useEffect(() => {
    if (room) {
      acceptOffer(room.data()?.offer)
        .then(({type, sdp}) => {
            updateAnswer({ answer: { type, sdp } });
        })
    }
  }, [room, acceptOffer, updateAnswer]);

  return <RoomDialog
    onJoinRoom={async id => {
      const room = await getRoom(id);
      if (room.exists) {
        await getUserMedia();
        setRoom(room);
        claimCallee();
      }
      return room.exists;
    }}
  />;  
};

export default JoinRoomButton;
