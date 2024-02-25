import { Poppins } from "next/font/google";
import "./globals.css";
import Head from "next/head";

const poppins = Poppins({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
})

export const metadata = {
  title: "Tamarind House",
  description: "where your hunger ends !!",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Tamarind House",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
        <body className={poppins.className}>{children}</body>
    </html>
  );
}