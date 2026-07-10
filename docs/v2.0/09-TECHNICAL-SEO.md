# ProcessX Technical SEO
Version 2.0

---

# Purpose

This document defines the technical SEO implementation for the entire ProcessX website.

The objective is to ensure every page is:

- Search engine friendly
- Fast
- Accessible
- Shareable
- Indexable
- Structured

The website must be built to achieve:

✓ Lighthouse SEO 100

✓ Core Web Vitals Pass

✓ Fully indexable

✓ Rich Search Results

---

# Framework

Next.js 15

App Router

Metadata API

Server Components

---

# Metadata Strategy

Every public page must export metadata.

Never hardcode metadata directly inside components.

Create reusable helpers.

Example

lib/seo/createMetadata.ts

---

# Metadata Helper

Every page should use

createMetadata()

Example

title

description

canonical

keywords

image

type

---

# Metadata Rules

Homepage

Title

ProcessX | AI Bookkeeping Software for South African Businesses

Length

50-60 characters

---

Description

150-160 characters

Should include

ProcessX

AI

Bookkeeping

South Africa

---

Keywords

Use naturally.

Never keyword stuff.

---

# Open Graph

Every page

og:title

og:description

og:image

og:url

og:type

og:site_name

locale

---

Example Image

1200 × 630

PNG

WebP

---

Twitter

summary_large_image

---

# Canonical URLs

Every page

Must define canonical.

Never allow duplicate canonicals.

Example

https://processx.co.za/pricing

---

# Robots

Index

Follow

Max Snippet

Unlimited

Max Image Preview

Large

---

# robots.txt

Allow

/

Disallow

/dashboard

/admin

/api

/auth

/private

---

# Sitemap

Automatically generated.

Include

Homepage

Landing Pages

Pricing

Blog

Features

Industries

Exclude

Dashboard

Authentication

API

Private Routes

---

# URL Rules

Use lowercase.

Hyphens only.

No underscores.

No query parameters for canonical pages.

Good

/bookkeeping-software

Bad

/BookKeepingSoftware

---

# H1 Rules

One H1 only.

Every page.

Never more than one.

---

# Heading Structure

H1

↓

H2

↓

H3

↓

H4

Never skip heading levels.

---

# Images

Every image

Must include

alt

width

height

loading

decoding

priority (hero only)

---

# Alt Text

Describe the image.

Bad

dashboard

Good

ProcessX AI bookkeeping dashboard showing income, expenses and tax overview

---

# next/image

Always.

Never use img.

---

# Formats

AVIF

↓

WebP

↓

PNG

Never use JPG unless photography.

---

# Compression

Maximum

250 KB

Hero

500 KB

---

# Structured Data

Every page

Must include schema.

---

Homepage

Organization

SoftwareApplication

WebSite

SearchAction

FAQ

---

Blog

Article

BlogPosting

Breadcrumb

Author

---

Pricing

SoftwareApplication

Offer

Organization

---

Landing Pages

Breadcrumb

FAQ

SoftwareApplication

---

# Organization Schema

Name

ProcessX

URL

https://processx.co.za

Logo

/logo.svg

Description

AI bookkeeping software for South African businesses.

Social Links

LinkedIn

YouTube

Facebook

GitHub

---

# Software Schema

Application Category

BusinessApplication

Operating System

Web

Price

Varies

Offers

Free Trial

Description

AI-powered bookkeeping software.

---

# FAQ Schema

Every landing page

Minimum

5 questions

Maximum

12

---

# Breadcrumb Schema

Every page except homepage.

---

# Review Schema

Only use real customer reviews.

Never fabricate.

---

# Search Console

Configure

Google Search Console

Submit

sitemap.xml

Monitor

Coverage

Core Web Vitals

Indexing

Queries

CTR

---

# Bing

Submit sitemap.

Verify ownership.

---

# Indexing Rules

Public Pages

Index

Private Pages

Noindex

Dashboard

Noindex

Authentication

Noindex

---

# Internal Linking

Every page links to

Homepage

Pricing

Features

Related Articles

Contact

CTA

---

# Pagination

Blog

Canonical

Prev

Next

---

# Redirects

Always

301

Never

302

Unless temporary.

---

# HTTPS

Entire website.

HSTS enabled.

---

# Performance

LCP

<2.5 seconds

CLS

<0.1

INP

<200ms

---

# Fonts

Use next/font.

Preload primary font.

Avoid layout shift.

---

# JavaScript

Lazy load heavy components.

Code split where possible.

Avoid unnecessary client components.

---

# CSS

Critical CSS first.

Tailwind only.

No unused CSS.

---

# Images

Lazy load below the fold.

Priority only for hero.

---

# Videos

Lazy load.

Use poster image.

---

# Analytics

Google Analytics 4

Google Tag Manager (optional)

Microsoft Clarity

Google Search Console

---

# Event Tracking

Track

Hero CTA

Pricing CTA

Demo Requests

Signups

FAQ Opens

Calculator Usage

Blog CTA

Footer CTA

---

# Error Pages

404

Custom

Helpful

CTA back to homepage

---

500

Friendly

Retry

Contact Support

---

# Security

HTTPS

Security Headers

Content Security Policy

Referrer Policy

Permissions Policy

X-Frame Options

---

# Accessibility

Every page

AA compliant

Keyboard navigation

ARIA labels

Reduced motion

---

# Lighthouse Goals

Performance

95+

Accessibility

100

SEO

100

Best Practices

100

---

# Claude Code Checklist

Every new page must include

✓ Metadata

✓ Canonical

✓ Open Graph

✓ Twitter

✓ Schema

✓ Breadcrumb

✓ FAQ

✓ Alt Text

✓ Internal Links

✓ One H1

✓ Responsive

✓ Fast Images

✓ Lazy Loading

✓ next/image

✓ next/font

✓ Lighthouse 95+

Never merge a page until every checkbox passes.

---

# Folder Structure

src/lib/seo/

createMetadata.ts

organization.ts

software.ts

breadcrumbs.ts

faq.ts

openGraph.ts

twitter.ts

schema.ts

canonical.ts

robots.ts

sitemap.ts

---

# Definition of Done

A page is SEO complete when

✓ Indexed

✓ Metadata correct

✓ Structured data valid

✓ Lighthouse >95

✓ Passes Rich Results Test

✓ Canonical valid

✓ Mobile friendly

✓ Internal links present

✓ Fast loading

✓ No accessibility issues

---

Next Document

10-IMPLEMENTATION-GUIDE.md