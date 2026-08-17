"use client";

import { useEffect, useMemo, useState } from "react";
import { destinations, heroDestinationIds } from "../lib/data";

const slideIntervalMs = 6000;

export function HeroDestinationCarousel() {
  const slides = useMemo(
    () =>
      heroDestinationIds
        .map((id) => destinations.find((destination) => destination.id === id))
        .filter((destination): destination is NonNullable<typeof destination> =>
          Boolean(destination),
        ),
    [],
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const activeSlide = slides[activeIndex] ?? slides[0];

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = window.setTimeout(() => {
      setActiveIndex((index) => (index + 1) % slides.length);
    }, slideIntervalMs);

    return () => window.clearTimeout(timer);
  }, [activeIndex, slides.length]);

  function goToSlide(index: number) {
    setActiveIndex((index + slides.length) % slides.length);
  }

  if (!activeSlide) return null;

  return (
    <div className="hero-carousel" aria-label="Featured destinations">
      <div className="hero-slide-stack">
        {slides.map((destination, index) => (
          <img
            key={destination.id}
            className={`hero-slide-image ${index === activeIndex ? "active" : ""}`}
            src={destination.heroImage ?? destination.image}
            alt={destination.heroImageAlt ?? destination.imageAlt}
            width="2200"
            height="1400"
            loading={index === 0 ? "eager" : "lazy"}
            decoding="async"
          />
        ))}
      </div>
      <div className="home-hero-overlay" aria-hidden="true" />
      <div className="hero-slide-controls">
        <div className="hero-slide-caption">
          <span>{activeSlide.city}</span>
          <strong>{activeSlide.country}</strong>
          <a href={`/destinations/${activeSlide.id}`}>Explore {activeSlide.city}</a>
        </div>
        <div className="hero-slide-buttons" aria-label="Hero carousel controls">
          <button
            type="button"
            aria-label="Previous destination"
            onClick={() => goToSlide(activeIndex - 1)}
          >
            &larr;
          </button>
          <button
            type="button"
            aria-label="Next destination"
            onClick={() => goToSlide(activeIndex + 1)}
          >
            &rarr;
          </button>
        </div>
        <div className="hero-slide-dots" aria-label="Choose destination slide">
          {slides.map((destination, index) => (
            <button
              key={destination.id}
              type="button"
              className={index === activeIndex ? "active" : ""}
              aria-label={`Show ${destination.city}`}
              aria-current={index === activeIndex ? "true" : undefined}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
