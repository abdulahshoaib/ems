import { createSelector, createSlice } from "@reduxjs/toolkit";

function loadRegistrations() {
  try {
    return JSON.parse(localStorage.getItem("registrations") || "[]");
  } catch {
    return [];
  }
}

function withoutRawPayload(event) {
  const rest = { ...event };
  delete rest.raw;
  return rest;
}

const eventsSlice = createSlice({
  name: "events",

  initialState: {
    registrations: loadRegistrations(),
    catalog: {},
  },

  reducers: {
    registerEvent: (state, action) => {
      const { event, userEmail } = action.payload;
      const existing = state.registrations.find(
        (item) => item.eventId === event.id && item.userEmail === userEmail,
      );

      if (existing) {
        existing.status = "confirmed";
        existing.registeredAt = new Date().toISOString();
        existing.event = withoutRawPayload(event);
        return;
      }

      state.registrations.push({
        id: `reg-${Date.now()}`,
        eventId: event.id,
        userEmail,
        status: "confirmed",
        registeredAt: new Date().toISOString(),
        event: withoutRawPayload(event),
      });
    },

    cachePage: (state, action) => {
      const { key, events, totalPages } = action.payload;
      state.catalog[key] = {
        events: events.map(withoutRawPayload),
        totalPages,
      };
    },

    cancelRegistration: (state, action) => {
      const registration = state.registrations.find(
        (item) => item.id === action.payload,
      );
      if (registration) {
        registration.status = "cancelled";
      }
    },
  },
});

export const selectMyRegistrations = createSelector(
  [(state) => state.auth.user?.email, (state) => state.events.registrations],
  (email, registrations) =>
    email ? registrations.filter((item) => item.userEmail === email) : [],
);

export const { registerEvent, cachePage, cancelRegistration } = eventsSlice.actions;
export default eventsSlice.reducer;
