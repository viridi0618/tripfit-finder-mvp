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
      <TripFinder homeMode />
      <PopularDestinations />
      <section className="content-band why-tripfit">
        <div>
          <p className="eyebrow">Why TripFit</p>
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
