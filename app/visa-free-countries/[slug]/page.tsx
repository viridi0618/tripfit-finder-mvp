import type { Metadata } from "next";
import { destinations, visaRules, type VisaStatus } from "../../lib/data";
import { normalizePassport, statusLabel } from "../../lib/recommendations";

const pages = {
  "uk-passport": {
    passport: "united-kingdom",
    title: "Visa-Free Countries For UK Passport",
    description:
      "MVP entry-status snapshot for UK passport holders across supported TripFit Finder destinations.",
  },
  "indian-passport": {
    passport: "india",
    title: "Visa-Free Countries For Indian Passport",
    description:
      "MVP entry-status snapshot for Indian passport holders across supported TripFit Finder destinations.",
  },
} as const;

type VisaPageProps = {
  params: { slug: keyof typeof pages };
};

const statuses: VisaStatus[] = [
  "visa_free",
  "eta",
  "visa_on_arrival",
  "evisa",
  "visa_required",
  "unknown",
];

export function generateStaticParams() {
  return Object.keys(pages).map((slug) => ({ slug }));
}

export function generateMetadata({ params }: VisaPageProps): Metadata {
  const page = pages[params.slug];
  return {
    title: page?.title ?? "Passport Entry Snapshot",
    description: page?.description,
    alternates: { canonical: `/visa-free-countries/${params.slug}` },
  };
}

export default function VisaPage({ params }: VisaPageProps) {
  const page = pages[params.slug];
  if (!page) {
    return (
      <main>
        <section className="page-hero compact">
          <h1>Passport page not found</h1>
        </section>
      </main>
    );
  }

  const passport = normalizePassport(page.passport);
  const rows = destinations.map((destination) => {
    const rule =
      visaRules.find(
        (item) =>
          item.passportCountry === passport &&
          item.destinationCountryCode === destination.countryCode,
      ) ?? null;
    return { destination, rule };
  });

  return (
    <main>
      <section className="page-hero compact">
        <p className="breadcrumb">
          <a href="/">Home</a> / Visa-free countries
        </p>
        <p className="eyebrow">Passport SEO page</p>
        <h1>{page.title}</h1>
        <p>
          Entry requirements change. This page shows local MVP data with
          official source links where available, and should be verified before
          booking.
        </p>
      </section>
      {statuses.map((status) => {
        const group = rows.filter((row) => row.rule?.status === status);
        return (
          <section className="content-band visa-section" key={status}>
            <div className="section-heading">
              <p className="eyebrow">Entry status</p>
              <h2 translate="no">{statusLabel(status)}</h2>
            </div>
            {group.length ? (
              <div className="visa-table">
                {group.map(({ destination, rule }) => (
                  <div className="visa-row" key={destination.id}>
                    <strong>
                      {destination.city}, {destination.country}
                    </strong>
                    <span>
                      Typical allowed stay:{" "}
                      {rule?.maxStayDays ? `${rule.maxStayDays} days` : "Verify"}
                    </span>
                    <a href={rule?.officialSourceUrl}>Official source</a>
                    <small>Last verified: {rule?.lastVerifiedAt}</small>
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-note">No supported MVP destinations in this group.</p>
            )}
          </section>
        );
      })}
      <section className="content-band cta-band">
        <h2>Find destinations that fit your passport and budget</h2>
        <a className="primary-link" href="/#generator">
          Start the generator
        </a>
      </section>
    </main>
  );
}
