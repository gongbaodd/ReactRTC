import React, { FC } from "react";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardActions from "@material-ui/core/CardActions";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Video from "./Video";
import useUserMedia from "../hooks/useUserMedia";

interface Props {
  remote?: boolean;
}

const Stream: FC<Props> = ({ remote }) => {
  const { stream, getPermitted } = useUserMedia();

  return (
    <Card style={{ marginTop: "20px" }}>
      <CardHeader title={remote ? "remoteStream" : "localStream"} />
      <CardMedia style={{ height: 200 }}>
        <Video stream={stream} />
        <Video stream={null} />
      </CardMedia>
      <CardActions>
        <Button size="small" onClick={() => getPermitted()}>
          打开摄像头&麦克风
        </Button>
        <Button size="small">加入房间</Button>
        <Button size="small">创建房间</Button>
        <Button size="small">挂断</Button>
      </CardActions>
    </Card>
  );
};

export default Stream;
