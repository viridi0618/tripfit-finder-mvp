export default function robots() {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: "https://tripfit-finder.example/sitemap.xml",
  };
}
