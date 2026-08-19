import type { Metadata } from "next";
import { DestinationImageCard } from "../components/DestinationImageCard";
import { destinations, tripTags } from "../lib/data";

export const metadata: Metadata = {
  title: "Destination Directory",
  description:
    "Browse supported WhereAtlas destinations with regions, tags, trip duration ranges, and budget planning costs.",
  alternates: { canonical: "/destinations" },
};

export default function DestinationsPage() {
  const byRegion = [
    ...new Set(destinations.map((destination) => destination.region)),
  ];

  return (
    <main>
      <section className="page-hero compact">
        <p className="eyebrow">Destination directory</p>
        <h1>Supported Destinations</h1>
        <p>
          Coverage focuses on popular international destinations that can
          support passport, budget, and booking decisions.
        </p>
      </section>
      <section className="content-band">
        <div className="section-heading">
          <p className="eyebrow">Tags</p>
          <h2>Travel Styles</h2>
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
    </main>
  );
}
