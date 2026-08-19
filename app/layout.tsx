import type { Metadata } from "next";
import { Footer, Header } from "./components/SiteChrome";
import { siteUrl } from "./lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Random Vacation Generator by Passport & Budget | WhereAtlas",
    template: "%s | WhereAtlas",
  },
  description:
    "A lightweight travel recommendation tool for passport, departure city, total budget, and trip duration feasibility.",
  openGraph: {
    title: "WhereAtlas",
    description: "Passport + total budget travel ideas you can act on.",
    siteName: "WhereAtlas",
  },
  twitter: {
    card: "summary",
    title: "WhereAtlas",
    description: "Passport + total budget travel ideas you can act on.",
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
