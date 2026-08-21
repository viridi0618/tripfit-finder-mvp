import type { Metadata } from "next";
import { PopularDestinations } from "./components/SiteChrome";
import { TripFinder } from "./components/TripFinder";
import { siteUrl } from "./lib/site";

export const metadata: Metadata = {
  description:
    "Enter your passport, departure city, total trip budget and trip duration to find destinations you can realistically visit and afford.",
  alternates: { canonical: "/" },
};

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "WhereAtlas",
        description:
          "Passport and budget-aware travel destination discovery and vacation decision tool.",
        publisher: {
          "@type": "Organization",
          name: "WhereAtlas",
          url: siteUrl,
        },
      },
      {
        "@type": "SoftwareApplication",
        "@id": `${siteUrl}/#application`,
        name: "WhereAtlas Vacation Generator",
        applicationCategory: "TravelApplication",
        operatingSystem: "All",
        url: siteUrl,
        description:
          "A travel decision and recommendation tool that helps users discover realistic vacation destinations based on passport visa access, departure city flight estimates, total budget, and trip duration.",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
      },
    ],
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <TripFinder homeMode />
      <PopularDestinations />
      <section className="content-band why-tripfit">
        <div>
          <p className="eyebrow">Why WhereAtlas</p>
          <h2>Beautiful is easy. Possible is better.</h2>
        </div>
        <div className="why-list">
          <div>
            <h3>Passport-aware</h3>
            <p>
              Know which destinations are realistic for your passport before
              you start dreaming too hard.
            </p>
          </div>
          <div>
            <h3>Whole-trip budget</h3>
            <p>
              Flights, stay and local spending are counted together, not split
              into misleading daily numbers.
            </p>
          </div>
          <div>
            <h3>Your real departure point</h3>
            <p>
              Because a cheap place is not cheap if the flight from your city
              costs the whole trip.
            </p>
          </div>
        </div>
      </section>
      <section className="final-home-cta">
        <h2>Find somewhere you can actually go.</h2>
        <a className="primary-link" href="#generator">
          Show Me Where I Can Go
        </a>
      </section>
    </main>
  );
}

