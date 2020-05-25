import React, { useRef, useEffect } from "react";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardActions from "@material-ui/core/CardActions";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import useUserMedia from "../hooks/useUserMedia";

const Video = () => {
  const { stream, getPermitted } = useUserMedia();
  const video = useRef<HTMLVideoElement>();

  useEffect(() => {
    if (video.current) {
      video.current.srcObject = stream;
    }
  });

  return (
    <Card>
      <CardHeader title="localStream" />
      <CardMedia style={{ height: 200 }}>
        <video ref={video.current} />
      </CardMedia>
      <CardActions>
        <Button size="small" onClick={() => getPermitted()}>
          打开摄像头&麦克风
        </Button>
      </CardActions>
    </Card>
  );
};

export default Video;
