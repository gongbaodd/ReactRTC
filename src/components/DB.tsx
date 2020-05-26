import React, { createContext, FC, useState, useContext } from "react";
import firebase from "../utils/firebase";

class RoomData {
  async getCollection() {
    const db = firebase.firestore();
    const collection = await db.collection("rooms");

    return collection;
  }
}

const RoomContext = createContext<RoomData>(new RoomData());

const DB: FC = ({ children }) => {
  const [roomData] = useState(() => new RoomData());

  return <RoomContext.Provider value={roomData} children={children} />;
};

export default DB;

export const useNewRoomCallback = () => {
  const roomData = useContext(RoomContext);

  return async (data: {
    offer: {
      type: RTCSessionDescriptionInit["type"];
      sdp: RTCSessionDescriptionInit["sdp"];
    };
  }) => {
    const col = await roomData.getCollection();
    const room = await col.doc();
    room.set(data);
    return room.id;
  };
};
