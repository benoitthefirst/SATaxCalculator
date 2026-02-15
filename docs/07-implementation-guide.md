# ProcessX - Implementation Guide

## Phase 1: Setup & Infrastructure (Week 1-2)

### Step 1: Project Restructuring

#### 1.1 Install Dependencies
```bash
# Authentication
pnpm add next-auth@beta @auth/prisma-adapter
pnpm add bcryptjs
pnpm add -D @types/bcryptjs

# Database
pnpm add prisma @prisma/client
pnpm add -D prisma

# Form handling
pnpm add react-hook-form zod @hookform/resolvers

# State management
pnpm add @tanstack/react-query
pnpm add zustand

# File uploads
pnpm add @aws-sdk/client-s3
# OR
pnpm add cloudinary

# Email
pnpm add resend
pnpm add react-email @react-email/components

# UI components
pnpm add @radix-ui/react-dialog @radix-ui/react-dropdown-menu
pnpm add @radix-ui/react-select @radix-ui/react-tabs
pnpm add @radix-ui/react-toast
pnpm add date-fns
pnpm add recharts # for charts

# Utilities
pnpm add clsx tailwind-merge
```

#### 1.2 Initialize Database
```bash
# Initialize Prisma
npx prisma init

# This creates:
# - /prisma/schema.prisma
# - .env with DATABASE_URL
```

#### 1.3 Update Environment Variables
```env
# .env.local
DATABASE_URL="postgresql://..."
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here" # Generate: openssl rand -base64 32

# Email (Resend)
RESEND_API_KEY="re_..."

# File Storage (Choose one)
AWS_S3_BUCKET="your-bucket"
AWS_ACCESS_KEY_ID="..."
AWS_SECRET_ACCESS_KEY="..."

# OR Cloudinary
CLOUDINARY_CLOUD_NAME="..."
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

#### 1.4 Setup Prisma Schema
```prisma
// /prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Copy schema from docs/03-database-schema.md
// Start with users, companies, company_members tables
```

#### 1.5 Create Database
```bash
# Push schema to database
npx prisma db push

# Generate Prisma Client
npx prisma generate

# Open Prisma Studio (visual DB editor)
npx prisma studio
```

---

### Step 2: Project Structure Reorganization

#### 2.1 Create New Folder Structure
```bash
mkdir -p src/app/\(auth\)
mkdir -p src/app/\(dashboard\)
mkdir -p src/app/\(public\)
mkdir -p src/app/api/auth
mkdir -p src/app/api/companies
mkdir -p src/app/api/expenses
mkdir -p src/lib/db
mkdir -p src/lib/auth
mkdir -p src/lib/validations
mkdir -p src/lib/utils
mkdir -p src/components/ui
mkdir -p src/components/forms
mkdir -p src/components/layout
mkdir -p src/components/features/expenses
mkdir -p src/hooks
mkdir -p src/services
```

#### 2.2 Move Existing Tax Calculator
```bash
# Move tax calculator to public section
mkdir -p src/app/\(public\)/calculators
mv src/app/page.tsx src/app/\(public\)/calculators/page.tsx
mv src/components/SalariedTab.tsx src/components/features/calculators/
mv src/components/BusinessTab.tsx src/components/features/calculators/
```

#### 2.3 Create New Homepage
```typescript
// src/app/page.tsx
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export default async function HomePage() {
  const session = await getServerSession(authOptions)

  if (session) {
    redirect('/dashboard')
  } else {
    redirect('/login')
  }
}
```

---

### Step 3: Authentication Setup

#### 3.1 Install NextAuth
```typescript
// src/lib/auth.ts
import { PrismaAdapter } from "@auth/prisma-adapter"
import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/db"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials")
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        })

        if (!user || !user.password_hash) {
          throw new Error("Invalid credentials")
        }

        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.password_hash
        )

        if (!isCorrectPassword) {
          throw new Error("Invalid credentials")
        }

        return {
          id: user.id,
          email: user.email,
          name: `${user.first_name} ${user.last_name}`,
        }
      },
    }),
  ],
  callbacks: {
    async session({ token, session }) {
      if (token) {
        session.user.id = token.id
        session.user.email = token.email
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
  },
}
```

#### 3.2 Create Auth API Route
```typescript
// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth"

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
```

#### 3.3 Create Prisma Client
```typescript
// src/lib/db.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

---

### Step 4: Authentication Pages

#### 4.1 Registration Page
```typescript
// src/app/(auth)/register/page.tsx
import RegisterForm from '@/components/forms/RegisterForm'

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full">
        <h1 className="text-3xl font-bold mb-6">Create your account</h1>
        <RegisterForm />
      </div>
    </div>
  )
}
```

#### 4.2 Registration Form Component
```typescript
// src/components/forms/RegisterForm.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

const registerSchema = z.object({
  firstName: z.string().min(1, 'First name required'),
  lastName: z.string().min(1, 'Last name required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

type RegisterFormData = z.infer<typeof registerSchema>

export default function RegisterForm() {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setLoading(true)
      setError('')

      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Registration failed')
      }

      router.push('/verify-email')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded">{error}</div>
      )}

      <div>
        <label className="block text-sm font-medium mb-1">First Name</label>
        <input
          {...register('firstName')}
          className="w-full px-3 py-2 border rounded"
        />
        {errors.firstName && (
          <p className="text-red-600 text-sm mt-1">{errors.firstName.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Last Name</label>
        <input
          {...register('lastName')}
          className="w-full px-3 py-2 border rounded"
        />
        {errors.lastName && (
          <p className="text-red-600 text-sm mt-1">{errors.lastName.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          {...register('email')}
          type="email"
          className="w-full px-3 py-2 border rounded"
        />
        {errors.email && (
          <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Password</label>
        <input
          {...register('password')}
          type="password"
          className="w-full px-3 py-2 border rounded"
        />
        {errors.password && (
          <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Creating account...' : 'Create account'}
      </button>
    </form>
  )
}
```

#### 4.3 Registration API Route
```typescript
// src/app/api/auth/register/route.ts
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const registerSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { firstName, lastName, email, password } = registerSchema.parse(body)

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      )
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 12)

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password_hash,
        first_name: firstName,
        last_name: lastName,
        email_verified: false, // Will implement email verification later
      },
    })

    // TODO: Send verification email

    return NextResponse.json(
      { message: 'Account created successfully' },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    )
  }
}
```

#### 4.4 Login Page
```typescript
// src/app/(auth)/login/page.tsx
import LoginForm from '@/components/forms/LoginForm'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full">
        <h1 className="text-3xl font-bold mb-6">Sign in to ProcessX</h1>
        <LoginForm />
      </div>
    </div>
  )
}
```

---

### Step 5: Protected Routes & Middleware

#### 5.1 Create Middleware
```typescript
// middleware.ts (root level)
import { withAuth } from "next-auth/middleware"

export default withAuth({
  callbacks: {
    authorized: ({ token }) => !!token,
  },
})

export const config = {
  matcher: ["/dashboard/:path*", "/expenses/:path*", "/api/:path*"],
}
```

---

## Phase 2: Company Setup (Week 3)

### Step 1: Company Onboarding Flow

#### 1.1 Company Setup Page
```typescript
// src/app/(dashboard)/onboarding/company/page.tsx
import CompanySetupForm from '@/components/forms/CompanySetupForm'

export default function CompanySetupPage() {
  return (
    <div className="max-w-2xl mx-auto py-12">
      <h1 className="text-3xl font-bold mb-2">Set up your company</h1>
      <p className="text-gray-600 mb-8">
        Let's get your company profile configured
      </p>
      <CompanySetupForm />
    </div>
  )
}
```

---

## Phase 3: Expense Management (Week 4-6)

### Step 1: Seed Expense Categories
```typescript
// prisma/seed.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const categories = [
    { name: 'Travel & Transportation', color: '#3b82f6', icon: 'car' },
    { name: 'Office Supplies', color: '#8b5cf6', icon: 'package' },
    { name: 'Utilities', color: '#ef4444', icon: 'zap' },
    // ... add all categories
  ]

  for (const category of categories) {
    await prisma.expense_categories.create({
      data: {
        ...category,
        is_system: true,
        is_active: true,
      },
    })
  }
}

main()
```

---

## Next Steps

After Phase 1-3 (MVP):
1. Team management features
2. Reporting dashboard
3. Income tracking
4. Invoicing system
5. Advanced features

---

## Testing Strategy

### Unit Tests
```typescript
// src/lib/__tests__/auth.test.ts
describe('Authentication', () => {
  it('should hash passwords correctly', async () => {
    // test
  })
})
```

### Integration Tests
```typescript
// src/app/api/__tests__/register.test.ts
describe('POST /api/auth/register', () => {
  it('should create a new user', async () => {
    // test
  })
})
```

### E2E Tests (Playwright)
```typescript
// e2e/auth.spec.ts
test('user can register and login', async ({ page }) => {
  // test flow
})
```

---

## Deployment Checklist

- [ ] Environment variables set in production
- [ ] Database migrations run
- [ ] Email service configured
- [ ] File storage configured
- [ ] Domain configured
- [ ] SSL certificate active
- [ ] Error tracking (Sentry) configured
- [ ] Analytics configured
- [ ] Backup strategy in place
