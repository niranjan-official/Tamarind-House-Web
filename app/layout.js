import { Josefin_Sans} from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner"

const poppins = Josefin_Sans({
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
        <Toaster />
    </html>
  );
}