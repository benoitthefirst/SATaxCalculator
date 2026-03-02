import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import ChangePasswordForm from '@/components/forms/ChangePasswordForm'
import Link from 'next/link'

export const metadata = {
  title: 'Change Password - ProcessX',
  description: 'Change your account password',
}

export default async function ChangePasswordPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/login')
  }

  return (
    <div className="max-w-2xl space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <Link href="/settings" className="text-blue-600 hover:text-blue-700">
          Settings
        </Link>
        <span className="text-gray-400">/</span>
        <span className="text-gray-600">Change Password</span>
      </div>

      <div>
        <h1 className="text-3xl font-bold text-gray-900">Change Password</h1>
        <p className="mt-1 text-sm text-gray-600">
          Update your password to keep your account secure
        </p>
      </div>

      <div className="bg-white shadow rounded-2xl p-6">
        <ChangePasswordForm />
      </div>

      {/* Security Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">
          Password Security Tips
        </h3>
        <ul className="space-y-1 text-sm text-blue-800">
          <li>• Use a unique password that you don't use for other accounts</li>
          <li>• Include a mix of letters, numbers, and special characters</li>
          <li>• Avoid using personal information like your name or birthday</li>
          <li>• Consider using a password manager to generate and store strong passwords</li>
        </ul>
      </div>
    </div>
  )
}
