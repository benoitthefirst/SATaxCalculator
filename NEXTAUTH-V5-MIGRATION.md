# NextAuth v5 Migration Complete

## Changes Made

NextAuth.js v5 (beta.30) has a different API than v4. All files have been updated to use the new API.

### 1. Auth Configuration (`src/lib/auth.ts`)

**Before:**
```typescript
import { NextAuthOptions } from "next-auth"

export const authOptions: NextAuthOptions = {
  // config
}
```

**After:**
```typescript
import NextAuth from "next-auth"

export const { handlers, signIn, signOut, auth } = NextAuth({
  // config
})
```

**Key Changes:**
- Removed `NextAuthOptions` type
- Export `auth()` function instead of `authOptions`
- Export `handlers` for API routes
- PrismaAdapter works without casting

---

### 2. API Route Handler (`src/app/api/auth/[...nextauth]/route.ts`)

**Before:**
```typescript
import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth"

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
```

**After:**
```typescript
import { handlers } from "@/lib/auth"

export const { GET, POST } = handlers
```

---

### 3. Server Components (All Pages)

**Before:**
```typescript
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const session = await getServerSession(authOptions)
```

**After:**
```typescript
import { auth } from '@/lib/auth'

const session = await auth()
```

**Files Updated:**
- `src/app/page.tsx`
- `src/app/(dashboard)/layout.tsx`
- `src/app/(dashboard)/dashboard/page.tsx`
- `src/app/(dashboard)/onboarding/company/page.tsx`
- `src/app/(dashboard)/settings/page.tsx`
- `src/app/api/companies/route.ts`

---

### 4. Middleware (`middleware.ts`)

**Before:**
```typescript
import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
)
```

**After:**
```typescript
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  const isAuth = !!token
  // Custom logic for redirects
}
```

**Improvements:**
- More control over middleware logic
- Handles auth pages (redirect authenticated users away)
- Preserves intended destination with `from` parameter
- Better TypeScript support

---

### 5. Client Components (No Changes Needed)

Client-side usage remains the same:

```typescript
import { signIn, signOut } from 'next-auth/react'

// Usage is identical
await signIn('credentials', { ... })
signOut({ callbackUrl: '/login' })
```

**Files (No changes needed):**
- `src/components/forms/LoginForm.tsx`
- `src/components/forms/RegisterForm.tsx`
- `src/components/layout/DashboardNav.tsx`

---

## Session Type (No Changes)

The session type definitions in `src/types/next-auth.d.ts` remain the same:

```typescript
declare module "next-auth" {
  interface Session {
    user: {
      id: string
    } & DefaultSession["user"]
  }
}
```

---

## Environment Variables (No Changes)

```env
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"
```

---

## Benefits of NextAuth v5

1. **Simpler API**: `auth()` instead of `getServerSession(authOptions)`
2. **Better TypeScript**: Full type inference
3. **More Control**: Custom middleware logic
4. **Edge Runtime**: Better performance
5. **Consistent**: Same pattern for all server components

---

## Testing Checklist

- [x] Auth configuration exports correct functions
- [x] API route handlers work
- [x] Server components can access session
- [x] Middleware protects routes
- [x] Client components can sign in/out
- [x] TypeScript types are correct

---

## Common Issues & Solutions

### Issue: "Export doesn't exist"
**Solution**: Make sure you're importing from the right place:
- Server: `import { auth } from '@/lib/auth'`
- Client: `import { signIn, signOut } from 'next-auth/react'`
- Middleware: `import { getToken } from 'next-auth/jwt'`

### Issue: Middleware not working
**Solution**: Ensure `NEXTAUTH_SECRET` is in `.env.local`

### Issue: Session is null
**Solution**: Check that:
1. User is signed in via `/login`
2. JWT callback returns user data
3. Session callback adds user.id

---

## Migration Summary

✅ **Completed:**
- Updated auth configuration to NextAuth v5 API
- Migrated all server components from `getServerSession` to `auth()`
- Rewrote middleware using `getToken` for better control
- Updated API route handlers to use `handlers`
- Verified client components work unchanged

✅ **Build Errors Fixed:**
- "Export withAuth doesn't exist"
- "Export getServerSession doesn't exist"

✅ **Ready for Production**

---

**Date**: 2026-02-16
**NextAuth Version**: 5.0.0-beta.30
**Next.js Version**: 16.1.6
