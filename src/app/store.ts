import { configureStore } from "@reduxjs/toolkit";
import UserDetailsReducer from "../features/UserDetails";
import RoomDetailsReducer from "../features/RoomDetails";
import JoinedRoomsReducer from "../features/JoinedRooms";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const userPersistConfig = {
  key: "userDetails",
  storage: storage,
};

const roomPersistConfig = {
  key: "roomDetails",
  storage: storage,
};

const joinedRoomsPersistConfig = {
  key: "joinedRooms",
  storage: storage,
};

const persistedUserReducer = persistReducer(
  userPersistConfig,
  UserDetailsReducer
);

const persistedRoomReducer = persistReducer(
  roomPersistConfig,
  RoomDetailsReducer
);

const persistedJoinedRoomsReducer = persistReducer(
  joinedRoomsPersistConfig,
  JoinedRoomsReducer
);

const store = configureStore({
  reducer: {
    userDetails: persistedUserReducer,
    roomDetails: persistedRoomReducer,
    joinedRooms: persistedJoinedRoomsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
