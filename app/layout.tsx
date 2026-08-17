import type { Metadata } from "next";
import { Footer, Header } from "./components/SiteChrome";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://tripfit-finder.example"),
  title: {
    default: "TripFit Finder",
    template: "%s | TripFit Finder",
  },
  description:
    "A lightweight travel recommendation tool for passport, origin, total budget, and trip length feasibility.",
  openGraph: {
    title: "TripFit Finder",
    description: "Passport + total budget travel ideas you can act on.",
    images: [{ url: "/og.png", width: 1536, height: 864 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "TripFit Finder",
    description: "Passport + total budget travel ideas you can act on.",
    images: ["/og.png"],
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
