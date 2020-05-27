import React, {
  createContext,
  useState,
  FC,
  useEffect,
  useContext,
} from "react";
import { Collection, onCandidateUpdated } from "../db/candidates";
import { useConnection } from "./PeerConnection";
import { useRoom } from "./Room";

type DocumentReference = firebase.firestore.DocumentReference<
  firebase.firestore.DocumentData
>;

interface CandidateValue {
  candidate: DocumentReference | null;
  setCandidate: (candidate: DocumentReference) => void;
  remoteIs: Collection | null;
  setRemoteIs: (remoteIs: Collection) => void;
}

const CandidateContext = createContext<CandidateValue>({
  candidate: null,
  setCandidate: () => {},
  remoteIs: null,
  setRemoteIs: () => {},
});

const RemoteCandidates: FC = ({ children }) => {
  const [candidate, setCandidate] = useState<CandidateValue["candidate"]>(null);
  const [remoteIs, setRemoteIs] = useState<CandidateValue["remoteIs"]>(null);

  const room = useRoom();
  const conn = useConnection();

  useEffect(() => {
    if (remoteIs && conn && room) {
      onCandidateUpdated(room, remoteIs, async data => {
        await conn.addIceCandidate(new RTCIceCandidate(data));
      });
    }
  }, [remoteIs, conn, room]);

  return (
    <CandidateContext.Provider
      children={children}
      value={{ candidate, setCandidate, remoteIs, setRemoteIs }}
    />
  );
};

export default RemoteCandidates;

export const useRemoteCandidateContext = () => {
  return useContext(CandidateContext);
};
