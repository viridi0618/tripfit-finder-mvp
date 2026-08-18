import { destinations } from "./lib/data";
import { siteUrl } from "./lib/site";

export default function sitemap() {
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
    ...staticRoutes.map((route) => ({ url: `${siteUrl}${route}` })),
    ...destinations.map((destination) => ({
      url: `${siteUrl}/destinations/${destination.id}`,
    })),
  ];
}
