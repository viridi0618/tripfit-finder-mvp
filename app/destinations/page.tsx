import type { Metadata } from "next";
import { DestinationImageCard } from "../components/DestinationImageCard";
import { destinations, tripTags } from "../lib/data";

export const metadata: Metadata = {
  title: "Travel Destinations & City Guides | WhereAtlas",
  description:
    "Explore all supported travel destinations and city guides. Find places you can realistically visit based on your passport, departure city, budget, and trip duration.",
  alternates: { canonical: "/destinations" },
};

export default function DestinationsPage() {
  const byRegion = [
    ...new Set(destinations.map((destination) => destination.region)),
  ];

  return (
    <main>
      <section className="page-hero compact">
        <p className="eyebrow">Destinations directory</p>
        <h1>Explore Destinations & Travel Guides</h1>
        <p>
          Browse supported destinations with passport entry status, flight
          estimates, typical trip durations, and realistic budget planning
          ranges.
        </p>
      </section>
      <section className="content-band">
        <div className="section-heading">
          <p className="eyebrow">Travel styles</p>
          <h2>Browse by Trip Interest</h2>
        </div>
        <div className="tag-cloud">
          {tripTags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      </section>
      {byRegion.map((region) => (
        <section className="content-band directory-band" key={region}>
          <div className="section-heading">
            <p className="eyebrow">{region}</p>
            <h2>{region} Destinations</h2>
          </div>
          <div className="directory-grid">
            {destinations
              .filter((destination) => destination.region === region)
              .map((destination) => (
                <DestinationImageCard
                  key={destination.id}
                  destination={destination}
                  compact
                />
              ))}
          </div>
        </section>
      ))}
      <section className="content-band cta-band">
        <h2>Find destinations that fit your passport and budget</h2>
        <a className="primary-link" href="/#generator">
          Start the Vacation Generator
        </a>
      </section>
    </main>
  );
}

