import firebase from "firebase";

type Firestore = firebase.firestore.Firestore;

const COL_NAME = "rooms";

export const createRoom = async (
  db: Firestore,
  data: {
    offer: {
      type: RTCSessionDescriptionInit["type"];
      sdp: RTCSessionDescriptionInit["sdp"];
    };
  },
) => {
  const roomData = await db.collection(COL_NAME);
  const room = await roomData.doc();
  room.set(data);

  return room;
};
