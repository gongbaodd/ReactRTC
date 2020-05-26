import { useMemo } from "react";
import { dbDocument } from "./useDatabase";

enum HOST_IS {
  caller,
  callee,
}

type Doc = firebase.firestore.CollectionReference<
  firebase.firestore.DocumentData
>;

const AddCandidate = (
  hostIs: HOST_IS,
  caller: Doc,
  callee: Doc,
  conn: RTCPeerConnection,
) => () => {
  const local = hostIs === HOST_IS.caller ? caller : callee;
  const remote = hostIs === HOST_IS.caller ? callee : caller;

  conn.addEventListener("icecandidate", ({ candidate }) => {
    if (candidate) {
      console.log("[ICE caller] Got candidate!", candidate);
      local.add(candidate.toJSON());
      return;
    }
    console.log("[ICE caller] Got final candidate!");
  });

  remote.onSnapshot(snapshot => {
    snapshot.docChanges().forEach(async change => {
      if (change.type === "added") {
        const data = change.doc.data();
        console.log(
          `[ICE callee] Got remote ICE candidate: ${JSON.stringify(data)}`,
        );
        await conn.addIceCandidate(new RTCIceCandidate(data));
      }
    });
  });
};

const useIceCandidate = (roomRef: dbDocument, conn: RTCPeerConnection) => {
  return useMemo(() => {
    if (roomRef) {
      const callerCandidates = roomRef.collection("callerCandidates");
      const calleeCandidates = roomRef.collection("calleeCandidates");

      return {
        callerAddCandidates: AddCandidate(
          HOST_IS.caller,
          callerCandidates,
          calleeCandidates,
          conn,
        ),
        calleeAddCandidates: AddCandidate(
          HOST_IS.callee,
          callerCandidates,
          calleeCandidates,
          conn,
        ),
      };
    }

    return {};
  }, [roomRef, conn]);
};

export default useIceCandidate;
