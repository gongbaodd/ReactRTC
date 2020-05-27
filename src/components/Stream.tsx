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

interface Props {}

const Stream: FC<Props> = () => {
  return (
    <>
      <Card style={{ marginTop: "20px" }}>
        <CardHeader title={"hello"} />
        <CardMedia style={{ height: 320 }}>
          <LocalVideo />
          <RemoteVideo />
        </CardMedia>
        <CardActions>
          <CreateRoom />
          <JoinRoom />
          <HongUp />
        </CardActions>
      </Card>
    </>
  );
};

export default Stream;
