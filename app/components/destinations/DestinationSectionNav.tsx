type DestinationSectionNavItem = {
  id: string;
  label: string;
};

export function DestinationSectionNav({
  city,
  items,
}: {
  city: string;
  items: DestinationSectionNavItem[];
}) {
  return (
    <nav className="destination-section-nav" aria-label={`${city} planning sections`}>
      <span className="destination-section-nav-title">Plan your {city} trip</span>
      <div className="destination-section-nav-links">
        {items.map((item) => (
          <a key={item.id} href={`#${item.id}`}>
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
