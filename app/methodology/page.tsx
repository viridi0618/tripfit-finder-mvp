import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Methodology",
  description:
    "How TripFit Finder uses verified visa rules, planning flight estimates, destination costs, and total budget scoring.",
  alternates: { canonical: "/methodology" },
};

export default function MethodologyPage() {
  return (
    <main>
      <section className="page-hero compact">
        <p className="eyebrow">Methodology / Trust</p>
        <h1>How TripFit Finder Works</h1>
        <p>
          TripFit Finder shows realistic travel possibilities without pretending
          that estimates are live prices or official entry decisions.
        </p>
      </section>
      <section className="content-band method-grid">
        <div>
          <h2>Visa information</h2>
          <p>
            Only explicitly recorded entry rules are shown as known statuses.
            Other passport and destination combinations are marked Check
            required, with official guidance links where available.
          </p>
        </div>
        <div>
          <h2>Flight estimates</h2>
          <p>
            Current route ranges are manually authored planning estimates, not
            live or recently observed fares. If a route has no estimate, the
            product displays flight estimate unavailable and keeps the
            recommendation flow usable.
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
            Results are scored by budget fit, entry convenience, trip duration
            fit, optional preference fit, flight estimate availability, and
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
