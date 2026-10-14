import { useCallback, useEffect, useState } from "react";
import { fetchTicketmasterEvents } from "../services/ticketmaster";

export function useTicketmasterEvents({ countryCode = "" } = {}) {
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState({ key: null, events: [], error: null });

  const requestKey = `${countryCode}#${attempt}`;

  useEffect(() => {
    let cancelled = false;

    fetchTicketmasterEvents({ countryCode })
      .then((events) => {
        if (cancelled) return;
        setState({ key: requestKey, events, error: null });
      })
      .catch(() => {
        if (cancelled) return;
        setState({ key: requestKey, events: [], error: "Unable to load events." });
      });

    return () => {
      cancelled = true;
    };
  }, [countryCode, requestKey]);

  const isLoading = state.key !== requestKey;
  const status = isLoading ? "loading" : state.error ? "error" : "success";

  const retry = useCallback(() => {
    setAttempt((value) => value + 1);
  }, []);

  return {
    events: state.events,
    status,
    error: state.error,
    retry,
  };
}
