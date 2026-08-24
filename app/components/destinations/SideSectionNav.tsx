"use client";

import { useEffect, useState } from "react";

export type SectionNavItem = {
  id: string;
  label: string;
  children?: SectionNavItem[];
};

function SectionNavList({
  items,
  closeMenu,
  activeId,
  setActiveId,
}: {
  items: SectionNavItem[];
  closeMenu: () => void;
  activeId: string;
  setActiveId: (id: string) => void;
}) {
  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>
          <a
            className={activeId === item.id ? "active" : undefined}
            href={`#${item.id}`}
            aria-current={activeId === item.id ? "location" : undefined}
            onClick={() => {
              setActiveId(item.id);
              closeMenu();
            }}
          >
            {item.label}
          </a>
          {item.children?.length ? (
            <SectionNavList
              items={item.children}
              closeMenu={closeMenu}
              activeId={activeId}
              setActiveId={setActiveId}
            />
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
  const [activeId, setActiveId] = useState("");
  const closeMenu = () => setOpen(false);

  useEffect(() => {
    const syncHash = () => setActiveId(window.location.hash.slice(1));
    syncHash();
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, []);

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
        <SectionNavList
          items={items}
          closeMenu={closeMenu}
          activeId={activeId}
          setActiveId={setActiveId}
        />
      </div>
    </nav>
  );
}
