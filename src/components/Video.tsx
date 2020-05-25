import React from "react";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardActions from "@material-ui/core/CardActions";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";

const Video = () => {
  return (
    <Card>
      <CardHeader title="localStream" />
      <CardMedia style={{ height: 200, background: "grey" }}>
        <video />
      </CardMedia>
      <CardActions>
        <Button size="small">打开摄像头&麦克风</Button>
      </CardActions>
    </Card>
  );
};

export default Video;
