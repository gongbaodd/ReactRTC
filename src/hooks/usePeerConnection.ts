import { useMemo, useState } from "react";
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

const createOffer = (conn: RTCPeerConnection) => async () => {
  const offer = await conn.createOffer();
  await conn.setLocalDescription(offer);

  console.log('[P2P] created offer:', offer);
  return offer;
};

const acceptOffer = (conn: RTCPeerConnection) => 
  async (offer: RTCSessionDescriptionInit) => {
    await conn.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await conn.createAnswer();
    console.log('[P2P] created answer', answer);

    await conn.setLocalDescription(answer);

    return answer;
  };

const setRemoteDescription = (conn: RTCPeerConnection) => 
  async (data: RTCSessionDescriptionInit) => {
    if (conn.currentRemoteDescription) {
      console.log('[P2P] Got remote description', data);

      const rtcSessionDescription = new RTCSessionDescription(data);
      await conn.setRemoteDescription(rtcSessionDescription);
    }
  }


const usePeerConnection = (
  localStream: null | MediaStream,
  ...remoteStreams: MediaStream[]
) =>{
  const [conn] = useState(() => {
    const c = new RTCPeerConnection(config);
    console.log("create connection", config);
    listen(c);
    return c;
  });
  
  return useMemo(() => {
    // upload local stream
    localStream?.getTracks().forEach(track => conn.addTrack(track, localStream));

    // download remote stream
    conn.addEventListener("track", event => {
      console.log(`[P2P] Got remote track:`, event.streams[0]);

      event.streams.forEach((s, streamIndex) =>
        s.getTracks().forEach(track => {
          if (remoteStreams[streamIndex]) {
            const { id } = remoteStreams[streamIndex];
            console.log(
              `[P2P] Add a track to the remoteStream:${id}`,
              track,
            );

            remoteStreams[streamIndex].addTrack(track);
          }
        }),
      );
    });

    return {
      connection: conn, 
      createOffer: createOffer(conn), 
      acceptOffer: acceptOffer(conn),
      setRemoteDescription: setRemoteDescription(conn),
    };
  }, [localStream, remoteStreams, conn]);
}
  

export default usePeerConnection;
