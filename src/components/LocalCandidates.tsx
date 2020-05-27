import React, {
  createContext,
  useState,
  FC,
  useContext,
  useCallback,
} from "react";
import { useOnGetLocalCandidate } from "./PeerConnection";
import { Collection } from "../db/candidates";
import { useUpdateLocalCandidateCallback } from "./Room";

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
  const updateCandidateByHost = useUpdateLocalCandidateCallback();
  const updateCandidate = useCallback(
    async (init: RTCIceCandidateInit) => {
      if (!hostIs) {
        console.log("[updateCandidate] hostIs not provided!");
        return;
      }
      console.log("[updateCandidate] hostIs done", hostIs);
      await updateCandidateByHost(hostIs, init);
    },
    [hostIs, updateCandidateByHost],
  );

  useOnGetLocalCandidate(updateCandidate);

  return (
    <CandidateContext.Provider
      value={{ candidate, setCandidate, hostIs, setHostIs }}
      children={children}
    />
  );
};

export default LocalCandidate;

export const useLocalCandidateContext = () => {
  return useContext(CandidateContext);
};
