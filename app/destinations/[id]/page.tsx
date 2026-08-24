import type { Metadata } from "next";
import { Breadcrumbs } from "../../components/Breadcrumbs";
import { AffiliateClickLink } from "../../components/AffiliateClickLink";
import { DestinationSectionNav } from "../../components/destinations/DestinationSectionNav";
import { TokyoHighlightCard } from "../../components/destinations/TokyoHighlightCard";
import { destinations, origins, passports, type Destination } from "../../lib/data";
import {
  getFlightAffiliateUrl,
  getHotelAffiliateUrl,
} from "../../lib/affiliate";
import {
  destinationDecisions,
  type DestinationDecision,
} from "../../lib/destinationDecisions";
import {
  destinationDecisionGuides,
  type DestinationDecisionGuide,
} from "../../lib/destinationDecisionGuides";
import {
  estimateTrip,
  findVisaRule,
  formatMoney,
  formatRange,
  statusLabel,
} from "../../lib/recommendations";

type DestinationPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    passport?: string;
    from?: string;
    budget?: string;
    days?: string;
  }>;
};

type DestinationQuery = Awaited<DestinationPageProps["searchParams"]>;

export function generateStaticParams() {
  return destinations.map((destination) => ({ id: destination.id }));
}

export async function generateMetadata({
  params,
}: DestinationPageProps): Promise<Metadata> {
  const { id } = await params;
  const destination = destinations.find((item) => item.id === id);
  if (!destination) return { title: "Destination" };

  return {
    title: `${destination.city} Travel Guide, Budget and Entry Snapshot`,
    description: `Explore ${destination.city}, ${destination.country} with photos, quick guide notes, budget ranges, and passport entry context.`,
    alternates: { canonical: `/destinations/${destination.id}` },
  };
}

export default async function DestinationPage({
  params,
  searchParams,
}: DestinationPageProps) {
  const { id } = await params;
  const query = await searchParams;
  const destination = destinations.find((item) => item.id === id);

  if (!destination) {
    return (
      <main>
        <section className="page-hero compact">
          <h1>Destination not found</h1>
          <p>This destination is not currently supported.</p>
        </section>
      </main>
    );
  }

  const ukVisa = findVisaRule("united-kingdom", destination.countryCode);
  const indiaVisa = findVisaRule("india", destination.countryCode);
  const tripSnapshot = getTripSnapshot(destination, query);
  const queryPassportVisa = tripSnapshot
    ? findVisaRule(tripSnapshot.passport.id, destination.countryCode)
    : null;
  const guide = buildGuideModel(destination);

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
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Destinations", href: "/destinations" },
              { label: destination.city },
            ]}
          />
          <p className="eyebrow">{destination.region}</p>
          <h1>
            {destination.city}, {destination.country}
          </h1>
          <p>
            {destination.id === "tokyo"
              ? "Japan's strongest first-time city for travelers who want food, neighborhoods, and effortless transport."
              : destination.shortDescription}
          </p>
          <div className="tag-row wide">
            {destination.tags.map((tag) => {
              const icon = destination.id === "tokyo"
                ? (({ City: "🏙", Food: "🍣", Culture: "✦", Family: "◉" } as Record<string, string>)[tag] ?? "•")
                : "";
              return <span key={tag}>{icon ? `${icon} ${tag}` : tag}</span>;
            })}
          </div>
        </div>
      </section>

      <section className="destination-guide-shell">
        <div className="destination-guide-main">
          {destination.id === "tokyo" ? (
            <>
              <DestinationSectionNav
                city={destination.city}
                items={[
                  { id: "tokyo-snapshot", label: "01 Snapshot" },
                  { id: "tokyo-best-time", label: "02 When to go" },
                  { id: "tokyo-stay", label: "03 Where to stay" },
                  { id: "tokyo-highlights", label: "04 What to see" },
                  { id: "tokyo-itinerary", label: "05 Itinerary" },
                  { id: "tokyo-budget", label: "06 Budget" },
                  { id: "tokyo-faq", label: "FAQ" },
                ]}
              />
              <TokyoDecisionPlanner
                destination={destination}
                guide={guide}
                snapshot={tripSnapshot}
                visaStatus={queryPassportVisa ? statusLabel(queryPassportVisa.status) : null}
              />
            </>
          ) : (
            <>
              <TripFitSnapshotSection
                destination={destination}
                snapshot={tripSnapshot}
                visaStatus={queryPassportVisa ? statusLabel(queryPassportVisa.status) : null}
              />
              <QuickFacts destination={destination} guide={guide} />
              <DestinationSnapshot destination={destination} guide={guide} />
              <DecisionLayerSection destination={destination} guide={guide} />
            </>
          )}
          <div className="mobile-booking-card">
            <BookingCard destination={destination} snapshot={tripSnapshot} />
          </div>
          <DestinationGuide destination={destination} guide={guide} days={tripSnapshot?.days} />
          <PassportContext
            passportName={tripSnapshot?.passport.name}
            passportStatus={queryPassportVisa ? statusLabel(queryPassportVisa.status) : null}
            passportSource={queryPassportVisa?.officialSourceUrl}
            passportVerifiedAt={queryPassportVisa?.lastVerifiedAt}
            ukStatus={statusLabel(ukVisa.status)}
            ukSource={ukVisa.officialSourceUrl}
            ukVerifiedAt={ukVisa.lastVerifiedAt}
            indiaStatus={statusLabel(indiaVisa.status)}
            indiaSource={indiaVisa.officialSourceUrl}
            indiaVerifiedAt={indiaVisa.lastVerifiedAt}
          />
          <GuideSources destination={destination} />
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

type GuideItem = {
  name: string;
  description: string;
  bestFor?: string;
};

type GuideSection = {
  title: string;
  items: GuideItem[];
};

type ItineraryDay = {
  day: string;
  title: string;
  items: string[];
};

type GuideModel = {
  decision: DestinationDecision;
  decisionLayer: DestinationDecisionGuide["decisionLayer"];
  comparison?: DestinationDecisionGuide["comparison"];
  seasonPlan?: DestinationDecisionGuide["seasonPlan"];
  highlightAnchors?: DestinationDecisionGuide["highlightAnchors"];
  decisionBudget: GuideItem[];
  quickFacts: {
    bestTime: string;
    currency: string;
    airports: string;
    bestFor: string;
  };
  overview: string[];
  thingSections: GuideSection[];
  foods: GuideItem[];
  neighborhoods: GuideItem[];
  gettingAround: GuideItem[];
  bestTime: GuideItem[];
  budget: GuideItem[];
  itineraries: Record<"3" | "5", ItineraryDay[]>;
  practicalInfo: GuideItem[];
  faqs: GuideItem[];
  photos: NonNullable<Destination["gallery"]>;
};

function DecisionLayerSection({
  destination,
  guide,
}: {
  destination: Destination;
  guide: GuideModel;
}) {
  return (
    <section className="guide-section decision-layer">
      <div className="section-heading">
        <p className="eyebrow">Decision layer</p>
        <h2>Why choose {destination.city}?</h2>
      </div>
      <div className="decision-layer-grid">
        <article>
          <h3>Choose it if</h3>
          <ul>
            {guide.decisionLayer.chooseIf.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </article>
        <article>
          <h3>Consider another destination if</h3>
          <ul>
            {guide.decisionLayer.avoidIf.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </article>
      </div>

      <h3>Traveler fit</h3>
      <div className="guide-card-grid">
        {guide.decisionLayer.travelerFit.map((item) => (
          <article key={item.traveler}>
            <span>{item.fit === "good" ? "Good fit" : "Poor fit"}</span>
            <h3>{item.traveler}</h3>
            <p>{item.reason}</p>
          </article>
        ))}
      </div>

      <h3>Budget reality</h3>
      <div className="guide-card-grid food-grid">
        {guide.decisionBudget.map((item) => <GuideCard key={item.name} item={item} />)}
      </div>

      <h3>How long should you stay?</h3>
      <div className="decision-layer-grid duration-decision">
        <article><h4>3 days</h4><p>{guide.decisionLayer.durationDecision.threeDays}</p></article>
        <article><h4>5 days</h4><p>{guide.decisionLayer.durationDecision.fiveDays}</p></article>
        <article><h4>7+ days</h4><p>{guide.decisionLayer.durationDecision.sevenPlusDays}</p></article>
      </div>
    </section>
  );
}

function DestinationSnapshot({
  destination,
  guide,
}: {
  destination: Destination;
  guide: GuideModel;
}) {
  const [minDays, maxDays] = destination.recommendedTripDays;

  return (
    <section className="guide-section destination-decision-snapshot">
      <div className="section-heading">
        <p className="eyebrow">Destination snapshot</p>
        <h2>Is {destination.city} right for your trip?</h2>
      </div>
      <div className="decision-snapshot-grid">
        <article>
          <h3>Best for</h3>
          <ul>
            {guide.decision.bestFor.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </article>
        <article>
          <h3>Not ideal for</h3>
          <ul>
            {guide.decision.notIdealFor.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </article>
        <article>
          <h3>Recommended duration</h3>
          <p>{minDays}-{maxDays} days for a balanced first visit.</p>
        </article>
        <article>
          <h3>Budget level</h3>
          <p>{guide.decision.budgetLevel}</p>
        </article>
      </div>
    </section>
  );
}

function TripFitSnapshotSection({
  destination,
  snapshot,
  visaStatus,
}: {
  destination: Destination;
  snapshot: ReturnType<typeof getTripSnapshot>;
  visaStatus: string | null;
}) {
  if (!snapshot) {
    return (
      <section className="guide-section tripfit-snapshot-section">
        <div className="section-heading">
          <p className="eyebrow">Your TripFit</p>
          <h2>Check whether {destination.city} fits your trip</h2>
        </div>
        <p className="tripfit-empty-copy">
          Choose your passport, departure city or airport, total budget, and trip
          duration to see whether this destination is a realistic fit.
        </p>
        <a className="primary-link" href="/#generator">
          Check My TripFit
        </a>
      </section>
    );
  }

  const fitClass = snapshot.recommendation.budgetStatus.toLowerCase().replaceAll(" ", "-");

  return (
    <section className="guide-section tripfit-snapshot-section">
      <div className="section-heading">
        <p className="eyebrow">Your TripFit</p>
        <h2>{destination.city} for this trip</h2>
      </div>
      <div className="tripfit-snapshot-grid">
        <div className="tripfit-snapshot-card summary">
          <dl className="tripfit-summary-list">
            <div>
              <dt>Passport</dt>
              <dd>{snapshot.passport.name}</dd>
            </div>
            <div>
              <dt>From</dt>
              <dd>
                {snapshot.origin.name} (<span translate="no">{snapshot.origin.iata}</span>)
              </dd>
            </div>
            <div>
              <dt>Trip duration</dt>
              <dd>{snapshot.days} days</dd>
            </div>
            <div>
              <dt>Total budget</dt>
              <dd>{formatMoney(snapshot.budget)}</dd>
            </div>
          </dl>
          <div className={`fit-badge ${fitClass}`}>{snapshot.recommendation.budgetStatus}</div>
        </div>
        <div className="tripfit-snapshot-card metrics">
          <dl className="tripfit-metrics-grid">
            <div>
              <dt>Entry</dt>
              <dd>{visaStatus ?? "Check required"}</dd>
            </div>
            <div>
              <dt>Flight</dt>
              <dd>
                {snapshot.recommendation.flight
                  ? formatRange(
                      snapshot.recommendation.flight.low,
                      snapshot.recommendation.flight.high,
                    )
                  : "Unavailable"}
              </dd>
            </div>
            <div>
              <dt>Stay</dt>
              <dd>
                {formatRange(
                  snapshot.recommendation.stay.low,
                  snapshot.recommendation.stay.high,
                )}
              </dd>
            </div>
            <div>
              <dt>Local spend</dt>
              <dd>
                {formatRange(
                  snapshot.recommendation.local.low,
                  snapshot.recommendation.local.high,
                )}
              </dd>
            </div>
            <div className="tripfit-total">
              <dt>Estimated trip</dt>
              <dd>
                {formatRange(
                  snapshot.recommendation.total.low,
                  snapshot.recommendation.total.high,
                )}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}

function QuickFacts({
  destination,
  guide,
}: {
  destination: Destination;
  guide: GuideModel;
}) {
  const [minDays, maxDays] = destination.recommendedTripDays;

  return (
    <section className="guide-section quick-facts-section">
      <div>
        <p className="eyebrow">Plan your visit</p>
        <h2>Quick travel snapshot</h2>
      </div>
      <dl className="quick-facts-grid">
        <div>
          <dt>Ideal stay</dt>
          <dd>
            {minDays}-{maxDays} days
          </dd>
        </div>
        <div>
          <dt>Best time</dt>
          <dd>{guide.quickFacts.bestTime}</dd>
        </div>
        <div>
          <dt>Typical local spend</dt>
          <dd>
            {formatRange(
              destination.localDailyCostLow,
              destination.localDailyCostHigh,
            )}{" "}
            / day
          </dd>
        </div>
        <div>
          <dt>Airports</dt>
          <dd translate="no">{guide.quickFacts.airports}</dd>
        </div>
        <div>
          <dt>Currency</dt>
          <dd translate="no">{guide.quickFacts.currency}</dd>
        </div>
        <div>
          <dt>Best for</dt>
          <dd>{guide.quickFacts.bestFor}</dd>
        </div>
      </dl>
    </section>
  );
}

function TokyoTripFitSummary({
  destination,
  snapshot,
  visaStatus,
}: {
  destination: Destination;
  snapshot: ReturnType<typeof getTripSnapshot>;
  visaStatus: string | null;
}) {
  if (!snapshot) {
    return (
      <div className="tokyo-tripfit-strip empty">
        <strong>Your TripFit</strong>
        <span>Choose your passport, departure, budget, and duration to check whether Tokyo is realistic for you.</span>
        <a href="/#generator">Check My TripFit →</a>
      </div>
    );
  }

  const fitClass = snapshot.recommendation.budgetStatus.toLowerCase().replaceAll(" ", "-");

  return (
    <div className="tokyo-tripfit-strip">
      <div className="tokyo-tripfit-context">
        <span className="tokyo-strip-label">Your TripFit</span>
        <strong>{snapshot.passport.name} · {snapshot.origin.name}</strong>
        <span>{snapshot.days} days · {formatMoney(snapshot.budget)} budget</span>
      </div>
      <div className="tokyo-tripfit-metrics">
        <div><span>Entry</span><strong>{visaStatus ?? "Check required"}</strong></div>
        <div><span>Estimated trip</span><strong>{formatRange(snapshot.recommendation.total.low, snapshot.recommendation.total.high)}</strong></div>
        <div><span>Flight</span><strong>{snapshot.recommendation.flight ? formatRange(snapshot.recommendation.flight.low, snapshot.recommendation.flight.high) : "Unavailable"}</strong></div>
      </div>
      <span className={`fit-badge ${fitClass}`}>{snapshot.recommendation.budgetStatus}</span>
    </div>
  );
}

function TokyoDecisionPlanner({
  destination,
  guide,
  snapshot,
  visaStatus,
}: {
  destination: Destination;
  guide: GuideModel;
  snapshot: ReturnType<typeof getTripSnapshot>;
  visaStatus: string | null;
}) {
  const [minDays, maxDays] = destination.recommendedTripDays;
  const comparison = guide.comparison ?? {
    chooseWhen: guide.decisionLayer.chooseIf,
    considerOtherWhen: guide.decisionLayer.avoidIf,
  };
  const seasonPlan = guide.seasonPlan ?? [];

  return (
    <>
      <section id="tokyo-snapshot" className="tokyo-guide-section tokyo-decision-summary">
        <div className="section-heading">
          <p className="eyebrow">Trip decision summary</p>
          <h2>Is Tokyo right for your trip?</h2>
          <p>Tokyo works when variety, food, and reliable city movement matter more than a compact resort-style itinerary.</p>
        </div>
        <div className="tokyo-choice-summary">
          <div>
            <h3>Why Tokyo works</h3>
            <ul>{guide.decisionLayer.chooseIf.map((item) => <li key={item}>✓ {item}</li>)}</ul>
          </div>
          <div>
            <h3>Quick decision</h3>
            <div className="tokyo-decision-points">
              <div><strong>✓ Best for</strong><span>{guide.decision.bestFor.slice(0, 3).join(" · ")}</span></div>
              <div><strong>× Avoid if</strong><span>{guide.decision.notIdealFor.slice(0, 2).join(" · ")}</span></div>
              <div><strong>⌂ Ideal stay</strong><span>{minDays}-{maxDays} days</span></div>
              <div><strong>¥ Budget</strong><span>{guide.decision.budgetLevel}</span></div>
            </div>
          </div>
        </div>
        <TokyoTripFitSummary destination={destination} snapshot={snapshot} visaStatus={visaStatus} />
      </section>

      <section className="tokyo-guide-section tokyo-comparison-section">
        <div className="section-heading">
          <p className="eyebrow">Why choose Tokyo?</p>
          <h2>Pick Tokyo for the kind of trip it is best at</h2>
          <p>Tokyo wins when the variety of the city matters more than having one compact resort base.</p>
        </div>
        <div className="tokyo-comparison-grid">
          <div>
            <h3>Choose Tokyo when</h3>
            <ul>{comparison.chooseWhen.map((item) => <li key={item}>{item}</li>)}</ul>
          </div>
          <div>
            <h3>Consider another destination when</h3>
            <ul>{comparison.considerOtherWhen.map((item) => <li key={item}>{item}</li>)}</ul>
          </div>
        </div>
      </section>

      <section className="tokyo-guide-section">
        <div className="section-heading">
          <p className="eyebrow">Traveler fit</p>
          <h2>Who tends to enjoy Tokyo most?</h2>
          <p>The strongest fit is a traveler who enjoys food, neighborhoods, and a little planning discipline.</p>
        </div>
        <div className="tokyo-fit-table-wrap">
          <table className="tokyo-fit-table">
            <thead><tr><th>Traveler</th><th>Fit</th><th>Why</th></tr></thead>
            <tbody>
              {guide.decisionLayer.travelerFit.map((item) => (
                <tr key={item.traveler}>
                  <th scope="row">{item.traveler}</th>
                  <td><span className={`tokyo-fit-label ${item.fit}`}>{item.fit === "good" ? "Good fit" : "Poor fit"}</span></td>
                  <td>{item.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section id="tokyo-best-time" className="tokyo-guide-section tokyo-plan-section">
        <div className="section-heading">
          <p className="eyebrow">Plan your Tokyo trip</p>
          <h2>Choose the season and duration that match your priorities</h2>
          <p>Five days is the balanced default; shorten the route for a first look or extend it for slower neighborhoods and day trips.</p>
        </div>
        <div className="tokyo-season-grid">
          {seasonPlan.map((item) => (
            <article key={item.season}>
              <h3>{item.season}</h3>
              <strong>Best for</strong>
              <p>{item.bestFor}</p>
              <strong>Tradeoff</strong>
              <p>{item.tradeoff}</p>
            </article>
          ))}
        </div>
        <div className="tokyo-duration-grid">
          <article><strong>3 days</strong><p>{guide.decisionLayer.durationDecision.threeDays}</p></article>
          <article className="recommended"><strong>5 days</strong><p>{guide.decisionLayer.durationDecision.fiveDays}</p></article>
          <article><strong>7+ days</strong><p>{guide.decisionLayer.durationDecision.sevenPlusDays}</p></article>
        </div>
      </section>

      <section id="tokyo-stay" className="tokyo-guide-section tokyo-stay-section">
        <div className="section-heading">
          <p className="eyebrow">Where to stay</p>
          <h2>Choose a base that matches your pace</h2>
          <p>Most first-time visitors should choose between Shinjuku and Shibuya for convenience, then trade toward Asakusa or Ueno for atmosphere and value.</p>
        </div>
        <div className="tokyo-table-wrap">
          <table className="tokyo-choice-table">
            <thead><tr><th>Area</th><th>Best for</th><th>Tradeoff</th></tr></thead>
            <tbody>
              {guide.neighborhoods.map((item) => (
                <tr key={item.name}>
                  <th scope="row">{item.name}</th>
                  <td>{item.bestFor ?? "A flexible first visit"}</td>
                  <td>{item.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

function TokyoGuideLayout({
  destination,
  guide,
  days,
}: {
  destination: Destination;
  guide: GuideModel;
  days?: number;
}) {
  const itineraryKey: "3" | "5" = days && days >= 5 ? "5" : "3";
  const highlights = guide.highlightAnchors ?? [];

  return (
    <>
      <section className="tokyo-guide-section tokyo-why-section">
        <div className="section-heading">
          <p className="eyebrow">Tokyo, in practice</p>
          <h2>Why visit Tokyo?</h2>
        </div>
        <div className="tokyo-prose">
          {guide.overview.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </div>
      </section>

      <GuidePhoto photo={guide.photos[0]} size="wide" />

      <section id="tokyo-highlights" className="tokyo-guide-section tokyo-highlights-section">
        <div className="section-heading">
          <p className="eyebrow">Tokyo highlights</p>
          <h2>Start with the experiences that explain the city</h2>
          <p>These are visual anchors, not a checklist: use them to decide which version of Tokyo you want to build around.</p>
        </div>
        <div className="tokyo-highlight-grid">
          {highlights.map((item) => {
            const photo = guide.photos[item.photoIndex];
            if (!photo) return null;
            return <TokyoHighlightCard key={item.name} highlight={item} photo={photo} />;
          })}
        </div>
      </section>

      <section className="tokyo-guide-section tokyo-experiences-section">
        <div className="section-heading">
          <p className="eyebrow">Things to do</p>
          <h2>Build days around a few connected areas</h2>
          <p>Group nearby experiences so the city's rail network supports the trip instead of becoming the trip.</p>
        </div>
        {guide.thingSections.map((section) => (
          <div className="tokyo-experience-group" key={section.title}>
            <h3>{section.title}</h3>
            <div className="tokyo-experience-list">
              {section.items.map((item) => (
                <article key={item.name}>
                  <h4>{item.name}</h4>
                  <p>{item.description}</p>
                </article>
              ))}
            </div>
          </div>
        ))}
      </section>

      <GuidePhotoPair photos={guide.photos.slice(1, 3)} />

      <section className="tokyo-guide-section tokyo-food-section">
        <div className="section-heading">
          <p className="eyebrow">What to eat</p>
          <h2>Use food to shape the day, not just fill it</h2>
          <p>Tokyo's best food experiences range from quick specialist meals to slower evenings in the neighborhood you are already exploring.</p>
        </div>
        <div className="tokyo-text-list">
          {guide.foods.map((item) => (
            <article key={item.name}><h3>{item.name}</h3><p>{item.description}</p></article>
          ))}
        </div>
      </section>

      <GuidePhoto photo={guide.photos[3]} size="wide" />

      <TokyoBudgetSection destination={destination} />

      <section className="tokyo-guide-section tokyo-movement-section">
        <div>
          <p className="eyebrow">Getting around</p>
          <h2>Make Tokyo easier by planning geographically</h2>
          <p>Rail and walking are the default; the important choice is grouping neighborhoods before you book the day.</p>
          <GuideBulletList items={guide.gettingAround} />
        </div>
        <div>
          <p className="eyebrow">Practical information</p>
          <h2>Small details that reduce friction</h2>
          <p>A few simple habits make a dense first Tokyo trip feel much more forgiving.</p>
          <GuideBulletList items={guide.practicalInfo} />
        </div>
      </section>

      <GuidePhoto photo={guide.photos[5]} size="wide" />

      <section id="tokyo-itinerary" className="tokyo-guide-section tokyo-itinerary-section">
        <div className="section-heading">
          <p className="eyebrow">Suggested itinerary</p>
          <h2>Tokyo in {itineraryKey} days</h2>
          <p>
            Keep each day on one side of the city so the plan feels like a trip,
            not a sequence of station transfers.
          </p>
        </div>
        <div className="itinerary-list">
          {guide.itineraries[itineraryKey].map((day) => (
            <article key={day.day}>
              <span>{day.day}</span>
              <div className="tokyo-itinerary-focus">
                <strong>Day focus</strong>
                <h3>{day.title}</h3>
              </div>
              <p className="tokyo-itinerary-label">Key experiences</p>
              <ul>{day.items.map((item) => <li key={item}>{item}</li>)}</ul>
            </article>
          ))}
        </div>
      </section>

      <GuidePhoto photo={guide.photos[6]} size="wide" />

      <section id="tokyo-faq" className="tokyo-guide-section tokyo-faq-section">
        <div className="section-heading">
          <p className="eyebrow">FAQ</p>
          <h2>Questions that affect the decision</h2>
          <p>Use these answers to resolve the last practical doubts before checking flights and hotels.</p>
        </div>
        <div className="tokyo-text-list">
          {guide.faqs.map((item) => (
            <article key={item.name}><h3>{item.name}</h3><p>{item.description}</p></article>
          ))}
        </div>
      </section>
    </>
  );
}

function TokyoBudgetSection({ destination }: { destination: Destination }) {
  const stay = formatRange(destination.stayCostLow, destination.stayCostHigh);
  const local = formatRange(destination.localDailyCostLow, destination.localDailyCostHigh);
  const totalBeforeFlights = (days: number) => formatRange(
    (destination.stayCostLow + destination.localDailyCostLow) * days,
    (destination.stayCostHigh + destination.localDailyCostHigh) * days,
  );

  return (
    <section id="tokyo-budget" className="tokyo-guide-section tokyo-budget-section">
      <div className="section-heading">
        <p className="eyebrow">Budget reality</p>
        <h2>How much does a Tokyo trip cost?</h2>
        <p>These are the current TripFit destination planning ranges before flights. Your departure city decides whether the whole trip fits.</p>
      </div>
      <div className="tokyo-budget-bands">
        <article>
          <div className="tokyo-budget-band-title"><span>💰</span><h3>Budget traveler</h3></div>
          <div className="tokyo-budget-metrics"><span>Hotel <strong>{stay}</strong> / night</span><span>Local <strong>{local}</strong> / day</span></div>
          <p>Use the lower end, choose a connected value base, and let casual meals do more of the work.</p>
        </article>
        <article className="recommended">
          <div className="tokyo-budget-band-title"><span>🏨</span><h3>Comfortable traveler</h3></div>
          <div className="tokyo-budget-metrics"><span>Hotel <strong>Central range</strong></span><span>Local <strong>Balanced range</strong></span></div>
          <p>A central hotel, planned meals, and selective paid experiences keep the city comfortable without making every day premium.</p>
        </article>
        <article>
          <div className="tokyo-budget-band-title"><span>✦</span><h3>Premium traveler</h3></div>
          <div className="tokyo-budget-metrics"><span>Hotel <strong>Upper range</strong></span><span>Transport <strong>Time-savers</strong></span></div>
          <p>Upgraded rooms and destination meals raise the total quickly, so check the flight estimate before committing.</p>
        </article>
      </div>
      <div className="tokyo-cost-table-wrap">
        <table className="tokyo-cost-table">
          <thead><tr><th>Trip duration</th><th>Before flights</th><th>What this means</th></tr></thead>
          <tbody>
            {[3, 5, 7].map((days) => (
              <tr key={days}>
                <th scope="row">{days} days</th>
                <td>{totalBeforeFlights(days)}</td>
                <td>{days === 5 ? "The most balanced first-trip planning window." : days === 3 ? "A focused highlights trip with little room for detours." : "More neighborhood depth, slower pacing, or a day trip."}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function DestinationGuide({
  destination,
  guide,
  days,
}: {
  destination: Destination;
  guide: GuideModel;
  days?: number;
}) {
  if (destination.id === "tokyo") {
    return <TokyoGuideLayout destination={destination} guide={guide} days={days} />;
  }

  const itineraryKey: "3" | "5" = days && days >= 5 ? "5" : "3";

  return (
    <>
      <section className="guide-section prose-guide">
        <p className="eyebrow">Overview</p>
        <h2>Why visit {destination.city}?</h2>
        {guide.overview.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </section>

      <GuidePhoto photo={guide.photos[0]} size="wide" />

      <section className="guide-section">
        <p className="eyebrow">Things to do</p>
        <h2>Top experiences to build around</h2>
        {guide.thingSections.map((section) => (
          <div className="guide-subsection" key={section.title}>
            <h3>{section.title}</h3>
            <div className="guide-card-grid">
              {section.items.map((item, itemIndex) => (
                <GuideCard
                  key={`${section.title}-${item.name}-${itemIndex}`}
                  item={item}
                />
              ))}
            </div>
          </div>
        ))}
      </section>

      <GuidePhotoPair photos={guide.photos.slice(1, 3)} />

      <section className="guide-section">
        <p className="eyebrow">What to eat</p>
        <h2>Food worth planning around</h2>
        <div className="guide-card-grid food-grid">
          {guide.foods.map((item, itemIndex) => (
            <GuideCard key={`${item.name}-${itemIndex}`} item={item} />
          ))}
        </div>
      </section>

      <GuidePhoto photo={guide.photos[3]} size="wide" />

      <section className="guide-section">
        <p className="eyebrow">Where to stay</p>
        <h2>Neighborhoods and bases</h2>
        <div className="guide-card-grid">
          {guide.neighborhoods.map((item, itemIndex) => (
            <GuideCard key={`${item.name}-${itemIndex}`} item={item} />
          ))}
        </div>
      </section>

      <section className="guide-section two-column-guide">
        <div>
          <p className="eyebrow">Getting around</p>
          <h2>Moving through {destination.city}</h2>
          <GuideBulletList items={guide.gettingAround} />
        </div>
        <div>
          <p className="eyebrow">Best time to visit</p>
          <h2>Weather and timing</h2>
          <GuideBulletList items={guide.bestTime} />
        </div>
      </section>

      <section className="guide-section">
        <p className="eyebrow">Cost and budget</p>
        <h2>How much does a trip to {destination.city} cost?</h2>
        <div className="guide-card-grid food-grid">
          {guide.budget.map((item, itemIndex) => (
            <GuideCard key={`${item.name}-${itemIndex}`} item={item} />
          ))}
        </div>
      </section>

      <section className="guide-section">
        <p className="eyebrow">Itinerary</p>
        <h2>Suggested {itineraryKey}-day trip</h2>
        <div className="itinerary-list">
          {guide.itineraries[itineraryKey].map((day, dayIndex) => (
            <article key={`${day.day}-${dayIndex}`}>
              <span>{day.day}</span>
              <h3>{day.title}</h3>
              <ul>
                {day.items.map((item, itemIndex) => (
                  <li key={`${item}-${itemIndex}`}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <GuidePhotoPair photos={guide.photos.slice(4, 6)} />
      <GuidePhoto photo={guide.photos[6]} size="wide" />

      <section className="guide-section two-column-guide">
        <div>
          <p className="eyebrow">Practical information</p>
          <h2>Good to know</h2>
          <GuideBulletList items={guide.practicalInfo} />
        </div>
        <div>
          <p className="eyebrow">FAQ</p>
          <h2>Common questions</h2>
          <GuideBulletList items={guide.faqs} />
        </div>
      </section>
    </>
  );
}

function GuideCard({ item }: { item: GuideItem }) {
  return (
    <article>
      {item.bestFor ? <span>{item.bestFor}</span> : null}
      <h3>{item.name}</h3>
      <p>{item.description}</p>
    </article>
  );
}

function GuideBulletList({ items }: { items: GuideItem[] }) {
  return (
    <ul>
      {items.map((item, itemIndex) => (
        <li key={`${item.name}-${itemIndex}`}>
          <strong>{item.name}:</strong> {item.description}
        </li>
      ))}
    </ul>
  );
}

function GuidePhoto({
  photo,
  size,
}: {
  photo?: NonNullable<Destination["gallery"]>[number];
  size: "wide";
}) {
  if (!photo) return null;

  return (
    <figure className={`guide-photo ${size}`}>
      <img src={photo.src} alt={photo.alt} width="1400" height="860" loading="lazy" />
      {photo.caption ? <figcaption>{photo.caption}</figcaption> : null}
    </figure>
  );
}

function GuidePhotoPair({
  photos,
}: {
  photos: NonNullable<Destination["gallery"]>;
}) {
  if (!photos.length) return null;

  return (
    <div className="guide-photo-pair">
      {photos.map((photo) => (
        <GuidePhoto key={photo.src} photo={photo} size="wide" />
      ))}
    </div>
  );
}

function buildGuideModel(destination: Destination): GuideModel {
  const basePhotos = buildGuidePhotos(destination);
  const cityGuide = cityGuideAdditions[destination.id];
  const editorialGuide = destinationDecisionGuides[destination.id];
  const baseGuide = destination.guide;
  const defaultModel = buildDefaultGuideModel(destination, basePhotos);

  return {
    ...defaultModel,
    decision: destinationDecisions[destination.id] ?? buildDecisionSnapshot(destination),
    decisionLayer:
      editorialGuide?.decisionLayer ?? buildDefaultDecisionLayer(destination),
    comparison: editorialGuide?.comparison,
    seasonPlan: editorialGuide?.seasonPlan,
    highlightAnchors: editorialGuide?.highlightAnchors,
    decisionBudget: editorialGuide
      ? buildEditorialBudgetItems(destination, editorialGuide)
      : cityGuide?.budget ?? buildBudgetItems(destination),
    quickFacts: {
      ...defaultModel.quickFacts,
      ...cityGuide?.quickFacts,
      ...editorialGuide?.quickFacts,
    },
    overview:
      cityGuide?.overview ??
      editorialGuide?.overview ??
      expandOverview(destination, baseGuide?.overview),
    thingSections:
      cityGuide?.thingSections ??
      editorialGuide?.thingSections ??
      buildThingSections(destination, baseGuide?.highlights),
    foods:
      cityGuide?.foods ??
      editorialGuide?.foods ??
      buildFoodItems(destination, baseGuide?.foods),
    neighborhoods:
      cityGuide?.neighborhoods ??
      editorialGuide?.neighborhoods ??
      buildNeighborhoods(destination),
    gettingAround:
      cityGuide?.gettingAround ??
      editorialGuide?.gettingAround ??
      buildGettingAround(destination),
    bestTime:
      cityGuide?.bestTime ?? editorialGuide?.bestTime ?? buildBestTime(destination),
    budget: cityGuide?.budget ?? editorialGuide?.budget ?? buildBudgetItems(destination),
    itineraries:
      cityGuide?.itineraries ??
      editorialGuide?.itineraries ??
      buildItineraries(destination),
    practicalInfo:
      cityGuide?.practicalInfo ??
      editorialGuide?.practicalInfo ??
      buildPracticalInfo(destination, baseGuide?.culture, baseGuide?.practicalTips),
    faqs: cityGuide?.faqs ?? editorialGuide?.faqs ?? buildFaqs(destination),
    photos: cityGuide?.photos ?? basePhotos,
  };
}

function buildDefaultDecisionLayer(
  destination: Destination,
): DestinationDecisionGuide["decisionLayer"] {
  const [minDays, maxDays] = destination.recommendedTripDays;
  return {
    chooseIf: [
      `You want a ${destination.tags.slice(0, 2).join(" and ").toLowerCase()} trip with a clear city or regional base.`,
      `Your departure, budget, and ${minDays}-${maxDays} day window support the destination's main experience.`,
    ],
    avoidIf: [
      "Your main travel goal is the opposite of this destination's strongest tags.",
      "The current flight estimate leaves too little room for accommodation and local spending.",
    ],
    travelerFit: [
      { traveler: "Traveler matching the main destination experience", fit: "good", reason: `The strongest fit is a traveler who wants ${destination.tags.slice(0, 2).join(" and ").toLowerCase()}.` },
      { traveler: "Traveler seeking a different trip style", fit: "poor", reason: "Compare another destination before booking if the core experience is not what you want." },
    ],
    durationDecision: {
      threeDays: `${minDays <= 3 ? "A focused three-day visit can work when you stay near the main experiences." : "Three days is only suitable for a focused first look."}`,
      fiveDays: `${minDays <= 5 ? "Five days gives room for the main sights and a slower local day." : `Five days may feel compressed; the current planning range starts at ${minDays} days.`}`,
      sevenPlusDays: `${maxDays >= 7 ? "Seven or more days suits a slower visit or a wider regional plan." : "Extend only if you want slower days or a deliberate side trip."}`,
    },
  };
}

function buildEditorialBudgetItems(
  destination: Destination,
  guide: DestinationDecisionGuide,
): GuideItem[] {
  const beforeFlights = [3, 5, 7].map((days) =>
    formatRange(
      (destination.stayCostLow + destination.localDailyCostLow) * days,
      (destination.stayCostHigh + destination.localDailyCostHigh) * days,
    ),
  );

  return [
    ...guide.budget,
    {
      name: "TripFit planning baseline",
      description: `Using the current destination data, stay is ${formatRange(destination.stayCostLow, destination.stayCostHigh)} per night and local spending is ${formatRange(destination.localDailyCostLow, destination.localDailyCostHigh)} per day. Before flights, that gives roughly ${beforeFlights[0]} for 3 days, ${beforeFlights[1]} for 5 days, and ${beforeFlights[2]} for 7 days.`,
    },
    {
      name: "Flight impact",
      description: "Flight estimates are added only when TripFit has a planning range for the selected departure. The same destination can be a good or poor fit depending on where the trip starts.",
    },
  ];
}

function buildDefaultGuideModel(
  destination: Destination,
  photos: NonNullable<Destination["gallery"]>,
): GuideModel {
  return {
    decision: destinationDecisions[destination.id] ?? buildDecisionSnapshot(destination),
    decisionLayer: buildDefaultDecisionLayer(destination),
    decisionBudget: buildBudgetItems(destination),
    quickFacts: {
      bestTime: destination.seasonTags.join(" / ") || "Check seasonal conditions",
      currency: currencyByCountry[destination.countryCode] ?? "Local currency",
      airports: destination.airportCode,
      bestFor: destination.tags.slice(0, 3).join(" · "),
    },
    overview: expandOverview(destination, destination.guide?.overview),
    thingSections: buildThingSections(destination, destination.guide?.highlights),
    foods: buildFoodItems(destination, destination.guide?.foods),
    neighborhoods: buildNeighborhoods(destination),
    gettingAround: buildGettingAround(destination),
    bestTime: buildBestTime(destination),
    budget: buildBudgetItems(destination),
    itineraries: buildItineraries(destination),
    practicalInfo: buildPracticalInfo(
      destination,
      destination.guide?.culture,
      destination.guide?.practicalTips,
    ),
    faqs: buildFaqs(destination),
    photos,
  };
}

function buildDecisionSnapshot(destination: Destination): DestinationDecision {
  const hasBeachOrNature = destination.tags.some((tag) =>
    ["Beach", "Nature", "Adventure"].includes(tag),
  );
  const totalHigh = destination.stayCostHigh + destination.localDailyCostHigh;
  const budgetLevel =
    totalHigh <= 150
      ? "Value-oriented trip"
      : totalHigh <= 240
        ? "Moderate trip"
        : "Higher-cost trip";

  return {
    bestFor: [
      `${destination.tags.slice(0, 2).join(" and ")} travelers`,
      `${destination.recommendedTripDays[0]}-${destination.recommendedTripDays[1]} day trips`,
      hasBeachOrNature
        ? "Travelers who want an outdoor element"
        : "Travelers who prefer a city base",
    ],
    notIdealFor: [
      hasBeachOrNature
        ? "Travelers who want one compact, walkable city"
        : "Travelers seeking a resort or nature-only escape",
      totalHigh > 240
        ? "Strict budget trips without a confirmed flight estimate"
        : "Trips that leave no time for local movement or slower days",
    ],
    budgetLevel,
  };
}

function buildGuidePhotos(destination: Destination): NonNullable<Destination["gallery"]> {
  const photos = [
    ...(destination.gallery ?? []),
    {
      src: destination.heroImage ?? destination.image,
      alt: destination.heroImageAlt ?? destination.imageAlt,
      caption: `${destination.city}, ${destination.country}`,
      credit: destination.imageCredit,
    },
    {
      src: destination.image,
      alt: destination.imageAlt,
      caption: `${destination.city} travel planning view`,
      credit: destination.imageCredit,
    },
  ];

  const unique = photos.filter(
    (photo, index, list) => list.findIndex((item) => item.src === photo.src) === index,
  );

  return unique.slice(0, 8);
}

function expandOverview(
  destination: Destination,
  existing: string[] | undefined,
): string[] {
  const seed = existing?.length ? existing : [destination.shortDescription];
  return [
    ...seed,
    `${destination.city} is strongest when you plan around ${destination.tags
      .slice(0, 3)
      .join(", ")
      .toLowerCase()} rather than treating it as a generic stop on a map. The best first trip should give you a clear base, a few anchor experiences, and enough open time to notice how the city works.`,
    `Compared with similar destinations in ${destination.region}, ${destination.city} is useful for travelers who want a realistic trip with visible tradeoffs: daily costs, stay costs, and flight estimates all matter before the destination can be called a good fit.`,
    `Most travelers should avoid packing every day too tightly. A ${destination.recommendedTripDays[0]}-${destination.recommendedTripDays[1]} day stay gives enough room for the core sights, a food-focused evening, and at least one slower neighborhood or nature break.`,
    `It may be less ideal if you want a completely effortless resort-style trip or if the current flight estimate from your departure city pushes the whole trip over budget. In that case, compare it with nearby alternatives before booking.`,
  ].slice(0, 6);
}

function buildThingSections(
  destination: Destination,
  highlights: NonNullable<Destination["guide"]>["highlights"] | undefined,
): GuideSection[] {
  const items = Array.isArray(highlights) && highlights.length
    ? highlights
    : [
        {
          name: `${destination.city} first walk`,
          description: `Start with the most central, visitor-friendly area so you can understand distances, transport, food options, and the local rhythm before adding longer trips.`,
        },
        {
          name: "Main cultural stop",
          description: `Choose one museum, historic district, temple, market, or landmark that explains why ${destination.city} matters instead of trying to collect every sight in one day.`,
        },
        {
          name: "Food-focused evening",
          description: `Leave one evening open for restaurants, markets, or casual local food. This is often where the destination feels most memorable without requiring a packed schedule.`,
        },
        {
          name: "Local neighborhood time",
          description: `Spend part of a day away from the headline sights. Cafes, small shops, waterfronts, parks, and residential streets help balance the trip.`,
        },
        {
          name: "Viewpoint or scenic break",
          description: `Add one viewpoint, coastal walk, park, or scenic route if it fits the destination. It gives the trip texture beyond museums and meals.`,
        },
        {
          name: "Flexible final block",
          description: `Keep your last half-day flexible for a missed neighborhood, shopping, a relaxed meal, or weather-dependent plans.`,
        },
      ];

  return [
    {
      title: destination.tags.includes("Culture")
        ? "Culture and landmarks"
        : "Essential first stops",
      items: items.slice(0, 3),
    },
    {
      title: destination.tags.includes("Nightlife")
        ? "Food and evenings"
        : "Local life and slower time",
      items: items.slice(3, 6),
    },
  ];
}

function buildFoodItems(
  destination: Destination,
  foods: NonNullable<Destination["guide"]>["foods"] | undefined,
): GuideItem[] {
  const existing = Array.isArray(foods) ? foods : [];
  const base = existing.map((food) => ({
    name: food.name,
    description:
      food.description.length > 120
        ? food.description
        : `${food.description} Use it as a low-pressure way to understand local habits, meal timing, and whether the destination fits your food style.`,
  }));

  return [
    ...base,
    {
      name: "Market or casual meal",
      description: `Plan one unfussy meal in ${destination.city}, especially if you are comparing total trip cost. Casual food is often where a destination becomes easier to afford without feeling like a compromise.`,
    },
    {
      name: "Local cafe or bakery stop",
      description: `A simple breakfast, coffee, dessert, or snack stop is useful between sights and gives the day a more local rhythm than three formal meals.`,
    },
  ].slice(0, 5);
}

function buildNeighborhoods(destination: Destination): GuideItem[] {
  const citySpecific = neighborhoodByDestination[destination.id];
  if (citySpecific) return citySpecific;

  return [
    {
      name: "Central base",
      bestFor: "Best for first-time visitors",
      description: `Choose a central, well-connected area if this is your first visit to ${destination.city}. It usually saves transport time and makes short stays easier.`,
    },
    {
      name: "Historic or cultural area",
      bestFor: "Best for atmosphere",
      description: `Older districts, cultural streets, and areas near major sights tend to be better for walking and photography, though rooms can be smaller or pricier.`,
    },
    {
      name: "Food and nightlife area",
      bestFor: "Best for evenings",
      description: `If restaurants and nights out matter, stay near the food or nightlife cluster so late returns are simple and taxi time stays reasonable.`,
    },
    {
      name: "Quieter value base",
      bestFor: "Best for budget control",
      description: `A slightly less central area can reduce stay cost while still working well if it has reliable public transport or easy rideshare access.`,
    },
  ];
}

function buildGettingAround(destination: Destination): GuideItem[] {
  return [
    {
      name: "Main airport",
      description: `${destination.city} is represented in TripFit by ${destination.airportCode}. Check your booking site for the exact airport and terminal before buying.`,
    },
    {
      name: "Airport to city",
      description: "Use the official airport transport page or your hotel guidance for the current best route. Avoid relying on old fare or timetable screenshots.",
    },
    {
      name: "Local transport",
      description: destination.tags.includes("City")
        ? "Public transport, walking, and short rides usually work better than renting a car for a first city-focused trip."
        : "Transport depends heavily on your base. Check whether key sights require transfers, drivers, ferries, or tours before finalizing accommodation.",
    },
    {
      name: "Walkability",
      description: "Plan days by area. Even compact destinations become tiring if each stop pulls you across town.",
    },
    {
      name: "Need a car?",
      description: destination.tags.includes("Nature") || destination.tags.includes("Adventure")
        ? "A car or driver may help for nature-heavy days, but it is not automatically needed for every traveler."
        : "Most first-time visitors can skip a rental car unless they are adding countryside or beach day trips.",
    },
  ];
}

function buildBestTime(destination: Destination): GuideItem[] {
  const seasons = destination.seasonTags.join(" / ") || "the locally recommended travel season";
  return [
    {
      name: "Best months",
      description: `TripFit currently summarizes this destination around ${seasons}. Treat this as planning guidance, then check current weather before booking.`,
    },
    {
      name: "Peak season",
      description: "Expect stronger demand around holidays, school breaks, major festivals, and the most comfortable weather windows.",
    },
    {
      name: "Shoulder season",
      description: "Shoulder months can be a better budget fit when flights and hotels are the biggest pressure on your total trip cost.",
    },
    {
      name: "Less ideal timing",
      description: "Avoid dates that clash with weather you dislike, major closures, or transport-heavy holiday periods.",
    },
  ];
}

function buildBudgetItems(destination: Destination): GuideItem[] {
  const totals = [3, 5, 7].map((days) => ({
    days,
    stayLow: destination.stayCostLow * days,
    stayHigh: destination.stayCostHigh * days,
    localLow: destination.localDailyCostLow * days,
    localHigh: destination.localDailyCostHigh * days,
  }));

  return [
    {
      name: "Stay",
      description: `Typical accommodation planning range is ${formatRange(destination.stayCostLow, destination.stayCostHigh)} per night before taxes, fees, seasonality, and room choice.`,
    },
    {
      name: "Local spending",
      description: `TripFit uses ${formatRange(destination.localDailyCostLow, destination.localDailyCostHigh)} per day for everyday meals, local transport, and simple activities.`,
    },
    {
      name: "Total before flights",
      description: `For 3 / 5 / 7 days, local stay plus daily spend plans at about ${formatRange(totals[0].stayLow + totals[0].localLow, totals[0].stayHigh + totals[0].localHigh)}, ${formatRange(totals[1].stayLow + totals[1].localLow, totals[1].stayHigh + totals[1].localHigh)}, and ${formatRange(totals[2].stayLow + totals[2].localLow, totals[2].stayHigh + totals[2].localHigh)}.`,
    },
    {
      name: "Flight impact",
      description: "Flight estimates are added only when TripFit has a planning range for your selected departure. That is why your origin can change the budget verdict dramatically.",
    },
  ];
}

function buildItineraries(destination: Destination): Record<"3" | "5", ItineraryDay[]> {
  return {
    "3": [
      {
        day: "Day 1",
        title: "Arrival and first neighborhood",
        items: [
          "Check in near your main transport line or preferred base.",
          "Take a low-pressure walk through the most central visitor area.",
          "Keep dinner close to your hotel so the first day stays easy.",
        ],
      },
      {
        day: "Day 2",
        title: "Core sights and food",
        items: [
          "Use the morning for the main cultural or scenic stop.",
          "Build the afternoon around one nearby neighborhood.",
          "Make the evening food-focused rather than adding another long transfer.",
        ],
      },
      {
        day: "Day 3",
        title: "Flexible final day",
        items: [
          "Return to the area you liked most or add one missed highlight.",
          "Leave space for shopping, a market, beach time, or a park.",
          "Keep airport transfer timing conservative.",
        ],
      },
    ],
    "5": [
      {
        day: "Day 1",
        title: "Arrival and orientation",
        items: [
          "Settle into your base and learn the nearest transport options.",
          "Take one short neighborhood walk.",
          "Choose an easy dinner close by.",
        ],
      },
      {
        day: "Day 2",
        title: "Main sights",
        items: [
          "Visit the most important landmark, museum, temple, beach, or old town area.",
          "Keep nearby stops grouped together.",
          "Use the evening for a classic local meal.",
        ],
      },
      {
        day: "Day 3",
        title: "Local life",
        items: [
          "Explore a food market, shopping street, or residential-feeling neighborhood.",
          "Add a cafe, bakery, or casual lunch stop.",
          "Avoid long cross-city moves.",
        ],
      },
      {
        day: "Day 4",
        title: "Scenic or cultural add-on",
        items: [
          "Use this day for a viewpoint, nature break, day trip, or deeper cultural stop.",
          "Check transport timing before committing.",
          "Keep the evening relaxed.",
        ],
      },
      {
        day: "Day 5",
        title: "Flexible buffer",
        items: [
          "Return to the favorite neighborhood or add one missed sight.",
          "Leave room for weather changes or slow mornings.",
          "Plan a conservative airport transfer.",
        ],
      },
    ],
  };
}

function buildPracticalInfo(
  destination: Destination,
  culture?: string[],
  tips?: string[],
): GuideItem[] {
  return [
    ...(culture ?? []).map((item) => ({ name: "Local habit", description: item })),
    ...(tips ?? []).map((item) => ({ name: "Trip tip", description: item })),
    {
      name: "Language",
      description: "Learn a greeting and the local words for thank you. Translation apps help, but polite basics still make travel smoother.",
    },
    {
      name: "Payments",
      description: "Carry at least one card and a small cash backup. Payment habits vary by neighborhood, market, and transport mode.",
    },
    {
      name: "Tipping",
      description: "Check local tipping norms before you go instead of assuming your home-country rules apply.",
    },
    {
      name: "Safety",
      description: "Use normal city travel habits: keep valuables controlled, watch transport exits, and ask accommodation staff about current local cautions.",
    },
  ].slice(0, 7);
}

function buildFaqs(destination: Destination): GuideItem[] {
  const [minDays, maxDays] = destination.recommendedTripDays;
  return [
    {
      name: `How many days do you need in ${destination.city}?`,
      description: `${minDays}-${maxDays} days is the current TripFit planning range for a balanced first visit.`,
    },
    {
      name: `Is ${destination.city} expensive?`,
      description: `It depends heavily on flights and accommodation. Local daily spend is currently modeled at ${formatRange(destination.localDailyCostLow, destination.localDailyCostHigh)}.`,
    },
    {
      name: "Where should first-time visitors stay?",
      description: "Choose the most convenient central or transport-connected base unless a specific beach, nightlife, or nature area is the main reason for the trip.",
    },
    {
      name: "Which airport should I check?",
      description: `TripFit maps this destination to ${destination.airportCode}. Booking sites may show nearby alternates, so confirm the actual airport before paying.`,
    },
    {
      name: "Do I need cash?",
      description: "A small cash reserve is useful even where cards are common, especially for markets, tips, transit cards, or small shops.",
    },
  ];
}

const currencyByCountry: Record<string, string> = {
  AR: "ARS",
  AU: "AUD",
  BR: "BRL",
  CA: "CAD",
  CL: "CLP",
  CO: "COP",
  CZ: "CZK",
  DK: "DKK",
  EG: "EGP",
  EU: "EUR",
  FR: "EUR",
  DE: "EUR",
  GR: "EUR",
  ID: "IDR",
  IN: "INR",
  IT: "EUR",
  JP: "JPY",
  KR: "KRW",
  MX: "MXN",
  MV: "MVR",
  NL: "EUR",
  NZ: "NZD",
  PE: "PEN",
  PT: "EUR",
  SG: "SGD",
  ES: "EUR",
  TH: "THB",
  TR: "TRY",
  AE: "AED",
  GB: "GBP",
  US: "USD",
  VN: "VND",
  ZA: "ZAR",
};

const neighborhoodByDestination: Record<string, GuideItem[]> = {
  tokyo: [
    { name: "Shinjuku", bestFor: "Best for first-timers & nightlife", description: "Shinjuku is convenient, energetic, and well connected. It works well if you want transport options, restaurants, and late-night atmosphere close to the hotel." },
    { name: "Shibuya", bestFor: "Best for shopping & younger travelers", description: "Shibuya puts fashion, music, cafes, and busy street life upfront. It is fun, but can feel intense if you want quiet evenings." },
    { name: "Asakusa", bestFor: "Best for culture & better value", description: "Asakusa gives easier access to older Tokyo, temple streets, and a slightly calmer base. It can be a smart value choice for first-time visitors." },
    { name: "Ginza / Tokyo Station", bestFor: "Best for polished logistics", description: "This area is practical for transport, department stores, dining, and a more polished city feel. It is usually less nightlife-driven than Shinjuku or Shibuya." },
  ],
  bali: [
    { name: "Ubud", bestFor: "Best for culture, cafes & rice terraces", description: "Ubud is the best inland base for temples, terraces, craft shops, yoga, and slower days. It is not a beach base, so combine it carefully if coast time matters." },
    { name: "Uluwatu", bestFor: "Best for cliffs & surf beaches", description: "Uluwatu works for dramatic views, beach clubs, surf, and sunsets. Transport between spots can take time, so location matters." },
    { name: "Seminyak", bestFor: "Best for restaurants & polished beach stays", description: "Seminyak is easier for dining, shopping, and a more developed beach scene. It can cost more than quieter areas." },
    { name: "Canggu", bestFor: "Best for cafes & social travel", description: "Canggu is popular for cafes, coworking, nightlife, and surf culture. Traffic can be a major tradeoff." },
  ],
  lisbon: [
    { name: "Baixa / Chiado", bestFor: "Best for first-time logistics", description: "Central, walkable, and well connected, this is the easiest Lisbon base for a short trip." },
    { name: "Alfama", bestFor: "Best for atmosphere", description: "Alfama has narrow streets, viewpoints, and fado atmosphere. It is beautiful, but hills and access can be less convenient with luggage." },
    { name: "Avenida da Liberdade", bestFor: "Best for comfort", description: "A broad, polished base with good transport and hotels. It feels calmer than the tight historic core." },
    { name: "Cais do Sodre", bestFor: "Best for nightlife & waterfront", description: "Useful for restaurants, bars, and river access, though some blocks can feel busy late at night." },
  ],
  bangkok: [
    { name: "Sukhumvit", bestFor: "Best for transport & restaurants", description: "Sukhumvit is easy for BTS access, malls, food, and nightlife. It is practical for repeat visitors and first-timers who want convenience." },
    { name: "Siam", bestFor: "Best for shopping & central movement", description: "Siam is central and useful for malls, transit, and rainy-day plans. It is not the most atmospheric base." },
    { name: "Riverside", bestFor: "Best for temples & views", description: "The riverside works well for classic sights and hotel views. It can be calmer, but check rail and boat access." },
    { name: "Old City", bestFor: "Best for culture", description: "This area puts temples and historic sights closer, but nightlife and rail access are less straightforward." },
  ],
  "mexico-city": [
    { name: "Roma Norte", bestFor: "Best for food & design", description: "Roma Norte is one of the easiest first bases for restaurants, cafes, parks, and a walkable daily rhythm." },
    { name: "Condesa", bestFor: "Best for leafy streets", description: "Condesa feels green, relaxed, and residential while staying close to strong food and nightlife options." },
    { name: "Polanco", bestFor: "Best for comfort & museums", description: "Polanco is polished and convenient for major museums and upscale dining, but can feel less local." },
    { name: "Centro Historico", bestFor: "Best for history", description: "Centro is great for architecture and history. Choose carefully if you want quieter evenings." },
  ],
  paris: [
    { name: "Saint-Germain / Latin Quarter", bestFor: "Best for classic first visits", description: "Left Bank neighborhoods make museums, cafes, gardens, and river walks easy to combine." },
    { name: "Le Marais", bestFor: "Best for boutiques & food", description: "Le Marais is central, walkable, and strong for shopping, galleries, and casual meals." },
    { name: "Montmartre", bestFor: "Best for atmosphere", description: "Montmartre has hilltop views and village-like streets, but it sits farther from some central sights." },
    { name: "Opera / 9th", bestFor: "Best for transit & value balance", description: "This area can be practical for transport, restaurants, and access across the city." },
  ],
  "buenos-aires": [
    { name: "Palermo", bestFor: "Best for food & nightlife", description: "Palermo is the easiest base for restaurants, cafes, parks, and late evenings. It suits first-time visitors who want a social trip." },
    { name: "Recoleta", bestFor: "Best for architecture & comfort", description: "Recoleta feels elegant and calmer, with broad avenues, museums, and classic city atmosphere." },
    { name: "San Telmo", bestFor: "Best for history & tango atmosphere", description: "San Telmo works for older streets, markets, and nightlife with character. It can feel less polished than northern areas." },
    { name: "Microcentro", bestFor: "Best for short business-style stays", description: "Central access is convenient, but evenings can be quieter than Palermo or Recoleta." },
  ],
};

const cityGuideAdditions: Partial<Record<string, Partial<GuideModel>>> = {
  tokyo: {
    quickFacts: {
      bestTime: "March-April / late October-November",
      currency: "JPY",
      airports: "HND / NRT",
      bestFor: "Food · Culture · City",
    },
    overview: [
      "Tokyo works best when you stop thinking of it as one giant downtown and start treating it as a collection of distinct neighborhoods. Shibuya, Shinjuku, Asakusa, Ueno, Ginza, and the quieter pockets around them all create different versions of the same trip, which is why first-time visitors often leave feeling they saw several cities inside one.",
      "What makes Tokyo different from other major Asian capitals is the way old and new sit on top of each other without feeling staged. You can move from a temple street and snack stalls in Asakusa to department-store food halls, train stations, design shops, and neon-heavy crossings in the same day, and it still feels like one coherent place rather than disconnected attractions.",
      "It is especially strong for travelers who care about food, neighborhood atmosphere, clean logistics, and the pleasure of simply moving through a city that functions well. Tokyo is not the easiest fit for travelers who want long lazy downtime, spontaneous road-trip freedom, or a bargain-first destination. The city rewards curiosity and planning more than pure relaxation.",
      "A first trip usually works better when you organize it by area instead of trying to chase every famous name on the map. Tokyo distances add up, stations can be bigger than expected, and a day that looks light on paper can become tiring if you keep crossing the city for every meal or attraction. The right plan feels spacious: one major area in the morning, one adjacent area later, then dinner where you already are.",
      "Many first-time visitors also misread Tokyo's rhythm. The city can look hyper-intense in photos, but a good trip is not five straight days of crowds and crossings. Parks, shrine grounds, quieter backstreets, observation views, department basements, and neighborhood dinners are what give the city shape. Once you understand that balance, Tokyo becomes much easier to imagine as a realistic three-to-five-day trip.",
    ],
    thingSections: [
      {
        title: "Traditional Tokyo",
        items: [
          {
            name: "Senso-ji and Asakusa",
            description:
              "Asakusa is one of the clearest introductions to older Tokyo. Senso-ji, the approach streets, and the surrounding lanes give you temple atmosphere, snacks, small shops, and river access in one compact day that makes sense even on a first visit.",
          },
          {
            name: "Meiji Shrine",
            description:
              "Meiji Shrine is worth building into an early itinerary because it resets your sense of scale. The wooded approach feels calm and ceremonial, and it pairs naturally with nearby Harajuku without turning the day into nonstop shopping.",
          },
          {
            name: "Ueno Park and museum time",
            description:
              "Ueno works well for travelers who want a more cultural afternoon instead of only shopping districts. It gives you museums, green space, and a slower rhythm than the busiest western neighborhoods.",
          },
        ],
      },
      {
        title: "Modern Tokyo",
        items: [
          {
            name: "Shibuya",
            description:
              "Shibuya is not just the crossing. It is useful because it concentrates city energy, fashion streets, food options, and people-watching into an area that is easy to understand on foot, making it one of the best first-day anchors.",
          },
          {
            name: "Shinjuku",
            description:
              "Shinjuku gives you Tokyo's density in its most dramatic form: huge station movement, observation views, nightlife lanes, department stores, and late dining. It suits travelers who want the city at full volume, especially after dark.",
          },
          {
            name: "teamLab or another contemporary city experience",
            description:
              "Add one distinctly contemporary experience if you want the trip to feel more than historic sites and meals. Immersive art, design spaces, or skyline views help explain why Tokyo feels future-facing without making the trip feel abstract.",
          },
        ],
      },
      {
        title: "Food and local life",
        items: [
          {
            name: "Department-store food halls and station basements",
            description:
              "These are one of Tokyo's easiest high-payoff experiences. They let you sample sweets, bento, prepared foods, and seasonal items without committing the whole evening to one restaurant booking.",
          },
          {
            name: "Ramen and izakaya streets",
            description:
              "An evening built around ramen, yakitori, or a casual izakaya district often tells you more about Tokyo than one extra attraction. Choose one neighborhood and let dinner, side streets, and bars become the experience.",
          },
          {
            name: "Harajuku side streets and cafe stops",
            description:
              "Harajuku works best when you look beyond the most crowded strip. The nearby side streets, cafes, and smaller boutiques help connect youth culture with a more local daytime pace.",
          },
        ],
      },
      {
        title: "Slower Tokyo",
        items: [
          {
            name: "Ginza mornings and polished city walks",
            description:
              "Ginza shows a more ordered, refined Tokyo. It works well for a lighter morning, department stores, cafes, and streets that feel calmer than Shibuya or Shinjuku.",
          },
          {
            name: "Riverside or neighborhood breathing room",
            description:
              "A walk by the river, a garden, or a slower residential pocket keeps the trip from becoming pure urban intensity. This matters more than many first-time visitors expect.",
          },
        ],
      },
    ],
    foods: [
      {
        name: "Sushi",
        description:
          "Tokyo makes sushi easy to experience at several levels, from quick counters to meal destinations. It is best used either as a deliberate lunch stop or as one signature dinner rather than something you feel forced to chase every day.",
      },
      {
        name: "Ramen",
        description:
          "Ramen is one of the easiest ways to build Tokyo into a real travel day. A bowl between neighborhoods keeps logistics simple, works well in bad weather, and gives you a distinctly Tokyo meal without needing a long reservation-heavy evening.",
      },
      {
        name: "Yakitori and izakaya dinners",
        description:
          "This is where many visitors start to feel Tokyo's evening rhythm. Small plates, grilled skewers, and station-side lanes suit travelers who want a social, local-feeling night rather than a formal dinner.",
      },
      {
        name: "Tonkatsu and specialty comfort meals",
        description:
          "Tokyo rewards dish-specific eating. Tonkatsu, curry, tempura, and other focused specialists are useful when you want something satisfying, easy to order, and grounded in everyday city life rather than a destination meal.",
      },
      {
        name: "Coffee, bakeries, and sweets",
        description:
          "Tokyo is stronger at daytime cafe stops and polished sweet counters than many first-time visitors expect. These breaks matter because the city is easier to enjoy when you pace it with short rests between major neighborhoods.",
      },
    ],
    neighborhoods: [
      {
        name: "Shinjuku",
        bestFor: "Best for first-timers, transport, and nightlife",
        description:
          "Shinjuku is the safest all-round base if you want strong rail connections, late dining, and easy access to several parts of the city. The tradeoff is intensity: it is busy, bright, and not the quietest place to end every day.",
      },
      {
        name: "Shibuya",
        bestFor: "Best for shopping, food, and younger city energy",
        description:
          "Stay in Shibuya if you want Tokyo to feel lively the moment you step outside. It is great for fashion, cafes, evening movement, and west-side neighborhoods, but some travelers will find it too nonstop for a calm first trip.",
      },
      {
        name: "Asakusa",
        bestFor: "Best for culture, calmer evenings, and value",
        description:
          "Asakusa suits travelers who want an older atmosphere, easier mornings, and a slightly gentler pace. It is a smart choice if temple streets and riverside walks matter more than late-night bars.",
      },
      {
        name: "Ginza / Tokyo Station",
        bestFor: "Best for polished logistics and shorter business-style stays",
        description:
          "This area is practical, orderly, and comfortable, especially if smooth airport connections and department-store convenience matter. It is less character-forward at night than Shinjuku or Shibuya, but very easy to operate from.",
      },
      {
        name: "Ueno",
        bestFor: "Best for museums, park access, and east-side exploration",
        description:
          "Ueno works well if you want a more grounded base with museums, Ameyoko energy, and easier access to Asakusa and the east side. It can feel less glossy, but often makes better sense for travelers planning a culture-heavy trip.",
      },
    ],
    gettingAround: [
      {
        name: "Which airport matters more?",
        description:
          "Haneda is generally easier for a short Tokyo trip because it sits closer to the city and reduces transfer fatigue on arrival or departure. Narita is still common and workable, but it adds more travel time, so it matters when you are only staying three to five days.",
      },
      {
        name: "Airport to city",
        description:
          "Tokyo arrivals are usually straightforward, but you should match your airport with your hotel area before booking. A hotel that looks central on the map can still be awkward if it requires multiple transfers with luggage after a long flight.",
      },
      {
        name: "How people normally move",
        description:
          "Most visitors rely on trains, metro lines, and walking. Tokyo is one of the easiest big cities to navigate once you commit to area-by-area planning, but it becomes tiring fast if you keep zigzagging across town for every meal or attraction.",
      },
      {
        name: "Group neighborhoods by side of the city",
        description:
          "Shibuya, Harajuku, and Shinjuku naturally belong together; Asakusa, Ueno, and nearby east-side stops also combine well. Planning by cluster is one of the easiest ways to make a Tokyo itinerary feel realistic rather than exhausting.",
      },
      {
        name: "Do you need a car?",
        description:
          "No. A rental car usually adds friction, parking cost, and stress inside Tokyo. For a first urban trip, rail plus walking is the better default, and taxis are useful only as selective time-savers late at night or with luggage.",
      },
    ],
    bestTime: [
      {
        name: "When Tokyo is easiest to enjoy",
        description:
          "Spring and late autumn are the easiest windows for most first-time visitors because temperatures are more comfortable for long neighborhood days and the city feels pleasant both outdoors and on foot between stations.",
      },
      {
        name: "Peak-season tradeoffs",
        description:
          "Cherry blossom season and major holiday periods can feel exciting, but they also add crowd pressure and higher accommodation costs. If your trip depends on a tight budget, the atmosphere may not justify the price jump.",
      },
      {
        name: "Summer and winter",
        description:
          "Summer can feel humid and tiring when your days involve a lot of walking and rail transfers. Winter is workable for many travelers, especially if they care more about food and city life than long park days, but cold and shorter daylight still shape the pace.",
      },
      {
        name: "Shoulder-season value",
        description:
          "If your goal is a more balanced TripFit, shoulder periods are often the sweet spot. You keep most of Tokyo's appeal while giving yourself a better chance of staying within budget on both hotels and flights.",
      },
    ],
    budget: [
      {
        name: "Stay",
        description:
          `Tokyo hotel cost usually decides whether the city feels merely expensive or still manageable. TripFit currently models accommodation at ${formatRange(110, 220)} per night for the destination baseline, but your actual total can move quickly depending on season and how central you want to stay.`,
      },
      {
        name: "Local spending",
        description:
          `Once you are in Tokyo, everyday costs are often more controllable than people expect. TripFit currently uses about ${formatRange(60, 120)} per day for meals, local transport, and simple activities, which means the city can be workable if you balance destination meals with casual options.`,
      },
      {
        name: "Whole-trip difference by origin",
        description:
          "Tokyo is exactly the kind of destination where origin changes the answer. A traveler coming from Taipei or Seoul may still see a strong total-trip fit, while the same local costs can become much harder from New York, Toronto, or London once flights are added.",
      },
      {
        name: "3, 5, and 7 days",
        description:
          `Using current stay and local-spend ranges, Tokyo often lands around ${formatRange(510, 1020)} for 3 days before flights, ${formatRange(850, 1700)} for 5 days, and ${formatRange(1190, 2380)} for 7 days. The destination only becomes a good overall TripFit when airfare from your departure point keeps that total inside budget.`,
      },
    ],
    itineraries: {
      "3": [
        {
          day: "Day 1",
          title: "Shibuya and Harajuku",
          items: [
            "Start in Shibuya to get your first feel for Tokyo's scale, crossings, and street rhythm.",
            "Move into Harajuku for side streets, shops, cafes, and a less overwhelming afternoon pace.",
            "Use the evening for a ramen or izakaya dinner nearby instead of crossing the city again.",
          ],
        },
        {
          day: "Day 2",
          title: "Asakusa and Ueno",
          items: [
            "Use the morning for Senso-ji and the surrounding Asakusa streets before the area feels busiest.",
            "Shift to Ueno for park space, museums, or Ameyoko depending on your energy level.",
            "Keep dinner on the east side so the day stays compact and culturally coherent.",
          ],
        },
        {
          day: "Day 3",
          title: "Shinjuku with a flexible finish",
          items: [
            "Use Shinjuku for observation views, department stores, or one final big-city district.",
            "Leave space for a last specialty meal, sweets stop, or missed shopping errand.",
            "Build in a conservative airport transfer, especially if you are flying from Narita.",
          ],
        },
      ],
      "5": [
        {
          day: "Day 1",
          title: "Arrival and Shibuya orientation",
          items: [
            "Check in and keep the first afternoon on the west side of the city.",
            "Walk Shibuya, get an easy first meal, and avoid over-planning after the flight.",
            "Use the evening to understand the station area you'll be relying on.",
          ],
        },
        {
          day: "Day 2",
          title: "Harajuku and Meiji Shrine",
          items: [
            "Begin at Meiji Shrine for a calmer morning before the busier shopping streets.",
            "Move through Harajuku at a pace that leaves room for cafes and side streets.",
            "Finish with dinner nearby or return to Shibuya without adding a long transfer.",
          ],
        },
        {
          day: "Day 3",
          title: "Asakusa and Ueno",
          items: [
            "Build the morning around Senso-ji and older east-side Tokyo.",
            "Use the afternoon for Ueno museums, park time, or market streets depending on your interests.",
            "Treat this as the cultural-heritage day rather than trying to add another distant district.",
          ],
        },
        {
          day: "Day 4",
          title: "Shinjuku and a contemporary Tokyo layer",
          items: [
            "Use Shinjuku for skyline views, department stores, or gardens depending on your mood.",
            "Add one modern experience such as immersive art, design retail, or a more polished district.",
            "Keep the evening open for a memorable dinner, bar lane, or final city-night experience.",
          ],
        },
        {
          day: "Day 5",
          title: "Ginza, Tokyo Station, or your favorite repeat area",
          items: [
            "Use the final day for a more polished, lower-pressure district such as Ginza or Marunouchi.",
            "Return to whichever neighborhood felt most 'you' rather than forcing one last checklist stop.",
            "Leave enough margin for airport logistics and last purchases.",
          ],
        },
      ],
    },
    practicalInfo: [
      {
        name: "Language reality",
        description:
          "You can travel comfortably in Tokyo without Japanese, especially on major train lines and in visitor-heavy districts, but the city becomes easier and more respectful when you rely on clear maps, simple translation help, and patient expectations rather than assuming everything will be frictionless.",
      },
      {
        name: "Payments and cash",
        description:
          "Cards are common in much of Tokyo, but cash still smooths out small restaurants, older shops, or occasional simple purchases. Treat a small cash reserve as part of practical trip setup, not as an emergency-only backup.",
      },
      {
        name: "Meal planning",
        description:
          "Tokyo dining rewards choosing a few intentional meals and letting the rest stay flexible. Some restaurants specialize very narrowly, so it is better to decide what kind of meal you want than to expect one place to do everything.",
      },
      {
        name: "Etiquette and pace",
        description:
          "Quiet train behavior, orderly lines, and low-friction public manners shape the feel of the city. Travelers who pay attention to that rhythm usually find Tokyo easier and more comfortable very quickly.",
      },
      {
        name: "Connectivity and convenience",
        description:
          "Convenience stores, station facilities, and reliable navigation tools are part of why Tokyo works so well for short trips. They make it easier to recover from late arrivals, weather changes, or itinerary adjustments without losing the day.",
      },
    ],
    faqs: [
      {
        name: "How much does Tokyo cost for a trip?",
        description:
          "For a typical 5-day trip, expect $850 to $1,700 total before international flights ($110–$220/night hotel and $60–$120/day local meals, trains, and entry tickets). Total affordability is primarily determined by flight fares from your departure city.",
      },
      {
        name: "Where should first-time visitors stay in Tokyo?",
        description:
          "Shinjuku is the best overall base for transit connections and nightlife. Shibuya is ideal for shopping and youth culture, Asakusa offers better hotel value and historic charm, and Ginza/Tokyo Station provides polished convenience.",
      },
      {
        name: "How many days should I spend in Tokyo?",
        description:
          "3 days covers core highlights like Shibuya, Asakusa, and Shinjuku. 5 days is the ideal sweet spot for first-timers, providing room for day trips, museums, deep neighborhood food exploration, and unhurried pacing.",
      },
      {
        name: "Can I visit Tokyo visa-free with my passport?",
        description:
          "UK, US, EU, Canadian, and Australian passport holders enjoy 90 days visa-free entry. Indian passport holders typically require an eVisa or consular visa. Check our verified Passport Entry Snapshot above for official travel rules.",
      },
      {
        name: "What is the best 3 to 5-day Tokyo itinerary?",
        description:
          "Group Tokyo by geographic clusters: West side (Shibuya, Harajuku, Shinjuku) on Days 1–2, East side (Asakusa, Ueno, Akihabara) on Day 3, Modern & Waterfront (Ginza, teamLab/Odaiba) on Day 4, and shopping or a day trip on Day 5.",
      },
      {
        name: "Which Tokyo airport should I fly into?",
        description:
          "Haneda (HND) is 30 minutes from central Tokyo and significantly cuts transfer fatigue. Narita (NRT) is further (60–90 mins via Narita Express or Skyliner) but frequently offers cheaper long-haul flight deals.",
      },
      {
        name: "Do I need cash or a transit IC card in Tokyo?",
        description:
          "While credit cards and digital Suica/Pasmo transit cards on smartphones work across almost all trains and convenience stores, having 5,000–10,000 JPY cash is recommended for ticket machines, shrines, and traditional ramen shops.",
      },
    ],
  },
  "buenos-aires": {
    quickFacts: {
      bestTime: "spring / autumn",
      currency: "ARS",
      airports: "EZE / AEP",
      bestFor: "Food · Culture · Nightlife",
    },
    overview: [
      "Buenos Aires is a city of long meals, grand avenues, neighborhood cafes, bookstores, football energy, and late nights. It is not a checklist city in the same way as Paris or Rome; its reward comes from choosing a few neighborhoods and letting the days breathe.",
      "The city stands apart in South America because it feels both intensely local and strongly European in its urban form. Wide boulevards, old apartment blocks, corner cafes, and leafy parks sit beside tango halls, steak restaurants, markets, and contemporary galleries.",
      "It is especially good for travelers who care about food, architecture, nightlife, music, and walkable neighborhoods. If you want beaches or mountain scenery, it is the wrong anchor; Buenos Aires is most persuasive as a culture-and-city trip.",
      "A first visit should balance Palermo or Recoleta comfort with San Telmo history, a major avenue walk, a food-focused evening, and at least one slower cafe or bookstore stop. Four to six days gives enough room without turning the trip into a rushed urban marathon.",
      "The main thing visitors misjudge is timing. Meals and nightlife run late, neighborhoods are spread out, and the city feels better when you stop trying to start every day at maximum speed.",
    ],
    thingSections: [
      {
        title: "Classic Buenos Aires",
        items: [
          { name: "Recoleta", description: "Use Recoleta for architecture, parks, museums, and a calmer introduction to the city. It is one of the easiest areas to understand Buenos Aires' polished side." },
          { name: "San Telmo", description: "San Telmo brings older streets, markets, tango atmosphere, and a more textured evening scene. It works best when you leave time to wander rather than rushing a single stop." },
          { name: "Avenida de Mayo and the center", description: "A central walk gives you the civic scale of the city, from historic cafes to major public buildings and broad avenues." },
        ],
      },
      {
        title: "Food, parks, and evenings",
        items: [
          { name: "Palermo", description: "Palermo is the easiest area for restaurants, bars, cafes, boutiques, and park time. It is also the safest default base for many first-time leisure trips." },
          { name: "Tango night", description: "A tango evening can be touristy or deeply local depending on the venue. Choose the format that fits your comfort level, from dinner shows to smaller milongas." },
          { name: "Bookstores and cafes", description: "Buenos Aires rewards slow indoor stops. Bookstores, historic cafes, and neighborhood coffee breaks are part of the experience, not filler." },
        ],
      },
    ],
    foods: [
      { name: "Steak and parrilla", description: "A parrilla meal is the classic Buenos Aires dinner. It suits travelers who want a slow evening built around meat, wine, and conversation rather than a quick restaurant stop." },
      { name: "Empanadas", description: "Empanadas are easy, affordable, and useful between neighborhoods. Try them as a casual lunch or late snack when a full meal would slow the day down." },
      { name: "Milanesa", description: "Milanesa is a comforting everyday dish and a good choice when you want something filling without making dinner complicated." },
      { name: "Dulce de leche sweets", description: "Dulce de leche shows up in pastries, desserts, and ice cream. It is an easy way to add a local food moment without planning a full meal." },
      { name: "Cafe culture", description: "Historic cafes and neighborhood coffee stops are central to the city's rhythm. They work especially well as midday pauses between long walks." },
    ],
  },
};

function PassportContext({
  passportName,
  passportStatus,
  passportSource,
  passportVerifiedAt,
  ukStatus,
  ukSource,
  ukVerifiedAt,
  indiaStatus,
  indiaSource,
  indiaVerifiedAt,
}: {
  passportName?: string;
  passportStatus?: string | null;
  passportSource?: string;
  passportVerifiedAt?: string;
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
        {passportName && passportStatus ? (
          <article>
            <h3>Your passport</h3>
            <strong>{passportName}</strong>
            <p translate="no">{passportStatus}</p>
            {passportSource ? (
              <a href={passportSource}>Travel advice / official guidance</a>
            ) : null}
            {passportVerifiedAt ? (
              <small>Last verified: {passportVerifiedAt}</small>
            ) : null}
          </article>
        ) : null}
        <article>
          <h3>UK passport</h3>
          <p translate="no">{ukStatus}</p>
          {ukSource ? (
            <a href={ukSource}>Travel advice / official guidance</a>
          ) : null}
          {ukVerifiedAt ? <small>Last verified: {ukVerifiedAt}</small> : null}
        </article>
        <article>
          <h3>Indian passport</h3>
          <p translate="no">{indiaStatus}</p>
          {indiaSource ? (
            <a href={indiaSource}>Travel advice / official guidance</a>
          ) : null}
          {indiaVerifiedAt ? (
            <small>Last verified: {indiaVerifiedAt}</small>
          ) : null}
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
  return (
    <div className="booking-card">
      <p className="eyebrow">Plan this trip</p>
      <h2>Plan your {destination.city} trip</h2>
      {snapshot ? (
        <div className="trip-snapshot">
          <span>
            From <strong>{snapshot.origin.name}</strong>
          </span>
          <span>
            Trip duration {snapshot.days} days
          </span>
          <span>Total budget {formatMoney(snapshot.budget)}</span>
          <strong className={snapshot.recommendation.budgetStatus.toLowerCase().replaceAll(" ", "-")}>
            {snapshot.recommendation.budgetStatus}
          </strong>
          <div>
            <dt>Estimated trip</dt>
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
      {!snapshot ? (
        <p>Choose your departure to check flights.</p>
      ) : null}
      <div className="booking-cta-stack">
        {snapshot ? (
          <AffiliateClickLink
            href={getFlightAffiliateUrl(destination, snapshot.origin)}
            product="flight"
            destination={destination.id}
            origin={snapshot.origin.iata}
            passport={snapshot.passport.id}
          >
            Check Current Flights
          </AffiliateClickLink>
        ) : (
          <a href="/#generator">Choose Departure</a>
        )}
        <AffiliateClickLink
          href={getHotelAffiliateUrl(destination)}
          product="hotel"
          destination={destination.id}
          origin={snapshot?.origin.iata}
          passport={snapshot?.passport.id}
        >
          Find Hotels
        </AffiliateClickLink>
      </div>
    </div>
  );
}

function GuideSources({ destination }: { destination: Destination }) {
  return (
    <section className="guide-section sources-section">
      <div className="section-heading">
        <p className="eyebrow">Planning sources</p>
        <h2>Sources and freshness</h2>
      </div>
      <div className="guide-card-grid">
        <article>
          <h3>TripFit methodology</h3>
          <p>
            Planning ranges for flights, stay, and local spending follow the same
            cost model used across TripFit recommendations.
          </p>
          <a href="/methodology">Read methodology</a>
        </article>
        <article>
          <h3>Entry guidance</h3>
          <p>
            Passport context is shown from verified visa rules where available,
            with official guidance links in the entry snapshot above.
          </p>
          <small>Last updated: August 18, 2026</small>
        </article>
        <article>
          <h3>Destination imagery</h3>
          <p>
            Destination photography is displayed from the curated image set used
            throughout TripFit guide pages.
          </p>
          <small>{destination.imageCredit ?? "Image credit available in page data"}</small>
        </article>
      </div>
    </section>
  );
}

function getTripSnapshot(
  destination: Destination,
  query: DestinationQuery,
) {
  const origin = origins.find((item) => item.iata === query.from);
  const budget = Number(query.budget);
  const days = Number(query.days);
  const passport = passports.find(
    (item) =>
      item.id === query.passport ||
      item.name === query.passport ||
      item.countryCode === query.passport,
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
