import LoginForm from '@/components/forms/LoginForm'
import Link from 'next/link'

export const metadata = {
  title: 'Sign in - ProcessX',
  description: 'Sign in to your ProcessX account',
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">ProcessX</h1>
          <p className="text-gray-600">Bookkeeping made simple</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Sign in</h2>
          <LoginForm />
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/calculators"
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            Try our free tax calculator
          </Link>
        </div>
      </div>
    </div>
  )
}
