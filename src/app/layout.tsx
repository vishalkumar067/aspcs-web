import type { Metadata, Viewport } from "next";
import { Playfair_Display, DM_Sans, JetBrains_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { FaWhatsapp } from "react-icons/fa";
import "@/styles/globals.css";

// ─── Font Definitions ──────────────────────────────────────────────────────
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
  weight: ["400", "500"],
});

// ─── Metadata ─────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  title: {
    default: "ASPCS — A Premier School of Creative Sciences",
    template: "%s | ASPCS",
  },
  description:
    "ASPCS is a forward-thinking educational institution providing world-class education with a focus on creativity, technology, and holistic development.",
  keywords: [
    "ASPCS",
    "school",
    "education",
    "admissions",
    "creative sciences",
    "primary school",
    "secondary school",
    "quality education",
  ],
  authors: [{ name: "ASPCS" }],
  creator: "ASPCS",

  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: "ASPCS",
    title: "ASPCS — A Premier School of Creative Sciences",
    description:
      "ASPCS is a forward-thinking educational institution providing world-class education.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ASPCS School",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "ASPCS — A Premier School of Creative Sciences",
    description:
      "World-class education with a focus on creativity and holistic development.",
    images: ["/og-image.png"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },

  manifest: "/manifest.json",

  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-32x32.png", sizes: "32x32" },
    ],
    apple: [{ url: "/apple-touch-icon.png" }],
    shortcut: [{ url: "/favicon-16x16.png" }],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAF7F0" },
    { media: "(prefers-color-scheme: dark)", color: "#0B1B3E" },
  ],
  width: "device-width",
  initialScale: 1,
};

// ─── Root Layout ───────────────────────────────────────────────────────────
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${playfair.variable} ${dmSans.variable} ${jetbrains.variable}`}
    >
      <body className="font-body antialiased">
        {children}

        {/* ─── WhatsApp Floating Button ───────────────────────────── */}
        <a
          href="https://wa.me/919102997549?text=Hello%20ASPCS,%20I%20want%20more%20information%20about%20admissions."
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-2xl transition-all duration-300 animate-pulse"
        >
          <FaWhatsapp size={32} />
        </a>

        {/* ─── Toast Notifications ───────────────────────────────── */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "var(--brand-navy)",
              color: "#FAF7F0",
              border: "1px solid rgba(201,168,76,0.3)",
              borderRadius: "12px",
              fontFamily: "var(--font-dm-sans)",
            },
            success: {
              iconTheme: {
                primary: "#C9A84C",
                secondary: "#0B1B3E",
              },
            },
          }}
        />
      </body>
    </html>
  );
}