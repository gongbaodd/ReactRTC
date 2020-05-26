import firebase from "firebase";
import { useState, useEffect } from "react";

export type dbDocument = firebase.firestore.DocumentReference<
  firebase.firestore.DocumentData
> | null;

const getRoomRef = async () => {
  const db = firebase.firestore();
  const roomRef = await db.collection("rooms").doc();
  return roomRef;
};

export const useRooms = (): (() => dbDocument) => {
  const [roomRef, setRoomRef] = useState<dbDocument>(null);

  useEffect(() => {
    getRoomRef().then(ref => setRoomRef(ref));
  }, []);

  return () => roomRef;
};
