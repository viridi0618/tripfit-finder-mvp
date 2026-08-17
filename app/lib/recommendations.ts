import {
  destinations,
  flightCache,
  type Destination,
  type FlightCache,
  type TripTag,
  type VisaRule,
  type VisaStatus,
  visaRules,
} from "./data";

export type PassportCountry = "UK" | "India";

export type RecommendationInput = {
  passport: string;
  origin: string;
  budget: number;
  days: number;
  preference?: TripTag | "Surprise me" | "";
  offset?: number;
};

export type BudgetStatus = "GOOD FIT" | "TIGHT" | "OVER BUDGET" | "UNKNOWN";

export type Recommendation = {
  destination: Destination;
  visa: VisaRule;
  flight: FlightCache | null;
  stay: { low: number; high: number };
  local: { low: number; high: number };
  total: { low: number | null; high: number | null };
  budgetStatus: BudgetStatus;
  matchScore: number;
  whyItFits: string;
};

const visaWeights: Record<VisaStatus, number> = {
  visa_free: 24,
  eta: 19,
  visa_on_arrival: 17,
  evisa: 15,
  visa_required: 3,
  unknown: 0,
};

export function normalizePassport(passport: string): PassportCountry {
  return passport.toLowerCase().includes("uk") ||
    passport.toLowerCase().includes("brit")
    ? "UK"
    : "India";
}

export function formatMoney(value: number | null): string {
  if (value === null || Number.isNaN(value)) return "Unavailable";
  return `$${Math.round(value).toLocaleString("en-US")}`;
}

export function formatRange(low: number | null, high: number | null): string {
  if (low === null || high === null) return "Unavailable";
  return `${formatMoney(low)}-${formatMoney(high)}`;
}

export function statusLabel(status: VisaStatus): string {
  return status
    .split("_")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
}

export function findVisaRule(
  passport: string,
  destinationCountryCode: string,
): VisaRule {
  const passportCountry = normalizePassport(passport);
  return (
    visaRules.find(
      (rule) =>
        rule.passportCountry === passportCountry &&
        rule.destinationCountryCode === destinationCountryCode,
    ) ?? {
      passportCountry,
      destinationCountryCode,
      status: "unknown",
      maxStayDays: null,
      officialSourceUrl: "https://www.iatatravelcentre.com/",
      lastVerifiedAt: "2026-08-17",
    }
  );
}

export function getCachedFlight(
  origin: string,
  destinationAirportCode: string,
): FlightCache | null {
  return (
    flightCache.find(
      (item) =>
        item.origin.toLowerCase() === origin.toLowerCase() &&
        item.destinationAirportCode === destinationAirportCode,
    ) ?? null
  );
}

export function estimateTrip(
  destination: Destination,
  input: RecommendationInput,
): Recommendation {
  const visa = findVisaRule(input.passport, destination.countryCode);
  const flight = getCachedFlight(input.origin, destination.airportCode);
  const stay = {
    low: destination.stayCostLow * input.days,
    high: destination.stayCostHigh * input.days,
  };
  const local = {
    low: destination.localDailyCostLow * input.days,
    high: destination.localDailyCostHigh * input.days,
  };
  const total =
    flight === null
      ? { low: null, high: null }
      : {
          low: flight.low + stay.low + local.low,
          high: flight.high + stay.high + local.high,
        };

  const budgetStatus = getBudgetStatus(input.budget, total.low, total.high);
  const matchScore = scoreRecommendation({
    destination,
    visa,
    flight,
    totalHigh: total.high,
    budget: input.budget,
    days: input.days,
    preference: input.preference,
  });

  return {
    destination,
    visa,
    flight,
    stay,
    local,
    total,
    budgetStatus,
    matchScore,
    whyItFits: buildWhyItFits(destination, input, visa.status, budgetStatus),
  };
}

export function recommendTrips(input: RecommendationInput): Recommendation[] {
  const offset = input.offset ?? 0;
  const scored = destinations
    .filter((destination) => {
      const [minDays, maxDays] = destination.recommendedTripDays;
      return input.days >= Math.max(2, minDays - 2) && input.days <= maxDays + 4;
    })
    .map((destination) => estimateTrip(destination, input))
    .sort((a, b) => b.matchScore - a.matchScore);

  const windowSize = 5;
  const start = (offset * windowSize) % Math.max(scored.length, 1);
  return [...scored.slice(start), ...scored.slice(0, start)].slice(0, windowSize);
}

function getBudgetStatus(
  budget: number,
  low: number | null,
  high: number | null,
): BudgetStatus {
  if (low === null || high === null) return "UNKNOWN";
  if (high <= budget) return "GOOD FIT";
  if (low <= budget * 1.05) return "TIGHT";
  return "OVER BUDGET";
}

function scoreRecommendation({
  destination,
  visa,
  flight,
  totalHigh,
  budget,
  days,
  preference,
}: {
  destination: Destination;
  visa: VisaRule;
  flight: FlightCache | null;
  totalHigh: number | null;
  budget: number;
  days: number;
  preference?: TripTag | "Surprise me" | "";
}): number {
  const budgetFit =
    totalHigh === null
      ? 8
      : Math.max(0, Math.min(32, 32 - ((totalHigh - budget) / budget) * 30));
  const visaFit = visaWeights[visa.status];
  const [minDays, maxDays] = destination.recommendedTripDays;
  const tripLengthFit = days >= minDays && days <= maxDays ? 16 : 8;
  const preferenceFit =
    preference && preference !== "Surprise me" && destination.tags.includes(preference)
      ? 14
      : preference === "Surprise me" || !preference
        ? 8
        : 0;
  const popularity = destination.popularityScore / 10;
  const flightSignal = flight ? 5 : 0;

  return Math.round(
    Math.max(
      1,
      Math.min(99, budgetFit + visaFit + tripLengthFit + preferenceFit + popularity + flightSignal),
    ),
  );
}

function buildWhyItFits(
  destination: Destination,
  input: RecommendationInput,
  visaStatus: VisaStatus,
  budgetStatus: BudgetStatus,
): string {
  const budgetPhrase =
    budgetStatus === "GOOD FIT"
      ? "keeps the estimated total inside your target budget"
      : budgetStatus === "TIGHT"
        ? "sits close to your budget, so dates and accommodation choice matter"
        : budgetStatus === "OVER BUDGET"
          ? "looks aspirational for this budget unless you find a fare or stay deal"
          : "can still be compared, but the flight estimate is unavailable";
  const visaPhrase =
    visaStatus === "visa_free"
      ? "with a typically low-friction short tourist entry path"
      : visaStatus === "visa_required"
        ? "although the visa step is less convenient"
        : `with a ${statusLabel(visaStatus).toLowerCase()} entry step to verify`;

  return `${destination.city} fits a ${input.days}-day trip ${visaPhrase} and ${budgetPhrase}. It works especially well for ${destination.tags
    .slice(0, 3)
    .join(", ")
    .toLowerCase()} travel.`;
}

export function flightAffiliateUrl(destination: Destination, origin: string): string {
  const query = encodeURIComponent(`${origin} to ${destination.city}`);
  return `https://www.aviasales.com/search?params=${query}&marker=replace-with-affiliate-id`;
}

export function hotelAffiliateUrl(destination: Destination): string {
  const query = encodeURIComponent(`${destination.city} ${destination.country}`);
  return `https://www.booking.com/searchresults.html?ss=${query}&aid=replace-with-affiliate-id`;
}
