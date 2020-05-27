import * as React from "react";
import "./styles.css";
import Container from "@material-ui/core/Container";
import Stream from "./components/Stream";
import PeerConnection from "./components/PeerConnection";
import DB from "./components/DB";
import Room from "./components/Room";
import LocalCandidate from "./components/LocalCandidates";
import RemoteCandidate from "./components/RemoteCandidates";

export default function App() {
  return (
    <Container className="App">
      <DB>
        <PeerConnection>
          <Room>
            <LocalCandidate>
              <RemoteCandidate>
                <Stream />
              </RemoteCandidate>
            </LocalCandidate>
          </Room>
        </PeerConnection>
      </DB>
    </Container>
  );
}
