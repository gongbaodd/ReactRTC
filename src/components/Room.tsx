import React, {
  createContext,
  FC,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import firebase from "../utils/firebase";
import { useDB } from "./DB";
import { createRoom, getRoomById, updateRoomOfferAnswer } from "../db/room";
import { Collection, updateCandidate, onCandidateUpdated } from "../db/candidates";

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

const useRoom = () => {
  const { room } = useContext(RoomContext);
  return room;
};

export const useRoomId = () => {
  const {room} = useContext(RoomContext);
  return room?.id;
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

export const useExistRoomCallback = () => {
  const db = useDB();
  const { setRoom } = useContext(RoomContext);

  return async (id: string) => {
    const room = await getRoomById(db, id);
    const snapshot = await room.get();

    if (snapshot.exists) {
      console.log("Got room:", snapshot);
      setRoom(room);
    }

    return snapshot;
  };
};

export const useUpdateRoomAnswerCallback = () => {
  const room = useRoom();

  return async (data: Parameters<typeof updateRoomOfferAnswer>[1]) => {
    if (room) {
      await updateRoomOfferAnswer(room, data);
    }
  };
};

export const useOnUpdateRoomAnswer = (callback: (init: Parameters<typeof updateRoomOfferAnswer>[1]['answer']) => Promise<void>) => {
  const room = useRoom();

  useEffect(() => room?.onSnapshot(async snapshot => {
    const result = await snapshot.data();
    if (result && result.answer) {
        await callback(result.answer);
    }
  }), [room, callback]);
};

export const useUpdateLocalCandidateCallback = () => {
  const room = useRoom();
  const callback = useCallback(async (hostIs: Collection, init: RTCIceCandidateInit) => {
    if(room) {
      await updateCandidate(room, hostIs, init);
    }
  },[room]);

  return callback;
}

export const useOnUpdateRemoteCandidate = (remoteIs: Collection | null, callback:  (d: RTCIceCandidateInit) => void,) => {
  const room = useRoom();
  
  useEffect(() => {
    if (room && remoteIs) {
      onCandidateUpdated(room, remoteIs, callback);
    }
  }, [room, remoteIs, callback]);
}

export const useCancelRoomCallback = () => {
  const room = useRoom();
  const callback = useCallback(async () => {
    if (room) {

      const caller = await room.collection(Collection.caller).get();
      const callee = await room.collection(Collection.callee).get();

      caller.forEach(async c => c.ref.delete());
      callee.forEach(async c => c.ref.delete());

      room.delete();
    }
    
  }, [room]);

  return callback;
}
