export type TokyoHighlightCardData = {
  name: string;
  category: string;
  whyItMatters: string;
  recommendedTime: string;
};

type TokyoHighlightPhoto = {
  src: string;
  alt: string;
};

export function TokyoHighlightCard({
  highlight,
  photo,
}: {
  highlight: TokyoHighlightCardData;
  photo: TokyoHighlightPhoto;
}) {
  return (
    <article className="tokyo-highlight-card">
      <figure>
        <img src={photo.src} alt={photo.alt} width="1200" height="760" loading="lazy" />
        <figcaption>{highlight.category}</figcaption>
      </figure>
      <div>
        <h3>{highlight.name}</h3>
        <p>{highlight.whyItMatters}</p>
        <span>Recommended time: {highlight.recommendedTime}</span>
      </div>
    </article>
  );
}
