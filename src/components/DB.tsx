import React, { createContext, FC, useState, useContext } from "react";
import firebase from "../utils/firebase";
import { createRoom } from "../db/room";

type FireStore = firebase.firestore.Firestore;

const DbContext = createContext<FireStore>(firebase.firestore());

const DB: FC = ({ children }) => {
  const [db] = useState(() => firebase.firestore());

  return <DbContext.Provider value={db} children={children} />;
};

export default DB;

export const useDB = () => {
  const db = useContext(DbContext);
  return db;
};

export const useNewRoomCallback = () => {
  const db = useContext(DbContext);

  return async (data: Parameters<typeof createRoom>[1]) => {
    const room = await createRoom(db, data);
    return room.id;
  };
};
