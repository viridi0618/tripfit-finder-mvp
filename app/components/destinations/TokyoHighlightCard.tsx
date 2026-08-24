export type TokyoHighlightCardData = {
  name: string;
  category: string;
  imageSrc: string;
  imageAlt: string;
  imageCredit: string;
  imageSourceUrl: string;
  whyItMatters: string;
  recommendedTime: string;
  wikipediaUrl?: string;
  officialUrl?: string;
};

export function TokyoHighlightCard({
  highlight,
}: {
  highlight: TokyoHighlightCardData;
}) {
  return (
    <article className="tokyo-highlight-card">
      <figure>
        <img src={highlight.imageSrc} alt={highlight.imageAlt} width="1200" height="760" loading="lazy" />
        <figcaption>{highlight.category}</figcaption>
      </figure>
      <div>
        <h3>{highlight.name}</h3>
        <p>{highlight.whyItMatters}</p>
        <span>Recommended time: {highlight.recommendedTime}</span>
        {highlight.wikipediaUrl || highlight.officialUrl ? (
          <div className="tokyo-highlight-links">
            {highlight.wikipediaUrl ? <a href={highlight.wikipediaUrl} target="_blank" rel="noreferrer">Wikipedia →</a> : null}
            {highlight.officialUrl ? <a href={highlight.officialUrl} target="_blank" rel="noreferrer">Official →</a> : null}
          </div>
        ) : null}
        <small className="tokyo-highlight-credit">
          {highlight.imageCredit} · <a href={highlight.imageSourceUrl} target="_blank" rel="noreferrer">Image source →</a>
        </small>
      </div>
    </article>
  );
}
