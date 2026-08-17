import {
  destinations,
  flightCache,
  type Destination,
  type FlightCache,
  type Origin,
  type TripTag,
  type VisaRule,
  type VisaStatus,
  visaRules,
} from "./data";

export type PassportCountry = "UK" | "India";

export type RecommendationInput = {
  passport: string;
  origin: Origin;
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
  matchScore: number | null;
  whyItFits: string;
  hasCompleteEstimate: boolean;
  isSupplemental: boolean;
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
  if (status === "eta") return "eTA";
  if (status === "evisa") return "eVisa";
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
  originIata: string,
  destinationAirportCode: string,
): FlightCache | null {
  return (
    flightCache.find(
      (item) =>
        item.originIata === originIata &&
        item.destinationAirportCode === destinationAirportCode,
    ) ?? null
  );
}

export function estimateTrip(
  destination: Destination,
  input: RecommendationInput,
): Recommendation {
  const visa = findVisaRule(input.passport, destination.countryCode);
  const flight = getCachedFlight(input.origin.iata, destination.airportCode);
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

  const hasCompleteEstimate = flight !== null && total.low !== null && total.high !== null;
  const budgetStatus = getBudgetStatus(input.budget, total.low, total.high);
  const matchScore = hasCompleteEstimate ? scoreRecommendation({
    destination,
    visa,
    flight,
    totalHigh: total.high,
    budget: input.budget,
    days: input.days,
    preference: input.preference,
  }) : null;

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
    hasCompleteEstimate,
    isSupplemental: false,
  };
}

export function recommendTrips(input: RecommendationInput): Recommendation[] {
  const offset = input.offset ?? 0;
  const candidates = destinations
    .filter((destination) => {
      const [minDays, maxDays] = destination.recommendedTripDays;
      return input.days >= Math.max(2, minDays - 2) && input.days <= maxDays + 4;
    })
    .map((destination) => estimateTrip(destination, input));

  const complete = candidates
    .filter((recommendation) => recommendation.hasCompleteEstimate)
    .sort((a, b) => (b.matchScore ?? 0) - (a.matchScore ?? 0));
  const incomplete = candidates
    .filter((recommendation) => !recommendation.hasCompleteEstimate)
    .sort(
      (a, b) =>
        visaWeights[b.visa.status] + b.destination.popularityScore / 10 -
        (visaWeights[a.visa.status] + a.destination.popularityScore / 10),
    );

  const windowSize = 5;
  if (complete.length >= 3) {
    const start = (offset * windowSize) % complete.length;
    return [...complete.slice(start), ...complete.slice(0, start)].slice(0, windowSize);
  }

  const needed = Math.max(0, 3 - complete.length);
  return [
    ...complete,
    ...incomplete.slice(0, needed).map((recommendation) => ({
      ...recommendation,
      isSupplemental: true,
      budgetStatus: "UNKNOWN" as const,
      matchScore: null,
    })),
  ].slice(0, windowSize);
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
  if (budgetStatus === "UNKNOWN") {
    return `${destination.city} is a relevant trip idea for ${destination.tags
      .slice(0, 3)
      .join(", ")
      .toLowerCase()} travel, but we do not have enough fare data from ${input.origin.name} to calculate a reliable total yet.`;
  }

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

export function flightAffiliateUrl(destination: Destination, origin: Origin): string {
  const params = new URLSearchParams({
    origin_iata: origin.iata,
    destination_iata: destination.airportCode,
  });
  const marker =
    process.env.NEXT_PUBLIC_AVIASALES_MARKER ?? process.env.AVIASALES_MARKER;

  if (marker) {
    params.set("marker", marker);
  }

  return `https://search.aviasales.com/flights/?${params.toString()}`;
}

export function hotelAffiliateUrl(destination: Destination): string {
  const params = new URLSearchParams({
    ss: `${destination.city} ${destination.country}`,
  });
  const aid =
    process.env.NEXT_PUBLIC_BOOKING_AID ?? process.env.BOOKING_AID;

  if (aid) {
    params.set("aid", aid);
  }

  return `https://www.booking.com/searchresults.html?${params.toString()}`;
}
