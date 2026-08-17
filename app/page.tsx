import type { Metadata } from "next";
import { PopularDestinations } from "./components/SiteChrome";
import { TripFinder } from "./components/TripFinder";

export const metadata: Metadata = {
  title: "Random Vacation Generator | TripFit Finder",
  description:
    "Find destinations your passport and total trip budget can realistically support.",
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <main>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Random vacation generator</p>
          <h1>Random Vacation Generator</h1>
          <p className="hero-subtitle">
            Where can your passport and budget take you?
          </p>
          <p>
            Find destinations you can actually afford and realistically travel
            to, using passport entry status, origin-based flight estimates, and
            total trip budget math.
          </p>
          <div className="hero-signals" aria-label="Product checks">
            <span>Can I enter?</span>
            <span>Can I afford it?</span>
            <span>Where can I book it?</span>
          </div>
        </div>
        <div className="hero-visual" aria-label="TripFit Finder preview image">
          <img
            src="/og.png"
            alt="TripFit Finder map, passport, boarding pass, and trip budget"
          />
        </div>
      </section>
      <TripFinder />
      <PopularDestinations />
      <section className="content-band split-band">
        <div>
          <p className="eyebrow">MVP scope</p>
          <h2>Built around feasibility, not endless inspiration</h2>
        </div>
        <div className="method-grid">
          <div>
            <h3>Passport Engine</h3>
            <p>
              Visa status is read from local rules with official source links
              and last-verified dates. Unknown means unknown.
            </p>
          </div>
          <div>
            <h3>Total Budget Engine</h3>
            <p>
              Flight estimate, stay, and local spending are combined into one
              total trip cost range.
            </p>
          </div>
          <div>
            <h3>Feasibility Ranking</h3>
            <p>
              Results are ranked by budget fit, entry convenience, trip length,
              preference, and popularity.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
