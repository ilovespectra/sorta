import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Home from "./pages/page";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sorta - Smart Terminal-Based File Organizer",
  description: "Powerful terminal-based file organization tool with intelligent duplicate detection, automatic sorting by type and date, and SHA-256 hashing. Organize thousands of files in minutes.",
  keywords: ["file organizer", "terminal", "CLI", "duplicate detection", "file management", "SHA-256", "TypeScript"],
  authors: [{ name: "ilovespectra" }],
  openGraph: {
    title: "Sorta - Smart Terminal-Based File Organizer",
    description: "Organize thousands of files in minutes with intelligent duplicate detection and automatic sorting",
    type: "website",
  },
};

export default function RootLayout() {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Home />
      </body>
    </html>
  );
}
