import * as React from "react";
import "./styles.css";
import Container from "@material-ui/core/Container";
import Video from "./components/Video";

export default function App() {
  return (
    <Container className="App">
      <Video />
    </Container>
  );
}
