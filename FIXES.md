# Bug Fixes - ProcessX

## Issue #1: Infinite Redirect Loop on /onboarding/company

### Problem
After user registration and login, the `/onboarding/company` page was stuck in an infinite reload loop, making it impossible to set up the company profile.

**Symptoms:**
```
GET /onboarding/company 200 in 500ms
GET /onboarding/company 200 in 450ms
GET /onboarding/company 200 in 480ms
... (infinite loop)
```

### Root Cause
The onboarding page was located at:
```
src/app/(dashboard)/onboarding/company/page.tsx
```

This meant it was using the `(dashboard)` layout which includes this logic:

```typescript
// src/app/(dashboard)/layout.tsx
const membership = await prisma.companyMember.findFirst({
  where: { user_id: session.user.id, is_active: true },
})

if (!membership) {
  redirect('/onboarding/company')  // ← Redirect to onboarding
}
```

**The Loop:**
1. User has no company yet
2. Dashboard layout checks for company membership
3. No membership found → redirects to `/onboarding/company`
4. `/onboarding/company` uses dashboard layout
5. Go to step 2 → infinite loop!

### Solution
Moved the onboarding page **outside** the dashboard route group:

**Before:**
```
src/app/(dashboard)/onboarding/company/page.tsx  ← Uses dashboard layout
```

**After:**
```
src/app/(onboarding)/company/page.tsx  ← Has its own layout (or no layout)
```

### Files Changed
1. **Moved:** `src/app/(dashboard)/onboarding/company/page.tsx`
   → `src/app/(onboarding)/company/page.tsx`

2. **Middleware:** Still protects `/onboarding/:path*` (requires authentication)

### How It Works Now
1. ✅ User registers → auto login
2. ✅ Redirect to `/onboarding/company`
3. ✅ Page loads WITHOUT dashboard layout
4. ✅ No company check → no redirect
5. ✅ User fills company form
6. ✅ Form submits → company created
7. ✅ Redirect to `/dashboard`
8. ✅ Dashboard layout checks company → found!
9. ✅ Dashboard loads successfully

### Route Structure

```
src/app/
├── (auth)/              # Login, Register (public)
│   ├── login/
│   └── register/
├── (onboarding)/        # First-time setup (protected, no company required)
│   └── company/
├── (dashboard)/         # Main app (protected, company required)
│   ├── dashboard/
│   ├── expenses/
│   ├── reports/
│   └── settings/
└── (public)/            # Public pages (calculators)
    └── calculators/
```

### Testing Checklist
- [x] User can register
- [x] User auto-logs in after registration
- [x] User redirects to onboarding
- [x] Onboarding page loads (no loop)
- [ ] User can submit company form
- [ ] User redirects to dashboard after company setup
- [ ] Dashboard loads with company data

---

## Issue #2: NextAuth v5 API Compatibility

**Problem:** Build errors due to NextAuth v4 API usage
**Solution:** Migrated entire app to NextAuth v5 API
**Details:** See `NEXTAUTH-V5-MIGRATION.md`

---

## Status

✅ **Fixed:** Infinite redirect loop
✅ **Fixed:** NextAuth v5 compatibility
🟡 **Pending:** Full user flow testing (onboarding form submission)

---

**Date:** 2026-02-16
**Version:** Phase 1 Complete
