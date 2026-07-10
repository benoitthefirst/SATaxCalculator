# ProcessX Design System
Version 2.0

---

# Overview

The ProcessX Design System defines every reusable UI element used throughout the marketing website.

Goals

• Consistent

• Reusable

• Accessible

• Responsive

• Premium

Every component must follow this document.

---

# Technology

Framework

Next.js 15

Components

React

Styling

TailwindCSS

Animations

Framer Motion

Icons

Lucide React

Images

next/image

---

# Design Tokens

## Container

Max Width

1440px

Content Width

1280px

Reading Width

720px

---

## Border Radius

Small

12px

Medium

16px

Large

20px

XL

28px

Full

9999px

---

## Shadows

Shadow SM

0 8px 24px rgba(15,23,42,.05)

Shadow MD

0 20px 60px rgba(15,23,42,.08)

Shadow LG

0 40px 100px rgba(15,23,42,.12)

Dashboard Glow

0 0 100px rgba(232,255,63,.25)

---

## Borders

Light

1px solid #E2E8F0

Dark

1px solid rgba(255,255,255,.08)

Hero

1px solid rgba(232,255,63,.20)

---

# Spacing

4

8

12

16

20

24

32

40

48

64

80

96

120

160

---

# Section Layout

Each section

Top Padding

120px

Bottom Padding

120px

Container

mx-auto

max-w-[1440px]

Padding X

32px Desktop

24px Tablet

20px Mobile

---

# Typography

Hero

72

Section Heading

56

Section Title

48

Card Title

24

Body

18

Caption

14

Button

16

---

# Buttons

---

## Primary Button

Purpose

Main CTA

Height

56px

Padding

32px

Radius

16px

Background

#E8FF3F

Text

#082E2C

Hover

Lift 3px

Shadow Increase

Scale 1.02

Active

Scale .98

Transition

300ms

Example

Start Free Trial

Book Demo

Go to Dashboard

---

## Secondary Button

Background

Transparent

Border

Dark Border

Text

White

Hover

Dark Surface

---

## Outline Button

White

Border

Grey

Text

Dark

Hover

Background

Light Grey

---

## Ghost Button

No Border

No Background

Hover

Lime Text

---

# Navigation

Height

80px

Sticky

Yes

Blur

20px

Background

rgba(8,46,44,.85)

Border Bottom

rgba(255,255,255,.06)

---

Logo

Left

Navigation

Center

CTA

Right

---

Mobile

Hamburger

Slide Menu

---

# Hero Section

Height

900px

Grid

2 Columns

Gap

96px

Content Width

640px

Right

Dashboard Screenshot

Animation

Fade Up

---

# Statistics Bar

Dark Surface

Icons

Circle Outline

Numbers

Large

Label

Small

Hover

Glow

---

Items

Documents

Speed

Accuracy

Compliance

Hours Saved

---

# Feature Card

Radius

20px

Padding

32px

Shadow

Medium

Border

Light

Hover

TranslateY

-8px

Border Highlight

Lime

Glow

Soft

---

Content

Icon

Title

Description

Optional Badge

---

# Dashboard Preview

Always

Real Screenshot

Never Illustration

Radius

28px

Shadow

Large

Glow

Hero Glow

Hover

Scale

1.01

---

# Dashboard Callout

Floating Card

Radius

20px

Blur Background

Dark Surface

Border

Hero Border

Shadow

Glow

---

Used For

AI Complete

99%

60 Seconds

Uploaded

Processing

---

# AI Processing Timeline

Vertical

Upload

↓

Reading

↓

Extracting

↓

Categorising

↓

Completed

Each step

Animated

---

# Comparison Cards

Manual

Red

ProcessX

Green

Cards

Same Size

Responsive

---

# Pricing Card

Radius

24px

Popular Badge

Lime

Shadow

Large

Hover

Lift

---

# Testimonial Card

Radius

20px

Avatar

Circle

Stars

Yellow

Quote

Body

Company

Small

---

# FAQ

Accordion

Radius

16px

Border

Light

Hover

Background

Light Grey

Animation

Height Auto

---

# Blog Card

Image

16:9

Category

Badge

Title

24

Excerpt

16

Author

Bottom

---

# CTA Banner

Dark Background

Gradient

Headline

48px

Button

Primary

Supporting Text

18px

---

# Footer

Dark

Four Columns

Large Padding

Social Icons

Hover Lime

Copyright

Bottom

---

# Form Elements

Input Height

56px

Radius

16px

Border

Light

Focus

Lime Border

Shadow

None

---

Textarea

Radius

16px

Padding

20px

---

Select

56px

Radius

16px

---

Checkbox

Rounded

Animated

---

Radio

Animated

---

# Icons

Lucide

Stroke Width

2

Primary Size

24

Feature

40

Hero

48

---

# Cards

Default

Background

White

Radius

20

Padding

32

Shadow

Medium

Hover

Lift

---

Dark Card

Background

#0B3734

Border

Dark Border

Text

White

---

# Images

Always

next/image

Formats

WebP

AVIF

PNG

No JPEG unless photography.

---

# Animation Library

Page Load

Fade Up

Hero Image

Float

Cards

Fade + Lift

Dashboard

Scale

Buttons

Scale

Icons

Rotate

Testimonials

Slide

Counters

Count Up

FAQ

Accordion

Navbar

Blur On Scroll

---

# Motion Values

Fast

150ms

Normal

300ms

Slow

600ms

Bezier

easeOut

---

# Mobile Rules

Never reduce spacing below 24px.

Buttons

Full Width

Cards

Single Column

Hero

Stack

Dashboard

Below Text

Typography

Scale Down

---

# Accessibility

Contrast

AA

Focus

Visible

Keyboard

Supported

ARIA

Required

Reduced Motion

Supported

---

# Component Directory

src/components/marketing/

Hero/

Navbar/

Stats/

FeatureCard/

DocumentGrid/

AIWorkflow/

DashboardPreview/

Comparison/

Pricing/

FAQ/

Testimonials/

CTA/

Footer/

Blog/

Common/

Animations/

---

# Naming Convention

Hero.tsx

HeroContent.tsx

HeroDashboard.tsx

HeroStats.tsx

HeroButtons.tsx

Never create files larger than 300 lines.

Split when needed.

---

# Claude Code Rules

Every component must

✓ Be reusable

✓ Use TypeScript

✓ Have Props interface

✓ Be responsive

✓ Support dark mode

✓ Use Tailwind

✓ Use motion

✓ Use semantic HTML

✓ Have no duplicated code

✓ Be accessible

✓ Use next/image

✓ Pass ESLint

✓ Pass TypeScript

✓ Be production ready

---

# Design Quality Checklist

Before shipping any component ask:

Does it feel premium?

Does it match the rest of ProcessX?

Does it improve conversion?

Is it responsive?

Is it animated?

Is it accessible?

Is it reusable?

Would Stripe ship this?

If the answer is no, redesign it.

---

Next Document

04-HOMEPAGE-PRD.md