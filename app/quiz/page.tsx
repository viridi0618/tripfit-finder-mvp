import type { Metadata } from "next";
import { TripFinder } from "../components/TripFinder";
import { siteUrl } from "../lib/site";

export const metadata: Metadata = {
  title: "Where Should I Travel Quiz | WhereAtlas",
  description:
    "Take our travel quiz to find realistic vacation destinations based on your passport, departure city, budget, trip duration, and travel style.",
  alternates: { canonical: "/quiz" },
  openGraph: {
    title: "Where Should I Travel Quiz | WhereAtlas",
    description:
      "Find where you should go on vacation with a mood and feasibility quiz powered by passport, budget, and flight estimates.",
    url: `${siteUrl}/quiz`,
    siteName: "WhereAtlas",
    type: "website",
  },
};

export default function QuizPage() {
  return (
    <main>
      <section className="page-hero compact">
        <p className="eyebrow">Vacation destination quiz</p>
        <h1>Where Should I Travel Quiz</h1>
        <p>
          Not sure where to go on vacation? Pick a travel vibe and let
          WhereAtlas match your travel mood with real-world passport entry
          rules, departure flight costs, and total trip budget feasibility.
        </p>
      </section>

      <TripFinder quizMode />

      <section className="content-band why-tripfit">
        <div className="section-heading">
          <p className="eyebrow">How the quiz works</p>
          <h2>Vacation ideas based on reality, not just wishlists</h2>
        </div>
        <div className="why-list">
          <div>
            <h3>1. Travel Style & Mood</h3>
            <p>
              Whether you want beaches, bustling cities, deep culture, food
              scenes, or outdoor adventure, the quiz filters by your preferred
              trip atmosphere.
            </p>
          </div>
          <div>
            <h3>2. Passport & Visa Feasibility</h3>
            <p>
              We evaluate your passport against entry requirements so you only
              see destinations you can actually visit without surprise visa
              hurdles.
            </p>
          </div>
          <div>
            <h3>3. Flight & Stay Budget Fit</h3>
            <p>
              Recommendations factor in flight estimates from your departure
              city and local cost of living for your exact trip duration.
            </p>
          </div>
        </div>
      </section>

      <section className="content-band cta-band">
        <h2>Prefer browsing all destinations?</h2>
        <a className="primary-link" href="/destinations">
          Explore Destination Guides
        </a>
      </section>
    </main>
  );
}

