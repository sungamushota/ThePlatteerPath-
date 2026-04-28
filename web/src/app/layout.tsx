import type { Metadata } from "next";
import { Fraunces, Outfit } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "The PlatterPath — From Inquiry to Invoice, Effortlessly",
  description:
    "The all-in-one platform for catering operators. One booking link, automatic CRM, professional quotes, and deposit collection.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${outfit.variable} h-full`}
    >
      <body className="grain min-h-full flex flex-col font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
