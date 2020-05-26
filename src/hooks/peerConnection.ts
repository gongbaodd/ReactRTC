import { useMemo } from "react";
import config from "../configs/iceServers";

const listen = (conn: RTCPeerConnection) => {
  conn.addEventListener("icegatheringstatechange", () =>
    console.log(`[P2P] ICE gathering state changed: ${conn.iceGatheringState}`),
  );

  conn.addEventListener("connectionstatechange", () =>
    console.log(`[P2P] Connection state change: ${conn.connectionState}`),
  );

  conn.addEventListener("signalingstatechange", () =>
    console.log(`[P2P] Signaling state change: ${conn.signalingState}`),
  );

  conn.addEventListener("iceconnectionstatechange", () =>
    console.log(
      `[P2P] ICE connection state change: ${conn.iceConnectionState}`,
    ),
  );
};

const usePeerConnection = (...streams: MediaStream[]) =>
  useMemo(() => {
    const conn = new RTCPeerConnection(config);

    console.log("create connection", config);
    listen(conn);

    conn.addEventListener("track", event => {
      console.log(`[P2P] Got remote track:`, event.streams[0]);

      event.streams.forEach((s, streamIndex) =>
        s.getTracks().forEach(track => {
          if (streams[streamIndex]) {
            console.log(
              `[P2P] Add a track to the remoteStream:${
                streams[streamIndex].id
              }`,
              track,
            );

            streams[streamIndex].addTrack(track);
          }
        }),
      );
    });
  }, [streams]);

export default usePeerConnection;
