"use client";

import { useEffect, useState } from "react";

export function ImageLightbox({
  src,
  alt,
  credit,
  sourceUrl,
}: {
  src: string;
  alt: string;
  credit?: string;
  sourceUrl?: string;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <>
      <button
        className="image-lightbox-trigger"
        type="button"
        aria-label={`Open image: ${alt}`}
        onClick={() => setOpen(true)}
      >
        <img src={src} alt={alt} width="1200" height="760" loading="lazy" />
      </button>
      {open ? (
        <div
          className="image-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={alt}
          onClick={() => setOpen(false)}
        >
          <div className="image-lightbox-dialog" onClick={(event) => event.stopPropagation()}>
            <button
              className="image-lightbox-close"
              type="button"
              aria-label="Close image"
              onClick={() => setOpen(false)}
            >
              ×
            </button>
            <img src={src} alt={alt} width="1600" height="1020" />
            {credit ? <small>Image: {credit.replace(/^Photo via /i, "")}</small> : null}
            {sourceUrl ? (
              <a href={sourceUrl} target="_blank" rel="noreferrer">
                View image source →
              </a>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}
