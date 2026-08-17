"use client";

import { useMemo, useState } from "react";
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
};

export function TripFinder({ quizMode = false }: TripFinderProps) {
  const [passport, setPassport] = useState<(typeof passports)[number]>("India");
  const [origin, setOrigin] = useState<(typeof origins)[number]>("New York");
  const [budget, setBudget] = useState(800);
  const [days, setDays] = useState(5);
  const [preference, setPreference] = useState<TripTag | "Surprise me">(
    "Surprise me",
  );
  const [submitted, setSubmitted] = useState(false);
  const [offset, setOffset] = useState(0);

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

  return (
    <section className="tool-band" id="generator">
      <div className="tool-grid">
        <form
          className="finder-panel"
          onSubmit={(event) => {
            event.preventDefault();
            setSubmitted(true);
            setOffset(0);
          }}
        >
          <div>
            <p className="eyebrow">Trip feasibility check</p>
            <h2>{quizMode ? "Where should you go on vacation?" : "Find trips that fit"}</h2>
          </div>
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
              <span>Flying from</span>
              <select
                value={origin}
                onChange={(event) =>
                  setOrigin(event.target.value as (typeof origins)[number])
                }
              >
                {origins.map((item) => (
                  <option key={item}>{item}</option>
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
            Find My Trips
          </button>
        </form>

        <div className="result-panel" aria-live="polite">
          <div className="result-heading">
            <div>
              <p className="eyebrow">Results</p>
              <h2>{submitted ? "Feasible trip ideas" : "Example matches"}</h2>
            </div>
            <button
              className="secondary-button"
              type="button"
              onClick={() => {
                setSubmitted(true);
                setOffset((value) => value + 1);
              }}
            >
              Show Me More
            </button>
          </div>
          <div className="results-stack">
            {recommendations.map((recommendation) => (
              <DestinationResultCard
                key={`${recommendation.destination.id}-${offset}`}
                recommendation={recommendation}
                origin={origin}
                budget={budget}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function DestinationResultCard({
  recommendation,
  origin,
  budget,
}: {
  recommendation: Recommendation;
  origin: string;
  budget: number;
}) {
  const { destination, visa, flight, stay, local, total, budgetStatus } =
    recommendation;

  return (
    <article className="destination-card">
      <div className="destination-topline">
        <div>
          <p className="country-line">
            {destination.country} · {destination.airportCode}
          </p>
          <h3>{destination.city}</h3>
        </div>
        <div className={`fit-badge ${budgetStatus.toLowerCase().replaceAll(" ", "-")}`}>
          {budgetStatus}
        </div>
      </div>
      <div className="score-row">
        <strong>{recommendation.matchScore}% Match</strong>
        <span>Total: {formatRange(total.low, total.high)}</span>
        <span>Your budget: {formatMoney(budget)}</span>
      </div>
      <dl className="cost-grid">
        <div>
          <dt>Entry</dt>
          <dd>{statusLabel(visa.status)}</dd>
        </div>
        <div>
          <dt>Estimated flight</dt>
          <dd>
            {flight ? formatRange(flight.low, flight.high) : "Unavailable"}
          </dd>
        </div>
        <div>
          <dt>Stay</dt>
          <dd>{formatRange(stay.low, stay.high)}</dd>
        </div>
        <div>
          <dt>Local spending</dt>
          <dd>{formatRange(local.low, local.high)}</dd>
        </div>
      </dl>
      <p className="why-copy">{recommendation.whyItFits}</p>
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
