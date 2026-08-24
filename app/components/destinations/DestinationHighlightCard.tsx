import { ImageLightbox } from "./ImageLightbox";

export type DestinationHighlight = {
  name: string;
  category: string;
  imageSrc: string;
  imageAlt: string;
  imageCredit?: string;
  imageSourceUrl?: string;
  whyItMatters: string;
  recommendedTime: string;
  officialUrl?: string;
  wikipediaUrl?: string;
};

export function getDestinationHighlightId(name: string) {
  return `destination-highlight-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;
}

export function DestinationHighlightCard({
  highlight,
}: {
  highlight: DestinationHighlight;
}) {
  const primaryUrl = highlight.officialUrl ?? highlight.wikipediaUrl;
  const primaryLabel = highlight.officialUrl ? "Official site →" : "Wikipedia →";

  return (
    <article id={getDestinationHighlightId(highlight.name)} className="destination-highlight-card">
      <figure>
        <ImageLightbox
          src={highlight.imageSrc}
          alt={highlight.imageAlt}
          credit={highlight.imageCredit}
          sourceUrl={highlight.imageSourceUrl}
        />
        <figcaption>{highlight.category}</figcaption>
      </figure>
      <div>
        <h3>
          {primaryUrl ? (
            <a href={primaryUrl} target="_blank" rel="noreferrer">
              {highlight.name}
            </a>
          ) : highlight.name}
        </h3>
        <p>{highlight.whyItMatters}</p>
        <span>Recommended time: {highlight.recommendedTime}</span>
        {primaryUrl ? (
          <a className="destination-highlight-reference" href={primaryUrl} target="_blank" rel="noreferrer">
            {primaryLabel}
          </a>
        ) : null}
        {highlight.imageCredit ? (
          <small className="destination-highlight-credit">
            Image: {highlight.imageCredit.replace(/^Photo via /i, "")}
          </small>
        ) : null}
      </div>
    </article>
  );
}
