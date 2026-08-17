import { destinations } from "./lib/data";

export default function sitemap() {
  const base = "https://tripfit-finder.example";
  const staticRoutes = [
    "",
    "/quiz",
    "/destinations",
    "/visa-free-countries/uk-passport",
    "/visa-free-countries/indian-passport",
    "/methodology",
    "/affiliate-disclosure",
  ];

  return [
    ...staticRoutes.map((route) => ({ url: `${base}${route}` })),
    ...destinations.map((destination) => ({
      url: `${base}/destinations/${destination.id}`,
    })),
  ];
}
