import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { Analytics } from "@vercel/analytics/react"
import "./globals.css";

const roboto = Roboto({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kerajaan Keramik",
  description: "Toko keramik dan granit samarinda",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${roboto.className} antialiased bg-blue-50`}
      >
        {children}
      </body>
      <Analytics />
    </html>
  );
}
