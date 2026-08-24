export type DestinationDecision = {
  bestFor: string[];
  notIdealFor: string[];
  budgetLevel: string;
};

// Editorial decision signals live outside the page template so they can be
// expanded without duplicating destination-page markup.
export const destinationDecisions: Record<string, DestinationDecision> = {
  tokyo: {
    bestFor: ["First-time Japan travelers", "Food and culture trips", "Car-free city breaks"],
    notIdealFor: ["Resort or beach-first vacations", "Travelers who dislike dense, high-energy cities"],
    budgetLevel: "Moderate to higher-cost city break",
  },
  seoul: {
    bestFor: ["Food and shopping travelers", "First-time South Korea trips", "Short city breaks"],
    notIdealFor: ["Travelers looking for a slow resort stay", "Trips that depend on easy walking everywhere"],
    budgetLevel: "Moderate city break",
  },
  bangkok: {
    bestFor: ["Street-food travelers", "Culture and nightlife trips", "Value-conscious city breaks"],
    notIdealFor: ["Travelers sensitive to heat, traffic, or busy streets", "Quiet countryside escapes"],
    budgetLevel: "Value to moderate city break",
  },
  singapore: {
    bestFor: ["First-time Southeast Asia stopovers", "Food, design, and efficient city trips", "Families wanting easy logistics"],
    notIdealFor: ["Ultra-budget travelers", "Travelers seeking a rural experience"],
    budgetLevel: "Higher-cost city break",
  },
  bali: {
    bestFor: ["Beach and nature travelers", "Flexible multi-base trips", "Food, culture, and downtime"],
    notIdealFor: ["Visitors who want one compact walkable city", "Trips with no room for traffic or transfer time"],
    budgetLevel: "Value to moderate island trip",
  },
  paris: {
    bestFor: ["First-time Europe travelers", "Art, food, and neighborhood walks", "Short culture-focused breaks"],
    notIdealFor: ["Resort-first vacations", "Travelers needing a consistently low-cost major capital"],
    budgetLevel: "Higher-cost city break",
  },
};
