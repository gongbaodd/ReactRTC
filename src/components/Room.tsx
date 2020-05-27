import React, { createContext, FC, useState, useContext } from "react";
import firebase from "../utils/firebase";
import { useDB } from "./DB";
import { createRoom } from "../db/room";

type DocumentReference = firebase.firestore.DocumentReference<
  firebase.firestore.DocumentData
>;

interface RoomContextValue {
  room: DocumentReference | null;
  setRoom: (room: DocumentReference) => void;
}

const RoomContext = createContext<RoomContextValue>({
  room: null,
  setRoom: () => {},
});

const Room: FC = ({ children }) => {
  const [room, setRoom] = useState<DocumentReference | null>(null);

  return <RoomContext.Provider value={{ room, setRoom }} children={children} />;
};

export default Room;

export const useRoom = () => {
  const { room } = useContext(RoomContext);
  return room;
};

export const useNewRoomCallback = () => {
  const db = useDB();
  const { setRoom } = useContext(RoomContext);

  return async (data: Parameters<typeof createRoom>[1]) => {
    const room = await createRoom(db, data);
    setRoom(room);
    return room.id;
  };
};
