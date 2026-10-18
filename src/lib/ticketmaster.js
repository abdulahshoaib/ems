const BASE_URL = "https://app.ticketmaster.com/discovery/v2";

function toApiDateTime(value) {
  const date = value instanceof Date ? value : new Date(value);
  return date.toISOString().replace(/\.\d{3}Z$/, "Z");
}

/**
 * Low-level Ticketmaster Discovery API client. Returns the raw event entities
 * so the service layer owns all shape mapping.
 */
export async function getEvents({
  keyword = "",
  size = 20,
  page = 0,
  sort = "date,asc",
  startDateTime = new Date(),
  countryCode = "",
  ...rest
} = {}) {
  const apiKey = import.meta.env.VITE_TICKETMASTER_API_KEY;

  if (!apiKey) {
    throw new Error("Missing VITE_TICKETMASTER_API_KEY environment variable.");
  }

  const params = new URLSearchParams({
    apikey: apiKey,
    size: String(size),
    page: String(page),
    sort,
    startDateTime: toApiDateTime(startDateTime),
    includeTBA: "no",
    includeTBD: "no",
    ...rest,
  });

  if (keyword.trim()) {
    params.set("keyword", keyword.trim());
  }

  if (countryCode) {
    params.set("countryCode", countryCode);
  }

  const response = await fetch(`${BASE_URL}/events.json?${params.toString()}`);

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Invalid Ticketmaster API key.");
    }

    if (response.status === 429) {
      throw new Error("Ticketmaster rate limit reached. Try again shortly.");
    }

    throw new Error(`Ticketmaster API request failed (${response.status}).`);
  }

  const result = await response.json();

  return {
    events: result._embedded?.events ?? [],
    totalPages: result.page?.totalPages ?? 1,
  };
}
