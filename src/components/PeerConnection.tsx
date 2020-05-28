import React, {
  useState,
  createContext,
  useContext,
  FC,
  useEffect,
  useCallback,
} from "react";
import config from "../configs/iceServers";
import { listenConnection } from "../utils/listeners";

interface ContextValue {
  conn: RTCPeerConnection;
  sender: RTCDataChannel | null;
  receiver: RTCDataChannel | null,
}

const PeerContext = createContext<ContextValue>({
  conn: new RTCPeerConnection(),
  sender: null,
  receiver: null,
});

export const PeerConnection: FC = ({ children }) => {
  const [receiver, setReceiver] = useState<ContextValue["receiver"]>(null);
  const [conn] = useState(() => {
    const c = new RTCPeerConnection(config);
    console.log("create connection", config);
    listenConnection(c);
    c.addEventListener('datachannel', ({ channel }) => {
      channel.addEventListener('open', () => {
        console.log('[P2P receiver] open');
        setReceiver(channel);
      });
      channel.addEventListener("message", e => {
        console.error('[P2P receiver] message', e);
      });
      channel.addEventListener('close', () => {
        console.log('[P2P receiver] closed');
        setReceiver(null);
      });
    });
    return c;
  });
  const [sender, setChannel] = useState<ContextValue["sender"]>(() => {
    const c = conn.createDataChannel("send");
    c.addEventListener("open", () => {
      console.log('[P2P sender] open');
      setChannel(c);
    });
    c.addEventListener("message", e => {
      console.error('[P2P sender] message', e);
    });
    c.addEventListener("close", () => {
      console.log('[P2P sender] closed');      
      setChannel(null);
    });
    return null;
  });

  return <PeerContext.Provider value={{ conn, sender, receiver }} children={children} />;
};

export default PeerConnection;

const useConnection = () => {
  const { conn } = useContext(PeerContext);
  return conn;
};

export const useSendMessageCallback = () => {
  const { sender } = useContext(PeerContext);
  const callback = useCallback(
    (message: string) => {
      sender?.send(message);
    },
    [sender],
  );

  return callback;
};

export const useOnMessage = (callback: (m: string) => void) => {
  const { receiver } = useContext(PeerContext);

  useEffect(() => {
    receiver?.addEventListener("message", event => {
      callback(event.data);
    });
  }, [receiver, callback]);
};

export const useOnGetLocalCandidate = (
  updateCandidate: (init: RTCIceCandidateInit) => void,
) => {
  const conn = useConnection();

  useEffect(() => {
    // console.log("listening icecandidate", conn);
    conn.addEventListener("icecandidate", event => {
      if (event.candidate) {
        // console.log("[P2P ICE local] Got candidate!", event.candidate);
        updateCandidate(event.candidate.toJSON());
        return;
      }
      // console.log("[P2P ICE local] Got final candidate!", event);
    });
  }, [conn, updateCandidate]);
};

export const useUpdateRemoteCandidateCallback = () => {
  const conn = useConnection();
  const callback = useCallback(
    async (data: RTCIceCandidateInit) => {
      await conn.addIceCandidate(new RTCIceCandidate(data));
      // console.log("[P2P] got remote Candidate", data);
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
      if (!conn.currentRemoteDescription) {
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
