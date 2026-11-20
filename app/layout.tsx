import type { Metadata } from "next";
import { Archivo, JetBrains_Mono, Instrument_Serif, VT323, Sora } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { Grain } from "@/components/Grain";
import { Starfield } from "@/components/Starfield";
import { CustomCursor } from "@/components/CustomCursor";
import { Navbar } from "@/components/Navbar";
import { Hud } from "@/components/Hud";
import { SmoothScroll } from "@/components/SmoothScroll";
import { SoundEffectsProvider } from "@/components/SoundEffectsProvider";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const vt323 = VT323({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-vt",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://sandeepgoud.dev"),
  title: "Lingala Sandeep Goud — Software Engineer",
  description:
    "Portfolio of Lingala Sandeep Goud, Software Engineer (Integrated M.Tech at VIT-AP). Full-stack web applications, AI integration, and scalable cloud platforms.",
  keywords: [
    "Lingala Sandeep Goud",
    "Sandeep Goud",
    "Software Engineer",
    "VIT-AP",
    "Full-Stack Developer",
    "Cloud Architecture",
    "AI Integration",
    "Gemini API",
    "React.js",
    "Node.js",
    "Express.js",
    "MySQL",
    "MongoDB",
    "Next.js",
    "Python",
    "Java",
  ],
  authors: [{ name: "Lingala Sandeep Goud" }],
  creator: "Lingala Sandeep Goud",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://sandeepgoud.dev",
    title: "Lingala Sandeep Goud — Software Engineer",
    description:
      "Portfolio of Lingala Sandeep Goud, Software Engineer (Integrated M.Tech at VIT-AP). Full-stack web applications, AI integration, and scalable cloud platforms.",
    siteName: "Lingala Sandeep Goud Portfolio",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Lingala Sandeep Goud — Software Engineer Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lingala Sandeep Goud — Software Engineer",
    description:
      "Portfolio of Lingala Sandeep Goud, Software Engineer (Integrated M.Tech at VIT-AP). Full-stack web applications, AI integration, and scalable cloud platforms.",
    creator: "@sandeepgoud",
    images: ["/og.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
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
      className={`dark ${archivo.variable} ${sora.variable} ${jetbrainsMono.variable} ${instrumentSerif.variable} ${vt323.variable}`}
    >
      <body className="bg-black text-white font-sans selection:bg-accent selection:text-black antialiased relative min-h-screen">
        <SoundEffectsProvider>
          <SmoothScroll>
            {/* Subtle Film Grain Overlay */}
            <Grain />

            {/* Calm Ambient Cosmic Starfield */}
            <Starfield />

            {/* Custom Magnetic Cursor */}
            <CustomCursor />

            {/* Fixed Nav Bar */}
            <Navbar />

            {/* Main App Content */}
            <main className="relative z-10">{children}</main>

            {/* Bottom Heads-Up Display (HUD) */}
            <Hud />
          </SmoothScroll>
        </SoundEffectsProvider>

        {/* Vercel Analytics */}
        <Analytics />
      </body>
    </html>
  );
}
