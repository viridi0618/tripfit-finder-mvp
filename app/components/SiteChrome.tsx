import { popularDestinationIds, destinations } from "../lib/data";
import { DestinationImageCard } from "./DestinationImageCard";

export function Header() {
  return (
    <header className="site-header">
      <a className="brand" href="/">
        <span className="brand-mark">TF</span>
        <span>TripFit Finder</span>
      </a>
      <nav aria-label="Main navigation">
        <a href="/quiz">Quiz</a>
        <a href="/destinations">Destinations</a>
        <a href="/methodology">Methodology</a>
      </nav>
    </header>
  );
}

export function Footer() {
  const popular = destinations.filter((destination) =>
    popularDestinationIds.includes(destination.id),
  );

  return (
    <footer className="site-footer">
      <div>
        <h2>TripFit Finder</h2>
        <p>
          Tell travelers where they can realistically go based on passport,
          departure city, total budget, and trip length.
        </p>
      </div>
      <div>
        <h3>Popular Destinations</h3>
        <div className="footer-links">
          {popular.slice(0, 6).map((destination) => (
            <a key={destination.id} href={`/destinations/${destination.id}`}>
              {destination.city}
            </a>
          ))}
        </div>
      </div>
      <div>
        <h3>Trust</h3>
        <div className="footer-links">
          <a href="/visa-free-countries/uk-passport">UK Passport</a>
          <a href="/visa-free-countries/indian-passport">
            Indian Passport
          </a>
          <a href="/affiliate-disclosure">Affiliate Disclosure</a>
        </div>
      </div>
    </footer>
  );
}

export function PopularDestinations() {
  const popular = destinations.filter((destination) =>
    popularDestinationIds.includes(destination.id),
  );

  return (
    <section className="content-band" aria-labelledby="popular-destinations">
      <div className="section-heading">
        <p className="eyebrow">Get inspired</p>
        <h2 id="popular-destinations">Where travelers are going</h2>
      </div>
      <div className="popular-grid popular-mosaic">
        {popular.map((destination) => (
          <DestinationImageCard
            key={destination.id}
            destination={destination}
            overlay
          />
        ))}
      </div>
    </section>
  );
}
