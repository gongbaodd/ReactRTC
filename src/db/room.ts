import firebase from "firebase";

type Firestore = firebase.firestore.Firestore;
type DocumentReference = firebase.firestore.DocumentReference<
  firebase.firestore.DocumentData
>;

const COL_NAME = "rooms";

export interface RoomData {
  offer: {
    type: RTCSessionDescriptionInit["type"];
    sdp: RTCSessionDescriptionInit["sdp"];
  };
  answer: {
    type: RTCSessionDescriptionInit["type"];
    sdp: RTCSessionDescriptionInit["sdp"];
  };
}

export const createRoom = async (
  db: Firestore,
  data: Pick<RoomData, "offer">,
) => {
  const roomData = await db.collection(COL_NAME);
  const room = await roomData.doc();
  room.set(data);

  return room;
};

export const updateRoomOfferAnswer = async (
  room: DocumentReference,
  data: Pick<RoomData, "answer">,
) => {
  await room.update(data);
};

export const getRoomById = async (db: Firestore, id: string) => {
  const roomData = await db.collection(COL_NAME);
  const room = await roomData.doc(id);
  return room;
};
