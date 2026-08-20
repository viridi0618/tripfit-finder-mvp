"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";
import {
  airports,
  origins,
  passportAliases,
  passports,
  tripTags,
  type Airport,
  type Origin,
  type Passport,
  type TripTag,
} from "../lib/data";
import { HeroDestinationCarousel } from "./HeroDestinationCarousel";
import {
  formatRange,
  recommendTrips,
  statusLabel,
  type Recommendation,
} from "../lib/recommendations";

type TripFinderProps = {
  quizMode?: boolean;
  homeMode?: boolean;
};

type SubmittedSearch = {
  passport: Passport;
  origin: Origin;
  budget: number;
  days: number;
  preference: TripTag | "Surprise me";
};

export function TripFinder({ quizMode = false, homeMode = false }: TripFinderProps) {
  const [passportId, setPassportId] = useState("india");
  const [originIata, setOriginIata] = useState("NYC");
  const [budget, setBudget] = useState(800);
  const [days, setDays] = useState(5);
  const [preference, setPreference] = useState<TripTag | "Surprise me">(
    "Surprise me",
  );
  const [offset, setOffset] = useState(0);
  const [isRevealing, setIsRevealing] = useState(false);
  const [originNotice, setOriginNotice] = useState<OriginNotice | null>(null);
  const [fallbackPrompt, setFallbackPrompt] = useState<FallbackPrompt | null>(null);
  const [activeSearch, setActiveSearch] = useState<SubmittedSearch | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const passport = passports.find((item) => item.id === passportId) ?? passports[4];
  const origin = origins.find((item) => item.iata === originIata) ?? origins[0];
  const hasSubmittedResults = activeSearch !== null;

  const recommendations = useMemo(
    () =>
      activeSearch
        ? recommendTrips({
            passport: activeSearch.passport.id,
            origin: activeSearch.origin,
            budget: activeSearch.budget,
            days: activeSearch.days,
            preference: activeSearch.preference,
            offset,
          })
        : [],
    [activeSearch, offset],
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
              setOffset(0);
              setActiveSearch({
                passport,
                origin,
                budget,
                days,
                preference: quizMode ? preference : "Surprise me",
              });
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

  const resultsPanel = hasSubmittedResults && activeSearch ? (
        <div
          className={`result-panel ${isRevealing ? "is-revealing" : ""}`}
          aria-live="polite"
          ref={resultRef}
        >
          <div className="result-heading">
            <div>
              <h2>Trips that fit your plan</h2>
              <p>
                Flight estimates from {activeSearch.origin.name} (
                <span translate="no">{activeSearch.origin.iata}</span>).
              </p>
            </div>
            <button
              className="secondary-button"
              type="button"
              onClick={() => {
                revealResults(() => {
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
                origin={activeSearch.origin}
                passport={activeSearch.passport}
                budget={activeSearch.budget}
                days={activeSearch.days}
                featured={index === 0 && recommendation.hasCompleteEstimate}
              />
            ))}
          </div>
        </div>
  ) : null;

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
        {resultsPanel ? (
          <section className="home-results-band">
            <div className="home-results-shell">{resultsPanel}</div>
          </section>
        ) : null}
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
  const inputRef = useRef<HTMLInputElement>(null);
  const options = useMemo(() => searchPassports(query), [query]);

  return (
    <div className="combo-box">
      <input
        ref={inputRef}
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
      <ComboMenuPortal anchorRef={inputRef} open={open} className="combo-menu">
        {options.map((passport) => (
          <button
            key={passport.id}
            className="passport-option"
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
      </ComboMenuPortal>
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
  const inputRef = useRef<HTMLInputElement>(null);
  const airportResults = useMemo(() => searchAirports(query), [query]);
  const showPopular = open && query.trim().length === 0;

  return (
    <div className="combo-box departure-combo">
      <input
        ref={inputRef}
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
      <ComboMenuPortal
        anchorRef={inputRef}
        open={open}
        className="combo-menu departure-menu"
      >
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
      </ComboMenuPortal>
    </div>
  );
}

type ComboMenuPortalProps = {
  anchorRef: RefObject<HTMLInputElement | null>;
  open: boolean;
  className: string;
  children: ReactNode;
};

type ComboMenuPosition = {
  left: number;
  top: number;
  width: number;
  maxHeight: number;
};

function ComboMenuPortal({
  anchorRef,
  open,
  className,
  children,
}: ComboMenuPortalProps) {
  const position = useComboMenuPosition(anchorRef, open);

  if (!open || !position || typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <div
      className={className}
      style={{
        position: "fixed",
        left: position.left,
        top: position.top,
        width: position.width,
        maxHeight: position.maxHeight,
      }}
    >
      {children}
    </div>,
    document.body,
  );
}

function useComboMenuPosition(
  anchorRef: RefObject<HTMLInputElement | null>,
  open: boolean,
) {
  const [position, setPosition] = useState<ComboMenuPosition | null>(null);

  useEffect(() => {
    if (!open) {
      setPosition(null);
      return;
    }

    const updatePosition = () => {
      const anchor = anchorRef.current;
      if (!anchor) return;

      const rect = anchor.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const gutter = 12;
      const width = Math.min(rect.width, viewportWidth - gutter * 2);
      const left = Math.min(
        Math.max(gutter, rect.left),
        viewportWidth - width - gutter,
      );
      const spaceBelow = viewportHeight - rect.bottom - gutter;
      const spaceAbove = rect.top - gutter;
      const openUpward = spaceBelow < 280 && spaceAbove > spaceBelow;
      const availableSpace = Math.max(
        132,
        (openUpward ? spaceAbove : spaceBelow) - 8,
      );
      const maxHeight = Math.min(420, availableSpace);
      const top = openUpward
        ? Math.max(gutter, rect.top - maxHeight - 8)
        : Math.min(rect.bottom + 8, viewportHeight - gutter - maxHeight);

      setPosition({ left, top, width, maxHeight });
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [anchorRef, open]);

  return position;
}

function searchPassports(query: string): Passport[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return [...passports];

  return [...passports]
    .map((passport) => {
      const aliases = passportAliases[passport.countryCode] ?? [];
      const exactAlias = aliases.includes(normalized);
      const startAlias = aliases.some((a) => a.startsWith(normalized));
      const containAlias = aliases.some((a) => a.includes(normalized));

      const score =
        passport.countryCode.toLowerCase() === normalized || exactAlias
          ? 0
          : passport.name.toLowerCase() === normalized
            ? 1
            : passport.name.toLowerCase().startsWith(normalized) || startAlias
              ? 2
              : passport.id.includes(normalized)
                ? 3
                : passport.name.toLowerCase().includes(normalized) || containAlias
                  ? 4
                  : 99;

      return { passport, score };
    })
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
  const { destination, visa, flight, total, budgetStatus } = recommendation;
  const hasCompleteEstimate = recommendation.hasCompleteEstimate;
  const statusClass = hasCompleteEstimate
    ? budgetStatus.toLowerCase().replaceAll(" ", "-")
    : "insufficient-price-data";
  const statusText = hasCompleteEstimate ? budgetStatus : "Estimate unavailable";
  const tagLine = destination.tags.slice(0, 2).join(" · ");
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
      <a
        className="result-image-wrap result-card-image"
        href={destinationUrl}
        aria-label={`Open ${destination.city} travel guide`}
      >
        {featured ? <span className="best-match">#1 Best Match</span> : null}
        <img
          src={destination.image}
          alt={destination.imageAlt}
          width="900"
          height="560"
          loading={featured ? "eager" : "lazy"}
        />
      </a>
      <div className="result-card-body">
        <div className="result-card-topline">
          <p className="country-line">{destination.country}</p>
          <div className={`fit-badge ${statusClass}`}>{statusText}</div>
        </div>
        <h3 className="result-card-city">
          <a href={destinationUrl}>{destination.city}</a>
        </h3>
        {tagLine ? <p className="result-tagline">{tagLine}</p> : null}

        <div className="trip-total-block">
          <span>Estimated total</span>
          <strong>
            {hasCompleteEstimate
              ? formatRange(total.low, total.high)
              : "Flight estimate unavailable"}
          </strong>
        </div>

        <dl className="result-stat-list">
          <div>
            <dt>Entry</dt>
            <dd translate="no">{statusLabel(visa.status)}</dd>
          </div>
          <div>
            <dt>Flight</dt>
            <dd>
              {hasCompleteEstimate && flight
                ? formatRange(flight.low, flight.high)
                : "Unavailable"}
            </dd>
          </div>
        </dl>
      </div>
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
