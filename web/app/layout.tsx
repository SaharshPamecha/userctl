import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "userctl — Linux User & Service Account Management Toolkit",
  description:
    "Audit, provision, and restrict Linux service accounts with a single CLI. Open-source toolkit for DevOps engineers to enforce least-privilege shell policies at scale.",
  keywords: [
    "Linux",
    "DevOps",
    "service accounts",
    "user management",
    "shell restrictor",
    "sysadmin",
    "security",
    "compliance",
    "open source",
  ],
  authors: [{ name: "Saharsh Pamecha" }],
  openGraph: {
    title: "userctl — Linux User & Service Account Management Toolkit",
    description:
      "Audit, provision, and restrict Linux service accounts with a single CLI.",
    type: "website",
  },
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
        <div className="noise-overlay" />
        {children}
      </body>
    </html>
  );
}
