import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Methodology",
  description:
    "How TripFit Finder uses visa information, cached flight estimates, destination costs, and total budget scoring.",
  alternates: { canonical: "/methodology" },
};

export default function MethodologyPage() {
  return (
    <main>
      <section className="page-hero compact">
        <p className="eyebrow">Methodology / Trust</p>
        <h1>How TripFit Finder Works</h1>
        <p>
          The MVP is designed to show realistic travel possibilities without
          pretending that estimates are guaranteed live prices or official entry
          decisions.
        </p>
      </section>
      <section className="content-band method-grid">
        <div>
          <h2>Visa information</h2>
          <p>
            Based on local MVP visa rules with official government or
            immigration source links where available. We use phrases like
            typically visa-free for short tourist visits instead of guaranteeing
            entry.
          </p>
        </div>
        <div>
          <h2>Flight estimates</h2>
          <p>
            Based on recent cached fare references. They are not guaranteed
            real-time prices. If a route has no cached estimate, the product
            displays flight estimate unavailable and keeps the recommendation
            flow usable.
          </p>
        </div>
        <div>
          <h2>Destination costs</h2>
          <p>
            Accommodation and local spending are approximate low-to-high
            planning ranges for supported destinations. The core budget model is
            total trip budget, not daily budget.
          </p>
        </div>
        <div>
          <h2>Feasibility ranking</h2>
          <p>
            Results are scored by budget fit, entry convenience, trip length
            fit, optional preference fit, cached flight availability, and
            popularity.
          </p>
        </div>
      </section>
      <section className="content-band cta-band">
        <h2>Important</h2>
        <p>
          Prices and entry requirements may change. Always verify current
          requirements and current fares before booking.
        </p>
      </section>
    </main>
  );
}
