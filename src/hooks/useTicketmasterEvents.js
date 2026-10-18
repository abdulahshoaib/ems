import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { cachePage } from "../features/events/eventsSlice";
import { fetchTicketmasterEvents } from "../services/ticketmaster";

export const EVENTS_PAGE_SIZE = 20;

export function useTicketmasterEvents({ countryCode = "", page = 0 } = {}) {
  const dispatch = useDispatch();
  const key = `${countryCode}:${page}`;
  const cached = useSelector((state) => state.events.catalog[key]);
  const [attempt, setAttempt] = useState(0);
  const [failure, setFailure] = useState(null);
  const fetchedAttempt = useRef(-1);

  useEffect(() => {
    if (cached && fetchedAttempt.current === attempt) return undefined;

    let cancelled = false;
    setFailure(null);

    fetchTicketmasterEvents({
      countryCode,
      page,
      size: EVENTS_PAGE_SIZE,
    })
      .then((result) => {
        if (cancelled) return;
        fetchedAttempt.current = attempt;
        dispatch(
          cachePage({
            key,
            events: result.events,
            totalPages: result.totalPages,
          }),
        );
      })
      .catch((error) => {
        if (cancelled) return;
        setFailure({ key, error });
      });

    return () => {
      cancelled = true;
    };
  }, [attempt, cached, countryCode, dispatch, key, page]);

  const error = failure?.key === key ? failure.error : null;
  const status = error ? "error" : cached ? "success" : "loading";

  const retry = useCallback(() => {
    setAttempt((value) => value + 1);
  }, []);

  return {
    events: cached?.events ?? [],
    totalPages: cached?.totalPages ?? 1,
    status,
    error,
    retry,
  };
}
