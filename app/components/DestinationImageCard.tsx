import type { Destination } from "../lib/data";

type DestinationImageCardProps = {
  destination: Destination;
  compact?: boolean;
  overlay?: boolean;
};

export function DestinationImageCard({
  destination,
  compact = false,
  overlay = false,
}: DestinationImageCardProps) {
  return (
    <a
      className={`image-destination-card ${compact ? "compact" : ""} ${
        overlay ? "overlay" : ""
      }`}
      href={`/destinations/${destination.id}`}
    >
      <span className="image-card-media">
        <img
          src={destination.image}
          alt={destination.imageAlt}
          width="700"
          height="450"
          loading="lazy"
        />
      </span>
      <span className="image-card-copy">
        <span>{destination.country}</span>
        <strong>{destination.city}</strong>
        {!overlay ? (
          <small>{destination.tags.slice(0, 3).join(" · ")}</small>
        ) : null}
      </span>
    </a>
  );
}
