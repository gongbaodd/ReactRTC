import firebase from "../utils/firebase";
import { useState, useEffect } from "react";

export type dbDocument = firebase.firestore.DocumentReference<
  firebase.firestore.DocumentData
> | null;

export const getRoomCollection = async () => {
  const db = firebase.firestore();
  const collection = await db.collection("rooms");
  return collection;
};

const getRoomRef = async () => {
  const roomRef = (await getRoomCollection()).doc();
  return roomRef;
};

export const useRooms = (): (() => dbDocument) => {
  const [roomRef, setRoomRef] = useState<dbDocument>(null);

  useEffect(() => {
    getRoomRef().then(ref => setRoomRef(ref));
  }, []);

  return () => roomRef;
};
