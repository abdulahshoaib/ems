import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import eventsReducer from "./features/events/eventsSlice";
import settingsReducer from "./features/settings/settingsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    events: eventsReducer,
    settings: settingsReducer,
  },
});

store.subscribe(() => {
  const state = store.getState();
  localStorage.setItem("registrations", JSON.stringify(state.events.registrations));
  localStorage.setItem("preferences", JSON.stringify(state.settings.preferences));
});
