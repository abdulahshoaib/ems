import { createSlice } from "@reduxjs/toolkit";

const defaultPreferences = {
  eventReminders: true,
  registrationUpdates: true,
  nearbyEvents: false,
  productNews: false,
};

function loadPreferences() {
  try {
    return {
      ...defaultPreferences,
      ...JSON.parse(localStorage.getItem("preferences") || "{}"),
    };
  } catch {
    return defaultPreferences;
  }
}

const settingsSlice = createSlice({
  name: "settings",

  initialState: {
    preferences: loadPreferences(),
  },

  reducers: {
    setPreference: (state, action) => {
      const { key, value } = action.payload;
      state.preferences[key] = value;
    },
  },
});

export const { setPreference } = settingsSlice.actions;
export default settingsSlice.reducer;
