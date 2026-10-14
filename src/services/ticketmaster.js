import { getEvents } from "../lib/ticketmaster";

const FALLBACK_SUMMARY = "No additional event description is available.";

function pickImage(images = []) {
  return (
    images.find((image) => image.ratio === "16_9" && image.width >= 1000) ??
    images.find((image) => image.ratio === "16_9") ??
    images[0] ??
    null
  );
}

function joinParts(parts, separator = ", ") {
  return parts.filter(Boolean).join(separator);
}

function toNumber(value) {
  if (value == null || value === "") return null;
  const number = typeof value === "number" ? value : Number.parseFloat(value);
  return Number.isFinite(number) ? number : null;
}

function normalizeAddress(address) {
  if (!address) return null;
  return joinParts([address.line1, address.line2, address.line3], " ").trim() || null;
}

function normalizeImage(image) {
  return {
    url: image.url ?? null,
    ratio: image.ratio ?? null,
    width: image.width ?? null,
    height: image.height ?? null,
    fallback: Boolean(image.fallback),
    attribution: image.attribution ?? null,
  };
}

function normalizeClassification(classification) {
  return {
    primary: Boolean(classification.primary),
    segment: classification.segment?.name ?? null,
    genre: classification.genre?.name ?? null,
    subGenre: classification.subGenre?.name ?? null,
    type: classification.type?.name ?? null,
    subType: classification.subType?.name ?? null,
  };
}

function normalizePriceRange(range) {
  return {
    type: range.type ?? "standard",
    currency: range.currency ?? "USD",
    min: toNumber(range.min),
    max: toNumber(range.max),
  };
}

function normalizePresale(presale) {
  return {
    name: presale.name ?? null,
    description: presale.description ?? null,
    url: presale.url ?? null,
    startDateTime: presale.startDateTime ?? null,
    endDateTime: presale.endDateTime ?? null,
  };
}

function normalizeEvent(event) {
  const venue = event._embedded?.venues?.[0] ?? null;
  const attractions = event._embedded?.attractions ?? [];

  const classifications = event.classifications ?? [];
  const primary =
    classifications.find((classification) => classification.primary) ??
    classifications[0] ??
    null;

  const start = event.dates?.start ?? null;
  const end = event.dates?.end ?? null;
  const access = event.dates?.access ?? null;
  const sales = event.dates?.sales ?? event.sales ?? null;
  const publicSale = sales?.public ?? null;

  const images = (event.images ?? []).map(normalizeImage);
  const image = pickImage(event.images);

  const priceRanges = (event.priceRanges ?? []).map(normalizePriceRange);
  const primaryRange = priceRanges[0] ?? null;

  const city = venue?.city?.name ?? null;
  const state = venue?.state?.stateCode ?? venue?.state?.name ?? null;
  const country = venue?.country?.countryCode ?? venue?.country?.name ?? null;

  const cityLine = joinParts([city, state]);

  const attractionNames = attractions.map((attraction) => attraction.name).filter(Boolean);

  return {
    id: event.id,
    source: "ticketmaster",

    title: event.name ?? "Untitled event",
    summary: event.info ?? event.pleaseNote ?? event.description ?? FALLBACK_SUMMARY,
    info: event.info ?? null,
    pleaseNote: event.pleaseNote ?? null,
    description: event.description ?? null,

    category: primary?.segment?.name ?? "Other",
    segment: primary?.segment?.name ?? null,
    genre: primary?.genre?.name ?? null,
    subGenre: primary?.subGenre?.name ?? null,
    eventType: primary?.type?.name ?? null,
    subType: primary?.subType ?? primary?.subTypes?.[0]?.name ?? null,
    classifications: classifications.map(normalizeClassification),

    organizer: joinParts(attractionNames) || event.promoter?.name || venue?.name || "Ticketmaster",
    promoter: event.promoter
      ? { id: event.promoter.id ?? null, name: event.promoter.name ?? null, description: event.promoter.description ?? null }
      : null,
    promoters: (event.promoters ?? []).map((promoter) => ({
      id: promoter.id ?? null,
      name: promoter.name ?? null,
      description: promoter.description ?? null,
    })),
    attractions: attractions.map((attraction) => ({
      id: attraction.id ?? null,
      name: attraction.name ?? null,
      url: attraction.url ?? null,
      imageUrl: pickImage(attraction.images)?.url ?? null,
    })),

    startDate: start?.dateTime ?? start?.localDate ?? null,
    endDate: end?.dateTime ?? end?.localDate ?? null,
    startLocalDate: start?.localDate ?? null,
    startLocalTime: typeof start?.localTime === "string" ? start.localTime : null,
    startDateTBD: Boolean(start?.dateTBD),
    startDateTBA: Boolean(start?.dateTBA),
    startTimeTBA: Boolean(start?.timeTBA),
    noSpecificTime: Boolean(start?.noSpecificTime),
    endApproximate: Boolean(end?.approximate),
    timezone: event.dates?.timezone ?? venue?.timezone ?? null,
    status: event.dates?.status?.code ?? null,
    spanMultipleDays: Boolean(event.dates?.spanMultipleDays),

    access: access
      ? {
          startDateTime: access.startDateTime ?? null,
          endDateTime: access.endDateTime ?? null,
          startApproximate: Boolean(access.startApproximate),
          endApproximate: Boolean(access.endApproximate),
        }
      : null,

    sales: sales
      ? {
          publicStart: publicSale?.startDateTime ?? null,
          publicEnd: publicSale?.endDateTime ?? null,
          startTBD: Boolean(publicSale?.startTBD),
          presales: (sales.presales ?? []).map(normalizePresale),
        }
      : null,

    priceRanges,
    price: primaryRange?.min ?? primaryRange?.max ?? null,
    currency: primaryRange?.currency ?? "USD",

    location: {
      venue: venue?.name ?? null,
      city: cityLine,
      address: normalizeAddress(venue?.address),
      postalCode: venue?.postalCode ?? null,
      country,
      latitude: toNumber(venue?.location?.latitude),
      longitude: toNumber(venue?.location?.longitude),
      mode: venue ? "in-person" : "online",
      url: venue?.url ?? null,
    },

    images,
    imageUrl: image?.url ?? null,

    ticketUrl: event.url ?? null,
    seatmapUrl: event.seatmap?.staticUrl ?? null,
    accessibility: event.accessibility?.info ?? null,
    ticketLimit: event.ticketLimit?.info ?? event.ticketLimit?.infos?.info ?? null,
    ageRestricted: Boolean(event.ageRestrictions?.legalAgeEnforced),
    locale: event.locale ?? null,
    distance: toNumber(event.distance),
    units: event.units ?? null,

    outlets: event.outlets ?? [],
    products: event.products ?? [],
    externalLinks: event.externalLinks ?? null,

    tags: [primary?.genre?.name, primary?.subGenre?.name].filter(Boolean),

    raw: event,
  };
}

/**
 * Fetch events from the Ticketmaster Discovery API and normalise them into the
 * dashboard's canonical event shape (plus extra Tickemaster-only detail used by
 * the event details dialog).
 */
export async function fetchTicketmasterEvents(options = {}) {
  const events = await getEvents(options);
  return events.map(normalizeEvent);
}
