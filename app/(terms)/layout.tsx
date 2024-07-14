import React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "../globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Moryeti",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} flex h-screen px-10 items-center justify-center bg-dark-1 text-light-1`}
      >
        {children}
      </body>
    </html>
  );
}
