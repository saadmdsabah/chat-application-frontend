import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface Message {
  sender: string;
  content: string;
  timestamp: Date;
}

interface roomDetails {
  roomId: string;
  messages: Message[];
  connected: boolean;
}

const initialState: roomDetails = {
  roomId: "",
  messages: [],
  connected: false,
};

const roomSlice = createSlice({
  name: "roomDetails",
  initialState,
  reducers: {
    setRoomId: (state, action: PayloadAction<string>) => {
      state.roomId = action.payload;
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },
    setMessages: (state, action: PayloadAction<Message[]>) => {
      state.messages = action.payload;
    },
    setConnected: (state, action: PayloadAction<boolean>) => {
      state.connected = action.payload;
    },
  },
});

export const { setRoomId, addMessage, setMessages, setConnected } =
  roomSlice.actions;
export default roomSlice.reducer;
