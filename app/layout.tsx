import type { Metadata } from "next";
import Script from "next/script";
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
        {/* Google Analytics 4 */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}');`}
        </Script>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
