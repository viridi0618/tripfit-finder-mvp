import { Destination, Origin } from "../data";
import { officialTripComLinks } from "./tripcom-links";

const DEFAULT_ALLIANCE_ID = "10173661";
const DEFAULT_SID = "328960094";

function normalizeName(name: string): string {
  return name.trim().toLowerCase().replace(/[^a-z0-9]/g, "");
}

/**
 * Resolves the official Trip.com hotel affiliate URL for a destination.
 * If not found in the exact curated list, generates a compliant Trip.com hotel search deep link.
 */
export function getHotelAffiliateUrl(destination: Destination): string {
  const normDest = normalizeName(destination.city);
  const found = officialTripComLinks.find(
    (l) => l.type === "hotel" && normalizeName(l.destination) === normDest,
  );

  if (found) {
    return found.url;
  }

  const sub1 = `guide_${destination.id.replace(/-/g, "_")}_hotels`;
  const params = new URLSearchParams({
    city: destination.city,
    Allianceid: DEFAULT_ALLIANCE_ID,
    SID: DEFAULT_SID,
    trip_sub1: sub1,
  });

  return `https://sg.trip.com/hotels/list?${params.toString()}`;
}

/**
 * Resolves the official Trip.com flight affiliate URL for an origin -> destination route.
 * If not found in the exact curated list, generates a compliant Trip.com flight search deep link.
 */
export function getFlightAffiliateUrl(
  destination: Destination,
  origin?: Origin | null,
): string {
  const normDest = normalizeName(destination.city);
  const normOrigin = origin ? normalizeName(origin.city || origin.name) : "";

  if (normOrigin) {
    const found = officialTripComLinks.find(
      (l) =>
        l.type === "flight" &&
        l.origin &&
        normalizeName(l.origin) === normOrigin &&
        normalizeName(l.destination) === normDest,
    );

    if (found) {
      return found.url;
    }
  }

  const sub1 = `guide_${destination.id.replace(/-/g, "_")}_flights`;
  const originCity = origin?.city || origin?.name || "";
  const routePath = originCity
    ? `${encodeURIComponent(originCity)}-to-${encodeURIComponent(destination.city)}`
    : `${encodeURIComponent(destination.city)}-flights`;

  const params = new URLSearchParams({
    flighttype: "S",
    dcity: origin?.iata || "",
    acity: destination.airportCode,
    Allianceid: DEFAULT_ALLIANCE_ID,
    SID: DEFAULT_SID,
    trip_sub1: sub1,
  });

  return `https://sg.trip.com/flights/${routePath}/tickets-${origin?.iata || "ALL"}-${destination.airportCode}?${params.toString()}`;
}
