export function getInitials(name = "") {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  return parts
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

export function formatCurrency(amount) {
  if (!amount) return "Free";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatEventLocation(location) {
  if (!location) return "Location to be announced";
  if (location.mode === "online") return "Online event";
  const place = [location.venue, location.city].filter(Boolean).join(", ");
  const base = place || "Location to be announced";
  return location.mode === "hybrid" ? `${base} · Hybrid` : base;
}

export function formatEventAddress(location) {
  if (!location) return null;
  const parts = [
    location.address,
    location.city,
    location.postalCode,
    location.country,
  ].filter(Boolean);
  return parts.length > 0 ? parts.join(", ") : null;
}

export function formatPriceRange(priceRanges) {
  const ranges = (priceRanges ?? []).filter(
    (range) => Number.isFinite(range.min) || Number.isFinite(range.max),
  );
  if (ranges.length === 0) return "Price not announced";

  const currency = ranges[0].currency ?? "USD";
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  });

  const mins = ranges.map((range) => range.min).filter(Number.isFinite);
  const maxs = ranges.map((range) => range.max).filter(Number.isFinite);
  const min = mins.length ? Math.min(...mins) : null;
  const max = maxs.length ? Math.max(...maxs) : null;

  if (min === 0 && (!max || max === 0)) return "Free";
  if (min != null && max != null && max > min) {
    return `${formatter.format(min)} – ${formatter.format(max)}`;
  }
  if (min != null) return formatter.format(min);
  if (max != null) return formatter.format(max);
  return "Price not announced";
}

export function pluralize(count, singular, plural = `${singular}s`) {
  return count === 1 ? singular : plural;
}
