'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

const registerSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

type RegisterFormData = z.infer<typeof registerSchema>

export default function RegisterForm() {
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsLoading(true)
      setError('')

      // Register user
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          password: data.password,
        }),
      })

      const responseData = await res.json()

      if (!res.ok) {
        throw new Error(responseData.error || 'Registration failed')
      }

      // Auto sign in after registration
      const signInResult = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (signInResult?.error) {
        setError('Account created but login failed. Please try logging in.')
        return
      }

      router.push('/onboarding/company')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {error && (
          <div className="bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-xl text-sm flex items-start gap-2">
            <svg className="w-5 h-5 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <Input
            {...register('firstName')}
            type="text"
            label="First Name"
            placeholder="John"
            autoComplete="given-name"
            error={errors.firstName?.message}
            disabled={isLoading}
          />

          <Input
            {...register('lastName')}
            type="text"
            label="Last Name"
            placeholder="Doe"
            autoComplete="family-name"
            error={errors.lastName?.message}
            disabled={isLoading}
          />
        </div>

        <Input
          {...register('email')}
          type="email"
          label="Email"
          placeholder="name@example.com"
          autoComplete="email"
          error={errors.email?.message}
          disabled={isLoading}
        />

        <Input
          {...register('password')}
          type="password"
          label="Password"
          placeholder="At least 8 characters"
          autoComplete="new-password"
          error={errors.password?.message}
          disabled={isLoading}
        />

        <Input
          {...register('confirmPassword')}
          type="password"
          label="Confirm Password"
          placeholder="Re-enter your password"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          disabled={isLoading}
        />

        <Button
          type="submit"
          fullWidth
          isLoading={isLoading}
          disabled={isLoading}
          size="lg"
        >
          Create account
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-gray-500">
        Already have an account?{' '}
        <Link href="/login" className="text-[#007AFF] hover:text-[#0051D5] font-medium transition-colors">
          Sign in
        </Link>
      </p>

      <p className="mt-6 text-center text-xs text-gray-400">
        By creating an account, you agree to our{' '}
        <Link href="/terms" className="text-gray-500 hover:text-gray-700 transition-colors">
          Terms of Service
        </Link>
        {' '}and{' '}
        <Link href="/privacy" className="text-gray-500 hover:text-gray-700 transition-colors">
          Privacy Policy
        </Link>
      </p>
    </div>
  )
}
