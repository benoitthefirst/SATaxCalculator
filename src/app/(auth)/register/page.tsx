import RegisterForm from '@/components/forms/RegisterForm'
import Link from 'next/link'

export const metadata = {
  title: 'Create Account - ProcessX',
  description: 'Create your ProcessX account',
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 py-12">
      <div className="w-full max-w-[480px]">
        {/* Logo */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#007AFF] to-[#0051D5] mb-6 shadow-lg shadow-blue-500/30">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-3xl font-semibold text-gray-900 mb-2 tracking-tight">Create account</h1>
          <p className="text-base text-gray-500">Start managing your business finances</p>
        </div>

        {/* Register Form */}
        <div className="space-y-6">
          <RegisterForm />

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
