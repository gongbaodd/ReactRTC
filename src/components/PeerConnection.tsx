import React, {
  useState,
  createContext,
  useContext,
  FC,
  useEffect,
  useCallback,
} from "react";
import config from "../configs/iceServers";

interface ContextValue {
  conn: RTCPeerConnection;
}

const PeerContext = createContext<ContextValue>({
  conn: new RTCPeerConnection(),
});

const listen = (conn: RTCPeerConnection) => {
  conn.addEventListener("icegatheringstatechange", () =>
    console.log(
      `[listen P2P] ICE gathering state changed: ${conn.iceGatheringState}`,
    ),
  );

  conn.addEventListener("connectionstatechange", () =>
    console.log(
      `[listen P2P] Connection state change: ${conn.connectionState}`,
    ),
  );

  conn.addEventListener("signalingstatechange", () =>
    console.log(`[listen P2P] Signaling state change: ${conn.signalingState}`),
  );

  conn.addEventListener("iceconnectionstatechange", () =>
    console.log(
      `[listen P2P] ICE connection state change: ${conn.iceConnectionState}`,
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

  return <PeerContext.Provider value={{ conn }} children={children} />;
};

export default PeerConnection;

const useConnection = () => {
  const { conn } = useContext(PeerContext);
  return conn;
};

export const useOnGetLocalCandidate = (
  updateCandidate: (init: RTCIceCandidateInit) => void,
) => {
  const conn = useConnection();

  useEffect(() => {
    console.log("listening icecandidate", conn);
    conn.addEventListener("icecandidate", event => {
      if (event.candidate) {
        console.log("[P2P ICE local] Got candidate!", event.candidate);
        updateCandidate(event.candidate.toJSON());
        return;
      }
      console.log("[P2P ICE local] Got final candidate!", event);
    });
  }, [conn, updateCandidate]);
};

export const useUpdateRemoteCandidateCallback = () => {
  const conn = useConnection();
  const callback = useCallback(
    async (data: RTCIceCandidateInit) => {
      await conn.addIceCandidate(new RTCIceCandidate(data));
      console.log("[P2P] got remote Candidate", data);
    },
    [conn],
  );

  return callback;
};

export const useStreamToPeer = (localStream: MediaStream) => {
  const conn = useConnection();

  useEffect(() => {
    localStream.getTracks().forEach(t => {
      conn.addTrack(t, localStream);
      console.log("[P2P] stream to peer", localStream);
    });
  }, [localStream, conn]);
};

export const useStreamFromPeer = (setStreams: (ss: MediaStream[]) => void) => {
  const conn = useConnection();

  useEffect(() => {
    conn.addEventListener("track", ({ streams: remoteStreams }) => {
      console.log("[P2P RemoteStream] Got remote track:", remoteStreams);

      const ss = remoteStreams.map(rs => {
        const s = new MediaStream();
        rs.getTracks().forEach(t => s.addTrack(t));
        return s;
      });

      setStreams(ss);
    });
  }, [conn, setStreams]);
};

export const useRemoteSessionDescriptionCallback = () => {
  const conn = useConnection();
  const callback = useCallback(
    async (init: RTCSessionDescriptionInit) => {
      await conn.setRemoteDescription(new RTCSessionDescription(init));
      console.log("[P2P] got remote session description", init);
    },
    [conn],
  );

  return callback;
};

export const useCreateOfferCallback = () => {
  const conn = useConnection();

  const callback = useCallback(async () => {
    const offer = await conn.createOffer();
    await conn.setLocalDescription(offer);
    console.log("[P2P] created offer:", offer);

    return offer;
  }, [conn]);

  return callback;
};

export const useAcceptOfferCallback = () => {
  const conn = useConnection();
  const setRemote = useRemoteSessionDescriptionCallback();
  const callback = useCallback(
    async (offer: RTCSessionDescriptionInit) => {
      console.log("[P2P] got offer", offer);
      await setRemote(offer);

      const answer = await conn.createAnswer();

      console.log("[P2P] created answer", answer);
      await conn.setLocalDescription(answer);
      console.log("[P2P] setLocalDescription", answer);

      return answer;
    },
    [conn, setRemote],
  );

  return callback;
};

export const useSetRemoteDescriptionCallback = () => {
  const conn = useConnection();
  const callback = useCallback(
    async (data: RTCSessionDescriptionInit) => {
      if (conn.currentRemoteDescription) {
        console.log("[P2P] Got remote description", data);

        const rtcSessionDescription = new RTCSessionDescription(data);
        await conn.setRemoteDescription(rtcSessionDescription);
        console.log("[P2P] setRemoteDescription", rtcSessionDescription);
      }
    },
    [conn],
  );

  return callback;
};

export const useHangUpCallback = () => {
  const conn = useConnection();
  const callback = useCallback(async () => {
    await conn.close();
    console.log("[P2P] connection closed");
  }, [conn]);

  return callback;
};
