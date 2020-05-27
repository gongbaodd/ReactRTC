import React, {
  createContext,
  useState,
  FC,
  useEffect,
  useContext,
} from "react";
import { Collection } from "../db/candidates";
import { useUpdateRemoteCandidateCallback } from "./PeerConnection";
import { useOnUpdateRemoteCandidate } from "./Room";

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
  const updateRemoteCandidate = useUpdateRemoteCandidateCallback();

  useOnUpdateRemoteCandidate(remoteIs, updateRemoteCandidate);

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
