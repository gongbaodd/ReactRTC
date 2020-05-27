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
