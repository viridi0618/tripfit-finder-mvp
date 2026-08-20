"use client";

import React from "react";

type AffiliateTrackingProps = {
  href: string;
  className?: string;
  partner?: string;
  product: "flight" | "hotel";
  destination: string;
  origin?: string | null;
  passport?: string | null;
  children: React.ReactNode;
};

export function AffiliateClickLink({
  href,
  className,
  partner = "trip.com",
  product,
  destination,
  origin,
  passport,
  children,
}: AffiliateTrackingProps) {
  const handleClick = () => {
    if (typeof window !== "undefined") {
      const globalGtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
      if (typeof globalGtag === "function") {
        try {
          globalGtag("event", "affiliate_click", {
            partner,
            product,
            destination,
            origin: origin || "unknown",
            passport: passport || "unknown",
            outbound_url: href,
          });
        } catch (err) {
          console.warn("GA4 affiliate_click event tracking failed:", err);
        }
      }
    }
  };

  return (
    <a
      href={href}
      className={className}
      rel="nofollow sponsored noopener noreferrer"
      target="_blank"
      onClick={handleClick}
    >
      {children}
    </a>
  );
}
