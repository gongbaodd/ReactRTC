import firebase from "firebase";

type DocumentReference = firebase.firestore.DocumentReference<
  firebase.firestore.DocumentData
>;

export enum Collection {
  caller = "callerCandidates",
  callee = "calleeCandidates",
}

const getCallerRef = (room: DocumentReference) =>
  room.collection(Collection.caller);

const getCalleeRef = (room: DocumentReference) =>
  room.collection(Collection.callee);

const getCandidateRef = (
  room: DocumentReference,
  hostIs: Collection,
) => {
  if (hostIs === Collection.callee) {
    return getCalleeRef(room);
  }

  if (hostIs === Collection.caller) {
    return getCallerRef(room);
  }
};

export const updateCandidate = async (
  room: DocumentReference,
  hostIs: Collection,
  data: RTCIceCandidateInit,
) => {
  await getCandidateRef(room, hostIs)?.add(data);
};

export const onCandidateUpdated = (
  room: DocumentReference,
  remoteIs: Collection,
  callback: (d: RTCIceCandidateInit) => void,
) => getCandidateRef(room, remoteIs)?.onSnapshot(snapshot => {
  snapshot.docChanges().forEach(change => {
    if (change.type === "added") {
      const data = change.doc.data();
      console.log(
        `[ICE remote] Got remote ICE candidate: ${JSON.stringify(data)}`,
      );
      callback(data);
    }
  });
});
