import type { Metadata } from "next";
import { Breadcrumbs } from "../../components/Breadcrumbs";
import { destinations, type VisaStatus } from "../../lib/data";
import { findVisaRule, statusLabel } from "../../lib/recommendations";

const pages = {
  "uk-passport": {
    passport: "united-kingdom",
    title: "Visa-Free Countries For UK Passport",
    description:
      "Entry-status snapshot for UK passport holders across supported WhereAtlas destinations.",
  },
  "indian-passport": {
    passport: "india",
    title: "Visa-Free Countries For Indian Passport",
    description:
      "Entry-status snapshot for Indian passport holders across supported WhereAtlas destinations.",
  },
} as const;

type VisaPageProps = {
  params: Promise<{ slug: keyof typeof pages }>;
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

export async function generateMetadata({
  params,
}: VisaPageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = pages[slug];
  return {
    title: page?.title ?? "Passport Entry Snapshot",
    description: page?.description,
    alternates: { canonical: `/visa-free-countries/${slug}` },
  };
}

export default async function VisaPage({ params }: VisaPageProps) {
  const { slug } = await params;
  const page = pages[slug];
  if (!page) {
    return (
      <main>
        <section className="page-hero compact">
          <h1>Passport page not found</h1>
        </section>
      </main>
    );
  }

  const rows = destinations.map((destination) => ({
    destination,
    rule: findVisaRule(page.passport, destination.countryCode),
  }));

  return (
    <main>
      <section className="page-hero compact">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Visa-free countries" },
            { label: page.title.replace("Visa-Free Countries For ", "") },
          ]}
        />
        <p className="eyebrow">Passport entry guide</p>
        <h1>{page.title}</h1>
        <p>
          Entry requirements change. This page shows verified local data with
          official guidance links where available, and should be checked again
          before booking.
        </p>
      </section>
      {statuses.map((status) => {
        const group = rows.filter((row) => row.rule.status === status);
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
                      {rule.maxStayDays ? `${rule.maxStayDays} days` : "Verify"}
                    </span>
                    {rule.officialSourceUrl ? (
                      <a href={rule.officialSourceUrl}>
                        Travel advice / official guidance
                      </a>
                    ) : null}
                    {rule.lastVerifiedAt ? (
                      <small>Last verified: {rule.lastVerifiedAt}</small>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-note">No supported destinations in this group.</p>
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
