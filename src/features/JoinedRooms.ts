import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  rooms: [] as string[],
};

const joinedRoomsSlice = createSlice({
  name: "joinedRooms",
  initialState,
  reducers: {
    setRooms: (state, action: PayloadAction<string[]>) => {
      state.rooms = action.payload;
    },
    addRoom: (state, action: PayloadAction<string>) => {
      state.rooms.push(action.payload);
    },
  },
});

export const { setRooms, addRoom } = joinedRoomsSlice.actions;
export default joinedRoomsSlice.reducer;
