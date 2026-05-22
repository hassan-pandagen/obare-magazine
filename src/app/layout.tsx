/**
 * OBARE Magazine
 * Built by Panda Code Gen — https://www.pandacodegen.com/
 */

import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Poppins, Montserrat, Archivo, Playfair_Display } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import GSAPProvider from "@/providers/GSAPProvider";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
  variable: "--font-poppins-var",
  display: "swap",
  preload: false,
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-montserrat-var",
  display: "swap",
  preload: false,
});

const archivo = Archivo({
  subsets: ["latin"],
  weight: "variable",
  variable: "--font-archivo-var",
  display: "swap",
  axes: ["wdth"],
  preload: false,
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-playfair-var",
  display: "swap",
  preload: false,
});

// Placeholder for custom fonts — replace src with actual font files when available
// For now, fallback to system fonts via CSS
// const manverse = localFont({
//   src: "./fonts/ManverseNormal.woff2",
//   variable: "--font-manverse-var",
//   display: "swap",
// });
// const greaterTheory = localFont({
//   src: "./fonts/GreaterTheory-Regular.woff2",
//   variable: "--font-greater-var",
//   display: "swap",
// });

export const metadata: Metadata = {
  title: "OBARE Magazine",
  description:
    "OBARE — The magazine that's real. Culture, style, wellness, travel, and movement.",
  keywords: ["magazine", "culture", "style", "wellness", "travel", "OBARE"],
  openGraph: {
    title: "OBARE Magazine",
    description: "The magazine that's real.",
    type: "website",
  },
};

// Without this, mobile browsers fall back to a ~980px desktop emulation
// viewport — the page renders at desktop width, gets shrunk to fit, and the
// user can pinch-zoom out into empty space. Also breaks the mobile-vs-desktop
// breakpoint detection in HomeClient because window.innerWidth reads 980.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${montserrat.variable} ${archivo.variable} ${playfair.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://cdn.sanity.io" crossOrigin="" />
        <link rel="preconnect" href="https://47jnaej0.apicdn.sanity.io" crossOrigin="" />
        <link rel="dns-prefetch" href="https://cdn.sanity.io" />
        <link rel="dns-prefetch" href="https://47jnaej0.apicdn.sanity.io" />
        <link
          rel="preload"
          as="image"
          href="/images/hero-bg-mobile.webp"
          fetchPriority="high"
          media="(max-width: 767px)"
        />
        <link
          rel="preload"
          as="image"
          href="/images/hero-bg.webp"
          fetchPriority="high"
          media="(min-width: 768px)"
        />
        <link
          rel="preload"
          as="image"
          href="/images/red-accent.webp"
          fetchPriority="high"
        />
      </head>
      <body suppressHydrationWarning>
        <GSAPProvider>{children}</GSAPProvider>
        {/* Prevent iOS Safari pinch-zoom — Safari ignores user-scalable=no since iOS 10 */}
        <Script id="ios-gesture-lock" strategy="beforeInteractive">{`
          document.addEventListener('gesturestart',function(e){e.preventDefault();},{passive:false});
          document.addEventListener('gesturechange',function(e){e.preventDefault();},{passive:false});
          document.addEventListener('gestureend',function(e){e.preventDefault();},{passive:false});
        `}</Script>

        {/* Google Analytics — replace G-XXXXXXXXXX with your GA4 Measurement ID */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`} strategy="afterInteractive" />
            <Script id="google-analytics" strategy="afterInteractive">{`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
            `}</Script>
          </>
        )}

        {/* Microsoft Clarity — replace with your Clarity Project ID */}
        {process.env.NEXT_PUBLIC_CLARITY_ID && (
          <Script id="microsoft-clarity" strategy="afterInteractive">{`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${process.env.NEXT_PUBLIC_CLARITY_ID}");
          `}</Script>
        )}
      </body>
    </html>
  );
}
