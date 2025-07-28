import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClientThemeProvider } from "./ClientThemeProvider";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#667eea",
};

export const metadata: Metadata = {
  title: "Delicious AR Bistro - WebAR Restaurant Menu",
  description:
    "Experience fine dining like never before with our interactive AR menu. View dishes in augmented reality before you order.",
  keywords:
    "restaurant, AR menu, augmented reality, fine dining, WebAR, 3D menu, interactive dining",
  authors: [{ name: "Delicious AR Bistro" }],
  robots: "index, follow",
  openGraph: {
    title: "Delicious AR Bistro - WebAR Restaurant Menu",
    description: "Experience fine dining with our interactive AR menu",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Delicious AR Bistro - WebAR Restaurant Menu",
    description: "Experience fine dining with our interactive AR menu",
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* PWA and Mobile Optimization */}
        <meta name="theme-color" content="#667eea" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="apple-mobile-web-app-title" content="AR Menu" />

        {/* AR.js and A-Frame Preconnect */}
        <link rel="preconnect" href="https://aframe.io" />
        <link rel="preconnect" href="https://cdn.jsdelivr.net" />

        {/* Camera permissions hint */}
        <meta name="permissions" content="camera" />
      </head>
      <body className={inter.className}>
        <ClientThemeProvider>{children}</ClientThemeProvider>
      </body>
    </html>
  );
}
