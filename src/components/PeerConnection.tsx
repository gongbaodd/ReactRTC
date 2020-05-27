import React, {
  useState,
  createContext,
  useContext,
  FC,
  useEffect,
  useCallback,
} from "react";
import config from "../configs/iceServers";

const PeerContext = createContext<RTCPeerConnection>(new RTCPeerConnection());

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

export const PeerConnection: FC = ({ children }) => {
  const [conn] = useState(() => {
    const c = new RTCPeerConnection(config);
    console.log("create connection", config);
    listen(c);
    return c;
  });
  return <PeerContext.Provider value={conn} children={children} />;
};

export default PeerConnection;

export const useConnection = () => {
  const conn = useContext(PeerContext);
  return conn;
}

export const useStreamToPeer = (localStream: MediaStream) => {
  const conn = useContext(PeerContext);
  useEffect(() => {
    localStream.getTracks().forEach(t => {
      console.log('[P2P] stream to peer');
      conn?.addTrack(t, localStream);
    });
  }, [localStream, conn]);
}

export const useStreamFromPeer = (setStreams: (ss: MediaStream[]) => void) => {
  const conn = useContext(PeerContext);

  useEffect(() => {
    conn.addEventListener("track", ({ streams: remoteStreams }) => {
      console.log("[RemoteStream] Got remote track:", remoteStreams);

      const ss = remoteStreams.map(rs => {
        const s = new MediaStream();
        rs.getTracks().forEach(t => s.addTrack(t));
        return s;
      });

      setStreams(ss);
    });
  }, [conn, setStreams]);
}

export const useRemoteSessionDescriptionCallback = () => {
  const conn = useContext(PeerContext);
  const callback = useCallback(async (init: RTCSessionDescriptionInit) => {
    console.log('[P2P] got remote session description');
    await conn.setRemoteDescription(new RTCSessionDescription(init));
  }, [conn]);

  return callback;
};

export const useCreateOfferCallback = () => {
  const conn = useContext(PeerContext);
  const callback = useCallback(async () => {
    const offer = await conn.createOffer();
    await conn.setLocalDescription(offer);

    console.log('[P2P] created offer:', offer);
    return offer;
  }, [conn]);

  return callback; 
};

export const useAcceptOfferCallback = () => {
  const conn = useContext(PeerContext);
  const setRemote = useRemoteSessionDescriptionCallback();
  const callback = useCallback(async (offer: RTCSessionDescriptionInit) => {
    console.log('[P2P] got offer');
    await setRemote(offer);
    const answer = await conn.createAnswer();
    console.log('[P2P] created answer', answer);

    await conn.setLocalDescription(answer);

    return answer;
  }, [conn, setRemote])

  return callback;
}

export const useSetRemoteDescriptionCallback = () => {
  const conn = useContext(PeerContext);
  const callback = useCallback(async (data: RTCSessionDescriptionInit) => {
    if (conn.currentRemoteDescription) {
      console.log('[P2P] Got remote description', data);

      const rtcSessionDescription = new RTCSessionDescription(data);
      await conn.setRemoteDescription(rtcSessionDescription);
    }
  }, [conn]);

  return callback;
}
