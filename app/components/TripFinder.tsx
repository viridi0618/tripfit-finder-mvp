"use client";

import { useMemo, useRef, useState } from "react";
import {
  airports,
  origins,
  passports,
  tripTags,
  type Airport,
  type Origin,
  type Passport,
  type TripTag,
} from "../lib/data";
import { HeroDestinationCarousel } from "./HeroDestinationCarousel";
import {
  flightAffiliateUrl,
  formatMoney,
  formatRange,
  hotelAffiliateUrl,
  recommendTrips,
  statusLabel,
  type Recommendation,
} from "../lib/recommendations";

type TripFinderProps = {
  quizMode?: boolean;
  homeMode?: boolean;
};

export function TripFinder({ quizMode = false, homeMode = false }: TripFinderProps) {
  const [passportId, setPassportId] = useState("india");
  const [originIata, setOriginIata] = useState("NYC");
  const [budget, setBudget] = useState(800);
  const [days, setDays] = useState(5);
  const [preference, setPreference] = useState<TripTag | "Surprise me">(
    "Surprise me",
  );
  const [submitted, setSubmitted] = useState(false);
  const [offset, setOffset] = useState(0);
  const [isRevealing, setIsRevealing] = useState(false);
  const [originNotice, setOriginNotice] = useState<OriginNotice | null>(null);
  const [fallbackPrompt, setFallbackPrompt] = useState<FallbackPrompt | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const passport = passports.find((item) => item.id === passportId) ?? passports[4];
  const origin = origins.find((item) => item.iata === originIata) ?? origins[0];

  const recommendations = useMemo(
    () =>
      recommendTrips({
        passport: passport.id,
        origin,
        budget,
        days,
        preference: quizMode ? preference : "Surprise me",
        offset,
      }),
    [passport.id, origin, budget, days, preference, quizMode, offset],
  );

  function chooseSupportedOrigin(nextOrigin: Origin, notice?: OriginNotice) {
    setOriginIata(nextOrigin.iata);
    setFallbackPrompt(null);
    setOriginNotice(notice ?? { kind: "manual", message: `Flight estimates from ${nextOrigin.name} (${nextOrigin.iata}).` });
  }

  function chooseAirport(airport: Airport) {
    const supportedOrigin = findSupportedOriginForAirport(airport);

    if (supportedOrigin) {
      chooseSupportedOrigin(supportedOrigin, {
        kind: "manual",
        message:
          airport.iata === supportedOrigin.iata
            ? `Flight estimates from ${supportedOrigin.name} (${supportedOrigin.iata}).`
            : `Using ${supportedOrigin.name} (${supportedOrigin.iata}) for fare estimates.`,
      });
      return;
    }

    const nearestSupported = findNearestSupportedOrigin(airport.latitude, airport.longitude);
    setFallbackPrompt({ nearestAirport: airport, supportedOrigin: nearestSupported });
    setOriginNotice(null);
  }

  function handleUseLocation() {
    if (!("geolocation" in navigator)) {
      setOriginNotice({
        kind: "error",
        message: "We couldn't detect your location. Search for a city or airport instead.",
      });
      return;
    }

    setOriginNotice({ kind: "detecting", message: "Finding airports near you..." });
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const nearestAirport = findNearestAirport(
          position.coords.latitude,
          position.coords.longitude,
        );
        const supportedOrigin = findSupportedOriginForAirport(nearestAirport);

        if (supportedOrigin) {
          chooseSupportedOrigin(supportedOrigin, {
            kind: "detected",
            message: `Detected near ${nearestAirport.city}. Flight estimates from ${supportedOrigin.name} (${supportedOrigin.iata}).`,
          });
          return;
        }

        setFallbackPrompt({
          nearestAirport,
          supportedOrigin: findNearestSupportedOrigin(
            nearestAirport.latitude,
            nearestAirport.longitude,
          ),
        });
        setOriginNotice(null);
      },
      () => {
        setOriginNotice({
          kind: "error",
          message: "We couldn't detect your location. Search for a city or airport instead.",
        });
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 10 * 60 * 1000 },
    );
  }

  function revealResults(update: () => void) {
    setIsRevealing(true);
    update();
    window.setTimeout(() => setIsRevealing(false), 360);
    window.setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  }

  const finderForm = (
        <form
          className={`finder-panel ${homeMode ? "hero-finder-card" : ""}`}
          onSubmit={(event) => {
            event.preventDefault();
            revealResults(() => {
              setSubmitted(true);
              setOffset(0);
            });
          }}
        >
          {!homeMode ? (
            <div>
              <p className="eyebrow">Trip feasibility check</p>
              <h2>{quizMode ? "Where should you go on vacation?" : "Find trips that fit"}</h2>
            </div>
          ) : null}
          <div className="form-grid">
            <label>
              <span>Passport</span>
              <PassportCombobox
                selectedPassport={passport}
                onSelect={(nextPassport) => setPassportId(nextPassport.id)}
              />
            </label>
            <label>
              <span>Departure city / airport</span>
              <small>Where are you starting your trip?</small>
              <DepartureCombobox
                selectedOrigin={origin}
                onSelectAirport={chooseAirport}
                onSelectOrigin={(nextOrigin) =>
                  chooseSupportedOrigin(nextOrigin, {
                    kind: "manual",
                    message: `Flight estimates from ${nextOrigin.name} (${nextOrigin.iata}).`,
                  })
                }
                onUseLocation={handleUseLocation}
              />
              {originNotice ? (
                <small className={`origin-status ${originNotice.kind}`}>
                  {originNotice.message}
                </small>
              ) : null}
              {fallbackPrompt ? (
                <div className="origin-fallback">
                  <p>
                    You're closest to {fallbackPrompt.nearestAirport.city} (
                    <span translate="no">{fallbackPrompt.nearestAirport.iata}</span>).
                  </p>
                  <p>
                    For reliable trip estimates, TripFit currently supports{" "}
                    {fallbackPrompt.supportedOrigin.name} (
                    <span translate="no">{fallbackPrompt.supportedOrigin.iata}</span>).
                  </p>
                  <div>
                    <button
                      type="button"
                      onClick={() =>
                        chooseSupportedOrigin(fallbackPrompt.supportedOrigin, {
                          kind: "fallback",
                          message: `Using ${fallbackPrompt.supportedOrigin.name} (${fallbackPrompt.supportedOrigin.iata}), the nearest supported departure airport for fare estimates.`,
                        })
                      }
                    >
                      Use {fallbackPrompt.supportedOrigin.name}
                    </button>
                    <button
                      type="button"
                      onClick={() => setFallbackPrompt(null)}
                    >
                      Choose another airport
                    </button>
                  </div>
                </div>
              ) : null}
            </label>
            <label>
              <span>Total trip budget</span>
              <input
                min="200"
                step="50"
                type="number"
                value={budget}
                onChange={(event) => setBudget(Number(event.target.value))}
              />
            </label>
            <label>
              <span>Trip duration</span>
              <input
                min="2"
                max="21"
                type="number"
                value={days}
                onChange={(event) => setDays(Number(event.target.value))}
              />
            </label>
          </div>
          {quizMode ? (
            <fieldset className="preference-grid">
              <legend>What kind of trip sounds best?</legend>
              {["Surprise me", ...tripTags.slice(0, 9)].map((tag) => (
                <label key={tag}>
                  <input
                    type="radio"
                    name="preference"
                    value={tag}
                    checked={preference === tag}
                    onChange={() => setPreference(tag as TripTag | "Surprise me")}
                  />
                  <span>{tag}</span>
                </label>
              ))}
            </fieldset>
          ) : null}
          <button className="primary-button" type="submit">
            {homeMode ? "Show Me Where I Can Go" : "Find My Trips"}
          </button>
        </form>
  );

  const resultsPanel = (
        <div
          className={`result-panel ${isRevealing ? "is-revealing" : ""}`}
          aria-live="polite"
          ref={resultRef}
        >
          <div className="result-heading">
            <div>
              <p className="eyebrow">Results</p>
              <h2>{submitted ? "Feasible trip ideas" : "Example matches"}</h2>
              <p>
                Flight estimates from {origin.name} (
                <span translate="no">{origin.iata}</span>).
              </p>
            </div>
            <button
              className="secondary-button"
              type="button"
              onClick={() => {
                revealResults(() => {
                  setSubmitted(true);
                  setOffset((value) => value + 1);
                });
              }}
            >
              {isRevealing ? "Finding..." : "Show Me More"}
            </button>
          </div>
          <div className="results-stack">
            {recommendations.map((recommendation, index) => (
              <DestinationResultCard
                key={`${recommendation.destination.id}-${offset}`}
                recommendation={recommendation}
                origin={origin}
                passport={passport}
                budget={budget}
                days={days}
                featured={index === 0 && recommendation.hasCompleteEstimate}
              />
            ))}
          </div>
        </div>
  );

  if (homeMode) {
    return (
      <>
        <section className="home-hero" id="generator">
          <HeroDestinationCarousel />
          <div className="home-hero-inner">
            <div className="home-hero-copy">
              <p className="eyebrow">Random Vacation Generator</p>
              <h1>Where can your passport and budget take you?</h1>
              <p>
                Find trips that fit your passport, departure city, and total
                budget.
              </p>
            </div>
            {finderForm}
          </div>
        </section>
        <section className="home-results-band">
          <div className="home-results-shell">{resultsPanel}</div>
        </section>
      </>
    );
  }

  return (
    <section className="tool-band" id="generator">
      <div className="tool-grid">
        {finderForm}
        {resultsPanel}
      </div>
    </section>
  );
}

type OriginNotice = {
  kind: "manual" | "detected" | "detecting" | "fallback" | "error";
  message: string;
};

type FallbackPrompt = {
  nearestAirport: Airport;
  supportedOrigin: Origin;
};

function PassportCombobox({
  selectedPassport,
  onSelect,
}: {
  selectedPassport: Passport;
  onSelect: (passport: Passport) => void;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const options = useMemo(() => searchPassports(query), [query]);

  return (
    <div className="combo-box">
      <input
        aria-label="Passport"
        autoComplete="off"
        value={open ? query : `${selectedPassport.flag} ${selectedPassport.name}`}
        onBlur={() => window.setTimeout(() => setOpen(false), 120)}
        onChange={(event) => {
          setQuery(event.target.value);
          setOpen(true);
        }}
        onFocus={() => {
          setQuery("");
          setOpen(true);
        }}
        placeholder="Search passport"
      />
      {open ? (
        <div className="combo-menu">
          {options.map((passport) => (
            <button
              key={passport.id}
              type="button"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => {
                onSelect(passport);
                setQuery("");
                setOpen(false);
              }}
            >
              <span>{passport.flag}</span>
              <strong>{passport.name}</strong>
              <small translate="no">{passport.countryCode}</small>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function DepartureCombobox({
  selectedOrigin,
  onSelectAirport,
  onSelectOrigin,
  onUseLocation,
}: {
  selectedOrigin: Origin;
  onSelectAirport: (airport: Airport) => void;
  onSelectOrigin: (origin: Origin) => void;
  onUseLocation: () => void;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const airportResults = useMemo(() => searchAirports(query), [query]);
  const showPopular = open && query.trim().length === 0;

  return (
    <div className="combo-box departure-combo">
      <input
        aria-label="Departure city or airport"
        autoComplete="off"
        value={open ? query : `${selectedOrigin.name} (${selectedOrigin.iata})`}
        onBlur={() => window.setTimeout(() => setOpen(false), 140)}
        onChange={(event) => {
          setQuery(event.target.value);
          setOpen(true);
        }}
        onFocus={() => {
          setQuery("");
          setOpen(true);
        }}
        placeholder="Search city, airport or IATA"
      />
      {open ? (
        <div className="combo-menu departure-menu">
          <button
            className="combo-location"
            type="button"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => {
              onUseLocation();
              setOpen(false);
            }}
          >
            Use my location
            <small>Find the nearest airport for this trip</small>
          </button>
          {showPopular ? (
            <>
              <div className="combo-section-label">Popular departures</div>
              {origins.slice(0, 10).map((origin) => (
                <button
                  key={origin.iata}
                  type="button"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => {
                    onSelectOrigin(origin);
                    setQuery("");
                    setOpen(false);
                  }}
                >
                  <strong>
                    {origin.name}, {origin.country}
                  </strong>
                  <small translate="no">{origin.iata} · Fare estimates supported</small>
                </button>
              ))}
            </>
          ) : (
            airportResults.map((airport) => {
              const supportedOrigin = findSupportedOriginForAirport(airport);
              return (
                <button
                  key={airport.iata}
                  type="button"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => {
                    onSelectAirport(airport);
                    setQuery("");
                    setOpen(false);
                  }}
                >
                  <strong>
                    {airport.city}, {airport.country}
                  </strong>
                  <small>
                    <span translate="no">{airport.iata}</span> · {airport.name}
                    {supportedOrigin ? " · Fare estimates supported" : ""}
                  </small>
                </button>
              );
            })
          )}
          {!showPopular && airportResults.length === 0 ? (
            <p className="combo-empty">No matching airport yet.</p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function searchPassports(query: string): Passport[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return [...passports];

  return [...passports]
    .map((passport) => ({
      passport,
      score:
        passport.countryCode.toLowerCase() === normalized
          ? 0
          : passport.name.toLowerCase() === normalized
            ? 1
            : passport.name.toLowerCase().startsWith(normalized)
              ? 2
              : passport.id.includes(normalized)
                ? 3
                : passport.name.toLowerCase().includes(normalized)
                  ? 4
                  : 99,
    }))
    .filter((item) => item.score < 99)
    .sort((a, b) => a.score - b.score || a.passport.name.localeCompare(b.passport.name))
    .map((item) => item.passport);
}

function searchAirports(query: string): Airport[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return [];

  return airports
    .map((airport) => {
      const supportedOrigin = findSupportedOriginForAirport(airport);
      const city = airport.city.toLowerCase();
      const airportName = airport.name.toLowerCase();
      const iata = airport.iata.toLowerCase();
      const cityCode = airport.cityCode?.toLowerCase() ?? "";
      const country = airport.country.toLowerCase();
      const exactIata = iata === normalized || cityCode === normalized;
      const exactCity = city === normalized;
      const score = exactIata
        ? 0
        : exactCity
          ? 1
          : airportName.startsWith(normalized)
            ? 2
            : city.startsWith(normalized)
              ? 3
              : iata.startsWith(normalized) || cityCode.startsWith(normalized)
                ? 4
                : city.includes(normalized) ||
                    airportName.includes(normalized) ||
                    country.includes(normalized) ||
                    iata.includes(normalized) ||
                    cityCode.includes(normalized)
                  ? 5
                  : 99;

      return { airport, score: score + (supportedOrigin ? 0 : 0.35) };
    })
    .filter((item) => item.score < 99)
    .sort((a, b) => a.score - b.score || a.airport.city.localeCompare(b.airport.city))
    .slice(0, 8)
    .map((item) => item.airport);
}

function findSupportedOriginForAirport(airport: Airport): Origin | null {
  return (
    origins.find((origin) => origin.iata === airport.iata) ??
    origins.find((origin) => origin.iata === airport.cityCode) ??
    null
  );
}

function findNearestAirport(latitude: number, longitude: number): Airport {
  return [...airports].sort(
    (a, b) =>
      distanceKm(latitude, longitude, a.latitude, a.longitude) -
      distanceKm(latitude, longitude, b.latitude, b.longitude),
  )[0];
}

function findNearestSupportedOrigin(latitude: number, longitude: number): Origin {
  return [...origins].sort(
    (a, b) =>
      distanceKm(latitude, longitude, a.latitude, a.longitude) -
      distanceKm(latitude, longitude, b.latitude, b.longitude),
  )[0];
}

function distanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const earthRadiusKm = 6371;
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) ** 2;

  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function toRadians(value: number): number {
  return (value * Math.PI) / 180;
}

function DestinationResultCard({
  recommendation,
  origin,
  passport,
  budget,
  days,
  featured,
}: {
  recommendation: Recommendation;
  origin: Origin;
  passport: Passport;
  budget: number;
  days: number;
  featured: boolean;
}) {
  const { destination, visa, flight, stay, local, total, budgetStatus } =
    recommendation;
  const hasCompleteEstimate = recommendation.hasCompleteEstimate;
  const statusClass = hasCompleteEstimate
    ? budgetStatus.toLowerCase().replaceAll(" ", "-")
    : "insufficient-price-data";
  const statusText = hasCompleteEstimate ? budgetStatus : "Price data needed";
  const destinationUrl = destinationDetailUrl(
    destination.id,
    passport,
    origin.iata,
    budget,
    days,
  );

  return (
    <article
      className={`destination-card ${featured ? "featured" : ""} ${
        hasCompleteEstimate ? "" : "incomplete-estimate"
      }`}
    >
      <div className="result-image-wrap">
        <img
          src={destination.image}
          alt={destination.imageAlt}
          width="900"
          height="560"
          loading={featured ? "eager" : "lazy"}
        />
        <div className="result-image-overlay">
          {featured ? <span className="best-match">#1 Best Match</span> : null}
          <div className="destination-topline">
            <div>
              <p className="country-line">
                {destination.country} ·{" "}
                <span translate="no">{destination.airportCode}</span> ·{" "}
                {hasCompleteEstimate
                  ? `${recommendation.matchScore}% Match`
                  : "More trip ideas"}
              </p>
              <h3>{destination.city}</h3>
            </div>
            <div className={`fit-badge ${statusClass}`}>
              {statusText}
            </div>
          </div>
        </div>
      </div>
      <div className="trip-total-block">
        <span>{hasCompleteEstimate ? "Estimated trip total" : "More trip ideas"}</span>
        <strong>
          {hasCompleteEstimate
            ? formatRange(total.low, total.high)
            : "Flight estimate unavailable"}
        </strong>
        <p>
          {!hasCompleteEstimate
            ? "We don't have enough fare data to calculate a reliable total for this route yet."
            : budgetStatus === "GOOD FIT"
            ? `Fits your ${formatMoney(budget)} total budget`
            : budgetStatus === "TIGHT"
              ? `Possible, but tight for your ${formatMoney(budget)} budget`
              : budgetStatus === "OVER BUDGET"
                ? `Above your ${formatMoney(budget)} total budget`
                : "Insufficient price data"}
        </p>
      </div>
      <div className="reality-checks">
        <span>
          Entry: <span translate="no">{statusLabel(visa.status)}</span>
        </span>
        {hasCompleteEstimate && flight ? (
          <span>
            Planning flight estimate: {formatRange(flight.low, flight.high)}
          </span>
        ) : null}
      </div>
      <dl className="cost-grid">
        {hasCompleteEstimate && flight ? (
          <div>
            <dt>Estimated flight</dt>
            <dd>{formatRange(flight.low, flight.high)}</dd>
          </div>
        ) : null}
        <div>
          <dt>Stay</dt>
          <dd>{formatRange(stay.low, stay.high)}</dd>
        </div>
        <div>
          <dt>Local spending</dt>
          <dd>{formatRange(local.low, local.high)}</dd>
        </div>
      </dl>
      <p className="why-copy">
        {hasCompleteEstimate
          ? recommendation.whyItFits
          : destination.shortDescription}
      </p>
      <div className="tag-row">
        {destination.tags.slice(0, 4).map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>
      <div className="cta-row">
        <a href={flightAffiliateUrl(destination, origin)} rel="nofollow sponsored">
          Check Current Flights
        </a>
        <a href={hotelAffiliateUrl(destination)} rel="nofollow sponsored">
          Find Hotels
        </a>
      </div>
      <a className="guide-link" href={destinationUrl}>
        Explore {destination.city} Guide
      </a>
      <p className="fine-print">
        This is a planning estimate, not a live or recently observed fare.
        Check current prices and entry rules before booking.
      </p>
    </article>
  );
}

function destinationDetailUrl(
  destinationId: string,
  passport: Passport,
  originIata: string,
  budget: number,
  days: number,
) {
  const params = new URLSearchParams({
    passport: passport.id,
    from: originIata,
    budget: String(budget),
    days: String(days),
  });

  return `/destinations/${destinationId}?${params.toString()}`;
}
