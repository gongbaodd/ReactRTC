import * as React from "react";
import "./styles.css";
import Button from "@material-ui/core/Button";

export default function App() {
  return (
    <div className="App">
      <Button variant="contained" color="primary">
        打开摄像头&麦克风
      </Button>
    </div>
  );
}
