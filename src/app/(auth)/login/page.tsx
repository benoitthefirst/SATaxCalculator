import LoginForm from '@/components/forms/LoginForm'
import Link from 'next/link'
import Image from 'next/image'

export const metadata = {
  title: 'Sign in - ProcessX',
  description: 'Sign in to your ProcessX account',
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-[400px]">
        {/* Logo */}
        <div className="text-center mb-12">
          <div className="inline-block mb-6">
            <Image
              src="/ProcessX_Logo_full.webp"
              alt="ProcessX"
              width={180}
              height={46}
              className="h-12 w-auto"
              priority
            />
          </div>
          <h1 className="text-3xl font-semibold text-gray-900 mb-2 tracking-tight">Welcome back</h1>
          <p className="text-base text-gray-500">Sign in to continue to ProcessX</p>
        </div>

        {/* Login Form */}
        <div className="space-y-6">
          <LoginForm />

          {/* Divider */}
          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-400">or</span>
            </div>
          </div>

          {/* Try Calculator Link */}
          <Link
            href="/calculators"
            className="block text-center text-sm text-[#007AFF] hover:text-[#0051D5] transition-colors"
          >
            Try our free tax calculator
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-xs text-gray-400">
          <p>&copy; 2026 ProcessX. Simple bookkeeping for everyone.</p>
        </div>
      </div>
    </div>
  )
}
