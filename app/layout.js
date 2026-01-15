"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import TopNav from "@/component/nav/TopNav";
import Navbar from "@/component/nav/Navbar";
import { SessionProvider } from "next-auth/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable}`}
      >
        <SessionProvider>
          <TopNav />
          <Navbar />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
