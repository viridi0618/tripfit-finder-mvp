import type { Metadata } from "next";
import { Footer, Header } from "./components/SiteChrome";
import { siteUrl } from "./lib/site";
import "./globals.css";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "G-64B0MKGNQV";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Random Vacation Generator by Passport & Budget | WhereAtlas",
    template: "%s | WhereAtlas",
  },
  description:
    "A lightweight travel recommendation tool for passport, departure city, total budget, and trip duration feasibility.",
  openGraph: {
    title: "WhereAtlas | Find Trips That Fit Your Passport & Budget",
    description:
      "A vacation generator and travel decision tool that finds destinations you can realistically visit based on passport, departure city, total budget, and trip duration.",
    siteName: "WhereAtlas",
    url: siteUrl,
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "WhereAtlas | Find Trips That Fit Your Passport & Budget",
    description:
      "A vacation generator and travel decision tool that finds destinations you can realistically visit based on passport, departure city, total budget, and trip duration.",
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
      <head>
        <script
          async
          src="https://www.googletagmanager.com/gtm.js?id=GTM-NZCC9C5Z"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}');`,
          }}
        />
      </head>
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
