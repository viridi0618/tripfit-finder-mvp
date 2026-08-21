"use client";

import React from "react";
import { trackEvent } from "../lib/analytics";

type AffiliateTrackingProps = {
  href: string;
  className?: string;
  partner?: string;
  product: "flight" | "hotel";
  destination: string;
  origin?: string | null;
  passport?: string | null;
  pageType?: string;
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
  pageType = "destination_guide",
  children,
}: AffiliateTrackingProps) {
  const handleClick = () => {
    // 1. Fire dedicated funnel event
    if (product === "hotel") {
      trackEvent("click_hotel_cta", {
        destination,
        page_type: pageType,
      });
    } else if (product === "flight") {
      trackEvent("click_flight_cta", {
        origin: origin || "unknown",
        destination,
        page_type: pageType,
      });
    }

    // 2. Fire existing commercial affiliate_click event
    trackEvent("affiliate_click", {
      partner,
      product,
      destination,
      origin: origin || "unknown",
      passport: passport || "unknown",
      outbound_url: href,
    });
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

