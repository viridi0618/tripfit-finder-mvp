"use client";

import { useState } from "react";

export type SectionNavItem = {
  id: string;
  label: string;
  children?: SectionNavItem[];
};

function SectionNavList({
  items,
  closeMenu,
}: {
  items: SectionNavItem[];
  closeMenu: () => void;
}) {
  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>
          <a href={`#${item.id}`} onClick={closeMenu}>
            {item.label}
          </a>
          {item.children?.length ? (
            <SectionNavList items={item.children} closeMenu={closeMenu} />
          ) : null}
        </li>
      ))}
    </ul>
  );
}

export function SideSectionNav({
  city,
  items,
}: {
  city: string;
  items: SectionNavItem[];
}) {
  const [open, setOpen] = useState(false);
  const closeMenu = () => setOpen(false);

  return (
    <nav className={`side-section-nav${open ? " is-open" : ""}`} aria-label={`${city} guide sections`}>
      <button
        className="side-section-nav-toggle"
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        <span aria-hidden="true">☰</span>
        <span>{city} guide sections</span>
      </button>
      <div className="side-section-nav-panel">
        <div className="side-section-nav-heading">
          <span>Guide</span>
          <strong>{city}</strong>
        </div>
        <SectionNavList items={items} closeMenu={closeMenu} />
      </div>
    </nav>
  );
}
