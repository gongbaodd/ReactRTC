import firebase from "firebase";
import { useMemo } from "react";

const useDatabase = () => useMemo(() => firebase.firestore(), []);

export default useDatabase;
