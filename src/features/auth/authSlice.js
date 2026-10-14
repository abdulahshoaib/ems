import { createSlice } from "@reduxjs/toolkit";
import { users } from "../../lib/data";

const authSlice = createSlice({
  name: "auth",

  initialState: {
    user: JSON.parse(localStorage.getItem("currentUser") || "null"),
  },

  reducers: {
    login: (state, action) => {
      const authUser = users.find((user) => {
        user.email === action.payload.email &&
          user.password === action.payload.password;
      });

      if (authUser) {
        state.user = {
          email: authUser.email,
          fullname: authUser.fullname,
        };
      }
    },

    login: (state) => {
      state.user = null;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
