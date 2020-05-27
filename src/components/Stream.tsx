import React, { FC } from "react";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardActions from "@material-ui/core/CardActions";
import CardMedia from "@material-ui/core/CardMedia";

import LocalVideo from "./LocalVideo";
import RemoteVideo from "./RemoteVideo";
import CreateRoom from "./CreateRoomButton";
import JoinRoom from "./JoinRoomButton";
import HongUp from "./HangUpButton";

import { useRoomId } from "./Room";

interface Props {}

const Stream: FC<Props> = () => {
  const roomId = useRoomId();

  return (
    <Card style={{ marginTop: "20px" }}>
      <CardHeader title={roomId || "hello"} />
      <CardMedia style={{ height: 800 }}>
        <LocalVideo />
        <RemoteVideo />
      </CardMedia>
      <CardActions>
        <CreateRoom />
        <JoinRoom />
        <HongUp />
      </CardActions>
    </Card>
  );
};

export default Stream;
