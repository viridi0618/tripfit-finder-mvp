export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  "https://whereatlas.com"
).replace(/\/$/, "");

export function absoluteUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}
