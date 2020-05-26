import * as React from "react";
import "./styles.css";
import Container from "@material-ui/core/Container";
import Stream from "./components/Stream";
import { PeerConnection } from "./components/PeerConnection";

export default function App() {
  return (
    <Container className="App">
      <PeerConnection>
        <Stream />
      </PeerConnection>
    </Container>
  );
}
