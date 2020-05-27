import React, { FC, useState, useEffect } from "react";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardActions from "@material-ui/core/CardActions";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import LocalVideo from "./LocalVideo";
import RemoteVideo from "./RemoteVideo";
import RoomDialog from "./RoomDialog";

import useIceCandidate from "../hooks/useIceCandidate";
import { useRooms, getRoomCollection } from "../hooks/useDatabase";
import { useRoom } from "./Room";

interface Props {
  remote?: boolean;
}

const Stream: FC<Props> = ({ remote }) => {
  const [roomId, setRoomId] = useState("");
  const [localStream] = useState(() => new MediaStream());
  const [remoteStream] = useState(() => new MediaStream());
  const getRoomRef = useRooms();
  const roomRef = getRoomRef();

  const room = useRoom();

  // const {
  //   calleeAddCandidates,
  //   callerAddCandidates,
  // } = useIceCandidate(roomRef, connection);
  // useEffect(() => {
  //   roomRef?.onSnapshot(async snapshot => {
  //     const result = snapshot.data();
  //     if (result && result.answer) {
  //       await setRemoteDescription(result.answer);
  //     }
  //   });
  // }, [roomRef, setRemoteDescription]);

  return (
    <>
      <Card style={{ marginTop: "20px" }}>
        <CardHeader title={room?.id || "hello"} />
        <CardMedia style={{ height: 320 }}>
          <LocalVideo />
          <RemoteVideo />
        </CardMedia>
        <CardActions>
          <Button
            size="small"
            onClick={async () => {
              // if (roomRef && callerAddCandidates) {
              //   callerAddCandidates();
              //   const { type, sdp } = await createOffer();
              //   await roomRef.set({ offer: { type, sdp } });
              //   setRoomId(roomRef.id);
              //   console.log("created Room " + roomRef.id);
              // }
            }}
          >
            创建房间
          </Button>
          <RoomDialog
            onJoinRoom={async id => {
              const roomRef = (await getRoomCollection()).doc(id);
              const roomSnapshot = await roomRef.get();

              // if(roomSnapshot.exists && calleeAddCandidates) {
              //   calleeAddCandidates();

              //   console.log('Got room:', roomSnapshot.exists);
              //   setRoomId(id);

              //   const offer = roomSnapshot.data()?.offer;
              //   console.log('Got offer:', offer);
              //   const answer = await acceptOffer(offer);
              //   await roomRef.update({ answer: {type: answer.type, sdp: answer.sdp} });
              // }

              return roomSnapshot.exists;
            }}
          />
          <Button
            size="small"
            onClick={async () => {
              if (roomId) {
                // localStream?.getTracks().forEach(track => track.stop());
                // remoteStream.getTracks().forEach(track => track.stop());
                // connection.close();
                // const roomRef = (await getRoomCollection()).doc(roomId);
                // const candidates = await Promise.all([
                //   roomRef.collection('calleeCandidates').get(),
                //   roomRef.collection('callerCandidates').get()
                // ]);
                // candidates.forEach(cs => cs.forEach(async c => {
                //   await c.ref.delete();
                // }));
                // await roomRef.delete();
              }

              document.location.reload(true);
            }}
          >
            挂断
          </Button>
        </CardActions>
      </Card>
    </>
  );
};

export default Stream;
