import React, { FC, useState, useEffect } from "react";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardActions from "@material-ui/core/CardActions";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Video from "./Video";
import useUserMedia from "../hooks/useUserMedia";
import usePeerConnection from "../hooks/usePeerConnection";
import useIceCandidate from "../hooks/useIceCandidate";
import { useRooms } from "../hooks/useDatabase";

interface Props {
  remote?: boolean;
}

const Stream: FC<Props> = ({ remote }) => {
  const [roomId, setRoomId] = useState("");
  const { stream: localStream, setStream: setLocalStream } = useUserMedia();
  const [remoteStream] = useState(() => new MediaStream());
  const { connection, createOffer, setRemoteDescription } = usePeerConnection(
    localStream,
    remoteStream,
  );
  const getRoomRef = useRooms();
  const roomRef = getRoomRef();

  useIceCandidate(roomRef, connection);
  useEffect(() => {
    roomRef?.onSnapshot(async snapshot => {
      const result = snapshot.data();
      if (result && result.answer) {
        await setRemoteDescription(result.answer);
      }
    });
  }, [roomRef, setRemoteDescription]);

  return (
    <Card style={{ marginTop: "20px" }}>
      <CardHeader title={roomId || remote ? "remoteStream" : "localStream"} />
      <CardMedia style={{ height: 320 }}>
        <Video stream={localStream} />
        <Video stream={remoteStream} />
      </CardMedia>
      <CardActions>
        <Button size="small" onClick={() => setLocalStream()}>
          打开摄像头&麦克风
        </Button>
        <Button
          size="small"
          onClick={async () => {
            if (roomRef) {
              const { type, sdp } = await createOffer();
              await roomRef.set({ offer: { type, sdp } });
              setRoomId(roomRef.id);
              console.log("created Room " + roomRef.id);
            }
          }}
        >
          创建房间
        </Button>
        <Button size="small">加入房间</Button>
        <Button size="small">挂断</Button>
      </CardActions>
    </Card>
  );
};

export default Stream;
