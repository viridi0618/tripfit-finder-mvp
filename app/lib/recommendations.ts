import {
  destinations,
  flightCache,
  passportAliases,
  passports,
  type Destination,
  type FlightCache,
  type Origin,
  type TripTag,
  type VisaRule,
  type VisaStatus,
  visaRules,
} from "./data";
import { getVisaStatus } from "./visa";

export type PassportCountry = string;

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
  const normalized = passport.trim().toLowerCase();
  const match = passports.find(
    (item) =>
      item.id.toLowerCase() === normalized ||
      item.countryCode.toLowerCase() === normalized ||
      item.name.toLowerCase() === normalized,
  );

  if (match) return match.countryCode;

  for (const [code, aliases] of Object.entries(passportAliases)) {
    if (aliases.some((alias) => alias === normalized || normalized.includes(alias))) {
      return code;
    }
  }

  return passport.trim().toUpperCase();
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
  if (status === "unknown") return "Check required";
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
  const existing = visaRules.find(
    (rule) =>
      rule.passportCountry === passportCountry &&
      rule.destinationCountryCode === destinationCountryCode,
  );
  if (existing) {
    return existing;
  }

  // Fallback to verified Visa Matrix resolver (getVisaStatus)
  const resolved = getVisaStatus(passportCountry, destinationCountryCode);
  return {
    passportCountry,
    destinationCountryCode,
    status: resolved.status,
    maxStayDays: null,
    officialSourceUrl: "",
    lastVerifiedAt: "2026-08-21",
  };
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
    hasCompleteEstimate,
    isSupplemental: !hasCompleteEstimate,
  };
}

export function recommendTrips(input: RecommendationInput): Recommendation[] {
  const offset = input.offset ?? 0;
  const windowSize = 5;

  const rankedCandidates = destinations
    .filter((destination) => {
      const [minDays, maxDays] = destination.recommendedTripDays;
      return input.days >= Math.max(2, minDays - 2) && input.days <= maxDays + 4;
    })
    .map((destination) => estimateTrip(destination, input))
    .sort((a, b) => (b.matchScore ?? 0) - (a.matchScore ?? 0));

  if (rankedCandidates.length === 0) {
    return [];
  }

  const start = (offset * windowSize) % rankedCandidates.length;
  return [...rankedCandidates.slice(start), ...rankedCandidates.slice(0, start)].slice(0, windowSize);
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
  const stayCostHigh = destination.stayCostHigh * days;
  const localCostHigh = destination.localDailyCostHigh * days;
  const landCostHigh = stayCostHigh + localCostHigh;

  // Visa fit: 0 to 35 pts
  const visaFit = visaWeights[visa.status] * 1.45;

  // Budget fit: 0 to 30 pts
  let budgetFit: number;
  if (totalHigh !== null) {
    budgetFit =
      totalHigh <= budget
        ? 30
        : Math.max(0, 30 - ((totalHigh - budget) / budget) * 35);
  } else {
    // When flight is not cached, evaluate land cost feasibility against target budget
    budgetFit =
      landCostHigh <= budget * 0.5
        ? 28
        : landCostHigh <= budget * 0.75
          ? 25
          : landCostHigh <= budget
            ? 20
            : Math.max(0, 20 - ((landCostHigh - budget) / budget) * 25);
  }

  // Trip duration fit: 8 to 16 pts
  const [minDays, maxDays] = destination.recommendedTripDays;
  const tripLengthFit = days >= minDays && days <= maxDays ? 16 : 8;

  // Preference fit: 0 to 14 pts
  const preferenceFit =
    preference && preference !== "Surprise me" && destination.tags.includes(preference)
      ? 14
      : preference === "Surprise me" || !preference
        ? 8
        : 0;

  // Popularity fit: 0 to 20 pts (Top iconic cities like Tokyo, Bangkok, Paris, Rome get full boost)
  const popularity = destination.popularityScore * 0.2;

  // Verified Flight bonus: 5 pts (confidence boost, not a barrier)
  const flightConfidenceBonus = flight ? 5 : 0;

  return Math.round(
    Math.max(
      1,
      Math.min(
        99,
        budgetFit + visaFit + tripLengthFit + preferenceFit + popularity + flightConfidenceBonus,
      ),
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
      .toLowerCase()} travel, but we do not have enough fare data from ${input.origin.name} (${input.origin.iata}) to calculate a reliable total yet.`;
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
