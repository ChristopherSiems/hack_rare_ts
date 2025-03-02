import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientLayout from "./clientlayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Define viewport configuration separately
const viewportConfig = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
}

// Metadata with properly structured viewport
export const metadata: Metadata = {
  title: "LabBrats",
  description: "Interactive lab experience platform",
  // Next.js will automatically move this to the proper export when building
  viewport: viewportConfig,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}