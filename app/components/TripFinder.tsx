"use client";

import { useMemo, useRef, useState } from "react";
import { origins, passports, tripTags, type TripTag } from "../lib/data";
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
  const [passport, setPassport] = useState<(typeof passports)[number]>("India");
  const [originIata, setOriginIata] = useState<(typeof origins)[number]["iata"]>(
    "NYC",
  );
  const [budget, setBudget] = useState(800);
  const [days, setDays] = useState(5);
  const [preference, setPreference] = useState<TripTag | "Surprise me">(
    "Surprise me",
  );
  const [submitted, setSubmitted] = useState(false);
  const [offset, setOffset] = useState(0);
  const [isRevealing, setIsRevealing] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);
  const origin = origins.find((item) => item.iata === originIata) ?? origins[0];

  const recommendations = useMemo(
    () =>
      recommendTrips({
        passport,
        origin,
        budget,
        days,
        preference: quizMode ? preference : "Surprise me",
        offset,
      }),
    [passport, origin, budget, days, preference, quizMode, offset],
  );

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
              <select
                value={passport}
                onChange={(event) =>
                  setPassport(event.target.value as (typeof passports)[number])
                }
              >
                {passports.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            <label>
              <span>Departure city / airport</span>
              <small>Where are you starting your trip?</small>
              <select
                value={originIata}
                onChange={(event) =>
                  setOriginIata(event.target.value as (typeof origins)[number]["iata"])
                }
              >
                {origins.map((item) => (
                  <option key={item.iata} value={item.iata}>
                    {item.name} ({item.iata})
                  </option>
                ))}
              </select>
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
              <span>Trip length</span>
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
                budget={budget}
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
          <img
            className="home-hero-image"
            src="/destinations/bali.webp"
            alt="Bali coastline with blue water and tropical cliffs"
            width="1600"
            height="1000"
          />
          <div className="home-hero-overlay" aria-hidden="true" />
          <div className="home-hero-inner">
            <div className="home-hero-copy">
              <p className="eyebrow">Random Vacation Generator</p>
              <h1>Where can you actually go?</h1>
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

function DestinationResultCard({
  recommendation,
  origin,
  budget,
  featured,
}: {
  recommendation: Recommendation;
  origin: (typeof origins)[number];
  budget: number;
  featured: boolean;
}) {
  const { destination, visa, flight, stay, local, total, budgetStatus } =
    recommendation;
  const hasCompleteEstimate = recommendation.hasCompleteEstimate;
  const statusClass = hasCompleteEstimate
    ? budgetStatus.toLowerCase().replaceAll(" ", "-")
    : "insufficient-price-data";
  const statusText = hasCompleteEstimate ? budgetStatus : "Price data needed";

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
            Recent flight estimate: {formatRange(flight.low, flight.high)}
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
      <p className="fine-print">
        Estimated fare based on recent cached price data where available. Actual
        fares and entry rules vary by date and availability.
      </p>
    </article>
  );
}
