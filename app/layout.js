"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import TopNav from "@/component/nav/TopNav";
import Navbar from "@/component/nav/Navbar";
import { SessionProvider } from "next-auth/react";

import { ToastContainer } from 'react-toastify';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { usePathname } from "next/navigation";
export default function RootLayout({ children }) {

  const pathname = usePathname();
  const isAdminDashboard = pathname === "/dashboard/admin";

  return (
    <html lang="en">
      <SessionProvider>
      <body suppressHydrationWarning 
        className={`${geistSans.variable} ${geistMono.variable}`}
      >

        <ToastContainer />
        
        {
          !isAdminDashboard && (
            <>
               <TopNav />
               <Navbar />
            </>
          )
        }
        
         
          {children}
      </body>
      </SessionProvider>
    </html>
  );
}
