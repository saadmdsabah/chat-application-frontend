import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface UserDetails {
  userName: string;
  aboutUser: string;
  jwtToken: string;
  loggedIn: boolean;
}

const initialState: UserDetails = {
  userName: "",
  aboutUser: "",
  jwtToken: "",
  loggedIn: false,
};

const userDetailsSlice = createSlice({
  name: "userDetails",
  initialState,
  reducers: {
    setUserName: (state, action: PayloadAction<string>) => {
      state.userName = action.payload;
    },
    setAboutUser: (state, action: PayloadAction<string>) => {
      state.aboutUser = action.payload;
    },
    setJwtToken: (state, action: PayloadAction<string>) => {
      state.jwtToken = action.payload;
    },
    setLoggedInStatus: (state, action: PayloadAction<boolean>) => {
      state.loggedIn = action.payload;
    },
  },
});

export const { setUserName, setAboutUser, setJwtToken, setLoggedInStatus } =
  userDetailsSlice.actions;
export default userDetailsSlice.reducer;
