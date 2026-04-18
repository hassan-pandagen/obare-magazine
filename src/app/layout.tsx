import type { Metadata } from "next";
import { Poppins, Montserrat, Archivo } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import GSAPProvider from "@/providers/GSAPProvider";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
  variable: "--font-poppins-var",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-montserrat-var",
  display: "swap",
});

const archivo = Archivo({
  subsets: ["latin"],
  weight: "variable",
  variable: "--font-archivo-var",
  display: "swap",
  axes: ["wdth"],
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${montserrat.variable} ${archivo.variable}`}
    >
      <head>
        <link
          rel="preload"
          as="image"
          href="/images/hero-bg.webp"
          fetchPriority="high"
        />
        <link
          rel="preload"
          as="image"
          href="/images/red-accent.webp"
          fetchPriority="high"
        />
      </head>
      <body>
        <GSAPProvider>{children}</GSAPProvider>
      </body>
    </html>
  );
}
