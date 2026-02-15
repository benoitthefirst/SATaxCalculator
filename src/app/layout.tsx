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
  metadataBase: new URL('https://taxcalculator.theprocessenterprise.com'),
  title: {
    default: "South African Tax Calculator 2025/26 | Free SARS Tax Calculator",
    template: "%s | The Process Enterprise"
  },
  description: "Free South African tax calculator for 2025/26 tax year. Calculate SARS income tax for salaried employees & business owners. Includes tax brackets, deductions, rebates & tax-saving strategies.",
  keywords: [
    "South African tax calculator",
    "SARS tax calculator",
    "SA tax calculator 2025",
    "income tax calculator South Africa",
    "tax calculator SA",
    "South Africa tax brackets 2025",
    "SARS income tax",
    "business tax calculator",
    "salary tax calculator",
    "tax deductions South Africa",
    "tax relief South Africa",
    "calculate tax SA",
    "South African Revenue Service",
    "personal income tax calculator",
    "corporate tax calculator",
    "tax savings South Africa"
  ],
  authors: [{ name: "The Process Enterprise" }],
  creator: "The Process Enterprise",
  publisher: "The Process Enterprise",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_ZA',
    url: 'https://taxcalculator.theprocessenterprise.com',
    title: 'South African Tax Calculator 2025/26 | Free SARS Tax Calculator',
    description: 'Calculate your South African income tax instantly. Free tool for salaried employees & business owners. Get accurate SARS tax calculations with deductions & tax-saving tips.',
    siteName: 'SA Tax Calculator',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'South African Tax Calculator - Calculate SARS Income Tax',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'South African Tax Calculator 2025/26 | Free SARS Tax Calculator',
    description: 'Calculate your SA income tax instantly. Free tool with tax brackets, deductions & tax-saving strategies for 2025/26.',
    images: ['/og-image.png'],
    creator: '@TheProcessEnt',
  },
  alternates: {
    canonical: 'https://taxcalculator.theprocessenterprise.com',
  },
  category: 'finance',
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
        {children}
      </body>
    </html>
  );
}
