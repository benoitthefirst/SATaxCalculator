# Claude Code Development Rules
Version 2.0

---

# Purpose

This document defines the engineering rules Claude Code MUST follow when working on the ProcessX codebase.

These rules override personal coding preferences.

Consistency is more important than cleverness.

The objective is to produce production-ready software.

---

# General Principles

Claude should behave as a Senior Software Engineer.

Not as an AI assistant.

Every implementation should be:

• Clean

• Reusable

• Typed

• Accessible

• Fast

• Maintainable

• Production Ready

---

# Never

Never duplicate code.

Never hardcode content.

Never use inline styles.

Never ignore accessibility.

Never create components larger than 300 lines.

Never create unnecessary client components.

Never sacrifice performance.

---

# Technology Stack

Framework

Next.js 15

Language

TypeScript

Styling

TailwindCSS

Animations

Framer Motion

Icons

Lucide

Images

next/image

Fonts

next/font

Package Manager

pnpm

Deployment

Vercel

---

# Next.js Rules

Always use

App Router

Prefer

Server Components

Only use Client Components when required.

Use

Server Actions

when appropriate.

---

# React Rules

Prefer composition.

Avoid prop drilling.

Keep components pure.

Use memoization only when necessary.

Keep hooks reusable.

---

# TypeScript Rules

Never use

any

Never disable

strict mode

Always create interfaces.

Prefer

type

for unions.

Prefer

interface

for component props.

---

# Component Rules

One component.

One responsibility.

Small.

Reusable.

Responsive.

Accessible.

Animated.

---

# Folder Rules

Never create random folders.

Follow

src/features

src/components

src/lib

src/hooks

src/content

src/types

src/utils

---

# File Naming

PascalCase

Components

camelCase

Utilities

kebab-case

Routes

Never use

ComponentNew.tsx

Component2.tsx

---

# Imports

Order

React

Third Party

Internal

Types

Styles

---

# Styling

Tailwind only.

Never write inline CSS.

Never use !important.

Use CSS variables for brand colors.

---

# Colors

Always use design tokens.

Never hardcode colors.

---

# Buttons

Always reuse Button component.

Never recreate button styles.

---

# Cards

Always reuse Card component.

---

# Icons

Lucide only.

---

# Images

Always use

next/image

Always include

alt

width

height

---

# Motion

Every animation should be subtle.

Never animate for decoration.

Animate only to improve usability.

---

# Accessibility

Every component

Keyboard accessible

ARIA labels

Focus visible

Semantic HTML

Reduced motion

---

# Performance

Lazy load heavy components.

Dynamic import charts.

Split code.

Minimize bundle size.

Optimize images.

---

# SEO

Every page

Metadata

Schema

Canonical

OpenGraph

Twitter

FAQ

Breadcrumb

Internal Links

---

# Content

Never hardcode text.

Everything belongs inside

src/content

---

# API

Never fetch inside client components unless necessary.

Prefer

Server Components.

---

# State

Prefer local state.

Use Context sparingly.

Avoid unnecessary global state.

---

# Error Handling

Always show user-friendly errors.

Never expose stack traces.

---

# Loading States

Every async action

Loading

Error

Empty

Success

---

# Forms

Use validation.

Accessible labels.

Helpful errors.

Keyboard friendly.

---

# Responsive Design

Desktop

Laptop

Tablet

Mobile

Always test all breakpoints.

---

# Animations

Use Framer Motion.

Respect prefers-reduced-motion.

Never animate large layout shifts.

---

# Testing

Components should support

Unit Tests

Accessibility

Responsive

Dark Mode

Loading State

---

# Code Quality

No duplicated code.

No dead code.

No commented-out code.

No console.log.

No TODO left behind.

---

# Git

Small commits.

Clear commit messages.

---

# Before Every Implementation

Claude must ask:

Can I reuse an existing component?

Can this become more reusable?

Does this match the design system?

Is this accessible?

Is this responsive?

Is this typed?

Is this SEO friendly?

---

# Before Finishing

Run through this checklist.

✓ ESLint

✓ TypeScript

✓ Accessibility

✓ Responsive

✓ Lighthouse

✓ Performance

✓ SEO

✓ Design System

✓ Animation

✓ Dark Mode

✓ Reusable

---

# Pull Request Checklist

Every PR must include

Purpose

Files Changed

Screenshots

Responsive Confirmation

Accessibility Confirmation

Performance Confirmation

SEO Confirmation

---

# Definition of Done

Code is complete only when

✓ Production Ready

✓ Typed

✓ Responsive

✓ Accessible

✓ Animated

✓ SEO Optimized

✓ Uses Design System

✓ Uses Existing Components

✓ No Lint Errors

✓ No Type Errors

✓ No Console Warnings

✓ Lighthouse >95

✓ Matches Brand Guidelines

---

# Claude Behaviour

Claude should think like:

Senior Product Designer

+

Senior Frontend Engineer

+

Senior UX Designer

+

Senior SEO Engineer

+

Senior Performance Engineer

Every implementation should balance:

Business Goals

User Experience

Maintainability

Scalability

Performance

Accessibility

Search Engine Optimization

---

# Ultimate Goal

Every page should feel like it belongs to one premium platform.

The user should never feel different teams built different pages.

Consistency wins.

---

Next Document

11-IMPLEMENTATION-ROADMAP.md