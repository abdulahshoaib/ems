import { useMemo, useState } from "react";

import { Button } from "../../components/ui/button";
import { EmptyState, ErrorState } from "../../components/ui/empty-state";
import { EventRow } from "../../components/ui/event-row";
import { EventDetailsModal } from "../../components/ui/event-details-modal";
import { FilterTabs } from "../../components/ui/filter-tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { List } from "../../components/ui/section";
import { EventRowSkeleton } from "../../components/ui/skeleton";
import { CalendarIcon, SearchIcon } from "../../components/ui/icons";

import { ALL_COUNTRIES, COUNTRIES } from "../../data/countries";
import { getRegistration } from "../../data/selectors";
import { useDashboardData } from "../../hooks/useDashboardData";
import { useTicketmasterEvents } from "../../hooks/useTicketmasterEvents";
import { pluralize } from "../../lib/format";

export function DiscoverEvents() {
  const {
    data: dashboardData,
    registerForEvent,
    cancelRegistration,
  } = useDashboardData();

  const [country, setCountry] = useState(ALL_COUNTRIES);
  const { events: upcoming, status, error, retry } = useTicketmasterEvents({
    countryCode: country === ALL_COUNTRIES ? "" : country,
  });

  const [category, setCategory] = useState("all");
  const [query, setQuery] = useState("");
  const [activeEvent, setActiveEvent] = useState(null);

  const registrations = dashboardData?.registrations ?? [];

  const visible = useMemo(() => {
    const term = query.trim().toLowerCase();

    return upcoming.filter((event) => {
      const matchesCategory = category === "all" || event.category === category;

      const matchesQuery =
        !term ||
        (event.title ?? "").toLowerCase().includes(term) ||
        (event.summary ?? "").toLowerCase().includes(term) ||
        (event.organizer ?? "").toLowerCase().includes(term) ||
        (event.venueName ?? "").toLowerCase().includes(term) ||
        (event.location?.city ?? "").toLowerCase().includes(term) ||
        (event.genre ?? "").toLowerCase().includes(term);

      return matchesCategory && matchesQuery;
    });
  }, [upcoming, category, query]);

  const categoryOptions = useMemo(() => {
    const counts = new Map();

    for (const event of upcoming) {
      const name = event.category || "Other";
      counts.set(name, (counts.get(name) ?? 0) + 1);
    }

    return [
      {
        value: "all",
        label: "All",
        count: upcoming.length,
      },
      ...Array.from(counts, ([name, count]) => ({
        value: name,
        label: name,
        count,
      })).sort((a, b) => a.label.localeCompare(b.label)),
    ];
  }, [upcoming]);

  if (status === "error") {
    return (
      <ErrorState
        title="We couldn't load events"
        description={
          error?.message ??
          "Ticketmaster could not load events. Please try again."
        }
        onRetry={retry}
      />
    );
  }

  const isLoading = status === "loading";

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
        <p className="text-[13px] text-[var(--d-muted)]">
          {isLoading
            ? "Loading events…"
            : `${upcoming.length} ${pluralize(upcoming.length, "event")}`}
        </p>

        <div className="flex flex-wrap items-center gap-2">
          <Select value={country} onValueChange={setCountry}>
            <SelectTrigger aria-label="Filter by country" className="w-40">
              <SelectValue placeholder="All countries" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_COUNTRIES}>All countries</SelectItem>
              {COUNTRIES.map((option) => (
                <SelectItem key={option.code} value={option.code}>
                  {option.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="relative w-full sm:w-64">
            <label htmlFor="event-search" className="sr-only">
              Search events by title, organiser or description
            </label>

            <SearchIcon className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--d-subtle)]" />

            <input
              id="event-search"
              type="search"
              value={query}
              onChange={(changeEvent) => setQuery(changeEvent.target.value)}
              placeholder="Search events…"
              className="d-focus h-8 w-full rounded-md border border-[var(--d-line)] bg-[var(--d-surface)] pl-8 pr-3 text-[13px] text-[var(--d-text)] placeholder:text-[var(--d-subtle)]"
            />
          </div>
        </div>
      </div>

      <FilterTabs
        label="Filter by category"
        value={category}
        onChange={setCategory}
        options={categoryOptions}
      />

      {isLoading ? (
        <List>
          {Array.from({ length: 5 }, (_, index) => (
            <EventRowSkeleton key={index} />
          ))}
        </List>
      ) : visible.length === 0 ? (
        <EmptyState
          icon={<CalendarIcon className="h-4 w-4" />}
          title="No events match your filters"
          description="Try a different country or category, or clear the search to see upcoming events."
          action={
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setCategory("all");
                setQuery("");
                setCountry(ALL_COUNTRIES);
              }}
            >
              Clear filters
            </Button>
          }
        />
      ) : (
        <>
          <p className="sr-only" role="status">
            {visible.length} {pluralize(visible.length, "event")} shown
          </p>

          <List>
            {visible.map((event) => (
              <EventRow
                key={event.id}
                event={event}
                registration={getRegistration(registrations, event.id)}
                onViewDetails={setActiveEvent}
                onRegister={(target) => registerForEvent(target.id)}
              />
            ))}
          </List>
        </>
      )}

      <p className="text-[12px] text-[var(--d-subtle)]">
        Event listings provided by Ticketmaster.
      </p>

      <EventDetailsModal
        event={activeEvent}
        registration={
          activeEvent ? getRegistration(registrations, activeEvent.id) : null
        }
        onClose={() => setActiveEvent(null)}
        onRegister={(event) => registerForEvent(event.id)}
        onCancel={(registration) => cancelRegistration(registration.id)}
      />
    </div>
  );
}
