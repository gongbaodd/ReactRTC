import firebase from "firebase";

const COL_NAME = "rooms";

export const createRoom = async (
  db: firebase.firestore.Firestore,
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
