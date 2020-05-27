import React, { FC, useState, useEffect } from "react";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardActions from "@material-ui/core/CardActions";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import LocalVideo from "./LocalVideo";
import RemoteVideo from "./RemoteVideo";
import RoomDialog from "./RoomDialog";
import CreateRoom from "./CreateRoomButton";
import JoinRoom from "./JoinRoomButton";

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
          <CreateRoom />
          <JoinRoom />

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
