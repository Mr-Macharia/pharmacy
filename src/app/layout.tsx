import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Gabriel's Pharmacy - Your Health, Delivered Safely | Umoja, Nairobi",
  description: "Order prescription and OTC medications from licensed pharmacists in Umoja, Nairobi. Fast delivery, 24/7 consultation via WhatsApp. Browse vitamins, supplements, and health essentials.",
  keywords: "pharmacy, medications, Nairobi, Umoja, prescriptions, OTC medicine, vitamins, supplements, health, Kenya",
  authors: [{ name: "Gabriel's Pharmacy" }],
  openGraph: {
    title: "Gabriel's Pharmacy - Your Health, Delivered Safely",
    description: "Your trusted pharmacy in Umoja, Nairobi. Browse medications, consult pharmacists, and get same-day delivery.",
    type: "website",
    locale: "en_KE",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
