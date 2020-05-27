import React, {
  createContext,
  useState,
  useEffect,
  FC,
  useContext,
} from "react";
import { useConnection } from "./PeerConnection";
import { useRoom } from "./Room";
import { Collection, updateCandidate } from "../db/candidates";

type DocumentReference = firebase.firestore.DocumentReference<
  firebase.firestore.DocumentData
>;

interface CandidateValue {
  candidate: DocumentReference | null;
  setCandidate: (data: DocumentReference) => void;
  hostIs: Collection | null;
  setHostIs: (hostIs: Collection) => void;
}

const CandidateContext = createContext<CandidateValue>({
  candidate: null,
  setCandidate: () => {},
  hostIs: null,
  setHostIs: () => null,
});

const LocalCandidate: FC = ({ children }) => {
  const [candidate, setCandidate] = useState<CandidateValue["candidate"]>(null);
  const [hostIs, setHostIs] = useState<CandidateValue["hostIs"]>(null);

  const conn = useConnection();
  const room = useRoom();
  useEffect(() => {
    if (room && conn && hostIs) {
      conn.addEventListener("icecandidate", ({ candidate }) => {
        if (candidate) {
          console.log("[ICE local] Got candidate!", candidate);
          updateCandidate(room, hostIs, candidate.toJSON());
          return;
        }
        console.log("[ICE local] Got final candidate!");
      });
    }
  }, [conn, room, hostIs]);

  return (
    <CandidateContext.Provider
      value={{ candidate, setCandidate, hostIs, setHostIs }}
      children={children}
    />
  );
};

export const useCallerCandidateCallback = () => {
  const { setHostIs } = useContext(CandidateContext);
  return () => setHostIs(Collection.caller);
};

export const useCalleeCandidateCallback = () => {
  const { setHostIs } = useContext(CandidateContext);
  return () => setHostIs(Collection.callee);
};

export default LocalCandidate;
