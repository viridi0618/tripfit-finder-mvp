import type { Metadata } from "next";
import { destinations } from "../../lib/data";
import {
  findVisaRule,
  formatRange,
  hotelAffiliateUrl,
  statusLabel,
} from "../../lib/recommendations";

type DestinationPageProps = {
  params: { id: string };
};

export function generateStaticParams() {
  return destinations.map((destination) => ({ id: destination.id }));
}

export function generateMetadata({ params }: DestinationPageProps): Metadata {
  const destination = destinations.find((item) => item.id === params.id);
  if (!destination) return { title: "Destination" };

  return {
    title: `${destination.city} Travel Budget and Entry Snapshot`,
    description: `Plan a realistic trip to ${destination.city}, ${destination.country} with budget ranges, tags, and passport entry context.`,
    alternates: { canonical: `/destinations/${destination.id}` },
  };
}

export default function DestinationPage({ params }: DestinationPageProps) {
  const destination = destinations.find((item) => item.id === params.id);

  if (!destination) {
    return (
      <main>
        <section className="page-hero compact">
          <h1>Destination not found</h1>
          <p>This MVP only includes a small supported destination set.</p>
        </section>
      </main>
    );
  }

  const ukVisa = findVisaRule("UK", destination.countryCode);
  const indiaVisa = findVisaRule("India", destination.countryCode);

  return (
    <main>
      <section className="destination-hero">
        <img
          src={destination.image}
          alt={destination.imageAlt}
          width="1400"
          height="900"
        />
        <div className="destination-hero-overlay">
          <p className="breadcrumb">
            <a href="/destinations">Destinations</a> / {destination.city}
          </p>
          <p className="eyebrow">{destination.region}</p>
          <h1>
            {destination.city}, {destination.country}
          </h1>
          <p>{destination.shortDescription}</p>
          <div className="tag-row wide">
            {destination.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </div>
      </section>
      <section className="content-band split-band">
        <div>
          <p className="eyebrow">Budget planning</p>
          <h2>Cost Inputs Used By The Generator</h2>
          <p>
            These are approximate planning ranges. The recommendation engine
            combines them with origin-based cached flight data and trip length.
          </p>
        </div>
        <dl className="metric-list">
          <div>
            <dt>Recommended trip length</dt>
            <dd>
              {destination.recommendedTripDays[0]}-
              {destination.recommendedTripDays[1]} days
            </dd>
          </div>
          <div>
            <dt>Accommodation per night</dt>
            <dd>
              {formatRange(destination.stayCostLow, destination.stayCostHigh)}
            </dd>
          </div>
          <div>
            <dt>Local spend per day</dt>
            <dd>
              {formatRange(
                destination.localDailyCostLow,
                destination.localDailyCostHigh,
              )}
            </dd>
          </div>
          <div>
            <dt>Season notes</dt>
            <dd>{destination.seasonTags.join(", ")}</dd>
          </div>
        </dl>
      </section>
      <section className="content-band">
        <div className="section-heading">
          <p className="eyebrow">Entry snapshot</p>
          <h2>Passport Context</h2>
        </div>
        <div className="method-grid">
          <div>
            <h3>UK passport</h3>
            <p translate="no">{statusLabel(ukVisa.status)}</p>
            <a href={ukVisa.officialSourceUrl}>Official source</a>
            <small>Last verified: {ukVisa.lastVerifiedAt}</small>
          </div>
          <div>
            <h3>Indian passport</h3>
            <p translate="no">{statusLabel(indiaVisa.status)}</p>
            <a href={indiaVisa.officialSourceUrl}>Official source</a>
            <small>Last verified: {indiaVisa.lastVerifiedAt}</small>
          </div>
          <div>
            <h3>Bookability</h3>
            <p>
              Flights and hotels are checked through replaceable affiliate CTA
              links rather than a login-gated booking flow.
            </p>
            <a href={hotelAffiliateUrl(destination)} rel="nofollow sponsored">
              Find Hotels
            </a>
          </div>
        </div>
      </section>
      <section className="content-band cta-band">
        <h2>Check whether {destination.city} fits your passport and budget</h2>
        <a className="primary-link" href="/#generator">
          Find destinations that fit your passport and budget
        </a>
      </section>
    </main>
  );
}
