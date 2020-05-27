import { useLocalCandidateContext } from "../components/LocalCandidates";
import { useRemoteCandidateContext } from "../components/RemoteCandidates";
import { Collection } from "../db/candidates";

export const useClaimCallerCallback = () => {
  const { setHostIs } = useLocalCandidateContext();
  const { setRemoteIs } = useRemoteCandidateContext();

  return () => {
    setHostIs(Collection.caller);
    setRemoteIs(Collection.callee);
  };
};

export const useClaimCalleeCallback = () => {
  const { setHostIs } = useLocalCandidateContext();
  const { setRemoteIs } = useRemoteCandidateContext();

  return () => {
    setHostIs(Collection.callee);
    setRemoteIs(Collection.caller);
  };
};
