import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Affiliate Disclosure",
  description:
    "WhereAtlas may earn a commission from flight or hotel links at no extra cost to users.",
  alternates: { canonical: "/affiliate-disclosure" },
};

export default function AffiliateDisclosurePage() {
  return (
    <main>
      <section className="page-hero compact">
        <p className="eyebrow">Affiliate disclosure</p>
        <h1>Affiliate Disclosure</h1>
        <p>
          Some flight and hotel links on WhereAtlas may be affiliate links.
          If you book through one of those links, we may earn a commission at no
          extra cost to you.
        </p>
      </section>
      <section className="content-band method-grid">
        <div>
          <h2>How links work</h2>
          <p>
            Recommendation cards include Check Current Flights and Find Hotels
            CTAs. These links are designed as replaceable affiliate components
            and can be updated as commercial partnerships change.
          </p>
        </div>
        <div>
          <h2>Independence</h2>
          <p>
            The ranking is based on passport status, budget math, trip
            length fit, preference fit, and popularity. Affiliate availability
            is not the core feasibility signal.
          </p>
        </div>
      </section>
    </main>
  );
}
