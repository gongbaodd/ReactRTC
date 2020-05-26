import * as React from "react";
import "./styles.css";
import Container from "@material-ui/core/Container";
import Stream from "./components/Stream";
import PeerConnection from "./components/PeerConnection";
import DB from "./components/DB";

export default function App() {
  return (
    <Container className="App">
      <DB>
        <PeerConnection>
          <Stream />
        </PeerConnection>
      </DB>
    </Container>
  );
}
