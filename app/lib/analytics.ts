/**
 * Unified Google Analytics 4 (gtag) Event Dispatcher
 *
 * Ensures safe client-side execution, error isolation, and consistent event tracking
 * across conversion funnel steps and affiliate links.
 */

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export function trackEvent(
  eventName: string,
  params?: Record<string, unknown>
): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    if (typeof window.gtag === "function") {
      window.gtag("event", eventName, params);
    } else if (Array.isArray(window.dataLayer)) {
      window.dataLayer.push({
        event: eventName,
        ...params,
      });
    }
  } catch (err) {
    // Non-blocking error handling to ensure user interactions never fail
    console.warn(`[GA4] Failed to track event "${eventName}":`, err);
  }
}
