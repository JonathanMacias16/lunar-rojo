import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next"
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lunar Rojo",
  description: "El punto que no todos ven. JM",
  metadataBase: new URL("https://lunar-rojo.vercel.app"), // Replace with actual domain if different
  alternates: {
    canonical: "/",
  },
  applicationName: "Lunar Rojo",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Lunar Rojo",
  },
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "Lunar Rojo",
    description: "El punto que no todos ven. JM",
    url: "https://lunar-rojo.vercel.app",
    siteName: "Lunar Rojo",
    images: [
      {
        url: "/logo_completo.jpeg",
        width: 1200,
        height: 630,
        alt: "Lunar Rojo - El punto que no todos ve. JM",
      },
    ],
    locale: "es_MX",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lunar Rojo",
    description: "El punto que no todos ven. JM",
    images: ["/logo_completo.jpeg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
