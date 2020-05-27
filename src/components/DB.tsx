import React, { createContext, FC, useState, useContext } from "react";
import firebase from "../utils/firebase";

type FireStore = firebase.firestore.Firestore;

const DbContext = createContext<FireStore | null>(null);

const DB: FC = ({ children }) => {
  const [db] = useState(() => firebase.firestore());

  return <DbContext.Provider value={db} children={children} />;
};

export default DB;

export const useDB = () => {
  const db = useContext(DbContext);
  return db || firebase.firestore();
};
