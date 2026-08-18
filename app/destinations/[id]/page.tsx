import type { Metadata } from "next";
import { Breadcrumbs } from "../../components/Breadcrumbs";
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
          <QuickFacts destination={destination} guide={guide} />
          <DestinationGuide destination={destination} guide={guide} days={tripSnapshot?.days} />
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

function DestinationGuide({
  destination,
  guide,
  days,
}: {
  destination: Destination;
  guide: GuideModel;
  days?: number;
}) {
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
  photo: NonNullable<Destination["gallery"]>[number];
  size: "wide";
}) {
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
  const baseGuide = destination.guide;
  const defaultModel = buildDefaultGuideModel(destination, basePhotos);

  return {
    ...defaultModel,
    quickFacts: {
      ...defaultModel.quickFacts,
      ...cityGuide?.quickFacts,
    },
    overview: cityGuide?.overview ?? expandOverview(destination, baseGuide?.overview),
    thingSections:
      cityGuide?.thingSections ??
      buildThingSections(destination, baseGuide?.highlights),
    foods: cityGuide?.foods ?? buildFoodItems(destination, baseGuide?.foods),
    neighborhoods:
      cityGuide?.neighborhoods ?? buildNeighborhoods(destination),
    gettingAround: cityGuide?.gettingAround ?? buildGettingAround(destination),
    bestTime: cityGuide?.bestTime ?? buildBestTime(destination),
    budget: buildBudgetItems(destination),
    itineraries: cityGuide?.itineraries ?? buildItineraries(destination),
    practicalInfo:
      cityGuide?.practicalInfo ?? buildPracticalInfo(destination, baseGuide?.culture, baseGuide?.practicalTips),
    faqs: cityGuide?.faqs ?? buildFaqs(destination),
    photos: cityGuide?.photos ?? basePhotos,
  };
}

function buildDefaultGuideModel(
  destination: Destination,
  photos: NonNullable<Destination["gallery"]>,
): GuideModel {
  return {
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

  while (unique.length < 4) {
    unique.push({
      src: destination.image,
      alt: destination.imageAlt,
      caption: `${destination.city} trip inspiration`,
      credit: destination.imageCredit,
    });
  }

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
      {!snapshot ? (
        <p>Choose your departure to check flights.</p>
      ) : null}
      <div className="booking-cta-stack">
        {snapshot ? (
          <a
            href={flightAffiliateUrl(destination, snapshot.origin)}
            rel="nofollow sponsored"
          >
            Check Current Flights
          </a>
        ) : (
          <a href="/#generator">Choose Departure</a>
        )}
        <a href={hotelAffiliateUrl(destination)} rel="nofollow sponsored">
          Find Hotels
        </a>
      </div>
      <p className="fine-print">
        Planning flight estimates are not live or recently observed fares.
        Verify current prices and entry rules before booking.
      </p>
    </div>
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
