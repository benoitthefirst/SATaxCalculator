# ProcessX Component Library
Version 2.0

---

# Purpose

Every UI component in ProcessX must be:

- Reusable
- Accessible
- Responsive
- Typed
- Animated
- Consistent

Never build duplicate components.

If a component already exists, extend it instead.

---

# Technology

Framework

Next.js 15

Language

TypeScript

Styling

TailwindCSS

Animation

Framer Motion

Icons

Lucide React

Images

next/image

Class Utility

clsx + tailwind-merge

---

# Component Principles

Every component must:

✓ Single Responsibility

✓ Reusable

✓ Small

✓ Easy to understand

✓ Strongly typed

✓ Accessible

✓ Responsive

---

# Folder Structure

src/

components/

ui/

marketing/

dashboard/

layout/

forms/

tables/

charts/

animations/

common/

---

# UI Components

These components are generic.

They should NEVER contain business logic.

Button

Card

Badge

Avatar

Tooltip

Dialog

Modal

Drawer

Accordion

Tabs

Input

Textarea

Checkbox

Radio

Switch

Progress

Skeleton

Spinner

Container

Section

Heading

Text

Divider

Alert

Toast

Pagination

Breadcrumb

Table

Stat

MetricCard

ChartCard

Logo

Icon

---

# Marketing Components

These are landing-page specific.

Hero

HeroContent

HeroButtons

HeroDashboard

HeroStats

Navbar

Footer

FeatureGrid

FeatureCard

AIProcessing

DashboardPreview

Comparison

TestimonialGrid

Pricing

FAQ

CTA

Logos

VideoSection

IndustryGrid

BlogGrid

CalculatorCTA

Newsletter

---

# Dashboard Components

DashboardHeader

Sidebar

Topbar

MetricCard

AIInsights

QuickActions

RevenueChart

ExpenseChart

CashFlow

Documents

RecentActivity

Notifications

BusinessSelector

TaxSummary

ExpenseCategories

AIProcessingQueue

---

# Form Components

TextField

EmailField

PasswordField

SearchField

CurrencyField

DatePicker

Select

Combobox

Dropzone

OTPInput

---

# Common Components

EmptyState

ErrorState

LoadingState

NoResults

SectionHeader

StatusBadge

PageTitle

---

# Component Rules

Every component

Must have Props interface

Must support dark mode

Must support loading state

Must support disabled state

Must support responsive layouts

Must use semantic HTML

---

# Example

Button

Props

variant

size

loading

disabled

iconLeft

iconRight

children

onClick

type

fullWidth

---

Variants

Primary

Secondary

Outline

Ghost

Danger

Success

Link

---

Sizes

sm

md

lg

xl

---

# Card

Props

title

description

icon

footer

badge

hover

shadow

padding

children

---

# Section Component

Purpose

Standardize spacing.

Props

background

padding

container

className

children

---

Example

<Section background="dark">

---

# Container

Purpose

Consistent width.

Max Width

1440px

---

# Heading

Props

eyebrow

title

description

align

size

---

# Metric Card

Props

title

value

change

trend

icon

sparkline

---

# Feature Card

Props

icon

title

description

badge

link

animation

---

# Pricing Card

Props

title

price

description

features

popular

button

---

# FAQ Item

Props

question

answer

defaultOpen

---

# Blog Card

Props

image

title

excerpt

category

author

publishedAt

slug

---

# Dashboard Preview

Props

image

callouts

glow

animation

---

# AI Processing Component

Props

document

steps

confidence

animation

---

# Motion Rules

Every interactive component should animate.

Buttons

scale

Cards

lift

Images

fade

FAQ

accordion

Charts

count

Sidebar

slide

Hero

float

---

# Component Naming

Good

FeatureCard.tsx

HeroDashboard.tsx

RevenueChart.tsx

Bad

card2.tsx

feature_new.tsx

component.tsx

---

# File Size Rules

Ideal

150–250 lines

Maximum

300 lines

Split larger components.

---

# Hooks

Reusable hooks

useScrollReveal

useCounter

useMediaQuery

useIntersection

useCopy

useLocalStorage

useTheme

---

# Content

Never hardcode.

All marketing copy belongs in

src/content/

home.ts

pricing.ts

features.ts

faq.ts

navigation.ts

seo.ts

---

# Styling Rules

No inline styles.

Use Tailwind utilities.

Use CSS variables for brand colors.

Avoid deeply nested class names.

---

# Accessibility

Every component

Keyboard accessible

ARIA labels

Visible focus

Semantic HTML

Screen reader friendly

Reduced motion support

---

# Testing

Every component should be testable.

Unit tests

Accessibility

Responsive

Dark mode

Loading state

---

# Claude Code Instructions

Before creating a component:

1. Check if one already exists.
2. Extend instead of duplicating.
3. Keep business logic outside UI.
4. Use composition over inheritance.
5. Follow naming conventions.
6. Add TypeScript interfaces.
7. Support animation.
8. Support accessibility.
9. Support responsive layouts.
10. Keep components reusable.

---

# Definition of Done

A component is complete only if:

✓ Responsive

✓ Accessible

✓ Animated

✓ Typed

✓ Reusable

✓ Uses design tokens

✓ Matches brand guidelines

✓ Passes linting

✓ Passes TypeScript

✓ Production ready

---

Next Document

09-TECHNICAL-SEO.md