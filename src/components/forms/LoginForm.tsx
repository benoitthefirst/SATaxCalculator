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

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginForm() {
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true)
      setError('')

      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (result?.error) {
        setError('The email or password you entered is incorrect')
        return
      }

      router.push('/dashboard')
      router.refresh()
    } catch (err: any) {
      setError('Something went wrong. Please try again.')
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
          placeholder="Enter your password"
          autoComplete="current-password"
          error={errors.password?.message}
          disabled={isLoading}
        />

        <Button
          type="submit"
          fullWidth
          isLoading={isLoading}
          disabled={isLoading}
          size="lg"
        >
          Sign in
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-gray-500">
        Don't have an account?{' '}
        <Link href="/register" className="text-[#007AFF] hover:text-[#0051D5] font-medium transition-colors">
          Create account
        </Link>
      </p>
    </div>
  )
}
