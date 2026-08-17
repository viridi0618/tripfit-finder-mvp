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
            Enter your passport, departure city, total budget and trip length.
            We&apos;ll show you trips you can actually afford and realistically
            take.
          </p>
          <div className="hero-signals" aria-label="Product checks">
            <span>Can I enter?</span>
            <span>Can I afford it?</span>
            <span>Where can I book it?</span>
          </div>
        </div>
        <div className="hero-visual travel-hero-photo">
          <img
            src="/destinations/tokyo.webp"
            alt="Tokyo skyline and illuminated city streets"
            width="1400"
            height="900"
          />
          <div className="hero-photo-caption">
            <span>Tokyo, Japan</span>
            <strong>5-day trip · realistic budget match</strong>
          </div>
        </div>
      </section>
      <TripFinder />
      <PopularDestinations />
      <section className="content-band split-band">
        <div>
          <p className="eyebrow">Why it feels different</p>
          <h2>Not just where you&apos;d like to go. Where you can actually go.</h2>
        </div>
        <div className="method-grid">
          <div>
            <h3>Passport-aware</h3>
            <p>
              Skip ideas that look amazing but are difficult for your passport.
            </p>
          </div>
          <div>
            <h3>Your whole trip budget</h3>
            <p>
              We look at flights, accommodation and everyday spending, not just
              daily costs.
            </p>
          </div>
          <div>
            <h3>From where you actually live</h3>
            <p>
              A cheap destination is not cheap if getting there blows your
              budget.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
