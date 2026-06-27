import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from '@vercel/analytics/next';
import "./globals.css";
import SessionProvider from "@/components/layout/SessionProvider";
import { Toaster } from "@/components/ui/Toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.processx.co.za'),
  title: {
    default: "ProcessX | Bookkeeping Made Simple, Business Made Easy",
    template: "%s | ProcessX"
  },
  icons: {
    icon: '/processx_logo.webp',
    apple: '/processx_logo.webp',
  },
  description: "Grow your small business with ProcessX. Simple bookkeeping, expense tracking, SARS-compliant tax tools, and free business reports. Start free today.",
  keywords: [
    "South African bookkeeping",
    "small business accounting South Africa",
    "SARS tax calculator",
    "expense tracking app",
    "income management",
    "business bookkeeping software",
    "South African tax compliance",
    "VAT calculator South Africa",
    "vehicle logbook SARS",
    "asset depreciation calculator",
    "profit loss report",
    "tax deductions South Africa",
    "freelancer accounting",
    "SME bookkeeping",
    "ProcessX",
    "business finance tools"
  ],
  authors: [{ name: "ProcessX", url: "https://www.processx.co.za" }],
  creator: "ProcessX",
  publisher: "ProcessX",
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
    url: 'https://www.processx.co.za',
    title: 'ProcessX | Bookkeeping Made Simple, Business Made Easy',
    description: 'Grow your small business with ProcessX. Simple bookkeeping, expense tracking, SARS-compliant tax tools, and free business reports.',
    siteName: 'ProcessX',
    images: [
      {
        url: 'https://www.processx.co.za/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ProcessX - Bookkeeping Made Simple, Business Made Easy',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@ProcessX_ZA',
    creator: '@ProcessX_ZA',
    title: 'ProcessX | Bookkeeping Made Simple, Business Made Easy',
    description: 'Grow your small business with ProcessX. Simple bookkeeping, expense tracking, and SARS-compliant tax tools.',
    images: [
      {
        url: 'https://www.processx.co.za/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ProcessX - Bookkeeping Made Simple, Business Made Easy',
      },
    ],
  },
  alternates: {
    canonical: 'https://www.processx.co.za',
  },
  category: 'finance',
};

// Structured data for organization (enables Google sitelinks)
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "ProcessX",
  "url": "https://www.processx.co.za",
  "logo": "https://www.processx.co.za/ProcessX_Logo_full.webp",
  "description": "Simple bookkeeping and business tools for South African businesses",
  "sameAs": [
    "https://twitter.com/ProcessX_ZA",
    "https://www.linkedin.com/company/processx"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer service",
    "email": "inf@theprocesse.com",
    "availableLanguage": ["English"]
  }
}

// Website structured data with search action
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "ProcessX",
  "url": "https://www.processx.co.za",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://www.processx.co.za/search?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
}

// Software application schema
const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "ProcessX",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Web Browser",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "ZAR"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "ratingCount": "500"
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider>{children}</SessionProvider>
        <Toaster />
        <Analytics />
      </body>
    </html>
  );
}
