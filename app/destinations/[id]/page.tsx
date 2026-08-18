import type { Metadata } from "next";
import { destinations, origins, passports, type Destination } from "../../lib/data";
import {
  estimateTrip,
  findVisaRule,
  flightAffiliateUrl,
  formatMoney,
  formatRange,
  hotelAffiliateUrl,
  statusLabel,
} from "../../lib/recommendations";

type DestinationPageProps = {
  params: { id: string };
  searchParams?: {
    passport?: string;
    from?: string;
    budget?: string;
    days?: string;
  };
};

export function generateStaticParams() {
  return destinations.map((destination) => ({ id: destination.id }));
}

export function generateMetadata({ params }: DestinationPageProps): Metadata {
  const destination = destinations.find((item) => item.id === params.id);
  if (!destination) return { title: "Destination" };

  return {
    title: `${destination.city} Travel Guide, Budget and Entry Snapshot`,
    description: `Explore ${destination.city}, ${destination.country} with photos, quick guide notes, budget ranges, and passport entry context.`,
    alternates: { canonical: `/destinations/${destination.id}` },
  };
}

export default function DestinationPage({
  params,
  searchParams,
}: DestinationPageProps) {
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

  const ukVisa = findVisaRule("united-kingdom", destination.countryCode);
  const indiaVisa = findVisaRule("india", destination.countryCode);
  const tripSnapshot = getTripSnapshot(destination, searchParams);
  const gallery = destination.gallery?.length
    ? destination.gallery
    : [
        {
          src: destination.image,
          alt: destination.imageAlt,
          caption: `${destination.city}, ${destination.country}`,
          credit: destination.imageCredit,
        },
      ];

  return (
    <main>
      <section className="destination-hero guide-hero">
        <img
          src={destination.heroImage ?? destination.image}
          alt={destination.heroImageAlt ?? destination.imageAlt}
          width="2200"
          height="1400"
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

      <section className="destination-guide-shell">
        <div className="destination-guide-main">
          <DestinationGallery destination={destination} gallery={gallery} />
          {destination.guide ? (
            <DestinationGuide destination={destination} />
          ) : (
            <FallbackDestinationSummary destination={destination} />
          )}
          <PassportContext
            ukStatus={statusLabel(ukVisa.status)}
            ukSource={ukVisa.officialSourceUrl}
            ukVerifiedAt={ukVisa.lastVerifiedAt}
            indiaStatus={statusLabel(indiaVisa.status)}
            indiaSource={indiaVisa.officialSourceUrl}
            indiaVerifiedAt={indiaVisa.lastVerifiedAt}
          />
        </div>

        <aside className="booking-sidebar">
          <BookingCard destination={destination} snapshot={tripSnapshot} />
        </aside>
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

function DestinationGallery({
  destination,
  gallery,
}: {
  destination: Destination;
  gallery: NonNullable<Destination["gallery"]>;
}) {
  return (
    <section className="guide-section">
      <div className="section-heading">
        <p className="eyebrow">Photos</p>
        <h2>{destination.city} in a few frames</h2>
      </div>
      <div className="destination-gallery">
        {gallery.slice(0, 6).map((photo, index) => (
          <figure key={`${photo.src}-${index}`}>
            <img
              src={photo.src}
              alt={photo.alt}
              width="900"
              height="620"
              loading={index === 0 ? "eager" : "lazy"}
            />
            {photo.caption ? <figcaption>{photo.caption}</figcaption> : null}
          </figure>
        ))}
      </div>
    </section>
  );
}

function DestinationGuide({ destination }: { destination: Destination }) {
  const guide = destination.guide;
  if (!guide) return null;

  return (
    <>
      <section className="guide-section prose-guide">
        <p className="eyebrow">About</p>
        <h2>What it feels like</h2>
        {guide.overview.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </section>

      <section className="guide-section">
        <p className="eyebrow">Must-see places</p>
        <h2>Start here</h2>
        <div className="guide-card-grid">
          {guide.highlights.map((item) => (
            <article key={item.name}>
              <h3>{item.name}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="guide-section">
        <p className="eyebrow">What to eat</p>
        <h2>Food worth planning around</h2>
        <div className="guide-card-grid food-grid">
          {guide.foods.map((item) => (
            <article key={item.name}>
              <h3>{item.name}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="guide-section two-column-guide">
        <div>
          <p className="eyebrow">Local culture</p>
          <h2>How to read the place</h2>
          <ul>
            {guide.culture.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        {guide.practicalTips?.length ? (
          <div>
            <p className="eyebrow">Good to know</p>
            <h2>Practical notes</h2>
            <ul>
              {guide.practicalTips.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </section>
    </>
  );
}

function FallbackDestinationSummary({ destination }: { destination: Destination }) {
  return (
    <section className="guide-section prose-guide">
      <p className="eyebrow">Planning snapshot</p>
      <h2>About {destination.city}</h2>
      <p>{destination.shortDescription}</p>
      <p>
        This destination is in the MVP dataset, but its full guide and gallery
        are not expanded yet. You can still use its planning ranges, passport
        context, and booking links.
      </p>
    </section>
  );
}

function PassportContext({
  ukStatus,
  ukSource,
  ukVerifiedAt,
  indiaStatus,
  indiaSource,
  indiaVerifiedAt,
}: {
  ukStatus: string;
  ukSource: string;
  ukVerifiedAt: string;
  indiaStatus: string;
  indiaSource: string;
  indiaVerifiedAt: string;
}) {
  return (
    <section className="guide-section">
      <div className="section-heading">
        <p className="eyebrow">Entry snapshot</p>
        <h2>Passport context</h2>
      </div>
      <div className="passport-context-grid">
        <article>
          <h3>UK passport</h3>
          <p translate="no">{ukStatus}</p>
          <a href={ukSource}>Official source</a>
          <small>Last verified: {ukVerifiedAt}</small>
        </article>
        <article>
          <h3>Indian passport</h3>
          <p translate="no">{indiaStatus}</p>
          <a href={indiaSource}>Official source</a>
          <small>Last verified: {indiaVerifiedAt}</small>
        </article>
      </div>
    </section>
  );
}

function BookingCard({
  destination,
  snapshot,
}: {
  destination: Destination;
  snapshot: ReturnType<typeof getTripSnapshot>;
}) {
  const flightOrigin = snapshot?.origin ?? origins[0];

  return (
    <div className="booking-card">
      <p className="eyebrow">Plan this trip</p>
      <h2>{destination.city}</h2>
      {snapshot ? (
        <div className="trip-snapshot">
          <span>
            From <strong>{snapshot.origin.name}</strong>
          </span>
          <span>
            {snapshot.days} days · {formatMoney(snapshot.budget)} budget
          </span>
          <strong className={snapshot.recommendation.budgetStatus.toLowerCase().replaceAll(" ", "-")}>
            {snapshot.recommendation.budgetStatus}
          </strong>
          <div>
            <dt>Estimated total</dt>
            <dd>
              {formatRange(
                snapshot.recommendation.total.low,
                snapshot.recommendation.total.high,
              )}
            </dd>
          </div>
        </div>
      ) : null}
      <dl className="booking-metrics">
        <div>
          <dt>Recommended stay</dt>
          <dd>
            {destination.recommendedTripDays[0]}-{destination.recommendedTripDays[1]} days
          </dd>
        </div>
        <div>
          <dt>Typical stay cost</dt>
          <dd>{formatRange(destination.stayCostLow, destination.stayCostHigh)} / night</dd>
        </div>
        <div>
          <dt>Local daily spend</dt>
          <dd>
            {formatRange(
              destination.localDailyCostLow,
              destination.localDailyCostHigh,
            )}
          </dd>
        </div>
      </dl>
      <div className="booking-cta-stack">
        <a href={flightAffiliateUrl(destination, flightOrigin)} rel="nofollow sponsored">
          Check Current Flights
        </a>
        <a href={hotelAffiliateUrl(destination)} rel="nofollow sponsored">
          Find Hotels
        </a>
      </div>
      <p className="fine-print">
        Flight estimates are based on cached fare references where available.
        Verify current prices and entry rules before booking.
      </p>
    </div>
  );
}

function getTripSnapshot(
  destination: Destination,
  searchParams: DestinationPageProps["searchParams"],
) {
  if (!searchParams) return null;
  const origin = origins.find((item) => item.iata === searchParams.from);
  const budget = Number(searchParams.budget);
  const days = Number(searchParams.days);
  const passport = passports.find(
    (item) =>
      item.id === searchParams.passport ||
      item.name === searchParams.passport ||
      item.countryCode === searchParams.passport,
  );

  if (!origin || !passport || !Number.isFinite(budget) || !Number.isFinite(days)) {
    return null;
  }

  return {
    origin,
    passport,
    budget,
    days,
    recommendation: estimateTrip(destination, {
      passport: passport.id,
      origin,
      budget,
      days,
      preference: "Surprise me",
    }),
  };
}
