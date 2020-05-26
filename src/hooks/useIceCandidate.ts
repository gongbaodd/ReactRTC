import { useMemo } from "react";
import { dbDocument } from "./useDatabase";

const useIceCandidate = (roomRef: dbDocument, conn: RTCPeerConnection) => {
  useMemo(() => {
    if (roomRef) {
      const callerCandidates = roomRef.collection("callerCandidates");
      const calleeCandidates = roomRef.collection("calleeCandidates");

      conn.addEventListener("icecandidate", ({ candidate }) => {
        if (candidate) {
          console.log("[ICE caller] Got candidate!", candidate);
          callerCandidates.add(candidate.toJSON());
          return;
        }
        console.log("[ICE caller] Got final candidate!");
      });

      calleeCandidates.onSnapshot(snapshot => {
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

      return {
        callerCandidates,
      };
    }
  }, [roomRef, conn]);
};

export default useIceCandidate;
