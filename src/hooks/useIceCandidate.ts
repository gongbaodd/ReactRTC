import { useMemo } from "react";
import { dbDocument } from "./useDatabase";

const useIceCandidate = (roomRef: dbDocument, conn: RTCPeerConnection) => {
  useMemo(() => {
    if (roomRef) {
      const candidates = roomRef.collection("callerCandidates");
      conn.addEventListener("icecandidate", ({ candidate }) => {
        if (!candidate) {
          console.log("[ICE] Got final candidate!");
          return;
        }

        console.log("[ICE] Got candidate!", candidate);
        candidates.add(candidate.toJSON());
      });
    }
  }, [roomRef, conn]);
};

export default useIceCandidate;
